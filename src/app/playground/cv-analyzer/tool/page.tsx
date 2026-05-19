'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CVAnalyzerPage() {
  const [fileName, setFileName] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanComplete, setScanComplete] = useState<boolean>(false);
  const [atsScore, setAtsScore] = useState<number>(0);

  const handleUploadMock = (name: string) => {
    setFileName(name);
    setIsScanning(true);
    setScanComplete(false);

    // Simulate scanning laser anim
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setAtsScore(88);
    }, 3000);
  };

  const handleReset = () => {
    setFileName('');
    setScanComplete(false);
    setAtsScore(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      {/* Header Back Link */}
      <div className="flex justify-between items-center">
        <Link href="/playground/cv-analyzer" className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center space-x-2">
          <span>← Go away from this playground</span>
        </Link>
        <div className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold rounded-full tracking-wide">
          Playground Module 02
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400 bg-clip-text text-transparent mb-3 tracking-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          AI CV Diagnostic Analyzer
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
          Upload any PDF resume or test-scan the system using Ryan&apos;s custom CV data to receive immediate visual ATS scoring, error parsing, and keyword matching.
        </p>
      </div>

      {!fileName && !isScanning && (
        <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-2xl group transition-all duration-300 hover:border-purple-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 pointer-events-none" />
          
          <div className="w-20 h-20 bg-purple-600/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
            <span className="text-4xl animate-bounce">📄</span>
          </div>

          <h3 className="text-xl font-black text-white mb-2 tracking-wide">Drag & Drop Resume PDF</h3>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-6">Maximum File Size: 5MB</p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button
              onClick={() => handleUploadMock('Ryan_Radityatama_CV.pdf')}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs tracking-widest uppercase rounded-xl transition-all duration-300 shadow-lg shadow-purple-950/20"
            >
              Ryan&apos;s Portfolio CV
            </button>
            <button
              onClick={() => handleUploadMock('My_Draft_Resume.pdf')}
              className="flex-1 py-3 px-6 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs tracking-widest uppercase rounded-xl transition-all duration-300"
            >
              Scan Draft Resume
            </button>
          </div>
        </div>
      )}

      {isScanning && (
        <div className="glass-card p-12 rounded-3xl border border-purple-500/10 text-center flex flex-col items-center justify-center shadow-2xl relative overflow-hidden h-72">
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent top-0 animate-scanner-beam shadow-[0_0_15px_#a855f7]" />
          
          <div className="w-16 h-16 border-4 border-t-purple-500 border-r-pink-500 border-b-rose-400 border-l-transparent rounded-full animate-spin mb-6" />
          <h3 className="text-lg font-black text-white tracking-wide mb-1 animate-pulse">Running Neural Laser Scan...</h3>
          <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Parsing: &ldquo;{fileName}&rdquo;</p>
        </div>
      )}

      {scanComplete && (
        <div className="space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-purple-500/10 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left space-y-2">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <span className="px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                    Success
                  </span>
                  <span className="text-xs text-gray-400 font-semibold font-mono">&ldquo;{fileName}&rdquo;</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-wide text-white">ATS CV Diagnostics</h2>
                <p className="text-xs text-purple-400 font-bold uppercase tracking-widest">Completed via Earth-X Telemetry Engine</p>
              </div>

              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" className="stroke-white/5 fill-none" strokeWidth="6" />
                  <circle 
                    cx="56" 
                    cy="56" 
                    r="48" 
                    className="stroke-pink-500 fill-none transition-all duration-1000" 
                    strokeWidth="6"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * atsScore) / 100}
                  />
                </svg>
                <div className="absolute flex flex-col items-center leading-none">
                  <span className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{atsScore}%</span>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">ATS Index</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-2xl">
              <h3 className="text-sm font-black uppercase tracking-wider mb-4 text-rose-400 flex items-center space-x-2">
                <span>⚠️</span>
                <span>Detected ATS Roadblocks</span>
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Quantitative Proof Missing', desc: 'Some achievements lack measurable data metrics (e.g. % increase, latency reductions).' },
                  { title: 'Graphic & Icon Density', desc: 'Excessive graphical shapes or custom visual lines can confuse legacy parsing decoders.' },
                  { title: 'Non-Standard Headings', desc: 'Use canonical section names (&ldquo;Professional Experience&rdquo;, &ldquo;Skills&rdquo;) for indexing accuracy.' }
                ].map((err, i) => (
                  <div key={i} className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                    <div className="text-xs font-bold text-white mb-0.5">{err.title}</div>
                    <p className="text-[10px] text-gray-400 leading-normal font-medium">{err.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-2xl">
              <h3 className="text-sm font-black uppercase tracking-wider mb-4 text-purple-400 flex items-center space-x-2">
                <span>🔥</span>
                <span>Keyword Heatmap Relevance</span>
              </h3>
              <div className="space-y-4">
                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                  We scanned and matched critical technical keywords inside your CV against current tech recruiter search parameters:
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    { term: 'Next.js', state: 'high' },
                    { term: 'PyTorch', state: 'high' },
                    { term: 'TypeScript', state: 'high' },
                    { term: 'Appwrite', state: 'high' },
                    { term: 'MLOps', state: 'medium' },
                    { term: 'PostgreSQL', state: 'medium' },
                    { term: 'Docker', state: 'low' },
                    { term: 'AWS', state: 'low' }
                  ].map((word, i) => (
                    <span 
                      key={i} 
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                        word.state === 'high' 
                          ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
                          : word.state === 'medium'
                          ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      {word.term}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 md:p-8 rounded-3xl border border-purple-500/10 shadow-2xl relative">
            <h3 className="text-base font-black tracking-wide mb-4 flex items-center space-x-2 text-white">
              <span>✍️</span>
              <span>AI Content Optimization (Before vs After)</span>
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl relative">
                  <span className="absolute top-2 right-4 text-[9px] text-rose-400 font-bold uppercase tracking-widest">Before</span>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">
                    &ldquo;Responsible for developing and scaling palm tree neural algorithms using PyTorch to count trees.&rdquo;
                  </p>
                </div>
                <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-2xl relative">
                  <span className="absolute top-2 right-4 text-[9px] text-green-400 font-bold uppercase tracking-widest">After (AI Optimized)</span>
                  <p className="text-xs text-green-400 leading-relaxed font-semibold pt-2">
                    &ldquo;Engineered palm-tree detection algorithms in PyTorch, replacing manual audits and boostingplantation count efficiency by 25%.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm tracking-widest uppercase rounded-2xl transition-all duration-300"
            >
              Scan New Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
