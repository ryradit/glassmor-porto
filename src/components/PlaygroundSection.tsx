'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Card3DCanvas from './Card3DCanvas';

interface PlaygroundItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  route: string;
  color: string;
  emoji: string;
  comingSoon?: boolean;
}

const PLAYGROUNDS: PlaygroundItem[] = [
  {
    id: 'career-pathfinder',
    title: 'AI Multi-Agent Career Pathfinder',
    tag: 'Multi-Agent',
    description: 'Orchestrate four cooperating AI agents to scan your core drivers, log telemetry, and compile an interactive roadmap.',
    route: '/playground/career-pathfinder',
    color: 'from-purple-500 to-pink-500',
    emoji: '🧭',
    comingSoon: false
  },
  {
    id: 'ai-interview',
    title: 'AI Mock Interview Practice',
    tag: 'Interactive AI',
    description: 'Practice mock technical interviews with an AI Team Lead and receive detailed score audits and verbal critiques.',
    route: '/playground/ai-interview',
    color: 'from-pink-500 to-rose-400',
    emoji: '🎙️',
    comingSoon: true
  },
  {
    id: 'cv-analyzer',
    title: 'AI CV Diagnostic Analyzer',
    tag: 'CV Scanner',
    description: 'Laser-scan your PDF resume against recruiter algorithms to extract visual roadblocks and keyword relevancy metrics.',
    route: '/playground/cv-analyzer',
    color: 'from-rose-400 to-orange-400',
    emoji: '📄',
    comingSoon: true
  },
  {
    id: 'cv-builder',
    title: 'AI CV Template Builder',
    tag: 'Template Utility',
    description: 'Build premium resumes in real-time. Toggle glassmorphic templates and copy structured templates with one click.',
    route: '/playground/cv-builder',
    color: 'from-orange-400 to-amber-500',
    emoji: '✍️',
    comingSoon: false
  },
  {
    id: 'case-study',
    title: 'AI Consulting Case Arena',
    tag: 'Strategy Audit',
    description: 'Analyze consulting scenarios, organize your strategy using SWOT and MECE trees, and receive strategic score grading.',
    route: '/playground/case-study',
    color: 'from-green-400 to-teal-500',
    emoji: '💡',
    comingSoon: true
  }
];

const PlaygroundCard = ({ item }: { item: PlaygroundItem }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [transitionStyle, setTransitionStyle] = useState('transform 0.5s ease-out');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Relative coordinates [0, 1] inside card
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Convert to range [-0.5, 0.5]
    const relativeX = x - 0.5;
    const relativeY = y - 0.5;
    
    // Rotate values (max 15 degrees tilt)
    const rotateX = -relativeY * 12;
    const rotateY = relativeX * 12;
    
    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setTransitionStyle('transform 0.15s ease-out');
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setTransitionStyle('transform 0.5s ease-out');
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: transitionStyle,
        transformStyle: 'preserve-3d'
      }}
      className="glass-card rounded-3xl border border-white/5 p-6 flex flex-col justify-between hover:border-purple-500/20 shadow-2xl relative group cursor-pointer overflow-hidden"
    >
      {/* Dynamic 3D WebGL background shape */}
      <div className="w-36 h-36 absolute -top-3 -right-3 pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity duration-700 z-0">
        <Card3DCanvas id={item.id} />
      </div>

      {/* Top border glowing highlight on card hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="space-y-4 relative z-10 pointer-events-none">
        <div className="flex justify-between items-center">
          <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
            {item.emoji}
          </div>
          <div className="flex items-center space-x-1.5">
            {item.comingSoon && (
              <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black rounded-full uppercase tracking-wider">
                Soon
              </span>
            )}
            <span className="px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black rounded-full uppercase tracking-wider">
              {item.tag}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-black text-white group-hover:text-purple-400 transition-colors duration-300 leading-snug">
            {item.title}
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed font-medium">
            {item.description}
          </p>
        </div>
      </div>

      <div className="pt-6 relative z-10 mt-6 border-t border-white/5">
        <Link
          href={item.route}
          className={`w-full py-3 bg-gradient-to-r ${
            item.comingSoon 
              ? 'from-zinc-800 to-zinc-700 hover:from-zinc-750 hover:to-zinc-650' 
              : item.color
          } hover:opacity-90 text-white font-bold text-[10px] tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center space-x-1.5 shadow-lg`}
        >
          <span>{item.comingSoon ? 'Learn & Review Gate →' : 'Launch Playground Tool →'}</span>
        </Link>
      </div>
    </div>
  );
};

export default function PlaygroundSection() {
  return (
    <section id="playground" className="py-24 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-950/10 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-black tracking-widest bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent uppercase">
            Active Sandboxes
          </h2>
          <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Earth-X AI Playground
          </h3>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
            Step into Ryan&apos;s personal creative sandbox. Explore next-generation artificial intelligence modules, multi-agent orchestrations, and interactive recruitment sandboxes.
          </p>
        </div>

        {/* Playgrounds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PLAYGROUNDS.map((item) => (
            <PlaygroundCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
