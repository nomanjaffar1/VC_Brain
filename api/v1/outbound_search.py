import json

def handler(request):
    # Parse incoming body for query
    try:
        body = json.loads(request.get('body') or '{}')
    except Exception:
        body = {}

    query = body.get('query', 'query')
    candidates = [
        {
            "id": 1,
            "founder_name": "Sarah Chen",
            "company_name": "InfraAI",
            "founder_score": 92,
            "company_score": 88,
            "portfolio_fit": 85,
            "cold_start_score": 79,
            "market_score": 82,
            "tech_score": 95,
            "expected_return": "12x",
            "confidence": 0.93,
            "risk_level": "Moderate",
            "github_stars": 6432,
            "paper_citations": 24,
            "accelerator": "Y Combinator",
            "country": "USA",
            "latest_signal": "Enterprise partnership announced",
            "found_reason": "GitHub stars increased 80%",
        }
    ]
    payload = {"status": "success", "query": query, "results_count": len(candidates), "candidates": candidates, "search_duration_ms": 1200, "discovery_intelligence": {"total_candidates": len(candidates), "average_founder_score": 92.0, "average_portfolio_fit": 85.0, "research_papers_found": 24, "github_projects_found": 1, "average_confidence": 0.93}}
    return {"statusCode": 200, "headers": {"Content-Type": "application/json"}, "body": json.dumps(payload)}
