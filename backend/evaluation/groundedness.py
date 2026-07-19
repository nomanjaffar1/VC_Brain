from typing import List, Dict, Any

class GroundednessEvaluator:
    @staticmethod
    def calculate_groundedness(claims: List[Dict[str, Any]]) -> float:
        """
        Groundedness = (Claims with explicit citations) / (Total Claims)
        A score of 1.0 means every single claim is directly backed by retrieved evidence.
        """
        if not claims:
            return 1.0
            
        cited_claims = [c for c in claims if c.get("evidence_found") and c.get("status") == "SUPPORTED"]
        return len(cited_claims) / len(claims)

groundedness_evaluator = GroundednessEvaluator()
