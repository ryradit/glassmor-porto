'use client';

import { useEffect, useState } from 'react';
import { calculateYearsOfExperience } from '../utils/experience';

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
      { threshold: 0.3 }
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
    <section id="about" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              About Me
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  AI & Software Engineer
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Software Engineer with a strong background in building smart and efficient digital solutions. 
                  Experienced in both frontend and backend development, I enjoy creating user-friendly applications 
                  and bringing AI technologies into real-world use. I&apos;ve worked on projects using popular tools 
                  like React and Node, and have applied AI to make software more powerful and responsive.
                </p>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  What I Do
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-semibold">AI/ML Engineering</h4>
                      <p className="text-gray-400 text-sm">Computer Vision, NLP, Deep Learning with PyTorch & TensorFlow</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-semibold">Full-Stack Development</h4>
                      <p className="text-gray-400 text-sm">React, Next.js, Node.js, and modern web technologies</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-semibold">Research & Development</h4>
                      <p className="text-gray-400 text-sm">Indonesian Language Models and AI system optimization</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats/Info Cards */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-6 text-center">
                  <div className="text-3xl font-bold gradient-text mb-2">{yearsOfExperience}+</div>
                  <div className="text-gray-300 text-sm">Years Experience</div>
                </div>
                <div className="glass-card p-6 text-center">
                  <div className="text-3xl font-bold gradient-text mb-2">10+</div>
                  <div className="text-gray-300 text-sm">AI/ML Projects</div>
                </div>
                <div className="glass-card p-6 text-center">
                  <div className="text-3xl font-bold gradient-text mb-2">15+</div>
                  <div className="text-gray-300 text-sm">Technologies</div>
                </div>
                <div className="glass-card p-6 text-center">
                  <div className="text-3xl font-bold gradient-text mb-2">M.Sc.</div>
                  <div className="text-gray-300 text-sm">Computer Science</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="glass-card p-6">
                <h4 className="text-xl font-bold text-white mb-4">Let&apos;s Connect</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <span className="text-gray-300">ryradit@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-300">Tangerang, Indonesia</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-gray-300 text-sm">linkedin.com/in/ryan-radityatama</span>
                  </div>
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
