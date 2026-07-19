from backend.tools.base import robust_tool, ToolResult
from pydantic import BaseModel

class PATENTSEARCHData(BaseModel):
    raw_content: str
    metadata: dict

@robust_tool(timeout_seconds=5, max_retries=3)
def execute_patent_search(query: str) -> PATENTSEARCHData:
    # MVP: Return mock structured data
    return PATENTSEARCHData(
        raw_content=f"Mocked patent_search data for {query}",
        metadata={"source": "patent_search"}
    )
