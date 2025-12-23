interface TextAreaPanelProps {
  input: string;
  output: string;
  onInputChange: (val: string) => void;

  readonlyOutput?: boolean;
  error?: string;
  placeholderInput?: string;
  placeholderOutput?: string;
}

import { useEffect, useRef } from "react";

export default function TextAreaPanel({
  input,
  output,
  onInputChange,
  readonlyOutput = true,
  error,
  placeholderInput = "请输入内容",
  placeholderOutput = "结果输出",
}: TextAreaPanelProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // 设置最小高度，允许用户手动调整大小
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.minHeight = "300px";
    }
    if (outputRef.current) {
      outputRef.current.style.minHeight = "300px";
    }
  }, []);

  return (
    <div className="tool-body">
      <div className="textarea-wrapper">
        <textarea
          ref={inputRef}
          value={input}
          placeholder={placeholderInput}
          onChange={(e) => onInputChange(e.target.value)}
          style={{ minHeight: "300px", overflowY: "auto" }}
        />
      </div>

      <div className="textarea-wrapper">
        <textarea
          ref={outputRef}
          value={output}
          readOnly={readonlyOutput}
          placeholder={placeholderOutput}
          style={{ minHeight: "300px", overflowY: "auto" }}
        />
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}
