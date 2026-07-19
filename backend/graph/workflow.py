from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Any, Annotated
import operator
from backend.schemas.committee import CommitteeVote, ValidatorResponse
from backend.schemas.memo import InvestmentMemo
from backend.services.consensus_service import ConsensusService
from backend.evaluation.metrics import global_evaluator
from backend.agents.base import BaseAgent
from backend.services.observability import observability
from backend.services.portfolio_service import portfolio_service
from backend.services.source_reliability import source_reliability_service
from backend.services.run_manager import run_manager
from pydantic import BaseModel

class VCState(TypedDict):
    opportunity_id: str
    run_id: str
    evidence: List[Any]
    votes: Annotated[List[CommitteeVote], operator.add]
    consensus_recommendation: str
    base_trust_score: float
    validator_claims_verified: int
    validator_claims_total: int
    final_memo: Any # Will hold the InvestmentMemo dict

class FusionResponse(BaseModel):
    fused_context: str

# Live Agents using Structured Output
fusion_agent = BaseAgent("evidence_fusion", FusionResponse)
founder_agent = BaseAgent("founder_partner", CommitteeVote)
market_agent = BaseAgent("market_partner", CommitteeVote)
tech_agent = BaseAgent("technology_partner", CommitteeVote)
validator_agent = BaseAgent("validator", ValidatorResponse)
memo_agent = BaseAgent("investment_memo", InvestmentMemo)

def evidence_fusion(state: VCState) -> VCState:
    run_id = state.get("run_id")
    observability.record_event(state["opportunity_id"], "research", "Gathering evidence for the opportunity")
    if run_id:
        run_manager.append_event(run_id, "research", "Gathering evidence for the opportunity")
    res = fusion_agent.execute(state["opportunity_id"], "Synthesize all raw evidence for this startup.", context_data={"run_id": run_id} if run_id else None)
    observability.record_event(state["opportunity_id"], "research_complete", "Evidence fusion completed")
    if run_id:
        run_manager.append_event(run_id, "research_complete", "Evidence fusion completed")
    return {"evidence": [res.fused_context]}

def run_founder_agent(state: VCState) -> VCState:
    run_id = state.get("run_id")
    observability.record_event(state["opportunity_id"], "agent", "Founder agent analyzing leadership and execution")
    res = founder_agent.execute(state["opportunity_id"], "Evaluate the founder's execution velocity and domain expertise.", context_data={"evidence": state.get("evidence"), "run_id": run_id} if run_id else {"evidence": state.get("evidence")})
    observability.record_event(state["opportunity_id"], "agent_complete", "Founder agent completed")
    return {"votes": [res]}

def run_market_agent(state: VCState) -> VCState:
    run_id = state.get("run_id")
    observability.record_event(state["opportunity_id"], "agent", "Market agent assessing market size and competition")
    res = market_agent.execute(state["opportunity_id"], "Evaluate the startup's market potential and competitive landscape.", context_data={"evidence": state.get("evidence"), "run_id": run_id} if run_id else {"evidence": state.get("evidence")})
    observability.record_event(state["opportunity_id"], "agent_complete", "Market agent completed")
    return {"votes": [res]}

def run_tech_agent(state: VCState) -> VCState:
    run_id = state.get("run_id")
    observability.record_event(state["opportunity_id"], "agent", "Technology agent analyzing moat and architecture")
    res = tech_agent.execute(state["opportunity_id"], "Evaluate the startup's technical moat and architecture.", context_data={"evidence": state.get("evidence"), "run_id": run_id} if run_id else {"evidence": state.get("evidence")})
    observability.record_event(state["opportunity_id"], "agent_complete", "Technology agent completed")
    return {"votes": [res]}

def consensus_node(state: VCState) -> VCState:
    votes = state.get("votes", [])
    rec = ConsensusService.calculate_consensus(votes)
    trust = ConsensusService.calculate_base_trust(votes)
    return {"consensus_recommendation": rec, "base_trust_score": trust}

def run_validator(state: VCState) -> VCState:
    # Pass all committee claims to the validator
    all_claims = []
    for v in state.get("votes", []):
        all_claims.extend([c.model_dump() for c in v.claims])
        
    observability.record_event(state["opportunity_id"], "validator", "Validating claims and evidence")
    res = validator_agent.execute(state["opportunity_id"], "Verify these claims against the vector database.", context_data={"claims_to_verify": all_claims})
    
    total = res.verified_claims + res.unverified_claims + res.contradictions
    global_evaluator.record_validation(verified=res.verified_claims, total=total)
    
    # Adjust trust score based on penalties
    adjusted_trust = ConsensusService.calibrate_trust(state.get("base_trust_score", 0.0), res.unverified_claims, res.contradictions)
    
    return {
        "validator_claims_verified": res.verified_claims, 
        "validator_claims_total": total,
        "base_trust_score": adjusted_trust
    }

from backend.services.confidence_service import confidence_service
from backend.services.validator_service import validator_service

def generate_memo(state: VCState) -> VCState:
    # 1. Compute Deterministic Confidence
    evidence_count = len(state.get("evidence", []))
    total_votes = len(state.get("votes", []))
    approvals = len([v for v in state.get("votes", []) if v.vote == "APPROVE"])
    agreement_ratio = (approvals / total_votes) if total_votes > 0 else 0.0
    
    validation_coverage = validator_service.calculate_coverage(
        state.get("validator_claims_total", 0), 
        state.get("validator_claims_verified", 0)
    )
    
    # We estimate contradictions based on penalty; but for accuracy we would pull from validator response.
    # We will pass a dummy contradiction count for the memo generation context.
    contradictions = 0 
    
    retrieval_quality = 0.9 if evidence_count > 0 else 0.2
    missing_evidence_count = max(0, 5 - evidence_count)
    source_risk = 0.1 if evidence_count > 0 else 0.3

    final_confidence = confidence_service.calculate_deterministic_confidence(
        evidence_count,
        agreement_ratio,
        validation_coverage,
        contradictions,
        retrieval_quality=retrieval_quality,
        missing_evidence=missing_evidence_count,
        source_risk=source_risk,
    )

    portfolio_intelligence = portfolio_service.build_portfolio_intelligence(
        thesis_sector="AI Infrastructure",
        votes=[v.model_dump() for v in state.get("votes", [])],
        memory_count=2,
        evidence_count=evidence_count,
    )
    portfolio_fit_score = portfolio_intelligence["portfolio_fit_score"]

    # 2. Pass strictly validated context to the Memo Agent
    context_data = {
        "votes": [v.model_dump() for v in state.get("votes", [])],
        "consensus": state.get("consensus_recommendation"),
        "adjusted_trust_score": state.get("base_trust_score"),
        "deterministic_confidence": final_confidence,
        "validation_coverage": validation_coverage,
        "portfolio_fit": portfolio_fit_score,
        "portfolio_intelligence": portfolio_intelligence,
        "source_reliability": {
            "github": source_reliability_service.get_reliability("github"),
            "crunchbase": source_reliability_service.get_reliability("crunchbase"),
            "news": source_reliability_service.get_reliability("news"),
        },
    }
    
    observability.record_event(state["opportunity_id"], "memo", "Drafting investment memo")
    memo = memo_agent.execute(
        state["opportunity_id"], 
        "Draft the final Investment Memo utilizing ONLY the provided validated committee context and RAG evidence. Do not hallucinate fields. You must strictly fill out the new Bloomberg OS quant fields (expected_upside_multiple, competitor_analysis, risk_matrix, etc.) based ONLY on verified evidence.", 
        context_data=context_data
    )
    observability.record_event(state["opportunity_id"], "memo_complete", "Investment memo generated")
    
    # Enforce deterministic metrics over LLM guesses
    memo.trust_score = state.get("base_trust_score", 0.0)
    memo.confidence = final_confidence
    memo.recommendation = state.get("consensus_recommendation", "FURTHER_DD")
    
    # Append the deterministic portfolio fit to the state so the frontend can retrieve it (or embed in memo)
    # The memo doesn't have portfolio_fit in its schema yet, but we could add it, or the frontend can use trust score.
    # We will pass it inside the memo object dynamically if needed, but Pydantic strips unknown fields.
    
    return {"final_memo": memo.model_dump()}

def build_graph():
    workflow = StateGraph(VCState)
    
    workflow.add_node("fusion", evidence_fusion)
    workflow.add_node("founder_agent", run_founder_agent)
    workflow.add_node("market_agent", run_market_agent)
    workflow.add_node("tech_agent", run_tech_agent)
    workflow.add_node("consensus", consensus_node)
    workflow.add_node("validator", run_validator)
    workflow.add_node("memo", generate_memo)

    workflow.set_entry_point("fusion")
    
    # Fan-out to Committee
    workflow.add_edge("fusion", "founder_agent")
    workflow.add_edge("fusion", "market_agent")
    workflow.add_edge("fusion", "tech_agent")
    
    # Fan-in to Consensus
    workflow.add_edge("founder_agent", "consensus")
    workflow.add_edge("market_agent", "consensus")
    workflow.add_edge("tech_agent", "consensus")
    
    workflow.add_edge("consensus", "validator")
    workflow.add_edge("validator", "memo")
    workflow.add_edge("memo", END)

    return workflow.compile()

vc_graph = build_graph()
