'use client';

import { useState, useEffect } from 'react';
import { analyzeCareerPath, CareerResult } from '@/lib/gemini';

interface Question {
  id: string;
  title: string;
  subtitle: string;
  options: { label: string; value: string; icon: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    title: 'Core Problem Style',
    subtitle: 'What style of challenges do you naturally enjoy solving the most?',
    options: [
      { label: 'Formulating Logical Code Rules', value: 'Logical Systems', icon: '🧠' },
      { label: 'Designing Sleek User Aesthetics', value: 'Aesthetic Designs', icon: '🎨' },
      { label: 'Decoding Client/Human Empathy', value: 'Human Empathy', icon: '🤝' },
      { label: 'Structuring Chaotic Relational Data', value: 'Chaotic Data Sorting', icon: '🗄️' }
    ]
  },
  {
    id: 'q2',
    title: 'Energy Driver',
    subtitle: 'What specific task gives you the biggest feeling of accomplishment?',
    options: [
      { label: 'Building a Brand New Feature', value: 'Building new MVP features', icon: '⚡' },
      { label: 'Debugging an Elusive Complex Error', value: 'Troubleshooting complex bugs', icon: '🕵️' },
      { label: 'Creating High-Volume Data Pipelines', value: 'Deep data analytics', icon: '📊' },
      { label: 'Consulting Directly on Client Success', value: 'Direct user consulting', icon: '👑' }
    ]
  },
  {
    id: 'q3',
    title: 'Work Cosmos',
    subtitle: 'In what ecosystem do you feel your creativity flows best?',
    options: [
      { label: 'Fast-Moving, High-Growth Startup', value: 'High-velocity start-up', icon: '🚀' },
      { label: 'Structured Global Tech Enterprise', value: 'Structured global enterprise', icon: '🏢' },
      { label: 'Specialized Research & Lab Sandbox', value: 'Specialized research lab', icon: '🧪' },
      { label: 'Independent Creator Workspace', value: 'Independent creator workspace', icon: '🏡' }
    ]
  },
  {
    id: 'q4',
    title: 'Current Career Obstacle',
    subtitle: 'What is currently holding you back from reaching your next level?',
    options: [
      { label: 'Feeling Stagnant in my Current Stack', value: 'Feeling stagnated in my stack', icon: '🛑' },
      { label: 'Not Knowing What Technology to Target Next', value: 'Not knowing what skills to target next', icon: '🧭' },
      { label: 'Unaware of Modern Digital Profiles', value: 'Unaware of existing modern career profiles', icon: '🔍' },
      { label: 'Struggling to Bridge AI into my Day-to-Day', value: 'Struggling to bridge AI into my workflow', icon: '🤖' }
    ]
  },
  {
    id: 'q5',
    title: 'Future Curiosity Focus',
    subtitle: 'If you had a free weekend, which topic would you actively learn?',
    options: [
      { label: 'Generative AI & Agent Workflows', value: 'Generative AI Agents', icon: '🧠' },
      { label: 'High-Fidelity Interaction UI/UX', value: 'High-fidelity UI aesthetics', icon: '✨' },
      { label: 'Developer Experience (DX) & Empathy', value: 'Human psychology & DX', icon: '🤝' },
      { label: 'Custom Scraping & API Mining Engine', value: 'Big data & scraping models', icon: '🗂️' }
    ]
  }
];

const AGENT_LOGS = [
  { text: '📡 [SYSTEM] Initiating multi-agent career telemetry...', delay: 0 },
  { text: '⚙️ [SYSTEM] Loading psychometric alignment model parameters...', delay: 600 },
  { text: '🧠 [AGENT 1: Psychometric Analyst] Scanning user preference signatures...', delay: 1300 },
  { text: '🧠 [AGENT 1] Formulating character aura... Mapping strengths & growth markers...', delay: 2000 },
  { text: '🌐 [AGENT 2: Market Trend Navigator] Cross-referencing persona with active digital indices...', delay: 2700 },
  { text: '🌐 [AGENT 2] Analyzing global developer hiring metrics... 2 target profiles matched.', delay: 3500 },
  { text: '🛠️ [AGENT 3: Roadmap Architect] Structuring dynamic 3-step practical growth timeline...', delay: 4200 },
  { text: '🛠️ [AGENT 3] Compiling tailored hard-skill matrices and weekly actionable tasks...', delay: 4900 },
  { text: '👑 [AGENT 4: Telemetry Orchestrator] Synchronizing multi-agent outputs...', delay: 5600 },
  { text: '👑 [AGENT 4] Finalizing strict JSON payload blueprint packaging... Done.', delay: 6300 },
  { text: '✅ [SYSTEM] Neural Career Diagnosis complete! Rendering visual telemetry dashboard...', delay: 7000 }
];

export default function CareerPathfinder() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isScanning, setIsScanning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [result, setResult] = useState<CareerResult | null>(null);

  const handleSelectOption = (value: string) => {
    const nextAnswers = { ...answers, [QUESTIONS[currentSlide].id]: value };
    setAnswers(nextAnswers);

    if (currentSlide < QUESTIONS.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      triggerScan(nextAnswers);
    }
  };

  const triggerScan = async (finalAnswers: Record<string, string>) => {
    setIsScanning(true);
    setTerminalLogs([]);

    // Stream logs for multi-agent console simulator
    AGENT_LOGS.forEach((log) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, log.text]);
      }, log.delay);
    });

    try {
      const apiResult = await analyzeCareerPath(finalAnswers);
      // Wait for agent simulation to finish before revealing the result dashboard
      setTimeout(() => {
        setResult(apiResult);
        setIsScanning(false);
      }, 7600);
    } catch (err) {
      console.error(err);
      setIsScanning(false);
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleReset = () => {
    setCurrentSlide(0);
    setAnswers({});
    setResult(null);
    setTerminalLogs([]);
    setIsScanning(false);
  };

  const getAuraColorClasses = (color: string) => {
    switch (color?.toLowerCase()) {
      case 'pink':
        return {
          text: 'text-pink-400',
          border: 'border-pink-500/20',
          borderHover: 'hover:border-pink-500/40',
          bg: 'bg-pink-500/10',
          gradient: 'from-pink-500 to-purple-500',
          shadow: 'shadow-pink-500/10'
        };
      case 'cyan':
        return {
          text: 'text-cyan-400',
          border: 'border-cyan-500/20',
          borderHover: 'hover:border-cyan-500/40',
          bg: 'bg-cyan-500/10',
          gradient: 'from-cyan-500 to-purple-500',
          shadow: 'shadow-cyan-500/10'
        };
      case 'green':
        return {
          text: 'text-green-400',
          border: 'border-green-500/20',
          borderHover: 'hover:border-green-500/40',
          bg: 'bg-green-500/10',
          gradient: 'from-green-500 to-purple-500',
          shadow: 'shadow-green-500/10'
        };
      case 'purple':
      default:
        return {
          text: 'text-purple-400',
          border: 'border-purple-500/20',
          borderHover: 'hover:border-purple-500/40',
          bg: 'bg-purple-500/10',
          gradient: 'from-purple-500 to-pink-500',
          shadow: 'shadow-purple-500/10'
        };
    }
  };

  const currentQuestion = QUESTIONS[currentSlide];
  const aura = result ? getAuraColorClasses(result.persona.auraColor) : getAuraColorClasses('purple');

  return (
    <section id="pathfinder" className="py-24 relative overflow-hidden">
      {/* Outer subtle glow */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-pink-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="px-3.5 py-1.5 bg-purple-500/10 border border-purple-500/25 rounded-full text-purple-300 text-xs font-bold uppercase tracking-widest shadow-inner shadow-purple-500/5">
            Playground AI Experiment
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4 mt-4">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent">
              AI Multi-Agent Pathfinder
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            Witness active multi-agent AI choreography. Scan your engineering profile drivers and receive a dynamically orchestrated career destiny diagnosis.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-pink-500 mx-auto rounded-full mt-5 shadow-[0_0_10px_rgba(168,85,247,0.4)]"></div>
        </div>

        {/* 1. QUIZ ACTIVE PANEL */}
        {!isScanning && !result && (
          <div className="glass-card p-8 md:p-10 border border-purple-500/10 rounded-3xl shadow-xl shadow-purple-950/5 relative overflow-hidden transition-all duration-300">
            {/* Grid layout decorations */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none"></div>

            {/* Slide Progress */}
            <div className="flex justify-between items-center mb-8">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
                Neural Scan Slide {currentSlide + 1} of {QUESTIONS.length}
              </span>
              <div className="flex space-x-1.5 p-1 bg-purple-950/20 border border-purple-500/5 rounded-full">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-3.5 h-1.5 rounded-full transition-all duration-300 ${
                      i <= currentSlide ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-purple-950/60'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Slide Headers */}
            <div className="mb-8">
              <h3 className="text-white text-xl md:text-2xl font-black tracking-wide mb-2.5">
                {currentQuestion.title}
              </h3>
              <p className="text-gray-400 text-xs md:text-sm">
                {currentQuestion.subtitle}
              </p>
            </div>

            {/* Slide Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelectOption(option.value)}
                  className="glass-card group p-5 border border-purple-500/10 rounded-2xl text-left flex items-start space-x-4 hover:border-purple-400/40 hover:bg-purple-950/20 hover:scale-[1.01] hover:shadow-lg hover:shadow-purple-950/20 transition-all duration-300"
                >
                  <span className="text-2.5xl p-2.5 bg-purple-950/40 border border-purple-500/10 rounded-xl group-hover:scale-105 transition-transform duration-300">
                    {option.icon}
                  </span>
                  <div className="pt-1.5">
                    <span className="text-white text-sm md:text-base font-bold tracking-wide group-hover:text-purple-300 transition-colors">
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom Controls */}
            {currentSlide > 0 && (
              <div className="flex justify-start mt-8">
                <button
                  onClick={handleBack}
                  className="px-5 py-2.5 bg-purple-950/20 hover:bg-purple-900/30 border border-purple-500/10 hover:border-purple-400/30 text-gray-300 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center space-x-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous Slide</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. SCANNING LOG TERMINAL SCREEN */}
        {isScanning && (
          <div className="glass-card p-8 border border-purple-500/20 rounded-3xl bg-black/40 shadow-2xl relative">
            {/* Pulsing cyber scan glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-pink-500/5 animate-pulse rounded-3xl pointer-events-none"></div>

            {/* Glowing top bars */}
            <div className="flex justify-between items-center pb-4 border-b border-purple-500/20 mb-5">
              <div className="flex space-x-2">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-purple-400 font-mono text-[10px] uppercase tracking-widest animate-pulse font-semibold">
                Agent-Orchestrator Logs
              </span>
            </div>

            {/* Terminal output viewport */}
            <div className="font-mono text-xs md:text-sm text-gray-300 space-y-3 min-h-[300px] max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
              {terminalLogs.map((log, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300 leading-relaxed">
                  {log}
                </div>
              ))}
              {/* Telemetry processing scanner line */}
              <div className="flex items-center space-x-2 text-purple-500/70 pt-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"></div>
                <span className="italic animate-pulse">Running telemetry diagnostics...</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. DIAGNOSTIC RESULTS REPORT */}
        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Persona Aura Block */}
            <div className={`glass-card p-8 border ${aura.border} rounded-3xl text-center relative overflow-hidden shadow-lg ${aura.shadow}`}>
              {/* Dynamic Aura background gradient flare */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-gradient-to-b ${aura.gradient} opacity-5 rounded-full blur-3xl pointer-events-none`}></div>

              <span className={`px-4 py-1.5 ${aura.bg} border ${aura.border} rounded-full ${aura.text} text-xs font-mono uppercase tracking-widest font-black`}>
                Diagnosed Character Aura
              </span>

              <h3 className="text-3xl md:text-4xl font-black text-white mt-5 mb-3 tracking-wide">
                {result.persona.title}
              </h3>

              <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-normal">
                {result.persona.description}
              </p>
            </div>

            {/* Recommended Career Profiles Grid */}
            <div>
              <h4 className="text-white text-lg font-black uppercase tracking-widest mb-5 flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></span>
                <span>Optimized Career Deployments</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {result.careers.map((career, i) => (
                  <div key={i} className="glass-card p-6 border border-purple-500/10 rounded-2xl relative group hover:border-purple-400/30 transition-all duration-300 flex flex-col justify-between">
                    <div>
                      {/* Matching Percentage Ring */}
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="text-white font-black text-sm md:text-base tracking-wide leading-snug pr-4">
                          {career.title}
                        </h5>
                        <span className="text-xs font-mono text-purple-400 font-black bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                          {career.matchPercentage}% match
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6">
                        {career.whyFit}
                      </p>
                    </div>

                    {/* Progress LED Battery indicator */}
                    <div className="w-full bg-purple-950/40 rounded-full h-2 p-[1px] border border-purple-500/10 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-purple-500 via-purple-400 to-pink-500 h-[6px] rounded-full shadow-[0_0_6px_rgba(168,85,247,0.5)] group-hover:shadow-[0_0_10px_rgba(236,72,153,0.7)] transition-all duration-[1000ms] ease-out"
                        style={{ width: `${career.matchPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Targeted Skills Index */}
            <div>
              <h4 className="text-white text-lg font-black uppercase tracking-widest mb-5 flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></span>
                <span>Neural Skills Calibration</span>
              </h4>

              <div className="glass-card p-6 border border-purple-500/10 rounded-2xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {result.skills.map((skill, i) => (
                    <div key={i} className="text-center p-3.5 bg-purple-950/20 border border-purple-500/5 rounded-xl">
                      <div className="text-purple-300 font-mono text-xs font-black mb-1.5">{skill.name}</div>
                      <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Priority level: {skill.level}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Roadmap Vertical Action Timeline */}
            <div>
              <h4 className="text-white text-lg font-black uppercase tracking-widest mb-6 flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></span>
                <span>Dynamic Skill-Build Roadmap</span>
              </h4>

              <div className="relative pl-6 md:pl-8 border-l border-purple-500/20 space-y-8 ml-3 md:ml-4">
                {result.roadmap.map((step) => (
                  <div key={step.step} className="relative group">
                    {/* Glowing outer point */}
                    <div className="absolute -left-[35px] md:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-black border border-purple-500/40 flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.15)] group-hover:border-purple-400 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-all duration-300">
                      <span className="text-[10px] font-mono font-bold text-purple-400">{step.step}</span>
                    </div>

                    <div className="glass-card p-6 border border-purple-500/10 rounded-2xl group-hover:border-purple-400/20 hover:bg-purple-950/10 transition-all duration-300">
                      <h5 className="text-white font-black text-sm md:text-base tracking-wide mb-1.5">
                        {step.title}
                      </h5>
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <div className="px-4 py-3 bg-purple-950/30 border border-purple-500/10 rounded-xl flex items-start space-x-3">
                        <span className="text-sm pt-0.5">🎯</span>
                        <div className="space-y-0.5">
                          <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-black">Weekly Action Item</div>
                          <div className="text-gray-300 text-xs leading-relaxed">{step.actionItem}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleReset}
                className="relative group px-8 py-3.5 rounded-full overflow-hidden border border-purple-500/30 bg-purple-950/20 backdrop-blur-md text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:border-purple-400/60 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] flex items-center space-x-2.5 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="w-4 h-4 text-purple-400 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
                </svg>
                <span>Recalibrate Core Diagnostics</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
