from typing import List, Dict, Any

class HallucinationEvaluator:
    @staticmethod
    def calculate_hallucination_rate(claims: List[Dict[str, Any]]) -> float:
        """
        Hallucination Rate = (Unverified Claims + Contradictions) / (Total Claims)
        A score of 0.0 means the LLM did not hallucinate a single fact.
        """
        if not claims:
            return 0.0
            
        hallucinations = [c for c in claims if c.get("status") in ["UNVERIFIED", "CONTRADICTS"]]
        return len(hallucinations) / len(claims)

hallucination_evaluator = HallucinationEvaluator()
