import time
import functools
from typing import Dict, Any, Callable, Optional
from pydantic import BaseModel, Field

class ToolResponse(BaseModel):
    success: bool
    data: Any
    confidence: float
    source: str
    error_message: str = ""
    latency_ms: int = 0
    retries_used: int = 0

class ToolDefinition(BaseModel):
    name: str
    description: str
    timeout: int = 15
    retries: int = 2
    cache: bool = True
    fallback: str = "synthetic"
    tags: list[str] = Field(default_factory=list)
    expected_schema: Dict[str, Any] = Field(default_factory=dict)

class ToolRegistry:
    def __init__(self):
        self._tools: Dict[str, Dict[str, Any]] = {}
        self._cache: Dict[str, Any] = {}

    def register(self, name: str, func: Callable, description: str = "", timeout: int = 15, retries: int = 2, cache: bool = True, fallback: str = "synthetic", tags: Optional[list[str]] = None, expected_schema: Optional[Dict[str, Any]] = None):
        self._tools[name] = {
            "func": func,
            "definition": ToolDefinition(
                name=name,
                description=description or name,
                timeout=timeout,
                retries=retries,
                cache=cache,
                fallback=fallback,
                tags=tags or [],
                expected_schema=expected_schema or {},
            ),
        }

    def get_tool(self, name: str) -> ToolDefinition:
        entry = self._tools.get(name)
        if not entry:
            raise KeyError(f"Tool {name} not found")
        return entry["definition"]

    def list_tools(self) -> list[str]:
        return list(self._tools.keys())

    def clear(self):
        self._tools.clear()
        self._cache.clear()

    def execute(self, name: str, *args, **kwargs) -> ToolResponse:
        entry = self._tools.get(name)
        if not entry:
            raise KeyError(f"Tool {name} not found")

        if entry["definition"].cache and name in self._cache:
            return ToolResponse(success=True, data=self._cache[name], confidence=0.95, source=name, latency_ms=0, retries_used=0)

        last_error = None
        retries_used = 0
        for attempt in range(entry["definition"].retries + 1):
            start_time = time.time()
            try:
                result = entry["func"](*args, **kwargs)
                if isinstance(result, tuple) and len(result) == 3:
                    data, confidence, source = result
                    response = ToolResponse(success=True, data=data, confidence=confidence, source=source, latency_ms=int((time.time() - start_time) * 1000), retries_used=retries_used)
                else:
                    response = ToolResponse(success=True, data=result, confidence=0.9, source=name, latency_ms=int((time.time() - start_time) * 1000), retries_used=retries_used)
                if entry["definition"].cache:
                    self._cache[name] = response.data
                return response
            except Exception as exc:
                last_error = exc
                retries_used = attempt + 1
                time.sleep(0.1)

        return ToolResponse(success=False, data=entry["definition"].fallback, confidence=0.0, source=name, error_message=str(last_error), latency_ms=0, retries_used=retries_used)

tool_registry = ToolRegistry()
