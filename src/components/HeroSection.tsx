'use client';

import { useEffect, useState } from 'react';
import { calculateYearsOfExperience } from '../utils/experience';
import CyberGlobe from './CyberGlobe';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Calculate years of experience dynamically
  const yearsOfExperience = calculateYearsOfExperience();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const roles = [
    'AI Engineer',
    'Creative Tech Explorer',
    'ML & NLP Specialist',
    'Full Stack Architect'
  ];
  
  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated futuristic background grid & gradient blurs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <CyberGlobe />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl floating"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl floating" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl floating" style={{ animationDelay: '-4s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          {/* Earth-X Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-950/30 border border-purple-500/30 backdrop-blur-md mb-8 animate-pulse shadow-lg shadow-purple-500/5 hover:scale-102 transition-transform cursor-default">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            <span className="text-xs text-purple-300 font-bold uppercase tracking-[0.2em]">
              ⚡ Earth-X // The AI Playground & Lab
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8.5xl font-black mb-1.5 tracking-tight leading-none">
            <span className="bg-gradient-to-r from-white via-purple-100 to-pink-200 bg-clip-text text-transparent">
              EARTH-X
            </span>
          </h1>
          <p className="text-xs md:text-sm font-mono text-purple-300/80 mb-6 tracking-[0.3em] uppercase font-bold">
            by Ryan Radityatama
          </p>
          
          <p className="text-sm md:text-base font-semibold text-purple-400 tracking-[0.3em] uppercase mb-8">
            Where AI Engineering Meets Creative Flow
          </p>

          {/* Dynamic Role / Typed effect widget */}
          <div className="text-xl md:text-2xl mb-8 text-gray-300 font-mono flex items-center justify-center space-x-2">
            <span className="text-purple-500 font-bold">&gt;_</span>
            <span className="inline-block transition-all duration-500 transform font-semibold text-transparent bg-gradient-to-r from-purple-200 to-pink-300 bg-clip-text">
              {roles[currentRole]}
            </span>
          </div>

          {/* Description framing the website as their AI Creative Playground */}
          <p className="text-base md:text-lg text-gray-400 mb-14 max-w-3xl mx-auto leading-relaxed font-normal">
            Welcome to <span className="text-white font-semibold">Earth-X</span>. 
            While my primary professional resume resides at <a href="https://ryradit.my.id" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 decoration-purple-500/50 hover:decoration-purple-400 transition-all">ryradit.my.id</a>, 
            this website is my experimental playground—a dedicated space for me to pour my creativity into smart NLP workflows, deep learning vision models, and intelligent AI-powered applications.
          </p>

          {/* CTA Buttons with sleek Glassmorphism and main domain redirection */}
          <div className="flex flex-col sm:flex-row gap-4.5 justify-center items-center">
            <button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-98 transition-all duration-300"
            >
              Explore Playground
            </button>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-purple-950/20 text-purple-300 font-bold rounded-2xl hover:bg-purple-950/40 transition-all duration-300 border border-purple-500/30 hover:border-purple-400/50 active:scale-98"
            >
              Get In Touch
            </button>
            <a 
              href="https://ryradit.my.id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 text-gray-300 font-semibold rounded-2xl hover:bg-white/10 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20 flex items-center justify-center space-x-2"
            >
              <span>Main Portfolio</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
