from __future__ import annotations

from typing import Dict, Any, List
from datetime import datetime
from uuid import uuid4


class RunManager:
    def __init__(self):
        self._runs: Dict[str, Dict[str, Any]] = {}

    def create_run(self, opportunity_id: str, company: str | None = None) -> str:
        run_id = str(uuid4())
        self._runs[run_id] = {
            "run_id": run_id,
            "opportunity_id": opportunity_id,
            "company": company or opportunity_id,
            "created_at": datetime.utcnow().isoformat(timespec="seconds"),
            "timeline": [],
            "metrics": {},
            "agent_logs": [],
            "memo": None,
            "decision": None,
            "trust": None,
            "confidence": None,
            "portfolio_fit": None,
        }
        return run_id

    def append_event(self, run_id: str, event_type: str, message: str, metadata: Dict[str, Any] | None = None) -> None:
        if run_id not in self._runs:
            return
        self._runs[run_id]["timeline"].append({
            "timestamp": datetime.utcnow().isoformat(timespec="seconds"),
            "event_type": event_type,
            "message": message,
            "metadata": metadata or {},
        })

    def append_agent_log(self, run_id: str, agent: str, message: str, metadata: Dict[str, Any] | None = None) -> None:
        if run_id not in self._runs:
            return
        self._runs[run_id]["agent_logs"].append({
            "agent": agent,
            "message": message,
            "timestamp": datetime.utcnow().isoformat(timespec="seconds"),
            "metadata": metadata or {},
        })

    def update_metrics(self, run_id: str, metrics: Dict[str, Any]) -> None:
        if run_id not in self._runs:
            return
        self._runs[run_id]["metrics"].update(metrics)

    def finalize(self, run_id: str, *, decision: str | None = None, trust: float | None = None, confidence: float | None = None, portfolio_fit: float | None = None, memo: Dict[str, Any] | None = None) -> None:
        if run_id not in self._runs:
            return
        if decision is not None:
            self._runs[run_id]["decision"] = decision
        if trust is not None:
            self._runs[run_id]["trust"] = trust
        if confidence is not None:
            self._runs[run_id]["confidence"] = confidence
        if portfolio_fit is not None:
            self._runs[run_id]["portfolio_fit"] = portfolio_fit
        if memo is not None:
            self._runs[run_id]["memo"] = memo

    def get_run(self, run_id: str) -> Dict[str, Any] | None:
        return self._runs.get(run_id)

    def list_runs(self) -> List[Dict[str, Any]]:
        return list(self._runs.values())


run_manager = RunManager()
