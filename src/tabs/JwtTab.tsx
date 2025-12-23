import { useState } from "react";
import {
  supportedAlgorithms,
  decodeJwt,
  generateJwt,
  verifyJwt,
  processJwtPayload,
} from "../modules/jwt/jwt";
import { generateKeyPair } from "../modules/keys/keys";

type JwtOperation = "decode" | "encode";

export default function JwtTab() {
  const [operation, setOperation] = useState<JwtOperation>("decode");
  const [algorithm, setAlgorithm] = useState("HS256");
  const [secret, setSecret] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [inputPayload, setInputPayload] = useState(
    JSON.stringify(
      { sub: "1234567890", name: "John Doe", iat: 1516239022 },
      null,
      2
    )
  );
  const [outputToken, setOutputToken] = useState("");
  const [outputDecoded, setOutputDecoded] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "error" | "info" | ""
  >("");

  const handleDecode = async () => {
    if (!inputToken.trim()) {
      setStatusMessage("请输入JWT令牌");
      setStatusType("error");
      return;
    }

    try {
      const decoded = decodeJwt(inputToken);
      // 处理载荷中的时间戳字段
      const processedPayload = processJwtPayload(decoded.payload);
      const processedDecoded = {
        ...decoded,
        payload: processedPayload,
      };
      setOutputDecoded(JSON.stringify(processedDecoded, null, 2));
      setStatusMessage("解码成功");
      setStatusType("success");

      // 如果提供了公钥，验证签名
      if (publicKey.trim()) {
        const isValid = await verifyJwt(inputToken, {
          publicKey,
          algorithm: decoded.header.alg,
        });
        if (isValid) {
          setStatusMessage("解码成功，签名验证通过");
        } else {
          setStatusMessage("解码成功，但签名验证失败");
          setStatusType("info");
        }
      }
    } catch (error) {
      setStatusMessage(
        `解码失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
      setStatusType("error");
    }
  };

  const handleEncode = async () => {
    if (!inputPayload.trim()) {
      setStatusMessage("请输入JWT载荷");
      setStatusType("error");
      return;
    }

    try {
      const payload = JSON.parse(inputPayload);
      let jwt;

      if (algorithm.startsWith("HS")) {
        if (!secret.trim()) {
          setStatusMessage("HMAC算法需要密钥");
          setStatusType("error");
          return;
        }
        jwt = await generateJwt(payload, { secret, algorithm });
      } else {
        if (!privateKey.trim()) {
          setStatusMessage("RSA/ECDSA算法需要私钥");
          setStatusType("error");
          return;
        }
        jwt = await generateJwt(payload, { privateKey, algorithm });
      }

      setOutputToken(jwt);
      setStatusMessage("编码成功");
      setStatusType("success");
    } catch (error) {
      setStatusMessage(
        `编码失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
      setStatusType("error");
    }
  };

  const handleClear = () => {
    setInputToken("");
    setInputPayload(
      JSON.stringify(
        { sub: "1234567890", name: "John Doe", iat: 1516239022 },
        null,
        2
      )
    );
    setOutputToken("");
    setOutputDecoded("");
    setStatusMessage("");
    setStatusType("");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setStatusMessage("已复制到剪贴板");
    setStatusType("success");
  };

  const handleGenerateKeyPair = async () => {
    try {
      setStatusMessage("正在生成密钥对...");
      setStatusType("info");

      const keyPair = await generateKeyPair();
      setPrivateKey(keyPair.privateKey);
      setPublicKey(keyPair.publicKey);

      setStatusMessage("密钥对生成成功");
      setStatusType("success");
    } catch (error) {
      setStatusMessage(
        `生成密钥对失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
      setStatusType("error");
    }
  };

  return (
    <div className="jwt-container">
      {/* 操作选择和控制区域 */}
      <div className="jwt-controls">
        <div className="jwt-options">
          <div className="jwt-option-group">
            <label htmlFor="operation-select">操作：</label>
            <select
              id="operation-select"
              value={operation}
              onChange={(e) => {
                setOperation(e.target.value as JwtOperation);
                handleClear();
              }}
              className="jwt-select"
            >
              <option value="decode">解码</option>
              <option value="encode">编码</option>
            </select>
          </div>

          {operation === "encode" && (
            <div className="jwt-option-group">
              <label htmlFor="algorithm-select">算法：</label>
              <select
                id="algorithm-select"
                value={algorithm}
                onChange={(e) => {
                  setAlgorithm(e.target.value);
                  handleClear();
                }}
                className="jwt-select"
              >
                {supportedAlgorithms.map((alg) => (
                  <option key={alg} value={alg}>
                    {alg}
                  </option>
                ))}
              </select>
            </div>
          )}

          {algorithm.startsWith("HS") && operation === "encode" && (
            <div className="jwt-option-group">
              <label htmlFor="secret-input">HMAC密钥：</label>
              <input
                id="secret-input"
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="请输入HMAC密钥"
                className="jwt-secret-input"
              />
            </div>
          )}

          {algorithm.startsWith("RS") && operation === "encode" && (
            <div className="jwt-option-group">
              <label htmlFor="private-key-textarea">RSA私钥（PEM/JWK）：</label>
              <textarea
                id="private-key-textarea"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="请输入RSA私钥（PEM格式或JWK格式）"
                className="jwt-key-textarea"
                rows={6}
              />
              <button
                className="jwt-generate-keys-button"
                onClick={handleGenerateKeyPair}
              >
                生成RSA密钥对
              </button>
            </div>
          )}

          {operation === "decode" && (
            <div className="jwt-option-group">
              <label htmlFor="public-key-textarea">
                公钥（可选，PEM/JWK）：
              </label>
              <textarea
                id="public-key-textarea"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="请输入公钥以验证签名（PEM格式或JWK格式）"
                className="jwt-key-textarea"
                rows={6}
              />
              <button
                className="jwt-generate-keys-button"
                onClick={handleGenerateKeyPair}
              >
                生成RSA密钥对
              </button>
            </div>
          )}
        </div>

        <div className="jwt-button-group">
          <button
            className="jwt-button primary"
            onClick={operation === "decode" ? handleDecode : handleEncode}
          >
            {operation === "decode" ? "解码" : "编码"}
          </button>
          <button className="jwt-button secondary" onClick={handleClear}>
            清空
          </button>
        </div>
      </div>

      {/* 状态消息区域 */}
      {statusMessage && (
        <div className={`jwt-status-message ${statusType}`}>
          {statusMessage}
        </div>
      )}

      {/* 输入输出区域 */}
      <div className="jwt-main-content">
        {/* 输入区域 */}
        <div className="jwt-panel">
          <div className="jwt-panel-header">
            <h3>{operation === "decode" ? "输入JWT令牌" : "输入JWT载荷"}</h3>
          </div>
          <div className="jwt-panel-content">
            {operation === "decode" ? (
              <textarea
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="请输入JWT令牌"
                className="jwt-textarea"
                rows={10}
              />
            ) : (
              <textarea
                value={inputPayload}
                onChange={(e) => setInputPayload(e.target.value)}
                placeholder="请输入JSON格式的JWT载荷"
                className="jwt-textarea"
                rows={10}
              />
            )}
          </div>
        </div>

        {/* 输出区域 */}
        <div className="jwt-panel">
          <div className="jwt-panel-header">
            <h3>{operation === "decode" ? "解码结果" : "生成的JWT令牌"}</h3>
            {operation === "decode"
              ? outputDecoded && (
                  <button
                    className="jwt-copy-button"
                    onClick={() => handleCopy(outputDecoded)}
                  >
                    复制
                  </button>
                )
              : outputToken && (
                  <button
                    className="jwt-copy-button"
                    onClick={() => handleCopy(outputToken)}
                  >
                    复制
                  </button>
                )}
          </div>
          <div className="jwt-panel-content">
            {operation === "decode" ? (
              <textarea
                value={outputDecoded}
                readOnly
                placeholder="解码结果将显示在这里"
                className="jwt-textarea output"
                rows={10}
              />
            ) : (
              <textarea
                value={outputToken}
                readOnly
                placeholder="生成的JWT令牌将显示在这里"
                className="jwt-textarea output"
                rows={10}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
