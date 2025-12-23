/**
 * 颜色转换工具模块
 * 支持RGB、RGBA、HEX、HSL等颜色格式之间的转换
 */

/**
 * RGB颜色接口
 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * RGBA颜色接口
 */
export interface RGBA extends RGB {
  a: number;
}

/**
 * HSL颜色接口
 */
export interface HSL {
  h: number;
  s: number;
  l: number;
}

/**
 * 将RGB转换为HEX格式
 * @param rgb RGB颜色对象
 * @returns HEX颜色字符串
 */
export const rgbToHex = (rgb: RGB): string => {
  const { r, g, b } = rgb;
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
};

/**
 * 将RGBA转换为HEX格式
 * @param rgba RGBA颜色对象
 * @returns HEX颜色字符串 (带透明度)
 */
export const rgbaToHex = (rgba: RGBA): string => {
  const { r, g, b, a } = rgba;
  const alphaHex = Math.round(a * 255)
    .toString(16)
    .padStart(2, "0");
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}${alphaHex}`;
};

/**
 * 将HEX转换为RGB格式
 * @param hex HEX颜色字符串
 * @returns RGB颜色对象
 */
export const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * 将HEX转换为RGBA格式
 * @param hex HEX颜色字符串
 * @param alpha 透明度 (0-1)
 * @returns RGBA颜色对象
 */
export const hexToRgba = (hex: string, alpha: number = 1): RGBA | null => {
  const rgb = hexToRgb(hex);
  return rgb ? { ...rgb, a: alpha } : null;
};

/**
 * 将RGB转换为HSL格式
 * @param rgb RGB颜色对象
 * @returns HSL颜色对象
 */
export const rgbToHsl = (rgb: RGB): HSL => {
  const { r, g, b } = rgb;
  const rp = r / 255;
  const gp = g / 255;
  const bp = b / 255;

  const max = Math.max(rp, gp, bp);
  const min = Math.min(rp, gp, bp);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rp:
        h = (gp - bp) / d + (gp < bp ? 6 : 0);
        break;
      case gp:
        h = (bp - rp) / d + 2;
        break;
      case bp:
        h = (rp - gp) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

/**
 * 将HSL转换为RGB格式
 * @param hsl HSL颜色对象
 * @returns RGB颜色对象
 */
export const hslToRgb = (hsl: HSL): RGB => {
  let { h, s, l } = hsl;
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

/**
 * 将颜色分量转换为HEX格式
 * @param c 颜色分量值 (0-255)
 * @returns 两位HEX字符串
 */
const componentToHex = (c: number): string => {
  const hex = Math.max(0, Math.min(255, c)).toString(16);
  return hex.length === 1 ? "0" + hex : hex;
};

/**
 * 解析颜色字符串为RGB或RGBA对象
 * @param color 颜色字符串
 * @returns RGB或RGBA对象
 */
export const parseColor = (color: string): RGB | RGBA | null => {
  // 处理HEX格式
  if (color.startsWith("#")) {
    return hexToRgb(color) || null;
  }

  // 处理RGB格式
  const rgbMatch = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i.exec(color);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    };
  }

  // 处理RGBA格式
  const rgbaMatch = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/i.exec(
    color
  );
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1]),
      g: parseInt(rgbaMatch[2]),
      b: parseInt(rgbaMatch[3]),
      a: parseFloat(rgbaMatch[4]),
    };
  }

  return null;
};

/**
 * 格式化RGB为CSS字符串
 * @param rgb RGB颜色对象
 * @returns CSS RGB字符串
 */
export const formatRgbString = (rgb: RGB): string => {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

/**
 * 格式化RGBA为CSS字符串
 * @param rgba RGBA颜色对象
 * @returns CSS RGBA字符串
 */
export const formatRgbaString = (rgba: RGBA): string => {
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
};

/**
 * 格式化HSL为CSS字符串
 * @param hsl HSL颜色对象
 * @returns CSS HSL字符串
 */
export const formatHslString = (hsl: HSL): string => {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
};
