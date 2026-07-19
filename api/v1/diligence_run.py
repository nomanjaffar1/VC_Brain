import json
import time

def handler(request):
    # Simulate running the diligence pipeline and return a sample memo
    opportunity_id = request.get('query', {}).get('opportunity_id') if isinstance(request.get('query'), dict) else None
    if not opportunity_id:
        try:
            body = json.loads(request.get('body') or '{}')
            opportunity_id = body.get('opportunity_id')
        except Exception:
            opportunity_id = 'unknown'

    memo = {
        "recommendation": "FURTHER_DD",
        "trust_score": 0.0,
        "confidence": 0.14,
        "final_memo": {
            "executive_summary": {"summary": "The investment memo requires further due diligence due to insufficient data retrieved from available tools.", "evidence_citations": ["Vector Retrieval Tool (FAISS)"]},
            "due_diligence_questions": ["What is the GitHub commit frequency?", "What are the LinkedIn roles and endorsements?"],
        }
    }

    payload = {"status": "completed", "run_id": f"run_{int(time.time())}", "opportunity_id": opportunity_id, "recommendation": memo.get('recommendation'), "trust_score": memo.get('trust_score'), "memo": memo.get('final_memo')}
    return {"statusCode": 200, "headers": {"Content-Type": "application/json"}, "body": json.dumps(payload)}
