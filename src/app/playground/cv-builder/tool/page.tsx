'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Experience {
  company: string;
  role: string;
  period: string;
  bullets: string;
}

export default function CVBuilderPage() {
  const [name, setName] = useState<string>('Ryan Radityatama');
  const [title, setTitle] = useState<string>('AI & Software Engineer');
  const [email, setEmail] = useState<string>('ryradit@gmail.com');
  const [summary, setSummary] = useState<string>(
    "Software Engineer with a strong background in building smart and efficient digital solutions, specializing in React, Next.js, and custom MLOps pipelines."
  );
  
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      company: 'DreamHost',
      role: 'Website Success Associate',
      period: 'Dec 2025 – Now',
      bullets: 'Designed and launched responsive, user-focused web platforms and optimized cloud-based deployments.'
    },
    {
      company: 'Trymerra AI Ltd.',
      role: 'AI Engineer',
      period: 'Mar 2025 – Jul 2025',
      bullets: 'Built dynamic MVPs featuring automated AI CV parsing and recruitment mockups using React and Appwrite.'
    }
  ]);

  const [template, setTemplate] = useState<'glass' | 'cyber' | 'minimal'>('glass');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleAutoFillRyan = () => {
    setName('Ryan Radityatama');
    setTitle('Senior AI & Software Engineer');
    setEmail('ryradit@gmail.com');
    setSummary(
      "Master of Computer Science graduate from Beijing Institute of Technology. Experienced in developing computer vision pipelines, low-resource LLM fine-tuning, and robust full-stack applications."
    );
    setExperiences([
      {
        company: 'DreamHost',
        role: 'Website Success Associate',
        period: 'Dec 2025 – Now',
        bullets: 'Designed and deployed responsive client platforms, managed DNS/caching integrations, and optimized overall SEO metrics by 20%.'
      },
      {
        company: 'AME Research',
        role: 'Machine Learning Engineer',
        period: 'Aug 2025 – Dec 2025',
        bullets: 'Built PDF scraper algorithms and custom forecasting scripts, increasing data pipeline efficiency by 30%.'
      }
    ]);
  };

  const handleCopy = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(JSON.stringify({ name, title, email, summary, experiences }, null, 2));
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header Navigation */}
      <div className="flex justify-between items-center">
        <Link href="/playground/cv-builder" className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center space-x-2">
          <span>← Go away from this playground</span>
        </Link>
        <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold rounded-full tracking-wide">
          Playground Module 03
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400 bg-clip-text text-transparent mb-3 tracking-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          AI CV Template Builder
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
          Create, edit, and generate professional CV layouts in real-time. Use our AI Auto-Fill preset to inject structured tech stacks instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Editor sidebar panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-2xl space-y-5 relative">
            <h3 className="text-base font-black tracking-wide text-white border-b border-white/5 pb-2 flex justify-between items-center">
              <span>✍️ CV Editor Panel</span>
              <button 
                onClick={handleAutoFillRyan}
                className="text-[10px] px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-bold uppercase rounded-lg border border-purple-500/20 transition-all duration-300"
              >
                AI Auto-Fill Ryan
              </button>
            </h3>

            {/* Input Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0d091a]/80 border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500/30 transition-all font-medium"
              />
            </div>

            {/* Input Job Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Target Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0d091a]/80 border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500/30 transition-all font-medium"
              />
            </div>

            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d091a]/80 border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500/30 transition-all font-medium"
              />
            </div>

            {/* Professional Summary */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Professional Summary</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full h-24 bg-[#0d091a]/80 border border-white/5 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500/30 transition-all font-medium resize-none leading-relaxed"
              />
            </div>

            {/* Dynamic experiences */}
            <div className="space-y-3 pt-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider block border-t border-white/5 pt-3">Work History Block</label>
              {experiences.map((exp, idx) => (
                <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2 relative">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={exp.company}
                      placeholder="Company"
                      onChange={(e) => {
                        const newExps = [...experiences];
                        newExps[idx].company = e.target.value;
                        setExperiences(newExps);
                      }}
                      className="bg-black/40 border border-white/5 rounded p-1.5 text-[10px] text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      value={exp.role}
                      placeholder="Role"
                      onChange={(e) => {
                        const newExps = [...experiences];
                        newExps[idx].role = e.target.value;
                        setExperiences(newExps);
                      }}
                      className="bg-black/40 border border-white/5 rounded p-1.5 text-[10px] text-white focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    value={exp.period}
                    placeholder="Period"
                    onChange={(e) => {
                      const newExps = [...experiences];
                      newExps[idx].period = e.target.value;
                      setExperiences(newExps);
                    }}
                    className="w-full bg-black/40 border border-white/5 rounded p-1.5 text-[10px] text-white focus:outline-none"
                  />
                  <textarea
                    value={exp.bullets}
                    placeholder="Responsibilities"
                    onChange={(e) => {
                      const newExps = [...experiences];
                      newExps[idx].bullets = e.target.value;
                      setExperiences(newExps);
                    }}
                    className="w-full h-14 bg-black/40 border border-white/5 rounded p-1.5 text-[10px] text-white focus:outline-none resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live CV document preview panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* Template controls */}
          <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
            <div className="flex gap-2">
              {[
                { id: 'glass', label: 'Glassmorphic' },
                { id: 'cyber', label: 'Cyber Dark' },
                { id: 'minimal', label: 'Minimalist' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setTemplate(item.id as 'glass' | 'cyber' | 'minimal')}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all duration-300 ${
                    template === item.id 
                      ? 'bg-purple-500 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-[10px] font-bold uppercase rounded-lg border border-white/10 text-white transition-all flex items-center space-x-1"
            >
              <span>{isCopied ? 'Copied ✅' : 'Copy JSON'}</span>
            </button>
          </div>

          {/* Dynamic document sheets wrapper */}
          <div className={`p-8 rounded-3xl border shadow-2xl relative transition-all duration-500 min-h-[550px] ${
            template === 'glass'
              ? 'glass-card border-purple-500/10 text-gray-200'
              : template === 'cyber'
              ? 'bg-[#05010c] border-[#1f0f2d] text-cyan-300'
              : 'bg-white border-gray-200 text-gray-900 font-sans'
          }`}>
            {/* Header branding */}
            <div className="border-b border-purple-500/10 pb-4 mb-6">
              <h2 className={`text-2xl font-black ${
                template === 'minimal' ? 'text-gray-900' : 'text-white'
              }`}>{name || 'John Doe'}</h2>
              <div className="flex justify-between items-center mt-1 flex-wrap gap-2">
                <span className={`text-xs font-semibold ${
                  template === 'glass' ? 'text-purple-400' : template === 'cyber' ? 'text-cyan-400 animate-pulse' : 'text-purple-600'
                }`}>{title || 'Engineer Track'}</span>
                <span className="text-[10px] text-gray-400 font-medium font-mono">{email}</span>
              </div>
            </div>

            {/* Summary details */}
            <div className="mb-6 space-y-2">
              <h4 className={`text-[10px] font-black uppercase tracking-wider ${
                template === 'minimal' ? 'text-gray-900' : 'text-gray-400'
              }`}>Professional Summary</h4>
              <p className="text-xs leading-relaxed font-medium opacity-90">{summary || 'Enter summary details...'}</p>
            </div>

            {/* Experience details */}
            <div className="space-y-4">
              <h4 className={`text-[10px] font-black uppercase tracking-wider ${
                template === 'minimal' ? 'text-gray-900' : 'text-gray-400'
              }`}>Work Experience</h4>
              <div className="space-y-4">
                {experiences.map((exp, i) => (
                  <div key={i} className="space-y-1 relative pl-4 border-l border-purple-500/20">
                    <div className="flex justify-between items-center flex-wrap gap-1">
                      <h5 className={`text-xs font-bold ${
                        template === 'minimal' ? 'text-gray-900' : 'text-white'
                      }`}>{exp.company || 'Company'}</h5>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{exp.period || 'Period'}</span>
                    </div>
                    <div className={`text-[10px] font-semibold ${
                      template === 'glass' ? 'text-purple-400' : template === 'cyber' ? 'text-cyan-400' : 'text-purple-600'
                    }`}>{exp.role || 'Role'}</div>
                    <p className="text-[11px] leading-relaxed font-medium opacity-80 pt-1">
                      {exp.bullets || 'Responsibilities...'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
