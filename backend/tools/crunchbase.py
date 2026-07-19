from backend.tools.base import robust_tool, ToolResult
from pydantic import BaseModel

class CRUNCHBASEData(BaseModel):
    raw_content: str
    metadata: dict

@robust_tool(timeout_seconds=5, max_retries=3)
def execute_crunchbase(query: str) -> CRUNCHBASEData:
    # MVP: Return mock structured data
    return CRUNCHBASEData(
        raw_content=f"Mocked crunchbase data for {query}",
        metadata={"source": "crunchbase"}
    )
