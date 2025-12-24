import React, { useState } from "react";
import ColorPanel from "./ColorPanel";
import ColorPicker from "./ColorPicker";
import ColorConverter from "./ColorConverter.tsx";
import ColorInput from "./ColorInput";
import "./ColorModuleDemo.css";

const ColorModuleDemo: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState("#007bff");

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <div className="color-module-demo">
      <div className="demo-header">
        <h1>颜色模块功能演示</h1>
        <p>展示优化后的颜色选择器和转换功能</p>
      </div>

      <div className="demo-content">
        {/* 第一行：展示颜色面板 */}
        <section className="demo-section">
          <h2>1. 点击色块打开颜色选择面板</h2>
          <div className="section-content">
            <div className="panel-demo">
              <h3>颜色面板</h3>
              <div className="color-panel-wrapper">
                <ColorPanel
                  initialColor={selectedColor}
                  onChange={handleColorChange}
                />
              </div>
              <p>
                点击左侧色块可以打开完整的颜色选择面板，包含预设颜色的手风琴效果
              </p>
            </div>

            <div className="color-display">
              <h3>当前选择颜色</h3>
              <div
                className="selected-color-box"
                style={{ backgroundColor: selectedColor }}
              />
              <p className="color-code">{selectedColor}</p>
            </div>
          </div>
        </section>

        {/* 第二行：展示颜色转换器 */}
        <section className="demo-section">
          <h2>2. 颜色格式转换器</h2>
          <div className="section-content">
            <div className="converter-demo">
              <ColorConverter
                initialColor={selectedColor}
                onColorChange={handleColorChange}
              />
            </div>
            <p>
              支持 HEX、RGB、RGBA、HSL、HSB、CMYK 等多种格式的输入和实时转换
            </p>
          </div>
        </section>

        {/* 第三行：展示自定义数值输入 */}
        <section className="demo-section">
          <h2>3. 自定义数值输入</h2>
          <div className="section-content">
            <div className="input-demo">
              <ColorInput onColorChange={handleColorChange} />
            </div>
            <p>
              支持所有颜色格式的精确数值输入，包括滑块和数字输入，实时同步显示
            </p>
          </div>
        </section>

        {/* 第四行：展示优化的颜色选择器 */}
        <section className="demo-section">
          <h2>4. 优化的颜色选择器</h2>
          <div className="section-content">
            <div className="picker-demo">
              <ColorPicker
                initialColor={selectedColor}
                onChange={handleColorChange}
              />
            </div>
            <p>包含所有颜色模式的实时显示、复制功能和 RGBA 透明度调节</p>
          </div>
        </section>

        {/* 功能特性列表 */}
        <section className="demo-section">
          <h2>功能特性</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h4>🎨 多色彩模式支持</h4>
              <ul>
                <li>HEX 十六进制代码</li>
                <li>RGB 颜色模式</li>
                <li>RGBA 透明度支持</li>
                <li>HSL 色相、饱和度、亮度</li>
                <li>HSB 色相、饱和度、明度</li>
                <li>CMYK 印刷色彩模式</li>
              </ul>
            </div>

            <div className="feature-card">
              <h4>🎯 交互体验优化</h4>
              <ul>
                <li>点击色块打开面板</li>
                <li>手风琴式预设颜色</li>
                <li>一键复制颜色值</li>
                <li>实时颜色格式转换</li>
                <li>拖拽颜色选择器</li>
                <li>透明度滑块调节</li>
              </ul>
            </div>

            <div className="feature-card">
              <h4>📱 响应式设计</h4>
              <ul>
                <li>移动端适配</li>
                <li>暗色模式支持</li>
                <li>触摸交互优化</li>
                <li>自适应布局</li>
                <li>键盘导航支持</li>
                <li>无障碍访问</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ColorModuleDemo;
