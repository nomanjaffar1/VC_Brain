from __future__ import annotations

from typing import Dict, List, Any


class EvaluationDataset:
    def __init__(self):
        self._cases = [
            {
                "company": "InfraAI",
                "expected_recommendation": "APPROVE",
                "expected_trust": 0.8,
                "expected_validator": "verified",
            },
            {
                "company": "NovaML",
                "expected_recommendation": "FURTHER_DD",
                "expected_trust": 0.6,
                "expected_validator": "needs_review",
            },
        ]

    def list_cases(self) -> List[Dict[str, Any]]:
        return list(self._cases)


evaluation_dataset = EvaluationDataset()
