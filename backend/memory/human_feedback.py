from backend.document_processing.ingestion import ingestion_pipeline

class HumanFeedbackService:
    @staticmethod
    def ingest_override(opportunity_id: str, rationale: str) -> bool:
        """
        Injects a human committee override directly into the FAISS memory.
        Future agents will retrieve this when evaluating similar setups.
        """
        memory_text = f"HUMAN COMMITTEE OVERRIDE FOR {opportunity_id}:\n{rationale}"
        
        metadata = {
            "source": "Human Investment Committee",
            "author": "Partner Override",
            "opportunity_id": opportunity_id,
            "memory_type": "HUMAN_OVERRIDE"
        }
        
        # We process this just like a document so it enters the vector space
        return ingestion_pipeline.process_document(
            raw_text=memory_text,
            metadata=metadata,
            doc_type="human_override",
            founder_id=opportunity_id
        )

human_feedback_service = HumanFeedbackService()
