type Tab = "encrypt" | "format" | "jwt" | "regex" | "keys";

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
    </div>
  );
}
