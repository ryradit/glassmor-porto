'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';
import ChatBot from '@/components/ChatBot';
import Footer from '@/components/Footer';

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPathfinder = pathname.startsWith('/playground/career-pathfinder');
  const isCvBuilderTool = pathname === '/playground/cv-builder/tool';
  const hideLayoutShell = isPathfinder || isCvBuilderTool;

  useEffect(() => {
    if (typeof window !== 'undefined' && pathname !== '/playground/career-pathfinder/chat') {
      sessionStorage.removeItem('pathfinder_messages');
      sessionStorage.removeItem('pathfinder_phase');
      sessionStorage.removeItem('pathfinder_reveal');
      sessionStorage.removeItem('pathfinder_started');
      sessionStorage.removeItem('pathfinder_roadmap');
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#03000a] text-white overflow-x-hidden relative">
      {/* Cosmic background flares */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.12),transparent_50%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(244,63,94,0.06),transparent_60%)] pointer-events-none z-0" />
      
      {/* Cybernetic grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 opacity-40" />

      {/* Shared Header Navigation */}
      {!hideLayoutShell && <Navigation />}

      {/* Page Content Grid Wrapper */}
      <main className={`relative z-10 ${hideLayoutShell ? 'pt-8' : 'pt-28'} pb-16 px-4 md:px-8 ${isCvBuilderTool ? 'max-w-[98%] w-full' : 'max-w-7xl mx-auto'}`}>
        {children}
      </main>

      {/* Shared Cybernetic Assistant */}
      {!hideLayoutShell && <ChatBot />}

      {/* Shared Footer */}
      {!hideLayoutShell && <Footer />}
    </div>
  );
}
