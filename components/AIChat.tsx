
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { getCareerAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Halo! Saya **Aira**, asisten karir cerdas Anda. \n\nSaya bisa membantu Anda dengan:\n- Tips wawancara kerja\n- Negosiasi gaji\n- Review singkat profil LinkedIn\n- Strategi karir\n\nApa yang ingin Anda diskusikan hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getCareerAdvice(input);
      const aiMsg: ChatMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden my-4 flex flex-col" style={{ height: 'min(600px, 80vh)' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center shadow-md z-10">
        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <Bot className="w-6 h-6 text-white" />
        </div>
        <div className="ml-3 text-white">
            <h3 className="font-bold text-lg flex items-center gap-2">
              Aira - Konsultan Karir
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium text-white">AI</span>
            </h3>
            <p className="text-indigo-100 text-xs opacity-90">Online • Didukung Gemini 2.5 Flash</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 scroll-smooth">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}
            >
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-sm mt-1 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-purple-600'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
              </div>
              
              <div className="flex flex-col">
                <div
                  className={`p-4 rounded-2xl text-sm shadow-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'user' ? (
                     <div>{msg.text}</div>
                  ) : (
                    <ReactMarkdown 
                      className="prose prose-sm max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-p:my-1 prose-ul:my-1 prose-ul:pl-4"
                    >
                        {msg.text}
                    </ReactMarkdown>
                  )}
                </div>
                <span className={`text-[10px] text-gray-400 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.role === 'user' ? 'Anda' : 'Aira AI'}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start w-full animate-pulse">
             <div className="flex flex-row gap-3 max-w-[75%]">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center shadow-sm mt-1">
                   <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm">
                    <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Tanya saran karir..."
            className="flex-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent block w-full text-sm border-gray-300 rounded-full py-3 pl-5 pr-12 border bg-gray-50 focus:bg-white transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">AI dapat membuat kesalahan. Mohon verifikasi informasi penting.</p>
      </div>
    </div>
  );
};

export default AIChat;
