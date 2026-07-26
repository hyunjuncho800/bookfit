import React from 'react';
import type { DomainCategory } from '../../types';

interface RadarChartProps {
  scores: Record<DomainCategory, number>; // 0 ~ 100
}

export const RadarChart: React.FC<RadarChartProps> = ({ scores }) => {
  // 4 Axes Angles: Top (0deg -> -90deg in standard SVG), Right, Bottom, Left
  // Angle order:
  // 0: Comprehension (Top) -> (0, -1)
  // 1: Vocabulary (Right) -> (1, 0)
  // 2: Metacognition (Bottom) -> (0, 1)
  // 3: Decoding (Left) -> (-1, 0)

  const size = 300;
  const center = size / 2;
  const radius = 100;

  const categories: { key: DomainCategory; label: string; angle: number }[] = [
    { key: 'comprehension', label: '독해 / 추론력', angle: -Math.PI / 2 },
    { key: 'vocabulary', label: '어휘 / 문장구조', angle: 0 },
    { key: 'metacognition', label: '메타인지 독서', angle: Math.PI / 2 },
    { key: 'decoding', label: '기초 해독유창성', angle: Math.PI },
  ];

  // Concentric Grid Polygons (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (r: number, angle: number) => {
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Build Data Polygon Points
  const polygonPoints = categories
    .map((cat) => {
      const scoreRatio = (scores[cat.key] || 0) / 100;
      const { x, y } = getCoordinates(radius * scoreRatio, cat.angle);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-cream-light border border-oak/30 rounded-2xl shadow-sm">
      
      {/* SVG Chart Area */}
      <svg width={size} height={size} className="overflow-visible">
        
        {/* Background Grid Circles / Squares */}
        {gridLevels.map((level, idx) => {
          const levelRadius = radius * level;
          const points = categories
            .map((cat) => {
              const { x, y } = getCoordinates(levelRadius, cat.angle);
              return `${x},${y}`;
            })
            .join(' ');
          return (
            <polygon
              key={idx}
              points={points}
              className="fill-none stroke-[#EAE3D2] stroke-1"
              strokeDasharray={level === 1.0 ? undefined : '3,3'}
            />
          );
        })}

        {/* Axis Lines */}
        {categories.map((cat, idx) => {
          const { x, y } = getCoordinates(radius, cat.angle);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              className="stroke-[#EAE3D2] stroke-1"
            />
          );
        })}

        {/* Score Data Area (Filled Polygon) */}
        <polygon
          points={polygonPoints}
          className="fill-forest/20 stroke-forest stroke-2 transition-all duration-700 ease-out"
        />

        {/* Score Data Dots */}
        {categories.map((cat, idx) => {
          const scoreRatio = (scores[cat.key] || 0) / 100;
          const { x, y } = getCoordinates(radius * scoreRatio, cat.angle);
          return (
            <g key={idx} className="group">
              <circle
                cx={x}
                cy={y}
                r="6"
                className="fill-oak stroke-forest stroke-2 transition-transform duration-300 group-hover:scale-125"
              />
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                className="fill-forest font-bold text-[11px] font-sans"
              >
                {scores[cat.key]}점
              </text>
            </g>
          );
        })}

        {/* Category Labels */}
        {categories.map((cat, idx) => {
          const { x, y } = getCoordinates(radius + 28, cat.angle);
          return (
            <text
              key={idx}
              x={x}
              y={y + 4}
              textAnchor="middle"
              className="fill-charcoal font-bold text-xs font-serif"
            >
              {cat.label}
            </text>
          );
        })}

      </svg>

      {/* Legend Badge */}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-forest"></span>
          <span className="text-charcoal font-medium">우리 아이 진단 지수</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-oak"></span>
          <span className="text-charcoal-muted">영역별 측정치</span>
        </div>
      </div>

    </div>
  );
};
