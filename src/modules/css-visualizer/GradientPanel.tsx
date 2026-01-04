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
  // 1. Warm Flame（温暖火焰）- 热门经典
  {
    name: "Warm Flame",
    type: "linear",
    linearDirection: "to right",
    radialShape: "circle",
    radialSize: "closest-side",
    radialPosition: "center",
    conicFrom: "from 0deg",
    conicAt: "at center",
    colorStops: [
      { id: generateUniqueId(), color: "#ff9a9e", position: 0 },
      { id: generateUniqueId(), color: "#fad0c4", position: 100 }
    ]
  },
  // 2. Night Fade（夜色渐变）
  {
    name: "Night Fade",
    type: "linear",
    linearDirection: "to bottom",
    colorStops: [
      { id: generateUniqueId(), color: "#a18cd1", position: 0 },
      { id: generateUniqueId(), color: "#fbc2eb", position: 100 }
    ]
  },
  // 3. Sunny Morning（阳光早晨）
  {
    name: "Sunny Morning",
    type: "linear",
    linearDirection: "to right",
    colorStops: [
      { id: generateUniqueId(), color: "#f6d365", position: 0 },
      { id: generateUniqueId(), color: "#fda085", position: 100 }
    ]
  },
  // 4. Instagram Style（多色径向，类似IG图标）
  {
    name: "Instagram Style",
    type: "radial",
    radialShape: "circle",
    radialSize: "farthest-corner",
    radialPosition: "center",
    colorStops: [
      { id: generateUniqueId(), color: "#feda75", position: 0 },
      { id: generateUniqueId(), color: "#fa7e1e", position: 30 },
      { id: generateUniqueId(), color: "#d62976", position: 50 },
      { id: generateUniqueId(), color: "#962fbf", position: 70 },
      { id: generateUniqueId(), color: "#4f5bd5", position: 100 }
    ]
  },
  // 5. Deep Purple（深紫梦幻）
  {
    name: "Deep Purple",
    type: "linear",
    linearDirection: "135deg",
    colorStops: [
      { id: generateUniqueId(), color: "#667eea", position: 0 },
      { id: generateUniqueId(), color: "#764ba2", position: 100 }
    ]
  },
  // 6. Ocean Blue（海洋蓝）
  {
    name: "Ocean Blue",
    type: "linear",
    linearDirection: "to bottom",
    colorStops: [
      { id: generateUniqueId(), color: "#2196f3", position: 0 },
      { id: generateUniqueId(), color: "#21cbf3", position: 100 }
    ]
  },
  // 7. Chrome Conic（圆锥渐变，类似Chrome图标）
  {
    name: "Chrome Conic",
    type: "conic",
    conicFrom: "from 0deg",
    conicAt: "at center",
    colorStops: [
      { id: generateUniqueId(), color: "#DB4437", position: 0 },
      { id: generateUniqueId(), color: "#DB4437", position: 33 },
      { id: generateUniqueId(), color: "#0F9D58", position: 33 },
      { id: generateUniqueId(), color: "#0F9D58", position: 66 },
      { id: generateUniqueId(), color: "#F4B400", position: 66 },
      { id: generateUniqueId(), color: "#F4B400", position: 100 }
    ]
  },
  // 8. Mesh Dream（潮流网格风多径向叠加感）
  {
    name: "Mesh Dream",
    type: "radial",
    radialShape: "ellipse",
    radialSize: "farthest-corner",
    radialPosition: "center",
    colorStops: [
      { id: generateUniqueId(), color: "#667eea", position: 0 },
      { id: generateUniqueId(), color: "transparent", position: 50 },
      { id: generateUniqueId(), color: "#764ba2", position: 100 }
    ]
  },
  // 9. Retro Wave（复古波浪）
  {
    name: "Retro Wave",
    type: "linear",
    linearDirection: "to right",
    colorStops: [
      { id: generateUniqueId(), color: "#ff6e7f", position: 0 },
      { id: generateUniqueId(), color: "#bfe9ff", position: 100 }
    ]
  },
  // 10. Peach Sunset（桃色日落）
  {
    name: "Peach Sunset",
    type: "linear",
    linearDirection: "to bottom right",
    colorStops: [
      { id: generateUniqueId(), color: "#ff9a9e", position: 0 },
      { id: generateUniqueId(), color: "#fecfef", position: 50 },
      { id: generateUniqueId(), color: "#fecfef", position: 100 }
    ]
  },
  // 11. Forest Green（森林绿）
  {
    name: "Forest Green",
    type: "linear",
    linearDirection: "to bottom",
    colorStops: [
      { id: generateUniqueId(), color: "#4CAF50", position: 0 },
      { id: generateUniqueId(), color: "#8BC34A", position: 50 },
      { id: generateUniqueId(), color: "#CDDC39", position: 100 }
    ]
  },
  // 12. Desert Sand（沙漠沙色）
  {
    name: "Desert Sand",
    type: "linear",
    linearDirection: "to right",
    colorStops: [
      { id: generateUniqueId(), color: "#F5DEB3", position: 0 },
      { id: generateUniqueId(), color: "#DEB887", position: 50 },
      { id: generateUniqueId(), color: "#D2B48C", position: 100 }
    ]
  },
  // 13. Arctic Ice（北极冰蓝）
  {
    name: "Arctic Ice",
    type: "radial",
    radialShape: "circle",
    radialSize: "farthest-side",
    radialPosition: "center",
    colorStops: [
      { id: generateUniqueId(), color: "#87CEEB", position: 0 },
      { id: generateUniqueId(), color: "#E0F7FA", position: 100 }
    ]
  },
  // 14. Vivid Sunset（生动日落）
  {
    name: "Vivid Sunset",
    type: "linear",
    linearDirection: "135deg",
    colorStops: [
      { id: generateUniqueId(), color: "#FF5722", position: 0 },
      { id: generateUniqueId(), color: "#FF9800", position: 50 },
      { id: generateUniqueId(), color: "#FFEB3B", position: 100 }
    ]
  },
  // 15. Electric Purple（电光紫）
  {
    name: "Electric Purple",
    type: "conic",
    conicFrom: "from 90deg",
    conicAt: "at center",
    colorStops: [
      { id: generateUniqueId(), color: "#9C27B0", position: 0 },
      { id: generateUniqueId(), color: "#E1BEE7", position: 50 },
      { id: generateUniqueId(), color: "#9C27B0", position: 100 }
    ]
  }
];

interface GradientPanelProps {
  config: GradientConfig;
  onChange: (config: GradientConfig) => void;
}

const GradientPanel: React.FC<GradientPanelProps> = ({ config, onChange }) => {
  // 更新渐变类型
  const handleTypeChange = (type: GradientConfig["type"]) => {
    onChange({ ...config, type });
  };

  // 更新线性渐变方向
  const handleLinearDirectionChange = (direction: string) => {
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
    property: "color" | "position",
    value: string | number
  ) => {
    // 如果是更新位置，需要添加位置限制逻辑
    if (property === "position") {
      const newPosition = Number(value);

      // 找到当前停止点的索引和前后停止点
      const stopIndex = config.colorStops.findIndex(stop => stop.id === id);
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

    const newColorStops = config.colorStops.filter(stop => stop.id !== id);

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
    onChange({ ...config, ...preset });
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
        <h3>颜色停止点</h3>
        {config.colorStops.map((stop) => {
          // 基于位置值判断端点（0%和100%）
          const isEndpoint = stop.position === 0 || stop.position === 100;
          return (
            <div
              key={stop.id}
              className={`color-stop ${isEndpoint ? 'color-stop-endpoint' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                // 拖拽经过时添加高亮效果
                const target = e.currentTarget as HTMLElement;
                target.classList.add('drag-over');
              }}
              onDragLeave={(e) => {
                // 离开时移除高亮效果
                const target = e.currentTarget as HTMLElement;
                target.classList.remove('drag-over');
              }}
              onDrop={(e) => {
                e.preventDefault();
                const draggedStopId = e.dataTransfer.getData('text/plain');

                // 移除所有高亮效果
                document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

                // 找到被拖拽的停止点和目标停止点的索引
                const draggedStopIndex = config.colorStops.findIndex(s => s.id === draggedStopId);
                const targetStopIndex = config.colorStops.findIndex(s => s.id === stop.id);

                // 如果起始位置和目标位置相同，不进行任何操作
                if (draggedStopIndex === targetStopIndex) return;

                // 创建新的停止点数组并执行拖拽操作
                const newColorStops = [...config.colorStops];
                const [draggedStop] = newColorStops.splice(draggedStopIndex, 1);
                newColorStops.splice(targetStopIndex, 0, draggedStop);

                // 优化：保持位置不变，只按新顺序交换颜色值
                // 1. 先按位置排序原停止点，确定位置顺序
                const sortedByPosition = [...config.colorStops].sort((a, b) => a.position - b.position);
                
                // 2. 获取拖拽后的新顺序的颜色列表
                const newOrderColors = newColorStops.map(stop => stop.color);
                
                // 3. 为每个按位置排序的停止点应用新顺序的颜色
                const finalSortedStops = sortedByPosition.map((stop, index) => {
                  return {
                    ...stop,
                    // 按新顺序应用颜色，保持原位置不变
                    color: newOrderColors[index]
                  };
                });

                onChange({ ...config, colorStops: finalSortedStops });
              }}
              onDragEnd={() => {
                // 拖拽结束时移除所有高亮效果
                document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
              }}
            >
              <div style={{ textAlign: 'left'}}>
                <div
                  className="drag-handle"
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', stop.id);
                    const target = e.target as HTMLElement;
                    target.closest('.color-stop')?.classList.add('dragging');
                  }}
                  onDragEnd={(e) => {
                    const target = e.target as HTMLElement;
                    target.closest('.color-stop')?.classList.remove('dragging');
                  }}
                >
                  ⋮⋮
                </div>
              </div>
              <div className="color-stop-input">
                <label>颜色：</label>
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => handleColorStopChange(stop.id, "color", e.target.value)}
                  title={isEndpoint ? '端点颜色可调整' : '颜色可调整'}
                />
              </div>
              <div className="color-stop-input">
                <div style={{ paddingBottom: 20 }}>
                  <label>位置：</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stop.position}
                    onChange={(e) => handleColorStopChange(stop.id, "position", parseInt(e.target.value))}
                    title={isEndpoint ? '端点位置可调整' : '位置可调整'}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={stop.position}
                    onChange={(e) => handleColorStopChange(stop.id, "position", parseInt(e.target.value) || 0)}
                    className="position-input"
                    title={isEndpoint ? '端点位置可调整' : '位置可调整'}
                  />
                  <span>%</span>
                </div>
              </div>
              {config.colorStops.length > 2 && (
                <button
                  className="remove-color-stop"
                  onClick={() => handleRemoveColorStop(stop.id)}
                >
                  删除
                </button>
              )}
            </div>
          );
        })}
        <button className="add-color-stop" onClick={handleAddColorStop}>
          添加颜色停止点
        </button>
      </div>
    </div>
  );
};

export default GradientPanel;