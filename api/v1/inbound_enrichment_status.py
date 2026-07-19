import json

def handler(request):
    # Return a canned enrichment status
    path_parts = (request.get('path') or '').split('/')
    opportunity_id = path_parts[-1] if path_parts and path_parts[-1] else request.get('query', {}).get('opportunity_id', 'unknown')
    payload = {"opportunity_id": opportunity_id, "status": "complete", "steps_completed": 8, "total_steps": 8, "evidence_collected": 24, "progress_percent": 100}
    return {"statusCode": 200, "headers": {"Content-Type": "application/json"}, "body": json.dumps(payload)}
