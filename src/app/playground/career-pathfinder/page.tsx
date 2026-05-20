'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CareerPathfinderLandingPage() {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="min-h-[80vh] flex flex-col justify-center animate-in fade-in duration-500 max-w-5xl mx-auto py-10 px-4">
      {/* Header back button */}
      <div className="flex justify-between items-center mb-10">
        <Link href="/" className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-300">
          ← Go away from this playground
        </Link>
        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black rounded-full uppercase tracking-widest">
          🧭 Gate Activated
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Overview & Explanations */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-400 font-bold uppercase tracking-wide">
              <span>🧭</span>
              <span>Experimental Module 01</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400 bg-clip-text text-transparent tracking-tight leading-tight">
              AI Multi-Agent <br />Career Pathfinder
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium">
              Orchestrate four cooperating AI agents to scan your core professional drivers, map transferrable skillsets, and compile a roadmap.
            </p>
          </div>

          {/* Key Capabilities */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/5 pb-2">
              Capabilities & Architecture
            </h3>
            <ul className="space-y-3 text-xs text-gray-400 font-medium">
              <li className="flex items-start space-x-2.5">
                <span className="text-purple-400 font-bold">✓</span>
                <span><strong className="text-white font-bold">Multilingual Chat Interface</strong>: Vent, rant, or share career aspirations in 9 supported languages.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-purple-400 font-bold">✓</span>
                <span><strong className="text-white font-bold">Dynamic Vibe Detector</strong>: Real-time keyword scanning matches emotional tone and latent passion.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-purple-400 font-bold">✓</span>
                <span><strong className="text-white font-bold">Autonomous Synthesis</strong>: Cooperating agents compile qualitative critiques and interactive blueprint roadmaps.</span>
              </li>
            </ul>
          </div>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-2">
            {['Advanced LLM Sandbox', 'Multi-Agent Framework', 'Next.js App Router', 'Local Session Cache'].map((stack) => (
              <span key={stack} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-400 font-semibold font-mono">
                {stack}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Terms & Conditions & Access */}
        <div className="lg:col-span-5">
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-purple-500/10 shadow-2xl relative space-y-6">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 pointer-events-none rounded-3xl" />
            
            <div className="space-y-2 relative z-10">
              <h3 className="text-lg font-black text-white">Sandbox Entry Conditions</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                Please review and accept our playground terms of use before launching this AI-powered module.
              </p>
            </div>

            {/* Terms List */}
            <div className="space-y-4 max-h-56 overflow-y-auto bg-black/40 border border-white/5 rounded-xl p-4 text-[10px] text-gray-400 leading-relaxed font-medium">
              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase tracking-wider">1. AI Telemetry & API Processing</h4>
                <p>
                  Any professional rants, aspirations, or text queries submitted within the Career Pathfinder are parsed transiently by advanced LLM systems. No data is stored, packaged, or sold.
                </p>
              </div>
              <div className="space-y-2 border-t border-white/5 pt-3">
                <h4 className="font-bold text-white uppercase tracking-wider">2. Persistence & Refresh Policy</h4>
                <p>
                  All active chats operate inside local session variables. If you refresh the page, your progress and chat messages remain preserved. However, if you navigate away (change pages) or close the playground, the entire session is wiped clean.
                </p>
              </div>
              <div className="space-y-2 border-t border-white/5 pt-3">
                <h4 className="font-bold text-white uppercase tracking-wider">3. Experimental Limitations</h4>
                <p>
                  Aura is an AI agent. The advice, roadmap milestones, and career diagnostics compiled are generated through model inferences. They do not constitute certified professional, legal, or psychological counseling.
                </p>
              </div>
            </div>

            {/* Checkbox agreement */}
            <label className="flex items-center space-x-3 cursor-pointer group relative z-10 select-none">
              <input
                type="checkbox"
                checked={accepted}
                onChange={() => setAccepted(!accepted)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-[11px] text-gray-400 group-hover:text-gray-300 font-semibold transition-colors">
                I agree to the Sandbox Terms & Conditions
              </span>
            </label>

            {/* Launch button */}
            <Link
              href={accepted ? "/playground/career-pathfinder/chat" : "#"}
              onClick={(e) => { if (!accepted) e.preventDefault(); }}
              className={`w-full py-4 text-center block font-bold text-xs tracking-widest uppercase rounded-xl transition-all duration-300 relative z-10 ${
                accepted
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
              }`}
            >
              <span>Launch Sandbox Tool →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
