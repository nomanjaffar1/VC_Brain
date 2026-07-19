from __future__ import annotations

from typing import Dict, List, Any


class ReflectionLoop:
    def __init__(self):
        self._states: Dict[str, Dict[str, Any]] = {}

    def evaluate(self, opportunity_id: str, answer: str, evidence_count: int, confidence: float) -> Dict[str, Any]:
        needs_more_evidence = evidence_count < 3 or confidence < 0.7
        return {
            "opportunity_id": opportunity_id,
            "needs_more_evidence": needs_more_evidence,
            "reflection": "Search again" if needs_more_evidence else "Sufficient evidence gathered",
            "answer": answer,
        }

    def store(self, opportunity_id: str, payload: Dict[str, Any]) -> None:
        self._states[opportunity_id] = payload

    def get(self, opportunity_id: str) -> Dict[str, Any] | None:
        return self._states.get(opportunity_id)


reflection_loop = ReflectionLoop()
