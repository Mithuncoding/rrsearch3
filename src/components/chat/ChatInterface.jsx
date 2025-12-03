import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User as UserIcon, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { streamChatResponse } from '../../services/geminiApi';
import { toast } from '../ui/Toaster';
import { useAppStore } from '../../store/useAppStore';

/**
 * ROBUST CHAT INTERFACE
 * - Handles streaming responses
 * - Manages context strictly
 * - Auto-scrolls
 * - Error handling
 */
export default function ChatInterface({ paperContext, onClose }) {
  // Use global state for persistence if needed, or local for simplicity.
  // User asked to "build from start", so let's make it self-contained and robust.
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize chat with welcome message
  useEffect(() => {
    if (messages.length === 0 && paperContext) {
      resetChat();
    }
  }, [paperContext]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const resetChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm ready to discuss **"${paperContext?.title || 'this paper'}"**.\n\nI have read the summary, methodology, and key findings. Ask me anything!`
    }]);
  };

  const handleSend = async () => {
    const userInput = input.trim();
    if (!userInput || isLoading) return;

    // 1. Add User Message
    const userMsg = { id: Date.now(), role: 'user', content: userInput };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // 2. Prepare Context & System Prompt
    const systemPrompt = buildSystemPrompt(paperContext);
    
    // 3. Prepare API Messages (History + Current)
    // We limit history to last 10 messages to save tokens
    const history = messages
      .filter(m => m.id !== 'welcome' && !m.isError)
      .slice(-10)
      .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', content: m.content }));

    const apiMessages = [
      { role: 'user', content: systemPrompt },
      { role: 'model', content: 'I understand. I will answer questions based strictly on the provided paper context.' },
      ...history,
      { role: 'user', content: userInput }
    ];

    // 4. Create Placeholder for Assistant Response
    const assistantMsgId = Date.now() + 1;
    setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

    try {
      let fullResponse = '';
      
      await streamChatResponse(apiMessages, (chunk) => {
        fullResponse += chunk;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMsgId ? { ...msg, content: fullResponse } : msg
          )
        );
      });

    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMsgId 
            ? { ...msg, content: 'Sorry, I encountered an error connecting to the AI. Please try again.', isError: true } 
            : msg
        )
      );
      toast.error('Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-end sm:p-6 bg-black/20 backdrop-blur-sm">
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl h-[80vh] sm:h-[600px] bg-white sm:rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-prism-600 to-accent-purple flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Research Assistant</h3>
              <p className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">{paperContext?.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={resetChat}
              className="p-2 text-slate-400 hover:text-prism-600 hover:bg-prism-50 rounded-lg transition-colors"
              title="Clear Chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50 scroll-smooth">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-white text-prism-600 border border-prism-100'
                  : 'bg-prism-600 text-white'
              }`}>
                {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-prism-600 text-white rounded-tr-none'
                    : msg.isError
                    ? 'bg-red-50 text-red-800 border border-red-100 rounded-tl-none'
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap markdown-body">
                    {msg.content || <span className="animate-pulse">...</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2 items-end bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:border-prism-300 focus-within:ring-2 focus-within:ring-prism-100 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a question about the paper..."
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-sm max-h-32 py-2 px-2"
              rows={1}
              style={{ minHeight: '40px' }}
              disabled={isLoading}
            />
            <Button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()}
              size="sm"
              className={`mb-1 ${!input.trim() ? 'opacity-50' : ''}`}
            >
              {isLoading ? <Spinner size="sm" className="text-white" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-2">
            AI can make mistakes. Please verify important information from the paper.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper to build the strict system prompt
function buildSystemPrompt(paper) {
  if (!paper) return "You are a helpful assistant.";

  const contextParts = [
    `TITLE: ${paper.title}`,
    `SUMMARY: ${paper.summary}`,
    `METHODOLOGY: ${paper.methodology}`,
  ];

  if (paper.keyFindings && Array.isArray(paper.keyFindings)) {
    const findings = paper.keyFindings.map(f => typeof f === 'string' ? f : f.finding).join('\n- ');
    contextParts.push(`KEY FINDINGS:\n- ${findings}`);
  }

  if (paper.fullText) {
    // Truncate full text to ~10k chars to stay within context window safely while providing detail
    contextParts.push(`FULL TEXT EXCERPT:\n${paper.fullText.substring(0, 10000)}...`);
  }

  return `
You are an expert research assistant helping a user understand the academic paper titled "${paper.title}".

CONTEXT:
${contextParts.join('\n\n')}

INSTRUCTIONS:
1. Answer questions ONLY based on the provided context.
2. If the answer is not in the context, say "I cannot find that information in the paper."
3. Be concise, professional, and helpful.
4. Do not hallucinate facts not present in the paper.
5. You may use markdown for formatting (bold, lists, etc.).
`;
}
