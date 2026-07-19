from __future__ import annotations

from typing import Dict, List, Any


class AgentPlanner:
    def __init__(self):
        self._plans: Dict[str, Dict[str, Any]] = {}

    def create_plan(self, opportunity_id: str, goal: str, tools: List[str] | None = None) -> Dict[str, Any]:
        plan = {
            "opportunity_id": opportunity_id,
            "goal": goal,
            "status": "planned",
            "tools": tools or ["github", "website", "news", "crunchbase"],
            "steps": [
                "goal",
                "plan",
                "tool_selection",
                "execution",
                "reflection",
                "output",
            ],
        }
        self._plans[opportunity_id] = plan
        return plan

    def update_plan(self, opportunity_id: str, **updates: Any) -> Dict[str, Any]:
        plan = self._plans.setdefault(opportunity_id, {"opportunity_id": opportunity_id})
        plan.update(updates)
        return plan

    def get_plan(self, opportunity_id: str) -> Dict[str, Any] | None:
        return self._plans.get(opportunity_id)


agent_planner = AgentPlanner()
