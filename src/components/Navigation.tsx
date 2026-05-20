'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const Navigation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isFeaturesDropdownOpen, setIsFeaturesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      if (pathname !== '/') return;
      const sections = ['home', 'about', 'skills', 'playground', 'projects', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.features-dropdown')) {
        setIsFeaturesDropdownOpen(false);
      }
      if (!target.closest('nav') && !target.closest('header')) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [pathname]);

  const scrollToSection = (sectionId: string) => {
    if (pathname !== '/') {
      router.push(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  const featuresItems = [
    {
      id: 'career-pathfinder',
      label: 'AI Multi-Agent Career Pathfinder',
      description: 'Orchestrate parallel AI agents to map your career destiny.',
      route: '/playground/career-pathfinder'
    },
    {
      id: 'ai-interview',
      label: 'AI-Powered Interview Practice',
      description: 'Practice mock technical interviews with an AI Tech Lead.',
      route: '/playground/ai-interview'
    },
    {
      id: 'cv-analyzer',
      label: 'AI-Powered CV Analyzer',
      description: 'Analyze and optimize your PDF resume against recruiter algorithms.',
      route: '/playground/cv-analyzer'
    },
    {
      id: 'cv-builder',
      label: 'AI-Powered CV Builder',
      description: 'Build professional, high-fidelity CV sheets in real-time.',
      route: '/playground/cv-builder'
    },
    {
      id: 'case-study',
      label: 'AI-Powered Live Case Study Practice',
      description: 'Audit strategy briefs using SWOT & MECE frameworks.',
      route: '/playground/case-study'
    }
  ];

  const navbarBrand = (
    <div className="flex flex-col items-start leading-none">
      <span className="text-xl font-black tracking-widest bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400 bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_10px_rgba(168,85,247,0.45)]">
        EARTH-X
      </span>
      <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-0.5 ml-0.5">
        by Ryan
      </span>
    </div>
  );

  const toggleFeaturesDropdown = () => {
    setIsFeaturesDropdownOpen(!isFeaturesDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      <div className="max-w-6xl mx-auto px-6 py-4">
        <nav className="glass-card px-6 py-4 border border-purple-500/10 flex items-center justify-between shadow-lg shadow-purple-950/5">
          {/* Logo / Brand */}
          <button onClick={() => scrollToSection('home')} className="flex items-center space-x-2 text-left focus:outline-none">
            {navbarBrand}
          </button>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-semibold tracking-wide uppercase transition-colors duration-300 hover:text-white focus:outline-none ${
                  pathname === '/' && activeSection === item.id ? 'text-purple-400 font-black' : 'text-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Features Dropdown Trigger */}
            <div className="relative features-dropdown">
              <button
                onClick={toggleFeaturesDropdown}
                className="flex items-center space-x-1.5 text-sm font-semibold tracking-wide uppercase text-gray-300 hover:text-white transition-colors duration-300 focus:outline-none"
              >
                <span>My Playground</span>
                <svg 
                  className={`w-4 h-4 text-purple-400 transition-transform duration-300 ${
                    isFeaturesDropdownOpen ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isFeaturesDropdownOpen && (
                <div className="absolute top-full mt-2 right-0 w-80 glass-card rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-3">
                    {featuresItems.map((feature) => (
                      <Link 
                        key={feature.id}
                        href={feature.route}
                        className="group p-3 rounded-xl transition-all duration-300 hover:bg-purple-600/20 cursor-pointer relative block text-left"
                        onClick={() => {
                          setIsFeaturesDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-white font-semibold text-sm group-hover:text-purple-400 transition-all duration-300">
                                {feature.label}
                              </h4>
                            </div>
                            <p className="text-gray-400 text-[10px] leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                          <div className="text-purple-400 ml-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-300 hover:text-white p-1 hover:bg-purple-600/10 rounded-lg transition-colors focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-card mt-2 rounded-2xl p-4 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold tracking-wide uppercase transition-all duration-300 focus:outline-none ${
                    pathname === '/' && activeSection === item.id 
                      ? 'text-purple-400 bg-purple-950/40 font-black' 
                      : 'text-gray-300 hover:text-white hover:bg-purple-600/20'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile Features Section */}
              <div className="pt-2">
                <div className="text-gray-400 text-sm font-semibold mb-2 px-4">My Playground</div>
                {featuresItems.map((feature) => (
                  <Link
                    key={feature.id}
                    href={feature.route}
                    className="w-full text-left px-4 py-2 rounded-lg transition-all duration-300 text-gray-400 hover:text-white hover:bg-purple-600/10 block"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs">{feature.label}</span>
                      <div className="text-purple-400 ml-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
