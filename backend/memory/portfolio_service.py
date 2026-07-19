import os
from typing import Dict, Any, List
from backend.services.retrieval_service import retrieval_service
from pydantic import BaseModel

class PortfolioFit(BaseModel):
    is_fit: bool
    cannibalization_risk: str
    diversification_value: str
    recommendation: str

class PortfolioMemoryService:
    def __init__(self):
        # In a real database, this would be a table. For the hackathon MVP, we mock the firm's active portfolio.
        self.active_portfolio = [
            {"company": "DataBricks", "sector": "Data Infrastructure", "thesis": "Unified Analytics"},
            {"company": "Stripe", "sector": "FinTech", "thesis": "Developer-first Payments"},
            {"company": "HuggingFace", "sector": "AI Infrastructure", "thesis": "Open Source AI Models"}
        ]
        
    def evaluate_portfolio_fit(self, opportunity_id: str, opportunity_summary: str) -> PortfolioFit:
        """
        Evaluates if the current opportunity competes with or diversifies the firm's existing portfolio.
        """
        # 1. Semantic search to see if we already rejected similar companies or invested in them
        historical_context = retrieval_service.hybrid_retrieval(query=opportunity_summary, filter_metadata={"memory_type": "INVESTMENT"})
        
        # 2. Heuristic Portfolio Check
        cannibalization = "Low"
        diversification = "High"
        is_fit = True
        
        for p in self.active_portfolio:
            if p["sector"].lower() in opportunity_summary.lower():
                cannibalization = f"High - Potential overlap with {p['company']} in {p['sector']}"
                diversification = "Low"
                is_fit = False
                break
                
        return PortfolioFit(
            is_fit=is_fit,
            cannibalization_risk=cannibalization,
            diversification_value=diversification,
            recommendation="Proceed with caution due to portfolio overlap" if not is_fit else "Strong diversification addition to the portfolio"
        )

portfolio_service = PortfolioMemoryService()
