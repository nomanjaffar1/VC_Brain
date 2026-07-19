import time
from typing import Dict, Any

class EvaluationTracker:
    def __init__(self):
        self.metrics: Dict[str, Any] = {
            "latency_ms": 0,
            "trust_score": 0.0,
            "validation_score": 0.0,
            "hallucination_rate": 0.0,
        }
        self.start_time = 0

    def start_timer(self):
        self.start_time = time.time()

    def stop_timer(self):
        elapsed = time.time() - self.start_time
        self.metrics["latency_ms"] = int(elapsed * 1000)

    def record_validation(self, verified: int, total: int):
        if total > 0:
            self.metrics["validation_score"] = verified / total
            self.metrics["hallucination_rate"] = (total - verified) / total

    def record_trust(self, score: float):
        self.metrics["trust_score"] = score

    def get_metrics(self) -> Dict[str, Any]:
        return self.metrics

global_evaluator = EvaluationTracker()
