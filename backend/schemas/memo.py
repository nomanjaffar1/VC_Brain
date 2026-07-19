from pydantic import BaseModel, Field
from typing import List

class SectionContent(BaseModel):
    summary: str
    evidence_citations: List[str] = Field(default_factory=list)
    missing_information: List[str] = Field(default_factory=list)

class InvestmentMemo(BaseModel):
    executive_summary: SectionContent
    founder_assessment: SectionContent
    technology: SectionContent
    market: SectionContent
    competition: SectionContent
    moat: SectionContent
    traction: SectionContent
    financial_signals: SectionContent
    risks: SectionContent
    due_diligence: SectionContent
    
    # Quantitative & Final Outcomes
    trust_score: float
    recommendation: str = Field(description="APPROVE, REJECT, or FURTHER_DD")
    confidence: float
    next_actions: List[str]
    supporting_evidence: List[str]
    missing_evidence: List[str]
