import { type RegexOptions } from "../modules/regex/regex";

type RegexOperation = "test" | "replace";

interface RegexTabProps {
  operation: RegexOperation;
  pattern: string;
  replacementText: string;
  options: RegexOptions;
  onOperationChange: (operation: RegexOperation) => void;
  onPatternChange: (pattern: string) => void;
  onReplacementTextChange: (replacementText: string) => void;
  onOptionsChange: (options: RegexOptions) => void;
}

export default function RegexTab({
  operation,
  pattern,
  replacementText,
  options,
  onOperationChange,
  onPatternChange,
  onReplacementTextChange,
  onOptionsChange,
}: RegexTabProps) {
  return (
    <div className="regex-tab-container">
      <div className="option-container">
        {/* 操作选择 */}
        <div className="option-group">
          <label>操作：</label>
          <select
            value={operation}
            onChange={(e) =>
              onOperationChange(e.target.value as RegexOperation)
            }
            className="regex-operation-select"
          >
            <option value="test">匹配</option>
            <option value="replace">替换</option>
          </select>
        </div>

        {/* 正则表达式输入 */}
        <div className="option-group">
          <label>正则表达式：</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => onPatternChange(e.target.value)}
            placeholder="请输入正则表达式，如：\\d+"
            className="regex-pattern-input"
          />
        </div>

        {/* 替换文本输入（仅在替换模式下显示） */}
        {operation === "replace" && (
          <div className="option-group">
            <label>替换文本：</label>
            <input
              type="text"
              value={replacementText}
              onChange={(e) => onReplacementTextChange(e.target.value)}
              placeholder="请输入替换文本，支持$1, $2等分组引用"
              className="regex-replacement-input"
            />
          </div>
        )}

        {/* 正则表达式选项 */}
        <div className="option-group regex-options-group">
          <label>选项：</label>
          <div className="regex-options-grid">
            <label className="regex-option-item">
              <input
                type="checkbox"
                checked={options.global}
                onChange={(e) =>
                  onOptionsChange({ ...options, global: e.target.checked })
                }
              />
              <span>全局匹配 (g)</span>
            </label>
            <label className="regex-option-item">
              <input
                type="checkbox"
                checked={options.ignoreCase}
                onChange={(e) =>
                  onOptionsChange({ ...options, ignoreCase: e.target.checked })
                }
              />
              <span>忽略大小写 (i)</span>
            </label>
            <label className="regex-option-item">
              <input
                type="checkbox"
                checked={options.multiline}
                onChange={(e) =>
                  onOptionsChange({ ...options, multiline: e.target.checked })
                }
              />
              <span>多行匹配 (m)</span>
            </label>
            <label className="regex-option-item">
              <input
                type="checkbox"
                checked={options.dotAll}
                onChange={(e) =>
                  onOptionsChange({ ...options, dotAll: e.target.checked })
                }
              />
              <span>点匹配所有 (s)</span>
            </label>
            <label className="regex-option-item">
              <input
                type="checkbox"
                checked={options.unicode}
                onChange={(e) =>
                  onOptionsChange({ ...options, unicode: e.target.checked })
                }
              />
              <span>Unicode (u)</span>
            </label>
            <label className="regex-option-item">
              <input
                type="checkbox"
                checked={options.sticky}
                onChange={(e) =>
                  onOptionsChange({ ...options, sticky: e.target.checked })
                }
              />
              <span>粘性匹配 (y)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
