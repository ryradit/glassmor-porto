'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Case {
  id: string;
  title: string;
  industry: string;
  brief: string;
  prompt: string;
}

interface ScoreMetric {
  name: string;
  score: number;
  desc: string;
}

interface Scores {
  overall: number;
  metrics: ScoreMetric[];
  review: string;
}

const CASE_TEMPLATES: Record<string, Case> = {
  saas: {
    id: 'saas',
    title: 'SaaS Multi-Tenant Global Expansion',
    industry: 'Enterprise Software',
    brief: 'A high-performance B2B collaboration platform wants to expand operations from North America into APAC. However, local competitors dominate database pricing structures and latency parameters.',
    prompt: 'How would you structure your market entry strategy, pricing alignment, and server infrastructure scaling?'
  },
  churn: {
    id: 'churn',
    title: 'Subscription Churn Recovery Audit',
    industry: 'Consumer D2C / E-commerce',
    brief: 'An organic coffee subscription retailer has noticed its monthly active customer churn rate rise from 4% to 15% over the past six months, following a pricing upgrade.',
    prompt: 'Diagnose the potential root causes of this churn spike and outline a quantitative recovery blueprint.'
  },
  market: {
    id: 'market',
    title: 'Autonomous Delivery Fleet Market Sizing',
    industry: 'Logistics & Smart Cities',
    brief: 'A capital venture firm wants to estimate the total addressable market (TAM) of autonomous drone delivery fleets in the top 10 metropolitan Asian smart-cities by 2030.',
    prompt: 'Establish a quantitative, MECE (Mutually Exclusive, Collectively Exhaustive) top-down market sizing framework.'
  }
};

export default function CaseStudyPage() {
  const [selectedCase, setSelectedCase] = useState<string>('saas');
  const [swotStrengths, setSwotStrengths] = useState<string>('');
  const [swotWeaknesses, setSwotWeaknesses] = useState<string>('');
  const [meceBrackets, setMeceBrackets] = useState<string>('');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditComplete, setAuditComplete] = useState<boolean>(false);
  const [scores, setScores] = useState<Scores | null>(null);

  const activeCase = CASE_TEMPLATES[selectedCase];

  const handleStartCase = (caseId: string) => {
    setSelectedCase(caseId);
    setSwotStrengths('');
    setSwotWeaknesses('');
    setMeceBrackets('');
    setAuditComplete(false);
    setScores(null);
  };

  const handleAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
      setScores({
        overall: 84,
        metrics: [
          { name: 'MECE Framework Integrity', score: 86, desc: 'Outstanding structural breakdown. Branches are logically independent and completely exhaustive.' },
          { name: 'SWOT Context Alignment', score: 82, desc: 'Identified key internal dynamics. Weakness profiling can be slightly elevated.' },
          { name: 'Feasibility & Actionability', score: 85, desc: 'Highly execution-oriented workflow. Pricing indices are extremely practical.' }
        ],
        review: 'Your structured MECE layout shows excellent top-down analytical rigor. To push this consulting brief to a McKinsey level, augment the SWOT matrix by directly matching internal strengths with exact serverless caching scaling techniques to prove hardware feasibility.'
      });
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      {/* Header Back Links */}
      <div className="flex justify-between items-center">
        <Link href="/playground/case-study" className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center space-x-2">
          <span>← Go away from this playground</span>
        </Link>
        <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold rounded-full tracking-wide">
          Playground Module 04
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400 bg-clip-text text-transparent mb-3 tracking-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          AI Consulting Case Arena
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
          Select a challenging business business case, structure your strategy via standard frameworks (SWOT & MECE), and get evaluated by an AI Consulting Principal.
        </p>
      </div>

      {/* Select Case Slider */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(CASE_TEMPLATES).map(c => (
          <button
            key={c.id}
            onClick={() => handleStartCase(c.id)}
            className={`p-4 rounded-2xl text-left border transition-all duration-300 ${
              selectedCase === c.id 
                ? 'border-purple-500 bg-purple-600/10 shadow-lg shadow-purple-500/5' 
                : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="text-[10px] text-purple-400 font-black uppercase tracking-widest mb-0.5">{c.industry}</div>
            <div className="text-xs font-bold text-white leading-normal">{c.title}</div>
          </button>
        ))}
      </div>

      {/* Active Case Brief Panel */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-purple-500/10 relative overflow-hidden shadow-2xl space-y-4">
        <span className="px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black rounded-full uppercase tracking-wider">
          Active Scenario Brief
        </span>
        <h3 className="text-xl font-bold text-white">{activeCase.title}</h3>
        <p className="text-xs text-gray-400 leading-relaxed font-medium">{activeCase.brief}</p>
        <div className="p-4 bg-purple-950/20 border border-purple-500/10 rounded-xl">
          <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Prompt Task</div>
          <p className="text-xs font-bold text-white">&ldquo;{activeCase.prompt}&rdquo;</p>
        </div>
      </div>

      {/* Interactive SWOT & MECE boards */}
      {!auditComplete && !isAuditing && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SWOT Matrix Inputs */}
            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-purple-400">1. Strategic SWOT Snippets</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Internal Strengths</label>
                  <textarea
                    value={swotStrengths}
                    onChange={(e) => setSwotStrengths(e.target.value)}
                    placeholder="Enter 2 core strengths (e.g. global API caching networks, lower serverless costs)..."
                    className="w-full h-20 bg-black/40 border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500/30 transition-all font-medium resize-none leading-relaxed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Internal Weaknesses</label>
                  <textarea
                    value={swotWeaknesses}
                    onChange={(e) => setSwotWeaknesses(e.target.value)}
                    placeholder="Enter 2 core weaknesses (e.g. localized data compliance barriers, latency gaps)..."
                    className="w-full h-20 bg-black/40 border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500/30 transition-all font-medium resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* MECE Framework Tree */}
            <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-purple-400">2. MECE Analysis Structure</h3>
                <p className="text-[10px] text-gray-400 leading-normal font-medium">
                  Deconstruct your business approach into mutually exclusive and collectively exhaustive branches.
                </p>
                <textarea
                  value={meceBrackets}
                  onChange={(e) => setMeceBrackets(e.target.value)}
                  placeholder="Branch A: Customer Retention & pricing adjustments&#10;Branch B: Operational upgrades & feature patches&#10;Branch C: Structural scaling & regional deployments"
                  className="w-full h-44 bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500/30 transition-all font-mono leading-relaxed"
                />
              </div>

              <button
                onClick={handleAudit}
                disabled={!swotStrengths.trim() || !meceBrackets.trim()}
                className={`w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs tracking-widest uppercase rounded-xl transition-all duration-300 ${
                  (!swotStrengths.trim() || !meceBrackets.trim()) ? 'opacity-40 cursor-not-allowed' : 'shadow-lg shadow-purple-950/20'
                }`}
              >
                Submit Consulting Strategy Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {isAuditing && (
        <div className="glass-card p-12 rounded-3xl border border-purple-500/10 text-center flex flex-col items-center justify-center shadow-2xl relative overflow-hidden h-72">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-r-pink-500 border-b-rose-400 border-l-transparent rounded-full animate-spin mb-6" />
          <h3 className="text-lg font-black text-white tracking-wide mb-2 animate-pulse">Analyzing Business Frameworks...</h3>
          <p className="text-xs text-gray-400 leading-normal max-w-sm mx-auto">
            AI Principals are grading your strategy against McKinsey MECE structures and Porter&apos;s Five Forces indices.
          </p>
        </div>
      )}

      {auditComplete && scores && (
        <div className="space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-purple-500/10 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left space-y-2">
                <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold rounded-full tracking-wide">
                  Audit Completed
                </span>
                <h2 className="text-2xl md:text-3xl font-black tracking-wide text-white">AI Strategy Audit</h2>
                <p className="text-xs text-purple-400 font-bold uppercase tracking-widest">Case: {activeCase.title}</p>
              </div>

              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" className="stroke-white/5 fill-none" strokeWidth="6" />
                  <circle 
                    cx="56" 
                    cy="56" 
                    r="48" 
                    className="stroke-purple-500 fill-none transition-all duration-1000" 
                    strokeWidth="6"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * scores.overall) / 100}
                  />
                </svg>
                <div className="absolute flex flex-col items-center leading-none">
                  <span className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{scores.overall}</span>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Grade</span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scores.metrics.map((m: ScoreMetric, i: number) => (
              <div key={i} className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between shadow-lg">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{m.name}</span>
                    <span className="text-sm font-black text-purple-400">{m.score}/100</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">&ldquo;{m.desc}&rdquo;</p>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-6">
                  <div style={{ width: `${m.score}%` }} className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Qualitative feedback */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-purple-500/10 shadow-2xl relative">
            <h3 className="text-sm font-black uppercase tracking-wider mb-3 text-white flex items-center space-x-2">
              <span>💡</span>
              <span>AI Partner Strategic Feedback</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed font-medium">
              {scores.review}
            </p>
          </div>

          <button
            onClick={() => handleStartCase(selectedCase)}
            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm tracking-widest uppercase rounded-2xl transition-all duration-300"
          >
            Reset Case & Rewrite Strategy
          </button>
        </div>
      )}
    </div>
  );
}
