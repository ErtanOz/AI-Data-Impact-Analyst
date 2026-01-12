import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  score: number;
  max: number;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ score, max }) => {
  // Normalize score to 180 degrees
  const percentage = Math.min(Math.max(score / max, 0), 1);
  const roundedScore = Math.round(score);
  
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: max - score },
  ];

  // Colors based on score range
  let color = '#ef4444'; // Red
  if (score >= 120) color = '#f59e0b'; // Amber
  if (score >= 180) color = '#3b82f6'; // Blue
  if (score >= 240) color = '#10b981'; // Emerald

  return (
    <div 
      className="relative h-48 w-full flex justify-center items-end overflow-hidden" 
      role="img" 
      aria-label={`Tachometerdiagramm: Aktueller Punktestand ist ${roundedScore} von ${max} möglichen Punkten.`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={120}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
            isAnimationActive={false}
          >
            <Cell key="score" fill={color} />
            <Cell key="remaining" fill="#e2e8f0" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 text-center pb-4 flex flex-col items-center" aria-hidden="true">
        <span className="text-4xl font-bold text-slate-800">{roundedScore}</span>
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Gesamtpunkte</span>
        <span className="text-xs text-slate-400">von {max}</span>
      </div>
    </div>
  );
};

export default GaugeChart;