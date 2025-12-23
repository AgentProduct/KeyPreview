import { useState } from "react";
import { encryptData, decryptData } from "../modules/keys/keys";

interface KeysTabProps {
  modulusLength: number;
  generatedKeyPair: { publicKey: string; privateKey: string } | null;
  onModulusLengthChange: (length: number) => void;
  onGenerateKeyPair: () => void;
  onExportKeyPair: () => void;
}

export default function KeysTab({
  modulusLength,
  generatedKeyPair,
  onModulusLengthChange,
  onGenerateKeyPair,
  onExportKeyPair,
}: KeysTabProps) {
  const [selectedKeyType, setSelectedKeyType] = useState<"public" | "private">(
    "public"
  );
  const [operationType, setOperationType] = useState<"encrypt" | "decrypt">(
    "encrypt"
  );
  const [inputData, setInputData] = useState<string>("");
  const [outputData, setOutputData] = useState<string>("");
  const [operationError, setOperationError] = useState<string>("");
  const [operationSuccess, setOperationSuccess] = useState<string>("");

  // 处理加密操作
  const handleEncrypt = async () => {
    if (!generatedKeyPair) {
      setOperationError("请先生成密钥对");
      setOperationSuccess("");
      return;
    }

    if (!inputData.trim()) {
      setOperationError("请输入要加密的数据");
      setOperationSuccess("");
      return;
    }

    try {
      setOperationError("");
      const result = await encryptData(inputData, generatedKeyPair.publicKey);
      if (result.isValid && result.result) {
        setOutputData(result.result);
        setOperationSuccess("加密成功");
      } else {
        setOperationError(result.error || "加密失败");
        setOutputData("");
      }
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : "加密失败");
      setOutputData("");
    }
  };

  // 处理解密操作
  const handleDecrypt = async () => {
    if (!generatedKeyPair) {
      setOperationError("请先生成密钥对");
      setOperationSuccess("");
      return;
    }

    if (!inputData.trim()) {
      setOperationError("请输入要解密的数据");
      setOperationSuccess("");
      return;
    }

    try {
      setOperationError("");
      const result = await decryptData(inputData, generatedKeyPair.privateKey);
      if (result.isValid && result.result) {
        setOutputData(result.result);
        setOperationSuccess("解密成功");
      } else {
        setOperationError(result.error || "解密失败");
        setOutputData("");
      }
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : "解密失败");
      setOutputData("");
    }
  };

  // 处理加密解密操作
  const handleOperation = () => {
    if (operationType === "encrypt") {
      handleEncrypt();
    } else {
      handleDecrypt();
    }
  };

  return (
    <div className="keys-tab-container">
      <div className="option-container">
        {/* 密钥长度选择 */}
        <div className="option-group">
          <label>密钥长度：</label>
          <select
            value={modulusLength}
            onChange={(e) => onModulusLengthChange(Number(e.target.value))}
            className="keys-modulus-select"
          >
            <option value={1024}>1024位</option>
            <option value={2048}>2048位</option>
            <option value={4096}>4096位</option>
          </select>
        </div>

        {/* 操作按钮 */}
        <div className="button-group">
          <button onClick={onGenerateKeyPair} className="keys-generate-button">
            生成密钥对
          </button>
          {generatedKeyPair && (
            <button onClick={onExportKeyPair} className="keys-export-button">
              导出密钥对
            </button>
          )}
        </div>
      </div>

      {/* 密钥显示区域 */}
      {generatedKeyPair && (
        <div className="keys-display-container">
          <div className="keys-type-tabs">
            <button
              className={`keys-type-tab ${selectedKeyType === "public" ? "active" : ""}`}
              onClick={() => setSelectedKeyType("public")}
            >
              公钥
            </button>
            <button
              className={`keys-type-tab ${selectedKeyType === "private" ? "active" : ""}`}
              onClick={() => setSelectedKeyType("private")}
            >
              私钥
            </button>
          </div>

          <div className="keys-textarea-container">
            <textarea
              value={
                selectedKeyType === "public"
                  ? generatedKeyPair.publicKey
                  : generatedKeyPair.privateKey
              }
              readOnly
              className="keys-key-textarea"
              placeholder={`${selectedKeyType === "public" ? "公钥" : "私钥"}将显示在这里...`}
            />
          </div>
        </div>
      )}

      {/* 加密解密操作区域 */}
      <div className="keys-operations-container">
        <h3>加密解密操作</h3>

        <div className="option-group">
          <label>操作类型：</label>
          <select
            value={operationType}
            onChange={(e) =>
              setOperationType(e.target.value as "encrypt" | "decrypt")
            }
            className="keys-operation-select"
          >
            <option value="encrypt">加密</option>
            <option value="decrypt">解密</option>
          </select>
        </div>

        <div className="keys-input-container">
          <label>
            {operationType === "encrypt" ? "加密数据：" : "解密数据："}
          </label>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="keys-operation-textarea"
            placeholder={
              operationType === "encrypt"
                ? "请输入要加密的数据..."
                : "请输入要解密的Base64编码数据..."
            }
            rows={4}
          />
        </div>

        <div className="button-group">
          <button onClick={handleOperation} className="keys-operation-button">
            {operationType === "encrypt" ? "加密" : "解密"}
          </button>
        </div>

        {/* 操作结果 */}
        {operationError && (
          <div className="error-message">{operationError}</div>
        )}
        {operationSuccess && (
          <div className="success-message">{operationSuccess}</div>
        )}

        {/* 结果显示 */}
        {outputData && (
          <div className="keys-output-container">
            <label>结果：</label>
            <textarea
              value={outputData}
              readOnly
              className="keys-operation-textarea"
              placeholder="结果将显示在这里..."
              rows={4}
            />
          </div>
        )}
      </div>

      {/* 功能说明 */}
      <div className="keys-info-container">
        <h3>功能说明：</h3>
        <p>支持生成1024/2048/4096位RSA密钥对</p>
        <p>生成的密钥采用PEM格式</p>
        <p>公钥用于加密数据，私钥用于解密数据</p>
        <p>支持使用生成的密钥对进行加密解密操作</p>
        <p>加密结果使用Base64编码</p>
      </div>
    </div>
  );
}
