'use client';

import { useState, useRef, useEffect } from 'react';
import { chatWithGemini, getQuickResponses } from '../lib/gemini';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  hasDownloadButton?: boolean;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! 🌟 Welcome to Earth-X AI Playground. I'm Ryan's AI assistant. Beside being his professional portfolio, this website is Ryan's custom playground where he pours his active creativity into AI models, computer vision segmentation, and experimental sandboxes. How can I help you explore today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickResponses, setQuickResponses] = useState<string[]>([]);
  const [showQuickResponses, setShowQuickResponses] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load quick responses
    const loadQuickResponses = async () => {
      try {
        const responses = await getQuickResponses();
        setQuickResponses(responses);
      } catch (error) {
        console.error('Failed to load quick responses:', error);
      }
    };

    if (isOpen) {
      loadQuickResponses();
    }
  }, [isOpen]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: textToSend,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setShowQuickResponses(false);

    try {
      // Gather conversation history (excluding the very first static assistant greeting)
      const chatHistory = messages
        .filter(msg => msg.id !== 1)
        .map(msg => ({
          text: msg.text,
          isUser: msg.isUser
        }));

      const response = await chatWithGemini(textToSend, chatHistory);
      
      // Check if the response should include a CV download button
      const shouldIncludeCV = textToSend.toLowerCase().includes('cv') || 
                             textToSend.toLowerCase().includes('resume') ||
                             textToSend.toLowerCase().includes('download') ||
                             response.toLowerCase().includes('cv') ||
                             response.toLowerCase().includes('resume');
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        timestamp: new Date(),
        hasDownloadButton: shouldIncludeCV
      };

      setMessages(prev => [...prev, botMessage]);
    } catch {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting to my AI brain right now. Please try again in a moment, or feel free to contact Ryan directly at ryradit@gmail.com ✉️",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleQuickResponse = (response: string) => {
    handleSendMessage(response);
  };

  const handleDownloadCV = () => {
    window.open('https://drive.google.com/drive/folders/1TLOvtTZNk3MOc39ARQ9Ndg-wOP_MvPoy?usp=drive_link', '_blank', 'noopener,noreferrer');
    
    // Add a confirmation message
    const confirmMessage: Message = {
      id: Date.now(),
      text: "Opening Ryan's CV folder in a new tab! 📄✨",
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMessage]);
  };

  // Helper to format basic Markdown syntax returned by Gemini
  const formatMessageText = (text: string) => {
    // 1. Escape HTML to prevent injection
    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
      
    // 2. Bold syntax (**text**) to strong
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 3. Bullet points (* or -) to styled elements
    // Split by lines to parse lists and paragraphs correctly
    const lines = formatted.split('\n');
    let inList = false;
    const processedLines = lines.map(line => {
      const bulletMatch = line.match(/^\s*[\*\-]\s+(.*)$/);
      if (bulletMatch) {
        const content = bulletMatch[1];
        if (!inList) {
          inList = true;
          return `<ul class="list-disc pl-5 my-2 space-y-1">${`<li>${content}</li>`}`;
        }
        return `<li>${content}</li>`;
      } else {
        if (inList) {
          inList = false;
          return `</ul>${line}`;
        }
        return line;
      }
    });

    if (inList) {
      processedLines.push('</ul>');
    }
    
    formatted = processedLines.join('<br />');
    
    // 4. Clean double breaks and render
    formatted = formatted.replace(/<\/ul><br \/>/g, '</ul>');
    formatted = formatted.replace(/<br \/><ul/g, '<ul');
    
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] max-w-[calc(100vw-2rem)] glass-card rounded-3xl shadow-2xl z-40 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-gray-900 rounded-full"></span>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-wide">Ryan&apos;s AI Assistant</h3>
                <p className="text-purple-300 text-[10px] flex items-center tracking-wider uppercase font-semibold">
                  Online &amp; Active
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-in fade-in-50 duration-200`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    message.isUser
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-none shadow-md shadow-purple-500/10'
                      : 'bg-gray-800/40 text-gray-200 border border-purple-500/10 rounded-tl-none backdrop-blur-sm'
                  }`}
                >
                  <div className="prose-sm">
                    {formatMessageText(message.text)}
                  </div>
                  {message.hasDownloadButton && !message.isUser && (
                    <div className="mt-3 pt-2 border-t border-purple-500/20">
                      <button
                        onClick={handleDownloadCV}
                        className="flex items-center justify-center space-x-2 w-full px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-xs font-semibold shadow-md shadow-purple-500/20"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>Open Ryan&apos;s CV Folder</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Quick Responses */}
            {showQuickResponses && quickResponses.length > 0 && (
              <div className="space-y-2.5 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <p className="text-[11px] text-gray-400 text-center tracking-wider uppercase font-semibold">Suggested Questions</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickResponses.map((response, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickResponse(response)}
                      className="px-3 py-1.5 text-xs bg-purple-900/20 text-purple-300 rounded-full hover:bg-purple-600/30 transition-all duration-200 border border-purple-500/25 hover:border-purple-400/50 hover:scale-102"
                    >
                      {response}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800/40 border border-purple-500/10 px-4 py-3 rounded-2xl rounded-tl-none">
                  <div className="flex space-x-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-purple-500/20">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Ryan's skills, experience..."
                className="flex-1 px-4 py-2.5 bg-gray-900/60 border border-gray-700/60 focus:border-purple-500/80 rounded-xl text-white placeholder-gray-400 focus:outline-none text-sm transition-colors focus:ring-1 focus:ring-purple-500/50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-purple-500/15 active:scale-95"
              >
                <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button Container with perfect Group and Tooltip positioning */}
      <div className="fixed bottom-6 right-6 z-50 group">
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-16 bottom-4 bg-black/90 border border-purple-500/20 text-white px-3.5 py-1.5 rounded-xl text-xs font-medium tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-x-2 group-hover:translate-x-0 shadow-lg shadow-purple-500/5">
            Chat with AI Assistant
            <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-4 border-transparent border-l-black/90"></div>
          </div>
        )}

        {/* Breathing double pulse outer rings */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-20 duration-1000"></span>
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse opacity-30 blur-md"></span>
          </>
        )}

        {/* Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-xl shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-label="Open AI chat assistant"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {/* Notification dot */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full border-2 border-gray-900 flex items-center justify-center">
                <span className="text-[8px] text-white font-bold tracking-wider">AI</span>
              </div>
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default ChatBot;
