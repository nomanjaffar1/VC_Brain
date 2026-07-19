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
    def calculate_weighted_score(votes: List[CommitteeVote]) -> float:
        if not votes:
            return 0.0
        role_weights = {
            "founder": 1.15,
            "market": 1.05,
            "technology": 1.10,
            "risk": 1.08,
            "validator": 1.12,
        }
        weighted = 0.0
        for vote in votes:
            weight = role_weights.get(vote.agent_id.lower(), 1.0)
            weighted += vote.confidence * weight
        return round(weighted / len(votes), 3)

    @staticmethod
    def calculate_base_trust(votes: List[CommitteeVote]) -> float:
        if not votes:
            return 0.0
        return sum(v.confidence for v in votes) / len(votes)

    @staticmethod
    def calibrate_trust(base_trust: float, unverified: int, contradictions: int) -> float:
        penalty = (unverified * 0.15) + (contradictions * 0.40)
        return max(0.0, base_trust - penalty)
