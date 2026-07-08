import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User } from 'lucide-react';
import { AI_KNOWLEDGE_RULES } from '../data/apsrtcData';

export default function AIChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "wel",
      sender: "bot",
      text: "Namaste! I am the APSRTC AI Policy Assistant. Ask me anything about APSRTC fleet statistics, finances, passenger traffic, EV targets, or the Stree Shakti scheme!"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    const query = inputValue.toLowerCase();
    setInputValue("");

    // Simulate thinking delay
    setTimeout(() => {
      let botResponse = "I'm sorry, I couldn't find details on that specific topic. You can ask me about: 'EV fleet', 'revenues & profit', 'Stree Shakti travel', 'occupancy stats', or 'total buses categories'.";
      
      // Match query words to keyword rules
      for (const rule of AI_KNOWLEDGE_RULES) {
        const matches = rule.keywords.some(keyword => query.includes(keyword));
        if (matches) {
          botResponse = rule.response;
          break;
        }
      }

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botResponse
        }
      ]);
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <>
      {/* Floating Chat Badge */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50 flex items-center justify-center gap-2 group"
      >
        <Bot className="h-6 w-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap text-sm font-semibold tracking-wide">
          Ask APSRTC AI
        </span>
      </button>

      {/* Slide-out Chat Panel Container */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white dark:bg-[#0c0c0f] border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 flex flex-col justify-between animate-in slide-in-from-right duration-250 transition-colors">
          {/* Header */}
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/20">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-950 dark:text-zinc-50">
                  APSRTC AI Assistant
                </h4>
                <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online (Gemini Simulated)
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
            {messages.map(msg => {
              const isBot = msg.sender === 'bot';
              return (
                <div 
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  <div className={`p-2 rounded-lg text-xs shrink-0 ${
                    isBot 
                      ? 'bg-zinc-100 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-300' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                    isBot 
                      ? 'bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Panel */}
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about EV, fares, revenue, occupancy..."
                className="flex-1 text-xs bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
