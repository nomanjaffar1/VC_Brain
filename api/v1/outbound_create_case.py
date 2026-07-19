import json
import time
import uuid

def handler(request):
    try:
        body = json.loads(request.get('body') or '{}')
    except Exception:
        body = {}

    company = body.get('company_name') or 'unknown'
    opportunity_id = f"outbound_{company.lower().replace(' ', '_')}_{int(time.time())}"
    run_id = str(uuid.uuid4())
    # Simulated memo
    memo = {"recommendation": "FURTHER_DD", "trust_score": 0.0, "confidence": 0.136}
    payload = {"status": "case_created", "opportunity_id": opportunity_id, "run_id": run_id, "recommendation": memo['recommendation'], "trust_score": memo['trust_score'], "memo": memo}
    return {"statusCode": 200, "headers": {"Content-Type": "application/json"}, "body": json.dumps(payload)}
