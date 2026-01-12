import { Category, Rank } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'c1',
    title: '1. Zielerreichung und strategischer Fit',
    weight: 15,
    kpis: [
      { id: '1.1', text: 'Zielbild war klar, messbar, schriftlich vorhanden' },
      { id: '1.2', text: 'Problemdefinition fachlich, nicht technisch, war sauber' },
      { id: '1.3', text: 'Zielkennzahlen wurden erreicht' },
      { id: '1.4', text: 'Nutzen war vor Go Live validiert, Pilot oder Test' },
      { id: '1.5', text: 'Abweichungen sind dokumentiert und begründet' },
    ],
  },
  {
    id: 'c2',
    title: '2. Operative Effizienz und Wirtschaftlichkeit',
    weight: 20,
    kpis: [
      { id: '2.1', text: 'Bearbeitungszeit pro Vorgang sank' },
      { id: '2.2', text: 'Manuelle Tätigkeiten gingen zurück' },
      { id: '2.3', text: 'Fehler oder Nacharbeit gingen zurück' },
      { id: '2.4', text: 'Budget und Zeitplan wurden eingehalten' },
      { id: '2.5', text: 'Betriebskosten sind tragbar und transparent' },
    ],
  },
  {
    id: 'c3',
    title: '3. Nutzen für Bürgerinnen und Bürger',
    weight: 20,
    kpis: [
      { id: '3.1', text: 'Warte- und Durchlaufzeiten für Bürger wurden besser' },
      { id: '3.2', text: 'Servicequalität stieg, gemessen über Feedback oder Beschwerden' },
      { id: '3.3', text: 'Nutzungsrate des digitalen Angebots stieg' },
      { id: '3.4', text: 'Barrierefreiheit ist erfüllt' },
      { id: '3.5', text: 'Fairness, keine systematische Benachteiligung nachweisbar' },
    ],
  },
  {
    id: 'c4',
    title: '4. Daten und KI Qualität',
    weight: 15,
    kpis: [
      { id: '4.1', text: 'Datenqualität ist definiert und wird überwacht' },
      { id: '4.2', text: 'Daten sind aktuell, Vollständigkeit ist akzeptabel' },
      { id: '4.3', text: 'Modellleistung ist messbar und ausreichend' },
      { id: '4.4', text: 'Ergebnisse sind fachlich plausibel und erklärbar' },
      { id: '4.5', text: 'Monitoring für Drift, Fehler, Bias ist aktiv' },
    ],
  },
  {
    id: 'c5',
    title: '5. Recht, Datenschutz, IT Sicherheit',
    weight: 20,
    kpis: [
      { id: '5.1', text: 'Rechtsgrundlage dokumentiert' },
      { id: '5.2', text: 'DSGVO Prüfung, TOMs, Löschkonzept vorhanden' },
      { id: '5.3', text: 'DSFA durchgeführt falls nötig' },
      { id: '5.4', text: 'IT Sicherheitsanforderungen erfüllt, Audit oder Test' },
      { id: '5.5', text: 'Transparenz, Dokumentation, Nachvollziehbarkeit vorhanden' },
    ],
  },
  {
    id: 'c6',
    title: '6. Akzeptanz und Organisation',
    weight: 5,
    kpis: [
      { id: '6.1', text: 'Mitarbeitende nutzen das System wirklich im Alltag' },
      { id: '6.2', text: 'Schulung und Change waren ausreichend' },
      { id: '6.3', text: 'Rollen, Zuständigkeiten, Support sind geklärt' },
    ],
  },
  {
    id: 'c7',
    title: '7. Nachhaltigkeit und Wiederverwendbarkeit',
    weight: 5,
    kpis: [
      { id: '7.1', text: 'Betrieb und Wartung sind langfristig gesichert' },
      { id: '7.2', text: 'Lösung ist skalierbar und integrierbar' },
      { id: '7.3', text: 'Wiederverwendung für andere Bereiche ist realistisch' },
    ],
  },
];

export const RANKING_CONFIG: Record<Rank, { label: string; color: string; description: string; min: number; max: number }> = {
  TOP: {
    label: 'TOP',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    description: 'Mehrwert klar, skalieren.',
    min: 240,
    max: 300,
  },
  GOOD: {
    label: 'GUT',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    description: 'Weiterführen, Optimierung einplanen.',
    min: 180,
    max: 239,
  },
  CRITICAL: {
    label: 'KRITISCH',
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    description: 'Nur weiter mit klarer Nachsteuerung.',
    min: 120,
    max: 179,
  },
  FAILED: {
    label: 'NICHT ERFOLGREICH',
    color: 'text-red-700 bg-red-50 border-red-200',
    description: 'Stoppen oder neu aufsetzen.',
    min: 0,
    max: 119,
  },
};

export const SCALE_LABELS = {
  0: 'Nicht erfüllt',
  1: 'Teilweise',
  2: 'Erfüllt',
  3: 'Übertroffen',
};