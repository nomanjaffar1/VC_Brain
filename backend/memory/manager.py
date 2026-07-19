from backend.db.session import SessionLocal
from backend.models.memory import MemoryEvent
from backend.document_processing.ingestion import ingestion_pipeline
from datetime import datetime

class MemoryManagerService:
    def append_memory(
        self, 
        memory_type: str, 
        target_id: str, 
        source: str, 
        confidence: float, 
        agent_id: str, 
        summary: str
    ) -> bool:
        """
        Appends an immutable event to the SQLite ledger and embeds the summary into FAISS for semantic retrieval.
        Never updates or deletes past events.
        """
        # 1. Embed the memory into FAISS
        metadata = {
            "memory_type": memory_type,
            "target_id": target_id,
            "source": source,
            "agent_id": agent_id,
            "timestamp": datetime.utcnow().isoformat()
        }
        ingestion_pipeline.process_document(raw_text=summary, metadata=metadata, doc_type="memory", founder_id=target_id)
        
        # 2. Append to SQLite ledger
        db = SessionLocal()
        try:
            event = MemoryEvent(
                memory_type=memory_type,
                target_id=target_id,
                source=source,
                confidence=confidence,
                agent_id=agent_id,
                summary=summary,
                vector_reference="FAISS_INDEX"
            )
            db.add(event)
            db.commit()
            return True
        except Exception as e:
            print(f"Failed to append memory: {e}")
            db.rollback()
            return False
        finally:
            db.close()

memory_manager = MemoryManagerService()
