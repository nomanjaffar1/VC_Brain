import { z } from 'zod';

export const SignalSchema = z.object({
  id: z.string().uuid(),
  founder_id: z.string().uuid().nullable(),
  company_id: z.string().uuid().nullable(),
  source_channel: z.string(),
  raw_payload: z.any(),
  ingested_at: z.date(),
});
export type Signal = z.infer<typeof SignalSchema>;

export const MemoryEventSchema = z.object({
  id: z.string().uuid(),
  founder_id: z.string().uuid(),
  event_type: z.enum(['GITHUB_REPO_STARRED', 'HACKATHON_WON', 'APPLICATION_SUBMITTED', 'COMMITTEE_DECISION']),
  delta_score: z.number(),
  timestamp: z.date(),
});
export type MemoryEvent = z.infer<typeof MemoryEventSchema>;

export const FounderSchema = z.object({
  id: z.string().uuid(),
  public_keys: z.record(z.string()), 
  founder_score: z.number(),
  created_at: z.date(),
});
export type Founder = z.infer<typeof FounderSchema>;

export const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  canonical_profile: z.record(z.any()),
});
export type Company = z.infer<typeof CompanySchema>;

export const OpportunitySchema = z.object({
  id: z.string().uuid(),
  company_id: z.string().uuid(),
  thesis_id: z.string().uuid().nullable(),
  status: z.enum(['SOURCED', 'SCREENING', 'DILIGENCE_ACTIVE', 'DECIDED']),
  created_at: z.date(),
});
export type Opportunity = z.infer<typeof OpportunitySchema>;

export const ClaimSchema = z.object({
  claim_text: z.string(),
  source_domain: z.string(),
  agent_confidence: z.number(),
});
export type Claim = z.infer<typeof ClaimSchema>;

export const CommitteeVoteSchema = z.object({
  id: z.string().uuid().optional(),
  due_diligence_id: z.string().uuid(),
  agent_id: z.string(),
  vote: z.enum(['APPROVE', 'REJECT', 'FURTHER_DD']),
  confidence: z.number(),
  rationale: z.string(),
  claims: z.array(ClaimSchema).optional(),
});
export type CommitteeVote = z.infer<typeof CommitteeVoteSchema>;

export const DecisionSchema = z.object({
  id: z.string().uuid().optional(),
  opportunity_id: z.string().uuid(),
  final_recommendation: z.enum(['APPROVE', 'REJECT', 'FURTHER_DD']),
  calibrated_trust_score: z.number(),
  investment_memo: z.any(),
});
export type Decision = z.infer<typeof DecisionSchema>;
