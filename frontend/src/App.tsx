import { useState } from 'react';
import { Shield, TrendingUp, Search, Play, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [query, setQuery] = useState('');
  const [isDiligenceActive, setIsDiligenceActive] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeNodes, setActiveNodes] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploading(true);
    setUploadStatus("Uploading to VC Brain...");
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.status === 'success') {
        setUploadStatus(`Success: ${data.filename} vectorized into FAISS.`);
      } else {
        setUploadStatus("Failed to process document.");
      }
    } catch (err) {
      setUploadStatus("Network error during upload.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(null), 5000);
    }
  };

  const startDiligence = async () => {
    setIsDiligenceActive(true);
    setResult(null);
    setActiveNodes([]);
    
    // Connect to Live Telemetry SSE stream
    const eventSource = new EventSource('http://127.0.0.1:8000/api/v1/diligence/stream?opportunity_id=founder_99');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.node === 'END') {
        eventSource.close();
      } else {
        setActiveNodes(prev => [...prev, data.node]);
      }
    };
    eventSource.onerror = () => eventSource.close();

    try {
      // Await Final Payload
      const response = await fetch('http://127.0.0.1:8000/api/v1/diligence/run?opportunity_id=founder_99', {
        method: 'POST'
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("API execution failed", error);
    } finally {
      setIsDiligenceActive(false);
      eventSource.close();
    }
  };

  const [overrideText, setOverrideText] = useState("");
  const [overrideStatus, setOverrideStatus] = useState<string|null>(null);

  const handleOverride = async () => {
    if (!overrideText) return;
    try {
      setOverrideStatus("Appending to memory...");
      const response = await fetch('http://127.0.0.1:8000/api/v1/diligence/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunity_id: "founder_99", rationale: overrideText })
      });
      if (response.ok) {
        setOverrideStatus("Override permanently saved to FAISS Memory.");
        setOverrideText("");
      } else {
        setOverrideStatus("Failed to save override.");
      }
    } catch (e) {
      setOverrideStatus("Network error.");
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] text-slate-200 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        {/* Header */}
        <header className="mb-12 border-b border-slate-800/50 pb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">VC Brain <span className="text-slate-500 font-normal">v4.0</span></h1>
            </div>
            <p className="text-slate-400">Autonomous Investment Committee & Diligence Engine</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-400">Maschmeyer OS v4.0</span>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700" />
          </div>
        </header>

        {/* Data Ingestion Zone */}
        <div className="mb-12">
           <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-400 mb-4">Data Room Ingestion</h2>
           <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-[#0c0c0f] ${isUploading ? 'border-indigo-500/50' : 'border-slate-800 hover:border-slate-600 hover:bg-[#121217]'} transition-all`}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                 {isUploading ? (
                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500 mb-2"></div>
                 ) : (
                   <svg className="w-8 h-8 mb-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                 )}
                 <p className="text-sm text-slate-400 font-semibold">{uploadStatus || "Click to upload Pitch Deck or PDF"}</p>
              </div>
              <input type="file" className="hidden" accept=".pdf,.txt,.md" onChange={handleFileUpload} disabled={isUploading} />
           </label>
        </div>

        <main className="space-y-8">
          <div className="relative group flex items-center space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                className="w-full bg-[#121217] border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-xl"
                placeholder="Search natural language: 'Technical founders in AI infra with zero prior funding'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setQuery("Evaluate InfraAI (founder_99) for our Seed fund")}
              className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl border border-slate-700 transition-colors shadow-lg"
            >
              Load Demo
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-lg font-medium text-slate-300 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-indigo-400" />
                Sourcing Pipeline
              </h2>
              
              <div className="bg-[#121217] border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all cursor-pointer relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50 group-hover:bg-indigo-400 transition-colors" />
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">InfraAI</h3>
                    <p className="text-sm text-slate-500 mt-1">Founder: hack_god_99 • Sector: AI Infrastructure</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-green-500/20">
                      Cold-Start Discovery
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button 
                    onClick={startDiligence}
                    disabled={isDiligenceActive}
                    className="flex items-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isDiligenceActive ? 'Executing Swarm...' : 'Run Diligence'}
                  </button>
                </div>
              </div>

              {/* Memo Display */}
              {result && result.memo && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#121217] border border-slate-800 rounded-xl p-6 mt-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center text-indigo-400">
                    <FileText className="w-5 h-5 mr-2" />
                    Investment Memo
                  </h2>
                  <div className="space-y-4">
                     <div className="bg-[#0a0a0c] p-4 rounded-md border border-slate-800">
                       <h3 className="text-sm text-slate-400 font-semibold mb-1">Executive Summary</h3>
                       <p className="text-slate-200 text-sm">{result.memo.executive_summary?.summary}</p>
                     </div>
                     <div className="bg-[#0a0a0c] p-4 rounded-md border border-slate-800">
                       <h3 className="text-sm text-slate-400 font-semibold mb-1">Recommendation</h3>
                       <p className="text-slate-200 font-bold text-indigo-400">{result.memo.recommendation}</p>
                     </div>
                  </div>
                </motion.div>
              )}

              {/* Committee Dashboard */}
              {result && result.votes && result.votes.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="bg-[#0c0c0f] border border-slate-800 rounded-xl p-6 relative overflow-hidden mt-8 shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
                  <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-400 mb-6 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                    Investment Committee Consensus
                  </h2>
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                  >
                    {result.votes.map((v: any, idx: number) => (
                      <motion.div 
                        key={idx} 
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        className="bg-[#121217] p-5 rounded-lg border border-slate-800 flex flex-col justify-between hover:border-indigo-500/30 transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.1)] group relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-800 group-hover:bg-indigo-500/50 transition-colors"></div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-indigo-300 font-semibold text-sm uppercase tracking-wider">{v.agent_id.replace('_', ' ')}</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${v.vote === 'APPROVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : v.vote === 'REJECT' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                            {v.vote}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm mb-4 leading-relaxed">{v.rationale}</p>
                        <div className="flex justify-between items-center text-xs font-mono text-slate-500 pt-3 border-t border-slate-800/50">
                          <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-1.5"></span>Conf: {(v.confidence * 100).toFixed(0)}%</span>
                          <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-1.5"></span>{v.claims ? v.claims.length : 0} Claims</span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}

            </div>

            <div className="space-y-8">
              
              {/* Trust Dashboard & Explainability */}
              <div className="bg-[#0c0c0f] border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
                <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-400 mb-4">Trust Breakdown</h2>
                {isDiligenceActive ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {activeNodes.map((node, i) => (
                        <span key={i} className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-md border border-indigo-500/30 animate-pulse">
                          {node}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-2">Live Agent Observability</p>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-[#121217] p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-sm">Calibrated Trust Score</span>
                      <span className="text-xl font-bold text-green-400">{(result.trust_score * 100).toFixed(1)}%</span>
                    </div>
                    
                    {/* Trust Breakdown Math */}
                    {result.trust_breakdown && (
                      <div className="bg-[#121217] p-4 rounded-lg border border-slate-800 text-sm space-y-2">
                        <div className="flex justify-between"><span className="text-slate-400">Evidence Weight</span><span className="text-green-400">+{result.trust_breakdown.evidence}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Committee Agreement</span><span className="text-green-400">+{result.trust_breakdown.agreement}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Validation Coverage</span><span className="text-green-400">+{result.trust_breakdown.validation}%</span></div>
                        <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-slate-400">Contradiction Penalties</span><span className="text-red-400">{result.trust_breakdown.penalties}%</span></div>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Execution Graph</h3>
                      <div className="flex flex-col space-y-2 text-xs text-slate-400 font-mono">
                        <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center mr-2">1</span> <span className="text-indigo-400">Vector Ingestion</span></div>
                        <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center mr-2">2</span> <span className="text-indigo-400">Parallel Swarm Diligence</span></div>
                        <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center mr-2">3</span> <span className="text-indigo-400">Consensus Engine</span></div>
                        <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center mr-2">4</span> <span className="text-amber-400">Validator & Contradiction Mapping</span></div>
                        <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center mr-2">5</span> <span className="text-green-400">Investment Memo Generation</span></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-600 text-center py-8 text-sm">Awaiting execution...</div>
                )}
              </div>

              {/* Validation Results */}
              <div className="bg-[#0c0c0f] border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
                <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-400 mb-4">Validator Shield</h2>
                {isDiligenceActive ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-pulse flex space-x-2">
                      <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                      <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                      <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-green-400 bg-green-500/10 p-2 rounded border border-green-500/20">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Validation Score: {(result.metrics.validation_score * 100).toFixed(0)}%
                    </div>
                    <div className="flex items-center text-amber-400 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Hallucination Rate: {(result.metrics.hallucination_rate * 100).toFixed(0)}%
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-600 text-center py-8 text-sm">Awaiting execution...</div>
                )}
              </div>
              
            </div>
            {/* Human Override Loop */}
            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#121217] border border-red-900/50 rounded-xl p-6 relative overflow-hidden mt-8 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
                <h2 className="text-sm font-semibold tracking-wide uppercase text-red-400 mb-2">Human Committee Override</h2>
                <p className="text-xs text-slate-400 mb-4">Reject the AI's consensus and inject new criteria directly into the Vector Database memory.</p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={overrideText}
                    onChange={(e) => setOverrideText(e.target.value)}
                    placeholder="e.g. 'Approve this deal. The founder has unlisted proprietary tech.'"
                    className="flex-1 bg-[#0a0a0c] border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500/50"
                  />
                  <button 
                    onClick={handleOverride}
                    className="px-4 py-2 bg-red-900/50 hover:bg-red-800/80 text-red-200 text-sm font-semibold rounded-lg border border-red-700/50 transition-colors"
                  >
                    Force Memory Update
                  </button>
                </div>
                {overrideStatus && <p className="text-xs text-red-400 mt-2">{overrideStatus}</p>}
              </motion.div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
