# 🎤 Word-for-Word Video Voiceover Scripts & Screen Directions

This document contains the exact word-for-word voiceover scripts (calibrated for a normal 60-second speaking pace of ~135 words) and detailed screen directions for both submissions.

---

## 🎬 Video 1: Demo Video (60 Seconds)
**Theme**: Complete UI/UX walkthrough covering all user features.

### Screen Action & Voiceover Guide:

*   **[0:00 - 0:08] WHAT TO SHOW ON SCREEN:** 
    Open to the dark mode **Dashboard / Launchpad** page. Slowly hover over the *"Deploying $100K Checks in 24 Hours"* title and the active *"System Healthy"* status badge.
    *   **VOICEOVER:** 
        *"Venture capital has historically been closed-door and relationship-driven. This is VC Brain—an autonomous AI Operating System built to source, screen, and deploy checks to founders in under 24 hours."*

*   **[0:08 - 0:18] WHAT TO SHOW ON SCREEN:** 
    Click on **⚙ Thesis Engine** in the sidebar. Move the Check Size slider to `$500K` and select `AI Infrastructure` under Sectors, then click *"Apply Thesis Configuration"*.
    *   **VOICEOVER:** 
        *"First, investors configure their specific mandate in the Thesis Engine, setting stage, sector, geography, and checks, which automatically filters all incoming opportunities."*

*   **[0:18 - 0:28] WHAT TO SHOW ON SCREEN:** 
    Click on **🌍 Outbound Discovery**. Hover over the GitHub, arXiv, and YC feeds, click *"Activate Outreach"* on Sarah Chen, show the generated cold email, and click *"Send and Converge"*.
    *   **VOICEOVER:** 
        *"Our Outbound engine continuously scans GitHub, Product Hunt, and arXiv. When it discovers a high-scoring candidate, we activate outreach, converging them into our funnel."*

*   **[0:28 - 0:38] WHAT TO SHOW ON SCREEN:** 
    Click on **⚡ AI Analysis** and click *"Start screening run"*. Watch the vertical pipeline animate down from Memory Layer to Investment Decision.
    *   **VOICEOVER:** 
        *"The AI analysis pipeline immediately triggers, running parallel committee reviews on the founder, market, and technology moat using our fused RAG database."*

*   **[0:38 - 0:48] WHAT TO SHOW ON SCREEN:** 
    Show the **APPROVE Decision Hero**. Point out the individual 3-axis scores (Founder, Market, Idea) and scroll down to the red *"Validator Mismatch ARR Alert"*.
    *   **VOICEOVER:** 
        *"In seconds, the system outputs an explicit Approve decision. Instead of single average scores, investors get independent multi-axis screening and a validator alert flagging metrics mismatches."*

*   **[0:48 - 1:00] WHAT TO SHOW ON SCREEN:** 
    Click on **📝 Investment Memo** and show the Notion-style left index, clicking between SWOT and Cap Table sections.
    *   **VOICEOVER:** 
        *"Finally, the system compiles a complete 12-section Notion-style Investment Memo detailing every risk, SWOT parameter, and Cap Table constraint. That is VC Brain."*

---

## 💻 Video 2: Tech Video (60 Seconds)
**Theme**: Under-the-hood look covering LangGraph, Multi-Agent architecture, and RAG.

### Screen Action & Voiceover Guide:

*   **[0:00 - 0:10] WHAT TO SHOW ON SCREEN:** 
    Show the Mermaid **LangGraph execution flow diagram** from `AGENTS_FLOW.md` on screen.
    *   **VOICEOVER:** 
        *"VC Brain’s intelligence layer is powered by a stateful multi-agent system built on LangGraph. This ensures robust, structured pipelines instead of simple LLM chat wrappers."*

*   **[0:10 - 0:25] WHAT TO SHOW ON SCREEN:** 
    Open VS Code to `backend/graph/workflow.py`. Highlight lines 173-199 (where nodes for fusion, founder_agent, consensus, and validator are added and connected).
    *   **VOICEOVER:** 
        *"We start with an Evidence Fusion node that uses RAG to ingest pitch decks, websites, and GitHub commits into a unified context. We then fan out to parallel committee agents: Founder Partner, Market Partner, and Technology Partner."*

*   **[0:25 - 0:40] WHAT TO SHOW ON SCREEN:** 
    Scroll to `run_validator` node in `workflow.py` (around lines 75-94). Point to the code calculating verified claims and adjusting the trust score.
    *   **VOICEOVER:** 
        *"Once the committee submits structured votes, the Consensus node computes a base trust score. Crucially, the Validator Agent runs a self-correction loop, comparing committee assertions against external registries to adjust scores and prevent hallucination."*

*   **[0:40 - 0:50] WHAT TO SHOW ON SCREEN:** 
    Open the file `backend/services/confidence_service.py` or highlight the deterministic confidence math on screen.
    *   **VOICEOVER:** 
        *"We calculate a deterministic confidence score by factoring validation coverage, missing evidence, and source risk, feeding these directly into our final Investment Memo Agent."*

*   **[0:50 - 1:00] WHAT TO SHOW ON SCREEN:** 
    Show the frontend codebase structure (Vite + Tailwind v4 + Recharts config) or show the final Recharts charts in action.
    *   **VOICEOVER:** 
        *"Built on FastAPI, React, and Tailwind CSS v4, VC Brain provides Notion-level approachability and Bloomberg-level analytical depth. Thank you."*
