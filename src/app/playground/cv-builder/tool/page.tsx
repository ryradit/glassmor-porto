'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  improveSummaryAction, 
  improveExperienceAction, 
  generateCoverLetterAction,
  Experience,
  CVData
} from '@/lib/cv-builder';

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
  const [activeTab, setActiveTab] = useState<'resume' | 'cover-letter'>('resume');
  
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isPolishingSummary, setIsPolishingSummary] = useState<boolean>(false);
  const [polishingIndex, setPolishingIndex] = useState<number | null>(null);
  
  const [targetCompany, setTargetCompany] = useState<string>('DreamHost');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isGeneratingLetter, setIsGeneratingLetter] = useState<boolean>(false);
  const [letterError, setLetterError] = useState<string>('');
  const [summaryError, setSummaryError] = useState<string>('');
  const [experienceErrors, setExperienceErrors] = useState<Record<number, string>>({});

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
    const content = activeTab === 'resume' 
      ? JSON.stringify({ name, title, email, summary, experiences }, null, 2)
      : coverLetter;
    navigator.clipboard.writeText(content);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      { company: '', role: '', period: '', bullets: '' }
    ]);
  };

  const handleRemoveExperience = (index: number) => {
    const newExps = experiences.filter((_, idx) => idx !== index);
    setExperiences(newExps);
  };

  const handlePolishSummary = async () => {
    if (!summary.trim()) return;
    setIsPolishingSummary(true);
    setSummaryError('');
    try {
      const result = await improveSummaryAction(summary, title);
      setSummary(result);
    } catch (err) {
      console.error(err);
      setSummaryError('Failed to polish summary. Verify API key.');
    } finally {
      setIsPolishingSummary(false);
    }
  };

  const handlePolishExperience = async (index: number) => {
    const bullets = experiences[index].bullets;
    if (!bullets.trim()) return;
    setPolishingIndex(index);
    setExperienceErrors(prev => ({ ...prev, [index]: '' }));
    try {
      const result = await improveExperienceAction(bullets, experiences[index].role || title);
      const newExps = [...experiences];
      newExps[index].bullets = result;
      setExperiences(newExps);
    } catch (err) {
      console.error(err);
      setExperienceErrors(prev => ({ ...prev, [index]: 'Failed to polish experience. Verify API key.' }));
    } finally {
      setPolishingIndex(null);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!targetCompany.trim()) return;
    setIsGeneratingLetter(true);
    setLetterError('');
    try {
      const cv: CVData = { name, title, email, summary, experiences };
      const letter = await generateCoverLetterAction(cv, targetCompany);
      setCoverLetter(letter);
      setActiveTab('cover-letter');
    } catch (err) {
      console.error(err);
      setLetterError('Failed to compile cover letter. Verify API key.');
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto py-6 px-4">
      {/* Header Navigation */}
      <div className="flex justify-between items-center">
        <Link href="/playground/cv-builder" className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center space-x-2">
          <span>← Go away from this playground</span>
        </Link>
        <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black rounded-full uppercase tracking-widest">
          Playground Module 04
        </div>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400 bg-clip-text text-transparent tracking-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          AI CV Template Builder
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto font-medium">
          Create, edit, and audit professional layouts in real-time. Use interactive AI polish triggers to optimize metrics and compile customized letters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor sidebar panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-2xl space-y-5 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent rounded-3xl pointer-events-none" />
            
            <h3 className="text-sm font-black tracking-widest text-white uppercase border-b border-white/5 pb-3 flex justify-between items-center relative z-10">
              <span>✍️ CV Workspace Panel</span>
              <button 
                onClick={handleAutoFillRyan}
                className="text-[9px] px-2.5 py-1.5 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 font-bold uppercase rounded-lg border border-purple-500/30 transition-all duration-300 hover:scale-102"
              >
                Auto-Fill Preset
              </button>
            </h3>

            {/* Input Name */}
            <div className="space-y-1.5 relative z-10">
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ryan Radityatama"
                className="w-full bg-[#0d091a]/80 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500/30 transition-all font-medium placeholder-zinc-700"
              />
            </div>

            {/* Input Job Title */}
            <div className="space-y-1.5 relative z-10">
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Target Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Senior AI Engineer"
                className="w-full bg-[#0d091a]/80 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500/30 transition-all font-medium placeholder-zinc-700"
              />
            </div>

            {/* Input Email */}
            <div className="space-y-1.5 relative z-10">
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ryradit@gmail.com"
                className="w-full bg-[#0d091a]/80 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500/30 transition-all font-medium placeholder-zinc-700"
              />
            </div>

            {/* Professional Summary */}
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Professional Summary</label>
                <button
                  onClick={handlePolishSummary}
                  disabled={isPolishingSummary || !summary.trim()}
                  className="text-[9px] px-2 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold uppercase rounded-lg hover:bg-purple-500/20 transition-all flex items-center space-x-1 disabled:opacity-50"
                >
                  <span>{isPolishingSummary ? '⏳ Polishing...' : '✨ AI Polish Summary'}</span>
                </button>
              </div>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Write your professional summary here..."
                className="w-full h-24 bg-[#0d091a]/80 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500/30 transition-all font-medium resize-none leading-relaxed placeholder-zinc-700"
              />
              {summaryError && <p className="text-[10px] text-rose-400 font-semibold">{summaryError}</p>}
            </div>

            {/* Dynamic experiences */}
            <div className="space-y-4 pt-3 border-t border-white/5 relative z-10">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Work History Blocks</label>
                <button
                  onClick={handleAddExperience}
                  className="text-[9px] px-2.5 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold uppercase rounded-lg hover:bg-emerald-500/25 transition-all"
                >
                  ➕ Add Experience
                </button>
              </div>

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 space-y-3">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-3 relative">
                    <button
                      onClick={() => handleRemoveExperience(idx)}
                      className="absolute top-2 right-2 text-zinc-500 hover:text-rose-400 text-xs transition-colors p-1"
                      title="Delete experience"
                    >
                      ✕
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2 pr-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-zinc-500">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          placeholder="DreamHost"
                          onChange={(e) => {
                            const newExps = [...experiences];
                            newExps[idx].company = e.target.value;
                            setExperiences(newExps);
                          }}
                          className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-zinc-500">Role</label>
                        <input
                          type="text"
                          value={exp.role}
                          placeholder="AI Engineer"
                          onChange={(e) => {
                            const newExps = [...experiences];
                            newExps[idx].role = e.target.value;
                            setExperiences(newExps);
                          }}
                          className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-bold uppercase text-zinc-500">Period</label>
                      <input
                        type="text"
                        value={exp.period}
                        placeholder="Dec 2025 – Now"
                        onChange={(e) => {
                          const newExps = [...experiences];
                          newExps[idx].period = e.target.value;
                          setExperiences(newExps);
                        }}
                        className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[8px] font-bold uppercase text-zinc-500">Responsibilities</label>
                        <button
                          onClick={() => handlePolishExperience(idx)}
                          disabled={polishingIndex !== null || !exp.bullets.trim()}
                          className="text-[8px] px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold uppercase rounded hover:bg-purple-500/20 transition-all disabled:opacity-50"
                        >
                          <span>{polishingIndex === idx ? '⏳ Polishing...' : '✨ AI Polish'}</span>
                        </button>
                      </div>
                      <textarea
                        value={exp.bullets}
                        placeholder="Detail your responsibilities and impact..."
                        onChange={(e) => {
                          const newExps = [...experiences];
                          newExps[idx].bullets = e.target.value;
                          setExperiences(newExps);
                        }}
                        className="w-full h-16 bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20 resize-none leading-relaxed placeholder-zinc-700"
                      />
                      {experienceErrors[idx] && <p className="text-[9px] text-rose-400 font-semibold">{experienceErrors[idx]}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cover Letter generation quick tool */}
            <div className="space-y-2.5 pt-3 border-t border-white/5 relative z-10">
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Generate Cover Letter</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="Target Company (e.g. Google)"
                  className="flex-1 bg-black/40 border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500/20"
                />
                <button
                  onClick={handleGenerateCoverLetter}
                  disabled={isGeneratingLetter || !targetCompany.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                >
                  <span>{isGeneratingLetter ? '⏳ Building...' : '✨ Write Letter'}</span>
                </button>
              </div>
              {letterError && <p className="text-[10px] text-rose-400 font-semibold">{letterError}</p>}
            </div>
          </div>
        </div>

        {/* Live CV document preview panel */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5 gap-3">
            {/* View tabs */}
            <div className="flex gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5">
              <button
                onClick={() => setActiveTab('resume')}
                className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg tracking-wider transition-all duration-300 ${
                  activeTab === 'resume' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                📄 Resume
              </button>
              <button
                onClick={() => {
                  if (coverLetter) setActiveTab('cover-letter');
                }}
                disabled={!coverLetter}
                className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg tracking-wider transition-all duration-300 ${
                  !coverLetter ? 'opacity-40 cursor-not-allowed' : ''
                } ${
                  activeTab === 'cover-letter' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                ✉️ Cover Letter
              </button>
            </div>

            {/* Template controls */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[
                  { id: 'glass', label: 'Glass' },
                  { id: 'cyber', label: 'Cyber' },
                  { id: 'minimal', label: 'Minimal' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setTemplate(item.id as 'glass' | 'cyber' | 'minimal')}
                    className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg transition-all duration-300 border ${
                      template === item.id 
                        ? 'bg-white/10 text-white border-white/20' 
                        : 'text-gray-400 hover:text-white border-transparent'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/35 hover:to-pink-500/35 text-[9px] font-black uppercase tracking-widest rounded-lg border border-purple-500/35 text-white transition-all duration-300"
              >
                <span>{isCopied ? 'Copied ✅' : activeTab === 'resume' ? 'Copy JSON Data' : 'Copy Text'}</span>
              </button>
            </div>
          </div>

          {/* Dynamic document sheets wrapper */}
          <div className={`p-8 rounded-3xl border shadow-2xl relative transition-all duration-500 min-h-[600px] overflow-hidden ${
            template === 'glass'
              ? 'glass-card border-purple-500/10 text-gray-200 shadow-purple-950/5'
              : template === 'cyber'
              ? 'bg-[#030108] border-[#29173d] text-cyan-300 shadow-2xl font-mono'
              : 'bg-white border-zinc-200 text-zinc-800 font-sans shadow-lg'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none rounded-3xl" />
            
            {activeTab === 'resume' ? (
              <div className="space-y-6 relative z-10">
                {/* Header branding */}
                <div className="border-b border-purple-500/10 pb-4">
                  <h2 className={`text-2xl font-black tracking-tight ${
                    template === 'minimal' ? 'text-zinc-900' : 'text-white'
                  }`}>{name || 'John Doe'}</h2>
                  <div className="flex justify-between items-center mt-1.5 flex-wrap gap-2 text-xs font-semibold">
                    <span className={`${
                      template === 'glass' ? 'text-purple-400' : template === 'cyber' ? 'text-pink-400 uppercase tracking-widest' : 'text-purple-600'
                    }`}>{title || 'Engineer Track'}</span>
                    <span className="text-[10px] text-zinc-400 font-medium font-mono">{email}</span>
                  </div>
                </div>

                {/* Summary details */}
                <div className="space-y-2">
                  <h4 className={`text-[10px] font-black uppercase tracking-widest ${
                    template === 'minimal' ? 'text-zinc-900' : 'text-zinc-400'
                  }`}>Professional Summary</h4>
                  <p className="text-xs leading-relaxed font-medium opacity-90">{summary || 'Enter summary details...'}</p>
                </div>

                {/* Experience details */}
                <div className="space-y-4">
                  <h4 className={`text-[10px] font-black uppercase tracking-widest border-t border-purple-500/10 pt-4 ${
                    template === 'minimal' ? 'text-zinc-900' : 'text-zinc-400'
                  }`}>Work Experience</h4>
                  
                  {experiences.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic">No experiences added. Use the left panel to configure work blocks.</p>
                  ) : (
                    <div className="space-y-5">
                      {experiences.map((exp, i) => (
                        <div key={i} className="space-y-1 relative pl-4 border-l border-purple-500/20">
                          <div className="flex justify-between items-center flex-wrap gap-1.5">
                            <h5 className={`text-xs font-black ${
                              template === 'minimal' ? 'text-zinc-900' : 'text-white'
                            }`}>{exp.company || 'Company Name'}</h5>
                            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">{exp.period || 'Period'}</span>
                          </div>
                          <div className={`text-[10px] font-bold ${
                            template === 'glass' ? 'text-purple-400' : template === 'cyber' ? 'text-cyan-400' : 'text-purple-600'
                          }`}>{exp.role || 'Role Title'}</div>
                          <p className="text-[11px] leading-relaxed font-medium opacity-80 pt-1.5 whitespace-pre-line">
                            {exp.bullets || 'Describe your daily workflow achievements...'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6 relative z-10">
                {/* Header branding for cover letter */}
                <div className="border-b border-purple-500/10 pb-4">
                  <h2 className={`text-2xl font-black tracking-tight ${
                    template === 'minimal' ? 'text-zinc-900' : 'text-white'
                  }`}>{name}</h2>
                  <div className="flex justify-between items-center mt-1.5 flex-wrap gap-2 text-xs font-semibold">
                    <span className="text-zinc-400 font-medium font-mono">{email}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      template === 'glass' ? 'text-purple-400' : template === 'cyber' ? 'text-pink-400' : 'text-purple-600'
                    }`}>Cover Letter for {targetCompany}</span>
                  </div>
                </div>

                {/* Cover letter content */}
                <div className="space-y-5 text-xs leading-relaxed font-medium opacity-90 whitespace-pre-line">
                  <p>Dear Hiring Team at {targetCompany},</p>
                  {coverLetter}
                  <p className="pt-4">Sincerely,</p>
                  <p className="font-bold">{name}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
