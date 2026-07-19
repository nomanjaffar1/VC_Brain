from typing import List
from backend.schemas.committee import CommitteeVote

class ConsensusService:
    @staticmethod
    def calculate_consensus(votes: List[CommitteeVote]) -> str:
        approve_count = sum(1 for v in votes if v.vote == "APPROVE")
        reject_count = sum(1 for v in votes if v.vote == "REJECT")
        
        if approve_count > len(votes) / 2:
            return "APPROVE"
        elif reject_count > len(votes) / 2:
            return "REJECT"
        return "FURTHER_DD"

    @staticmethod
    def calculate_base_trust(votes: List[CommitteeVote]) -> float:
        if not votes:
            return 0.0
        return sum(v.confidence for v in votes) / len(votes)

    @staticmethod
    def calibrate_trust(base_trust: float, unverified: int, contradictions: int) -> float:
        penalty = (unverified * 0.15) + (contradictions * 0.40)
        return max(0.0, base_trust - penalty)
