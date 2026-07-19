from sqlalchemy import Column, String, Float, DateTime, Text, ForeignKey
from datetime import datetime
from backend.db.session import Base
from backend.models.domain import generate_uuid

class MemoryEvent(Base):
    __tablename__ = "memory_events"
    
    # Overriding the basic one from domain.py to fit Phase 6 requirements
    __table_args__ = {'extend_existing': True}

    id = Column(String, primary_key=True, default=generate_uuid)
    memory_type = Column(String, nullable=False) # FOUNDER, COMPANY, INVESTMENT, DECISION
    target_id = Column(String, nullable=False) # e.g., founder_id or company_id
    
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    source = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    agent_id = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    
    # We store the FAISS chunk ID or string representation of the embedding if needed.
    # In practice, the actual vector is in FAISS, and we store the reference here.
    vector_reference = Column(String, nullable=True)
