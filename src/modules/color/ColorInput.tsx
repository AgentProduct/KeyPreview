import React, { useState, useEffect } from "react";
import {
  rgbToHex,
  hexToRgb,
  rgbToHsl,
  hslToRgb,
  rgbToHsb,
  hsbToRgb,
  rgbToCmyk,
  cmykToRgb,
  parseColorString,
  formatRgbaString,
  type RGB,
  type RGBA,
  type HSL,
  type HSB,
  type CMYK,
} from "./colorConverter";
import { copyToClipboard } from "./colorUtils";
import "./ColorInput.css";

interface ColorInputProps {
  onColorChange?: (color: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ onColorChange }) => {
  const [hex, setHex] = useState("#007bff");
  const [rgb, setRgb] = useState<RGB>({ r: 0, g: 123, b: 255 });
  const [rgba, setRgba] = useState<RGBA>({ r: 0, g: 123, b: 255, a: 1 });
  const [hsl, setHsl] = useState<HSL>({ h: 210, s: 100, l: 50 });
  const [hsb, setHsb] = useState<HSB>({ h: 210, s: 100, b: 100 });
  const [cmyk, setCmyk] = useState<CMYK>({ c: 100, m: 52, y: 0, k: 0 });

  // 同步所有颜色格式
  const syncAllFormats = (
    source: "hex" | "rgb" | "rgba" | "hsl" | "hsb" | "cmyk",
    value: any
  ) => {
    let newRgb: RGB;

    switch (source) {
      case "hex":
        newRgb = hexToRgb(value) || rgb;
        break;
      case "rgb":
        newRgb = value;
        break;
      case "rgba":
        newRgb = { r: value.r, g: value.g, b: value.b };
        break;
      case "hsl":
        newRgb = hslToRgb(value);
        break;
      case "hsb":
        newRgb = hsbToRgb(value);
        break;
      case "cmyk":
        newRgb = cmykToRgb(value);
        break;
      default:
        newRgb = rgb;
    }

    const newHex = rgbToHex(newRgb);
    const newHsl = rgbToHsl(newRgb);
    const newHsb = rgbToHsb(newRgb);
    const newCmyk = rgbToCmyk(newRgb);
    const newRgba = source === "rgba" ? value : { ...newRgb, a: rgba.a };

    setHex(newHex);
    setRgb(newRgb);
    setRgba(newRgba);
    setHsl(newHsl);
    setHsb(newHsb);
    setCmyk(newCmyk);

    if (onColorChange) {
      onColorChange(newHex);
    }
  };

  const handleHexChange = (value: string) => {
    setHex(value);
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      syncAllFormats("hex", value);
    }
  };

  const handleRgbChange = (channel: keyof RGB, value: number) => {
    const newRgb = { ...rgb, [channel]: Math.max(0, Math.min(255, value)) };
    syncAllFormats("rgb", newRgb);
  };

  const handleRgbaChange = (channel: keyof RGBA, value: number) => {
    const max = channel === "a" ? 1 : 255;
    const minValue = channel === "a" ? 0 : 0;
    const clampedValue = Math.max(minValue, Math.min(max, value));
    const newRgba = { ...rgba, [channel]: clampedValue };

    // 同步RGB部分
    const newRgb = { r: newRgba.r, g: newRgba.g, b: newRgba.b };
    setRgb(newRgb);
    setRgba(newRgba);

    // 更新其他格式（不包括透明度）
    const newHex = rgbToHex(newRgb);
    const newHsl = rgbToHsl(newRgb);
    const newHsb = rgbToHsb(newRgb);
    const newCmyk = rgbToCmyk(newRgb);

    setHex(newHex);
    setHsl(newHsl);
    setHsb(newHsb);
    setCmyk(newCmyk);

    if (onColorChange) {
      onColorChange(newHex);
    }
  };

  const handleHslChange = (channel: keyof HSL, value: number) => {
    const max = channel === "h" ? 360 : 100;
    const newHsl = { ...hsl, [channel]: Math.max(0, Math.min(max, value)) };
    syncAllFormats("hsl", newHsl);
  };

  const handleHsbChange = (channel: keyof HSB, value: number) => {
    const max = channel === "h" ? 360 : 100;
    const newHsb = { ...hsb, [channel]: Math.max(0, Math.min(max, value)) };
    syncAllFormats("hsb", newHsb);
  };

  const handleCmykChange = (channel: keyof CMYK, value: number) => {
    const newCmyk = { ...cmyk, [channel]: Math.max(0, Math.min(100, value)) };
    syncAllFormats("cmyk", newCmyk);
  };

  const handleCopyToClipboard = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      // 可以添加复制成功的提示
    }
  };

  return (
    <div className="color-input">
      <div
        className="color-preview-large alpha-background"
        style={{
          backgroundColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`,
        }}
      >
        <div className="color-info">
          <span className="color-code">
            {rgba.a < 1 ? formatRgbaString(rgba) : hex}
          </span>
          <span className="color-name">
            {rgba.a < 1 ? "透明颜色" : "自定义颜色"}
          </span>
        </div>
      </div>

      {/* HEX 输入 */}
      <div className="input-section">
        <h4>HEX</h4>
        <div className="input-group">
          <input
            type="text"
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#RRGGBB"
            className="text-input"
          />
          <button
            className="copy-btn"
            onClick={() => handleCopyToClipboard(hex)}
            title="复制HEX值"
          >
            📋
          </button>
        </div>
      </div>

      {/* RGB 输入 */}
      <div className="input-section">
        <h4>RGB</h4>
        <div className="rgb-inputs">
          <div className="channel-input">
            <label>R</label>
            <input
              type="number"
              min="0"
              max="255"
              value={rgb.r}
              onChange={(e) =>
                handleRgbChange("r", parseInt(e.target.value) || 0)
              }
              className="number-input"
            />
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.r}
              onChange={(e) => handleRgbChange("r", parseInt(e.target.value))}
              className="range-input"
            />
          </div>
          <div className="channel-input">
            <label>G</label>
            <input
              type="number"
              min="0"
              max="255"
              value={rgb.g}
              onChange={(e) =>
                handleRgbChange("g", parseInt(e.target.value) || 0)
              }
              className="number-input"
            />
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.g}
              onChange={(e) => handleRgbChange("g", parseInt(e.target.value))}
              className="range-input"
            />
          </div>
          <div className="channel-input">
            <label>B</label>
            <input
              type="number"
              min="0"
              max="255"
              value={rgb.b}
              onChange={(e) =>
                handleRgbChange("b", parseInt(e.target.value) || 0)
              }
              className="number-input"
            />
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.b}
              onChange={(e) => handleRgbChange("b", parseInt(e.target.value))}
              className="range-input"
            />
          </div>
        </div>
        <div className="format-output">
          rgb({rgb.r}, {rgb.g}, {rgb.b})
          <button
            className="copy-btn-small"
            onClick={() =>
              handleCopyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
            }
            title="复制RGB值"
          >
            📋
          </button>
        </div>
      </div>

      {/* RGBA 输入 */}
      <div className="input-section">
        <h4>RGBA</h4>
        <div className="rgb-inputs">
          <div className="channel-input">
            <label>R</label>
            <input
              type="number"
              min="0"
              max="255"
              value={rgba.r}
              onChange={(e) =>
                handleRgbaChange("r", parseInt(e.target.value) || 0)
              }
              className="number-input"
            />
            <input
              type="range"
              min="0"
              max="255"
              value={rgba.r}
              onChange={(e) => handleRgbaChange("r", parseInt(e.target.value))}
              className="range-input"
            />
          </div>
          <div className="channel-input">
            <label>G</label>
            <input
              type="number"
              min="0"
              max="255"
              value={rgba.g}
              onChange={(e) =>
                handleRgbaChange("g", parseInt(e.target.value) || 0)
              }
              className="number-input"
            />
            <input
              type="range"
              min="0"
              max="255"
              value={rgba.g}
              onChange={(e) => handleRgbaChange("g", parseInt(e.target.value))}
              className="range-input"
            />
          </div>
          <div className="channel-input">
            <label>B</label>
            <input
              type="number"
              min="0"
              max="255"
              value={rgba.b}
              onChange={(e) =>
                handleRgbaChange("b", parseInt(e.target.value) || 0)
              }
              className="number-input"
            />
            <input
              type="range"
              min="0"
              max="255"
              value={rgba.b}
              onChange={(e) => handleRgbaChange("b", parseInt(e.target.value))}
              className="range-input"
            />
          </div>
          <div className="channel-input">
            <label>A</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={rgba.a}
              onChange={(e) =>
                handleRgbaChange("a", parseFloat(e.target.value) || 0)
              }
              className="number-input alpha-input"
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={rgba.a}
              onChange={(e) =>
                handleRgbaChange("a", parseFloat(e.target.value))
              }
              className="range-input alpha-range"
            />
          </div>
        </div>
        <div className="format-output">
          rgba({rgba.r}, {rgba.g}, {rgba.b}, {rgba.a.toFixed(2)})
          <button
            className="copy-btn-small"
            onClick={() => handleCopyToClipboard(formatRgbaString(rgba))}
            title="复制RGBA值"
          >
            📋
          </button>
        </div>
      </div>

      {/* HSL 输入 */}
      <div className="input-section">
        <h4>HSL</h4>
        <div className="rgb-inputs">
          <div className="channel-input">
            <label>H</label>
            <input
              type="number"
              min="0"
              max="360"
              value={hsl.h}
              onChange={(e) =>
                handleHslChange("h", parseInt(e.target.value) || 0)
              }
              className="number-input"
            />
            <input
              type="range"
              min="0"
              max="360"
              value={hsl.h}
              onChange={(e) => handleHslChange("h", parseInt(e.target.value))}
              className="range-input"
            />
          </div>
          <div className="channel-input">
            <label>S</label>
            <input
              type="number"
              min="0"
              max="100"
              value={hsl.s}
              onChange={(e) =>
                handleHslChange("s", parseInt(e.target.value) || 0)
              }
              className="number-input"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={hsl.s}
              onChange={(e) => handleHslChange("s", parseInt(e.target.value))}
              className="range-input"
            />
            <span className="unit">%</span>
          </div>
          <div className="channel-input">
            <label>L</label>
            <input
              type="number"
              min="0"
              max="100"
              value={hsl.l}
              onChange={(e) =>
                handleHslChange("l", parseInt(e.target.value) || 0)
              }
              className="number-input"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={hsl.l}
              onChange={(e) => handleHslChange("l", parseInt(e.target.value))}
              className="range-input"
            />
            <span className="unit">%</span>
          </div>
        </div>
        <div className="format-output">
          hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
          <button
            className="copy-btn-small"
            onClick={() =>
              handleCopyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)
            }
            title="复制HSL值"
          >
            📋
          </button>
        </div>
      </div>

      {/* HSB 输入 */}
      <div className="input-section">
        <h4>HSB</h4>
        <div className="rgb-inputs">
          <div className="channel-input">
            <label>H</label>
            <input
              type="number"
              min="0"
              max="360"
              value={hsb.h}
              onChange={(e) =>
                handleHsbChange("h", parseInt(e.target.value) || 0)
              }
              className="number-input"
            />
            <input
              type="range"
              min="0"
              max="360"
              value={hsb.h}
              onChange={(e) => handleHsbChange("h", parseInt(e.target.value))}
              className="range-input"
            />
          </div>
          <div className="channel-input">
            <label>S</label>
            <input
              type="number"
              min="0"
              max="100"
              value={hsb.s}
              onChange={(e) =>
                handleHsbChange("s", parseInt(e.target.value) || 0)
              }
              className="number-input"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={hsb.s}
              onChange={(e) => handleHsbChange("s", parseInt(e.target.value))}
              className="range-input"
            />
            <span className="unit">%</span>
          </div>
          <div className="channel-input">
            <label>B</label>
            <input
              type="number"
              min="0"
              max="100"
              value={hsb.b}
              onChange={(e) =>
                handleHsbChange("b", parseInt(e.target.value) || 0)
              }
              className="number-input"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={hsb.b}
              onChange={(e) => handleHsbChange("b", parseInt(e.target.value))}
              className="range-input"
            />
            <span className="unit">%</span>
          </div>
        </div>
        <div className="format-output">
          hsb({hsb.h}, {hsb.s}%, {hsb.b}%)
          <button
            className="copy-btn-small"
            onClick={() =>
              handleCopyToClipboard(`hsb(${hsb.h}, ${hsb.s}%, ${hsb.b}%)`)
            }
            title="复制HSB值"
          >
            📋
          </button>
        </div>
      </div>

      {/* CMYK 输入 */}
      <div className="input-section">
        <h4>CMYK</h4>
        <div className="rgb-inputs">
          <div className="channel-input">
            <label>C</label>
            <input
              type="number"
              min="0"
              max="100"
              value={cmyk.c}
              onChange={(e) =>
                handleCmykChange("c", parseInt(e.target.value) || 0)
              }
              className="number-input"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={cmyk.c}
              onChange={(e) => handleCmykChange("c", parseInt(e.target.value))}
              className="range-input"
            />
            <span className="unit">%</span>
          </div>
          <div className="channel-input">
            <label>M</label>
            <input
              type="number"
              min="0"
              max="100"
              value={cmyk.m}
              onChange={(e) =>
                handleCmykChange("m", parseInt(e.target.value) || 0)
              }
              className="number-input"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={cmyk.m}
              onChange={(e) => handleCmykChange("m", parseInt(e.target.value))}
              className="range-input"
            />
            <span className="unit">%</span>
          </div>
          <div className="channel-input">
            <label>Y</label>
            <input
              type="number"
              min="0"
              max="100"
              value={cmyk.y}
              onChange={(e) =>
                handleCmykChange("y", parseInt(e.target.value) || 0)
              }
              className="number-input"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={cmyk.y}
              onChange={(e) => handleCmykChange("y", parseInt(e.target.value))}
              className="range-input"
            />
            <span className="unit">%</span>
          </div>
          <div className="channel-input">
            <label>K</label>
            <input
              type="number"
              min="0"
              max="100"
              value={cmyk.k}
              onChange={(e) =>
                handleCmykChange("k", parseInt(e.target.value) || 0)
              }
              className="number-input"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={cmyk.k}
              onChange={(e) => handleCmykChange("k", parseInt(e.target.value))}
              className="range-input"
            />
            <span className="unit">%</span>
          </div>
        </div>
        <div className="format-output">
          cmyk({cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%)
          <button
            className="copy-btn-small"
            onClick={() =>
              handleCopyToClipboard(
                `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
              )
            }
            title="复制CMYK值"
          >
            📋
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorInput;
