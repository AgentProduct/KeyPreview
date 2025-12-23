import type { RGB } from "./colorConverter";

/**
 * 预设颜色列表
 */
export const presetColors = [
  { name: "红色", value: "#ff0000" },
  { name: "橙色", value: "#ff7f00" },
  { name: "黄色", value: "#ffff00" },
  { name: "绿色", value: "#00ff00" },
  { name: "青色", value: "#00ffff" },
  { name: "蓝色", value: "#0000ff" },
  { name: "紫色", value: "#800080" },
  { name: "黑色", value: "#000000" },
  { name: "白色", value: "#ffffff" },
  { name: "灰色", value: "#808080" },
  { name: "浅灰", value: "#c0c0c0" },
  { name: "深灰", value: "#404040" },
  { name: "粉红", value: "#ffc0cb" },
  { name: "棕色", value: "#a52a2a" },
  { name: "海军蓝", value: "#000080" },
  { name: "橄榄绿", value: "#808000" },
];

/**
 * 常用的品牌颜色
 */
export const brandColors = [
  { name: "Google蓝", value: "#4285f4" },
  { name: "Google红", value: "#ea4335" },
  { name: "Google黄", value: "#fbbc05" },
  { name: "Google绿", value: "#34a853" },
  { name: "Facebook蓝", value: "#1877f2" },
  { name: "Twitter蓝", value: "#1da1f2" },
  { name: "Instagram粉", value: "#c13584" },
  { name: "GitHub灰", value: "#24292e" },
  { name: "VS Code蓝", value: "#007acc" },
  { name: "React蓝", value: "#61dafb" },
  { name: "Vue绿", value: "#4fc08d" },
  { name: "Angular红", value: "#dd0031" },
];

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean> 是否复制成功
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // 现代浏览器API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const success = document.execCommand("copy");
      textArea.remove();
      return success;
    }
  } catch (error) {
    console.error("复制失败:", error);
    return false;
  }
};

/**
 * 生成随机颜色
 * @returns RGB颜色对象
 */
export const generateRandomColor = (): RGB => {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  };
};

/**
 * 判断颜色是否为深色
 * @param rgb RGB颜色对象
 * @returns boolean 是否为深色
 */
export const isDarkColor = (rgb: RGB): boolean => {
  // 计算亮度 (HSP 公式)
  const { r, g, b } = rgb;
  const brightness = Math.sqrt(
    0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)
  );

  // 亮度低于127.5被视为深色
  return brightness < 127.5;
};

/**
 * 获取颜色的对比度文本颜色
 * @param rgb RGB颜色对象
 * @returns string 文本颜色 ('#ffffff' 或 '#000000')
 */
export const getContrastTextColor = (rgb: RGB): string => {
  return isDarkColor(rgb) ? "#ffffff" : "#000000";
};

/**
 * 调整颜色亮度
 * @param rgb RGB颜色对象
 * @param percent 亮度调整百分比 (-100 到 100)
 * @returns RGB颜色对象
 */
export const adjustBrightness = (rgb: RGB, percent: number): RGB => {
  const factor = 1 + percent / 100;
  return {
    r: Math.max(0, Math.min(255, Math.round(rgb.r * factor))),
    g: Math.max(0, Math.min(255, Math.round(rgb.g * factor))),
    b: Math.max(0, Math.min(255, Math.round(rgb.b * factor))),
  };
};

/**
 * 计算两个颜色之间的色差（简单的欧几里得距离）
 * @param rgb1 第一个RGB颜色对象
 * @param rgb2 第二个RGB颜色对象
 * @returns number 颜色差异值
 */
export const calculateColorDifference = (rgb1: RGB, rgb2: RGB): number => {
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
  );
};

/**
 * 根据颜色值获取颜色名称
 * @param hex HEX颜色字符串
 * @returns string 颜色名称（如果找不到则返回'自定义颜色'）
 */
export const getColorName = (hex: string): string => {
  const allColors = [...presetColors, ...brandColors];
  const color = allColors.find(
    (c) => c.value.toLowerCase() === hex.toLowerCase()
  );
  return color ? color.name : "自定义颜色";
};

/**
 * 颜色值验证函数
 * @param color 颜色字符串
 * @returns boolean 是否为有效颜色
 */
export const isValidColor = (color: string): boolean => {
  // 验证HEX格式
  if (/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/.test(color)) {
    return true;
  }

  // 验证RGB格式
  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(color)) {
    return true;
  }

  // 验证RGBA格式
  if (/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/.test(color)) {
    return true;
  }

  // 验证HSL格式
  if (/^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/.test(color)) {
    return true;
  }

  // 验证HSLA格式
  if (/^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/.test(color)) {
    return true;
  }

  return false;
};
