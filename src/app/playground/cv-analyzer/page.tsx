'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CVAnalyzerLandingPage() {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="min-h-[80vh] flex flex-col justify-center animate-in fade-in duration-500 max-w-5xl mx-auto py-10 px-4">
      {/* Header back button */}
      <div className="flex justify-between items-center mb-10">
        <Link href="/" className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-300">
          ← Go away from this playground
        </Link>
        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black rounded-full uppercase tracking-widest animate-pulse">
          🚀 Coming Soon
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Overview & Explanations */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-400 font-bold uppercase tracking-wide">
              <span>📄</span>
              <span>Experimental Module 03</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400 bg-clip-text text-transparent tracking-tight leading-tight">
              AI CV Diagnostic <br />Analyzer
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
              Laser-scan your PDF resume against recruiter algorithms to extract visual roadblocks and keyword relevancy metrics.
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
                <span><strong className="text-white font-bold">Roadblock scanner</strong>: Extracts critical ATS format and style warnings.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-purple-400 font-bold">✓</span>
                <span><strong className="text-white font-bold">Keyword Heatmap</strong>: Computes term frequency matching for technical recruiters.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-purple-400 font-bold">✓</span>
                <span><strong className="text-white font-bold">AI Rewrite Proposals</strong>: Before-and-after micro-copy refinements.</span>
              </li>
            </ul>
          </div>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-2">
            {['Advanced LLM Models', 'Neural Scanners', 'PDF Parser Modules', 'Local memory state'].map((stack) => (
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
                  Uploaded resumes are parsed dynamically to run scans. The layout holds zero server state.
                </p>
              </div>
              <div className="space-y-2 border-t border-white/5 pt-3">
                <h4 className="font-bold text-white uppercase tracking-wider">2. Zero Persistence Policy</h4>
                <p>
                  No documents, names, or addresses are stored in a database. Everything stays local.
                </p>
              </div>
              <div className="space-y-2 border-t border-white/5 pt-3">
                <h4 className="font-bold text-white uppercase tracking-wider">3. Experimental Limitations</h4>
                <p>
                  ATS scoring is simulated based on common algorithms. It does not reflect individual hiring team reviews.
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

            {/* Launch button (Locked as Coming Soon) */}
            <button
              disabled
              className="w-full py-4 text-center font-bold text-xs tracking-widest uppercase rounded-xl transition-all duration-300 relative z-10 bg-zinc-800 text-zinc-500 border border-white/5 flex items-center justify-center space-x-2"
            >
              <span>🔒 Sandbox Coming Soon</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
