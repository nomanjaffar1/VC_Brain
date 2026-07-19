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

  const [outboundStep, setOutboundStep] = useState<'identify' | 'activate' | 'converge'>('identify');
  const [selectedOutboundFounder, setSelectedOutboundFounder] = useState<any>(null);
  const [customOutreachMail, setCustomOutreachMail] = useState<string>('');
  const [semanticQuery, setSemanticQuery] = useState('technical founder, Berlin, AI infra, enterprise traction');
  const [semanticResults, setSemanticResults] = useState<any[]>([]);
  const [analysisPhase, setAnalysisPhase] = useState<'idle' | 'executing' | 'complete'>('idle');
  const [pipelineStep, setPipelineStep] = useState<number>(0);

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

  const startAnalysis = () => {
    setActiveView('analysis');
    setAnalysisPhase('executing');
    setPipelineStep(0);
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

  const handleOutboundIdentify = (founder: any) => {
    setSelectedOutboundFounder(founder);
    setCustomOutreachMail(`Hi ${founder.name},\n\nI was reviewing your contributions to compiler optimizations on GitHub and wanted to reach out. At Acme Fund, we're deploying $100K checks into exceptional builders within 24 hours. Let's get you set up on the VC Brain workspace.\n\nBest,\nAcme Team`);
    setOutboundStep('activate');
  };

  const handleOutboundActivate = () => {
    setOutboundStep('converge');
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
                  if (key === 'outbound') setOutboundStep('identify');
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
                      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">VC Brain, reimagined for high-signal investing.</h1>
                      <p className="mt-4 text-lg text-slate-300">Screen founders faster, synthesize signals across memory, trust, and market intelligence, and publish polished investment memos in minutes.</p>
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
                    <div className="text-xl font-semibold text-white">Start a new analysis</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">Ingest a new startup through inbound applications or outbound sourcing and launch the full AI pipeline.</p>
                  </button>
                  <button onClick={() => setActiveView('analysis')} className={`${panelClass} group flex flex-col items-start p-8 text-left transition hover:-translate-y-1`}>
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-300">
                      <History className="h-7 w-7" />
                    </div>
                    <div className="text-xl font-semibold text-white">Resume the previous run</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">Pick up from InfraAI, VisionStack, or NovaML and continue where the workflow left off.</p>
                  </button>
                </div>

                <div className={`${panelClass} p-6`}>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Recent evaluations</div>
                      <div className="text-lg font-semibold text-white">Latest startup reviews</div>
                    </div>
                    <button className="text-sm font-medium text-blue-300">View all</button>
                  </div>
                  <div className="space-y-3">
                    {['InfraAI', 'VisionStack', 'NovaML'].map((item, index) => (
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
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Inbound application</h2>
                  <p className="mt-1 text-sm text-slate-400">Queue a new company into the screening pipeline with structured inputs and attached documents.</p>
                </div>

                <div className={`${panelClass} p-8`}>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Company name</label>
                      <input type="text" className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-400/50" defaultValue="InfraAI" />
                    </div>
                    <div>
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Website URL</label>
                      <input type="text" className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-400/50" defaultValue="infra.ai" />
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-12 text-center text-slate-400 transition hover:border-blue-400/30 hover:bg-blue-500/5">
                    <UploadCloud className="mb-4 h-8 w-8 text-slate-300" />
                    <div className="text-lg font-semibold text-slate-200">Upload pitch deck</div>
                    <div className="mt-1 text-sm">PDF, PPTX, or link-based source</div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button onClick={startAnalysis} className={buttonClass}>Send to AI pipeline</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'outbound' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Outbound sourcing discovery</h2>
                  <p className="mt-1 text-sm text-slate-400">Build a high-signal funnel from public signals before founders formally raise capital.</p>
                </div>

                {outboundStep === 'identify' && (
                  <div className="space-y-8">
                    <div className="grid gap-4 md:grid-cols-4">
                      {['GitHub Trending', 'arXiv Papers', 'Product Hunt', 'Accelerator cohorts'].map((source) => (
                        <div key={source} className={`${panelSoftClass} flex items-center justify-between p-4`}>
                          <span className="text-sm font-medium text-slate-300">{source}</span>
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                      ))}
                    </div>

                    <div className={`${panelClass} p-6`}>
                      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Multi-attribute natural language query</h3>
                      <div className="flex flex-col gap-3 md:flex-row">
                        <input
                          type="text"
                          value={semanticQuery}
                          onChange={(e) => setSemanticQuery(e.target.value)}
                          className="flex-1 rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-400/50"
                          placeholder="Search e.g. technical founder, Berlin, AI infra..."
                        />
                        <button onClick={handleSemanticSearch} className={buttonClass}>Execute query</button>
                      </div>

                      {semanticResults.length > 0 && (
                        <div className="mt-5 space-y-3">
                          {semanticResults.map((r) => (
                            <div key={r.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
                              <div>
                                <div className="font-semibold text-white">{r.name}</div>
                                <div className="text-sm text-slate-400">{r.role} • {r.alignment}</div>
                              </div>
                              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">Score {r.score}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Identified candidates</h3>
                      {[
                        { name: 'Sarah Chen', source: 'GitHub Commit (12k Stars)', location: 'San Francisco, CA', score: 92 },
                        { name: 'Lukas Mueller', source: 'arXiv Paper (Compiler routing)', location: 'Berlin, Germany', score: 87 },
                      ].map((founder) => (
                        <div key={founder.name} className={`${panelClass} flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center`}>
                          <div className="flex items-center space-x-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-2xl">👩‍💻</div>
                            <div>
                              <div className="font-semibold text-white">{founder.name}</div>
                              <div className="text-sm text-slate-400">{founder.source} • {founder.location}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">Founder score {founder.score}</span>
                            <button onClick={() => handleOutboundIdentify(founder)} className={buttonClass}>Activate outreach</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {outboundStep === 'activate' && selectedOutboundFounder && (
                  <div className={`${panelClass} p-8`}>
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <h3 className="text-lg font-semibold text-white">Draft automated outreach</h3>
                      <button onClick={() => setOutboundStep('identify')} className="text-sm text-slate-400 transition hover:text-white">Cancel</button>
                    </div>
                    <div className="mt-5 space-y-4">
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Recipient: {selectedOutboundFounder.name}</span>
                        <span>Target score: {selectedOutboundFounder.score}</span>
                      </div>
                      <textarea rows={8} value={customOutreachMail} onChange={(e) => setCustomOutreachMail(e.target.value)} className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/50" />
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button onClick={handleOutboundActivate} className={buttonClass}>Send and converge funnel</button>
                    </div>
                  </div>
                )}

                {outboundStep === 'converge' && selectedOutboundFounder && (
                  <div className={`${panelClass} p-12 text-center`}>
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">Outreach activated</h3>
                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">{selectedOutboundFounder.name}'s profile is now queued in the screening pipeline and ready for deeper review.</p>
                    <div className="mt-6 flex justify-center gap-3">
                      <button onClick={startAnalysis} className={buttonClass}>Start screening run</button>
                      <button onClick={() => setOutboundStep('identify')} className={secondaryButtonClass}>Back to outbound</button>
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
                    {['Company snapshot', 'Investment hypotheses', 'SWOT', 'Team & history', 'Problem & product', 'Technology & defensibility', 'Market sizing', 'Competition', 'Traction & KPIs', 'Financials & round structure', 'Cap table', 'Due diligence log'].map((section, index) => (
                      <div key={section} className={`cursor-pointer rounded-lg px-3 py-2 transition ${index === 0 ? 'bg-blue-500/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>{section}</div>
                    ))}
                  </nav>
                </div>

                <div className={`${panelClass} flex-1 p-8`}>
                  <h1 className="text-4xl font-semibold text-white">Investment memo: InfraAI</h1>
                  <p className="mt-3 border-b border-white/10 pb-6 text-sm text-slate-400">Generated automatically by VC Brain • {new Date().toLocaleDateString()}</p>
                  <div className="mt-8 space-y-8 text-sm leading-7 text-slate-300">
                    <section>
                      <h2 className="mb-3 text-xl font-semibold text-white">Company snapshot</h2>
                      <p>InfraAI is developing compiler-level optimization routing layers to eliminate LLM latency bottlenecks. Targeting a $12B addressable market, the technology resolves systemic context scalability limits.</p>
                    </section>
                    <section>
                      <h2 className="mb-3 text-xl font-semibold text-white">Investment hypotheses</h2>
                      <p>We are investing based on founder track record, top 1% open-source traction, and a deep architectural moat verified through compiler pipeline benchmarks.</p>
                    </section>
                    <section>
                      <h2 className="mb-3 text-xl font-semibold text-white">SWOT</h2>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                          <div className="mb-2 font-semibold text-emerald-300">Strengths</div>
                          <p>Extreme compiler architecture talent and strong GitHub contribution growth.</p>
                        </div>
                        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4">
                          <div className="mb-2 font-semibold text-rose-300">Threats</div>
                          <p>Hyperscalers are increasingly building inline compiler optimizations natively.</p>
                        </div>
                      </div>
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
                ['GPT-4o', 'Running', 'text-blue-300'],
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
              <div className="flex items-center justify-between text-slate-300"><span>Latency</span><span>182 ms</span></div>
              <div className="flex items-center justify-between text-slate-300"><span>Tokens</span><span>12,482</span></div>
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
