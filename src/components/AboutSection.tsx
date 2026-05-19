'use client';

import { useEffect, useState } from 'react';
import { calculateYearsOfExperience } from '../utils/experience';
import NeuralNetwork from './NeuralNetwork';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Calculate years of experience dynamically
  const yearsOfExperience = calculateYearsOfExperience();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById('about');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <NeuralNetwork />
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-6">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent">
                About The Creator
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-pink-500 mx-auto rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Biography & Capabilities */}
            <div className="lg:col-span-7 space-y-6">
              {/* Bio Card */}
              <div className="glass-card p-8 border border-purple-500/20 shadow-lg shadow-purple-500/5">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono text-sm font-bold">
                    [i]
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-wide">
                    Ryan Radityatama
                  </h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base font-normal">
                  I am an AI Engineer and Software Developer passionate about building intelligent systems and highly immersive web spaces. With a Master&apos;s degree in Computer Science from the <span className="text-purple-400 font-semibold">Beijing Institute of Technology</span>, my research explores fine-tuning Large Language Models (LLMs) for localized tasks. Earth-X serves as my sandbox—a portal to combine my engineering background with experimental AI structures.
                </p>
              </div>

              {/* What I Do - Advanced widgets */}
              <div className="glass-card p-8 border border-purple-500/20 shadow-lg shadow-purple-500/5">
                <h3 className="text-xl font-bold text-white mb-6 tracking-wide flex items-center space-x-2">
                  <span className="text-pink-500">⚡</span>
                  <span>Playground Domain Focus</span>
                </h3>
                <div className="grid gap-4">
                  <div className="p-4 rounded-xl bg-purple-950/15 border border-purple-500/10 hover:border-purple-500/35 transition-all duration-300 group">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">🧠</div>
                      <div>
                        <h4 className="text-white font-semibold text-sm md:text-base">Conversational & Generative AI</h4>
                        <p className="text-gray-400 text-xs md:text-sm mt-1">Prompt engineering, LLM fine-tuning, context retrieval, and cognitive memory assistants.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-950/15 border border-purple-500/10 hover:border-purple-500/35 transition-all duration-300 group">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">👁️</div>
                      <div>
                        <h4 className="text-white font-semibold text-sm md:text-base">Deep Learning & Computer Vision</h4>
                        <p className="text-gray-400 text-xs md:text-sm mt-1">Target detection, image segmentation (YOLO/PyTorch), and plantation aerial analysis pipelines.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-950/15 border border-purple-500/10 hover:border-purple-500/35 transition-all duration-300 group">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">🌐</div>
                      <div>
                        <h4 className="text-white font-semibold text-sm md:text-base">High-Performance Full-Stack Web</h4>
                        <p className="text-gray-400 text-xs md:text-sm mt-1">Responsive glassmorphism layout architecture, real-time database endpoints, and Server Actions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Stats & Connect Widgets */}
            <div className="lg:col-span-5 space-y-6">
              {/* Interactive Dashboard Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-6 border border-purple-500/20 flex flex-col justify-center items-center shadow-lg shadow-purple-500/5 group">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-1.5 group-hover:scale-105 transition-transform duration-300">
                    {yearsOfExperience}+
                  </div>
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider text-center">Years Experience</div>
                </div>
                <div className="glass-card p-6 border border-purple-500/20 flex flex-col justify-center items-center shadow-lg shadow-purple-500/5 group">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-1.5 group-hover:scale-105 transition-transform duration-300">
                    10+
                  </div>
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider text-center">AI/ML Projects</div>
                </div>
                <div className="glass-card p-6 border border-purple-500/20 flex flex-col justify-center items-center shadow-lg shadow-purple-500/5 group">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-1.5 group-hover:scale-105 transition-transform duration-300">
                    15+
                  </div>
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider text-center">Tech Stack items</div>
                </div>
                <div className="glass-card p-6 border border-purple-500/20 flex flex-col justify-center items-center shadow-lg shadow-purple-500/5 group">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-1.5 group-hover:scale-105 transition-transform duration-300">
                    M.Sc.
                  </div>
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider text-center">CS Thesis Fine-tuning</div>
                </div>
              </div>

              {/* Encrypted Let's Connect Module */}
              <div className="glass-card p-6 border border-purple-500/20 shadow-lg shadow-purple-500/5">
                <h4 className="text-lg font-bold text-white mb-5 tracking-wide flex items-center space-x-2">
                  <span>✉️</span>
                  <span>Encrypted Transmission</span>
                </h4>
                <div className="space-y-4">
                  <a href="mailto:ryradit@gmail.com" className="flex items-center space-x-3.5 p-3 rounded-xl hover:bg-purple-500/10 transition-colors border border-transparent hover:border-purple-500/20 group">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:text-purple-300 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-sm font-medium">ryradit@gmail.com</span>
                  </a>
                  
                  <div className="flex items-center space-x-3.5 p-3 rounded-xl bg-transparent border border-transparent">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-sm font-medium">Tangerang, Indonesia</span>
                  </div>

                  <a href="https://linkedin.com/in/ryan-radityatama" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3.5 p-3 rounded-xl hover:bg-purple-500/10 transition-colors border border-transparent hover:border-purple-500/20 group">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:text-purple-300 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <span className="text-gray-300 text-sm font-medium">linkedin.com/in/ryan-radityatama</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
