from __future__ import annotations

from typing import Dict, List, Any
from datetime import datetime


class ObservabilityTracker:
    def __init__(self):
        self._timeline: Dict[str, List[Dict[str, Any]]] = {}

    def record_event(self, opportunity_id: str, event_type: str, message: str, metadata: Dict[str, Any] | None = None):
        payload = {
            "timestamp": datetime.utcnow().isoformat(timespec="seconds"),
            "event_type": event_type,
            "message": message,
            "metadata": metadata or {},
        }
        self._timeline.setdefault(opportunity_id, []).append(payload)

    def get_timeline(self, opportunity_id: str) -> List[Dict[str, Any]]:
        return list(self._timeline.get(opportunity_id, []))

    def get_status(self, opportunity_id: str) -> Dict[str, Any]:
        events = self.get_timeline(opportunity_id)
        last_event = events[-1] if events else None
        return {
            "opportunity_id": opportunity_id,
            "status": last_event["event_type"] if last_event else "queued",
            "last_message": last_event["message"] if last_event else "No activity yet",
            "event_count": len(events),
        }


observability = ObservabilityTracker()
