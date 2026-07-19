import json
from backend.tools.registry import tool_registry, robust_tool

# Simple mock cache to prevent redundant API calls during evaluation
_github_cache = {}

@robust_tool(timeout_sec=5, max_retries=3, fallback_value={"commits": 0, "velocity": "Unknown"})
def fetch_github_velocity(username: str):
    """
    Simulates a resilient GitHub API call.
    Returns: (data, confidence, source)
    """
    if username in _github_cache:
        return _github_cache[username], 1.0, "GitHub (Cached)"
        
    # Mocking real API behavior for the hackathon
    if username == "founder_99":
        data = {"commits_last_30_days": 142, "velocity": "High", "stars": 450}
        _github_cache[username] = data
        return data, 0.95, "GitHub API"
        
    # Simulate a network failure or empty profile
    raise ValueError(f"GitHub profile not found or network timeout for {username}")

# Register the tool
tool_registry.register("github", fetch_github_velocity)
