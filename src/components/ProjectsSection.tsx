'use client';

import { useEffect, useState } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  tech: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  category: string;
}

const ProjectsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  // Static projects data
  const projects: Project[] = [
    {
      id: 1,
      title: 'Seido Mitra Abadi - Company Website',
      description: 'Developed a modern company website for Seido Mitra Abadi featuring professional design, responsive layout, and dynamic content management. Built with Next.js and TailwindCSS for optimal performance.',
      longDescription: 'A comprehensive corporate website featuring modern design principles, responsive layout, and efficient content management. The project showcases professional web development skills with emphasis on performance optimization and user experience.',
      tech: ['Next.js', 'React', 'TailwindCSS', 'TypeScript'],
      image: '/api/placeholder/400/250', // Using placeholder for now
      liveUrl: 'https://seidomitraabadi.vercel.app/',
      githubUrl: '#',
      category: 'Web Development'
    },
    {
      id: 2,
      title: 'Merra.ai - AI Interview Co-Pilot',
      description: 'Developed Merra AI as AI Software Engineer, an AI-powered co-pilot for interviewers that assists with question generation, real-time response analysis, and provides post-interview insights.',
      longDescription: 'An innovative AI-powered platform designed to revolutionize the interview process. Features include intelligent question generation, real-time candidate response analysis, and comprehensive post-interview insights to help make better hiring decisions.',
      tech: ['AI', 'SaaS', 'Next.js', 'Python', 'OpenAI'],
      image: '/api/placeholder/400/250', // Using placeholder for now
      liveUrl: 'https://www.trymerra.ai/',
      githubUrl: '#',
      category: 'AI/ML'
    },
    {
      id: 3,
      title: 'AI-Powered Barbershop Website',
      description: 'Developed an AI-enhanced website for \'King Barbershop\', featuring intelligent functionalities. Combines modern web development with AI capabilities for enhanced user experience.',
      longDescription: 'An innovative barbershop website that integrates AI technologies to provide enhanced customer experience. Features include intelligent booking system, personalized recommendations, and modern responsive design.',
      tech: ['AI', 'Web Development', 'Next.js', 'React', 'TypeScript'],
      image: '/api/placeholder/400/250', // Using placeholder for now
      liveUrl: 'https://king-barbershop.vercel.app/',
      githubUrl: 'https://github.com/ryradit/King-Barbershop',
      category: 'AI/ML'
    },
    {
      id: 4,
      title: 'LLM Research for Mental Health',
      description: 'Focused research on Indonesian Large Language Models (LLMs) for mental health applications, aiming to build empathetic and supportive conversational AI systems using NLP techniques.',
      longDescription: 'Groundbreaking research project focusing on developing Indonesian Large Language Models specifically for mental health applications. The project aims to create empathetic AI systems that can provide supportive conversations and mental health assistance in the Indonesian language.',
      tech: ['LLMs', 'NLP', 'Python', 'PyTorch', 'Transformers'],
      image: '/api/placeholder/400/250', // Using placeholder for now
      liveUrl: 'https://medium.com/@ryradit/idmentalbert-for-enhancing-conversational-intelligence-in-indonesian-e26862f260a2',
      githubUrl: '#',
      category: 'Research'
    },
    {
      id: 5,
      title: 'Sports Booking Apps Startup',
      description: 'Role: Android Developer. Developed an Android app to connect users with shared hobbies, featuring user profiles, event scheduling, and real-time notifications.',
      longDescription: 'A comprehensive mobile application designed to connect sports enthusiasts and facilitate sports booking. Features include user profile management, event scheduling, real-time notifications, and community building functionalities.',
      tech: ['Android Development', 'Mobile App', 'Java/Kotlin', 'Firebase'],
      image: '/api/placeholder/400/250', // Using placeholder for now
      liveUrl: '#',
      githubUrl: '#',
      category: 'Mobile Development'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('projects');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);



  const categories = ['All', 'AI/ML', 'Web Development', 'Mobile Development', 'Research'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Projects
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A showcase of my work, combining creative design with technical excellence.
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full mt-4"></div>
          </div>


          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-purple-600 text-white glow'
                    : 'glass text-gray-300 hover:text-white hover:bg-purple-600/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={`glass-card group cursor-pointer transition-all duration-500 hover:scale-105 overflow-hidden ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => setSelectedProject(project.id)}
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    {/* Category-based SVG Icons */}
                    <div className="w-full h-full flex items-center justify-center">
                      {project.category === 'Web Development' && (
                        <svg className="w-20 h-20 text-blue-300/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                      {project.category === 'AI/ML' && (
                        <svg className="w-20 h-20 text-purple-300/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )}
                      {project.category === 'Research' && (
                        <svg className="w-20 h-20 text-green-300/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      )}
                      {project.category === 'Mobile Development' && (
                        <svg className="w-20 h-20 text-pink-300/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Project Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                        {project.category}
                      </span>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-purple-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-2xl mb-2">👁️</div>
                        <span className="font-semibold">View Project</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:gradient-text transition-all duration-300 line-clamp-2">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tech.slice(0, 4).map((tech) => (
                      <span 
                        key={tech} 
                        className="px-2 py-1 bg-gray-800/50 text-purple-300 text-xs rounded border border-purple-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="px-2 py-1 bg-gray-800/50 text-gray-400 text-xs rounded">
                        +{project.tech.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <button 
                      className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (project.liveUrl && project.liveUrl !== '#') {
                          window.open(project.liveUrl, '_blank');
                        }
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span>Live</span>
                    </button>
                    
                    <button 
                      className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 transition-colors text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (project.githubUrl && project.githubUrl !== '#') {
                          window.open(project.githubUrl, '_blank');
                        }
                      }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span>Code</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Project Modal (simplified for demo) */}
          {selectedProject && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold gradient-text">
                      {projects.find(p => p.id === selectedProject)?.title}
                    </h3>
                    <button 
                      onClick={() => setSelectedProject(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {projects.find(p => p.id === selectedProject)?.longDescription}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {projects.find(p => p.id === selectedProject)?.tech.map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    <button className="glass px-6 py-3 text-white font-semibold hover:scale-105 transition-all duration-300">
                      Live Demo
                    </button>
                    <button className="glass px-6 py-3 text-white font-semibold hover:scale-105 transition-all duration-300">
                      View Code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
