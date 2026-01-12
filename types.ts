export interface KPI {
  id: string;
  text: string;
}

export interface Category {
  id: string;
  title: string;
  weight: number;
  kpis: KPI[];
}

export interface ScoreState {
  [categoryId: string]: {
    [kpiId: string]: number;
  };
}

export type Rank = 'TOP' | 'GOOD' | 'CRITICAL' | 'FAILED';

export interface AssessmentResult {
  totalScore: number;
  maxScore: number;
  rank: Rank;
  categoryScores: {
    id: string;
    title: string;
    score: number; // The weighted score for this category
    maxPotential: number; // The max weighted score for this category
    percentage: number;
  }[];
}