import json
import time
import uuid

def handler(request):
    body = {}
    try:
        body = json.loads(request.get('body') or '{}')
    except Exception:
        pass

    company = body.get('company_name', 'unknown')
    opportunity_id = f"inbound_{company.lower().replace(' ', '_')}_{int(time.time())}"
    run_id = str(uuid.uuid4())
    payload = {"status": "queued", "opportunity_id": opportunity_id, "run_id": run_id, "message": f"Inbound application from {company} queued for AI enrichment", "next_step": "enrichment"}
    return {"statusCode": 200, "headers": {"Content-Type": "application/json"}, "body": json.dumps(payload)}
