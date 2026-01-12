import React from 'react';
import { Category, KPI, ScoreState } from '../types';
import { SCALE_LABELS } from '../constants';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, XCircle, AlertCircle, Star } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

interface CategorySectionProps {
  category: Category;
  scores: ScoreState;
  onScoreChange: (catId: string, kpiId: string, value: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  scores,
  onScoreChange,
  isOpen,
  onToggle,
}) => {
  // Calculate completion for this section
  const answeredCount = category.kpis.reduce((acc, kpi) => {
    return acc + (scores[category.id]?.[kpi.id] !== undefined ? 1 : 0);
  }, 0);
  const isComplete = answeredCount === category.kpis.length;

  // Prepare data for the chart
  const chartData = category.kpis.map((kpi) => ({
    name: kpi.id,
    text: kpi.text,
    score: scores[category.id]?.[kpi.id] ?? 0,
  }));

  const getBarColor = (score: number) => {
    if (score === 3) return '#3b82f6'; // Blue for Exceeded
    if (score === 2) return '#10b981'; // Emerald for Met
    if (score === 1) return '#f59e0b'; // Amber for Partial
    return '#ef4444'; // Red for Not Met
  };

  const contentId = `cat-content-${category.id}`;
  const headerId = `cat-header-${category.id}`;

  return (
    <div className={`
      border border-slate-200 rounded-xl bg-white shadow-sm mb-4 
      print:mb-6 print:border-slate-300 print:shadow-none print-break-inside-avoid
      transition-all duration-300
    `}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        id={headerId}
        className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-colors text-left print:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-t-xl"
        data-html2canvas-ignore="true" 
      >
        <div className="flex items-center gap-3">
          {isComplete ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500" aria-hidden="true" />
          ) : (
            <div className="relative" aria-hidden="true">
                <Circle className="w-6 h-6 text-slate-300" />
                {answeredCount > 0 && (
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {answeredCount}
                    </span>
                )}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-slate-800 text-lg">{category.title}</h3>
            <p className="text-sm text-slate-600">Gewichtung: {category.weight}%</p>
          </div>
        </div>
        <div className="text-slate-400 no-print" aria-hidden="true">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      
      {isOpen && (
        <div 
          id={contentId}
          role="region"
          aria-labelledby={headerId}
          className="p-5 border-t border-slate-100 print:border-slate-200"
        >
          <div className="space-y-6 print:space-y-4">
            {category.kpis.map((kpi) => (
              <KPIRow
                key={kpi.id}
                kpi={kpi}
                value={scores[category.id]?.[kpi.id] ?? 0}
                onChange={(val) => onScoreChange(category.id, kpi.id, val)}
              />
            ))}
          </div>

          {/* Bar Chart Section */}
          <div className="mt-8 pt-6 border-t border-slate-100 print:break-inside-avoid" aria-hidden="true">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                 Score Übersicht
               </h4>
               <div className="h-40 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart 
                      data={chartData} 
                      margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
                   >
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#64748b', fontSize: 11}} 
                     />
                     <YAxis 
                        domain={[0, 3]} 
                        ticks={[0, 1, 2, 3]} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#64748b', fontSize: 11}} 
                     />
                     <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                             const data = payload[0].payload;
                             return (
                               <div className="bg-slate-800 text-white text-xs p-2 rounded shadow-xl max-w-[200px] z-50">
                                 <p className="font-bold mb-1">{label}</p>
                                 <p className="mb-2 opacity-90">{data.text}</p>
                                 <div className="flex items-center gap-2">
                                    <span className="font-bold">Score: {data.score}</span>
                                    <span className="opacity-70">({SCALE_LABELS[data.score as keyof typeof SCALE_LABELS]})</span>
                                 </div>
                               </div>
                             );
                          }
                          return null;
                        }}
                     />
                     {/* isAnimationActive={false} ensures PDF generation captures the bars correctly immediately */}
                     <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={32} isAnimationActive={false}>
                       {chartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
        </div>
      )}
    </div>
  );
};

interface KPIRowProps {
  kpi: KPI;
  value: number;
  onChange: (val: number) => void;
}

const KPIRow: React.FC<KPIRowProps> = ({ kpi, value, onChange }) => {
  const labelId = `kpi-label-${kpi.id}`;

  const getFeedbackConfig = (v: number) => {
    switch (v) {
      case 0: return { icon: XCircle, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
      case 1: return { icon: AlertCircle, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
      case 2: return { icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
      case 3: return { icon: Star, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' };
      default: return { icon: Circle, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200' };
    }
  };

  const config = getFeedbackConfig(value);
  const FeedbackIcon = config.icon;
  
  return (
    <div 
      className="py-3 border-b border-slate-100 last:border-0 print:border-slate-200"
      role="radiogroup"
      aria-labelledby={labelId}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left side: Icon + Text + Badge */}
        <div className="flex-1 flex gap-3 items-start">
          
          {/* Visual Indicator Icon */}
          <FeedbackIcon 
            className={`w-5 h-5 mt-0.5 shrink-0 transition-colors duration-300 ${config.color}`} 
            aria-hidden="true" 
          />

          <div>
            <p id={labelId} className="text-slate-800 text-sm md:text-base font-medium">
              {kpi.text}
            </p>
            
            <div className="mt-2 flex">
              <span className={`
                inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border
                ${config.bg} ${config.color} ${config.border} transition-colors duration-200
              `}>
                <FeedbackIcon className="w-3.5 h-3.5" />
                {SCALE_LABELS[value as keyof typeof SCALE_LABELS]}
              </span>
            </div>
          </div>
        </div>
        
        {/* Right side: Score Buttons */}
        <div 
          className="flex bg-slate-100 print:bg-transparent p-1 rounded-lg shrink-0 self-start md:self-center ml-8 md:ml-0" 
          data-html2canvas-ignore="true"
        >
          {[0, 1, 2, 3].map((score) => (
            <button
              key={score}
              role="radio"
              aria-checked={value === score}
              onClick={() => onChange(score)}
              aria-label={`${score} Punkte - ${SCALE_LABELS[score as keyof typeof SCALE_LABELS]}`}
              className={`
                w-10 h-9 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${
                  value === score
                    ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }
              `}
              title={SCALE_LABELS[score as keyof typeof SCALE_LABELS]}
            >
              {score}
            </button>
          ))}
        </div>

        {/* Static Display for Print/PDF */}
        <div className="hidden print:block pdf-show-block text-sm font-bold border px-3 py-1 rounded bg-slate-50 min-w-[3rem] text-center shrink-0 self-center">
           {value}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;