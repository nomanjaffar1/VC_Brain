export type PipelineStage = 'sourcing' | 'screening' | 'diligence' | 'decision';

export interface RawSignal {
  id: string;
  source: string; // e.g., 'github', 'hn', 'pitch_deck', 'linkedin'
  timestamp: string;
  payload: any;
  confidence: number;
}

export interface FounderScore {
  id: string;
  founderId: string;
  score: number; // 0-100
  history: { date: string; score: number; reason: string }[];
}

export interface Evidence {
  claim: string;
  sourceId: string;
  confidence: 'high' | 'medium' | 'low';
  supportType: 'supports' | 'contradicts' | 'neutral';
  excerpt: string;
}

export interface Founder {
  id: string;
  name: string;
  contact?: string;
  trackRecord: 'proven' | 'first-time';
  publicFootprintScore: number;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  founders: Founder[];
  stage: string;
  signals: RawSignal[];
  
  // Scoring
  scores?: {
    founder: number; // 0-100
    founderTrend: 'improving' | 'stable' | 'declining';
    market: number; // 0-100
    marketTrend: 'improving' | 'stable' | 'declining';
    ideaVsMarket: number; // 0-100
    ideaVsMarketTrend: 'improving' | 'stable' | 'declining';
    trustScore: number; // 0-100
    thesisMatch?: number;
  };
  
  // Pipeline
  pipelineStage: PipelineStage;
  
  // Memo
  memo?: InvestmentMemo;
}

export interface InvestmentMemo {
  snapshot: string;
  hypotheses: string[];
  swot: { type: 'strength' | 'weakness' | 'opportunity' | 'threat'; text: string }[];
  problemProduct: string;
  traction: string;
  gaps: string[];
  evidenceList: Evidence[];
}
