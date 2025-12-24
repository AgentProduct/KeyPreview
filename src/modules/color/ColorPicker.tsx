import React, { useState, useRef, useEffect } from "react";
import {
  hexToRgb,
  rgbToHex,
  hslToRgb,
  rgbToHsl,
  rgbToHsb,
  hsbToRgb,
  rgbToCmyk,
  formatHslString,
  formatHsbString,
  formatCmykString,
} from "./colorConverter";
import { copyToClipboard } from "./colorUtils";
import "./ColorPicker.css";

interface ColorPickerProps {
  initialColor?: string;
  onChange?: (color: string) => void;
}

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

interface ColorHSL {
  h: number;
  s: number;
  l: number;
}

interface ColorHSB {
  h: number;
  s: number;
  b: number;
}

interface ColorCMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  initialColor = "#007bff",
  onChange,
}) => {
  // 状态管理
  const [hex, setHex] = useState(initialColor);
  const [rgb, setRgb] = useState<ColorRGB>({ r: 0, g: 123, b: 255 });
  const [rgba, setRgba] = useState<ColorRGB & { a: number }>({
    r: 0,
    g: 123,
    b: 255,
    a: 1,
  });
  const [hsl, setHsl] = useState<ColorHSL>({ h: 210, s: 100, l: 50 });
  const [hsb, setHsb] = useState<ColorHSB>({ h: 210, s: 100, b: 100 });
  const [cmyk, setCmyk] = useState<ColorCMYK>({ c: 100, m: 52, y: 0, k: 0 });
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // 输入框状态管理 - 默认为空
  const [hexInputValue, setHexInputValue] = useState("");
  const [rgbaInputValue, setRgbaInputValue] = useState("");

  // 颜色选择区域状态
  const [selectorPosition, setSelectorPosition] = useState({ x: 50, y: 50 });
  const [hue, setHue] = useState(210);

  // 引用
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 初始化颜色
  useEffect(() => {
    const initialRgb = hexToRgb(initialColor);
    if (initialRgb) {
      setRgb(initialRgb);
      setRgba({ ...initialRgb, a: 1 });
      const initialHsl = rgbToHsl(initialRgb);
      setHsl(initialHsl);
      setHue(initialHsl.h);

      // 根据初始颜色设置选择器位置 - 使用HSB模型
      const initialHsb = rgbToHsb(initialRgb);
      setSelectorPosition({
        x: initialHsb.s,
        y: 100 - initialHsb.b,
      });

      // 输入框默认为空，不初始化值
      // setHexInputValue(initialColor);
      // setRgbaInputValue(`rgba(${initialRgb.r}, ${initialRgb.g}, ${initialRgb.b}, 1)`);
    }
  }, [initialColor]);

  // 核心颜色同步函数
  const syncColorState = (
    newHex: string,
    newRgb: ColorRGB,
    newHsl: ColorHSL,
    newAlpha?: number
  ) => {
    setHex(newHex);
    setRgb(newRgb);
    setRgba({ ...newRgb, a: newAlpha !== undefined ? newAlpha : rgba.a });
    setHsl(newHsl);
    const newHsb = rgbToHsb(newRgb);
    setHsb(newHsb);
    const newCmyk = rgbToCmyk(newRgb);
    setCmyk(newCmyk);
    setHue(newHsl.h);

    // 注释掉更新输入框值的代码，这样选择颜色盘时不会改变输入框内容
    // setHexInputValue(newHex);
    // const alphaValue = newAlpha !== undefined ? newAlpha : rgba.a;
    // setRgbaInputValue(`rgba(${newRgb.r}, ${newRgb.g}, ${newRgb.b}, ${Math.round(alphaValue * 100) / 100})`);

    // 更新选择器位置 - 使用HSB值计算，与颜色面板映射保持一致
    setSelectorPosition({
      x: newHsb.s,
      y: 100 - newHsb.b,
    });

    // 通知父组件颜色变化
    if (onChange) {
      onChange(newHex);
    }
  };

  // 处理颜色变化
  const handleColorChange = (newHex: string) => {
    setHex(newHex);
    const newRgb = hexToRgb(newHex);
    if (newRgb) {
      const newHsl = rgbToHsl(newRgb);
      syncColorState(newHex, newRgb, newHsl);
    }
  };

  // 处理HEX输入
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // 允许用户逐步输入，不实时更新验证
    setHexInputValue(value);

    // 只有当输入完整且有效时才更新颜色
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      handleColorChange(value);
    }
  };

  // 处理RGB滑块变化
  const handleRgbChange = (color: keyof ColorRGB, value: number) => {
    const newRgb = { ...rgb, [color]: Math.max(0, Math.min(255, value)) };
    const newHex = rgbToHex(newRgb);
    const newHsl = rgbToHsl(newRgb);
    syncColorState(newHex, newRgb, newHsl);
  };

  // 处理HSL滑块变化
  const handleHslChange = (color: keyof ColorHSL, value: number) => {
    let maxValue = 100;
    if (color === "h") maxValue = 360;

    const newHsl = { ...hsl, [color]: Math.max(0, Math.min(maxValue, value)) };
    const newRgb = hslToRgb(newHsl);
    const newHex = rgbToHex(newRgb);
    syncColorState(newHex, newRgb, newHsl);
  };

  // 处理RGBA透明度变化
  const handleRgbaAlphaChange = (alpha: number) => {
    const newAlpha = Math.max(0, Math.min(1, alpha));
    // 使用syncColorState更新所有颜色状态，保持现有的RGB、HEX和HSL值不变
    syncColorState(hex, rgb, hsl, newAlpha);
  };

  // 处理RGBA输入
  const handleRgbaInputChange = (value: string) => {
    // 允许用户逐步输入，实时更新显示值
    setRgbaInputValue(value);

    // 只有当输入完整且有效时才更新颜色
    const rgbaMatch =
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/i.exec(value);
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1]);
      const g = parseInt(rgbaMatch[2]);
      const b = parseInt(rgbaMatch[3]);
      const a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;

      // 验证RGB值范围
      if (
        r >= 0 &&
        r <= 255 &&
        g >= 0 &&
        g <= 255 &&
        b >= 0 &&
        b <= 255 &&
        a >= 0 &&
        a <= 1
      ) {
        const newRgb = { r, g, b };
        const newHsl = rgbToHsl(newRgb);
        const newHex = rgbToHex(newRgb);

        // 传递新的alpha值给syncColorState
        syncColorState(newHex, newRgb, newHsl, a);
      }
    }
  };

  // 从坐标计算颜色并更新状态
  const updateColorFromCoordinates = (clientX: number, clientY: number) => {
    if (!colorPickerRef.current) return;

    const rect = colorPickerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    const clampedX = Math.max(0, Math.min(100, xPercent));
    const clampedY = Math.max(0, Math.min(100, yPercent));

    // 使用HSB模型映射颜色：
    // x方向：饱和度 (0% 到 100%) - 从左到右增加
    // y方向：亮度 (0% 到 100%) - 从下到上增加
    const saturation = clampedX;
    const brightness = 100 - clampedY;

    const newHsb = { h: hue, s: saturation, b: brightness };
    const newRgb = hsbToRgb(newHsb);
    const newHex = rgbToHex(newRgb);
    const newHsl = rgbToHsl(newRgb);

    setSelectorPosition({ x: clampedX, y: clampedY });
    syncColorState(newHex, newRgb, newHsl);
  };

  // 处理颜色选择区域点击
  const handlePickerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    updateColorFromCoordinates(e.clientX, e.clientY);
  };

  // 处理拖动事件
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateColorFromCoordinates(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 监听全局鼠标事件
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!colorPickerRef.current) return;

        const rect = colorPickerRef.current.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          updateColorFromCoordinates(e.clientX, e.clientY);
        }
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };

      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging]);

  // 处理色相滑块变化
  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const newHue = parseInt(target.value);
    handleHslChange("h", newHue);
  };

  // 复制到剪贴板功能
  const handleCopyToClipboard = async (text: string, format: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    }
  };

  // 生成随机颜色
  const generateRandomColor = () => {
    const randomHue = Math.floor(Math.random() * 361);
    const randomSaturation = 40 + Math.floor(Math.random() * 51);
    const randomBrightness = 40 + Math.floor(Math.random() * 51);

    const randomHsb = {
      h: randomHue,
      s: randomSaturation,
      b: randomBrightness,
    };
    const randomRgb = hsbToRgb(randomHsb);
    const randomHex = rgbToHex(randomRgb);
    const randomHsl = rgbToHsl(randomRgb);

    setHue(randomHue);
    setSelectorPosition({
      x: randomSaturation,
      y: 100 - randomBrightness,
    });

    syncColorState(randomHex, randomRgb, randomHsl);
  };

  return (
    <div className="color-picker">
      {/* 显眼的当前颜色显示区域 */}
      <div className="current-color-display">
        <div
          className="main-color-preview alpha"
          style={{
            backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgba.a})`,
          }}
        >
          <div className="color-details">
            <div className="color-value-primary">{hex}</div>
            <div className="color-value-secondary">
              rgba({rgb.r}, {rgb.g}, {rgb.b}, {rgba.a})
            </div>
            {rgba.a < 1 && (
              <div className="color-value-secondary">
                透明度: {Math.round(rgba.a * 100)}%
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="color-controls-section">
        <div className="color-preview">
          <div
            className="color-swatch alpha"
            style={{
              backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgba.a})`,
            }}
            onClick={generateRandomColor}
            title="点击生成随机颜色"
          ></div>
          <div className="dual-input-group">
            <div className="color-input-group">
              <label htmlFor="hexInput">HEX</label>
              <input
                id="hexInput"
                type="text"
                value={hexInputValue}
                onChange={handleHexInputChange}
                placeholder="#000000"
              />
            </div>
            <div className="color-input-group">
              <label htmlFor="rgbaInput">RGBA</label>
              <input
                id="rgbaInput"
                type="text"
                value={rgbaInputValue}
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  handleRgbaInputChange(target.value);
                }}
                placeholder="rgba(255, 0, 0, 1)"
              />
            </div>
          </div>
        </div>

        {/* 颜色选择主区域 */}
        <div className="color-picker-main">
          {/* 颜色选择区域 */}
          <div style={{ flex: 1 }}>
            <div
              className="color-picker-area"
              ref={colorPickerRef}
              onClick={handlePickerClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }}
            >
              <div className="color-picker-overlay"></div>
              <div
                className="color-picker-selector"
                style={{
                  left: `${selectorPosition.x}%`,
                  top: `${selectorPosition.y}%`,
                }}
              ></div>
            </div>

            {/* 透明度滑块 */}
            <div className="alpha-slider-container">
              <label className="alpha-slider-label">透明度</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={rgba.a}
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  handleRgbaAlphaChange(parseFloat(target.value));
                }}
                className="alpha-slider-input"
                style={{
                  background: `linear-gradient(to right, 
                    rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0) 0%, 
                    rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1) 100%)`,
                }}
                title="调整透明度"
              />
              <span className="alpha-value-display">
                {Math.round(rgba.a * 100)}%
              </span>
            </div>
          </div>

          {/* 色相滑块 */}
          <div className="hue-slider-container">
            <div
              className="hue-value-indicator"
              style={{
                backgroundColor: `hsl(${hue}, 100%, 50%)`,
                borderColor: `hsl(${hue}, 100%, 40%)`,
              }}
            >
              H: {hue}°
            </div>
            <div
              className="hue-color-preview"
              style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }}
            />
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={handleHueChange}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                const newHue = parseInt(target.value);
                const indicator = document.querySelector(
                  ".hue-value-indicator"
                ) as HTMLElement;
                const preview = document.querySelector(
                  ".hue-color-preview"
                ) as HTMLElement;
                if (indicator) {
                  indicator.textContent = `H: ${newHue}°`;
                  indicator.style.backgroundColor = `hsl(${newHue}, 100%, 50%)`;
                  indicator.style.borderColor = `hsl(${newHue}, 100%, 40%)`;
                }
                if (preview) {
                  preview.style.backgroundColor = `hsl(${newHue}, 100%, 50%)`;
                }
              }}
              onMouseEnter={() => {
                const indicator = document.querySelector(
                  ".hue-value-indicator"
                ) as HTMLElement;
                if (indicator) indicator.style.opacity = "1";
              }}
              onMouseLeave={() => {
                const indicator = document.querySelector(
                  ".hue-value-indicator"
                ) as HTMLElement;
                if (indicator) indicator.style.opacity = "0";
              }}
              onFocus={() => {
                const indicator = document.querySelector(
                  ".hue-value-indicator"
                ) as HTMLElement;
                if (indicator) indicator.style.opacity = "1";
              }}
              onBlur={() => {
                const indicator = document.querySelector(
                  ".hue-value-indicator"
                ) as HTMLElement;
                if (indicator) indicator.style.opacity = "0";
              }}
              onMouseDown={() => {
                const indicator = document.querySelector(
                  ".hue-value-indicator"
                ) as HTMLElement;
                if (indicator) indicator.style.opacity = "1";
              }}
              className="hue-slider"
              title="拖动选择色相 (0°-360°)"
            />
            <div className="hue-scale-labels">
              <span className="hue-label hue-label-top">360°</span>
              <span className="hue-label hue-label-middle">180°</span>
              <span className="hue-label hue-label-bottom">0°</span>
            </div>
          </div>
        </div>

        {/* RGB滑块控制 */}
        <div className="color-sliders">
          <h4>RGB</h4>
          <div className="slider-group">
            <label>R</label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.r}
              onChange={(e) => handleRgbChange("r", parseInt(e.target.value))}
            />
            <input
              type="number"
              min="0"
              max="255"
              value={rgb.r}
              onChange={(e) =>
                handleRgbChange("r", parseInt(e.target.value) || 0)
              }
            />
          </div>
          <div className="slider-group">
            <label>G</label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.g}
              onChange={(e) => handleRgbChange("g", parseInt(e.target.value))}
            />
            <input
              type="number"
              min="0"
              max="255"
              value={rgb.g}
              onChange={(e) =>
                handleRgbChange("g", parseInt(e.target.value) || 0)
              }
            />
          </div>
          <div className="slider-group">
            <label>B</label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.b}
              onChange={(e) => handleRgbChange("b", parseInt(e.target.value))}
            />
            <input
              type="number"
              min="0"
              max="255"
              value={rgb.b}
              onChange={(e) =>
                handleRgbChange("b", parseInt(e.target.value) || 0)
              }
            />
          </div>
        </div>

        {/* HSL滑块控制 */}
        <div className="color-sliders">
          <h4>HSL</h4>
          <div className="slider-group">
            <label>H</label>
            <input
              type="range"
              min="0"
              max="360"
              value={hsl.h}
              onChange={(e) => handleHslChange("h", parseInt(e.target.value))}
            />
            <input
              type="number"
              min="0"
              max="360"
              value={hsl.h}
              onChange={(e) =>
                handleHslChange("h", parseInt(e.target.value) || 0)
              }
            />
          </div>
          <div className="slider-group">
            <label>S</label>
            <input
              type="range"
              min="0"
              max="100"
              value={hsl.s}
              onChange={(e) => handleHslChange("s", parseInt(e.target.value))}
            />
            <input
              type="number"
              min="0"
              max="100"
              value={hsl.s}
              onChange={(e) =>
                handleHslChange("s", parseInt(e.target.value) || 0)
              }
            />
            <span>%</span>
          </div>
          <div className="slider-group">
            <label>L</label>
            <input
              type="range"
              min="0"
              max="100"
              value={hsl.l}
              onChange={(e) => handleHslChange("l", parseInt(e.target.value))}
            />
            <input
              type="number"
              min="0"
              max="100"
              value={hsl.l}
              onChange={(e) =>
                handleHslChange("l", parseInt(e.target.value) || 0)
              }
            />
            <span>%</span>
          </div>
        </div>

        {/* 紧凑的颜色格式输出 */}
        <div className="color-formats">
          <h4>颜色格式</h4>

          <div className="formats-grid">
            {/* HEX格式 */}
            <div className="format-item compact">
              <div className="format-header">
                <strong>HEX</strong>
                <button
                  className="copy-btn compact"
                  onClick={() => handleCopyToClipboard(hex, "hex")}
                  title="复制HEX值"
                >
                  {copiedFormat === "hex" ? "✓" : "📋"}
                </button>
              </div>
              <div className="format-value">{hex}</div>
            </div>

            {/* RGB格式 */}
            <div className="format-item compact">
              <div className="format-header">
                <strong>RGB</strong>
                <button
                  className="copy-btn compact"
                  onClick={() =>
                    handleCopyToClipboard(
                      `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                      "rgb"
                    )
                  }
                  title="复制RGB值"
                >
                  {copiedFormat === "rgb" ? "✓" : "📋"}
                </button>
              </div>
              <div className="format-value">{`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}</div>
            </div>

            {/* RGBA格式 */}
            <div className="format-item compact">
              <div className="format-header">
                <strong>RGBA</strong>
                <button
                  className="copy-btn compact"
                  onClick={() =>
                    handleCopyToClipboard(
                      `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgba.a})`,
                      "rgba"
                    )
                  }
                  title="复制RGBA值"
                >
                  {copiedFormat === "rgba" ? "✓" : "📋"}
                </button>
              </div>
              <div className="format-value">{`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgba.a})`}</div>
            </div>

            {/* HSL格式 */}
            <div className="format-item compact">
              <div className="format-header">
                <strong>HSL</strong>
                <button
                  className="copy-btn compact"
                  onClick={() =>
                    handleCopyToClipboard(formatHslString(hsl), "hsl")
                  }
                  title="复制HSL值"
                >
                  {copiedFormat === "hsl" ? "✓" : "📋"}
                </button>
              </div>
              <div className="format-value">{formatHslString(hsl)}</div>
            </div>

            {/* HSB格式 */}
            <div className="format-item compact">
              <div className="format-header">
                <strong>HSB</strong>
                <button
                  className="copy-btn compact"
                  onClick={() =>
                    handleCopyToClipboard(formatHsbString(hsb), "hsb")
                  }
                  title="复制HSB值"
                >
                  {copiedFormat === "hsb" ? "✓" : "📋"}
                </button>
              </div>
              <div className="format-value">{formatHsbString(hsb)}</div>
            </div>

            {/* CMYK格式 */}
            <div className="format-item compact">
              <div className="format-header">
                <strong>CMYK</strong>
                <button
                  className="copy-btn compact"
                  onClick={() =>
                    handleCopyToClipboard(formatCmykString(cmyk), "cmyk")
                  }
                  title="复制CMYK值"
                >
                  {copiedFormat === "cmyk" ? "✓" : "📋"}
                </button>
              </div>
              <div className="format-value">{formatCmykString(cmyk)}</div>
            </div>
          </div>
        </div>

        {/* 复制成功提示 */}
        {copiedFormat && (
          <div className="copy-notification">
            已复制 {copiedFormat.toUpperCase()} 值到剪贴板
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
