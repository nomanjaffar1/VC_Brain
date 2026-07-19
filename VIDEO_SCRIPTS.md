# 📹 Hackathon Video Submission Scripts (60 Seconds Each)

This document contains step-by-step narration scripts and visual cues for your two 60-second video submissions: **Demo Video** and **Tech Video**.

---

## 🎬 Video 1: Demo Video (60 Seconds Max)
**Focus**: UI/UX Showcase, Investor Workflow, Sourcing to Decision pipeline.

### Script & Storyboard:

| Time | Visual on Screen | Spoken Script (Narration) |
| :--- | :--- | :--- |
| **0:00 - 0:10** | Show the **Launchpad Page** in full dark mode. Hover over the large "Deploying $100K Checks in 24 Hours" hero. | *"Venture capital has always been gated by who you know. We built VC Brain to change that. Welcome to the world's first AI Operating System for Venture Capital."* |
| **0:10 - 0:25** | Click on `🌍 Outbound Discovery`. Scroll through candidate cards, click "Activate Outreach" on Sarah Chen, show the cold email draft, and click send. | *"With our Outbound Sourcing Engine, the system continuously scans GitHub, Product Hunt, and arXiv. Here, we identify exceptional founders before they start fundraising, draft personalized outreach, and instantly converge them into our funnel."* |
| **0:25 - 0:40** | Click on `⚡ AI Analysis`. Type or click the start screen. Watch the **Visual Pipeline** pulse and animate through Memory, Agents, and Trust Validator steps. | *"Once inside, our multi-agent pipeline kicks off, running parallel reviews across founder pedigree, market size, and technical moat, while verifying claims in real-time."* |
| **0:40 - 0:60** | Show the **APPROVE Decision Hero Page**. Scroll through the 3-axis scores (Founder, Market, Idea), the "Why" panel, the **Trust Center** warning alert, and click into the Notion-Style Memo. | *"Within seconds, the engine delivers a premium, verified investment decision. Investors get a massive Approve recommendation, verifiable trust statistics with contradiction validator flags, and a complete 12-section Notion memo. VC Brain enables 100x investment velocity."* |

---

## 💻 Video 2: Tech Video (60 Seconds Max)
**Focus**: Stack, LangGraph Architecture, Self-Correction loops, Data Ingestion.

### Script & Storyboard:

| Time | Visual on Screen | Spoken Script (Narration) |
| :--- | :--- | :--- |
| **0:00 - 0:15** | Show the **LangGraph workflow diagram** (or display the Mermaid chart from `README.md` on screen). | *"VC Brain is powered by a stateful multi-agent orchestrator built on LangGraph. This architecture ensures structured, reproducible evaluations instead of standard single-agent text prompts."* |
| **0:15 - 0:30** | Show the `workflow.py` code in VS Code (specifically the parallel nodes fan-out/fan-in section). | *"When a run starts, our intake node fuses unstructured inputs into a vector store. We then fan out to parallel committee agents: Founder Partner, Market Partner, and Technology Partner, who query FAISS and return structured evaluations."* |
| **0:30 - 0:45** | Transition the screen to show the **Trust Center** in the UI, highlighting the red "Validator Flagged ARR Mismatch" alert. | *"To prevent hallucination, our Validator Agent acts as a self-correction loop. It extracts claims made by the committee, validates them against external registries, and automatically applies trust penalties if data gaps or contradictions are found."* |
| **0:45 - 0:60** | Show the `App.tsx` code or the built React dashboard with Recharts. | *"Our frontend is built on React, TypeScript, and Tailwind CSS v4, utilizing Recharts for multi-axis radar charts and custom SVG radial gauges. The result is a robust, data-dense operating system built for equitable capital allocation."* |
