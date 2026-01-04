import React from "react";
import type { ShadowConfig } from "./cssUtils";
import "./ShadowPanel.css";

interface ShadowPanelProps {
  shadows: ShadowConfig[];
  onChange: (shadows: ShadowConfig[]) => void;
  previewShape: 'rectangle' | 'text';
}

const ShadowPanel: React.FC<ShadowPanelProps> = ({ shadows, onChange, previewShape }) => {
  // 更新阴影属性
  const handlePropertyChange = (
    index: number,
    property: keyof ShadowConfig,
    value: string | number | boolean
  ) => {
    const newShadows = [...shadows];
    newShadows[index] = { ...newShadows[index], [property]: value };
    onChange(newShadows);
  };

  // 添加阴影
  const handleAddShadow = () => {
    const newShadow: ShadowConfig = {
      type: previewShape === 'text' ? 'text' : 'box',
      offsetX: 5,
      offsetY: 5,
      blurRadius: 10,
      spreadRadius: 0,
      color: "rgba(0, 0, 0, 0.5)",
      inset: false
    };
    onChange([...shadows, newShadow]);
  };

  // 删除阴影
  const handleRemoveShadow = (index: number) => {
    if (shadows.length <= 1) {
      alert("至少需要一个阴影");
      return;
    }
    const newShadows = shadows.filter((_, i) => i !== index);
    onChange(newShadows);
  };

  return (
    <div className="shadow-panel">
      {shadows.map((shadow, index) => (
        <div key={index} className="shadow-config">
          <h3>阴影 {index + 1}{shadow.inset ? ' (内阴影)' : ''}</h3>

          <div className="control-group">
            <label>水平偏移 (offsetX)：</label>
            <input
              type="range"
              min="-50"
              max="50"
              value={shadow.offsetX}
              onChange={(e) => handlePropertyChange(index, "offsetX", parseInt(e.target.value))}
            />
            <span>{shadow.offsetX}px</span>
          </div>

          <div className="control-group">
            <label>垂直偏移 (offsetY)：</label>
            <input
              type="range"
              min="-50"
              max="50"
              value={shadow.offsetY}
              onChange={(e) => handlePropertyChange(index, "offsetY", parseInt(e.target.value))}
            />
            <span>{shadow.offsetY}px</span>
          </div>

          <div className="control-group">
            <label>模糊半径 (blurRadius)：</label>
            <input
              type="range"
              min="0"
              max="100"
              value={shadow.blurRadius}
              onChange={(e) => handlePropertyChange(index, "blurRadius", parseInt(e.target.value))}
            />
            <span>{shadow.blurRadius}px</span>
          </div>

          {shadow.type === "box" && (
            <div className="control-group">
              <label>扩散半径 (spreadRadius)：</label>
              <input
                type="range"
                min="-20"
                max="50"
                value={shadow.spreadRadius}
                onChange={(e) => handlePropertyChange(index, "spreadRadius", parseInt(e.target.value))}
              />
              <span>{shadow.spreadRadius}px</span>
            </div>
          )}

          {shadow.type === "box" && (
            <div className="control-group inset-shadow-control">
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: 'bold', color: '#333', justifyContent: 'center' }}>
                <input
                  type="checkbox"
                  checked={shadow.inset}
                  onChange={(e) => handlePropertyChange(index, "inset", e.target.checked)}
                  style={{ width: '18px', height: '18px', marginRight: '8px', cursor: 'pointer' }}
                />
                <span>内阴影 (inset)</span>
              </label>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                创建元素内部的阴影效果
              </div>
            </div>
          )}
          {/* 文本阴影不支持内阴影 */}

          <div className="control-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <label style={{ margin: 0 }}>颜色：</label>
              <input
                type="color"
                value={(() => {
                  // 将rgba/rgb颜色转换为十六进制
                  if (shadow.color.startsWith('rgb')) {
                    const match = shadow.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                    if (match) {
                      const r = parseInt(match[1]).toString(16).padStart(2, '0');
                      const g = parseInt(match[2]).toString(16).padStart(2, '0');
                      const b = parseInt(match[3]).toString(16).padStart(2, '0');
                      return `#${r}${g}${b}`;
                    }
                  }
                  return shadow.color.startsWith('#') ? shadow.color : '#000000';
                })()}
                onChange={(e) => {
                  // 将颜色转换为rgba格式以保持透明度
                  const hex = e.target.value;
                  const r = parseInt(hex.slice(1, 3), 16);
                  const g = parseInt(hex.slice(3, 5), 16);
                  const b = parseInt(hex.slice(5, 7), 16);

                  // 使用正则表达式可靠地提取alpha值
                  let alpha = 0.5; // 默认值
                  const alphaMatch = shadow.color.match(/[\d.]+(?=\)$)/);
                  if (alphaMatch) {
                    alpha = parseFloat(alphaMatch[0]);
                  }

                  handlePropertyChange(index, "color", `rgba(${r}, ${g}, ${b}, ${alpha})`);
                }}
              />
            </div>
            <input
              type="text"
              value={shadow.color}
              onChange={(e) => handlePropertyChange(index, "color", e.target.value)}
              placeholder="如：rgba(0, 0, 0, 0.5)"
              className="color-input"
            />
          </div>

          <button
            className="remove-shadow"
            onClick={() => handleRemoveShadow(index)}
          >
            删除阴影
          </button>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
        <button className="add-shadow" onClick={handleAddShadow}>
          {previewShape !== 'text' ? '添加外阴影' : '添加阴影'}
        </button>
        {previewShape !== 'text' && (
          <button className="add-shadow add-inner-shadow" onClick={() => {
            const newInnerShadow: ShadowConfig = {
              type: 'box',
              offsetX: 3,
              offsetY: 3,
              blurRadius: 5,
              spreadRadius: 0,
              color: "rgba(0, 0, 0, 0.5)",
              inset: true
            };
            onChange([...shadows, newInnerShadow]);
          }}>
            添加内阴影
          </button>
        )}
      </div>
    </div>
  );
};

export default ShadowPanel;