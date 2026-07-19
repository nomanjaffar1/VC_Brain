from pydantic import BaseModel
from typing import List

class InvestmentThesis(BaseModel):
    sector: str
    geography: str
    stage: str
    check_size: str
    ownership_target: str
    risk_appetite: str
    investment_themes: List[str]
    excluded_industries: List[str]
    preferred_founder_background: str
    preferred_technologies: List[str]
