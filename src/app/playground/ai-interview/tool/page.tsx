'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Question {
  id: number;
  text: string;
}

interface BreakdownItem {
  name: string;
  score: number;
  feedback: string;
}

interface Evaluation {
  overallScore: number;
  auraColor: string;
  roleTitle: string;
  breakdown: BreakdownItem[];
  critique: string;
}

const QUESTIONS_BY_ROLE: Record<string, Question[]> = {
  frontend: [
    { id: 1, text: "How would you optimize load time and rendering speed in a Next.js application carrying large dynamic grids and glassmorphic graphics?" },
    { id: 2, text: "Explain the difference between Server Actions and standard API routes in Next.js App Router, and when you would choose one over the other." },
    { id: 3, text: "How do you handle micro-frontend state sync cleanly without polluting global namespace or causing infinite re-render loops?" }
  ],
  ml: [
    { id: 1, text: "Explain how you would handle severe class imbalance when training a neural network for satellite palm-tree object detection." },
    { id: 2, text: "What is your typical workflow for fine-tuning a small-parameter LLM (like Gemma-2b) for domain-specific tasks under low memory GPU constraints?" },
    { id: 3, text: "How do you avoid latency bottlenecks when deploying large vision transformers into a real-time responsive pipeline?" }
  ],
  fullstack: [
    { id: 1, text: "How would you design a highly secure, real-time database subscription sync cleanly using Appwrite and Next.js?" },
    { id: 2, text: "Explain how database indexing strategies change when scaling a transactional SaaS app from PostgreSQL to a distributed NoSQL clusters." },
    { id: 3, text: "How do you implement robust token bucket rate-limiting across distributed serverless edge functions without centralized database locks?" }
  ]
};

export default function AIInterviewPage() {
  const [role, setRole] = useState<'frontend' | 'ml' | 'fullstack'>('frontend');
  const [difficulty, setDifficulty] = useState<string>('senior');
  const [stage, setStage] = useState<'config' | 'interview' | 'results'>('config');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  const activeQuestions = QUESTIONS_BY_ROLE[role];

  const handleStart = () => {
    setStage('interview');
    setCurrentIdx(0);
    setAnswers([]);
    setCurrentAnswer('');
  };

  const handleNext = () => {
    if (!currentAnswer.trim()) return;
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentIdx + 1 < activeQuestions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsSubmitting(true);
      // Simulate AI Orchestration scan
      setTimeout(() => {
        setIsSubmitting(false);
        setStage('results');
        generateMockEvaluation(newAnswers);
      }, 2500);
    }
  };

  const generateMockEvaluation = (userAnswers: string[]) => {
    const scores = userAnswers.map(ans => {
      const wordCount = ans.split(' ').length;
      const indexKeywords = ans.toLowerCase();
      let keywordsMatched = 0;
      const checks = ['index', 'cache', 'lazy', 'optimize', 'scale', 'state', 'model', 'data', 'tuning', 'gpu'];
      checks.forEach(c => {
        if (indexKeywords.includes(c)) keywordsMatched++;
      });

      let score = 65 + Math.min(wordCount / 5, 20) + (keywordsMatched * 3);
      score = Math.min(Math.round(score), 98);
      return score;
    });

    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    setEvaluation({
      overallScore: averageScore,
      auraColor: averageScore > 85 ? 'purple' : 'cyan',
      roleTitle: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} ${role === 'frontend' ? 'Sleek UI Engineer' : role === 'ml' ? 'ML & Vision Architect' : 'Distributed Stack Dev'}`,
      breakdown: [
        { name: 'Technical Depth', score: averageScore + 1, feedback: 'Strong command of architectural concepts. Excellent references to optimization patterns.' },
        { name: 'Communication Clarity', score: averageScore - 2, feedback: 'Structured explanations. Good technical vocabulary and structured problem-framing.' },
        { name: 'Practical Problem Solving', score: averageScore + 3, feedback: 'Highly execution-oriented. Addresses real-world scaling hurdles cleanly.' }
      ],
      critique: 'You demonstrated an outstanding capacity to conceptualize high-scale setups. For future interviews, elevate your responses further by weaving in exact quantitative benchmarks (e.g. latency reductions, cache hit ratios) to solidify your architectural claims.'
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      {/* Header Back Button */}
      <div className="flex justify-between items-center">
        <Link href="/playground/ai-interview" className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center space-x-2">
          <span>← Go away from this playground</span>
        </Link>
        <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold rounded-full tracking-wide">
          Playground Module 01
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400 bg-clip-text text-transparent mb-3 tracking-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          AI Mock Interview Arena
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
          Enter a high-fidelity interactive sandbox. Stand before an AI Technical Lead to practice responding to critical architectural prompts.
        </p>
      </div>

      {stage === 'config' && (
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-purple-500/10 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 pointer-events-none" />
          
          <h2 className="text-xl md:text-2xl font-black tracking-wide mb-6 flex items-center space-x-3 text-white">
            <span className="p-2 bg-purple-600/20 text-purple-400 rounded-lg text-lg">⚙️</span>
            <span>Configure Your Simulation</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Target Role Select */}
            <div className="space-y-3">
              <label className="text-sm font-semibold tracking-wide uppercase text-gray-400">Target Career Track</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'frontend', title: 'Sleek Frontend Architect', desc: 'Next.js App Router, CSS Layouts, Performance' },
                  { id: 'ml', title: 'ML & Computer Vision', desc: 'PyTorch, Object Detection, Small LLMs' },
                  { id: 'fullstack', title: 'Full Stack & Cloud Systems', desc: 'Node.js, Scaling databases, Edge rates' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setRole(item.id as 'frontend' | 'ml' | 'fullstack')}
                    className={`p-4 rounded-xl text-left border transition-all duration-300 ${
                      role === item.id 
                        ? 'border-purple-500 bg-purple-600/10 shadow-lg shadow-purple-500/5' 
                        : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-sm font-bold text-white mb-0.5">{item.title}</div>
                    <div className="text-xs text-gray-400 leading-normal">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Track */}
            <div className="space-y-3">
              <label className="text-sm font-semibold tracking-wide uppercase text-gray-400">Experience Tier</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'junior', title: 'Junior Engineer', desc: 'Foundations, Syntax, and Core libraries' },
                  { id: 'senior', title: 'Senior Architect', desc: 'Scalability, Design Patterns, and Trade-offs' },
                  { id: 'techlead', title: 'Staff / Tech Lead', desc: 'System integrations, leadership, and product strategy' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setDifficulty(item.id)}
                    className={`p-4 rounded-xl text-left border transition-all duration-300 ${
                      difficulty === item.id 
                        ? 'border-purple-500 bg-purple-600/10 shadow-lg shadow-purple-500/5' 
                        : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-sm font-bold text-white mb-0.5">{item.title}</div>
                    <div className="text-xs text-gray-400 leading-normal">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-sm tracking-widest uppercase rounded-2xl transition-all duration-300 shadow-xl shadow-purple-950/20 transform hover:-translate-y-0.5"
          >
            Launch Interview Simulator Room
          </button>
        </div>
      )}

      {stage === 'interview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Virtual Video Terminal */}
          <div className="lg:col-span-1 glass-card p-6 rounded-3xl border border-purple-500/10 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-2xl h-80 lg:h-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative w-32 h-32 md:w-40 md:h-40 bg-purple-950/30 border border-purple-500/20 rounded-full flex items-center justify-center overflow-hidden mb-4 shadow-inner group">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent animate-pulse" />
              <div className="w-24 h-24 md:w-30 md:h-30 rounded-full bg-purple-600/10 border border-purple-400/30 flex items-center justify-center relative">
                <span className="text-3xl md:text-4xl animate-bounce">🤖</span>
                <div className="absolute inset-0 border border-dashed border-purple-400/20 rounded-full animate-spin duration-[15s]" />
              </div>
              <div className="absolute top-2 left-2 flex items-center space-x-1.5 bg-black/60 px-2 py-0.5 rounded-full border border-purple-500/20">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                <span className="text-[9px] text-rose-400 font-bold uppercase tracking-widest">Live Feed</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black tracking-wide text-white">Aura AI</h3>
              <p className="text-xs text-purple-400 font-bold uppercase tracking-widest">Senior Technical Lead</p>
              <p className="text-[10px] text-gray-500 font-medium px-4 pt-2">Simulating dynamic video processing feeds...</p>
            </div>

            <div className="flex justify-center space-x-1 mt-6 h-8 items-end">
              {[1.2, 2.5, 1.8, 3.2, 0.8, 2.2, 1.4, 2.8, 1.1, 2.4].map((delay, i) => (
                <div 
                  key={i} 
                  style={{ animationDelay: `${delay}s`, animationDuration: '1.2s' }}
                  className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse h-6"
                />
              ))}
            </div>
          </div>

          {/* Prompt / Input Console */}
          <div className="lg:col-span-2 glass-card p-6 md:p-8 rounded-3xl border border-purple-500/10 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute top-4 right-6 text-xs text-gray-500 font-bold uppercase tracking-widest">
              Round {currentIdx + 1} of {activeQuestions.length}
            </div>

            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black rounded-full uppercase tracking-wider">
                  Interviewer Question
                </span>
                <p className="text-lg md:text-xl font-bold text-white leading-relaxed pt-2">
                  &ldquo;{activeQuestions[currentIdx].text}&rdquo;
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold tracking-wide uppercase text-gray-400">Your Technical Response</label>
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Explain your approach clearly. Reference optimizations, state setups, or structural patterns that justify your architecture..."
                  className="w-full h-44 md:h-52 bg-[#090514]/60 border border-white/5 focus:border-purple-500/30 rounded-2xl p-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all duration-300 resize-none font-medium leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-6">
              <span className="text-xs text-gray-500 font-semibold font-mono">
                {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </span>
              
              <button
                onClick={handleNext}
                disabled={!currentAnswer.trim()}
                className={`px-8 py-3.5 bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                  !currentAnswer.trim() ? 'opacity-40 cursor-not-allowed' : 'shadow-lg shadow-purple-500/10'
                }`}
              >
                {currentIdx + 1 < activeQuestions.length ? (
                  <span>Submit Round {currentIdx + 1} →</span>
                ) : (
                  <span>Finish & Run Diagnostic →</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isSubmitting && (
        <div className="glass-card p-12 rounded-3xl border border-purple-500/10 text-center flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-r-pink-500 border-b-rose-400 border-l-transparent rounded-full animate-spin mb-6" />
          <h3 className="text-xl font-black text-white tracking-wide mb-2 animate-pulse">Running Diagnostic Scans...</h3>
          <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
            AI Telemetry Analysts are compiling scores, matching keywords, and drafting customized feedback vectors.
          </p>
        </div>
      )}

      {stage === 'results' && evaluation && (
        <div className="space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-purple-500/10 relative overflow-hidden shadow-2xl">
            <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full filter blur-[60px] opacity-20 bg-${evaluation.auraColor}-500`} />
            
            <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
              <div className="text-center md:text-left space-y-2">
                <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold rounded-full tracking-wide">
                  Simulation Finished
                </span>
                <h2 className="text-2xl md:text-3xl font-black tracking-wide text-white">Your Technical Diagnosis</h2>
                <p className="text-sm text-gray-400 font-medium">{evaluation.roleTitle}</p>
              </div>

              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" className="stroke-white/5 fill-none" strokeWidth="6" />
                  <circle 
                    cx="56" 
                    cy="56" 
                    r="48" 
                    className={`stroke-purple-500 fill-none transition-all duration-1000`} 
                    strokeWidth="6"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * evaluation.overallScore) / 100}
                  />
                </svg>
                <div className="absolute flex flex-col items-center leading-none">
                  <span className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{evaluation.overallScore}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Score</span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {evaluation.breakdown.map((item: BreakdownItem, idx: number) => (
              <div key={idx} className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between shadow-lg relative">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{item.name}</span>
                    <span className="text-sm font-black text-purple-400">{item.score}/100</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">&ldquo;{item.feedback}&rdquo;</p>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-6">
                  <div style={{ width: `${item.score}%` }} className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Qualitative Critique */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-purple-500/10 shadow-2xl relative">
            <h3 className="text-lg font-black tracking-wide mb-3 flex items-center space-x-2 text-white">
              <span>💡</span>
              <span>Direct AI Critique & Suggestions</span>
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              {evaluation.critique}
            </p>
          </div>

          <button
            onClick={() => setStage('config')}
            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm tracking-widest uppercase rounded-2xl transition-all duration-300"
          >
            Run Another Simulation
          </button>
        </div>
      )}
    </div>
  );
}
