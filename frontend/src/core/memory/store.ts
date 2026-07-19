import { Company, FounderScore, RawSignal } from './types';

// In-memory data foundation
class MemoryStore {
  private companies: Map<string, Company> = new Map();
  private founderScores: Map<string, FounderScore> = new Map();
  private signals: Map<string, RawSignal> = new Map();

  // --- Companies ---
  public getCompanies(): Company[] {
    return Array.from(this.companies.values());
  }

  public getCompany(id: string): Company | undefined {
    return this.companies.get(id);
  }

  public saveCompany(company: Company) {
    this.companies.set(company.id, company);
  }

  // --- Founder Scores (Persistent across applications) ---
  public getFounderScore(founderId: string): FounderScore | undefined {
    return this.founderScores.get(founderId);
  }

  public saveFounderScore(score: FounderScore) {
    this.founderScores.set(score.founderId, score);
  }

  // --- Signals ---
  public ingestSignal(signal: RawSignal) {
    // Deduplicate by ID
    if (!this.signals.has(signal.id)) {
      this.signals.set(signal.id, signal);
    }
  }

  public getAllSignals(): RawSignal[] {
    return Array.from(this.signals.values());
  }
}

export const memoryStore = new MemoryStore();

// --- Seed Synthetic Data ---
export function seedSyntheticData() {
  const f1Score: FounderScore = {
    id: 'fs-1',
    founderId: 'f-1',
    score: 85,
    history: [{ date: new Date().toISOString(), score: 85, reason: 'Initial ingestion from GH & HN' }]
  };
  memoryStore.saveFounderScore(f1Score);

  const f2Score: FounderScore = {
    id: 'fs-2',
    founderId: 'f-2',
    score: 60, // Cold start example
    history: [{ date: new Date().toISOString(), score: 60, reason: 'First time founder, moderate public footprint' }]
  };
  memoryStore.saveFounderScore(f2Score);

  memoryStore.saveCompany({
    id: 'c-1',
    name: 'Nexus API',
    description: 'Unified billing infrastructure for AI agents.',
    founders: [{ id: 'f-1', name: 'Alice Chen', trackRecord: 'proven', publicFootprintScore: 92 }],
    stage: 'Pre-Seed',
    signals: [],
    pipelineStage: 'sourcing',
  });

  memoryStore.saveCompany({
    id: 'c-2',
    name: 'VoltStream',
    description: 'Data streaming for edge devices.',
    founders: [{ id: 'f-2', name: 'Bob Smith', trackRecord: 'first-time', publicFootprintScore: 65 }],
    stage: 'Idea',
    signals: [],
    pipelineStage: 'screening',
  });
}

seedSyntheticData();
