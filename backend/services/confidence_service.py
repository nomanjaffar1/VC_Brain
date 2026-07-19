from typing import List, Dict, Any

class ConfidenceService:
    @staticmethod
    def calculate_deterministic_confidence(
        evidence_count: int,
        agreement_ratio: float,
        validation_coverage: float,
        contradictions: int,
        retrieval_quality: float = 0.8,
        missing_evidence: int = 0,
        source_risk: float = 0.0,
    ) -> float:
        """
        Computes a strict, deterministic confidence score using evidence, agreement,
        retrieval quality, validation, and penalty terms.
        """
        evidence_weight = 0.3
        agreement_weight = 0.25
        retrieval_weight = 0.2
        validation_weight = 0.25
        missing_weight = 0.08

        normalized_evidence = min(evidence_count / 10.0, 1.0)
        evidence_score = normalized_evidence * evidence_weight
        agreement_score = agreement_ratio * agreement_weight
        retrieval_score = retrieval_quality * retrieval_weight
        validation_score = validation_coverage * validation_weight
        missing_penalty = min(missing_evidence / 5.0, 1.0) * missing_weight
        contradiction_penalty = contradictions * 0.1
        source_penalty = source_risk * 0.1

        base_confidence = evidence_score + agreement_score + retrieval_score + validation_score
        final_confidence = max(base_confidence - missing_penalty - contradiction_penalty - source_penalty, 0.0)
        return round(final_confidence, 3)

confidence_service = ConfidenceService()
