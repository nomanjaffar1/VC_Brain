export interface ThesisConfig {
  sectors: string[];
  stages: string[];
  geographies: string[];
  checkSizeMin: number;
  checkSizeMax: number;
  ownershipTarget: number;
  riskAppetite: 'low' | 'medium' | 'high';
}

class ThesisEngine {
  private config: ThesisConfig = {
    sectors: ['AI Infra', 'DevTools', 'Fintech'],
    stages: ['Pre-Seed', 'Seed'],
    geographies: ['US', 'Europe'],
    checkSizeMin: 50000,
    checkSizeMax: 250000,
    ownershipTarget: 10,
    riskAppetite: 'medium'
  };

  public getConfig(): ThesisConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<ThesisConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public evaluateMatch(company: any): number {
    // A simplified matching logic against the thesis
    let score = 100;
    
    // Stage penalty
    if (!this.config.stages.includes(company.stage)) {
      score -= 30;
    }

    // In a full implementation, we'd use the LLM to parse the company description 
    // against the sectors and geographies. For now, simple keyword match.
    const desc = company.description.toLowerCase();
    const matchesSector = this.config.sectors.some(s => desc.includes(s.toLowerCase()));
    
    if (!matchesSector) {
      score -= 20;
    }

    return Math.max(0, score);
  }
}

export const thesisEngine = new ThesisEngine();
