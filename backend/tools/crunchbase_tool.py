import json
from backend.tools.registry import tool_registry, robust_tool

_cb_cache = {}

@robust_tool(timeout_sec=8, max_retries=2, fallback_value={"funding": "Not Disclosed", "velocity": "Unknown"})
def fetch_crunchbase_data(company_name: str):
    """
    Simulates a resilient Crunchbase API call with structured output.
    """
    if company_name in _cb_cache:
        return _cb_cache[company_name], 1.0, "Crunchbase (Cached)"
        
    if company_name == "InfraAI":
        data = {"funding": "$0", "velocity": "Pre-Seed/Bootstrapped", "signals": ["Fast Growing"]}
        _cb_cache[company_name] = data
        return data, 0.90, "Crunchbase API"
        
    raise ValueError(f"Company {company_name} not found in Crunchbase")

tool_registry.register("crunchbase", fetch_crunchbase_data)
