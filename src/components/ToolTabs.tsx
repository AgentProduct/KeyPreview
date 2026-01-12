type Tab = "encrypt" | "format" | "jwt" | "regex" | "keys" | "color" | "css" | "qrcode" | "websocket";

export default function ToolTabs({
  value,
  onChange,
}: {
  value: Tab;
  onChange: (v: Tab) => void;
}) {
  return (
    <div className="tool-tabs">
      <button
        className={value === "encrypt" ? "active" : ""}
        onClick={() => onChange("encrypt")}
      >
        🔐 加解密
      </button>
      <button
        className={value === "format" ? "active" : ""}
        onClick={() => onChange("format")}
      >
        🧹 格式化
      </button>
      <button
        className={value === "jwt" ? "active" : ""}
        onClick={() => onChange("jwt")}
      >
        📜 JWT
      </button>
      <button
        className={value === "regex" ? "active" : ""}
        onClick={() => onChange("regex")}
      >
        🔍 正则表达式
      </button>
      <button
        className={value === "keys" ? "active" : ""}
        onClick={() => onChange("keys")}
      >
        🔑 非对称密钥对
      </button>
      <button
        className={value === "color" ? "active" : ""}
        onClick={() => onChange("color")}
      >
        🎨 颜色转换
      </button>
      <button
        className={value === "css" ? "active" : ""}
        onClick={() => onChange("css")}
      >
        🌈 渐变
      </button>
      <button
        className={value === "qrcode" ? "active" : ""}
        onClick={() => onChange("qrcode")}
      >
        📱 二维码
      </button>
      <button
        className={value === "websocket" ? "active" : ""}
        onClick={() => onChange("websocket")}
      >
        🌐 WebSocket
      </button>
    </div>
  );
}
