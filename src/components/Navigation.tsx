'use client';

import { useState, useEffect } from 'react';

const Navigation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isFeaturesDropdownOpen, setIsFeaturesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
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
      if (!target.closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
      id: 'ai-interview',
      label: 'AI-Powered Interview Practice',
      description: 'Practice interviews with AI feedback',
      comingSoon: true
    },
    {
      id: 'cv-analyzer',
      label: 'AI-Powered CV Analyzer',
      description: 'Analyze and improve your CV with AI',
      comingSoon: true
    },
    {
      id: 'cv-builder',
      label: 'AI-Powered CV Builder',
      description: 'Build professional CVs with AI assistance',
      comingSoon: true
    },
    {
      id: 'case-study',
      label: 'AI-Powered Live Case Study Practice',
      description: 'Practice case studies with real-time AI guidance',
      comingSoon: true
    }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 p-4 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="glass rounded-full px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold gradient-text">
              Ryan Radityatama
            </div>
            
            <div className="hidden md:flex space-x-8 items-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-purple-600 text-white glow'
                      : 'text-gray-300 hover:text-white hover:bg-purple-600/20'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Features Dropdown */}
              <div className="relative features-dropdown">
                <button
                  onClick={() => setIsFeaturesDropdownOpen(!isFeaturesDropdownOpen)}
                  className="flex items-center space-x-1 px-4 py-2 rounded-full transition-all duration-300 text-gray-300 hover:text-white hover:bg-purple-600/20"
                >
                  <span>Features</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${
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
                        <div 
                          key={feature.id}
                          className="group p-3 rounded-xl transition-all duration-300 hover:bg-purple-600/20 cursor-pointer relative"
                          onClick={() => {
                            // Handle feature click - could show modal or navigate
                            console.log(`Clicked on ${feature.label}`);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="text-white font-semibold text-sm group-hover:gradient-text transition-all duration-300">
                                  {feature.label}
                                </h4>
                                {feature.comingSoon && (
                                  <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
                                    Soon
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-400 text-xs leading-relaxed">
                                {feature.description}
                              </p>
                            </div>
                            <div className="text-purple-400 ml-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-purple-500/20">
                      <p className="text-center text-xs text-gray-400">
                        🚀 Exciting AI features coming soon! All are free!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                className="text-white p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg 
                  className={`w-6 h-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-purple-500/20">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      scrollToSection(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-purple-600/20'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                
                {/* Mobile Features Section */}
                <div className="pt-2">
                  <div className="text-gray-400 text-sm font-semibold mb-2 px-4">Features</div>
                  {featuresItems.map((feature) => (
                    <button
                      key={feature.id}
                      className="w-full text-left px-4 py-2 rounded-lg transition-all duration-300 text-gray-400 hover:text-white hover:bg-purple-600/10"
                      onClick={() => {
                        console.log(`Clicked on ${feature.label}`);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{feature.label}</span>
                        {feature.comingSoon && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
                            Soon
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
