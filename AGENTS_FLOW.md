# 🤖 VC Brain: Multi-Agent execution & Data Flow Guide

![VC Brain System Architecture Diagram](file:///C:/Users/noman/.gemini/antigravity/brain/33054f05-f08a-4849-8ba0-332748b309be/vc_brain_architecture_1784462742249.png)

This document provides a highly detailed walkthrough of the agentic graph, data transformations, and decision-making logic of the **VC Brain AI Operating System**. Use these diagrams and breakdowns for project presentations, pitches, or demo videos.

---

## 1. End-to-End Pipeline Overview

The pipeline strictly coordinates **Sourcing**, **Screening**, **Diligence**, and **Decision** across three system layers:

```mermaid
graph TD
    %% Define styles
    classDef layerStyle fill:#111111,stroke:#27272A,stroke-width:2px,color:#fff;
    classDef nodeStyle fill:#09090B,stroke:#2563EB,stroke-width:1px,color:#fff;
    
    subgraph Experience["Experience Layer (Investor-Facing UX)"]
        EX1["Launchpad & Sourcing Ingestion"]
        EX2["Trust Calibration Hub (Radial Gauge)"]
        EX3["Notion-Style Investment Memo"]
    end
    class Experience layerStyle;

    subgraph Intelligence["Intelligence Layer (Reasoning & Screening)"]
        IT1["Thesis Engine (Configurable Filters)"]
        IT2["Multi-Axis Screening (Founder, Market, Idea)"]
        IT3["Self-Correction Validator (Truth-Gap Check)"]
    end
    class Intelligence layerStyle;

    subgraph Memory["Memory Layer (Data Foundation)"]
        M1["Structured Knowledge Base (FAISS DB)"]
        M2["Persistent Founder Memory (Founder Score Trends)"]
    end
    class Memory layerStyle;

    %% Data flow
    EX1 -->|Ingests App / Lead| M1
    M1 -->|Feeds Historic Signals| IT1
    IT1 -->|Filters Match| IT2
    IT2 -->|Flags Claims| IT3
    IT3 -->|Calibrates Scores| EX2
    IT3 -->|Publishes Reports| EX3
```

---

## 2. LangGraph Execution State Machine

The backend orchestrates analysis using **LangGraph**, enabling parallel analysis nodes (fan-out) followed by a centralized consensus validation and memo drafting stage (fan-in).

```mermaid
stateDiagram-v2
    [*] --> Inbound_Ingestion : Inbound Deck & Website
    [*] --> Outbound_Discovery : Scans GitHub, arXiv, YC
    
    Inbound_Ingestion --> Evidence_Fusion
    Outbound_Discovery --> Evidence_Fusion
    
    state Evidence_Fusion {
        [*] --> RAG_Synthesis
        RAG_Synthesis --> Fused_Context_State
    }

    state Parallel_Committee_Review {
        [*] --> Founder_Partner : Evaluate track record & velocity
        [*] --> Market_Partner : Audit competitor SWOT & sizing
        [*] --> Technology_Partner : Analyze compiler layers & moats
    }
    
    Evidence_Fusion --> Parallel_Committee_Review : Fan-Out State
    
    Founder_Partner --> Consensus_Node
    Market_Partner --> Consensus_Node
    Technology_Partner --> Consensus_Node : Fan-In Votes
    
    state Consensus_Node {
        [*] --> Calculate_Consensus_Recommendation
        Calculate_Consensus_Recommendation --> Compute_Base_Trust_Score
    }
    
    Consensus_Node --> Validator_Node : Self-Correction Loop
    
    state Validator_Node {
        [*] --> Extract_Committee_Assertions
        Extract_Committee_Assertions --> Verify_Against_External_Registries
        Verify_Against_External_Registries --> Adjust_Trust_Score_Penalties : Flag Contradictions
    }
    
    Validator_Node --> Memo_Generation
    
    state Memo_Generation {
        [*] --> Compute_Deterministic_Confidence
        Compute_Deterministic_Confidence --> Build_Portfolio_Fit_Matrix
        Build_Portfolio_Fit_Matrix --> Draft_Investment_Memo
    }
    
    Memo_Generation --> [*] : Publish Decision-Ready Memo
```

---

## 3. Step-by-Step Agentic Operational Flow

When you click **Analyze Startup**, the agents execute sequentially to maintain a verifiable audit trail:

### Step 1: Evidence Ingestion & Fusion
*   **Agent**: `evidence_fusion`
*   **Input**: Raw pitch deck text, website crawled text, and founder GitHub commits.
*   **Operation**: De-duplicates inputs and builds an enriched RAG context.
*   **Result**: Fused Context State.

### Step 2: Parallel Committee Scoring (Non-Averaged)
Three specialized partner agents evaluate the opportunity along independent axes:
1.  **Founder Partner Agent (`founder_partner`)**: Evaluates the founder's track record (previous exits, open-source commits, hackathon history) and references the persistent **Founder Score** from the Memory Layer.
2.  **Market Partner Agent (`market_partner`)**: Builds a SWOT matrix, analyzes size of the target addressable market, and scores competitive threats (`Bullish` / `Neutral` / `Bear`).
3.  **Technology Partner Agent (`technology_partner`)**: Investigates the code repositories and architectures for deep compiler-level optimizations.

### Step 3: Consensus Calculation
*   **Service**: `ConsensusService`
*   **Operation**: Evaluates the committee votes. Calculates the average recommendation (e.g., `APPROVE`, `REJECT`, or `FURTHER_DD`) and establishes the `base_trust_score`.

### Step 4: Validator Verification & Self-Correction
*   **Agent**: `validator`
*   **Operation**: Extracts all key claims (e.g. *"$800k ARR"*, *"Stanford CS graduate"*) and validates them against external vector records. 
*   **Penalization Rule**: If a contradiction is detected (e.g., claimed ARR is higher than Stripe telemetry records), the Validator Agent applies a penalty, calibrating the overall **Trust Score** downward and flagging the discrepancy for the investor.

### Step 5: Memo Generation & Portfolio Fit mapping
*   **Agent**: `investment_memo`
*   **Operation**: Computes final deterministic confidence based on validation coverage and source reliability. Maps the startup against existing investments to compute the **Portfolio Fit Radar Chart**, and drafts the final 12-section Notion-style Memo.
