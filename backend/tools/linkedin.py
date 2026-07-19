from backend.tools.base import robust_tool, ToolResult
from pydantic import BaseModel

class LINKEDINData(BaseModel):
    raw_content: str
    metadata: dict

@robust_tool(timeout_seconds=5, max_retries=3)
def execute_linkedin(query: str) -> LINKEDINData:
    # MVP: Return mock structured data
    return LINKEDINData(
        raw_content=f"Mocked linkedin data for {query}",
        metadata={"source": "linkedin"}
    )
