'use client';

import { useEffect, useState } from 'react';
import { calculateYearsOfExperience } from '../utils/experience';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import PulsingWaves from './PulsingWaves';

const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Calculate years of experience dynamically
  const yearsOfExperience = calculateYearsOfExperience();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    const element = document.getElementById('contact');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('contact_submissions')
          .insert([
            {
              name: formData.name,
              email: formData.email,
              subject: formData.subject,
              message: formData.message,
              created_at: new Date().toISOString()
            }
          ]);

        if (error) {
          console.error('Supabase Error:', error);
          setSubmitStatus('error');
        } else {
          setSubmitStatus('success');
          setFormData({ name: '', email: '', subject: '', message: '' });
          setTimeout(() => setSubmitStatus('idle'), 6000);
        }
      } catch (err) {
        console.error('Database connection failed:', err);
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Simulate form submission fallback when Supabase is not configured
      console.warn('Supabase is not configured in .env.local. Simulating form submission.');
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Reset status after 7 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 7000);
      }, 1500);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
      ),
      title: 'Direct Link',
      value: 'ryradit@gmail.com',
      link: 'mailto:ryradit@gmail.com'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Location Coordinate',
      value: 'Tangerang, Indonesia',
      link: '#'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      title: 'GitHub Source',
      value: 'github.com/ryradit/',
      link: 'https://github.com/ryradit/'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      title: 'LinkedIn Network',
      value: 'linkedin.com/in/ryan-radityatama/',
      link: 'https://www.linkedin.com/in/ryan-radityatama/'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
        </svg>
      ),
      title: 'Primary Domain Portfolio',
      value: 'ryradit.my.id ↗',
      link: 'https://www.ryradit.my.id'
    }
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <PulsingWaves />
      {/* Decorative Blur Bubble */}
      <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-purple-900/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent">
                Establish Connection
              </span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed">
              Have an advanced AI prototype to explore or a software project that needs creative engineering? Let&apos;s deploy together.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-pink-500 mx-auto rounded-full mt-5 shadow-[0_0_10px_rgba(168,85,247,0.4)]"></div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Transmission channels */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Channels card */}
              <div className="glass-card p-8 border border-purple-500/20 shadow-lg shadow-purple-500/5">
                <h3 className="text-xl font-bold text-white mb-5 tracking-wide flex items-center space-x-2">
                  <span className="text-purple-400">📡</span>
                  <span>Transmission Channels</span>
                </h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed font-normal">
                  My primary technical records live on my main site, but I keep my transmission channels wide open for innovative creators, ML engineers, and full-stack builders.
                </p>

                <div className="space-y-4">
                  {contactInfo.map((info) => (
                    <div key={info.title} className="flex items-center space-x-3.5 p-3 rounded-xl hover:bg-purple-500/10 transition-colors border border-transparent hover:border-purple-500/10 group">
                      <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:text-purple-300 transition-colors">
                        {info.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block mb-0.5">{info.title}</span>
                        <a 
                          href={info.link} 
                          className="text-gray-300 hover:text-white transition-colors text-sm font-medium truncate block"
                          target={info.link.startsWith('http') ? '_blank' : undefined}
                          rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {info.value}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secure parameters card */}
              <div className="glass-card p-6.5 border border-purple-500/20 shadow-lg shadow-purple-500/5 font-mono text-[11px] leading-relaxed">
                <div className="flex items-center space-x-2 mb-3.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-white font-bold tracking-wider">CREATOR PARAMETERS</span>
                </div>
                <div className="space-y-2 text-gray-400">
                  <div className="flex justify-between border-b border-purple-500/5 pb-1">
                    <span>STATUS:</span>
                    <span className="text-emerald-400 font-bold">AVAILABLE</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-500/5 pb-1">
                    <span>CO-CREATE LEVEL:</span>
                    <span className="text-purple-300 font-bold">AI / EXPERIMENTAL</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-500/5 pb-1">
                    <span>ENGINE EXP:</span>
                    <span className="text-purple-300 font-bold">{yearsOfExperience}+ YEARS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RESPONSE RATE:</span>
                    <span className="text-purple-300 font-bold">&lt; 24 HOURS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Encrypted Message Portal */}
            <div className="lg:col-span-7">
              <div className="glass-card p-8 border border-purple-500/20 shadow-lg shadow-purple-500/5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white tracking-wide flex items-center space-x-2">
                    <span className="text-pink-500">🔒</span>
                    <span>Encrypted Message Portal</span>
                  </h3>
                  
                  {/* Database environment indicator */}
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-widest uppercase ${
                    isSupabaseConfigured 
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                      : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                  }`}>
                    {isSupabaseConfigured ? 'LIVE DATABASE' : 'DEMO SANDBOX'}
                  </span>
                </div>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-in fade-in duration-300">
                    <div className="text-emerald-400 flex items-start space-x-2.5 text-xs md:text-sm leading-relaxed">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>
                        {isSupabaseConfigured 
                          ? "Message transmitted! Your inquiry has been saved directly to the database. I'll get back to you soon."
                          : "Message simulated successfully! (Demo Sandbox Mode: Set up your Supabase keys in .env.local to enable live database storage.)"
                        }
                      </span>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl animate-in fade-in duration-300">
                    <div className="text-rose-400 flex items-start space-x-2.5 text-xs md:text-sm leading-relaxed">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>There was a routing problem submitting your message. Please verify connection parameters or contact creator directly.</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4.5">
                    <div>
                      <label className="block text-gray-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                        Name Identifier *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-purple-950/15 border border-purple-500/15 focus:border-purple-400 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-purple-400/30 text-sm"
                        placeholder="Your identifier"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                        Return Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-purple-950/15 border border-purple-500/15 focus:border-purple-400 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-purple-400/30 text-sm"
                        placeholder="your.email@address.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                      Transmission Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-purple-950/15 border border-purple-500/15 focus:border-purple-400 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-purple-400/30 text-sm"
                      placeholder="Transmission topic"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                      Payload Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3.5 bg-purple-950/15 border border-purple-500/15 focus:border-purple-400 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-purple-400/30 text-sm resize-none"
                      placeholder="Input message content..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 ${
                      isSubmitting
                        ? 'bg-purple-900/40 text-purple-400 cursor-not-allowed border border-purple-500/10'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-102 active:scale-98 shadow-lg shadow-purple-500/15 hover:shadow-purple-500/30 glow'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-xs font-mono uppercase tracking-widest">Transmitting Payload...</span>
                      </span>
                    ) : (
                      <span className="font-mono uppercase tracking-widest text-xs">Transmit Encrypted Message</span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
