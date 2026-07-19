import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text, ForeignKey
from backend.db.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class Founder(Base):
    __tablename__ = "founders"

    id = Column(String, primary_key=True, default=generate_uuid)
    public_keys = Column(Text, default="{}") # JSON
    founder_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(String, primary_key=True, default=generate_uuid)
    company_id = Column(String, nullable=True)
    status = Column(String, default="SOURCED")
    created_at = Column(DateTime, default=datetime.utcnow)

class MemoryEvent(Base):
    __tablename__ = "memory_events"

    id = Column(String, primary_key=True, default=generate_uuid)
    founder_id = Column(String, ForeignKey("founders.id"))
    event_type = Column(String)
    delta_score = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
