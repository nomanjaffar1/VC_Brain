import os
from typing import Type, Any, Dict, List
from pydantic import BaseModel
from backend.config.router import model_router
from backend.services.retrieval_service import retrieval_service
from backend.services.planning import agent_planner
from backend.services.reflection import reflection_loop
from backend.services.run_manager import run_manager
from backend.services.observability import observability

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
        Executes the agent by planning, selecting tools, retrieving evidence, and reflecting on the result.
        """
        run_id = context_data.get("run_id") if context_data else None
        plan = agent_planner.create_plan(opportunity_id, f"Analyze {self.agent_name} for {opportunity_id}")
        if run_id:
            run_manager.append_agent_log(run_id, self.agent_name, "planning", {"goal": plan["goal"], "tools": plan["tools"]})
            observability.record_event(opportunity_id, "planning", f"{self.agent_name} planning", {"run_id": run_id})

        retrieved_evidence = retrieval_service.hybrid_retrieval(query, founder_id=opportunity_id)
        analytics = retrieval_service.get_last_retrieval_analytics()

        active_thesis = thesis_service.get_active_thesis().model_dump_json(indent=2)

        context_str = f"ACTIVE INVESTMENT THESIS:\n{active_thesis}\n\n"
        context_str += f"RETRIEVED EVIDENCE:\n{retrieved_evidence}\n\n"
        context_str += f"RETRIEVAL ANALYTICS:\n{analytics}\n\n"

        if context_data:
            context_str += f"UPSTREAM DATA:\n{str(context_data)}\n\n"

        context_str += f"QUERY:\n{query}"

        final_prompt = f"{self.system_prompt}\n\n{context_str}"

        try:
            response = self.llm.invoke(final_prompt)
            reflection = reflection_loop.evaluate(opportunity_id, str(response), evidence_count=max(1, analytics.get("compressed", 1)), confidence=0.8)
            if run_id:
                run_manager.append_agent_log(run_id, self.agent_name, "reflection", reflection)
                observability.record_event(opportunity_id, "reflection", f"{self.agent_name} reflected", {"run_id": run_id, "needs_more_evidence": reflection["needs_more_evidence"]})
            return response
        except Exception as e:
            print(f"[{self.agent_name}] LLM Execution Error: {e}. Executing Workflow Recovery.")
            try:
                return self.response_schema()
            except Exception as schema_err:
                raise Exception(f"Fatal Agent Failure and Schema lacks defaults: {schema_err}")
