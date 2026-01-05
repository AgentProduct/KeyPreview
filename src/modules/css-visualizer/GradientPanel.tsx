import React from "react";
import type { GradientConfig, ColorStop } from "./cssUtils";
import { generateGradientCSS } from "./cssUtils";
import "./GradientPanel.css";

// 生成唯一ID
const generateUniqueId = () => {
  return `stop-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// 预设渐变配置
export const gradientPresets: GradientConfig[] = [
  {
    name: "水平渐变",
    type: 'linear',
    linearDirection: 'to right',
    colorStops: [
      { id: generateUniqueId(), position: 0, color: '#4facfe' },
      { id: generateUniqueId(), position: 100, color: '#00f2fe' }
    ]
  },
  {
    name: "垂直渐变",
    type: 'linear',
    linearDirection: 'to bottom',
    colorStops: [
      { id: generateUniqueId(), position: 0, color: '#fa709a' },
      { id: generateUniqueId(), position: 100, color: '#fee140' }
    ]
  },
  {
    name: "对角线渐变",
    type: 'linear',
    linearDirection: '135deg',
    colorStops: [
      { id: generateUniqueId(), position: 0, color: '#84fab0' },
      { id: generateUniqueId(), position: 100, color: '#8fd3f4' }
    ]
  },
  {
    name: "径向渐变",
    type: 'radial',
    radialShape: 'circle',
    radialSize: 'closest-side',
    radialPosition: 'center',
    colorStops: [
      { id: generateUniqueId(), position: 0, color: '#ff9a9e' },
      { id: generateUniqueId(), position: 100, color: '#fad0c4' }
    ]
  },
  {
    name: "椭圆渐变",
    type: 'radial',
    radialShape: 'ellipse',
    radialSize: 'farthest-corner',
    radialPosition: 'top left',
    colorStops: [
      { id: generateUniqueId(), position: 0, color: '#a1c4fd' },
      { id: generateUniqueId(), position: 100, color: '#c2e9fb' }
    ]
  },
  {
    name: "圆锥渐变",
    type: 'conic',
    conicFrom: 'from 0deg',
    conicAt: 'at center',
    colorStops: [
      { id: generateUniqueId(), position: 0, color: '#ff512f' },
      { id: generateUniqueId(), position: 50, color: '#f09819' },
      { id: generateUniqueId(), position: 100, color: '#ff512f' }
    ]
  },
  { name: "复古渐变", type: 'linear', linearDirection: 'to bottom', colorStops: [
    { id: generateUniqueId(), position: 0, color: '#833ab4' },
    { id: generateUniqueId(), position: 50, color: '#fd1d1d' },
    { id: generateUniqueId(), position: 100, color: '#fcb045' }
  ] },
  { name: "冷色调渐变", type: 'radial', radialShape: 'circle', radialSize: 'farthest-corner', radialPosition: 'center', colorStops: [
    { id: generateUniqueId(), position: 0, color: '#00c6ff' },
    { id: generateUniqueId(), position: 100, color: '#0072ff' }
  ] },
  { name: "热色调渐变", type: 'conic', conicFrom: 'from 90deg', conicAt: 'at center', colorStops: [
    { id: generateUniqueId(), position: 0, color: '#ff416c' },
    { id: generateUniqueId(), position: 50, color: '#ff4b2b' },
    { id: generateUniqueId(), position: 100, color: '#ff416c' }
  ] },
  { name: "Warm Flame", type: "linear", linearDirection: "to right", colorStops: [ { id: generateUniqueId(), color: "#ff9a9e", position: 0 }, { id: generateUniqueId(), color: "#fad0c4", position: 100 } ] },
  { name: "Night Fade", type: "linear", linearDirection: "to bottom", colorStops: [ { id: generateUniqueId(), color: "#a18cd1", position: 0 }, { id: generateUniqueId(), color: "#fbc2eb", position: 100 } ] },
  { name: "Sunny Morning", type: "linear", linearDirection: "to right", colorStops: [ { id: generateUniqueId(), color: "#f6d365", position: 0 }, { id: generateUniqueId(), color: "#fda085", position: 100 } ] },
  { name: "Instagram Style", type: "radial", radialShape: "circle", radialSize: "farthest-corner", radialPosition: "center", colorStops: [ { id: generateUniqueId(), color: "#feda75", position: 0 }, { id: generateUniqueId(), color: "#fa7e1e", position: 30 }, { id: generateUniqueId(), color: "#d62976", position: 50 }, { id: generateUniqueId(), color: "#962fbf", position: 70 }, { id: generateUniqueId(), color: "#4f5bd5", position: 100 } ] },
  { name: "Deep Purple", type: "linear", linearDirection: "135deg", colorStops: [ { id: generateUniqueId(), color: "#667eea", position: 0 }, { id: generateUniqueId(), color: "#764ba2", position: 100 } ] },
  { name: "Ocean Blue", type: "linear", linearDirection: "to bottom", colorStops: [ { id: generateUniqueId(), color: "#2196f3", position: 0 }, { id: generateUniqueId(), color: "#21cbf3", position: 100 } ] },
  { name: "Chrome Conic", type: "conic", conicFrom: "from 0deg", conicAt: "at center", colorStops: [ { id: generateUniqueId(), color: "#DB4437", position: 0 }, { id: generateUniqueId(), color: "#DB4437", position: 33 }, { id: generateUniqueId(), color: "#0F9D58", position: 33 }, { id: generateUniqueId(), color: "#0F9D58", position: 66 }, { id: generateUniqueId(), color: "#F4B400", position: 66 }, { id: generateUniqueId(), color: "#F4B400", position: 100 } ] },
  { name: "Mesh Dream", type: "radial", radialShape: "ellipse", radialSize: "farthest-corner", radialPosition: "center", colorStops: [ { id: generateUniqueId(), color: "#667eea", position: 0 }, { id: generateUniqueId(), color: "transparent", position: 50 }, { id: generateUniqueId(), color: "#764ba2", position: 100 } ] },
  { name: "Retro Wave", type: "linear", linearDirection: "to right", colorStops: [ { id: generateUniqueId(), color: "#ff6e7f", position: 0 }, { id: generateUniqueId(), color: "#bfe9ff", position: 100 } ] },
  { name: "Peach Sunset", type: "linear", linearDirection: "to bottom right", colorStops: [ { id: generateUniqueId(), color: "#ff9a9e", position: 0 }, { id: generateUniqueId(), color: "#fecfef", position: 50 }, { id: generateUniqueId(), color: "#fecfef", position: 100 } ] },
  { name: "Forest Green", type: "linear", linearDirection: "to bottom", colorStops: [ { id: generateUniqueId(), color: "#4CAF50", position: 0 }, { id: generateUniqueId(), color: "#8BC34A", position: 50 }, { id: generateUniqueId(), color: "#CDDC39", position: 100 } ] },
  { name: "Desert Sand", type: "linear", linearDirection: "to right", colorStops: [ { id: generateUniqueId(), color: "#F5DEB3", position: 0 }, { id: generateUniqueId(), color: "#DEB887", position: 50 }, { id: generateUniqueId(), color: "#D2B48C", position: 100 } ] },
  { name: "Arctic Ice", type: "radial", radialShape: "circle", radialSize: "farthest-side", radialPosition: "center", colorStops: [ { id: generateUniqueId(), color: "#87CEEB", position: 0 }, { id: generateUniqueId(), color: "#E0F7FA", position: 100 } ] },
  { name: "Vivid Sunset", type: "linear", linearDirection: "135deg", colorStops: [ { id: generateUniqueId(), color: "#FF5722", position: 0 }, { id: generateUniqueId(), color: "#FF9800", position: 50 }, { id: generateUniqueId(), color: "#FFEB3B", position: 100 } ] },
  { name: "Electric Purple", type: "conic", conicFrom: "from 90deg", conicAt: "at center", colorStops: [ { id: generateUniqueId(), color: "#9C27B0", position: 0 }, { id: generateUniqueId(), color: "#E1BEE7", position: 50 }, { id: generateUniqueId(), color: "#9C27B0", position: 100 } ] }
];

interface GradientPanelProps {
  config: GradientConfig;
  onChange: (config: GradientConfig) => void;
}

const GradientPanel: React.FC<GradientPanelProps> = ({ config, onChange }) => {
  // 更新渐变类型
  const handleTypeChange = (type: GradientConfig["type"]) => {
    // 根据新类型创建基础配置
    let newConfig;

    // 根据类型添加特定属性
    switch(type) {
      case 'linear':
        newConfig = {
          name: config.name,
          type: 'linear' as const,
          colorStops: config.colorStops,
          linearDirection: 'to right' // 默认线性方向
        };
        break;
      case 'radial':
        newConfig = {
          name: config.name,
          type: 'radial' as const,
          colorStops: config.colorStops,
          radialShape: 'circle',
          radialSize: 'closest-side',
          radialPosition: 'center'
        };
        break;
      case 'conic':
        newConfig = {
          name: config.name,
          type: 'conic' as const,
          colorStops: config.colorStops,
          conicFrom: 'from 0deg',
          conicAt: 'at center'
        };
        break;
      default:
        // 处理无效类型
        console.error('Invalid gradient type:', type);
        return;
    }
    onChange(newConfig);
  };

  // 更新线性渐变方向
  const handleLinearDirectionChange = (direction: string) => {
    if (config.type !== 'linear') return;
    onChange({ ...config, linearDirection: direction });
  };

  // 更新径向渐变属性
  const handleRadialPropertyChange = (
    property: "radialShape" | "radialSize" | "radialPosition",
    value: string
  ) => {
    onChange({ ...config, [property]: value });
  };

  // 更新圆锥渐变属性
  const handleConicPropertyChange = (
    property: "conicFrom" | "conicAt",
    value: string
  ) => {
    onChange({ ...config, [property]: value });
  };

  // 更新颜色停止点
  const handleColorStopChange = (
    id: string,
    property: "color" | "position" | "alpha",
    value: string | number
  ) => {
    // 如果是更新位置，需要添加位置限制逻辑
    if (property === "position") {
      const newPosition = Number(value);

      // 找到当前停止点的索引和前后停止点
      const stopIndex = config.colorStops.findIndex((stop: ColorStop) => stop.id === id);
      const prevStop = config.colorStops[stopIndex - 1];
      const nextStop = config.colorStops[stopIndex + 1];

      // 计算允许的最小和最大位置
      let minPosition = 0;
      let maxPosition = 100;

      if (prevStop) {
        minPosition = prevStop.position;
      }

      if (nextStop) {
        maxPosition = nextStop.position;
      }

      // 确保新位置在允许范围内
      const clampedPosition = Math.max(minPosition, Math.min(maxPosition, newPosition));

      const newColorStops = config.colorStops.map(stop =>
        stop.id === id ? { ...stop, [property]: clampedPosition } : stop
      );

      onChange({ ...config, colorStops: newColorStops });
    } else if (property === "alpha") {
      const newAlpha = Math.max(0, Math.min(1, Number(value)));
      const newColorStops = config.colorStops.map(stop =>
        stop.id === id ? { ...stop, alpha: newAlpha } : stop
      );
      onChange({ ...config, colorStops: newColorStops });
    } else {
      // 如果是更新颜色，确保值是字符串
      const newColorStops = config.colorStops.map(stop =>
        stop.id === id ? { ...stop, [property]: String(value) } : stop
      );

      onChange({ ...config, colorStops: newColorStops });
    }
  };

  // 添加颜色停止点
  const handleAddColorStop = () => {
    // 确保端点存在
    const newStops = [...config.colorStops];

    // 如果没有停止点，添加默认的起始和结束点
    if (newStops.length === 0) {
      newStops.push({ id: generateUniqueId(), color: "#000000", position: 0 });
      newStops.push({ id: generateUniqueId(), color: "#ffffff", position: 100 });
    } else {
      // 找到最合适的位置添加新停止点（在最长的颜色段中间）
      let maxSegmentLength = 0;
      let insertIndex = 1;

      for (let i = 0; i < newStops.length - 1; i++) {
        const segmentLength = newStops[i + 1].position - newStops[i].position;
        if (segmentLength > maxSegmentLength) {
          maxSegmentLength = segmentLength;
          insertIndex = i + 1;
        }
      }

      const newPosition = Math.round((newStops[insertIndex - 1].position + newStops[insertIndex].position) / 2);
      const newColorStop: ColorStop = {
        id: generateUniqueId(),
        color: "#ffffff",
        position: newPosition
      };

      newStops.splice(insertIndex, 0, newColorStop);
    }

    // 确保颜色停止点按位置排序
    const sortedStops = [...newStops]
      .sort((a, b) => a.position - b.position);

    onChange({ ...config, colorStops: sortedStops });
  };

  // 删除颜色停止点
  const handleRemoveColorStop = (id: string) => {
    if (config.colorStops.length <= 2) {
      alert("至少需要两个颜色停止点");
      return;
    }

    const newColorStops = config.colorStops.filter((stop: ColorStop) => stop.id !== id);

    onChange({ ...config, colorStops: newColorStops });
  };

  // 获取拖拽元素应该插入到哪个元素之后
  // 暂时注释掉未使用的函数，保留实现思路以便后续扩展
  /* const getDragAfterElement = (container: HTMLElement, y: number): HTMLElement | null => {
    const draggableElements = [...container.querySelectorAll('.color-stop:not(.color-stop-endpoint):not(.dragging)')];

    const result = draggableElements.reduce<{ offset: number; element: HTMLElement | null }>((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      const element = child as HTMLElement;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: element };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY, element: null });

    return result.element;
  }; */

  // 应用预设
  const handlePresetChange = (presetIndex: number) => {
    const preset = gradientPresets[presetIndex];
    // 根据预设类型创建只包含该类型属性的配置
    let presetConfig;
    switch(preset.type) {
      case 'linear':
        presetConfig = {
          name: preset.name,
          type: preset.type,
          linearDirection: preset.linearDirection,
          colorStops: preset.colorStops
        };
        break;
      case 'radial':
        presetConfig = {
          name: preset.name,
          type: preset.type,
          radialShape: preset.radialShape,
          radialSize: preset.radialSize,
          radialPosition: preset.radialPosition,
          colorStops: preset.colorStops
        };
        break;
      case 'conic':
        presetConfig = {
          name: preset.name,
          type: preset.type,
          conicFrom: preset.conicFrom,
          conicAt: preset.conicAt,
          colorStops: preset.colorStops
        };
        break;
      default:
        presetConfig = preset;
    }
    onChange({ ...config, ...presetConfig });
  };

  // 生成随机颜色
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // 随机生成渐变色
  const handleRandomGradient = () => {
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    
    const newColorStops: ColorStop[] = [
      { id: generateUniqueId(), color: color1, position: 0 },
      { id: generateUniqueId(), color: color2, position: 100 }
    ];
    
    onChange({ 
      ...config, 
      type: 'linear', 
      linearDirection: 'to right',
      colorStops: newColorStops 
    });
  };

  return (
    <div className="gradient-panel">
      <div className="control-group">
        <label>渐变类型：</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="linear"
              checked={config.type === "linear"}
              onChange={() => handleTypeChange("linear")}
            />
            线性渐变
          </label>
          <label>
            <input
              type="radio"
              value="radial"
              checked={config.type === "radial"}
              onChange={() => handleTypeChange("radial")}
            />
            径向渐变
          </label>
          <label>
            <input
              type="radio"
              value="conic"
              checked={config.type === "conic"}
              onChange={() => handleTypeChange("conic")}
            />
            圆锥渐变
          </label>
        </div>
      </div>

      {/* 线性渐变配置 */}
      {config.type === "linear" && (
        <div className="control-group">
          <label>方向：</label>
          <select
            value={config.linearDirection}
            onChange={(e) => handleLinearDirectionChange(e.target.value)}
          >
            <option value="to top">向上</option>
            <option value="to top right">向右上</option>
            <option value="to right">向右</option>
            <option value="to bottom right">向右下</option>
            <option value="to bottom">向下</option>
            <option value="to bottom left">向左下</option>
            <option value="to left">向左</option>
            <option value="to top left">向左上</option>
            <option value="0deg">0度（向上）</option>
            <option value="45deg">45度（向右上）</option>
            <option value="90deg">90度（向右）</option>
            <option value="135deg">135度（向右下）</option>
            <option value="180deg">180度（向下）</option>
            <option value="225deg">225度（向左下）</option>
            <option value="270deg">270度（向左）</option>
            <option value="315deg">315度（向左上）</option>
          </select>
        </div>
      )}

      {/* 径向渐变配置 */}
      {config.type === "radial" && (
        <>
          <div className="control-group">
            <label>形状：</label>
            <select
              value={config.radialShape}
              onChange={(e) => handleRadialPropertyChange(
                "radialShape",
                e.target.value
              )}
            >
              <option value="circle">圆形</option>
              <option value="ellipse">椭圆形</option>
            </select>
          </div>

          <div className="control-group">
            <label>大小：</label>
            <select
              value={config.radialSize}
              onChange={(e) => handleRadialPropertyChange(
                "radialSize",
                e.target.value
              )}
            >
              <option value="closest-side">最近边</option>
              <option value="closest-corner">最近角</option>
              <option value="farthest-side">最远边</option>
              <option value="farthest-corner">最远角</option>
              <option value="100%">100%</option>
              <option value="50%">50%</option>
            </select>
          </div>

          <div className="control-group">
            <label>位置：</label>
            <select
              value={config.radialPosition}
              onChange={(e) => handleRadialPropertyChange(
                "radialPosition",
                e.target.value
              )}
            >
              <option value="center">中心</option>
              <option value="top">顶部</option>
              <option value="right">右侧</option>
              <option value="bottom">底部</option>
              <option value="left">左侧</option>
              <option value="top left">左上角</option>
              <option value="top right">右上角</option>
              <option value="bottom right">右下角</option>
              <option value="bottom left">左下角</option>
            </select>
          </div>
        </>
      )}

      {/* 圆锥渐变配置 */}
      {config.type === "conic" && (
        <>
          <div className="control-group">
            <label>起始角度：</label>
            <select
              value={config.conicFrom}
              onChange={(e) => handleConicPropertyChange(
                "conicFrom",
                e.target.value
              )}
            >
              <option value="from 0deg">0度</option>
              <option value="from 45deg">45度</option>
              <option value="from 90deg">90度</option>
              <option value="from 135deg">135度</option>
              <option value="from 180deg">180度</option>
              <option value="from 225deg">225度</option>
              <option value="from 270deg">270度</option>
              <option value="from 315deg">315度</option>
            </select>
          </div>

          <div className="control-group">
            <label>中心点：</label>
            <select
              value={config.conicAt}
              onChange={(e) => handleConicPropertyChange(
                "conicAt",
                e.target.value
              )}
            >
              <option value="at center">中心</option>
              <option value="at top">顶部</option>
              <option value="at right">右侧</option>
              <option value="at bottom">底部</option>
              <option value="at left">左侧</option>
              <option value="at top left">左上角</option>
              <option value="at top right">右上角</option>
              <option value="at bottom right">右下角</option>
              <option value="at bottom left">左下角</option>
            </select>
          </div>
        </>
      )}

      {/* 颜色停止点配置 */}
      <div className="color-stops-section">
        <div className="color-stops-header">
          <h3>颜色停止点</h3>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{config.colorStops.length} 个</span>
        </div>
        
        <div 
          className="gradient-preview-bar"
          style={{ background: generateGradientCSS(config) }}
        >
          {config.colorStops.map((stop: ColorStop) => (
            <div
              key={stop.id}
              className="stop-marker"
              style={{ left: `${stop.position}%` }}
              data-position={stop.position}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', stop.id);
              }}
            />
          ))}
        </div>
        
        <div className="color-stops-list">
          {config.colorStops
            .sort((a: ColorStop, b: ColorStop) => a.position - b.position)
            .map((stop: ColorStop, index: number) => {
            const isEndpoint = stop.position === 0 || stop.position === 100;
            return (
              <div 
                key={stop.id} 
                className={`compact-stop-item ${isEndpoint ? 'endpoint' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.add('drag-over');
                }}
                onDragLeave={(e) => {
                  e.stopPropagation();
                  const relatedTarget = e.relatedTarget as Node | null;
                  if (!e.currentTarget.contains(relatedTarget)) {
                    e.currentTarget.classList.remove('drag-over');
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const draggedStopId = e.dataTransfer.getData('text/plain');
                  const draggedIndex = parseInt(e.dataTransfer.getData('drag-index') || '0');
                  
                  e.currentTarget.classList.remove('drag-over');
                  
                  if (draggedStopId === stop.id) return;
                  
                  const sortedStops = [...config.colorStops].sort((a: ColorStop, b: ColorStop) => a.position - b.position);
                  const draggedStop = sortedStops[draggedIndex];
                  
                  if (!draggedStop) return;
                  
                  const colors = sortedStops.map(s => s.color);
                  const draggedColor = colors[draggedIndex];
                  colors.splice(draggedIndex, 1);
                  const insertIndex = colors.findIndex((_, i) => sortedStops[i].position >= stop.position);
                  const finalIndex = insertIndex === -1 ? colors.length : insertIndex;
                  colors.splice(finalIndex, 0, draggedColor);
                  
                  const finalSortedStops = sortedStops.map((s, i) => ({
                    ...s,
                    color: colors[i]
                  }));
                  
                  onChange({ ...config, colorStops: finalSortedStops });
                }}
              >
                <div 
                  className="drag-handle"
                  title="拖拽交换位置"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', stop.id);
                    e.dataTransfer.setData('drag-index', String(index));
                    e.dataTransfer.effectAllowed = 'move';
                    e.currentTarget.classList.add('dragging');
                  }}
                  onDragEnd={(e) => {
                    e.currentTarget.classList.remove('dragging');
                    document.querySelectorAll('.compact-stop-item').forEach(el => el.classList.remove('drag-over'));
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <circle cx="8" cy="6" r="2" />
                    <circle cx="16" cy="6" r="2" />
                    <circle cx="8" cy="12" r="2" />
                    <circle cx="16" cy="12" r="2" />
                    <circle cx="8" cy="18" r="2" />
                    <circle cx="16" cy="18" r="2" />
                  </svg>
                </div>
                
                <div 
                  className="color-preview-dot"
                  style={{ backgroundColor: stop.color }}
                >
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => handleColorStopChange(stop.id, "color", e.target.value)}
                  />
                </div>
                
                <div className="color-info">
                  <span className="color-hex">{stop.color}</span>
                  <span className="color-position-label">{isEndpoint ? (stop.position === 0 ? '起始点' : '结束点') : `位置 ${stop.position}%`}</span>
                </div>
                
                <div className="compact-position-control">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stop.position}
                    onChange={(e) => handleColorStopChange(stop.id, "position", parseInt(e.target.value))}
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={stop.position}
                    onChange={(e) => handleColorStopChange(stop.id, "position", Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="position-number"
                  />
                </div>
                
                <div className="compact-alpha-control">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.floor((stop.alpha ?? 1) * 100)}
                    onChange={(e) => handleColorStopChange(stop.id, "alpha", parseInt(e.target.value) / 100)}
                  />
                  <span className="alpha-percent">{Math.floor((stop.alpha ?? 1) * 100)}%</span>
                </div>
                
                {config.colorStops.length > 2 && (
                  <button
                    className="compact-delete-btn"
                    onClick={() => handleRemoveColorStop(stop.id)}
                    title="删除"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
        
        <button className="compact-add-btn" onClick={handleAddColorStop}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" />
          </svg>
          添加颜色停止点
        </button>
      </div>

      {/* 渐变预设 */}
      <div className="control-group">
        <label>渐变预设：</label>
        <div className="preset-section">
          {gradientPresets.map((preset, index) => (
            <div
              key={index}
              className="preset-item"
              onClick={() => handlePresetChange(index)}
            >
              <div
                className="preset-preview"
                style={{ background: generateGradientCSS({ ...config, ...preset }) }}
              ></div>
              <div className="preset-name">{preset.name}</div>
            </div>
          ))}
        </div>
        
        <div className="gradient-controls">
          <button 
            className="random-gradient-button"
            onClick={handleRandomGradient}
          >
            🎲 随机生成渐变色
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradientPanel;