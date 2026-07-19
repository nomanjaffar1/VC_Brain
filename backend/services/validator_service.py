from backend.schemas.committee import ValidatorResponse, ValidationItem
from typing import List

class ValidatorService:
    @staticmethod
    def calculate_coverage(total_claims_submitted: int, claims_validated: int) -> float:
        if total_claims_submitted == 0:
            return 1.0
        return claims_validated / total_claims_submitted

    @staticmethod
    def enforce_trust_penalty(verified: int, unverified: int, contradictions: int) -> float:
        # A contradiction is a massive red flag (40% penalty).
        # An unverified claim is a hallucination risk (15% penalty).
        return (unverified * 0.15) + (contradictions * 0.40)

validator_service = ValidatorService()
