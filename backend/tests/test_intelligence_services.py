from backend.services.confidence_service import confidence_service
from backend.services.portfolio_service import portfolio_service
from backend.services.consensus_service import ConsensusService
from backend.schemas.committee import CommitteeVote
from backend.tools.registry import tool_registry


def test_confidence_engine_uses_retrieval_and_validation():
    score = confidence_service.calculate_deterministic_confidence(
        evidence_count=8,
        agreement_ratio=0.8,
        validation_coverage=0.9,
        contradictions=1,
        retrieval_quality=0.95,
        missing_evidence=2,
        source_risk=0.1,
    )

    assert score > 0.7
    assert score < 1.0


def test_portfolio_fit_is_derived_from_signal_mix():
    intelligence = portfolio_service.build_portfolio_intelligence(
        thesis_sector="AI Infrastructure",
        votes=[{"vote": "APPROVE"}, {"vote": "APPROVE"}, {"vote": "FURTHER_DD"}],
        memory_count=2,
        evidence_count=6,
    )

    assert intelligence["portfolio_fit_score"] >= 70
    assert intelligence["overlap_signals"][0]["label"] == "Sector fit"


def test_weighted_consensus_uses_agent_confidence_and_role_weighting():
    votes = [
        CommitteeVote(agent_id="founder", vote="APPROVE", confidence=0.95, rationale=""),
        CommitteeVote(agent_id="market", vote="APPROVE", confidence=0.55, rationale=""),
        CommitteeVote(agent_id="technology", vote="REJECT", confidence=0.78, rationale=""),
    ]
    score = ConsensusService.calculate_weighted_score(votes)
    assert score > 0.6
    assert ConsensusService.calculate_consensus(votes) == "APPROVE"


def test_tool_registry_supports_metadata_and_cache():
    tool_registry.clear()

    def sample_tool():
        return "ok", 0.9, "demo"

    tool_registry.register(
        name="github",
        func=sample_tool,
        description="Repository analysis",
        timeout=15,
        retries=2,
        cache=True,
        fallback="synthetic",
        tags=["opensource", "technical"],
    )

    result = tool_registry.execute("github")
    assert result.success is True
    assert result.data == "ok"
    assert tool_registry.get_tool("github").description == "Repository analysis"
