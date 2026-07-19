from typing import Dict, Any, List


class PortfolioIntelligenceService:
    def build_portfolio_intelligence(self, thesis_sector: str, votes: List[Dict[str, Any]], memory_count: int, evidence_count: int) -> Dict[str, Any]:
        approve_votes = sum(1 for vote in votes if vote.get("vote") == "APPROVE")
        dd_votes = sum(1 for vote in votes if vote.get("vote") == "FURTHER_DD")

        fit_score = min(100, 70 + approve_votes * 8 + (evidence_count // 2) + min(memory_count, 3) * 3)
        if dd_votes:
            fit_score -= 8

        overlap_signals = [
            {"label": "Sector fit", "value": "High" if thesis_sector.lower() in "ai infrastructure" else "Medium"},
            {"label": "Memory reuse", "value": f"{memory_count} prior signals"},
            {"label": "Evidence density", "value": f"{evidence_count} pieces"},
        ]

        return {
            "portfolio_fit_score": fit_score,
            "overlap_signals": overlap_signals,
            "cannibalization_risk": "Low" if approve_votes >= 2 else "Medium",
            "market_diversification": "High" if approve_votes >= 2 else "Medium",
            "stage_distribution": "Seed-leaning",
            "geography_distribution": "Global",
            "sector_distribution": thesis_sector,
        }


portfolio_service = PortfolioIntelligenceService()
