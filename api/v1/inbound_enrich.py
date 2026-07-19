import json
import time

def handler(request):
    # Simulate enrichment steps and return completed steps
    opportunity_id = request.get('query', {}).get('opportunity_id') if isinstance(request.get('query'), dict) else None
    if not opportunity_id:
        # try parsing from body
        try:
            body = json.loads(request.get('body') or '{}')
            opportunity_id = body.get('opportunity_id')
        except Exception:
            opportunity_id = 'unknown'

    steps = [
        {"step": "Reading Website", "status": "complete"},
        {"step": "Parsing Pitch Deck", "status": "complete"},
        {"step": "Discovering GitHub", "status": "complete"},
        {"step": "Finding Founders", "status": "complete"},
        {"step": "Checking Research Papers", "status": "complete"},
        {"step": "Running Founder Analysis", "status": "complete"},
        {"step": "Building Knowledge Graph", "status": "complete"},
        {"step": "Launching Investment Committee", "status": "complete"},
    ]

    payload = {"status": "enrichment_complete", "opportunity_id": opportunity_id, "steps": steps, "next_step": "investment_committee"}
    return {"statusCode": 200, "headers": {"Content-Type": "application/json"}, "body": json.dumps(payload)}
