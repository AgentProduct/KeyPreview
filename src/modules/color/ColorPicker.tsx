import React, { useState, useRef, useEffect } from "react";
import { hexToRgb, rgbToHex, hslToRgb, rgbToHsl } from "./colorConverter";
import "./ColorPicker.css";

interface ColorPickerProps {
  initialColor?: string; // 初始颜色，默认为HEX格式
  onChange?: (color: string) => void; // 颜色变化回调
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

const ColorPicker: React.FC<ColorPickerProps> = ({
  initialColor = "#007bff",
  onChange,
}) => {
  // 状态管理
  const [hex, setHex] = useState(initialColor);
  const [rgb, setRgb] = useState<ColorRGB>({ r: 0, g: 123, b: 255 });
  const [hsl, setHsl] = useState<ColorHSL>({ h: 210, s: 100, l: 50 });

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
      const initialHsl = rgbToHsl(initialRgb);
      setHsl(initialHsl);
      setHue(initialHsl.h);

      // 根据初始颜色设置选择器位置
      setSelectorPosition({
        x: initialHsl.s,
        y: 100 - initialHsl.l,
      });
    }
  }, [initialColor]);

  // 核心颜色同步函数 - 确保所有颜色表示方式保持同步
  const syncColorState = (
    newHex: string,
    newRgb: ColorRGB,
    newHsl: ColorHSL
  ) => {
    setHex(newHex);
    setRgb(newRgb);
    setHsl(newHsl);
    setHue(newHsl.h);

    // 更新选择器位置
    setSelectorPosition({
      x: newHsl.s,
      y: 100 - newHsl.l,
    });

    // 通知父组件颜色变化
    if (onChange) {
      onChange(newHex);
    }
  };

  // 处理颜色变化 - 作为所有颜色变更的统一入口
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
    const value = e.target.value;
    // 验证HEX格式
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

  // 从坐标计算颜色并更新状态 - 提取为独立函数
  const updateColorFromCoordinates = (clientX: number, clientY: number) => {
    if (!colorPickerRef.current) return;

    const rect = colorPickerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // 确保值在0-100之间
    const clampedX = Math.max(0, Math.min(100, xPercent));
    const clampedY = Math.max(0, Math.min(100, yPercent));

    // 根据色相、饱和度和亮度计算新颜色
    const saturation = clampedX;
    const lightness = 100 - clampedY; // 反转Y轴

    const newHsl = { h: hue, s: saturation, l: lightness };
    const newRgb = hslToRgb(newHsl);
    const newHex = rgbToHex(newRgb);

    // 先更新选择器位置以获得即时反馈
    setSelectorPosition({ x: clampedX, y: clampedY });

    // 同步所有颜色状态
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
        // 检查鼠标是否在颜色选择区域内
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          // 直接使用原始事件的坐标，避免类型转换问题
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
    const newHue = parseFloat(e.target.value);
    handleHslChange("h", newHue);
  };

  // 生成随机颜色
  const generateRandomColor = () => {
    // 生成随机色相（0-360）
    const randomHue = Math.floor(Math.random() * 361);
    // 生成随机饱和度（40-90%，避免过于灰色）
    const randomSaturation = 40 + Math.floor(Math.random() * 51);
    // 生成随机亮度（40-60%，保持中等亮度）
    const randomLightness = 40 + Math.floor(Math.random() * 21);

    // 创建HSL对象
    const randomHsl = { h: randomHue, s: randomSaturation, l: randomLightness };
    // 转换为RGB
    const randomRgb = hslToRgb(randomHsl);
    // 转换为HEX
    const randomHex = rgbToHex(randomRgb);

    // 先更新选择器位置和色相以获得即时反馈
    setHue(randomHue);
    setSelectorPosition({
      x: randomSaturation,
      y: 100 - randomLightness,
    });

    // 同步所有颜色状态
    syncColorState(randomHex, randomRgb, randomHsl);
  };

  return (
    <div className="color-picker">
      <div className="color-preview">
        <div
          className="color-swatch"
          style={{ backgroundColor: hex }}
          onClick={generateRandomColor} // 点击颜色预览区域也可以生成随机颜色
          title="点击生成随机颜色"
        ></div>
        <div className="color-input-group">
          <label htmlFor="hexInput">HEX</label>
          <input
            id="hexInput"
            type="text"
            value={hex}
            onChange={handleHexInputChange}
            placeholder="#000000"
          />
        </div>
      </div>

      {/* 随机颜色按钮 */}
      <button
        onClick={generateRandomColor}
        style={{
          marginBottom: "15px",
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#0056b3")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#007bff")
        }
      >
        随机颜色
      </button>

      {/* 颜色选择区域 */}
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

      {/* 色相滑块 */}
      <div className="hue-slider-container">
        <input
          type="range"
          min="0"
          max="360"
          value={hue}
          onChange={handleHueChange}
          className="hue-slider"
        />
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

      {/* HSL滑块控制 - 新增 */}
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

      <div className="color-formats">
        <div className="format-item">
          <strong>RGB:</strong>
          {`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
        </div>
        <div className="format-item">
          <strong>HSL:</strong>
          {`hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
