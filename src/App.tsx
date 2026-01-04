import { useState } from "react";
import "./App.css";
import "./styles/theme.css";
import ToolTabs from "./components/ToolTabs";
import TextAreaPanel from "./components/TextAreaPanel";
import D3Background from "./components/D3Background";

// 导入加密模块
import {
  base64Encode,
  base64Decode,
  urlEncode,
  urlDecode,
  md5,
  aesEncrypt,
  aesDecrypt,
} from "./modules/encrypt";

// 导入格式化模块
import { formatJSON, formatHTML, formatCSS } from "./modules/format";

// 导入JWT模块
import { decodeJwt, generateJwt, supportedAlgorithms } from "./modules/jwt/jwt";

// 导入正则表达式模块
import {
  testRegex,
  replaceRegex,
  formatMatchResults,
} from "./modules/regex/regex";
import RegexTab from "./tabs/RegexTab";

// 导入非对称密钥对模块
import { generateKeyPair } from "./modules/keys/keys";
import KeysTab from "./tabs/KeysTab";
import ColorTab from "./tabs/ColorTab";
import CssTab from "./tabs/CssTab";

type TabType = "encrypt" | "format" | "jwt" | "regex" | "keys" | "color" | "css";
type EncryptType = "base64" | "url" | "md5" | "aes";
type FormatType = "json" | "html" | "css";
type JwtOperation = "decode" | "encode";

function App() {
  // 状态管理
  const [activeTab, setActiveTab] = useState<TabType>("encrypt");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 加密模块状态
  const [encryptType, setEncryptType] = useState<EncryptType>("base64");
  const [encryptKey, setEncryptKey] = useState("");
  const [isEncodeMode, setIsEncodeMode] = useState(true);

  // 格式化模块状态
  const [formatType, setFormatType] = useState<FormatType>("json");

  // JWT模块状态
  const [jwtOperation, setJwtOperation] = useState<JwtOperation>("decode");
  const [jwtAlgorithm, setJwtAlgorithm] = useState("HS256");
  const [jwtSecret, setJwtSecret] = useState("");
  const [jwtPublicKey, setJwtPublicKey] = useState("");
  const [jwtPrivateKey, setJwtPrivateKey] = useState("");

  // 正则表达式模块状态
  const [regexOperation, setRegexOperation] = useState<"test" | "replace">(
    "test"
  );
  const [regexPattern, setRegexPattern] = useState("");
  const [regexReplacementText, setRegexReplacementText] = useState("");
  const [regexOptions, setRegexOptions] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false,
  });

  // 非对称密钥对模块状态
  const [modulusLength, setModulusLength] = useState<number>(2048);
  const [generatedKeyPair, setGeneratedKeyPair] = useState<{
    publicKey: string;
    privateKey: string;
  } | null>(null);

  // 处理加密操作
  const handleEncrypt = () => {
    try {
      setError("");
      setSuccess("");
      let result: string;

      switch (encryptType) {
        case "base64":
          result = isEncodeMode
            ? base64Encode(inputText)
            : base64Decode(inputText);
          break;
        case "url":
          result = isEncodeMode ? urlEncode(inputText) : urlDecode(inputText);
          break;
        case "md5":
          result = md5(inputText);
          break;
        case "aes":
          if (!encryptKey) {
            throw new Error("AES加密需要密钥");
          }
          result = isEncodeMode
            ? aesEncrypt(inputText, encryptKey)
            : aesDecrypt(inputText, encryptKey);
          break;
        default:
          throw new Error("不支持的加密类型");
      }

      setOutputText(result);
      setSuccess("操作成功");
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败");
    }
  };

  // 处理格式化操作
  const handleFormat = async () => {
    try {
      setError("");
      setSuccess("");
      let result: string;

      switch (formatType) {
        case "json":
          result = formatJSON(inputText);
          break;
        case "html":
          result = await formatHTML(inputText);
          break;
        case "css":
          result = await formatCSS(inputText);
          break;
        default:
          throw new Error("不支持的格式化类型");
      }

      setOutputText(result);
      setSuccess("格式化成功");
    } catch (err) {
      setError(err instanceof Error ? err.message : "格式化失败");
    }
  };

  // 处理JWT操作
  const handleJwtOperation = async () => {
    try {
      setError("");
      setSuccess("");
      let result: string;

      if (jwtOperation === "decode") {
        const decoded = decodeJwt(inputText);
        result = JSON.stringify(
          {
            header: decoded.header,
            payload: decoded.payload,
            signature: decoded.signature,
          },
          null,
          2
        );
      } else {
        const payload = JSON.parse(inputText);
        let token: string;
        if (jwtAlgorithm.startsWith("HS")) {
          if (!jwtSecret) {
            throw new Error("HMAC算法需要密钥");
          }
          token = await generateJwt(payload, {
            secret: jwtSecret,
            algorithm: jwtAlgorithm,
          });
          result = JSON.stringify(
            {
              token,
              algorithm: jwtAlgorithm,
              hmacSecret: jwtSecret,
            },
            null,
            2
          );
        } else {
          if (!jwtPrivateKey) {
            throw new Error("RSA/ECDSA算法需要私钥");
          }
          token = await generateJwt(payload, {
            privateKey: jwtPrivateKey,
            algorithm: jwtAlgorithm,
          });
          result = JSON.stringify(
            {
              token,
              algorithm: jwtAlgorithm,
              privateKey: jwtPrivateKey,
              publicKey: jwtPublicKey,
            },
            null,
            2
          );
        }
      }

      setOutputText(result);
      setSuccess("操作成功");
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败");
    }
  };

  // 处理正则表达式操作
  const handleRegexOperation = () => {
    try {
      setError("");
      setSuccess("");
      let result: string;

      if (regexOperation === "test") {
        const testResult = testRegex(regexPattern, inputText, regexOptions);
        if (!testResult.isValid) {
          throw new Error(testResult.error || "无效的正则表达式");
        }
        result = formatMatchResults(testResult);
      } else {
        const replaceResult = replaceRegex(
          regexPattern,
          inputText,
          regexReplacementText,
          regexOptions
        );
        if (!replaceResult.isValid) {
          throw new Error(replaceResult.error || "无效的正则表达式");
        }
        result = replaceResult.result;
      }

      setOutputText(result);
      setSuccess("操作成功");
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败");
    }
  };

  // 处理输入变化
  const handleInputChange = (text: string) => {
    setInputText(text);
    setError("");
    setSuccess("");
  };

  // 处理生成密钥对
  const handleGenerateKeyPair = async () => {
    try {
      setError("");
      setSuccess("");
      const keyPair = await generateKeyPair(modulusLength);
      setGeneratedKeyPair(keyPair);
      setOutputText(JSON.stringify(keyPair, null, 2));
      setSuccess("密钥对生成成功");
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成密钥对失败");
    }
  };

  // 处理导出密钥对
  const handleExportKeyPair = () => {
    if (!generatedKeyPair) return;

    // 导出公钥
    const publicKeyBlob = new Blob([generatedKeyPair.publicKey], {
      type: "text/plain",
    });
    const publicKeyUrl = URL.createObjectURL(publicKeyBlob);
    const publicKeyLink = document.createElement("a");
    publicKeyLink.href = publicKeyUrl;
    publicKeyLink.download = `public_key_${modulusLength}.pem`;
    publicKeyLink.click();

    // 导出私钥
    const privateKeyBlob = new Blob([generatedKeyPair.privateKey], {
      type: "text/plain",
    });
    const privateKeyUrl = URL.createObjectURL(privateKeyBlob);
    const privateKeyLink = document.createElement("a");
    privateKeyLink.href = privateKeyUrl;
    privateKeyLink.download = `private_key_${modulusLength}.pem`;
    privateKeyLink.click();

    // 释放URL对象
    setTimeout(() => {
      URL.revokeObjectURL(publicKeyUrl);
      URL.revokeObjectURL(privateKeyUrl);
    }, 100);

    setSuccess("密钥对导出成功");
  };

  return (
    <div>
      <D3Background />
      <div className="tool-container">
        <div className="tool-header">
          <h1>多功能工具集</h1>
          <p>支持加解密、代码格式化和JWT操作</p>
        </div>

      <ToolTabs
        value={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          setInputText("");
          setOutputText("");
          setError("");
          setSuccess("");
        }}
      />

      {/* 加密工具 */}
      {activeTab === "encrypt" && (
        <div>
          <div className="option-container">
            <div className="option-group">
              <label>加密类型：</label>
              <select
                value={encryptType}
                onChange={(e) => setEncryptType(e.target.value as EncryptType)}
              >
                <option value="base64">Base64</option>
                <option value="url">URL Encode/Decode</option>
                <option value="md5">MD5</option>
                <option value="aes">AES</option>
              </select>
            </div>

            {encryptType !== "md5" && (
              <div className="option-group">
                <label>模式：</label>
                <select
                  value={isEncodeMode ? "encode" : "decode"}
                  onChange={(e) => setIsEncodeMode(e.target.value === "encode")}
                >
                  <option value="encode">加密</option>
                  <option value="decode">解密</option>
                </select>
              </div>
            )}

            {encryptType === "aes" && (
              <div className="option-group">
                <label>密钥：</label>
                <input
                  type="text"
                  value={encryptKey}
                  onChange={(e) => setEncryptKey(e.target.value)}
                  placeholder="请输入AES密钥"
                />
              </div>
            )}
          </div>

          <div className="button-group">
            <button onClick={handleEncrypt}>
              {encryptType === "md5" ? "生成" : isEncodeMode ? "加密" : "解密"}
            </button>
          </div>
        </div>
      )}

      {/* 格式化工具 */}
      {activeTab === "format" && (
        <div>
          <div className="option-container">
            <div className="option-group">
              <label>格式化类型：</label>
              <select
                value={formatType}
                onChange={(e) => setFormatType(e.target.value as FormatType)}
              >
                <option value="json">JSON</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </select>
            </div>
          </div>

          <div className="button-group">
            <button onClick={handleFormat}>格式化</button>
          </div>
        </div>
      )}

      {/* JWT工具 */}
      {activeTab === "jwt" && (
        <div>
          <div className="option-container">
            <div className="option-group">
              <label>操作：</label>
              <select
                value={jwtOperation}
                onChange={(e) =>
                  setJwtOperation(e.target.value as JwtOperation)
                }
              >
                <option value="decode">解码</option>
                <option value="encode">编码</option>
              </select>
            </div>

            {jwtOperation === "encode" && (
              <>
                <div className="option-group">
                  <label>算法：</label>
                  <select
                    value={jwtAlgorithm}
                    onChange={(e) => setJwtAlgorithm(e.target.value)}
                  >
                    {supportedAlgorithms.map((alg) => (
                      <option key={alg} value={alg}>
                        {alg}
                      </option>
                    ))}
                  </select>
                </div>

                {jwtAlgorithm.startsWith("HS") && (
                  <div className="option-group">
                    <label>密钥：</label>
                    <input
                      type="text"
                      value={jwtSecret}
                      onChange={(e) => setJwtSecret(e.target.value)}
                      placeholder="请输入HMAC密钥"
                    />
                  </div>
                )}

                {jwtAlgorithm.startsWith("RS") && (
                  <div className="option-group">
                    <label>私钥：</label>
                    <textarea
                      value={jwtPrivateKey}
                      onChange={(e) => setJwtPrivateKey(e.target.value)}
                      placeholder="请输入RSA私钥（JWK格式）"
                      style={{ height: "150px", overflowY: "auto" }}
                    />
                  </div>
                )}
              </>
            )}

            {jwtOperation === "decode" && (
              <div className="option-group">
                <label>公钥（可选）：</label>
                <textarea
                  value={jwtPublicKey}
                  onChange={(e) => setJwtPublicKey(e.target.value)}
                  placeholder="请输入公钥以验证签名"
                  style={{ height: "150px", overflowY: "auto" }}
                />
              </div>
            )}
          </div>

          <div className="button-group">
            <button onClick={handleJwtOperation}>
              {jwtOperation === "decode" ? "解码" : "编码"}
            </button>
          </div>
        </div>
      )}

      {/* 正则表达式工具 */}
      {activeTab === "regex" && (
        <div>
          <RegexTab
            operation={regexOperation}
            pattern={regexPattern}
            replacementText={regexReplacementText}
            options={regexOptions}
            onOperationChange={setRegexOperation}
            onPatternChange={setRegexPattern}
            onReplacementTextChange={setRegexReplacementText}
            onOptionsChange={setRegexOptions}
          />
          <div className="button-group">
            <button onClick={handleRegexOperation}>
              {regexOperation === "test" ? "匹配" : "替换"}
            </button>
          </div>
        </div>
      )}

      {/* 非对称密钥对工具 */}
      {activeTab === "keys" && (
        <div>
          <KeysTab
            modulusLength={modulusLength}
            generatedKeyPair={generatedKeyPair}
            onModulusLengthChange={setModulusLength}
            onGenerateKeyPair={handleGenerateKeyPair}
            onExportKeyPair={handleExportKeyPair}
          />
        </div>
      )}

      {/* 颜色转换工具 */}
      {activeTab === "color" && (
        <div>
          <ColorTab />
        </div>
      )}

      {/* CSS可视化调试工具 */}
      {activeTab === "css" && (
        <div>
          <CssTab />
        </div>
      )}

      {/* 输入输出面板 */}
      {!["color", "css"].includes(activeTab) && (
        <TextAreaPanel
          input={inputText}
          output={outputText}
          onInputChange={handleInputChange}
          error={error}
          activeTab={activeTab}
          placeholderInput={
            activeTab === "encrypt"
              ? `请输入要${isEncodeMode ? "加密" : "解密"}的内容`
              : activeTab === "format"
                ? "请输入要格式化的代码"
                : activeTab === "jwt"
                  ? "请输入JWT令牌或payload"
                  : "请输入要测试或替换的文本"
          }
        />
      )}

      {/* 错误和成功信息 */}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      </div>
    </div>
  );
}

export default App;
