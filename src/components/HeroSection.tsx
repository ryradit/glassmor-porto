'use client';

import { useEffect, useState } from 'react';
import { calculateYearsOfExperience } from '../utils/experience';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Calculate years of experience dynamically
  const yearsOfExperience = calculateYearsOfExperience();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const roles = ['AI Engineer', 'Software Engineer', 'ML Expert', 'Full Stack Developer'];
  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl floating"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl floating" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl floating" style={{ animationDelay: '-4s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
            Ryan Radityatama
          </h1>

          {/* Dynamic Role */}
          <div className="text-2xl md:text-3xl mb-6 text-gray-300 h-10">
            <span className="inline-block transition-all duration-500 transform">
              {roles[currentRole]}
            </span>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI & Software Engineer with {yearsOfExperience}+ years of experience in building intelligent systems and modern web applications. 
            Passionate about creating innovative solutions that bridge the gap between cutting-edge AI and real-world applications.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="glass-card px-8 py-4 text-white font-semibold glow hover:scale-105 transition-all duration-300"
            >
              View My Work
            </button>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="glass px-8 py-4 text-white font-semibold hover:scale-105 transition-all duration-300 border-purple-400"
            >
              Get In Touch
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
