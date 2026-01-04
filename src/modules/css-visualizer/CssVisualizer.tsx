// Updated CssVisualizer.tsx with bug fixes and interaction optimizations
import React, { useState, useEffect } from "react";
import GradientPanel from "./GradientPanel";
import ShadowPanel from "./ShadowPanel";
import { generateGradientCSS, generateMultipleShadowsCSS, formatCSSCode } from "./cssUtils";
import type { GradientConfig, ShadowConfig } from "./cssUtils";
import "./CssVisualizer.css";
import { gradientPresets } from './GradientPanel';

const CssVisualizer: React.FC = () => {
  // 生成唯一ID
  const generateUniqueId = () => {
    return `stop-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  // 渐变配置状态
  const [gradientConfig, setGradientConfig] = useState<GradientConfig>(gradientPresets[0]);

  // 阴影配置状态
  const [shadows, setShadows] = useState<ShadowConfig[]>([
    {
      type: "box",
      offsetX: 5,
      offsetY: 5,
      blurRadius: 10,
      spreadRadius: 0,
      color: "rgba(0, 0, 0, 0.5)",
      inset: false
    }
  ]);

  // 活动面板
  const [activePanel, setActivePanel] = useState<"gradient" | "shadow">(
    "gradient"
  );

  // 预览元素形状
  const [previewShape, setPreviewShape] = useState<"rectangle" | "text">("rectangle");

  // 优化交互：当切换预览形状时，自动调整阴影类型（text-shadow 或 box-shadow），并重置不兼容属性
  useEffect(() => {
    const newShadows = shadows.map(s => ({
      ...s,
      type: previewShape === 'text' ? 'text' : 'box',
      inset: previewShape === 'text' ? false : s.inset, // text-shadow 不支持 inset
      spreadRadius: previewShape === 'text' ? 0 : s.spreadRadius // text-shadow 不支持 spreadRadius
    }));
    setShadows(newShadows);
  }, [previewShape]);

  // 生成最终CSS代码（修复bug：为文本渐变添加 background-clip 和 color: transparent；为阴影面板下的文本添加默认颜色）
  const generateFinalCSS = () => {
    const gradientCSS = generateGradientCSS(gradientConfig);
    const shadowsCSS = generateMultipleShadowsCSS(shadows);
    
    let shapeCSS = '';
    let additionalCSS = '';

    if (previewShape === 'text') {
      shapeCSS = '  border: none;\n  box-shadow: none;\n  font-size: 48px;\n  font-weight: 900;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n';
      
      if (activePanel === 'gradient') {
        additionalCSS = '  background-clip: text;\n  -webkit-background-clip: text;\n  color: transparent;\n';
      } else {
        additionalCSS = '  color: #ffffff;\n'; // 默认白色以匹配预览，确保文本可见以显示 text-shadow
      }
    }

    // 根据活动面板决定是否包含渐变背景
    const backgroundCSS = activePanel === 'gradient' ? `  background: ${gradientCSS};\n` : '';
    
    const rawCSS = `.element {\n${backgroundCSS}${additionalCSS}${shadowsCSS}${shapeCSS}}`;
    
    return formatCSSCode(rawCSS);
  };

  // 生成阴影值
  const boxShadowValue = shadows
    .filter(s => s.type === 'box')
    .map(s => `${s.inset ? 'inset ' : ''}${s.offsetX}px ${s.offsetY}px ${s.blurRadius}px ${s.spreadRadius}px ${s.color}`)
    .join(', ');
  
  const textShadowValue = shadows
    .filter(s => s.type === 'text')
    .map(s => `${s.offsetX}px ${s.offsetY}px ${s.blurRadius}px ${s.color}`)
    .join(', ');
  
  // 定义预览样式（修复bug：仅在渐变面板且文本形状时设置 color: transparent 和 background-clip: text）
  const previewStyle: React.CSSProperties = {
    background: activePanel === 'gradient' ? generateGradientCSS(gradientConfig) : 'transparent',
    backgroundClip: (previewShape === 'text' && activePanel === 'gradient') ? 'text' : 'border-box',
    WebkitBackgroundClip: (previewShape === 'text' && activePanel === 'gradient') ? 'text' : 'border-box',
    color: previewShape === 'text' 
      ? (activePanel === 'gradient' ? 'transparent' : '#ffffff') // 阴影面板下确保文本可见
      : undefined,
    boxShadow: previewShape === 'rectangle' ? boxShadowValue : 'none',
    textShadow: previewShape === 'text' ? textShadowValue : 'none',
    borderRadius: undefined,
    transform: undefined,
    fontSize: previewShape === 'text' ? '48px' : undefined,
    fontWeight: previewShape === 'text' ? 900 : undefined,
    display: previewShape === 'text' ? 'flex' : undefined,
    alignItems: previewShape === 'text' ? 'center' : undefined,
    justifyContent: previewShape === 'text' ? 'center' : undefined,
    border: previewShape === 'text' ? 'none' : undefined
  };

  return (
    <div className="css-visualizer">
      <div className="visualizer-tabs">
        <button
          className={activePanel === "gradient" ? "active" : ""}
          onClick={() => {
            setActivePanel("gradient");
            // 重置渐变效果相关数据
            setPreviewShape("rectangle");
          }}
        >
          🌈 渐变效果
        </button>
        <button
          className={activePanel === "shadow" ? "active" : ""}
          onClick={() => setActivePanel("shadow")}
        >
          🌑 阴影效果
        </button>
      </div>

      <div className="visualizer-content">
        {activePanel === "gradient" ? (
          <GradientPanel
            config={gradientConfig}
            onChange={setGradientConfig}
          />
        ) : (
          <ShadowPanel
            shadows={shadows}
            onChange={setShadows}
            previewShape={previewShape} // 传递 previewShape 以便 ShadowPanel 内部使用
          />
        )}

        <div className="preview-section">
          <h3>实时预览</h3>
          {activePanel === 'shadow' && (
          <div className="preview-shape-controls">
            <button
              className={previewShape === "rectangle" ? "active" : ""}
              onClick={() => setPreviewShape("rectangle")}
            >
              矩形
            </button>
            <button
              className={previewShape === "text" ? "active" : ""}
              onClick={() => setPreviewShape("text")}
            >
              文本
            </button>
          </div>
          )}
          
          <div
            className={`preview-element ${previewShape === 'text' ? 'shape-text' : ''} ${shadows.some(s => s.type === 'box' && s.inset) ? 'has-inset-shadow' : ''}`}
            style={previewStyle}
          >
            {previewShape === 'text' ? 'CSS 效果预览' : 'CSS 效果预览'}
          </div>

          <div className="css-code-section">
            <div className="css-output-container">
              <pre className="css-code">{generateFinalCSS()}</pre>
              <button
                className="copy-button"
                onClick={async (event) => {
                  const button = event.currentTarget as HTMLButtonElement | null;
                  if (!button) return;
                  try {
                    await navigator.clipboard.writeText(generateFinalCSS());
                    button.classList.add('copied');
                    button.textContent = '复制成功';
                    setTimeout(() => {
                      button.classList.remove('copied');
                      button.textContent = '复制代码';
                    }, 2000);
                  } catch (error) {
                    console.error('复制失败:', error);
                    button.classList.add('error');
                    button.textContent = '复制失败';
                    setTimeout(() => {
                      button.classList.remove('error');
                      button.textContent = '复制代码';
                    }, 2000);
                  }
                }}
              >
                复制代码
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CssVisualizer;