import os
from typing import Type, Any, Dict, List
from pydantic import BaseModel
from backend.config.router import model_router
from backend.services.retrieval_service import retrieval_service

def load_prompt(agent_name: str, version: str = "v1") -> str:
    """
    Loads versioned prompts (e.g., backend/prompts/founder_partner/v1.md)
    """
    prompt_path = os.path.join("backend", "prompts", agent_name, f"{version}.md")
    try:
        with open(prompt_path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        # Fallback to standard for backward compatibility during migration
        old_path = os.path.join("backend", "prompts", f"{agent_name}.md")
        try:
            with open(old_path, "r", encoding="utf-8") as f:
                return f.read()
        except FileNotFoundError:
            return f"System Prompt for {agent_name} missing."

from backend.services.thesis_service import thesis_service

class BaseAgent:
    def __init__(self, agent_name: str, response_schema: Type[BaseModel], task_type: str = "complex_reasoning", prompt_version: str = "v1"):
        self.agent_name = agent_name
        self.system_prompt = load_prompt(agent_name, prompt_version)
        self.response_schema = response_schema
        self.llm = model_router.get_model(task_type).with_structured_output(response_schema)
        
    def execute(self, opportunity_id: str, query: str, context_data: Dict[str, Any] = None) -> BaseModel:
        """
        Executes the agent by retrieving evidence and passing it to the routed LLM.
        Implements Workflow Recovery: returns an empty fallback schema if the LLM fails, keeping the swarm alive.
        """
        # 1. RAG Retrieval
        retrieved_evidence = retrieval_service.hybrid_retrieval(query, founder_id=opportunity_id)
        
        # 2. Get Active Investment Thesis
        active_thesis = thesis_service.get_active_thesis().model_dump_json(indent=2)
        
        # 3. Construct context string
        context_str = f"ACTIVE INVESTMENT THESIS:\n{active_thesis}\n\n"
        context_str += f"RETRIEVED EVIDENCE:\n{retrieved_evidence}\n\n"
        
        if context_data:
            context_str += f"UPSTREAM DATA:\n{str(context_data)}\n\n"
            
        context_str += f"QUERY:\n{query}"
        
        # 4. Build Prompt
        final_prompt = f"{self.system_prompt}\n\n{context_str}"
        
        # 5. Invoke LLM and enforce JSON Contract with Workflow Recovery
        try:
            response = self.llm.invoke(final_prompt)
            return response
        except Exception as e:
            print(f"[{self.agent_name}] LLM Execution Error: {e}. Executing Workflow Recovery.")
            # Fallback handling: return an empty instance of the schema to prevent graph crash
            try:
                return self.response_schema()
            except Exception as schema_err:
                raise Exception(f"Fatal Agent Failure and Schema lacks defaults: {schema_err}")
