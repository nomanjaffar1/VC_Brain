from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
from backend.graph.workflow import vc_graph
from backend.evaluation.metrics import global_evaluator
from backend.document_processing.ingestion import ingest_documents
from backend.memory.human_feedback import human_feedback_service
import os
import json
import asyncio
from fastapi.responses import StreamingResponse

app = FastAPI(title="VC Brain API", version="4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Receives a Pitch Deck or Data Room file, saves it, and triggers FAISS vector ingestion.
    """
    upload_dir = os.path.join(os.getcwd(), "data", "pitch_decks")
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
            
        # Trigger Ingestion
        ingest_documents()
        return {"status": "success", "filename": file.filename, "message": "Document vectorized and ingested into FAISS"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class OverrideRequest(BaseModel):
    opportunity_id: str
    rationale: str

@app.post("/api/v1/diligence/override")
async def submit_human_override(request: OverrideRequest):
    success = human_feedback_service.ingest_override(request.opportunity_id, request.rationale)
    if success:
        return {"status": "success", "message": "Override ingested into VC Brain FAISS memory"}
    raise HTTPException(status_code=500, detail="Failed to ingest override")

@app.post("/api/v1/diligence/run")
async def run_diligence(opportunity_id: str):
    global_evaluator.start_timer()
    
    # Initialize LangGraph state
    initial_state = {
        "opportunity_id": opportunity_id,
        "evidence": [],
        "votes": [],
        "consensus_recommendation": "",
        "base_trust_score": 0.0,
        "validator_claims_verified": 0,
        "validator_claims_total": 0,
        "final_memo": None
    }
    
    # Execute the graph
    final_state = vc_graph.invoke(initial_state)
    
    global_evaluator.stop_timer()
    
    return {
        "status": "completed",
        "recommendation": final_state.get("consensus_recommendation", ""),
        "trust_score": final_state.get("base_trust_score", 0.0),
        "trust_breakdown": {
            "evidence": 30,
            "validation": 30,
            "agreement": 40,
            "penalties": -15
        },
        "metrics": global_evaluator.get_metrics(),
        "memo": final_state.get("final_memo"),
        "validator_coverage": final_state.get("validator_claims_total", 0),
        "votes": [v.model_dump() for v in final_state.get("votes", [])]
    }

from fastapi.responses import StreamingResponse
import json
import asyncio

@app.get("/api/v1/diligence/stream")
async def stream_diligence(opportunity_id: str):
    """
    Streams LangGraph execution state via Server-Sent Events (SSE).
    This provides real-time agent observability (similar to LangSmith).
    """
    async def event_generator():
        initial_state = {
            "opportunity_id": opportunity_id,
            "evidence": [],
            "votes": [],
            "consensus_recommendation": "",
            "base_trust_score": 0.0,
            "validator_claims_verified": 0,
            "validator_claims_total": 0,
            "final_memo": None
        }
        
        # LangGraph can stream node execution events
        for event in vc_graph.stream(initial_state):
            # 'event' is a dict mapping node_name -> state_updates
            for node_name, state_updates in event.items():
                payload = {
                    "node": node_name,
                    "status": "completed",
                    "timestamp": asyncio.get_event_loop().time()
                }
                yield f"data: {json.dumps(payload)}\n\n"
                await asyncio.sleep(0.1) # Prevent event flooding
                
        yield f"data: {json.dumps({'node': 'END', 'status': 'finished'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.get("/api/v1/evaluation/metrics")
async def get_metrics():
    return global_evaluator.get_metrics()
