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
      title: 'Seido Mitra Abadi - Corporate Hub',
      description: 'Designed and engineered a high-performance, responsive corporate platform featuring premium dark mode visuals and optimized component layouts. Built with Next.js for high SEO score and speed.',
      longDescription: 'A comprehensive corporate portal presenting modern dark-themed aesthetics, highly fluid responsive grids, and fast client-side rendering. Employs optimized asset pipelines, structured components, and next-generation Next.js server optimization strategies.',
      tech: ['Next.js', 'React', 'TailwindCSS', 'TypeScript'],
      image: '/seido.png',
      liveUrl: 'https://seidomitraabadi.vercel.app/',
      githubUrl: '#',
      category: 'Web Development'
    },
    {
      id: 2,
      title: 'Merra.ai - Conversational Interview Co-Pilot',
      description: 'Architected Merra.ai as AI Engineer—a comprehensive interview assistance framework equipped with resume token parses, conversational transcript reviews, and supportive question recommendations.',
      longDescription: 'An industry-leading AI recruitment ecosystem designed to accelerate and refine technical candidate screening. Features structured API endpoints connecting resume parsing tools, dynamic question generation pipelines, and prompt frameworks powered by modern generative language architectures.',
      tech: ['AI Agents', 'SaaS', 'Next.js', 'Python', 'OpenAI API', 'Supabase'],
      image: '/merra.png',
      liveUrl: 'https://www.trymerra.ai/',
      githubUrl: '#',
      category: 'AI/ML'
    },
    {
      id: 3,
      title: 'King Barbershop - Intelligent Booking System',
      description: 'Developed an AI-enhanced booking space for King Barbershop, integrating smart reservation queues, personalized grooming styling insights, and highly responsive page animations.',
      longDescription: 'A cutting-edge service portal linking traditional scheduling with intelligent algorithms. Employs user history records to generate customized styling suggestions, supports real-time appointment checks, and packages it in an interactive, fluid glassmorphic interface.',
      tech: ['AI Recs', 'Web Dev', 'Next.js', 'React', 'TypeScript', 'TailwindCSS'],
      image: '/kingbarber.png',
      liveUrl: 'https://king-barbershop.vercel.app/',
      githubUrl: 'https://github.com/ryradit/King-Barbershop',
      category: 'AI/ML'
    },
    {
      id: 4,
      title: 'Dlob Community - Interactive Digital Hub',
      description: 'Developed Dlob Community, a high-performance interactive portal and responsive hub tailored to coordinate events, foster user profiles, and manage group forums.',
      longDescription: 'An immersive digital community portal tailored for active user engagements. Integrates responsive navigation bars, dynamic profile settings, calendar-managed schedules, real-time message indicators, and full data integration with database pipelines.',
      tech: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Supabase'],
      image: '/dlob.png',
      liveUrl: 'https://www.dlobcommunity.com/',
      githubUrl: '#',
      category: 'Web Development'
    },
    {
      id: 5,
      title: 'Wonderful Indonesia - Cultural Exploration Portal',
      description: 'Designed and created an interactive showcase portal celebrating Indonesia\'s dynamic heritage, pristine travel coordinates, and localized cultural guides.',
      longDescription: 'A gorgeous travel destination showcase portal aimed at presenting Indonesia\'s rich cultural history, iconic tourist spots, and immersive travel itineraries. Developed using modern styling guidelines, fluid responsive cards, and clean transition mechanics.',
      tech: ['HTML5', 'CSS3', 'Vanilla JS', 'TailwindCSS', 'Responsive Design'],
      image: '/wonderfulindo.png',
      liveUrl: 'https://wonderfulindonesia.dreamhosters.com/',
      githubUrl: '#',
      category: 'Web Development'
    },
    {
      id: 6,
      title: 'Future XP - Immersive Next-Gen Platform',
      description: 'Engineered Future XP, a creative digital playground and high-tech interface constructed to present upcoming full-stack applications and experimental layout trials.',
      longDescription: 'A highly creative, experimental portal designed to test and demo future web applications. Features complex grid models, high-performance visual loaders, modern typography tokens, and highly smooth UI micro-animations.',
      tech: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
      image: '/futurexp.png',
      liveUrl: 'https://futurexp.dreamhoster.com/',
      githubUrl: '#',
      category: 'Web Development'
    },
    {
      id: 7,
      title: 'Indonesian LLM Fine-Tuning for Mental Health',
      description: 'Conducted advanced NLP research on local language models, developing mental health support networks capable of outputting empathetic and supportive context replies.',
      longDescription: 'A high-impact academic and technical research initiative exploring supervised fine-tuning of large language models for Bahasa Indonesia. Focused on constructing annotated training datasets, tokenizing clinical prompts, and fine-tuning model weight architectures to output safe, supportive conversational nodes.',
      tech: ['LLMs', 'NLP Research', 'Python', 'PyTorch', 'Hugging Face'],
      image: '/mentalhealth.png',
      liveUrl: 'https://medium.com/@ryradit/idmentalbert-for-enhancing-conversational-intelligence-in-indonesian-e26862f260a2',
      githubUrl: '#',
      category: 'Research'
    },
    {
      id: 8,
      title: 'Sports Booking Shared Community Network',
      description: 'Coordinated Android mobile development for a location-based startup app to bridge players, manage venue calendars, and execute real-time slot bookings.',
      longDescription: 'An agile, fully featured mobile startup application connecting local sports enthusiasts. Implemented structured user profile hubs, responsive search filters map views for sports venue lists, real-time push notification structures, and reliable data synchronization utilizing Supabase.',
      tech: ['Android SDK', 'Mobile', 'Kotlin', 'Supabase API'],
      image: '/sweat.png',
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
      { threshold: 0.15 }
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

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-950/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent">
                Sandbox Deployments
              </span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed">
              An interactive logs collection of my primary web sandboxes, neural experiments, and responsive codebase releases.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-pink-500 mx-auto rounded-full mt-5 shadow-[0_0_10px_rgba(168,85,247,0.4)]"></div>
          </div>

          {/* Futuristic Terminal Indexed Category Filter */}
          <div className="flex flex-wrap justify-center gap-3.5 mb-14 font-mono text-xs">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-3 rounded-xl border transition-all duration-300 flex items-center space-x-2 ${
                  activeCategory === category
                    ? 'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-500/25 glow'
                    : 'bg-purple-950/10 border-purple-500/10 text-gray-400 hover:text-white hover:border-purple-500/30'
                }`}
              >
                <span className="opacity-55">[0{index + 1}]</span>
                <span className="font-bold">{category}</span>
              </button>
            ))}
          </div>

          {/* Sandbox Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6.5">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={`glass-card p-0 flex flex-col justify-between border border-purple-500/15 overflow-hidden group cursor-pointer hover:scale-[1.03] hover:border-purple-500/40 shadow-lg shadow-purple-950/20`}
                style={{ transitionDelay: `${index * 50}ms` }}
                onClick={() => setSelectedProject(project.id)}
              >
                <div>
                  {/* High-tech Canvas Cover */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-900/35 to-pink-900/20 border-b border-purple-500/10">
                    {/* Project Image */}
                    {project.image && project.image.startsWith('/') ? (
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/35 to-pink-900/20">
                        <div className="transform group-hover:scale-108 transition-transform duration-500 z-10">
                          {project.category === 'Web Development' && (
                            <svg className="w-18 h-18 text-purple-400/50 group-hover:text-purple-300/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          )}
                          {project.category === 'AI/ML' && (
                            <svg className="w-18 h-18 text-purple-400/50 group-hover:text-purple-300/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          )}
                          {project.category === 'Research' && (
                            <svg className="w-18 h-18 text-purple-400/50 group-hover:text-purple-300/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          )}
                          {project.category === 'Mobile Development' && (
                            <svg className="w-18 h-18 text-purple-400/50 group-hover:text-purple-300/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-[radial-gradient(#8080800b_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none z-10"></div>
                    
                    {/* Shadow overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none z-10"></div>
                    
                    {/* Project Category Tag */}
                    <div className="absolute top-3 left-3 z-20">
                      <span className="px-3 py-1 bg-purple-950/60 border border-purple-500/25 backdrop-blur-md text-purple-200 text-[10px] font-mono font-bold rounded-lg uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>
                    
                    {/* Visual Hover Cover overlay */}
                    <div className="absolute inset-0 bg-purple-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs z-20">
                      <div className="text-center text-white scale-90 group-hover:scale-100 transition-transform duration-300 font-mono">
                        <div className="text-xl mb-1.5">⚡</div>
                        <span className="text-xs uppercase font-extrabold tracking-widest bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">Inspect Sandbox</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="text-base md:text-lg font-bold text-white mb-2.5 group-hover:gradient-text transition-all duration-300 line-clamp-1">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-400 text-xs md:text-sm mb-4 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Footer section: Tech & Action triggers */}
                <div className="px-6 pb-6 pt-0">
                  {/* Tech modules */}
                  <div className="flex flex-wrap gap-1.5 mb-5 font-mono text-[10px]">
                    {project.tech.slice(0, 3).map((tech) => (
                      <span 
                        key={tech} 
                        className="px-2 py-0.5 bg-purple-950/20 text-purple-300 rounded border border-purple-500/15"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="px-2 py-0.5 bg-purple-950/10 text-gray-500 rounded border border-purple-500/10 font-bold">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Fully functional action buttons */}
                  <div className="flex justify-between items-center text-xs font-semibold">
                    {project.liveUrl && project.liveUrl !== '#' ? (
                      <button 
                        className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.liveUrl, '_blank');
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>Live Demo</span>
                      </button>
                    ) : (
                      <span className="text-gray-600 flex items-center space-x-1 cursor-not-allowed">
                        <span>Offline</span>
                      </span>
                    )}
                    
                    {project.githubUrl && project.githubUrl !== '#' ? (
                      <button 
                        className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.githubUrl, '_blank');
                        }}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span>Codebase</span>
                      </button>
                    ) : (
                      <span className="text-gray-600 cursor-not-allowed">Private</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sandbox Inspect Modal */}
          {selectedProject && selectedProjectData && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
              onClick={() => setSelectedProject(null)}
            >
              <div 
                className="glass-card max-w-2xl w-full border border-purple-500/25 max-h-[85vh] overflow-y-auto shadow-2xl shadow-purple-500/10 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  {/* Modal Header */}
                  <div className="flex justify-between items-start mb-5 border-b border-purple-500/10 pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-[0.2em] mb-1 block">
                        ⚙️ Sandbox Inspect // ID-{selectedProjectData.id}
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-white">
                        {selectedProjectData.title}
                      </h3>
                    </div>
                    <button 
                      onClick={() => setSelectedProject(null)}
                      className="p-1 rounded-lg hover:bg-purple-500/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Long Description */}
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 font-normal">
                    {selectedProjectData.longDescription || selectedProjectData.description}
                  </p>

                  {/* Tech stack badges */}
                  <div className="mb-8">
                    <span className="text-[9px] font-mono text-gray-500 font-bold uppercase tracking-wider block mb-2">Deployed Modules</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProjectData.tech.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Wired up external triggers */}
                  <div className="flex space-x-3.5 border-t border-purple-500/10 pt-6">
                    {selectedProjectData.liveUrl && selectedProjectData.liveUrl !== '#' ? (
                      <a 
                        href={selectedProjectData.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:scale-105 active:scale-98 transition-all text-sm flex items-center space-x-2"
                      >
                        <span>Launch Sandbox</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <button 
                        disabled
                        className="px-6 py-3 bg-purple-900/10 border border-purple-500/10 text-gray-600 font-bold rounded-xl cursor-not-allowed text-sm"
                      >
                        Sandbox Offline
                      </button>
                    )}
                    
                    {selectedProjectData.githubUrl && selectedProjectData.githubUrl !== '#' ? (
                      <a 
                        href={selectedProjectData.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-6 py-3 bg-purple-950/20 border border-purple-500/25 hover:border-purple-400 text-purple-300 font-bold rounded-xl hover:bg-purple-950/40 hover:scale-105 active:scale-98 transition-all text-sm flex items-center space-x-2"
                      >
                        <span>Codebase Source</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </a>
                    ) : (
                      <button 
                        disabled
                        className="px-6 py-3 bg-purple-950/5 border border-purple-500/5 text-gray-600 font-semibold rounded-xl cursor-not-allowed text-sm"
                      >
                        Private Source
                      </button>
                    )}
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
