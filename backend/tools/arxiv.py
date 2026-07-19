from backend.tools.base import robust_tool, ToolResult
from pydantic import BaseModel

class ARXIVData(BaseModel):
    raw_content: str
    metadata: dict

@robust_tool(timeout_seconds=5, max_retries=3)
def execute_arxiv(query: str) -> ARXIVData:
    # MVP: Return mock structured data
    return ARXIVData(
        raw_content=f"Mocked arxiv data for {query}",
        metadata={"source": "arxiv"}
    )
