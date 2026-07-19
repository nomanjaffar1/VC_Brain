from pydantic import BaseModel, Field
from typing import List

class SectionContent(BaseModel):
    summary: str
    evidence_citations: List[str] = Field(default_factory=list)
    missing_information: List[str] = Field(default_factory=list)

class CompetitorAnalysis(BaseModel):
    name: str
    threat_level: str = Field(description="Low, Medium, or High")
    reason: str

class RiskMatrix(BaseModel):
    risk_type: str = Field(description="e.g. Technical, Market, Execution, Funding")
    level: str = Field(description="Low, Medium, or High")

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
    
    # New Bloomberg UI Fields (calculated by LLM)
    expected_upside_multiple: float = Field(default=0.0, description="AI Estimate of return multiple e.g. 7.4")
    investment_score: int = Field(default=0, description="0-100 overall investment score")
    competitor_analysis: List[CompetitorAnalysis] = Field(default_factory=list)
    risk_matrix: List[RiskMatrix] = Field(default_factory=list)
    due_diligence_questions: List[str] = Field(default_factory=list)
