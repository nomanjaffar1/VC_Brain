from backend.tools.base import robust_tool, ToolResult
from pydantic import BaseModel

class EMBEDDINGTOOLData(BaseModel):
    raw_content: str
    metadata: dict

@robust_tool(timeout_seconds=5, max_retries=3)
def execute_embedding_tool(query: str) -> EMBEDDINGTOOLData:
    # MVP: Return mock structured data
    return EMBEDDINGTOOLData(
        raw_content=f"Mocked embedding_tool data for {query}",
        metadata={"source": "embedding_tool"}
    )
