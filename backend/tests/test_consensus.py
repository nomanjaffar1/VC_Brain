import pytest
from backend.services.consensus_service import ConsensusService
from backend.schemas.committee import CommitteeVote

def test_consensus_approval():
    votes = [
        CommitteeVote(agent_id="F", vote="APPROVE", confidence=0.9, rationale=""),
        CommitteeVote(agent_id="M", vote="APPROVE", confidence=0.8, rationale=""),
        CommitteeVote(agent_id="T", vote="REJECT", confidence=0.7, rationale="")
    ]
    result = ConsensusService.calculate_consensus(votes)
    assert result == "APPROVE"

def test_consensus_base_trust():
    votes = [
        CommitteeVote(agent_id="F", vote="APPROVE", confidence=0.8, rationale=""),
        CommitteeVote(agent_id="M", vote="APPROVE", confidence=0.9, rationale="")
    ]
    trust = ConsensusService.calculate_base_trust(votes)
    assert trust == 0.85

def test_trust_calibration_penalties():
    # Base trust 0.9, 1 unverified (-0.15), 1 contradiction (-0.4) -> 0.35
    calibrated = ConsensusService.calibrate_trust(0.9, 1, 1)
    assert round(calibrated, 2) == 0.35
