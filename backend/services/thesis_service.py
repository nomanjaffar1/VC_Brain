from backend.schemas.thesis import InvestmentThesis

class ThesisService:
    def __init__(self):
        # Default Active Thesis for the Hackathon
        self.active_thesis = InvestmentThesis(
            sector="AI Infrastructure & Developer Tools",
            geography="Global Remote / North America",
            stage="Pre-Seed / Seed",
            check_size="$500k - $2M",
            ownership_target="10% - 15%",
            risk_appetite="High Technical Risk, Low Market Risk",
            investment_themes=["Open Source Defensibility", "LLM Orchestration", "Data Privacy"],
            excluded_industries=["Crypto/Web3", "Hardware", "DTC E-commerce"],
            preferred_founder_background="Technical Contributor, Open Source Maintainer",
            preferred_technologies=["Rust", "Python", "CUDA", "Vector Databases"]
        )

    def get_active_thesis(self) -> InvestmentThesis:
        return self.active_thesis
        
    def update_thesis(self, new_thesis: InvestmentThesis):
        self.active_thesis = new_thesis

thesis_service = ThesisService()
