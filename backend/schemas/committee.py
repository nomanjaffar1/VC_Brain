from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class Evidence(BaseModel):
    id: str
    source: str
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Claim(BaseModel):
    claim_text: str
    source_domain: str
    agent_confidence: float

class MoatScores(BaseModel):
    technology: int = 0
    distribution: int = 0
    data: int = 0
    community: int = 0
    network: int = 0

class FounderScores(BaseModel):
    execution: int = 0
    technical: int = 0
    leadership: int = 0
    oss: int = 0
    research: int = 0
    experience: str = "Unknown"

class MarketMetrics(BaseModel):
    market_size_billions: float = 0.0
    growth_rate: float = 0.0
    competition_level: str = "Unknown"
    timing: str = "Unknown"

class CommitteeVote(BaseModel):
    agent_id: str
    vote: str = Field(description="Must be APPROVE, REJECT, or FURTHER_DD")
    confidence: float
    rationale: str
    claims: List[Claim] = []
    risks: List[str] = []
    missing_evidence: List[str] = []
    moat_scores: Optional[MoatScores] = None
    founder_scores: Optional[FounderScores] = None
    market_metrics: Optional[MarketMetrics] = None

class DecisionResponse(BaseModel):
    opportunity_id: str
    final_recommendation: str
    calibrated_trust_score: float
    investment_memo: Dict[str, Any]
    validation_score: float

class ValidationItem(BaseModel):
    claim_text: str
    status: str = Field(description="Must be SUPPORTED, UNVERIFIED, or CONTRADICTS")
    evidence_found: str

class ValidatorResponse(BaseModel):
    verified_claims: int
    unverified_claims: int
    contradictions: int
    missing_evidence_list: List[str]
    validation_coverage: float
    trust_penalty: float
    validation_log: List[ValidationItem]
