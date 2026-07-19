import time
import functools
from typing import Dict, Any, Callable
from pydantic import BaseModel, Field

class ToolResponse(BaseModel):
    success: bool
    data: Any
    confidence: float
    source: str
    error_message: str = ""

def robust_tool(timeout_sec: int = 5, max_retries: int = 2, fallback_value: Any = None):
    """
    Decorator that enforces: Timeout -> Retry -> Fallback.
    Returns a structured ToolResponse enforcing standard tool boundaries.
    """
    def decorator(func: Callable):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_err = None
            for attempt in range(max_retries):
                try:
                    # In a real environment, we'd wrap this in a signal alarm or asyncio.wait_for for strict timeout
                    # For local synchronous demo, we track time manually (though blocking calls bypass this).
                    start_time = time.time()
                    
                    data, confidence, source = func(*args, **kwargs)
                    
                    # Simulated timeout check
                    if time.time() - start_time > timeout_sec:
                        raise TimeoutError(f"Tool execution exceeded {timeout_sec}s")
                        
                    return ToolResponse(
                        success=True,
                        data=data,
                        confidence=confidence,
                        source=source
                    )
                except Exception as e:
                    last_err = e
                    time.sleep(0.5) # Short backoff
                    
            # Fallback path if retries fail
            print(f"[Tool Execution Failed] {func.__name__} after {max_retries} attempts: {last_err}")
            return ToolResponse(
                success=False,
                data=fallback_value,
                confidence=0.0,
                source=func.__name__,
                error_message=str(last_err)
            )
        return wrapper
    return decorator

class ToolRegistry:
    def __init__(self):
        self._tools = {}
        
    def register(self, name: str, func: Callable):
        self._tools[name] = func
        
    def get_tool(self, name: str) -> Callable:
        return self._tools.get(name)
        
    def list_tools(self) -> list:
        return list(self._tools.keys())

tool_registry = ToolRegistry()
