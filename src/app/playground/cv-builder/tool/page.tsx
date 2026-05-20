'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useReactToPrint } from 'react-to-print';
import { 
  improveSummaryAction, 
  improveExperienceAction, 
  generateCoverLetterAction,
  improveSkillsAction,
  Experience,
  CVData,
  Education,
  Language,
  Certification
} from '@/lib/cv-builder';
import universities from '../../../../../universities.json';
import { exportToDocx } from '@/lib/docx-export';

export default function CVBuilderPage() {
  const [name, setName] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [linkedin, setLinkedin] = useState<string>('');
  const [portfolio, setPortfolio] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [hardSkills, setHardSkills] = useState<string>('');
  const [softSkills, setSoftSkills] = useState<string>('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [activeTab, setActiveTab] = useState<'resume' | 'cover-letter'>('resume');
  
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isPolishingSummary, setIsPolishingSummary] = useState<boolean>(false);
  const [polishingIndex, setPolishingIndex] = useState<number | null>(null);
  const [isPolishingHardSkills, setIsPolishingHardSkills] = useState<boolean>(false);
  const [isPolishingSoftSkills, setIsPolishingSoftSkills] = useState<boolean>(false);
  
  const [targetCompany, setTargetCompany] = useState<string>('TechFlow Inc.');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isGeneratingLetter, setIsGeneratingLetter] = useState<boolean>(false);
  const [letterError, setLetterError] = useState<string>('');
  const [summaryError, setSummaryError] = useState<string>('');
  const [experienceErrors, setExperienceErrors] = useState<Record<number, string>>({});
  const [skillsError, setSkillsError] = useState<string>('');
  const [uniSearchResults, setUniSearchResults] = useState<Record<number, string[]>>({});
  const [activeEduSearchIdx, setActiveEduSearchIdx] = useState<number | null>(null);

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${name || 'CV'}_Resume`,
    pageStyle: `
      @page {
        size: A4;
        margin: 18mm 16mm;
      }
      @page :first { margin-top: 18mm; }
      html, body {
        margin: 0;
        padding: 0;
        background: white;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    `,
  });

  const handleLoadDemo = () => {
    setName('Alex Morgan');
    setTitle('Senior Software Engineer');
    setEmail('alex.morgan@example.com');
    setLocation('San Francisco, CA');
    setPhone('+1 (555) 123-4567');
    setLinkedin('linkedin.com/in/alexmorgan');
    setPortfolio('alexmorgan.dev');
    setSummary(
      "Experienced software developer with 6+ years of expertise in TypeScript, React, Node.js, and cloud orchestration. Passionate about system architecture and writing clean, scalable code."
    );
    setExperiences([
      {
        company: 'TechFlow Inc.',
        role: 'Senior Developer',
        period: 'Jan 2024 – Now',
        bullets: 'Architected microservices that reduced operational overhead by 25% and mentored junior development teams.',
        type: 'Full-Time'
      },
      {
        company: 'WebSphere Solutions',
        role: 'Frontend Engineer',
        period: 'Mar 2021 – Dec 2023',
        bullets: 'Implemented responsive interfaces using Next.js and optimized client-side bundle sizes for 35% faster loads.',
        type: 'Internship'
      }
    ]);
    setEducation([
      {
        institution: 'Beijing Institute of Technology',
        degree: 'Master of Computer Science & Technology',
        period: '2022 – 2024',
        cityCountry: 'Beijing, China',
        gpa: '3.8/4.0',
        awards: 'Chinese Government Scholarship Recipient',
        thesis: 'Research on Large Language Models Fine-Tuning for Mental Health'
      }
    ]);
    setHardSkills('TypeScript, React, Next.js, Node.js, Python, PyTorch, Docker, Kubernetes, AWS');
    setSoftSkills('Analytical Thinking, Team Leadership, Adaptability, Clear Communication');
    setLanguages([
      { name: 'English', proficiency: 'Professional Working Proficiency' },
      { name: 'Mandarin Chinese', proficiency: 'Basic' }
    ]);
    setCertifications([
      {
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        date: '2024',
        link: 'https://aws.amazon.com'
      },
      {
        name: 'Professional Scrum Master I (PSM I)',
        issuer: 'Scrum.org',
        date: '2023'
      }
    ]);
  };

  const handleCopy = () => {
    setIsCopied(true);
    const content = activeTab === 'resume' 
      ? JSON.stringify({ name, title, email, summary, experiences, education, hardSkills, softSkills, languages, certifications }, null, 2)
      : coverLetter;
    navigator.clipboard.writeText(content);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      { company: '', role: '', period: '', bullets: '', type: 'Full-Time' }
    ]);
  };

  const handleRemoveExperience = (index: number) => {
    const newExps = experiences.filter((_, idx) => idx !== index);
    setExperiences(newExps);
  };

  const handleAddEducation = () => {
    setEducation([
      ...education,
      { institution: '', degree: '', period: '', cityCountry: '', gpa: '', awards: '', thesis: '' }
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, idx) => idx !== index));
  };

  const handleAddLanguage = () => {
    setLanguages([
      ...languages,
      { name: '', proficiency: 'Professional Working Proficiency' }
    ]);
  };

  const handleRemoveLanguage = (index: number) => {
    setLanguages(languages.filter((_, idx) => idx !== index));
  };

  const handleAddCertification = () => {
    setCertifications([
      ...certifications,
      { name: '', issuer: '', date: '', link: '' }
    ]);
  };

  const handleRemoveCertification = (index: number) => {
    setCertifications(certifications.filter((_, idx) => idx !== index));
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

  const handlePolishExperience = async (index: number, mode: 'polish' | 'expand' | 'condense' = 'polish') => {
    const bullets = experiences[index].bullets;
    if (!bullets.trim()) return;
    setPolishingIndex(index);
    setExperienceErrors(prev => ({ ...prev, [index]: '' }));
    try {
      const result = await improveExperienceAction(bullets, experiences[index].role || title, experiences[index].company || 'the company', mode);
      const newExps = [...experiences];
      newExps[index].bullets = result;
      setExperiences(newExps);
    } catch (err) {
      console.error(err);
      setExperienceErrors(prev => ({ ...prev, [index]: `Failed to ${mode} experience. Verify API key.` }));
    } finally {
      setPolishingIndex(null);
    }
  };

  const handlePolishSkills = async (type: 'hard' | 'soft') => {
    const skillsToPolish = type === 'hard' ? hardSkills : softSkills;
    if (!skillsToPolish.trim()) return;
    
    if (type === 'hard') {
      setIsPolishingHardSkills(true);
    } else {
      setIsPolishingSoftSkills(true);
    }
    setSkillsError('');
    
    try {
      const result = await improveSkillsAction(skillsToPolish, title, type);
      if (type === 'hard') {
        setHardSkills(result);
      } else {
        setSoftSkills(result);
      }
    } catch (err) {
      console.error(err);
      setSkillsError('Failed to polish skills. Verify API key.');
    } finally {
      if (type === 'hard') {
        setIsPolishingHardSkills(false);
      } else {
        setIsPolishingSoftSkills(false);
      }
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!targetCompany.trim()) return;
    setIsGeneratingLetter(true);
    setLetterError('');
    try {
      const cv: CVData = { name, title, email, summary, experiences, education, hardSkills, softSkills, languages };
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
    <div className="space-y-8 animate-in fade-in duration-500 max-w-none w-full py-6 px-4">
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
                onClick={handleLoadDemo}
                className="text-[9px] px-2.5 py-1.5 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 font-bold uppercase rounded-lg border border-purple-500/30 transition-all duration-300 hover:scale-102"
              >
                Load Demo Profile
              </button>
            </h3>

            {/* Input Name */}
            <div className="space-y-1.5 relative z-10">
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
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
                placeholder="Senior Software Engineer"
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
                placeholder="alex.morgan@example.com"
                className="w-full bg-[#0d091a]/80 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500/30 transition-all font-medium placeholder-zinc-700"
              />
            </div>

            {/* Optional Contact Details */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Location (Optional)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full bg-[#0d091a]/80 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500/30 transition-all font-medium placeholder-zinc-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Phone (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full bg-[#0d091a]/80 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500/30 transition-all font-medium placeholder-zinc-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">LinkedIn (Optional)</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="linkedin.com/in/alex"
                  className="w-full bg-[#0d091a]/80 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500/30 transition-all font-medium placeholder-zinc-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Portfolio (Optional)</label>
                <input
                  type="text"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="alexmorgan.dev"
                  className="w-full bg-[#0d091a]/80 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500/30 transition-all font-medium placeholder-zinc-700"
                />
              </div>
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
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Professional Experience (Work, Part-Time, Internship, etc.)</label>
                <button
                  onClick={handleAddExperience}
                  className="text-[9px] px-2.5 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold uppercase rounded-lg hover:bg-emerald-500/25 transition-all shrink-0"
                >
                  ➕ Add Experience
                </button>
              </div>

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
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

                    <div className="grid grid-cols-2 gap-2">
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
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-zinc-500">Employment Type</label>
                        <select
                          value={exp.type || 'Full-Time'}
                          onChange={(e) => {
                            const newExps = [...experiences];
                            newExps[idx].type = e.target.value;
                            setExperiences(newExps);
                          }}
                          className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20 [&>option]:bg-[#0d091a] [&>option]:text-white"
                        >
                          <option value="Full-Time">Full-Time</option>
                          <option value="Part-Time">Part-Time</option>
                          <option value="Internship">Internship</option>
                          <option value="Freelance">Freelance</option>
                          <option value="Contract">Contract</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[8px] font-bold uppercase text-zinc-500">Responsibilities</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePolishExperience(idx, 'polish')}
                            disabled={polishingIndex !== null || !exp.bullets.trim()}
                            className="text-[8px] px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold uppercase rounded hover:bg-purple-500/20 transition-all disabled:opacity-50"
                            title="Rewrite and improve points"
                          >
                            <span>{polishingIndex === idx ? '⏳...' : '✨ Polish'}</span>
                          </button>
                          <button
                            onClick={() => handlePolishExperience(idx, 'expand')}
                            disabled={polishingIndex !== null || !exp.bullets.trim()}
                            className="text-[8px] px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold uppercase rounded hover:bg-blue-500/20 transition-all disabled:opacity-50"
                            title="Generate more bullet points"
                          >
                            <span>➕ Expand</span>
                          </button>
                          <button
                            onClick={() => handlePolishExperience(idx, 'condense')}
                            disabled={polishingIndex !== null || !exp.bullets.trim() || exp.bullets.split('\n').filter(b => b.trim().length > 0).length <= 1}
                            className="text-[8px] px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 font-bold uppercase rounded hover:bg-pink-500/20 transition-all disabled:opacity-50"
                            title="Remove least impactful point"
                          >
                            <span>➖ Condense</span>
                          </button>
                        </div>
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

            {/* Dynamic education */}
            <div className="space-y-4 pt-3 border-t border-white/5 relative z-10">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Education Blocks</label>
                <button
                  onClick={handleAddEducation}
                  className="text-[9px] px-2.5 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold uppercase rounded-lg hover:bg-emerald-500/25 transition-all"
                >
                  ➕ Add Education
                </button>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {education.map((edu, idx) => (
                  <div key={idx} className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-3 relative">
                    <button
                      onClick={() => handleRemoveEducation(idx)}
                      className="absolute top-2 right-2 text-zinc-500 hover:text-rose-400 text-xs transition-colors p-1"
                      title="Delete education"
                    >
                      ✕
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2 pr-4">
                      <div className="space-y-1 relative">
                        <label className="text-[8px] font-bold uppercase text-zinc-500">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          placeholder="Beijing Institute of Technology"
                          onChange={(e) => {
                            const val = e.target.value;
                            const newEdu = [...education];
                            newEdu[idx].institution = val;
                            setEducation(newEdu);
                            
                            if (val.trim().length >= 2) {
                              const lowerVal = val.toLowerCase();
                              const results = universities
                                .filter((uni: string) => uni.toLowerCase().includes(lowerVal))
                                .slice(0, 10);
                              setUniSearchResults(prev => ({ ...prev, [idx]: results }));
                            } else {
                              setUniSearchResults(prev => ({ ...prev, [idx]: [] }));
                            }
                          }}
                          onFocus={() => {
                            setActiveEduSearchIdx(idx);
                          }}
                          onBlur={() => {
                            setTimeout(() => {
                              setActiveEduSearchIdx(null);
                            }, 200);
                          }}
                          className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20"
                        />
                        {activeEduSearchIdx === idx && uniSearchResults[idx] && uniSearchResults[idx].length > 0 && (
                          <div className="absolute left-0 right-0 mt-1 bg-[#120e25] border border-white/10 rounded-xl shadow-2xl z-50 max-h-[160px] overflow-y-auto divide-y divide-white/5">
                            {uniSearchResults[idx].map((uniName, sIdx) => (
                              <button
                                key={sIdx}
                                type="button"
                                onMouseDown={() => {
                                  const newEdu = [...education];
                                  newEdu[idx].institution = uniName;
                                  setEducation(newEdu);
                                  setUniSearchResults(prev => ({ ...prev, [idx]: [] }));
                                }}
                                className="w-full text-left px-3 py-2 text-[10px] text-zinc-300 hover:bg-white/10 hover:text-white transition-all font-medium"
                              >
                                🏫 {uniName}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-zinc-500">Degree / Major</label>
                        <input
                          type="text"
                          value={edu.degree}
                          placeholder="Master of Computer Science"
                          onChange={(e) => {
                            const newEdu = [...education];
                            newEdu[idx].degree = e.target.value;
                            setEducation(newEdu);
                          }}
                          className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-zinc-500">Period</label>
                        <input
                          type="text"
                          value={edu.period}
                          placeholder="2022 – 2024"
                          onChange={(e) => {
                            const newEdu = [...education];
                            newEdu[idx].period = e.target.value;
                            setEducation(newEdu);
                          }}
                          className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-zinc-500">City / Country</label>
                        <input
                          type="text"
                          value={edu.cityCountry}
                          placeholder="Beijing, China"
                          onChange={(e) => {
                            const newEdu = [...education];
                            newEdu[idx].cityCountry = e.target.value;
                            setEducation(newEdu);
                          }}
                          className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-zinc-500">GPA / Score</label>
                        <input
                          type="text"
                          value={edu.gpa || ''}
                          placeholder="3.8/4.0"
                          onChange={(e) => {
                            const newEdu = [...education];
                            newEdu[idx].gpa = e.target.value;
                            setEducation(newEdu);
                          }}
                          className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-zinc-500">Awards / Scholarships</label>
                        <input
                          type="text"
                          value={edu.awards || ''}
                          placeholder="Chinese Government Scholarship"
                          onChange={(e) => {
                            const newEdu = [...education];
                            newEdu[idx].awards = e.target.value;
                            setEducation(newEdu);
                          }}
                          className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-bold uppercase text-zinc-500">Research / Thesis (Optional)</label>
                      <input
                        type="text"
                        value={edu.thesis || ''}
                        placeholder="Research on Large Language Models"
                        onChange={(e) => {
                          const newEdu = [...education];
                          newEdu[idx].thesis = e.target.value;
                          setEducation(newEdu);
                        }}
                        className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills section */}
            <div className="space-y-3 pt-3 border-t border-white/5 relative z-10">
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Skills Directory</label>
              
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[8px] font-bold uppercase text-zinc-500">Hard Skills (Comma-separated)</label>
                    <button
                      onClick={() => handlePolishSkills('hard')}
                      disabled={isPolishingHardSkills || !hardSkills.trim()}
                      className="text-[8px] px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold uppercase rounded hover:bg-purple-500/20 transition-all disabled:opacity-50"
                    >
                      <span>{isPolishingHardSkills ? '⏳ Polishing...' : '✨ AI Polish'}</span>
                    </button>
                  </div>
                  <textarea
                    value={hardSkills}
                    placeholder="React, Next.js, Node.js, PyTorch..."
                    onChange={(e) => setHardSkills(e.target.value)}
                    className="w-full h-14 bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20 resize-none leading-relaxed placeholder-zinc-700"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[8px] font-bold uppercase text-zinc-500">Soft Skills (Comma-separated)</label>
                    <button
                      onClick={() => handlePolishSkills('soft')}
                      disabled={isPolishingSoftSkills || !softSkills.trim()}
                      className="text-[8px] px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold uppercase rounded hover:bg-purple-500/20 transition-all disabled:opacity-50"
                    >
                      <span>{isPolishingSoftSkills ? '⏳ Polishing...' : '✨ AI Polish'}</span>
                    </button>
                  </div>
                  <textarea
                    value={softSkills}
                    placeholder="Analytical Thinking, Clear Communication..."
                    onChange={(e) => setSoftSkills(e.target.value)}
                    className="w-full h-14 bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20 resize-none leading-relaxed placeholder-zinc-700"
                  />
                </div>
                {skillsError && <p className="text-[10px] text-rose-400 font-semibold">{skillsError}</p>}
              </div>
            </div>

            {/* Languages section */}
            <div className="space-y-4 pt-3 border-t border-white/5 relative z-10">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Languages</label>
                <button
                  onClick={handleAddLanguage}
                  className="text-[9px] px-2.5 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold uppercase rounded-lg hover:bg-emerald-500/25 transition-all"
                >
                  ➕ Add Language
                </button>
              </div>

              <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                {languages.map((lang, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/5 relative">
                    <input
                      type="text"
                      value={lang.name}
                      placeholder="English"
                      onChange={(e) => {
                        const newLangs = [...languages];
                        newLangs[idx].name = e.target.value;
                        setLanguages(newLangs);
                      }}
                      className="flex-1 bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20"
                    />
                    <select
                      value={lang.proficiency}
                      onChange={(e) => {
                        const newLangs = [...languages];
                        newLangs[idx].proficiency = e.target.value;
                        setLanguages(newLangs);
                      }}
                      className="flex-1 bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20 [&>option]:bg-[#0d091a] [&>option]:text-white"
                    >
                      <option value="Native / Bilingual">Native / Bilingual</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Full Professional Proficiency">Full Professional Proficiency</option>
                      <option value="Professional Working Proficiency">Professional Working Proficiency</option>
                      <option value="Limited Working Proficiency">Limited Working Proficiency</option>
                      <option value="Intermediate Level">Intermediate Level</option>
                      <option value="Elementary">Elementary</option>
                      <option value="Basic">Basic</option>
                    </select>
                    <button
                      onClick={() => handleRemoveLanguage(idx)}
                      className="text-zinc-500 hover:text-rose-400 text-[10px] px-1.5"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications section */}
            <div className="space-y-4 pt-3 border-t border-white/5 relative z-10">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Certifications</label>
                <button
                  onClick={handleAddCertification}
                  className="text-[9px] px-2.5 py-1.5 bg-blue-500/15 border border-blue-500/30 text-blue-400 font-bold uppercase rounded-lg hover:bg-blue-500/25 transition-all"
                >
                  ➕ Add Cert
                </button>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-3 relative">
                    <button
                      onClick={() => handleRemoveCertification(idx)}
                      className="absolute top-2 right-2 text-zinc-500 hover:text-rose-400 text-xs transition-colors p-1"
                      title="Delete certification"
                    >
                      ✕
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2 pr-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-zinc-500">Name</label>
                        <input
                          type="text"
                          value={cert.name}
                          placeholder="AWS Certified Solutions Architect"
                          onChange={(e) => {
                            const newCerts = [...certifications];
                            newCerts[idx].name = e.target.value;
                            setCertifications(newCerts);
                          }}
                          className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-zinc-500">Issuer</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          placeholder="Amazon Web Services"
                          onChange={(e) => {
                            const newCerts = [...certifications];
                            newCerts[idx].issuer = e.target.value;
                            setCertifications(newCerts);
                          }}
                          className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-zinc-500">Date</label>
                        <input
                          type="text"
                          value={cert.date}
                          placeholder="2023"
                          onChange={(e) => {
                            const newCerts = [...certifications];
                            newCerts[idx].date = e.target.value;
                            setCertifications(newCerts);
                          }}
                          className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase text-zinc-500">Link (Optional)</label>
                        <input
                          type="text"
                          value={cert.link || ''}
                          placeholder="https://credential.net/..."
                          onChange={(e) => {
                            const newCerts = [...certifications];
                            newCerts[idx].link = e.target.value;
                            setCertifications(newCerts);
                          }}
                          className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-purple-500/20"
                        />
                      </div>
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

              <button
                onClick={() => handlePrint()}
                className="px-3.5 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/35 hover:to-cyan-500/35 text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-500/35 text-white transition-all duration-300"
              >
                <span>🖨️ Print PDF</span>
              </button>

              <button
                onClick={() => exportToDocx({ name, title, email, summary, experiences, education, hardSkills, softSkills, languages, certifications })}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/35 hover:to-teal-500/35 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/35 text-white transition-all duration-300"
              >
                <span>📝 Word DOCX</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/35 hover:to-pink-500/35 text-[9px] font-black uppercase tracking-widest rounded-lg border border-purple-500/35 text-white transition-all duration-300"
              >
                <span>{isCopied ? 'Copied ✅' : activeTab === 'resume' ? 'Copy JSON Data' : 'Copy Text'}</span>
              </button>
            </div>
          </div>

          {/* Print page layout styles */}
          <style>{`
            @media print {
              @page { margin: 20mm 18mm; size: A4; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
              /* Hide everything except the CV document */
              body > * { display: none !important; }
              [data-print-cv] { display: block !important; }
            }
          `}</style>

          {/* Dynamic document sheets wrapper */}
          <div ref={componentRef} data-print-cv className="print:w-full print:m-0 print:p-0 print:shadow-none print:border-0 print:rounded-none print:overflow-visible p-10 rounded-xl border shadow-xl bg-white text-zinc-950 font-sans min-h-[600px] overflow-hidden">
            {activeTab === 'resume' ? (
              <div className="space-y-6 relative z-10">
                {/* Header branding */}
                <div className="border-b-2 border-zinc-950 pb-5">
                  <div className="flex justify-between items-start gap-4">
                    {/* Left: Name + Title */}
                    <div>
                      <h2 className="text-3xl font-black tracking-tight text-zinc-950">{name || 'John Doe'}</h2>
                      <p className="text-sm font-bold text-zinc-700 mt-1">{title || 'Engineer Track'}</p>
                    </div>
                    {/* Right: Contact details stacked */}
                    <div className="flex flex-col items-end gap-0.5 text-xs text-zinc-600 font-medium shrink-0">
                      {email && <span>{email}</span>}
                      {phone && <span>{phone}</span>}
                      {location && <span>{location}</span>}
                      {linkedin && <span>{linkedin}</span>}
                      {portfolio && <span>{portfolio}</span>}
                    </div>
                  </div>
                </div>

                {/* Summary details */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-950">Professional Summary</h4>
                  <p className="text-sm leading-relaxed text-zinc-800">{summary || 'Enter summary details...'}</p>
                </div>

                {/* Experience details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest border-t border-zinc-200 pt-4 text-zinc-950">Professional Experience</h4>
                  
                  {experiences.length === 0 ? (
                    <p className="text-sm text-zinc-500 italic">No experiences added. Use the left panel to configure work blocks.</p>
                  ) : (
                    <div className="space-y-5">
                      {experiences.map((exp, i) => (
                        <div key={i} className="space-y-1 relative print:break-inside-avoid">
                          <div className="flex justify-between items-center flex-wrap gap-1.5">
                            <h5 className="text-sm font-black text-zinc-950">{exp.company || 'Company Name'}</h5>
                            <span className="text-xs text-zinc-600 font-semibold">{exp.period || 'Period'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-zinc-800 italic">{exp.role || 'Role Title'}</span>
                            {exp.type && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-zinc-700 font-bold uppercase">
                                {exp.type}
                              </span>
                            )}
                          </div>
                          <div className="text-sm leading-relaxed text-zinc-700 pt-1.5 space-y-1.5">
                            {exp.bullets ? exp.bullets.split('\n').map((bullet, bIdx) => {
                              const cleanBullet = bullet.trim().replace(/^[-*•]\s*/, '');
                              if (!cleanBullet) return null;
                              return (
                                <div key={bIdx} className="flex items-start">
                                  <span className="mr-2 text-zinc-950 font-bold">•</span>
                                  <span>{cleanBullet}</span>
                                </div>
                              );
                            }) : (
                              <p className="italic">Describe your daily workflow achievements...</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Education section */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest border-t border-zinc-200 pt-4 text-zinc-950">Education</h4>
                  
                  {education.length === 0 ? (
                    <p className="text-sm text-zinc-500 italic">No education added.</p>
                  ) : (
                    <div className="space-y-5">
                      {education.map((edu, i) => (
                        <div key={i} className="space-y-1 relative print:break-inside-avoid">
                          <div className="flex justify-between items-center flex-wrap gap-1.5">
                            <h5 className="text-sm font-black text-zinc-950">{edu.institution || 'Institution Name'}</h5>
                            <span className="text-xs text-zinc-600 font-semibold">{edu.period || 'Period'}</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold text-zinc-800 italic flex-wrap">
                            <span>{edu.degree || 'Degree Major'}</span>
                            <span className="text-zinc-600 font-medium not-italic">{edu.cityCountry}</span>
                          </div>
                          {edu.gpa && (
                            <div className="text-xs text-zinc-600 pt-0.5">
                              <strong className="text-zinc-800">GPA / Score:</strong> {edu.gpa}
                            </div>
                          )}
                          {edu.awards && (
                            <div className="text-xs text-zinc-600 pt-0.5">
                              <strong className="text-zinc-800">Award:</strong> {edu.awards}
                            </div>
                          )}
                          {edu.thesis && (
                            <div className="text-xs text-zinc-600 italic pt-0.5">
                              <strong className="text-zinc-800 not-italic">Thesis:</strong> {edu.thesis}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Skills section */}
                {(hardSkills || softSkills) && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest border-t border-zinc-200 pt-4 text-zinc-950">Skills Directory</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {hardSkills && (
                        <div className="space-y-1">
                          <div className="font-bold text-zinc-950">Technical Skills</div>
                          <div className="pt-1 text-zinc-800 leading-relaxed">
                            {hardSkills}
                          </div>
                        </div>
                      )}
                      
                      {softSkills && (
                        <div className="space-y-1">
                          <div className="font-bold text-zinc-950">Soft Skills</div>
                          <div className="pt-1 text-zinc-800 leading-relaxed">
                            {softSkills}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Languages section */}
                {languages.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest border-t border-zinc-200 pt-4 text-zinc-950">Languages</h4>
                    
                    <div className="flex flex-wrap gap-4">
                      {languages.map((lang, idx) => (
                        <div key={idx} className="text-sm font-semibold flex items-center space-x-1.5">
                          <span className="text-zinc-950">{lang.name || 'Language'}</span>
                          <span className="text-zinc-600 font-normal">({lang.proficiency})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications section */}
                {certifications.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest border-t border-zinc-200 pt-4 text-zinc-950">Certifications</h4>
                    
                    <div className="space-y-3">
                      {certifications.map((cert, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 print:break-inside-avoid">
                          <div className="space-y-0.5">
                            <h5 className="text-sm font-black text-zinc-950">
                              {cert.link ? (
                                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                                  {cert.name || 'Certification Name'}
                                </a>
                              ) : (
                                <span>{cert.name || 'Certification Name'}</span>
                              )}
                            </h5>
                            <div className="text-xs font-semibold text-zinc-600">
                              {cert.issuer || 'Issuing Organization'}
                            </div>
                          </div>
                          <span className="text-xs text-zinc-600 font-bold uppercase tracking-wider">
                            {cert.date || 'Date'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6 relative z-10">
                {/* Header branding for cover letter */}
                <div className="border-b-2 border-zinc-950 pb-5">
                  <div className="flex justify-between items-start gap-4">
                    {/* Left: Name + Title */}
                    <div>
                      <h2 className="text-3xl font-black tracking-tight text-zinc-950">{name}</h2>
                      <p className="text-sm font-bold text-zinc-700 mt-1">{title || 'Engineer Track'}</p>
                    </div>
                    {/* Right: Contact details stacked */}
                    <div className="flex flex-col items-end gap-0.5 text-xs text-zinc-600 font-medium shrink-0">
                      {email && <span>{email}</span>}
                      {phone && <span>{phone}</span>}
                      {location && <span>{location}</span>}
                      {linkedin && <span>{linkedin}</span>}
                      {portfolio && <span>{portfolio}</span>}
                    </div>
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-950 mt-3">Cover Letter for {targetCompany}</p>
                </div>

                {/* Cover letter content */}
                <div className="space-y-5 text-sm leading-relaxed text-zinc-800 whitespace-pre-line">
                  <p>Dear Hiring Team at {targetCompany},</p>
                  {coverLetter}
                  <p className="pt-4">Sincerely,</p>
                  <p className="font-bold text-zinc-950">{name}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
