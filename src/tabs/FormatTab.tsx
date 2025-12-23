import { useState } from "react";
import { formatJSON, formatHTML, formatCSS } from "../modules/format";

type FormatType = "json" | "html" | "css";

export default function FormatTab() {
  const [type, setType] = useState<FormatType>("json");
  const [error, setError] = useState("");

  const handleFormat = () => {
    try {
      setError("");
      // 格式化操作将由父组件App.tsx处理
    } catch (err) {
      setError(err instanceof Error ? err.message : "格式化失败");
    }
  };

  return (
    <>
      <div className="option-group">
        <label>格式化类型：</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as FormatType)}
          className="format-type-select"
        >
          <option value="json">JSON</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>
      </div>

      <div className="button-group">
        <button onClick={handleFormat} className="format-button">
          格式化
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
    </>
  );
}
