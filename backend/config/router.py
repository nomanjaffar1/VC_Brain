from langchain_openai import ChatOpenAI
from backend.config.settings import settings

class ModelRouter:
    @staticmethod
    def get_model(task_type: str) -> ChatOpenAI:
        """
        Routes the task to the most efficient model.
        """
        if task_type == "complex_reasoning":
            # Used for core diligence tasks (Founder, Tech, Market evaluation)
            return ChatOpenAI(model="gpt-4o", temperature=0.1, openai_api_key=settings.OPENAI_API_KEY)
            
        elif task_type == "validation":
            # Used for structured verification against text chunks (High volume, needs speed)
            return ChatOpenAI(model="gpt-4o-mini", temperature=0, openai_api_key=settings.OPENAI_API_KEY)
            
        elif task_type == "extraction":
            # Used for context compression and metadata extraction
            return ChatOpenAI(model="gpt-4o-mini", temperature=0, openai_api_key=settings.OPENAI_API_KEY)
            
        else:
            # Fallback
            return ChatOpenAI(model="gpt-4o", temperature=0.2, openai_api_key=settings.OPENAI_API_KEY)

model_router = ModelRouter()
