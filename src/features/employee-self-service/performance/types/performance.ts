export interface PerformanceMetricBreakdown {
  label: string;
  weight: number;
  score: number;
  maxScore: number;
  summary: string;
}

export interface InteractiveGoal {
  id: string;
  title: string;
  progress: number;
  status: 'on track' | 'in progress' | 'at risk' | 'completed';
}

export interface CompetencyItem {
  name: string;
  rating: number;
  managerComment: string;
  suggestedTraining: string;
}

export interface PerformanceHistoryMilestone {
  cycle: string;
  score: number;
  milestone?: string;
}

export interface MyPerformanceData {
  overallScore: number;
  maxOverallScore: number;
  ratingBand: string;
  trend: 'improved' | 'steady' | 'declined';
  daysRemaining: number;
  nextReviewDate: string;
  breakdown: PerformanceMetricBreakdown[];
  goals: InteractiveGoal[];
  competencies: CompetencyItem[];
  managerFeedback: string;
  incrementEligible: boolean;
  history: PerformanceHistoryMilestone[];
}
