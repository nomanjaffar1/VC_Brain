import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Brain,
  Check,
  CheckCircle2,
  ChevronRight,
  Database,
  FileText,
  Globe,
  History,
  Home,
  Inbox,
  Search,
  Shield,
  Sliders,
  Sparkles,
  TrendingUp,
  UploadCloud,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getBackendMetrics, getBenchmark, getMemo, getRetrievalAnalytics, getRunHistory, runDiligence, uploadPitchDeck,
  submitInboundApplication, startEnrichment, getEnrichmentStatus,
  executeDiscoverySearch, createInvestmentCase, saveDiscoveryQuery, getSavedQueries
} from './lib/api';
import {
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

const panelClass =
  'rounded-[1.6rem] border border-white/10 bg-slate-900/70 shadow-[0_20px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl';
const panelSoftClass =
  'rounded-[1.4rem] border border-white/10 bg-slate-950/70 shadow-[0_14px_45px_rgba(2,6,23,0.28)] backdrop-blur-xl';
const buttonClass =
  'inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/30';
const secondaryButtonClass =
  'inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-semibold text-slate-200 transition-all hover:border-blue-400/30 hover:bg-white/10';

export default function App() {
  const [activeView, setActiveView] = useState<'launchpad' | 'inbound' | 'outbound' | 'memory' | 'analysis' | 'trust' | 'memo' | 'thesis'>('launchpad');

  const [thesisConfig, setThesisConfig] = useState({
    sectors: ['AI Infrastructure', 'SaaS'],
    stages: ['Seed'],
    geography: 'US & Europe',
    checkSize: 500,
    ownership: 10,
    riskAppetite: 'Moderate',
  });

  // Inbound Application State
  const [inboundForm, setInboundForm] = useState({
    companyName: 'InfraAI',
    website: 'infra.ai',
    oneLineDescription: 'Compiler-level LLM optimization routing',
    sector: 'AI Infrastructure',
    stage: 'Seed',
    location: 'San Francisco, CA',
    fundingAsk: 500000,
    currentRaise: 0,
    companyEmail: 'founders@infra.ai',
    teamSize: 8,
    foundedYear: 2023,
    currentRevenue: 0,
    mrr: 0,
  });

  const [founders, setFounders] = useState<any[]>([
    { id: 1, name: 'Sarah Chen', linkedin: 'linkedin.com/in/sarahchen', github: 'sarahchen', twitter: '@sarahchen', website: '', isTechnical: true, previousStartup: true, openSource: true, researchPubs: false }
  ]);

  const [assets, setAssets] = useState<any[]>([
    { id: 1, type: 'Pitch Deck', status: 'Ready', uploadedAt: new Date().toISOString() }
  ]);

  const [externalSources, setExternalSources] = useState({
    github: 'github.com/infra-ai',
    gitlab: '',
    productHunt: '',
    appStore: '',
    googlePlay: '',
    huggingface: '',
    arxiv: '',
    blog: 'blog.infra.ai',
    crunchbase: '',
    linkedin: '',
    twitter: '@infraai',
    youtube: '',
  });

  const [investmentContext, setInvestmentContext] = useState({
    thesis: 'AI Infrastructure Modernization',
    priority: 'High',
    notes: 'Strong technical moat and market timing',
    partner: 'Jane Smith',
    fund: 'Fund III',
    targetOwnership: 8,
    riskAppetite: 'Moderate',
    tags: ['AI', 'Infrastructure', 'Enterprise'],
  });

  const [enrichmentPhase, setEnrichmentPhase] = useState<'idle' | 'running' | 'complete'>('idle');
  const [enrichmentSteps, setEnrichmentSteps] = useState<any[]>([]);

  // Outbound Discovery State
  const [outboundSources, setOutboundSources] = useState({
    github: true,
    gitlab: true,
    productHunt: true,
    hackerNews: true,
    ycombinator: true,
    techstars: true,
    crunchbase: true,
    dealroom: true,
    arxiv: true,
    semanticScholar: true,
    linkedin: true,
    twitter: true,
    news: true,
  });

  const [outboundQuery, setOutboundQuery] = useState('technical founder building AI infrastructure');
  const [outboundFilters, setOutboundFilters] = useState({
    sector: '',
    country: '',
    stage: '',
    githubStars: { min: 0, max: 100000 },
    employees: { min: 0, max: 1000 },
    researchPublished: false,
    technicalFounder: true,
    ossContributor: true,
  });

  const [savedQueries, setSavedQueries] = useState<any[]>([
    { id: 1, name: 'AI Infrastructure Europe', query: 'technical founder building AI infrastructure in Europe' },
    { id: 2, name: 'Healthcare AI', query: 'founder with healthcare background and AI expertise' },
  ]);

  const [discoveryResults, setDiscoveryResults] = useState<any[]>([
    { id: 1, founderName: 'Sarah Chen', companyName: 'InfraAI', founderScore: 92, companyScore: 88, portfolioFit: 85, coldStartScore: 79, marketScore: 82, techScore: 95, expectedReturn: '12x', confidence: 0.93, riskLevel: 'Moderate', githubStars: 6432, paperCitations: 24, accelerator: 'Y Combinator', country: 'USA', latestSignal: 'Enterprise partnership announced', foundReason: 'GitHub stars increased 80%' }
  ]);

  const [outboundStep, setOutboundStep] = useState<'discover' | 'evaluate' | 'case'>('discover');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [semanticQuery, setSemanticQuery] = useState('technical founder, Berlin, AI infra, enterprise traction');
  const [semanticResults, setSemanticResults] = useState<any[]>([]);
  const [analysisPhase, setAnalysisPhase] = useState<'idle' | 'executing' | 'complete'>('idle');
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [backendMetrics, setBackendMetrics] = useState<any>(null);
  const [runHistory, setRunHistory] = useState<any[]>([]);
  const [benchmark, setBenchmark] = useState<any>(null);
  const [retrievalAnalytics, setRetrievalAnalytics] = useState<any>(null);
  const [memoOverview, setMemoOverview] = useState<any>(null);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isRunningDiligence, setIsRunningDiligence] = useState(false);
  const [diligenceSummary, setDiligenceSummary] = useState<string>('');
  const [selectedMemoSection, setSelectedMemoSection] = useState<string>('Investment recommendation');

  const memoSections = {
    'Investment recommendation': {
      heading: 'Investment recommendation',
      content: 'Executive Summary • Investment Recommendation • Founder Assessment • Technology Assessment • Market Opportunity • Competitive Landscape • Business Model • Risks & Red Flags • Mitigation Strategies • Portfolio Fit • Exit Potential • Due Diligence Questions • Evidence & Citations • Final Confidence'
    },
    'Executive summary': {
      heading: 'Executive summary',
      content: 'InfraAI is developing compiler-level optimization routing layers to eliminate LLM latency bottlenecks. The system combines strong technical depth, measurable open-source traction, and a defensible moat that makes it a credible Seed-stage investment candidate.'
    },
    'Founder Assessment': {
      heading: 'Founder assessment',
      content: 'Founders show exceptional execution signals with a proven track record in distributed systems. Strong open-source contributions signal deep technical expertise and community leadership. Founder score: 92/100 with an upward trajectory.'
    },
    'Technology Assessment': {
      heading: 'Technology assessment',
      content: 'The core technology is a proprietary compiler optimization layer that addresses systemic LLM latency bottlenecks. Architecture includes context-scaling routines, pipelined inference, and vendor-agnostic integration. Technology moat is strong and difficult to replicate.'
    },
    'Market Opportunity': {
      heading: 'Market opportunity',
      content: 'Total addressable market: $12B in AI infrastructure. Market growing at 38% CAGR. Enterprise demand for performance optimization is accelerating. Strong timing window before hyperscaler in-house solutions mature.'
    },
    'Competitive Landscape': {
      heading: 'Competitive landscape',
      content: 'Direct competitors: vLLM, TensorRT. Indirect competition from cloud providers. InfraAI\'s approach is differentiated through compiler-level optimization vs. runtime patching. Defensibility via patents and community moat.'
    },
    'Business Model': {
      heading: 'Business model',
      content: 'B2B SaaS licensing model with per-inference pricing. Target customers: AI infrastructure teams, LLM API providers, enterprise AI operations. Projected gross margins: 75%+ after scaling.'
    },
    'Risks & Red Flags': {
      heading: 'Risks & red flags',
      content: 'Market adoption risk: requires integration with existing ML stacks. Hyperscaler competition accelerating. Technology could be commoditized. Finance evidence incomplete. Traction validation needed.'
    },
    'Mitigation Strategies': {
      heading: 'Mitigation strategies',
      content: 'Accelerate enterprise pilots and case studies. Build strategic partnerships with cloud providers. Continue open-source investments for community defensibility. Expand team to reduce execution risk.'
    },
    'Portfolio Fit': {
      heading: 'Portfolio fit',
      content: 'Strong fit with existing portfolio in AI infrastructure. Minimal cannibalization risk. Adds geographic diversification. Aligns with fund thesis in developer tools and infrastructure.'
    },
    'Exit Potential': {
      heading: 'Exit potential',
      content: 'Expected exit horizon: 7-10 years. Acquisition targets: cloud providers (AWS, Azure, GCP), LLM companies (Anthropic, others), or independent IPO. Expected return multiple: 12x at $100M ARR.'
    },
    'Due Diligence Questions': {
      heading: 'Due diligence questions',
      content: '• What is the current ARR and MRR? • How many enterprise pilots are in progress? • What is the current burn rate and runway? • Have you secured any design partnerships? • What are the detailed technical benchmarks vs. vLLM?'
    },
    'Evidence & Citations': {
      heading: 'Evidence & citations',
      content: '[GitHub API] 6,432 stars • [LinkedIn] Founder education and track record verified • [Company website] Technology overview confirmed • [Pitch deck] Business model outlined • [Registry data] ARR claims reconciled • [News] Market trend validation'
    },
    'Final Confidence': {
      heading: 'Final confidence',
      content: 'Overall confidence score: 93%. Based on: Founder track record (91%), Technology differentiation (95%), Market timing (74%), Evidence quality (87%), Competitive moat (89%). Recommendation: APPROVE for $500K check at 8% target ownership.'
    }
  };

  const radarData = [
    { subject: 'Market', A: 74, fullMark: 100 },
    { subject: 'Team', A: 98, fullMark: 100 },
    { subject: 'Traction', A: 85, fullMark: 100 },
    { subject: 'Technology', A: 95, fullMark: 100 },
    { subject: 'Execution', A: 91, fullMark: 100 },
  ];

  const founderTrendData = [
    { name: '2021', score: 65 },
    { name: '2022', score: 72 },
    { name: '2023', score: 85 },
    { name: '2024', score: 92 },
  ];

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const [metrics, history, benchmarkData, retrieval, memo] = await Promise.all([
          getBackendMetrics(),
          getRunHistory(),
          getBenchmark(),
          getRetrievalAnalytics(),
          getMemo(),
        ]);
        setBackendMetrics(metrics);
        setRunHistory(history?.runs || []);
        setBenchmark(benchmarkData);
        setRetrievalAnalytics(retrieval);
        setMemoOverview(memo);
      } catch (error) {
        console.error('Failed to load backend metrics', error);
      }
    };

    loadMetrics();
  }, []);

  useEffect(() => {
    if (analysisPhase !== 'executing') return;
    const steps = [
      { step: 1, delay: 1000 },
      { step: 2, delay: 2500 },
      { step: 3, delay: 4000 },
      { step: 4, delay: 5500 },
      { step: 5, delay: 7000 },
      { step: 6, delay: 8500 },
    ];

    const timers = steps.map(({ step, delay }) => window.setTimeout(() => setPipelineStep(step), delay));
    const completeTimer = window.setTimeout(() => setAnalysisPhase('complete'), 9000);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(completeTimer);
    };
  }, [analysisPhase]);

  const startAnalysis = async () => {
    setActiveView('analysis');
    setAnalysisPhase('executing');
    setPipelineStep(0);
    setIsRunningDiligence(true);
    setDiligenceSummary('');

    try {
      const result = await runDiligence('infraai');
      setDiligenceSummary(result?.recommendation || 'Diligence completed successfully.');
      const [metrics, history, benchmarkData, retrieval, memo] = await Promise.all([
        getBackendMetrics(),
        getRunHistory(),
        getBenchmark(),
        getRetrievalAnalytics(),
        getMemo(),
      ]);
      setBackendMetrics(metrics);
      setRunHistory(history?.runs || []);
      setBenchmark(benchmarkData);
      setRetrievalAnalytics(retrieval);
      setMemoOverview(memo);
    } catch (error) {
      setDiligenceSummary(error instanceof Error ? error.message : 'Diligence run failed.');
    } finally {
      setIsRunningDiligence(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage('');

    try {
      const result = await uploadPitchDeck(file);
      setUploadMessage(result?.message || `Uploaded ${file.name} successfully.`);
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSemanticSearch = () => {
    setSemanticResults([
      {
        name: 'Sarah Chen',
        role: 'CTO, compiler architect',
        score: 92,
        alignment: '98% Match to active thesis (AI Infra, US, Seed)',
      },
      {
        name: 'Lukas Mueller',
        role: 'Distributed systems dev',
        score: 87,
        alignment: '91% Match to active thesis (AI Infra, Europe, Seed)',
      },
    ]);
  };

  const handleInboundEnrichment = async () => {
    try {
      setEnrichmentPhase('running');
      const inboundData = {
        company_name: inboundForm.companyName,
        website: inboundForm.website,
        one_line_description: inboundForm.oneLineDescription,
        sector: inboundForm.sector,
        stage: inboundForm.stage,
        location: inboundForm.location,
        funding_ask: inboundForm.fundingAsk,
        current_raise: inboundForm.currentRaise,
        company_email: inboundForm.companyEmail,
        team_size: inboundForm.teamSize,
        founded_year: inboundForm.foundedYear,
        current_revenue: inboundForm.currentRevenue,
        mrr: inboundForm.mrr,
        founders: founders,
        external_sources: externalSources,
        investment_context: investmentContext,
      };

      const submitResult = await submitInboundApplication(inboundData);
      const opportunityId = submitResult.opportunity_id;

      // Simulate enrichment steps
      await startEnrichment(opportunityId);
      
      setEnrichmentPhase('complete');
    } catch (error) {
      console.error('Enrichment failed:', error);
      setEnrichmentPhase('idle');
    }
  };

  const handleOutboundSearch = async () => {
    try {
      const searchResult = await executeDiscoverySearch(outboundQuery, outboundSources, outboundFilters);
      setDiscoveryResults(searchResult.candidates || []);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleCreateInvestmentCase = async (candidate: any) => {
    try {
      const caseResult = await createInvestmentCase({
        candidate_id: candidate.id,
        company_name: candidate.company_name,
        founder_name: candidate.founder_name,
      });
      setSelectedCandidate(candidate);
      setOutboundStep('case');
      startAnalysis();
    } catch (error) {
      console.error('Case creation failed:', error);
    }
  };

  const handleSaveQuery = async () => {
    try {
      await saveDiscoveryQuery(`Query ${new Date().toLocaleDateString()}`, outboundQuery);
      alert('Query saved successfully!');
    } catch (error) {
      console.error('Save query failed:', error);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.16),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_48%,_#111827_100%)] text-slate-100 selection:bg-blue-500/30">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-slate-950/70 px-6 backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <div className="flex cursor-pointer items-center space-x-3" onClick={() => setActiveView('launchpad')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 shadow-lg shadow-blue-500/20">
              <Shield className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">VC Brain</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400">MASCHMEYER GROUP</div>
            </div>
          </div>
          <div className="mx-2 h-5 w-px bg-white/10" />
          <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">Live intelligence</div>
        </div>

        <div className="max-w-xl flex-1 px-8">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Global search..."
              className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-2 pl-9 pr-4 text-sm text-slate-200 outline-none transition focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span>System healthy</span>
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 font-semibold text-white shadow-inner">A</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-slate-950/40 px-3 py-6 backdrop-blur-xl">
          <nav className="space-y-1.5">
            {[
              { key: 'launchpad', label: 'Dashboard', icon: Home },
              { key: 'thesis', label: 'Thesis engine', icon: Sliders },
              { key: 'inbound', label: 'Inbound applications', icon: Inbox },
              { key: 'outbound', label: 'Outbound discovery', icon: Globe },
              { key: 'memory', label: 'Founder memory', icon: Brain },
              { key: 'analysis', label: 'AI analysis', icon: Zap },
              { key: 'trust', label: 'Trust center', icon: Shield },
              { key: 'memo', label: 'Investment memo', icon: FileText },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveView(key as any);
                  if (key === 'outbound') setOutboundStep('discover');
                }}
                className={`flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${activeView === key ? 'bg-gradient-to-r from-blue-500/15 to-violet-500/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>

          <div className={`${panelSoftClass} mt-6 p-4`}>
            <div className="mb-2 flex items-center space-x-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              AI workflow
            </div>
            <p className="text-sm text-slate-300">Your swarm is ready to screen, validate, and draft the next memo.</p>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto border-r border-white/10 bg-slate-950/20 px-6 py-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-10">
            {activeView === 'launchpad' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className={`${panelClass} overflow-hidden p-8`}>
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                      <div className="mb-4 inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-300">
                        <Zap className="mr-2 h-3.5 w-3.5" />
                        Venture intelligence platform
                      </div>
                      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">VC Brain, engineered for disciplined venture decision-making.</h1>
                      <p className="mt-4 text-lg text-slate-300">Screen founders with greater clarity, connect diligence workflows to the backend in real time, and publish investor-ready memos with confidence.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-4 shadow-inner">
                      <div className="text-3xl font-semibold text-white">$100K</div>
                      <div className="text-sm text-slate-400">Checks deployable in 24 hours</div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <button onClick={() => setActiveView('inbound')} className={`${panelClass} group flex flex-col items-start p-8 text-left transition hover:-translate-y-1`}>
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-blue-300">
                      <Sparkles className="h-7 w-7" />
                    </div>
                    <div className="text-xl font-semibold text-white">Start a new diligence workflow</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">Submit a new company, connect it to the live API, and launch the full screening and memo pipeline.</p>
                  </button>
                  <button onClick={() => setActiveView('analysis')} className={`${panelClass} group flex flex-col items-start p-8 text-left transition hover:-translate-y-1`}>
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-300">
                      <History className="h-7 w-7" />
                    </div>
                    <div className="text-xl font-semibold text-white">Resume the most recent review</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">Pick up from InfraAI, VisionStack, or NovaML and continue from the latest backend-backed analysis.</p>
                  </button>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <div className={`${panelClass} p-6`}>
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Recent evaluations</div>
                        <div className="text-lg font-semibold text-white">Latest startup reviews</div>
                      </div>
                      <button className="text-sm font-medium text-blue-300">View all</button>
                    </div>
                    <div className="space-y-3">
                      {runHistory.length > 0 ? runHistory.slice(0, 3).map((item: any, index: number) => (
                        <div key={item.run_id || index} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
                          <div>
                            <div className="font-semibold text-white">{item.company || item.opportunity_id || 'Run'}</div>
                            <div className="text-sm text-slate-400">{item.created_at || 'Recorded'} • {item.decision || 'In progress'}</div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">{item.trust ? `${Math.round(item.trust * 100)}%` : 'Live'}</span>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </div>
                        </div>
                      )) : ['InfraAI', 'VisionStack', 'NovaML'].map((item, index) => (
                        <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
                          <div>
                            <div className="font-semibold text-white">{item}</div>
                            <div className="text-sm text-slate-400">Updated {index === 0 ? '2 hours ago' : index === 1 ? '5 hours ago' : '1 day ago'}</div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">Approve</span>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`${panelClass} p-6`}>
                    <div className="mb-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Benchmark mode</div>
                      <div className="text-lg font-semibold text-white">Evaluation accuracy</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                      <div className="text-4xl font-semibold text-white">{benchmark?.accuracy ? `${Math.round(benchmark.accuracy * 100)}%` : '88%'}</div>
                      <div className="mt-2 text-sm text-slate-400">Across startup cases with expected recommendations and trust targets.</div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-300">
                      {benchmark?.dataset?.slice(0, 2).map((item: any, index: number) => (
                        <div key={item.company || index} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2">
                          <span>{item.company}</span>
                          <span className="text-emerald-300">{item.expected_recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'thesis' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Thesis engine configuration</h2>
                    <p className="mt-1 text-sm text-slate-400">Tune sectors, check size, and risk appetite so recommendations stay aligned with your mandate.</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">Adaptive</div>
                </div>

                <div className={`${panelClass} p-8`}>
                  <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                      <div>
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Sectors filter</label>
                        <div className="flex flex-wrap gap-2">
                          {['AI Infrastructure', 'Cybersecurity', 'SaaS', 'Web3'].map((sec) => {
                            const isSelected = thesisConfig.sectors.includes(sec);
                            return (
                              <button
                                key={sec}
                                onClick={() => {
                                  const updated = isSelected ? thesisConfig.sectors.filter((s) => s !== sec) : [...thesisConfig.sectors, sec];
                                  setThesisConfig({ ...thesisConfig, sectors: updated });
                                }}
                                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${isSelected ? 'border-blue-400/40 bg-blue-500/10 text-blue-200' : 'border-white/10 bg-white/5 text-slate-300 hover:border-blue-400/20 hover:text-white'}`}
                              >
                                {sec}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Stage</label>
                        <div className="flex flex-wrap gap-2">
                          {['Pre-Seed', 'Seed', 'Series A'].map((stg) => {
                            const isSelected = thesisConfig.stages.includes(stg);
                            return (
                              <button
                                key={stg}
                                onClick={() => {
                                  const updated = isSelected ? thesisConfig.stages.filter((s) => s !== stg) : [...thesisConfig.stages, stg];
                                  setThesisConfig({ ...thesisConfig, stages: updated });
                                }}
                                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${isSelected ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white'}`}
                              >
                                {stg}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Target geography</label>
                        <input type="text" className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-400/50" value={thesisConfig.geography} onChange={(e) => setThesisConfig({ ...thesisConfig, geography: e.target.value })} />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <div className="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                          <span>Target check size</span>
                          <span className="text-white">${thesisConfig.checkSize}K</span>
                        </div>
                        <input type="range" min="100" max="2000" step="50" value={thesisConfig.checkSize} onChange={(e) => setThesisConfig({ ...thesisConfig, checkSize: Number(e.target.value) })} className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-blue-500" />
                      </div>

                      <div>
                        <div className="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                          <span>Target ownership</span>
                          <span className="text-white">{thesisConfig.ownership}%</span>
                        </div>
                        <input type="range" min="5" max="25" step="1" value={thesisConfig.ownership} onChange={(e) => setThesisConfig({ ...thesisConfig, ownership: Number(e.target.value) })} className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-violet-500" />
                      </div>

                      <div>
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Risk appetite</label>
                        <select className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-400/50" value={thesisConfig.riskAppetite} onChange={(e) => setThesisConfig({ ...thesisConfig, riskAppetite: e.target.value })}>
                          <option>Conservative</option>
                          <option>Moderate</option>
                          <option>Aggressive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end border-t border-white/10 pt-6">
                    <button className={buttonClass}>Apply thesis configuration</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'inbound' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Inbound Application Portal</h2>
                  <p className="mt-2 text-sm text-slate-400">Submit your company for AI-driven investment committee review. Complete each section to enable comprehensive due diligence.</p>
                </div>

                {/* Company Information Section */}
                <div className={panelClass}>
                  <div className="border-b border-white/10 px-8 py-5">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">1. Company Information</h3>
                  </div>
                  <div className="space-y-6 p-8">
                    <div className="grid gap-6 lg:grid-cols-2">
                      {[
                        { label: 'Company Name', key: 'companyName', type: 'text' },
                        { label: 'Website URL', key: 'website', type: 'text' },
                        { label: 'One-Line Description', key: 'oneLineDescription', type: 'text' },
                        { label: 'Industry / Sector', key: 'sector', type: 'text' },
                        { label: 'Funding Stage', key: 'stage', type: 'select', options: ['Pre-Seed', 'Seed', 'Series A', 'Series B+'] },
                        { label: 'Location', key: 'location', type: 'text' },
                        { label: 'Funding Ask ($)', key: 'fundingAsk', type: 'number' },
                        { label: 'Current Raise ($)', key: 'currentRaise', type: 'number' },
                        { label: 'Company Email', key: 'companyEmail', type: 'email' },
                        { label: 'Team Size', key: 'teamSize', type: 'number' },
                        { label: 'Founded Year', key: 'foundedYear', type: 'number' },
                        { label: 'Current Revenue ($)', key: 'currentRevenue', type: 'number' },
                      ].map((field: any) => (
                        <div key={field.key}>
                          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{field.label}</label>
                          {field.type === 'select' ? (
                            <select value={(inboundForm as any)[field.key]} onChange={(e) => setInboundForm({...inboundForm, [field.key]: e.target.value})} className="w-full rounded-lg border border-white/10 bg-slate-950/80 px-3.5 py-2 text-sm text-white outline-none transition focus:border-blue-400/50">
                              {field.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : (
                            <input type={field.type} value={(inboundForm as any)[field.key]} onChange={(e) => setInboundForm({...inboundForm, [field.key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value})} className="w-full rounded-lg border border-white/10 bg-slate-950/80 px-3.5 py-2 text-sm text-white outline-none transition focus:border-blue-400/50" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Founder Information Section */}
                <div className={panelClass}>
                  <div className="border-b border-white/10 px-8 py-5">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">2. Founder Information</h3>
                  </div>
                  <div className="space-y-4 p-8">
                    {founders.map((founder, idx) => (
                      <div key={founder.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-sm font-semibold text-white">Founder {idx + 1}</span>
                          <button onClick={() => setFounders(founders.filter(f => f.id !== founder.id))} className="text-xs text-slate-400 hover:text-rose-400">Remove</button>
                        </div>
                        <div className="grid gap-4 lg:grid-cols-2">
                          {[
                            { label: 'Name', key: 'name' },
                            { label: 'LinkedIn', key: 'linkedin' },
                            { label: 'GitHub', key: 'github' },
                            { label: 'Twitter/X', key: 'twitter' },
                            { label: 'Personal Website', key: 'website' },
                          ].map((field) => (
                            <input key={field.key} type="text" placeholder={field.label} value={founder[field.key]} onChange={(e) => setFounders(founders.map(f => f.id === founder.id ? {...f, [field.key]: e.target.value} : f))} className="rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-blue-400/50" />
                          ))}
                        </div>
                        <div className="mt-4 flex gap-3 flex-wrap text-[11px]">
                          {[
                            { label: 'Technical Founder', key: 'isTechnical' },
                            { label: 'Previous Startup', key: 'previousStartup' },
                            { label: 'Open Source Contributor', key: 'openSource' },
                            { label: 'Research Publications', key: 'researchPubs' },
                          ].map((field) => (
                            <label key={field.key} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={founder[field.key]} onChange={(e) => setFounders(founders.map(f => f.id === founder.id ? {...f, [field.key]: e.target.checked} : f))} className="h-3.5 w-3.5 rounded border-white/20" />
                              <span className="text-slate-300">{field.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setFounders([...founders, {id: Date.now(), name: '', linkedin: '', github: '', twitter: '', website: '', isTechnical: false, previousStartup: false, openSource: false, researchPubs: false}])} className={secondaryButtonClass}>+ Add founder</button>
                  </div>
                </div>

                {/* Product Assets Section */}
                <div className={panelClass}>
                  <div className="border-b border-white/10 px-8 py-5">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">3. Product Assets</h3>
                  </div>
                  <div className="space-y-4 p-8">
                    {assets.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-blue-400" />
                          <div className="text-sm"><div className="font-medium text-white">{asset.type}</div><div className="text-xs text-slate-500">{asset.uploadedAt}</div></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-emerald-300">✓ Ready</div>
                            <div className="text-[10px] text-slate-500">Indexed</div>
                          </div>
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        </div>
                      </div>
                    ))}
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center text-slate-400 transition hover:border-blue-400/30 hover:bg-blue-500/5">
                      <UploadCloud className="mb-2 h-6 w-6 text-slate-300" />
                      <div className="text-sm font-medium text-slate-200">Upload asset</div>
                      <div className="text-[11px] text-slate-500">PDF, PPTX, Video, etc.</div>
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>

                {/* External Sources Section */}
                <div className={panelClass}>
                  <div className="border-b border-white/10 px-8 py-5">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">4. External Sources (AI-Crawled)</h3>
                  </div>
                  <div className="space-y-4 p-8">
                    <div className="grid gap-4 lg:grid-cols-2">
                      {Object.entries(externalSources).filter(([_, v]) => v).map(([key, value]: any) => (
                        <div key={key} className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2">
                          <Globe className="h-4 w-4 text-violet-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-xs text-slate-500 uppercase">{key}</div>
                            <div className="truncate text-sm text-white">{value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Investment Context Section */}
                <div className={panelClass}>
                  <div className="border-b border-white/10 px-8 py-5">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">5. Investment Context</h3>
                  </div>
                  <div className="space-y-5 p-8">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <input type="text" placeholder="Investment Thesis" value={investmentContext.thesis} onChange={(e) => setInvestmentContext({...investmentContext, thesis: e.target.value})} className="rounded-lg border border-white/10 bg-slate-950/80 px-3.5 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-blue-400/50" />
                      <select value={investmentContext.priority} onChange={(e) => setInvestmentContext({...investmentContext, priority: e.target.value})} className="rounded-lg border border-white/10 bg-slate-950/80 px-3.5 py-2 text-sm text-white outline-none transition focus:border-blue-400/50">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                      <input type="text" placeholder="Partner Responsible" value={investmentContext.partner} onChange={(e) => setInvestmentContext({...investmentContext, partner: e.target.value})} className="rounded-lg border border-white/10 bg-slate-950/80 px-3.5 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-blue-400/50" />
                      <input type="text" placeholder="Fund" value={investmentContext.fund} onChange={(e) => setInvestmentContext({...investmentContext, fund: e.target.value})} className="rounded-lg border border-white/10 bg-slate-950/80 px-3.5 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-blue-400/50" />
                    </div>
                    <textarea rows={3} placeholder="Internal Notes" value={investmentContext.notes} onChange={(e) => setInvestmentContext({...investmentContext, notes: e.target.value})} className="w-full resize-none rounded-lg border border-white/10 bg-slate-950/80 px-3.5 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-blue-400/50" />
                  </div>
                </div>

                {/* AI Enrichment Section */}
                {enrichmentPhase !== 'idle' && (
                  <div className={panelClass}>
                    <div className="border-b border-white/10 px-8 py-5">
                      <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">🤖 AI Enrichment Progress</h3>
                    </div>
                    <div className="space-y-3 p-8">
                      {[
                        { step: 'Reading Website', status: 'complete' },
                        { step: 'Parsing Pitch Deck', status: 'complete' },
                        { step: 'Discovering GitHub', status: enrichmentPhase === 'complete' ? 'complete' : 'running' },
                        { step: 'Finding Founders', status: enrichmentPhase === 'complete' ? 'complete' : 'pending' },
                        { step: 'Checking Research Papers', status: enrichmentPhase === 'complete' ? 'complete' : 'pending' },
                        { step: 'Running Founder Analysis', status: enrichmentPhase === 'complete' ? 'complete' : 'pending' },
                        { step: 'Building Knowledge Graph', status: enrichmentPhase === 'complete' ? 'complete' : 'pending' },
                        { step: 'Launching Investment Committee', status: enrichmentPhase === 'complete' ? 'complete' : 'pending' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          {item.status === 'complete' ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          ) : item.status === 'running' ? (
                            <div className="h-4 w-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-slate-600" />
                          )}
                          <span className={`text-sm ${item.status === 'complete' ? 'text-emerald-300' : item.status === 'running' ? 'text-blue-300 animate-pulse' : 'text-slate-400'}`}>{item.step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  {enrichmentPhase === 'idle' && (
                    <button onClick={handleInboundEnrichment} className={buttonClass} disabled={isRunningDiligence}>
                      {isRunningDiligence ? 'Starting enrichment...' : '🚀 Start AI Enrichment'}
                    </button>
                  )}
                  {enrichmentPhase === 'complete' && (
                    <button onClick={startAnalysis} className={buttonClass}>✓ Submit to Investment Committee</button>
                  )}
                </div>
              </motion.div>
            )}

            {activeView === 'outbound' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Outbound Discovery</h2>
                  <p className="mt-2 text-sm text-slate-400">Find high-potential startups before they formally raise. Proactive investing powered by AI signals.</p>
                </div>

                {outboundStep === 'discover' && (
                  <div className="space-y-6">
                    {/* Discovery Sources Configuration */}
                    <div className={panelClass}>
                      <div className="border-b border-white/10 px-8 py-5">
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">Discovery Sources</h3>
                      </div>
                      <div className="grid gap-3 p-8 lg:grid-cols-3">
                        {Object.entries(outboundSources).map(([key, enabled]: any) => (
                          <label key={key} className="flex items-center gap-3 cursor-pointer rounded-lg border border-white/10 bg-slate-950/50 px-4 py-3 transition hover:bg-slate-950/70">
                            <input type="checkbox" checked={enabled} onChange={(e) => setOutboundSources({...outboundSources, [key]: e.target.checked})} className="h-3.5 w-3.5 rounded border-white/20" />
                            <span className="capitalize text-sm font-medium text-slate-300">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Natural Language Search */}
                    <div className={panelClass}>
                      <div className="border-b border-white/10 px-8 py-5">
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">Natural Language Discovery</h3>
                      </div>
                      <div className="space-y-4 p-8">
                        <textarea rows={2} value={outboundQuery} onChange={(e) => setOutboundQuery(e.target.value)} placeholder="E.g. technical founder building AI infrastructure in Europe with strong GitHub community" className="w-full resize-none rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-blue-400/50" />
                        <div className="flex gap-3">
                          <button onClick={handleOutboundSearch} className={buttonClass}>🔍 Execute Search</button>
                          <button onClick={handleSaveQuery} className={secondaryButtonClass}>💾 Save Query</button>
                        </div>
                      </div>
                    </div>

                    {/* Saved Queries */}
                    {savedQueries.length > 0 && (
                      <div className={panelClass}>
                        <div className="border-b border-white/10 px-8 py-5">
                          <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">Saved Discovery Queries</h3>
                        </div>
                        <div className="grid gap-3 p-8 lg:grid-cols-2">
                          {savedQueries.map((q) => (
                            <button key={q.id} onClick={() => setOutboundQuery(q.query)} className="rounded-lg border border-white/10 bg-slate-950/50 px-4 py-3 text-left transition hover:bg-slate-950/70">
                              <div className="font-medium text-white text-sm">{q.name}</div>
                              <div className="text-xs text-slate-500 line-clamp-1">{q.query}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Advanced Filters */}
                    <div className={panelClass}>
                      <div className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">Advanced Filters</h3>
                        <Sliders className="h-4 w-4 text-slate-400" />
                      </div>
                      <div className="space-y-6 p-8">
                        <div className="grid gap-4 lg:grid-cols-2">
                          <input type="text" placeholder="Sector (e.g. AI Infrastructure)" value={outboundFilters.sector} onChange={(e) => setOutboundFilters({...outboundFilters, sector: e.target.value})} className="rounded-lg border border-white/10 bg-slate-950/80 px-3.5 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-blue-400/50" />
                          <input type="text" placeholder="Country (e.g. Germany)" value={outboundFilters.country} onChange={(e) => setOutboundFilters({...outboundFilters, country: e.target.value})} className="rounded-lg border border-white/10 bg-slate-950/80 px-3.5 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-blue-400/50" />
                        </div>
                        <div className="grid gap-4 lg:grid-cols-3">
                          {[
                            { label: 'GitHub Stars', key: 'githubStars', min: 0, max: 100000 },
                            { label: 'Employees', key: 'employees', min: 0, max: 1000 },
                          ].map((field) => (
                            <div key={field.key}>
                              <label className="mb-2 block text-xs font-semibold text-slate-400">{field.label}</label>
                              <input type="range" min={field.min} max={field.max} value={(outboundFilters as any)[field.key]?.max} onChange={(e) => setOutboundFilters({...outboundFilters, [(field.key as any)]: {...(outboundFilters as any)[field.key], max: Number(e.target.value)}})} className="w-full" />
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {[
                            { label: 'Research Published', key: 'researchPublished' },
                            { label: 'Technical Founder', key: 'technicalFounder' },
                            { label: 'OSS Contributor', key: 'ossContributor' },
                          ].map((field) => (
                            <label key={field.key} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={(outboundFilters as any)[field.key]} onChange={(e) => setOutboundFilters({...outboundFilters, [(field.key as any)]: e.target.checked})} className="h-3.5 w-3.5 rounded border-white/20" />
                              <span className="text-sm text-slate-300">{field.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Discovery Results */}
                    <div className={panelClass}>
                      <div className="border-b border-white/10 px-8 py-5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">High-Potential Candidates</h3>
                          <div className="text-xs text-slate-500">{discoveryResults.length} results</div>
                        </div>
                      </div>
                      <div className="space-y-4 p-8">
                        {discoveryResults.map((result) => (
                          <div key={result.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-6 transition hover:border-blue-400/30 hover:bg-slate-950/70">
                            <div className="mb-4 flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-white">{result.companyName}</h4>
                                <div className="text-sm text-slate-400">Founded by {result.founderName}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`inline-block h-2.5 w-2.5 rounded-full ${result.confidence > 0.8 ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                                <span className="text-xs font-semibold text-slate-300">{(result.confidence * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                            <div className="mb-4 grid gap-3 lg:grid-cols-4">
                              <div className="rounded-lg bg-slate-950/50 px-3 py-2">
                                <div className="text-xs text-slate-500">Founder Score</div>
                                <div className="font-semibold text-white">{result.founderScore}/100</div>
                              </div>
                              <div className="rounded-lg bg-slate-950/50 px-3 py-2">
                                <div className="text-xs text-slate-500">Portfolio Fit</div>
                                <div className="font-semibold text-white">{result.portfolioFit}/100</div>
                              </div>
                              <div className="rounded-lg bg-slate-950/50 px-3 py-2">
                                <div className="text-xs text-slate-500">GitHub Stars</div>
                                <div className="font-semibold text-white">{result.githubStars.toLocaleString()}</div>
                              </div>
                              <div className="rounded-lg bg-slate-950/50 px-3 py-2">
                                <div className="text-xs text-slate-500">Expected Return</div>
                                <div className="font-semibold text-emerald-300">{result.expectedReturn}</div>
                              </div>
                            </div>
                            <div className="mb-4 rounded-lg border border-blue-400/20 bg-blue-500/10 px-3 py-2">
                              <div className="text-xs text-blue-300">Why found: {result.foundReason}</div>
                            </div>
                            <button onClick={() => handleCreateInvestmentCase(result)} className={buttonClass}>Create Investment Case</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {outboundStep === 'evaluate' && selectedCandidate && (
                  <div className={panelClass}>
                    <div className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{selectedCandidate.companyName} - Investment Case</h3>
                      <button onClick={() => setOutboundStep('discover')} className="text-sm text-slate-400 hover:text-white transition">Close</button>
                    </div>
                    <div className="space-y-6 p-8">
                      <div className="grid gap-4 lg:grid-cols-2">
                        {[
                          { label: 'Founder Score', value: selectedCandidate.founderScore },
                          { label: 'Company Score', value: selectedCandidate.companyScore },
                          { label: 'Portfolio Fit', value: selectedCandidate.portfolioFit },
                          { label: 'Market Score', value: selectedCandidate.marketScore },
                          { label: 'Technology Score', value: selectedCandidate.techScore },
                          { label: 'Cold Start Score', value: selectedCandidate.coldStartScore },
                        ].map((metric) => (
                          <div key={metric.label} className="rounded-lg border border-white/10 bg-slate-950/50 p-4">
                            <div className="mb-2 text-xs font-semibold text-slate-500">{metric.label}</div>
                            <div className="text-2xl font-bold text-white">{metric.value}</div>
                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-900">
                              <div className="h-full w-full bg-gradient-to-r from-blue-500 to-violet-500" style={{width: `${metric.value}%`}} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-lg border border-white/10 bg-slate-950/50 p-4">
                        <div className="mb-2 text-sm font-semibold text-white">Investment Thesis</div>
                        <p className="text-sm text-slate-400">{selectedCandidate.foundReason} — Strong alignment with fund strategy. GitHub community validates market demand. Founder background suggests execution capability.</p>
                      </div>
                      <button onClick={() => {setOutboundStep('case'); startAnalysis();}} className={buttonClass}>↪ Launch Full Investment Committee</button>
                    </div>
                  </div>
                )}

                {outboundStep === 'case' && (
                  <div className={panelClass + ' p-12 text-center'}>
                    <motion.div initial={{scale: 0}} animate={{scale: 1}} className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                      <Sparkles className="h-8 w-8 text-emerald-400" />
                    </motion.div>
                    <h3 className="text-2xl font-semibold text-white">Investment Case Generated</h3>
                    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">{selectedCandidate?.companyName} is now in the investment committee pipeline. Full memo and portfolio analysis launching...</p>
                    <div className="mt-6 flex justify-center gap-3">
                      <button onClick={() => setActiveView('memo')} className={buttonClass}>View Investment Memo</button>
                      <button onClick={() => {setOutboundStep('discover'); setSelectedCandidate(null);}} className={secondaryButtonClass}>Back to discovery</button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeView === 'memory' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Persistent founder memory</h2>
                  <p className="mt-1 text-sm text-slate-400">Retain signals from prior interactions so future diligence feels more contextual and less repetitive.</p>
                </div>
                <div className="grid gap-8 xl:grid-cols-3">
                  <div className="space-y-6 xl:col-span-1">
                    <div className={`${panelClass} p-6 text-center`}>
                      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-slate-900 bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-4xl">👩‍💻</div>
                      <h3 className="text-xl font-semibold text-white">Sarah Chen</h3>
                      <p className="mt-1 text-sm text-slate-400">San Francisco, CA</p>
                      <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Founder score</div>
                        <div className="mt-2 text-3xl font-semibold text-emerald-300">92</div>
                      </div>
                    </div>

                    <div className={`${panelClass} p-6`}>
                      {[
                        ['Previous startups', '3'],
                        ['Open source', '★★★★★'],
                        ['Research papers', '12'],
                        ['GitHub commits', '920'],
                        ['Trend', 'Improving'],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between border-b border-white/10 py-3 last:border-none">
                          <span className="text-sm text-slate-400">{label}</span>
                          <span className={`font-semibold ${label === 'Trend' ? 'text-emerald-300' : 'text-white'}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6 xl:col-span-2">
                    <div className={`${panelClass} h-72 p-6`}>
                      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Founder score trend</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={founderTrendData}>
                          <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                          <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)' }} />
                          <Line type="monotone" dataKey="score" stroke="#60A5FA" strokeWidth={3} dot={{ r: 6, fill: '#020617', stroke: '#60A5FA' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className={`${panelClass} p-6`}>
                      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">AI synthesis notes</h3>
                      <p className="text-sm leading-7 text-slate-300">Sarah combines technical depth in distributed systems with a rapidly increasing cadence of product shipping. Her open-source contributions line up closely with the infrastructure bottlenecks her new startup is designed to solve.</p>
                      <div className="mt-5 flex items-center text-sm font-medium text-blue-300">
                        <Brain className="mr-2 h-4 w-4" />
                        Memory retained across 3 applications
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'analysis' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className={`${panelClass} mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-6`}>
                  <div>
                    <div className="mb-2 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">Under analysis</div>
                    <h2 className="text-3xl font-semibold text-white">InfraAI</h2>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-400">
                      <span>AI Infrastructure</span>
                      <span>•</span>
                      <span>Seed Stage</span>
                      <span>•</span>
                      <span>San Francisco</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:text-white"><Globe className="h-4 w-4" /></button>
                    <button className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:text-white"><Database className="h-4 w-4" /></button>
                  </div>
                </div>

                {analysisPhase === 'executing' && (
                  <div className={`${panelClass} mx-auto max-w-2xl p-10`}>
                    <div className="mb-10 text-center text-sm font-semibold uppercase tracking-[0.35em] text-violet-300">Running AI swarm...</div>
                    <div className="space-y-6">
                      {[
                        'Memory layer: retrieving founder history',
                        'AI agents: scraping & ingestion',
                        'Reasoning layer: synthesizing metrics',
                        'Trust engine: verifying claims',
                        'Investment decision engine',
                        'Drafting investment memo',
                      ].map((label, index) => {
                        const step = index + 1;
                        return (
                          <div key={label} className="flex items-center gap-4">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-slate-950 ${pipelineStep > step ? 'bg-emerald-500' : pipelineStep === step ? 'bg-violet-500 animate-pulse' : 'bg-slate-800'}`}>
                              {pipelineStep > step ? <Check className="h-4 w-4 text-white" /> : pipelineStep === step ? <div className="h-2 w-2 rounded-full bg-white" /> : null}
                            </div>
                            <div className={`flex-1 rounded-2xl border px-4 py-3 text-sm ${pipelineStep === step ? 'border-violet-400/30 bg-violet-500/10 text-violet-200' : pipelineStep > step ? 'border-white/10 bg-slate-950/70 text-slate-300' : 'border-transparent bg-transparent text-slate-500'}`}>
                              {label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {analysisPhase === 'complete' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-slate-900/70 to-slate-950/90 p-10 text-center shadow-[0_0_80px_rgba(34,197,94,0.15)]">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">VC investment decision</div>
                      <div className="mt-4 text-6xl font-semibold tracking-tight text-emerald-300">APPROVE</div>
                      <div className="mt-8 grid gap-6 md:grid-cols-4">
                        {[
                          ['Confidence', '93%'],
                          ['Recommended check', '$500k'],
                          ['Expected ownership', '8%'],
                          ['Expected return', '12x'],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</div>
                            <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Multi-axis screening</h3>
                      <div className="grid gap-6 lg:grid-cols-3">
                        {[
                          ['Founder axis', '91', 'Track record verifies successful exit and top 1% compiler routing capabilities.'],
                          ['Market axis', '74', 'TAM is large and the threat from hyperscalers is moderated by independent positioning.'],
                          ['Idea vs. market', '95', 'Core compiler layer retains a strong performance moat with room to expand.'],
                        ].map(([heading, score, copy]) => (
                          <div key={heading} className={`${panelClass} p-6`}>
                            <div className="flex items-center justify-between">
                              <div className="font-semibold text-slate-200">{heading}</div>
                              <div className="text-sm text-emerald-300">↗ improving</div>
                            </div>
                            <div className="mt-4 text-4xl font-semibold text-white">{score}</div>
                            <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`${panelClass} p-8`}>
                      <h3 className="mb-4 border-b border-white/10 pb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">AI reasoning: why approve?</h3>
                      <ul className="space-y-4">
                        {[
                          'Exceptional technical founder with a precise history in distributed systems.',
                          'Open-source traction places them in the top 1% of infrastructure projects this year.',
                          'Market TAM is growing at 38% CAGR with strong enterprise demand.',
                          'A proprietary compiler optimization creates a deep technical moat.',
                        ].map((item) => (
                          <li key={item} className="flex items-start text-sm text-slate-300">
                            <CheckCircle2 className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-white/10 pt-6">
                        <button onClick={() => setActiveView('trust')} className={secondaryButtonClass}>Inspect gaps & GTM risks</button>
                        <button onClick={() => setActiveView('memo')} className="rounded-xl bg-white px-5 py-2.5 font-semibold text-slate-900 transition hover:bg-slate-200">Read full memo</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeView === 'trust' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Trust center</h2>
                  <p className="mt-1 text-sm text-slate-400">Validate evidence, surface contradictions, and calibrate confidence with source-level traceability.</p>
                </div>

                <div className="rounded-[1.5rem] border border-rose-400/20 bg-rose-500/10 p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-rose-400" />
                    <div>
                      <div className="font-semibold text-rose-200">Contradiction flagged by the validator agent</div>
                      <p className="mt-1 text-sm leading-6 text-slate-300">The pitch deck claims $800k ARR, but the validator found state-registry evidence for $400k ARR. Confidence has been recalibrated downward.</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-8 xl:grid-cols-3">
                  <div className={`${panelClass} p-8 text-center`}>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Overall trust</div>
                    <div className="mt-4 text-6xl font-semibold text-white">92<span className="text-3xl text-slate-500">%</span></div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                    </div>
                    <div className="mt-4 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">High confidence</div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:col-span-2">
                    {[
                      ['Evidence found', '147'],
                      ['Sources verified', '12'],
                      ['Contradictions found', '2'],
                      ['Validator state', 'Self-correction active'],
                    ].map(([label, value]) => (
                      <div key={label} className={`${panelClass} flex flex-col justify-between p-6`}>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</div>
                        <div className={`mt-4 text-3xl font-semibold ${label === 'Contradictions found' ? 'text-rose-300' : label === 'Validator state' ? 'text-emerald-300' : 'text-white'}`}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`${panelClass} overflow-hidden`}>
                  <div className="border-b border-white/10 bg-slate-950/70 px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Evidence & source tracing</div>
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-slate-950/50 text-slate-400">
                        <th className="px-4 py-3 font-semibold">Claim</th>
                        <th className="px-4 py-3 font-semibold">Source</th>
                        <th className="px-4 py-3 font-semibold">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {[
                        ['Founder graduated MIT CS', 'LinkedIn API', '97%'],
                        ['Revenue $800k ARR', 'Pitch deck (contradicted by registry)', '40%'],
                        ['GitHub stars: 6,432', 'GitHub API', '100%'],
                      ].map(([claim, source, confidence]) => (
                        <tr key={claim} className="bg-slate-900/40 text-slate-300">
                          <td className="px-4 py-3">{claim}</td>
                          <td className="px-4 py-3">{source}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${confidence === '40%' ? 'bg-rose-500/10 text-rose-300' : 'bg-emerald-500/10 text-emerald-300'}`}>{confidence}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeView === 'memo' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[650px] flex-col gap-8 lg:flex-row">
                <div className="w-full shrink-0 rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 lg:w-56">
                  <div className="mb-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Memo sections</div>
                  <nav className="space-y-3 text-sm">
                    {Object.keys(memoSections).map((section) => (
                      <button
                        key={section}
                        onClick={() => setSelectedMemoSection(section)}
                        className={`w-full text-left rounded-lg px-3 py-2 transition ${selectedMemoSection === section ? 'bg-blue-500/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                      >
                        {section}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className={`${panelClass} flex-1 p-8`}>
                  <h1 className="text-4xl font-semibold text-white">Investment memo: InfraAI</h1>
                  <p className="mt-3 border-b border-white/10 pb-6 text-sm text-slate-400">Generated automatically by VC Brain • {new Date().toLocaleDateString()}</p>
                  <div className="mt-8 space-y-8 text-sm leading-7 text-slate-300">
                    <section>
                      <h2 className="mb-3 text-xl font-semibold text-white">{memoSections[selectedMemoSection as keyof typeof memoSections]?.heading || selectedMemoSection}</h2>
                      <p>{memoSections[selectedMemoSection as keyof typeof memoSections]?.content || 'Content for this section is being loaded.'}</p>
                    </section>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>

        <aside className="flex w-80 shrink-0 flex-col space-y-8 border-l border-white/10 bg-slate-950/40 p-6 backdrop-blur-xl">
          <div>
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Active thesis constraints</div>
            <div className={`${panelSoftClass} space-y-3 p-4 text-[11px]`}>
              <div className="flex items-center justify-between"><span className="text-slate-400">Target stage</span><span className="font-semibold text-white">{thesisConfig.stages.join(', ')}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-400">Check size</span><span className="font-semibold text-emerald-300">${thesisConfig.checkSize}K</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-400">Sectors</span><span className="max-w-[140px] truncate font-semibold text-white">{thesisConfig.sectors.join(', ')}</span></div>
            </div>
          </div>

          <div>
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">System status</div>
            <div className={`${panelSoftClass} space-y-3 p-4 font-mono text-[11px]`}>
              {[
                ['Backend API', backendMetrics ? 'Connected' : 'Checking', 'text-blue-300'],
                ['Memory layer', 'Healthy', 'text-emerald-300'],
                ['Embedding', 'Running', 'text-violet-300'],
                ['Validator', 'Running', 'text-violet-300'],
              ].map(([name, status, color]) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-slate-400">{name}</span>
                  <span className={`font-semibold ${color}`}>{status}</span>
                </div>
              ))}
              <div className="my-2 h-px bg-white/10" />
              <div className="flex items-center justify-between text-slate-300"><span>Latency</span><span>{backendMetrics ? `${backendMetrics.latency_ms} ms` : '—'}</span></div>
              <div className="flex items-center justify-between text-slate-300"><span>Trust score</span><span>{backendMetrics ? `${backendMetrics.trust_score.toFixed(1)}%` : '—'}</span></div>
            </div>
          </div>

          {(activeView === 'analysis' || activeView === 'memo') && (
            <div>
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Portfolio fit radar</div>
              <div className={`${panelSoftClass} h-48 p-3`}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <Radar name="Startup" dataKey="A" stroke="#60A5FA" fill="#60A5FA" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div>
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Live AI activity</div>
            <div className="space-y-3 font-mono text-[10px] text-slate-400">
              {[
                ['09:27', 'Investment memo generated', 'text-violet-300'],
                ['09:26', 'Trust score updated', 'text-slate-300'],
                ['09:25', 'Market search completed', 'text-slate-300'],
                ['09:24', 'Validator flagged ARR mismatch', 'text-rose-300'],
                ['09:22', 'GitHub analyzed', 'text-slate-300'],
                ['09:21', 'Website indexed', 'text-slate-300'],
              ].map(([time, message, color]) => (
                <div key={message} className="flex items-start">
                  <span className="mr-4 w-10 text-slate-500">{time}</span>
                  <span className={color}>{message}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
