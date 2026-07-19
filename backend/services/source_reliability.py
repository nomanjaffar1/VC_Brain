from typing import Dict, Any


class SourceReliabilityService:
    def __init__(self):
        self.weights = {
            "github": 0.95,
            "crunchbase": 0.90,
            "official_website": 0.88,
            "pitch_deck": 0.85,
            "linkedin": 0.80,
            "news": 0.75,
            "reddit": 0.60,
            "blog": 0.30,
            "unknown": 0.50,
        }

    def get_reliability(self, source: str) -> float:
        key = (source or "unknown").lower().replace(" ", "_")
        return self.weights.get(key, self.weights["unknown"])

    def score_evidence(self, evidence: Dict[str, Any]) -> float:
        source = evidence.get("source", "unknown")
        base_reliability = self.get_reliability(source)
        confidence = evidence.get("confidence", 0.5)
        return round(base_reliability * confidence, 3)


source_reliability_service = SourceReliabilityService()
