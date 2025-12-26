import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3Background: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const mouseX = useRef<number | null>(null);
  const mouseY = useRef<number | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 设置SVG大小
    svg.attr('width', width).attr('height', height);

    // 创建粒子系统
    const particleCount = 200;
    const particles = d3.range(particleCount).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      radius: Math.random() * 3 + 1,
      color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`
    }));

    // 创建粒子组
    const particleGroup = svg.append('g');

    // 创建粒子元素
    const particleElements = particleGroup.selectAll('circle')
      .data(particles)
      .enter()
      .append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      .attr('opacity', 0.6);

    // 创建连接线组
    const lineGroup = svg.append('g');

    // 动画函数
    const animate = () => {
      // 更新粒子位置
      particles.forEach(particle => {
        // 应用鼠标吸引力
        if (mouseX.current !== null && mouseY.current !== null) {
          const dx = mouseX.current - particle.x;
          const dy = mouseY.current - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 200;
          
          if (distance < maxDistance && distance > 0) {
            const force = (maxDistance - distance) / maxDistance;
            particle.vx += (dx / distance) * force * 0.1;
            particle.vy += (dy / distance) * force * 0.1;
          }
        }

        // 速度限制
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        const maxSpeed = 2;
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        // 边界检测
        if (particle.x < 0 || particle.x > width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(width, particle.x));
        }
        if (particle.y < 0 || particle.y > height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(height, particle.y));
        }
      });

      // 更新粒子元素
      particleElements
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      // 创建连接线
      lineGroup.selectAll('line').remove();

      // 计算并绘制连接线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            lineGroup.append('line')
              .attr('x1', particles[i].x)
              .attr('y1', particles[i].y)
              .attr('x2', particles[j].x)
              .attr('y2', particles[j].y)
              .attr('stroke', 'rgba(150, 150, 255, 0.3)')
              .attr('stroke-width', 1 - distance / 100);
          }
        }
      }

      // 继续动画
      requestAnimationFrame(animate);
    };

    // 开始动画
    animate();

    // 窗口大小变化处理
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      svg.attr('width', newWidth).attr('height', newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      svg.selectAll('*').remove();
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.current = event.clientX;
      mouseY.current = event.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default D3Background;