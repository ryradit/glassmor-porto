'use client';

import { useEffect, useState } from 'react';

const SkillsSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('skills');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const skills = [
    // Programming Languages
    { name: 'Python', level: 95, icon: '🐍' },
    { name: 'JavaScript', level: 92, icon: '💛' },
    { name: 'TypeScript', level: 90, icon: '💙' },
    { name: 'PHP', level: 85, icon: '🐘' },
    { name: 'SQL', level: 88, icon: '🗄️' },
    { name: 'HTML/CSS', level: 95, icon: '🌐' },
    
    // AI & NLP Libraries
    { name: 'PyTorch', level: 90, icon: '🔥' },
    { name: 'TensorFlow', level: 88, icon: '🧠' },
    { name: 'scikit-learn', level: 92, icon: '🤖' },
    { name: 'Transformers', level: 85, icon: '🤗' },
    { name: 'spaCy', level: 82, icon: '�' },
    { name: 'NLTK', level: 80, icon: '📚' },
    { name: 'OpenAI API', level: 88, icon: '🚀' },
    { name: 'LangChain', level: 85, icon: '�' },
    { name: 'NumPy', level: 95, icon: '🔢' },
    { name: 'Pandas', level: 92, icon: '🐼' },
    { name: 'Matplotlib', level: 88, icon: '�' },
    { name: 'Seaborn', level: 85, icon: '�' },
    
    // Web & Mobile Frameworks
    { name: 'React', level: 92, icon: '⚛️' },
    { name: 'Next.js', level: 90, icon: '▲' },
    { name: 'Node.js', level: 88, icon: '💚' },
    { name: 'Express', level: 85, icon: '🌐' },
    { name: 'React Native', level: 80, icon: '📱' },
    { name: 'Laravel', level: 82, icon: '🏗️' },
    { name: 'CodeIgniter', level: 78, icon: '�' },
    
    // Databases & Cloud
    { name: 'PostgreSQL', level: 88, icon: '🐘' },
    { name: 'MySQL', level: 85, icon: '�️' },
    { name: 'Firebase', level: 88, icon: '🔥' },
    { name: 'Supabase', level: 85, icon: '⚡' },
    { name: 'Google Cloud', level: 80, icon: '☁️' },
    { name: 'AWS', level: 75, icon: '🌩️' },
    
    // Tools & Others
    { name: 'Git', level: 92, icon: '📝' },
    { name: 'Docker', level: 82, icon: '🐳' },
    { name: 'Jupyter', level: 90, icon: '📓' },
    { name: 'VS Code', level: 95, icon: '💻' },
    { name: 'Postman', level: 88, icon: '📬' },
    { name: 'Figma', level: 78, icon: '🎨' }
  ];

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              My Skills
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A comprehensive overview of my technical expertise and proficiency levels
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full mt-4"></div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {skills.map((skill, index) => (
              <div 
                key={skill.name}
                className={`glass-card p-6 text-center group hover:scale-105 transition-all duration-500 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {skill.icon}
                </div>
                
                <h3 className="text-white font-semibold mb-2 text-sm">
                  {skill.name}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-400 text-xs font-semibold">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-pink-400 h-1.5 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: isVisible ? `${skill.level}%` : '0%',
                        transitionDelay: `${index * 50}ms`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="glass-card p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Continuous Learning & Growth
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Passionate about staying at the forefront of AI and software development. Currently expanding 
                my expertise in Large Language Models, Computer Vision applications, and modern cloud architectures. 
                My experience spans from research-grade AI models to production-ready web applications.
              </p>
              <div className="flex justify-center mt-6 space-x-4 flex-wrap gap-y-2">
                <div className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-full text-sm">
                  Large Language Models
                </div>
                <div className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-full text-sm">
                  Computer Vision
                </div>
                <div className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-full text-sm">
                  MLOps
                </div>
                <div className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-full text-sm">
                  Cloud Architecture
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
