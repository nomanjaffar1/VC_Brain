from backend.tools.base import robust_tool, ToolResult
from pydantic import BaseModel

class PDFLOADERData(BaseModel):
    raw_content: str
    metadata: dict

@robust_tool(timeout_seconds=5, max_retries=3)
def execute_pdf_loader(query: str) -> PDFLOADERData:
    # MVP: Return mock structured data
    return PDFLOADERData(
        raw_content=f"Mocked pdf_loader data for {query}",
        metadata={"source": "pdf_loader"}
    )
