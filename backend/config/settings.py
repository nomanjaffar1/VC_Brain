import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    OPENAI_API_KEY: str = os.getenv("VITE_OPENAI_API_KEY", "")
    DEFAULT_LLM_PROVIDER: str = "openai"
    DEFAULT_MODEL: str = "gpt-4o-mini"

settings = Settings()

class LLMProvider:
    @staticmethod
    def get_llm():
        if settings.DEFAULT_LLM_PROVIDER == "openai":
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(model=settings.DEFAULT_MODEL, temperature=0.1, openai_api_key=settings.OPENAI_API_KEY)
        raise NotImplementedError("Only OpenAI is currently supported in MVP")
