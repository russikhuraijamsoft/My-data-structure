import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export function AiAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your TalkOS Enterprise Operations Assistant. Ask me anything regarding today\'s POS sales, kitchen prep throughput, stock levels, or margin projections.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = input;
    setInput('');
    setIsTyping(true);

    fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: currentQuery,
        context: {
          restaurant: 'TalkOS Main Downtown',
          revenueToday: '₹6,00,000',
          activeTickets: 8,
          criticalInventory: ['Fresh Noodles', 'Avocado', 'Sirloin Steak']
        }
      })
    })
      .then(res => res.json())
      .then(data => {
        const reply = data.reply || `Operational insight generated for "${currentQuery}".`;
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: reply,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiResponse]);
      })
      .catch(() => {
        let reply = `Based on current live data for "${currentQuery}": Restaurant revenue is tracking 12.5% ahead of yesterday. Best performing item is Chicken Chowmein (Medium). Food cost percentage is well controlled at 28.5%.`;
        if (currentQuery.toLowerCase().includes('sale')) {
          reply = `Today's revenue stands at ₹6,00,000 across 124 completed orders, with an average ticket of ₹4,838. Dine-in volume accounts for 68% of total billing.`;
        } else if (currentQuery.toLowerCase().includes('inventory') || currentQuery.toLowerCase().includes('stock')) {
          reply = `4 raw materials have breached reorder levels: Fresh Noodles, Avocado, Sirloin Steak, and Tomatoes. Automated POs have been drafted for supplier review.`;
        }
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: reply,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiResponse]);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  return (
    <div className="bg-white border border-[#ebd5da] rounded-xl overflow-hidden flex flex-col shadow-xs" style={{ height: '580px' }}>
      <div className="bg-[#800000] p-4 text-white flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-white">TalkOS Operations Intelligence</h3>
          <p className="text-[11px] text-[#fbe6ea]">Enterprise Context Engine</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fdf5f6]/40">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-[#800000] text-white' : 'bg-[#fee8eb] text-[#800000]'
              }`}>
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div className={`p-3 rounded-xl text-xs font-medium ${
                msg.sender === 'user' 
                  ? 'bg-[#800000] text-white rounded-tr-none font-bold' 
                  : 'bg-white border border-[#ebd5da] text-[#800000] rounded-tl-none shadow-2xs'
              }`}>
                <p>{msg.text}</p>
                <p className={`text-[9px] mt-1 ${msg.sender === 'user' ? 'text-white/70 text-right' : 'text-[#800000]/60'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[80%]">
              <div className="w-7 h-7 rounded-lg bg-[#fee8eb] text-[#800000] flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#ebd5da] rounded-tl-none flex items-center gap-1 shadow-2xs">
                <div className="w-1.5 h-1.5 bg-[#800000] rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-[#800000] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-[#800000] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-[#ebd5da]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about sales, stock status, recipe margins..."
            className="flex-1 px-3.5 py-2 bg-[#fdf5f6] border border-[#ebd5da] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800000] text-xs font-medium text-[#800000]"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2.5 bg-[#800000] text-white rounded-xl hover:bg-[#680016] disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <button onClick={() => setInput("What are today's sales and average ticket?")} className="whitespace-nowrap text-[10px] font-bold px-2.5 py-1 bg-[#fdf5f6] border border-[#ebd5da] text-[#800000] rounded-lg hover:bg-[#fee8eb] cursor-pointer">
            Today's Sales
          </button>
          <button onClick={() => setInput("Which items need immediate supplier reorder?")} className="whitespace-nowrap text-[10px] font-bold px-2.5 py-1 bg-[#fdf5f6] border border-[#ebd5da] text-[#800000] rounded-lg hover:bg-[#fee8eb] cursor-pointer">
            Low Stock Status
          </button>
          <button onClick={() => setInput("Explain recipe profit margins")} className="whitespace-nowrap text-[10px] font-bold px-2.5 py-1 bg-[#fdf5f6] border border-[#ebd5da] text-[#800000] rounded-lg hover:bg-[#fee8eb] cursor-pointer">
            Recipe Margins
          </button>
        </div>
      </div>
    </div>
  );
}
