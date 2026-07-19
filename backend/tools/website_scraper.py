from backend.tools.base import robust_tool, ToolResult
from pydantic import BaseModel

class WEBSITESCRAPERData(BaseModel):
    raw_content: str
    metadata: dict

@robust_tool(timeout_seconds=5, max_retries=3)
def execute_website_scraper(query: str) -> WEBSITESCRAPERData:
    # MVP: Return mock structured data
    return WEBSITESCRAPERData(
        raw_content=f"Mocked website_scraper data for {query}",
        metadata={"source": "website_scraper"}
    )
