import os
from typing import Dict, Any, List
from datetime import datetime
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from backend.config.settings import settings
from backend.db.session import SessionLocal
from backend.models.domain import MemoryEvent, generate_uuid

# We assume a local FAISS index path
FAISS_INDEX_PATH = "vc_brain_faiss_index"

class DocumentIngestionPipeline:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
    
    def process_document(self, raw_text: str, metadata: Dict[str, Any], doc_type: str, founder_id: str = None) -> bool:
        """
        Processes a document (PDF, Website, GitHub, etc), chunks it, embeds it in FAISS, 
        and stores metadata tracking in SQLite.
        """
        try:
            # 1. Clean & Chunk Text
            chunks = self.text_splitter.split_text(raw_text)
            
            # Ensure metadata maps to every chunk
            metadatas = [metadata.copy() for _ in chunks]
            for i, m in enumerate(metadatas):
                m["doc_type"] = doc_type
                m["chunk_index"] = i
                m["timestamp"] = datetime.utcnow().isoformat()
            
            # 2. Store Embeddings in FAISS
            if os.path.exists(FAISS_INDEX_PATH):
                vectorstore = FAISS.load_local(FAISS_INDEX_PATH, self.embeddings, allow_dangerous_deserialization=True)
                vectorstore.add_texts(texts=chunks, metadatas=metadatas)
                vectorstore.save_local(FAISS_INDEX_PATH)
            else:
                vectorstore = FAISS.from_texts(texts=chunks, embedding=self.embeddings, metadatas=metadatas)
                vectorstore.save_local(FAISS_INDEX_PATH)
            
            # 3. Store Metadata inside SQLite as a MemoryEvent
            db = SessionLocal()
            try:
                event = MemoryEvent(
                    id=generate_uuid(),
                    founder_id=founder_id,
                    event_type=f"INGESTED_{doc_type.upper()}",
                    delta_score=0.0,
                    timestamp=datetime.utcnow()
                )
                db.add(event)
                db.commit()
            finally:
                db.close()
                
            return True
            
        except Exception as e:
            print(f"Ingestion Error: {e}")
            return False

ingestion_pipeline = DocumentIngestionPipeline()

def ingest_documents():
    """
    Helper function to automatically ingest all files in data/pitch_decks
    """
    upload_dir = os.path.join(os.getcwd(), "data", "pitch_decks")
    if not os.path.exists(upload_dir):
        return
        
    for filename in os.listdir(upload_dir):
        file_path = os.path.join(upload_dir, filename)
        if os.path.isfile(file_path):
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                
            metadata = {"filename": filename, "source": "Uploaded Pitch Deck"}
            # default founder_id for demo purposes
            founder_id = "demo_founder_99"
            if "founder" in content.lower():
                 founder_id = "founder_99"

            ingestion_pipeline.process_document(
                raw_text=content,
                metadata=metadata,
                doc_type="pitch_deck",
                founder_id=founder_id
            )
