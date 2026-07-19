from backend.tools.base import robust_tool, ToolResult
from pydantic import BaseModel

class GOOGLESEARCHData(BaseModel):
    raw_content: str
    metadata: dict

@robust_tool(timeout_seconds=5, max_retries=3)
def execute_google_search(query: str) -> GOOGLESEARCHData:
    # MVP: Return mock structured data
    return GOOGLESEARCHData(
        raw_content=f"Mocked google_search data for {query}",
        metadata={"source": "google_search"}
    )
