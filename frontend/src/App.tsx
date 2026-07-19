import { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle2, AlertTriangle, FileText, Database, 
  Globe, UploadCloud, Home, FolderOpen, 
  Terminal, BarChart2, BookOpen, Layers, Check, Zap, Clock,
  ChevronRight, Search, Bell, Target, Sparkles, Building, Briefcase, TrendingUp,
  Brain, Send, Download, Inbox, Activity, History, ArrowRight, XCircle, Sliders, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  RadialBarChart, RadialBar, LineChart, Line, XAxis, Tooltip
} from 'recharts';

// --- Semantic Colors ---
const colors = {
  green: 'text-[#22C55E]',
  bgGreen: 'bg-[#22C55E]/10',
  red: 'text-[#EF4444]',
  bgRed: 'bg-[#EF4444]/10',
  yellow: 'text-[#F59E0B]',
  bgYellow: 'bg-[#F59E0B]/10',
  purple: 'text-[#A855F7]',
  bgPurple: 'bg-[#A855F7]/10',
  blue: 'text-[#2563EB]',
  bgBlue: 'bg-[#2563EB]/10'
};

// --- Reusable Components ---
function ProgressBar({ value, colorClass }: { value: number, colorClass: string }) {
  return (
    <div className="h-1.5 w-full bg-[#27272A] rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1 }} className={`h-full ${colorClass.replace('text-', 'bg-')}`} />
    </div>
  );
}

function AnimatedCounter({ value, suffix = "" }: { value: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    const totalDuration = 1000;
    let incrementTime = (totalDuration / end);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
         setCount(end);
         clearInterval(timer);
      }
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count}{suffix}</span>;
}

export default function App() {
  const [activeView, setActiveView] = useState<'launchpad' | 'inbound' | 'outbound' | 'memory' | 'analysis' | 'trust' | 'memo' | 'thesis'>('launchpad');
  
  // Thesis Engine Config
  const [thesisConfig, setThesisConfig] = useState({
    sectors: ['AI Infrastructure', 'SaaS'],
    stages: ['Seed'],
    geography: 'US & Europe',
    checkSize: 500, // in $K
    ownership: 10,  // in %
    riskAppetite: 'Moderate'
  });

  // Outbound Funnel State
  const [outboundStep, setOutboundStep] = useState<'identify' | 'activate' | 'converge'>('identify');
  const [selectedOutboundFounder, setSelectedOutboundFounder] = useState<any>(null);
  const [customOutreachMail, setCustomOutreachMail] = useState<string>('');

  // Semantic Query Search
  const [semanticQuery, setSemanticQuery] = useState('technical founder, Berlin, AI infra, enterprise traction');
  const [semanticResults, setSemanticResults] = useState<any[]>([]);

  // Analysis State
  const [analysisPhase, setAnalysisPhase] = useState<'idle' | 'executing' | 'complete'>('idle');
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  
  const radarData = [
    { subject: 'Market', A: 74, fullMark: 100 },
    { subject: 'Team', A: 98, fullMark: 100 },
    { subject: 'Traction', A: 85, fullMark: 100 },
    { subject: 'Technology', A: 95, fullMark: 100 },
    { subject: 'Execution', A: 91, fullMark: 100 },
  ];

  const radialData = [{ name: 'Confidence', uv: 93, fill: '#22C55E' }];
  
  const founderTrendData = [
    { name: '2021', score: 65 }, { name: '2022', score: 72 }, { name: '2023', score: 85 }, { name: '2024', score: 92 }
  ];

  const startAnalysis = () => {
    setActiveView('analysis');
    setAnalysisPhase('executing');
    setPipelineStep(0);
    
    const steps = [
      { step: 1, delay: 1000 }, // Memory Layer
      { step: 2, delay: 2500 }, // AI Agents
      { step: 3, delay: 4000 }, // Reasoning Layer
      { step: 4, delay: 5500 }, // Trust Engine
      { step: 5, delay: 7000 }, // Investment Decision
      { step: 6, delay: 8500 }, // Investment Memo
    ];

    steps.forEach(({ step, delay }) => {
      setTimeout(() => setPipelineStep(step), delay);
    });

    setTimeout(() => {
      setAnalysisPhase('complete');
    }, 9000);
  };

  const handleSemanticSearch = () => {
    // Simulate Semantic Retrieval matching active Thesis
    setSemanticResults([
      { name: 'Sarah Chen', role: 'CTO, compiler architect', score: 92, alignment: '98% Match to active Thesis (AI Infra, US, Seed)' },
      { name: 'Lukas Mueller', role: 'Distributed Systems Dev', score: 87, alignment: '91% Match to active Thesis (AI Infra, Europe, Seed)' }
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
    <div className="min-h-screen bg-[#09090B] text-white font-sans flex flex-col overflow-hidden selection:bg-[#2563EB]/30">
      
      {/* TOP NAVIGATION */}
      <header className="h-14 border-b border-[#27272A] bg-[#09090B] flex items-center justify-between px-6 shrink-0 z-30">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-white font-semibold cursor-pointer" onClick={() => setActiveView('launchpad')}>
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-[#2563EB] to-[#A855F7] flex items-center justify-center">
               <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span>VC Brain</span>
          </div>
          <div className="h-4 w-px bg-[#27272A] mx-2"></div>
          <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">powered by MASCHMEYER GROUP</span>
        </div>

        <div className="flex-1 max-w-xl px-8">
           <div className="relative group">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Global Search..." 
                className="w-full bg-[#111111] border border-[#27272A] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] rounded-md py-1.5 pl-9 pr-12 text-sm text-zinc-200 outline-none transition-all"
              />
           </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs font-medium bg-[#111111] border border-[#27272A] px-3 py-1.5 rounded-md">
             <div className={`w-2 h-2 rounded-full bg-[#22C55E] animate-pulse`}></div>
             <span className="text-zinc-300">System Healthy</span>
          </div>
          <button className="w-8 h-8 rounded bg-gradient-to-tr from-[#2563EB] to-[#A855F7] flex items-center justify-center font-bold text-sm shadow-inner text-white">
             A
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-64 border-r border-[#27272A] bg-[#09090B] flex flex-col py-6 shrink-0 relative z-10 overflow-y-auto custom-scrollbar">
           <nav className="space-y-1 px-3">
             <button onClick={() => setActiveView('launchpad')} className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors font-medium ${activeView === 'launchpad' ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'text-zinc-400 hover:text-white hover:bg-[#111111]'}`}>
                <Home className="w-4 h-4 mr-3"/> 🏠 Dashboard
             </button>
             <button onClick={() => setActiveView('thesis')} className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors font-medium ${activeView === 'thesis' ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'text-zinc-400 hover:text-white hover:bg-[#111111]'}`}>
                <Sliders className="w-4 h-4 mr-3"/> ⚙ Thesis Engine
             </button>
             <button onClick={() => setActiveView('inbound')} className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors font-medium ${activeView === 'inbound' ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'text-zinc-400 hover:text-white hover:bg-[#111111]'}`}>
                <Inbox className="w-4 h-4 mr-3"/> 📥 Inbound Applications
             </button>
             <button onClick={() => { setActiveView('outbound'); setOutboundStep('identify'); }} className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors font-medium ${activeView === 'outbound' ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'text-zinc-400 hover:text-white hover:bg-[#111111]'}`}>
                <Globe className="w-4 h-4 mr-3"/> 🌍 Outbound Discovery
             </button>
             <button onClick={() => setActiveView('memory')} className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors font-medium ${activeView === 'memory' ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'text-zinc-400 hover:text-white hover:bg-[#111111]'}`}>
                <Brain className="w-4 h-4 mr-3"/> 🧠 Founder Memory
             </button>
             <button onClick={() => setActiveView('analysis')} className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors font-medium ${activeView === 'analysis' ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'text-zinc-400 hover:text-white hover:bg-[#111111]'}`}>
                <Zap className="w-4 h-4 mr-3"/> ⚡ AI Analysis
             </button>
             <button onClick={() => setActiveView('trust')} className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors font-medium ${activeView === 'trust' ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'text-zinc-400 hover:text-white hover:bg-[#111111]'}`}>
                <Shield className="w-4 h-4 mr-3"/> 📊 Trust Center
             </button>
             <button onClick={() => setActiveView('memo')} className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors font-medium ${activeView === 'memo' ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'text-zinc-400 hover:text-white hover:bg-[#111111]'}`}>
                <FileText className="w-4 h-4 mr-3"/> 📝 Investment Memo
             </button>
           </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col bg-[#09090B] relative overflow-y-auto custom-scrollbar border-r border-[#27272A]">
         <div className="p-10 w-full max-w-6xl mx-auto pb-32">
            
            {/* VIEW: LAUNCHPAD */}
            {activeView === 'launchpad' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 max-w-4xl mx-auto mt-10">
                  <div className="text-center space-y-4">
                     <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2">VC Brain</h1>
                     <p className="text-xl text-[#2563EB] font-medium tracking-wide">Deploying $100K Checks in 24 Hours</p>
                  </div>
                  
                  <div className="h-px w-full bg-[#27272A]"></div>

                  <div className="grid grid-cols-2 gap-6">
                     <button onClick={() => setActiveView('inbound')} className="bg-[#111111] border border-[#27272A] hover:border-[#2563EB] p-8 rounded-xl flex flex-col items-center justify-center group transition-all">
                        <div className="w-16 h-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                           <Sparkles className="w-8 h-8 text-[#2563EB]" />
                        </div>
                        <span className="text-xl font-bold text-white mb-2">Start New Analysis</span>
                        <span className="text-sm text-zinc-500 text-center">Ingest a new startup via inbound application or outbound discovery.</span>
                     </button>
                     <button onClick={() => setActiveView('analysis')} className="bg-[#111111] border border-[#27272A] hover:border-zinc-500 p-8 rounded-xl flex flex-col items-center justify-center group transition-all">
                        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                           <History className="w-8 h-8 text-zinc-400" />
                        </div>
                        <span className="text-xl font-bold text-white mb-2">Continue Previous</span>
                        <span className="text-sm text-zinc-500 text-center">Resume analysis on InfraAI, VisionStack, or NovaML.</span>
                     </button>
                  </div>

                  <div className="h-px w-full bg-[#27272A]"></div>

                  <div>
                     <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Recent Startup Evaluations</h3>
                     <div className="space-y-3">
                        {['InfraAI', 'VisionStack', 'NovaML'].map(s => (
                           <div key={s} className="bg-[#111111] border border-[#27272A] p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-zinc-900 transition-colors">
                              <span className="font-semibold text-white">{s}</span>
                              <div className="flex items-center space-x-4">
                                 <span className="text-xs font-mono text-zinc-500">2 hours ago</span>
                                 <span className="bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-bold px-2 py-1 rounded">APPROVE</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </motion.div>
            )}

            {/* VIEW: THESIS ENGINE CONFIG */}
            {activeView === 'thesis' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div>
                     <h2 className="text-2xl font-bold text-white mb-2">Thesis Engine Configuration</h2>
                     <p className="text-zinc-500 text-sm">Define sectors, check limits, and criteria filters to customize VC Brain recommendations.</p>
                  </div>

                  <div className="bg-[#111111] border border-[#27272A] rounded-xl p-8 space-y-6">
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-6">
                           <div>
                              <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Sectors Filter</label>
                              <div className="flex gap-2">
                                 {['AI Infrastructure', 'Cybersecurity', 'SaaS', 'Web3'].map(sec => {
                                    const isSelected = thesisConfig.sectors.includes(sec);
                                    return (
                                       <button 
                                         key={sec} 
                                         onClick={() => {
                                            const updated = isSelected ? thesisConfig.sectors.filter(s => s !== sec) : [...thesisConfig.sectors, sec];
                                            setThesisConfig({...thesisConfig, sectors: updated});
                                         }}
                                         className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${isSelected ? 'bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]' : 'border-[#27272A] text-zinc-400 hover:text-white'}`}
                                       >
                                          {sec}
                                       </button>
                                    );
                                 })}
                              </div>
                           </div>

                           <div>
                              <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Stage</label>
                              <div className="flex gap-2">
                                 {['Pre-Seed', 'Seed', 'Series A'].map(stg => {
                                    const isSelected = thesisConfig.stages.includes(stg);
                                    return (
                                       <button 
                                         key={stg} 
                                         onClick={() => {
                                            const updated = isSelected ? thesisConfig.stages.filter(s => s !== stg) : [...thesisConfig.stages, stg];
                                            setThesisConfig({...thesisConfig, stages: updated});
                                         }}
                                         className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${isSelected ? 'bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]' : 'border-[#27272A] text-zinc-400 hover:text-white'}`}
                                       >
                                          {stg}
                                       </button>
                                    );
                                 })}
                              </div>
                           </div>

                           <div>
                              <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Target Geography</label>
                              <input type="text" className="w-full bg-[#09090B] border border-[#27272A] rounded-md px-4 py-2.5 text-sm text-white outline-none focus:border-[#2563EB]" value={thesisConfig.geography} onChange={e => setThesisConfig({...thesisConfig, geography: e.target.value})} />
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div>
                              <div className="flex justify-between text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                                 <span>Target Check Size</span>
                                 <span className="text-white font-mono">${thesisConfig.checkSize}K</span>
                              </div>
                              <input type="range" min="100" max="2000" step="50" value={thesisConfig.checkSize} onChange={e => setThesisConfig({...thesisConfig, checkSize: Number(e.target.value)})} className="w-full h-1 bg-[#27272A] rounded-lg appearance-none cursor-pointer accent-[#2563EB]" />
                           </div>

                           <div>
                              <div className="flex justify-between text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                                 <span>Target Ownership Target</span>
                                 <span className="text-white font-mono">{thesisConfig.ownership}%</span>
                              </div>
                              <input type="range" min="5" max="25" step="1" value={thesisConfig.ownership} onChange={e => setThesisConfig({...thesisConfig, ownership: Number(e.target.value)})} className="w-full h-1 bg-[#27272A] rounded-lg appearance-none cursor-pointer accent-[#2563EB]" />
                           </div>

                           <div>
                              <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Risk Appetite</label>
                              <select className="w-full bg-[#09090B] border border-[#27272A] rounded-md px-4 py-2.5 text-sm text-white outline-none focus:border-[#2563EB]" value={thesisConfig.riskAppetite} onChange={e => setThesisConfig({...thesisConfig, riskAppetite: e.target.value})}>
                                 <option>Conservative</option>
                                 <option>Moderate</option>
                                 <option>Aggressive</option>
                              </select>
                           </div>
                        </div>
                     </div>
                     <div className="pt-6 border-t border-[#27272A] flex justify-end">
                        <button className="bg-[#2563EB] text-white px-6 py-2.5 rounded-md font-bold hover:bg-blue-700 transition-colors flex items-center">
                           <Check className="w-4 h-4 mr-2"/> Apply Thesis Configuration
                        </button>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* VIEW: INBOUND */}
            {activeView === 'inbound' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div>
                     <h2 className="text-2xl font-bold text-white mb-2">Inbound Application</h2>
                     <p className="text-zinc-500 text-sm">Upload decks or ingest applications directly into the screening pipeline.</p>
                  </div>

                  <div className="bg-[#111111] border border-[#27272A] rounded-xl p-8 space-y-6">
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Company Name</label>
                           <input type="text" className="w-full bg-[#09090B] border border-[#27272A] rounded-md px-4 py-2.5 text-sm text-white outline-none" defaultValue="InfraAI" />
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Website URL</label>
                           <input type="text" className="w-full bg-[#09090B] border border-[#27272A] rounded-md px-4 py-2.5 text-sm text-white outline-none" defaultValue="infra.ai" />
                        </div>
                     </div>
                     <div className="border-2 border-dashed border-[#27272A] rounded-xl p-12 flex flex-col items-center justify-center text-zinc-500 hover:border-[#2563EB] hover:bg-[#2563EB]/5 cursor-pointer transition-colors">
                        <UploadCloud className="w-8 h-8 mb-4 text-zinc-400" />
                        <span className="text-lg font-medium text-zinc-300 mb-1">Upload Pitch Deck</span>
                        <span className="text-sm">PDF, PPTX</span>
                     </div>
                     <div className="flex justify-end">
                        <button onClick={startAnalysis} className="bg-[#2563EB] text-white px-8 py-3 rounded-md font-bold hover:bg-blue-700 transition-colors flex items-center">
                           <Sparkles className="w-4 h-4 mr-2"/> Send to AI Pipeline
                        </button>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* VIEW: OUTBOUND */}
            {activeView === 'outbound' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div>
                     <h2 className="text-2xl font-bold text-white mb-2">Outbound Sourcing Discovery</h2>
                     <p className="text-zinc-500 text-sm">Scan signals and activate outreach funnels before they formally fundraise.</p>
                  </div>

                  {outboundStep === 'identify' && (
                     <div className="space-y-8">
                        {/* Feed Sources */}
                        <div className="grid grid-cols-4 gap-4">
                           {['GitHub Trending', 'arXiv Papers', 'Product Hunt', 'Accelerator cohorts'].map(source => (
                              <div key={source} className="bg-[#111111] border border-[#27272A] p-4 rounded-lg flex items-center justify-between">
                                 <span className="text-sm font-medium text-zinc-300">{source}</span>
                                 <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></div>
                              </div>
                           ))}
                        </div>

                        {/* Semantic / Multi-Attribute Reasoning Search box */}
                        <div className="bg-[#111111] border border-[#27272A] rounded-xl p-6 space-y-4">
                           <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Multi-Attribute Natural Language Query</h3>
                           <div className="flex space-x-3">
                              <input 
                                type="text" 
                                value={semanticQuery}
                                onChange={e => setSemanticQuery(e.target.value)}
                                className="flex-1 bg-[#09090B] border border-[#27272A] rounded-md px-4 py-2.5 text-sm text-white outline-none focus:border-[#2563EB]"
                                placeholder="Search e.g. technical founder, Berlin, AI infra..."
                              />
                              <button onClick={handleSemanticSearch} className="bg-[#2563EB] hover:bg-blue-700 px-6 rounded-md font-bold transition-colors">Execute Query</button>
                           </div>
                           
                           {/* Semantic query results */}
                           {semanticResults.length > 0 && (
                              <div className="pt-4 space-y-3">
                                 {semanticResults.map(r => (
                                    <div key={r.name} className="p-4 rounded-lg bg-[#09090B] border border-[#27272A] flex justify-between items-center">
                                       <div>
                                          <h4 className="text-sm font-bold text-white">{r.name}</h4>
                                          <p className="text-xs text-zinc-500">{r.role} • {r.alignment}</p>
                                       </div>
                                       <span className="text-xs font-mono text-[#22C55E] font-bold">Score: {r.score}</span>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>

                        {/* Discovered List */}
                        <div className="space-y-4">
                           <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Identified Candidates</h3>
                           {[
                              { name: 'Sarah Chen', source: 'GitHub Commit (12k Stars)', location: 'San Francisco, CA', score: 92 },
                              { name: 'Lukas Mueller', source: 'arXiv Paper (Compiler routing)', location: 'Berlin, Germany', score: 87 }
                           ].map(founder => (
                              <div key={founder.name} className="bg-[#111111] border border-[#27272A] p-6 rounded-xl flex items-center justify-between">
                                 <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-xl">👩‍💻</div>
                                    <div>
                                       <h4 className="text-white font-bold text-lg">{founder.name}</h4>
                                       <p className="text-zinc-500 text-sm">{founder.source} • {founder.location}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center space-x-4">
                                    <span className="text-xs font-mono text-zinc-400 font-bold bg-zinc-800 px-3 py-1.5 rounded-full">Founder Score: {founder.score}</span>
                                    <button onClick={() => handleOutboundIdentify(founder)} className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-md font-bold transition-all">
                                       Activate Outreach
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {outboundStep === 'activate' && selectedOutboundFounder && (
                     <div className="bg-[#111111] border border-[#27272A] rounded-xl p-8 space-y-6">
                        <div className="flex justify-between items-center border-b border-[#27272A] pb-4">
                           <h3 className="text-lg font-bold text-white">Draft Automated Outreach</h3>
                           <button onClick={() => setOutboundStep('identify')} className="text-zinc-500 hover:text-white">Cancel</button>
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between text-sm text-zinc-400">
                              <span>Recipient: {selectedOutboundFounder.name}</span>
                              <span>Target Score: {selectedOutboundFounder.score}</span>
                           </div>
                           <textarea 
                             rows={8}
                             value={customOutreachMail}
                             onChange={e => setCustomOutreachMail(e.target.value)}
                             className="w-full bg-[#09090B] border border-[#27272A] rounded-md px-4 py-3 text-sm text-white focus:border-[#2563EB] outline-none font-sans resize-none"
                           />
                        </div>
                        <div className="flex justify-end">
                           <button onClick={handleOutboundActivate} className="bg-[#2563EB] text-white px-6 py-2.5 rounded-md font-bold hover:bg-blue-700 transition-colors flex items-center">
                              <Send className="w-4 h-4 mr-2"/> Send and Converge Funnel
                           </button>
                        </div>
                     </div>
                  )}

                  {outboundStep === 'converge' && selectedOutboundFounder && (
                     <div className="bg-[#111111] border border-[#27272A] rounded-xl p-12 text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 mx-auto flex items-center justify-center">
                           <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
                        </div>
                        <div>
                           <h3 className="text-2xl font-bold text-white mb-2">Outreach Activated</h3>
                           <p className="text-zinc-500 text-sm max-w-md mx-auto">{selectedOutboundFounder.name}'s profile has been successfully converged into the screening pipeline.</p>
                        </div>
                        <div className="flex justify-center space-x-4">
                           <button onClick={startAnalysis} className="bg-[#2563EB] hover:bg-blue-700 text-white px-6 py-2.5 rounded-md font-bold transition-all">Start screening run</button>
                           <button onClick={() => setOutboundStep('identify')} className="border border-[#27272A] hover:bg-[#111111] text-zinc-300 px-6 py-2.5 rounded-md font-bold transition-all">Back to Outbound</button>
                        </div>
                     </div>
                  )}
               </motion.div>
            )}

            {/* VIEW: FOUNDER MEMORY */}
            {activeView === 'memory' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Persistent Founder Memory</h2>
                  <div className="grid grid-cols-3 gap-8">
                     <div className="col-span-1 space-y-6">
                        <div className="bg-[#111111] border border-[#27272A] p-6 rounded-xl text-center relative overflow-hidden">
                           <div className="w-24 h-24 rounded-full bg-zinc-800 mx-auto mb-4 border-4 border-[#09090B] shadow-xl flex items-center justify-center text-4xl">👩‍💻</div>
                           <h3 className="text-xl font-bold text-white">Sarah Chen</h3>
                           <p className="text-zinc-400 text-sm mb-6">San Francisco, CA</p>
                           
                           <div className="bg-[#09090B] rounded-lg p-4 border border-[#27272A] flex justify-between items-center">
                              <span className="text-sm font-bold text-zinc-500 uppercase">Founder Score</span>
                              <span className="text-3xl font-bold text-[#22C55E]">92</span>
                           </div>
                        </div>

                        <div className="bg-[#111111] border border-[#27272A] p-6 rounded-xl space-y-4">
                           <div className="flex justify-between items-center"><span className="text-zinc-400 text-sm">Previous Startups</span><span className="text-white font-mono font-bold">3</span></div>
                           <div className="flex justify-between items-center"><span className="text-zinc-400 text-sm">Open Source</span><span className="text-[#F59E0B] font-mono font-bold">★★★★★</span></div>
                           <div className="flex justify-between items-center"><span className="text-zinc-400 text-sm">Research Papers</span><span className="text-white font-mono font-bold">12</span></div>
                           <div className="flex justify-between items-center"><span className="text-zinc-400 text-sm">GitHub Commits</span><span className="text-white font-mono font-bold">920</span></div>
                           <div className="flex justify-between items-center"><span className="text-zinc-400 text-sm">Trend</span><span className="text-[#22C55E] font-bold flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> Improving</span></div>
                        </div>
                     </div>
                     <div className="col-span-2 space-y-6">
                        <div className="bg-[#111111] border border-[#27272A] p-6 rounded-xl h-64">
                           <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Founder Score Trend</h3>
                           <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={founderTrendData}>
                                 <XAxis dataKey="name" stroke="#52525B" fontSize={12} />
                                 <Tooltip contentStyle={{ backgroundColor: '#111111', border: '1px solid #27272A' }} />
                                 <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={3} dot={{ r: 6, fill: '#09090B', stroke: '#2563EB' }} />
                              </LineChart>
                           </ResponsiveContainer>
                        </div>
                        <div className="bg-[#111111] border border-[#27272A] p-6 rounded-xl">
                           <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">AI Synthesis Notes</h3>
                           <p className="text-zinc-300 text-sm leading-relaxed mb-4">Sarah exhibits a rare combination of extreme technical depth in distributed systems and an accelerating cadence in product shipping. Her open-source contributions over the last 36 months map precisely to the infrastructure bottlenecks her new startup aims to solve.</p>
                           <div className="flex items-center text-[#2563EB] text-xs font-bold uppercase"><Brain className="w-4 h-4 mr-2"/> Memory Retained Across 3 Applications</div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* VIEW: AI ANALYSIS (Visual Pipeline & Huge Decision) */}
            {activeView === 'analysis' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  
                  {/* Startup Header Row */}
                  <div className="flex justify-between items-center border-b border-[#27272A] pb-6 mb-10">
                     <div>
                        <h2 className="text-3xl font-bold text-white mb-2 flex items-center">InfraAI <span className="ml-4 text-xs font-bold bg-[#111111] text-zinc-400 border border-[#27272A] px-2 py-1 rounded uppercase tracking-widest">Under Analysis</span></h2>
                        <div className="flex space-x-4 text-sm text-zinc-400">
                           <span>AI Infrastructure</span>
                           <span>•</span>
                           <span>Seed Stage</span>
                           <span>•</span>
                           <span>San Francisco</span>
                        </div>
                     </div>
                     <div className="flex space-x-3">
                        <button className="p-2 bg-[#111111] border border-[#27272A] rounded hover:text-white transition-colors"><Globe className="w-4 h-4"/></button>
                        <button className="p-2 bg-[#111111] border border-[#27272A] rounded hover:text-white transition-colors"><Database className="w-4 h-4"/></button>
                     </div>
                  </div>

                  {/* Executing Visual Pipeline */}
                  {analysisPhase === 'executing' && (
                     <div className="max-w-2xl mx-auto py-10">
                        <h3 className="text-center text-[#A855F7] font-bold uppercase tracking-widest mb-10 animate-pulse">Running AI Swarm...</h3>
                        
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#27272A] before:via-[#A855F7] before:to-transparent">
                           {[
                              { step: 1, label: 'Memory Layer: Retrieving Founder History' },
                              { step: 2, label: 'AI Agents: Scraping & Ingestion' },
                              { step: 3, label: 'Reasoning Layer: Synthesizing Metrics' },
                              { step: 4, label: 'Trust Engine: Verifying Claims' },
                              { step: 5, label: 'Investment Decision Engine' },
                              { step: 6, label: 'Drafting Investment Memo' }
                           ].map(item => (
                              <div key={item.step} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                 <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#09090B] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl z-10 transition-colors duration-500
                                    ${pipelineStep > item.step ? 'bg-[#22C55E]' : pipelineStep === item.step ? 'bg-[#A855F7] animate-pulse' : 'bg-[#27272A]'}`}>
                                    {pipelineStep > item.step ? <Check className="w-4 h-4 text-white"/> : pipelineStep === item.step ? <div className="w-2 h-2 rounded-full bg-white"></div> : null}
                                 </div>
                                 <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border transition-colors duration-500
                                    ${pipelineStep > item.step ? 'bg-[#111111] border-[#27272A]' : pipelineStep === item.step ? 'bg-[#A855F7]/10 border-[#A855F7]/50' : 'bg-transparent border-transparent opacity-50'}`}>
                                    <span className={`font-bold text-sm ${pipelineStep === item.step ? 'text-[#A855F7]' : 'text-zinc-300'}`}>{item.label}</span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Complete Phase: Massive Decision & Multi-Axis & Why */}
                  {analysisPhase === 'complete' && (
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                        
                        {/* Massive Decision Hero */}
                        <div className="border border-[#22C55E]/30 bg-[#22C55E]/5 p-12 rounded-2xl relative overflow-hidden text-center shadow-[0_0_50px_rgba(34,197,94,0.1)]">
                           <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">VC Investment Decision</h2>
                           <div className="flex items-center justify-center text-7xl font-black text-[#22C55E] tracking-tighter mb-10">
                              🟢 APPROVE
                           </div>
                           
                           <div className="grid grid-cols-4 gap-8 divide-x divide-[#22C55E]/20">
                              <div>
                                 <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Confidence</p>
                                 <p className="text-3xl font-bold text-white">93%</p>
                              </div>
                              <div>
                                 <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Recommended Check</p>
                                 <p className="text-3xl font-bold text-white">$500,000</p>
                              </div>
                              <div>
                                 <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Expected Ownership</p>
                                 <p className="text-3xl font-bold text-white">8%</p>
                              </div>
                              <div>
                                 <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Expected Return</p>
                                 <p className="text-3xl font-bold text-white">12x</p>
                              </div>
                           </div>
                        </div>

                        {/* Multi-Axis Screening Cards (Independent Axes as per the brief) */}
                        <div className="space-y-4">
                           <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Multi-Axis Screening</h3>
                           <div className="grid grid-cols-3 gap-6">
                              <div className="bg-[#111111] border border-[#27272A] p-6 rounded-xl space-y-4">
                                 <div className="flex justify-between items-center">
                                    <span className="font-bold text-zinc-200">Founder Axis</span>
                                    <span className="text-xs text-[#22C55E] font-bold">↗ Improving</span>
                                 </div>
                                 <div className="text-3xl font-bold text-white">91</div>
                                 <p className="text-xs text-zinc-500">Track record verifies successful exit and top 1% compiler routing capabilities.</p>
                              </div>
                              <div className="bg-[#111111] border border-[#27272A] p-6 rounded-xl space-y-4">
                                 <div className="flex justify-between items-center">
                                    <span className="font-bold text-zinc-200">Market Axis</span>
                                    <span className="text-xs text-[#22C55E] font-bold flex items-center">🟢 Bullish</span>
                                 </div>
                                 <div className="text-3xl font-bold text-white">74</div>
                                 <p className="text-xs text-zinc-500">TAM sizing is high; threat from hyperscalers moderated by independent compiler positioning.</p>
                              </div>
                              <div className="bg-[#111111] border border-[#27272A] p-6 rounded-xl space-y-4">
                                 <div className="flex justify-between items-center">
                                    <span className="font-bold text-zinc-200">Idea vs. Market</span>
                                    <span className="text-xs text-[#F59E0B] font-bold">➡️ Stable</span>
                                 </div>
                                 <div className="text-3xl font-bold text-white">95</div>
                                 <p className="text-xs text-zinc-500">Core compiler layer retains high performance margin; team is strong enough to pivot to DB layer.</p>
                              </div>
                           </div>
                        </div>

                        {/* "Why" Reasoning Panel */}
                        <div className="bg-[#111111] border border-[#27272A] p-8 rounded-xl">
                           <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest border-b border-[#27272A] pb-4 mb-6">AI Reasoning: Why Approve?</h3>
                           <ul className="space-y-4">
                              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-[#22C55E] shrink-0"/> <span className="text-zinc-300 text-sm">Exceptional technical founder with a perfectly matched history in distributed systems.</span></li>
                              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-[#22C55E] shrink-0"/> <span className="text-zinc-300 text-sm">Open-source traction puts them in the top 1% of infrastructure projects this year.</span></li>
                              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-[#22C55E] shrink-0"/> <span className="text-zinc-300 text-sm">Market TAM is growing at 38% CAGR with extreme enterprise demand.</span></li>
                              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-[#22C55E] shrink-0"/> <span className="text-zinc-300 text-sm">Proprietary compiler optimization provides a deep technical moat.</span></li>
                           </ul>
                           <div className="mt-8 pt-6 border-t border-[#27272A] flex justify-end space-x-4">
                              <button onClick={() => setActiveView('trust')} className="border border-[#27272A] hover:bg-[#111111] text-zinc-300 px-6 py-2.5 rounded-md font-bold transition-all">Inspect Gaps & GTM Risks</button>
                              <button onClick={() => setActiveView('memo')} className="bg-white text-black px-6 py-2.5 rounded-md font-bold hover:bg-zinc-200 transition-colors">Read Full Memo</button>
                           </div>
                        </div>

                     </motion.div>
                  )}

               </motion.div>
            )}

            {/* VIEW: TRUST CENTER */}
            {activeView === 'trust' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                  <div className="flex justify-between items-end mb-8 border-b border-[#27272A] pb-6">
                     <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Trust Center</h2>
                        <p className="text-zinc-400">Verifiable evidence, source tracing, and contradiction validation.</p>
                     </div>
                  </div>

                  {/* Validator Warning / Contradiction Alert Box */}
                  <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 p-6 rounded-xl flex items-start space-x-4">
                     <AlertTriangle className="w-6 h-6 text-[#EF4444] shrink-0 mt-0.5" />
                     <div>
                        <h4 className="text-[#EF4444] font-bold text-base mb-1">Contradiction Flagged by Validator Agent</h4>
                        <p className="text-zinc-300 text-sm leading-relaxed">
                           The pitch deck claims <span className="text-white font-bold">$800k ARR</span>, but the Validator Agent found a matching state registry report verifying active telemetry of <span className="text-[#EF4444] font-bold">$400k ARR</span>. 
                           Confidence score has been calibrated downward.
                        </p>
                     </div>
                  </div>

                  {/* Trust Hero Block */}
                  <div className="grid grid-cols-3 gap-8">
                     <div className="col-span-1 bg-[#111111] border border-[#27272A] p-8 rounded-xl flex flex-col items-center justify-center text-center">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Overall Trust</h3>
                        <div className="text-7xl font-black text-white mb-6">92<span className="text-3xl text-zinc-500">%</span></div>
                        <div className="w-full bg-[#27272A] h-2 rounded-full overflow-hidden">
                           <div className="bg-[#2563EB] h-full w-[92%]"></div>
                        </div>
                        <span className="mt-4 text-xs font-bold text-[#22C55E] bg-[#22C55E]/10 px-3 py-1 rounded-full">High Confidence</span>
                     </div>
                     
                     <div className="col-span-2 grid grid-cols-2 gap-6">
                        <div className="bg-[#111111] border border-[#27272A] p-6 rounded-xl flex flex-col justify-between">
                           <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Evidence Found</span>
                           <span className="text-5xl font-bold text-white">147</span>
                        </div>
                        <div className="bg-[#111111] border border-[#27272A] p-6 rounded-xl flex flex-col justify-between">
                           <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Sources Verified</span>
                           <span className="text-5xl font-bold text-white">12</span>
                        </div>
                        <div className="bg-[#111111] border border-[#27272A] p-6 rounded-xl flex flex-col justify-between">
                           <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Contradictions Found</span>
                           <span className="text-5xl font-bold text-[#EF4444]">2</span>
                        </div>
                        <div className="bg-[#111111] border border-[#27272A] p-6 rounded-xl flex flex-col justify-between">
                           <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Validator State</span>
                           <span className="text-xl font-bold text-[#22C55E] flex items-center"><CheckCircle2 className="w-5 h-5 mr-2"/> Self-Correction Active</span>
                        </div>
                     </div>
                  </div>

                  {/* Evidence Panel */}
                  <div>
                     <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Evidence & Source Tracing</h3>
                     <div className="bg-[#111111] border border-[#27272A] rounded-xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                           <thead className="bg-[#09090B] border-b border-[#27272A]">
                              <tr>
                                 <th className="p-4 text-zinc-500 font-bold uppercase">Claim</th>
                                 <th className="p-4 text-zinc-500 font-bold uppercase">Source</th>
                                 <th className="p-4 text-zinc-500 font-bold uppercase">Confidence</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-[#27272A]">
                              <tr className="hover:bg-zinc-900 transition-colors">
                                 <td className="p-4 text-zinc-200 font-medium">Founder graduated MIT CS</td>
                                 <td className="p-4 text-zinc-400">LinkedIn API</td>
                                 <td className="p-4"><span className="text-[#22C55E] font-bold bg-[#22C55E]/10 px-2 py-1 rounded">97%</span></td>
                              </tr>
                              <tr className="hover:bg-zinc-900 transition-colors">
                                 <td className="p-4 text-zinc-200 font-medium">Revenue $800k ARR</td>
                                 <td className="p-4 text-[#EF4444] font-medium">Pitch Deck (Contradicted by registry)</td>
                                 <td className="p-4"><span className="text-[#EF4444] font-bold bg-[#EF4444]/10 px-2 py-1 rounded">40%</span></td>
                              </tr>
                              <tr className="hover:bg-zinc-900 transition-colors">
                                 <td className="p-4 text-zinc-200 font-medium">GitHub Stars: 6,432</td>
                                 <td className="p-4 text-zinc-400">GitHub API</td>
                                 <td className="p-4"><span className="text-[#22C55E] font-bold bg-[#22C55E]/10 px-2 py-1 rounded">100%</span></td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* VIEW: INVESTMENT MEMO (Notion Style) */}
            {activeView === 'memo' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full min-h-[600px]">
                  
                  {/* Left Nav (Sticky) */}
                  <div className="w-48 shrink-0 pr-8 border-r border-[#27272A]">
                     <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Memo Sections</h3>
                     <nav className="space-y-3 text-sm font-medium">
                        <div className="text-white cursor-pointer hover:text-white transition-colors border-l-2 border-[#2563EB] -ml-[2px] pl-3">Company snapshot</div>
                        <div className="text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors border-l-2 border-transparent -ml-[2px] pl-3">Investment hypotheses</div>
                        <div className="text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors border-l-2 border-transparent -ml-[2px] pl-3">SWOT</div>
                        <div className="text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors border-l-2 border-transparent -ml-[2px] pl-3">Team & history</div>
                        <div className="text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors border-l-2 border-transparent -ml-[2px] pl-3">Problem & product</div>
                        <div className="text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors border-l-2 border-transparent -ml-[2px] pl-3">Technology & defensibility</div>
                        <div className="text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors border-l-2 border-transparent -ml-[2px] pl-3">Market sizing</div>
                        <div className="text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors border-l-2 border-transparent -ml-[2px] pl-3">Competition</div>
                        <div className="text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors border-l-2 border-transparent -ml-[2px] pl-3">Traction & KPIs</div>
                        <div className="text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors border-l-2 border-transparent -ml-[2px] pl-3">Financials & round structure</div>
                        <div className="text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors border-l-2 border-transparent -ml-[2px] pl-3">Cap table</div>
                        <div className="text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors border-l-2 border-transparent -ml-[2px] pl-3">Due diligence log</div>
                        <div className="text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors border-l-2 border-transparent -ml-[2px] pl-3 border-t border-[#27272A] pt-3">Exit perspective</div>
                     </nav>
                  </div>

                  {/* Memo Content */}
                  <div className="flex-1 pl-10 max-w-3xl">
                     <div className="space-y-6">
                        <h1 className="text-4xl font-extrabold text-white">Investment Memo: InfraAI</h1>
                        <p className="text-zinc-500 flex items-center space-x-4 text-sm font-mono pb-8 border-b border-[#27272A]">
                           <span>Generated automatically by VC Brain</span>
                           <span>•</span>
                           <span>{new Date().toLocaleDateString()}</span>
                        </p>
                     </div>

                     <div className="mt-10 space-y-12 text-[15px] leading-relaxed text-zinc-300">
                        <section>
                           <h2 className="text-xl font-bold text-white mb-4">Company snapshot</h2>
                           <p>InfraAI is developing compiler-level optimization routing layers to eliminate LLM latency bottlenecks. Targeting a $12B addressable market, the technology resolves systemic context scalability limits.</p>
                        </section>

                        <section>
                           <h2 className="text-xl font-bold text-white mb-4">Investment hypotheses</h2>
                           <p>We are investing based on Founder track record (exited distributed systems designer), top 1% open-source traction, and a deep architectural moat verified via compiler pipeline benchmarks.</p>
                        </section>

                        <section>
                           <h2 className="text-xl font-bold text-white mb-4">SWOT</h2>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <h4 className="text-sm font-bold text-[#22C55E] mb-2">Strengths</h4>
                                 <p className="text-xs text-zinc-400">Extreme compiler architecture talent; high GitHub contribution growth.</p>
                              </div>
                              <div>
                                 <h4 className="text-sm font-bold text-[#EF4444] mb-2">Threats</h4>
                                 <p className="text-xs text-zinc-400">Hyperscalers building inline compiler optimizations natively.</p>
                              </div>
                           </div>
                        </section>

                        <section>
                           <h2 className="text-xl font-bold text-white mb-4">Cap table</h2>
                           <p className="text-sm italic text-zinc-500">Cap table: not disclosed at Seed stage.</p>
                        </section>
                     </div>
                  </div>

               </motion.div>
            )}

         </div>
        </main>

        {/* RIGHT SIDEBAR (Persistent Info Panel) */}
        <aside className="w-80 bg-[#09090B] border-l border-[#27272A] flex flex-col p-6 overflow-y-auto shrink-0 z-10 custom-scrollbar space-y-10">
           
           {/* Active Thesis Config Summary */}
           <div>
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Active Thesis Constraints</h4>
              <div className="bg-[#111111] border border-[#27272A] rounded-lg p-4 text-[11px] space-y-3">
                 <div className="flex justify-between"><span className="text-zinc-500">Target Stage</span><span className="text-white font-bold">{thesisConfig.stages.join(', ')}</span></div>
                 <div className="flex justify-between"><span className="text-zinc-500">Check Size</span><span className="text-[#22C55E] font-bold">${thesisConfig.checkSize}K</span></div>
                 <div className="flex justify-between"><span className="text-zinc-500">Sectors</span><span className="text-white truncate max-w-[120px]">{thesisConfig.sectors.join(', ')}</span></div>
              </div>
           </div>

           {/* SYSTEM STATUS */}
           <div>
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">System Status</h4>
              <div className="bg-[#111111] border border-[#27272A] rounded-lg p-4 font-mono text-[11px] space-y-3">
                 <div className="flex justify-between items-center"><span className="text-zinc-500">GPT-4o</span><span className="text-[#2563EB] font-bold flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mr-2"></div>Running</span></div>
                 <div className="flex justify-between items-center"><span className="text-zinc-500">Memory Layer</span><span className="text-[#22C55E] font-bold flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mr-2"></div>Healthy</span></div>
                 <div className="flex justify-between items-center"><span className="text-zinc-500">Embedding</span><span className="text-[#A855F7] font-bold flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] mr-2 animate-pulse"></div>Running</span></div>
                 <div className="flex justify-between items-center"><span className="text-zinc-500">Validator</span><span className="text-[#A855F7] font-bold flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] mr-2 animate-pulse"></div>Running</span></div>
                 <div className="h-px w-full bg-[#27272A] my-2"></div>
                 <div className="flex justify-between text-zinc-300"><span>Latency</span><span>182 ms</span></div>
                 <div className="flex justify-between text-zinc-300"><span>Tokens</span><span>12,482</span></div>
              </div>
           </div>

           {/* RADAR CHART (Only show in Analysis/Memo) */}
           {(activeView === 'analysis' || activeView === 'memo') && (
              <div>
                 <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Portfolio Fit Radar</h4>
                 <div className="h-48 w-full bg-[#111111] rounded-lg border border-[#27272A]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
                        <PolarGrid stroke="#27272A" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#A1A1AA', fontSize: 10 }} />
                        <Radar name="Startup" dataKey="A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           )}

           {/* AI ACTIVITY LOG */}
           <div>
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Live AI Activity</h4>
              <div className="space-y-3 font-mono text-[10px]">
                 <div className="flex items-start"><span className="text-zinc-600 mr-4 w-10">09:27</span><span className="text-[#A855F7]">Investment memo generated</span></div>
                 <div className="flex items-start"><span className="text-zinc-600 mr-4 w-10">09:26</span><span className="text-zinc-300">Trust score updated</span></div>
                 <div className="flex items-start"><span className="text-zinc-600 mr-4 w-10">09:25</span><span className="text-zinc-300">Market search completed</span></div>
                 <div className="flex items-start"><span className="text-zinc-600 mr-4 w-10">09:24</span><span className="text-[#EF4444] font-bold">Validator flagged ARR mismatch</span></div>
                 <div className="flex items-start"><span className="text-zinc-600 mr-4 w-10">09:22</span><span className="text-zinc-300">GitHub analyzed</span></div>
                 <div className="flex items-start"><span className="text-zinc-600 mr-4 w-10">09:21</span><span className="text-zinc-300">Website indexed</span></div>
              </div>
           </div>

        </aside>

      </div>
    </div>
  );
}
