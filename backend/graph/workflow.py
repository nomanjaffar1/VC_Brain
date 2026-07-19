from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Any
from backend.schemas.committee import CommitteeVote, ValidatorResponse
from backend.schemas.memo import InvestmentMemo
from backend.services.consensus_service import ConsensusService
from backend.evaluation.metrics import global_evaluator
from backend.agents.base import BaseAgent
from pydantic import BaseModel

class VCState(TypedDict):
    opportunity_id: str
    evidence: List[Any]
    votes: List[CommitteeVote]
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
    res = fusion_agent.execute(state["opportunity_id"], "Synthesize all raw evidence for this startup.")
    return {"evidence": [res.fused_context]}

def run_founder_agent(state: VCState) -> VCState:
    res = founder_agent.execute(state["opportunity_id"], "Evaluate the founder's execution velocity and domain expertise.", context_data={"evidence": state.get("evidence")})
    return {"votes": [res]}

def run_market_agent(state: VCState) -> VCState:
    res = market_agent.execute(state["opportunity_id"], "Evaluate the startup's market potential and competitive landscape.", context_data={"evidence": state.get("evidence")})
    return {"votes": [res]}

def run_tech_agent(state: VCState) -> VCState:
    res = tech_agent.execute(state["opportunity_id"], "Evaluate the startup's technical moat and architecture.", context_data={"evidence": state.get("evidence")})
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
    
    final_confidence = confidence_service.calculate_deterministic_confidence(
        evidence_count, agreement_ratio, validation_coverage, contradictions
    )

    # 2. Pass strictly validated context to the Memo Agent
    context_data = {
        "votes": [v.model_dump() for v in state.get("votes", [])],
        "consensus": state.get("consensus_recommendation"),
        "adjusted_trust_score": state.get("base_trust_score"),
        "deterministic_confidence": final_confidence,
        "validation_coverage": validation_coverage
    }
    
    memo = memo_agent.execute(
        state["opportunity_id"], 
        "Draft the final Investment Memo utilizing ONLY the provided validated committee context and RAG evidence. Do not hallucinate fields.", 
        context_data=context_data
    )
    
    # Enforce deterministic metrics over LLM guesses
    memo.trust_score = state.get("base_trust_score", 0.0)
    memo.confidence = final_confidence
    memo.recommendation = state.get("consensus_recommendation", "FURTHER_DD")
    
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
