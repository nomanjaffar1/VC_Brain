import { Company, Founder } from '../../memory/types';
import { memoryStore } from '../../memory/store';

export class Scorer {
  // Cold Start handler logic: if trackRecord is 'first-time', rely heavily on public footprint
  private scoreFounder(founder: Founder): { score: number, trend: 'improving' | 'stable' | 'declining' } {
    const memoryScore = memoryStore.getFounderScore(founder.id);
    
    let baseScore = 50;
    if (founder.trackRecord === 'proven') {
      baseScore = 80;
    } else {
      // Cold Start logic: Use alternative signals for first-time founders
      baseScore = 40 + (founder.publicFootprintScore * 0.4); // max 40 additional points
    }

    // Blend with historical persistent score if it exists
    if (memoryScore) {
      baseScore = (baseScore + memoryScore.score) / 2;
    }

    return {
      score: Math.min(100, Math.max(0, Math.round(baseScore))),
      trend: 'improving' // Simplified for MVP
    };
  }

  public scoreCompany(company: Company): Company {
    // 1. Founder Axis (aggregate founders)
    const founderScores = company.founders.map(f => this.scoreFounder(f));
    const avgFounderScore = founderScores.reduce((sum, f) => sum + f.score, 0) / founderScores.length;

    // 2. Market Axis
    // In a full implementation, we'd use LLM to score the market based on description/signals.
    // We mock a score here based on the presence of strong keywords.
    let marketScore = 60;
    if (company.description.toLowerCase().includes('ai') || company.description.toLowerCase().includes('infra')) {
      marketScore = 85;
    }

    // 3. Idea vs Market Axis
    let ideaScore = 70;
    if (company.stage === 'Pre-Seed') {
      ideaScore = 65; // High risk early on
    } else if (company.stage === 'Seed') {
      ideaScore = 75;
    }

    const scoredCompany = {
      ...company,
      scores: {
        founder: avgFounderScore,
        founderTrend: 'improving' as const,
        market: marketScore,
        marketTrend: 'stable' as const,
        ideaVsMarket: ideaScore,
        ideaVsMarketTrend: 'improving' as const,
        trustScore: 80 // Base trust score, will be refined by Trust/LLM layer later
      }
    };

    return scoredCompany;
  }
}

export const scorer = new Scorer();
