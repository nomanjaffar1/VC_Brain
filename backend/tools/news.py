from backend.tools.base import robust_tool, ToolResult
from pydantic import BaseModel

class NEWSData(BaseModel):
    raw_content: str
    metadata: dict

@robust_tool(timeout_seconds=5, max_retries=3)
def execute_news(query: str) -> NEWSData:
    # MVP: Return mock structured data
    return NEWSData(
        raw_content=f"Mocked news data for {query}",
        metadata={"source": "news"}
    )
