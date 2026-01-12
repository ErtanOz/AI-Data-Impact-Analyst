import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { AssessmentResult } from '../types';

interface RadarSummaryProps {
  data: AssessmentResult['categoryScores'];
}

const RadarSummary: React.FC<RadarSummaryProps> = ({ data }) => {
  // Transform data for Radar Chart
  // We want to show the percentage achievement per category to compare them fairly
  const chartData = data.map((cat) => ({
    subject: `Cat ${cat.id.replace('c', '')}`,
    fullSubject: cat.title,
    A: Math.round(cat.percentage), // 0 to 100
    fullMark: 100,
  }));

  // Create a summary string for screen readers
  const accessibleSummary = data.map(cat => `${cat.title}: ${Math.round(cat.percentage)}%`).join(', ');

  return (
    <div 
      className="h-64 w-full" 
      role="img" 
      aria-label={`Netzdiagramm der 7 Kategorien. Erfüllungsgrade: ${accessibleSummary}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Erfüllung %"
            dataKey="A"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.6}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarSummary;