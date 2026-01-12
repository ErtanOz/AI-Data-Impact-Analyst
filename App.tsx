import React, { useState, useMemo } from 'react';
import { CATEGORIES, RANKING_CONFIG } from './constants';
import { ScoreState, AssessmentResult, Rank } from './types';
import CategorySection from './components/CategorySection';
import GaugeChart from './components/GaugeChart';
import RadarSummary from './components/RadarSummary';
import { Printer, Download, RotateCcw, Loader2 } from 'lucide-react';

export default function App() {
  // Initialize state with 0s for all KPIs
  const initialScores: ScoreState = {};
  CATEGORIES.forEach(cat => {
    initialScores[cat.id] = {};
    cat.kpis.forEach(kpi => {
      initialScores[cat.id][kpi.id] = 0;
    });
  });

  const [scores, setScores] = useState<ScoreState>(initialScores);
  // Allow 'ALL' to expand everything for print/pdf views
  const [openSectionId, setOpenSectionId] = useState<string | 'ALL' | null>(CATEGORIES[0].id);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const handleScoreChange = (catId: string, kpiId: string, val: number) => {
    setScores(prev => ({
      ...prev,
      [catId]: {
        ...prev[catId],
        [kpiId]: val
      }
    }));
  };

  const reset = () => {
    if (confirm('Wollen Sie wirklich alle Bewertungen zurücksetzen?')) {
        setScores(initialScores);
        setOpenSectionId(CATEGORIES[0].id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrint = async () => {
    const previousState = openSectionId;
    setOpenSectionId('ALL');
    // Wait for render to update DOM
    await new Promise(resolve => setTimeout(resolve, 500));
    window.print();
    // Optional: revert state after print dialog closes (though JS execution pauses in some browsers)
    // We leave it expanded as it's often less confusing if the user cancels print
    setOpenSectionId(previousState);
  };

  const handleDownloadPDF = async () => {
    setIsPdfLoading(true);
    const previousState = openSectionId;
    setOpenSectionId('ALL');
    
    // Wait for render/animations
    await new Promise(resolve => setTimeout(resolve, 800));

    const element = document.getElementById('report-content');
    
    // Configuration for html2pdf
    const opt = {
      margin:       [10, 10, 15, 10], // top, left, bottom, right in mm
      filename:     `AI-Data-Impact-Report-${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      // @ts-ignore - html2pdf is loaded from CDN
      await window.html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error('PDF Generation failed', e);
      alert('Fehler beim Generieren des PDFs.');
    } finally {
      setIsPdfLoading(false);
      setOpenSectionId(previousState);
    }
  };

  // Calculation Logic
  const result: AssessmentResult = useMemo(() => {
    let totalScore = 0;
    const categoryScores = CATEGORIES.map(cat => {
      const kpiScores = scores[cat.id] || {};
      const rawScoreSum = cat.kpis.reduce((sum, kpi) => sum + (kpiScores[kpi.id] || 0), 0);
      const kpiCount = cat.kpis.length;
      
      // Max possible raw score for this category
      const maxRawScore = kpiCount * 3;
      
      // Calculate weighted contribution
      const averageScore = kpiCount > 0 ? rawScoreSum / kpiCount : 0;
      const weightedScore = averageScore * cat.weight;
      
      totalScore += weightedScore;

      return {
        id: cat.id,
        title: cat.title,
        score: weightedScore,
        maxPotential: 3 * cat.weight,
        percentage: maxRawScore > 0 ? (rawScoreSum / maxRawScore) * 100 : 0
      };
    });

    // Determine Rank
    let rank: Rank = 'FAILED';
    if (totalScore >= RANKING_CONFIG.TOP.min) rank = 'TOP';
    else if (totalScore >= RANKING_CONFIG.GOOD.min) rank = 'GOOD';
    else if (totalScore >= RANKING_CONFIG.CRITICAL.min) rank = 'CRITICAL';

    return {
      totalScore,
      maxScore: 300,
      rank,
      categoryScores
    };
  }, [scores]);

  const rankingInfo = RANKING_CONFIG[result.rank];

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Wrapper ID for PDF generation */}
      <div id="report-content">
        
        {/* Header */}
        <header className="bg-slate-900 text-white pt-10 pb-24 px-4 shadow-lg print:shadow-none print:pb-6 print:pt-6 print:bg-white print:text-black">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">AI & Data Impact Analyst</h1>
                <p className="text-slate-300 print:text-slate-600 max-w-xl text-base">
                  Professionelles Bewertungstool für KI- und Datenprojekte. 
                  Evaluieren Sie Erfolg anhand von Datenqualität, KI-Ethik, Effizienz und operativem Nutzen.
                </p>
              </div>
              
              {/* Actions - Hidden in Print and PDF */}
              <div 
                className="flex gap-2 no-print" 
                data-html2canvas-ignore="true"
              >
                <button 
                  onClick={reset}
                  disabled={isPdfLoading}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Zurücksetzen"
                  aria-label="Alle Bewertungen zurücksetzen"
                >
                  <RotateCcw className="w-5 h-5" aria-hidden="true" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
                <button 
                  onClick={handlePrint}
                  disabled={isPdfLoading}
                  className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white"
                  title="Drucken"
                  aria-label="Bericht drucken"
                >
                  <Printer className="w-5 h-5" aria-hidden="true" />
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  disabled={isPdfLoading}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white"
                  title="Als PDF herunterladen"
                  aria-label="Bericht als PDF speichern"
                >
                  {isPdfLoading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Download className="w-5 h-5" aria-hidden="true" />}
                  <span className="hidden sm:inline">PDF Speichern</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 -mt-16 space-y-8" role="main">
          
          {/* Dashboard Card */}
          <section aria-label="Ergebnisübersicht" className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100 flex flex-col md:flex-row gap-8 items-center justify-between print:shadow-none print:border-2 print:border-slate-800 print-break-inside-avoid">
            
            {/* Gauge & Score */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <GaugeChart score={result.totalScore} max={result.maxScore} />
              <div className={`mt-4 px-4 py-2 rounded-full border text-sm font-bold tracking-wide ${rankingInfo.color}`}>
                {rankingInfo.label}
              </div>
            </div>

            {/* Recommendation Text */}
            <div className="w-full md:w-1/3 text-center md:text-left">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Bewertung</h3>
              <p className="text-xl font-medium text-slate-800 mb-2">
                {result.totalScore.toFixed(1)} / 300 Punkte
              </p>
              <p className="text-slate-700 leading-relaxed text-sm">
                {rankingInfo.description}
              </p>
            </div>

            {/* Radar Chart */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="w-full h-40">
                  <RadarSummary data={result.categoryScores} />
              </div>
              <p className="text-xs text-slate-500 mt-2" aria-hidden="true">Dimensions-Balance</p>
            </div>
          </section>

          {/* Categories List */}
          <section className="space-y-4 print:space-y-8" aria-label="KPI Checkliste">
              <div className="flex items-center justify-between no-print" data-html2canvas-ignore="true">
                  <h2 className="text-xl font-bold text-slate-800">Checkliste</h2>
                  <span className="text-sm text-slate-600">
                      Skala: 0 (Nicht erfüllt) bis 3 (Übertroffen)
                  </span>
              </div>
            
            {CATEGORIES.map((cat) => (
              <CategorySection
                key={cat.id}
                category={cat}
                scores={scores}
                onScoreChange={handleScoreChange}
                isOpen={openSectionId === 'ALL' || openSectionId === cat.id}
                onToggle={() => setOpenSectionId(openSectionId === cat.id ? null : cat.id)}
              />
            ))}
          </section>

          {/* Detailed Breakdown - Visible in Print/PDF, Hidden in App */}
          <section className="hidden print:block pdf-show-block mt-8 print-break-inside-avoid" aria-label="Detaillierte Ergebnistabelle">
             <div className="p-6 bg-white border border-slate-200 rounded-xl">
                <h2 className="text-xl font-bold mb-4 text-slate-800">Ergebnis Details</h2>
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="py-2 font-semibold text-slate-800">Bereich</th>
                      <th className="py-2 text-right font-semibold text-slate-800">Gewicht</th>
                      <th className="py-2 text-right font-semibold text-slate-800">Score</th>
                      <th className="py-2 text-right font-semibold text-slate-800">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.categoryScores.map(c => (
                      <tr key={c.id} className="border-b border-slate-100">
                        <td className="py-2 text-slate-800">{c.title}</td>
                        <td className="py-2 text-right text-slate-700">{CATEGORIES.find(cat => cat.id === c.id)?.weight}%</td>
                        <td className="py-2 text-right font-mono font-medium text-slate-900">{c.score.toFixed(1)}</td>
                        <td className="py-2 text-right text-slate-500 font-mono">{c.maxPotential}</td>
                      </tr>
                    ))}
                    <tr className="font-bold border-t border-slate-300 bg-slate-50">
                      <td className="py-3 pl-2 text-slate-900">Gesamt</td>
                      <td className="py-3 text-right">100%</td>
                      <td className="py-3 text-right text-blue-700">{result.totalScore.toFixed(1)}</td>
                      <td className="py-3 text-right pr-2 text-slate-900">300</td>
                    </tr>
                  </tbody>
                </table>
             </div>
          </section>

        </main>

        {/* Footer with Credits */}
        <footer className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-500 text-sm print:py-6">
            <p>
                &copy; {new Date().getFullYear()} Created by AI, Ertan Özcan,{' '}
                <a 
                    href="https://www.digitalheritagelab.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-slate-800 underline decoration-slate-300 underline-offset-4 transition-all"
                >
                    www.digitalheritagelab.com
                </a>
            </p>
        </footer>
      </div>
      
      {/* Sticky footer mobile only - Hidden in print/pdf */}
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg z-50 flex justify-between items-center no-print"
        data-html2canvas-ignore="true"
        role="complementary"
        aria-label="Mobile Score Zusammenfassung"
      >
          <div>
            <span className="text-xs text-slate-600 block">Gesamtpunkte</span>
            <span className="font-bold text-lg text-slate-900">{Math.round(result.totalScore)} <span className="text-slate-500 text-sm">/ 300</span></span>
          </div>
           <div className={`px-3 py-1 rounded-full text-xs font-bold ${rankingInfo.color}`}>
              {rankingInfo.label}
           </div>
      </div>
    </div>
  );
}