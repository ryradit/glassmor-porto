'use client';

import { useEffect, useState } from 'react';
import SkillConstellation from './SkillConstellation';

const SkillsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [columns, setColumns] = useState(6);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    const element = document.getElementById('skills');
    if (element) {
      observer.observe(element);
    }

    // Dynamic columns listener for exactly 2-row limit
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setColumns(6);
      } else if (width >= 1024) {
        setColumns(4);
      } else if (width >= 640) {
        setColumns(3);
      } else {
        setColumns(2);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const skills = [
    // Programming Languages
    { name: 'Python', level: 95, icon: '🐍', category: 'languages' },
    { name: 'JavaScript', level: 92, icon: '💛', category: 'languages' },
    { name: 'TypeScript', level: 90, icon: '💙', category: 'languages' },
    { name: 'PHP', level: 85, icon: '🐘', category: 'languages' },
    { name: 'SQL', level: 88, icon: '🗄️', category: 'languages' },
    { name: 'HTML/CSS', level: 95, icon: '🌐', category: 'languages' },
    
    // AI & NLP Libraries
    { name: 'PyTorch', level: 90, icon: '🔥', category: 'ai' },
    { name: 'TensorFlow', level: 88, icon: '🧠', category: 'ai' },
    { name: 'scikit-learn', level: 92, icon: '🤖', category: 'ai' },
    { name: 'Transformers', level: 85, icon: '🤗', category: 'ai' },
    { name: 'spaCy', level: 82, icon: '🏷️', category: 'ai' },
    { name: 'NLTK', level: 80, icon: '📚', category: 'ai' },
    { name: 'OpenAI API', level: 88, icon: '🚀', category: 'ai' },
    { name: 'LangChain', level: 85, icon: '🦜', category: 'ai' },
    { name: 'NumPy', level: 95, icon: '🔢', category: 'ai' },
    { name: 'Pandas', level: 92, icon: '🐼', category: 'ai' },
    { name: 'Matplotlib', level: 88, icon: '📊', category: 'ai' },
    { name: 'Seaborn', level: 85, icon: '📈', category: 'ai' },
    
    // Web & Mobile Frameworks
    { name: 'React', level: 92, icon: '⚛️', category: 'web' },
    { name: 'Next.js', level: 90, icon: '▲', category: 'web' },
    { name: 'Node.js', level: 88, icon: '💚', category: 'web' },
    { name: 'Express', level: 85, icon: '🌐', category: 'web' },
    { name: 'React Native', level: 80, icon: '📱', category: 'web' },
    { name: 'Laravel', level: 82, icon: '🏗️', category: 'web' },
    { name: 'CodeIgniter', level: 78, icon: '🔥', category: 'web' },
    
    // Databases & Cloud
    { name: 'Supabase', level: 90, icon: '⚡', category: 'data' },
    { name: 'PostgreSQL', level: 88, icon: '🐘', category: 'data' },
    { name: 'MongoDB', level: 88, icon: '🍃', category: 'data' },
    { name: 'MySQL', level: 85, icon: '🐬', category: 'data' },
    { name: 'Google Cloud', level: 80, icon: '☁️', category: 'data' },
    { name: 'AWS', level: 75, icon: '🌩️', category: 'data' },
    
    // Tools & Others
    { name: 'Git', level: 92, icon: '📝', category: 'tools' },
    { name: 'Docker', level: 82, icon: '🐳', category: 'tools' },
    { name: 'Jupyter', level: 90, icon: '📓', category: 'tools' },
    { name: 'VS Code', level: 95, icon: '💻', category: 'tools' },
    { name: 'Postman', level: 88, icon: '📬', category: 'tools' },
    { name: 'Figma', level: 78, icon: '🎨', category: 'tools' }
  ];

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <SkillConstellation />
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-900/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent">
                Playground Skill Matrix
              </span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed">
              Real-time telemetry mapping my technical capabilities in artificial intelligence algorithms, mobile data models, and high-performance server structures.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-pink-500 mx-auto rounded-full mt-5 shadow-[0_0_10px_rgba(168,85,247,0.4)]"></div>
          </div>

          {/* Skills Grid with Glowing Power Level batteries */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
            {skills.map((skill, index) => {
              const isVisibleCard = isExpanded || index < (columns * 2);
              return (
                <div 
                  key={skill.name}
                  className={`glass-card p-5 border border-purple-500/10 text-center group hover:scale-[1.03] hover:border-purple-500/40 hover:bg-purple-950/20 transition-all duration-500 shadow-md shadow-purple-950/10 ${
                    isVisible && isVisibleCard
                      ? 'translate-y-0 opacity-100 scale-100' 
                      : 'absolute pointer-events-none opacity-0 scale-95 -translate-y-4'
                  }`}
                  style={{ 
                    position: isVisibleCard ? 'relative' : 'absolute',
                    transitionDelay: isVisibleCard ? `${(index % (columns * 2)) * 25}ms` : '0ms',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* 3D hover pop effect */}
                  <div className="text-4.5xl mb-3.5 transform group-hover:scale-110 transition-transform duration-300">
                    {skill.icon}
                  </div>
                  
                  <h3 className="text-white font-bold mb-3.5 text-xs md:text-sm tracking-wide group-hover:gradient-text transition-colors duration-300">
                    {skill.name}
                  </h3>
                  
                  {/* Glowing LED Charge Battery bar */}
                  <div className="space-y-2 font-mono">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-purple-400 font-bold group-hover:text-purple-300">{skill.level}%</span>
                      <span className="text-gray-600 text-[8px] uppercase tracking-wider group-hover:text-purple-500/50">charge</span>
                    </div>
                    <div className="w-full bg-purple-950/40 rounded-full h-2 border border-purple-500/10 p-[1px] shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-purple-500 via-purple-400 to-pink-500 h-[6px] rounded-full transition-all duration-[1200ms] ease-out shadow-[0_0_8px_rgba(168,85,247,0.45)] group-hover:shadow-[0_0_12px_rgba(236,72,153,0.7)]"
                        style={{ 
                          width: isVisible ? `${skill.level}%` : '0%',
                          transitionDelay: `${index * 25}ms`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show More / Show Less Button */}
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="relative group px-8 py-3.5 rounded-full overflow-hidden border border-purple-500/30 bg-purple-950/20 backdrop-blur-md text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:border-purple-400/60 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] flex items-center space-x-2.5 active:scale-95"
            >
              {/* Dynamic glowing background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <span className="relative z-10">{isExpanded ? 'Compress Skill Matrix' : 'Reveal Full Skill Matrix'}</span>
              
              <svg 
                className={`relative z-10 w-4 h-4 text-purple-400 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* R&D Information Panel */}
          <div className="mt-20 text-center">
            <div className="glass-card p-8 border border-purple-500/20 max-w-4xl mx-auto shadow-lg shadow-purple-500/5">
              <h3 className="text-xl md:text-2xl font-black text-white mb-4 tracking-wide">
                Experimental Playground Sandbox
              </h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed font-normal max-w-3xl mx-auto">
                I prioritize research inside my sandbox. Currently expanding my sandbox capabilities with state-of-the-art Generative AI agents, localized agricultural computer vision segmentations, and server-side Edge compute integrations.
              </p>
              <div className="flex justify-center mt-8 gap-2.5 flex-wrap">
                <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-xl text-xs font-semibold hover:border-purple-400/40 transition-colors">
                  🤖 Large Language Models
                </div>
                <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-xl text-xs font-semibold hover:border-purple-400/40 transition-colors">
                  🌾 Computer Vision
                </div>
                <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-xl text-xs font-semibold hover:border-purple-400/40 transition-colors">
                  🛠️ AI Agent MLOps
                </div>
                <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-xl text-xs font-semibold hover:border-purple-400/40 transition-colors">
                  ⚡ Edge Server compute
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
