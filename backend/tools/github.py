from backend.tools.base import robust_tool, ToolResult
from pydantic import BaseModel

class GITHUBData(BaseModel):
    raw_content: str
    metadata: dict

@robust_tool(timeout_seconds=5, max_retries=3)
def execute_github(query: str) -> GITHUBData:
    # MVP: Return mock structured data
    return GITHUBData(
        raw_content=f"Mocked github data for {query}",
        metadata={"source": "github"}
    )
