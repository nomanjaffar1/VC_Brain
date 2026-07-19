from typing import Callable, Dict
from backend.agents.base import BaseAgent

class AgentRegistry:
    def __init__(self):
        self._agents: Dict[str, BaseAgent] = {}
        
    def register(self, name: str, agent: BaseAgent):
        self._agents[name] = agent
        
    def get_agent(self, name: str) -> BaseAgent:
        if name not in self._agents:
            raise ValueError(f"Agent {name} not registered")
        return self._agents[name]
        
    def list_agents(self) -> list:
        return list(self._agents.keys())

agent_registry = AgentRegistry()
