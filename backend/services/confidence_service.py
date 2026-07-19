from typing import List, Dict, Any

class ConfidenceService:
    @staticmethod
    def calculate_deterministic_confidence(
        evidence_count: int, 
        agreement_ratio: float, 
        validation_coverage: float, 
        contradictions: int
    ) -> float:
        """
        Computes a strict, deterministic confidence score, ignoring LLM self-reporting.
        Formula: (Evidence Weight) + (Agreement Weight) + (Validation Weight) - (Contradiction Penalties)
        """
        # Base weights summing to 1.0
        evidence_weight = 0.3
        agreement_weight = 0.4
        validation_weight = 0.3
        
        # 1. Evidence Score (Caps at 10 pieces of evidence)
        normalized_evidence = min(evidence_count / 10.0, 1.0)
        evidence_score = normalized_evidence * evidence_weight
        
        # 2. Agreement Score
        agreement_score = agreement_ratio * agreement_weight
        
        # 3. Validation Coverage Score
        validation_score = validation_coverage * validation_weight
        
        # 4. Total Base Score
        base_confidence = evidence_score + agreement_score + validation_score
        
        # 5. Apply Contradiction Penalties (-15% absolute confidence per contradiction)
        penalty = contradictions * 0.15
        final_confidence = max(base_confidence - penalty, 0.0)
        
        return final_confidence

confidence_service = ConfidenceService()
