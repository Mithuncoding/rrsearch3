import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { streamChatResponse } from '../../services/geminiApi';
import { toast } from '../ui/Toaster';

/**
 * SIMPLE, WORKING AI Research Assistant Chat
 * No complex features - just reliable chat
 */
export default function ChatInterface({ paperContext, onClose }) {
  const [messages, setMessages] = useState([{
    id: 1,
    role: 'assistant',
    content: `Hi! I'm your AI assistant. I've analyzed the paper${paperContext?.title ? ` "${paperContext.title}"` : ''}. Ask me anything about it!`
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    const userInput = input.trim();
    if (!userInput || isLoading) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: userInput
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare context
    const context = [];
    if (paperContext?.title) context.push(`Title: ${paperContext.title}`);
    if (paperContext?.summary) context.push(`Summary: ${paperContext.summary}`);
    if (paperContext?.methodology) context.push(`Methodology: ${paperContext.methodology}`);
    if (paperContext?.keyFindings) {
      const findings = paperContext.keyFindings.slice(0, 5).map((f, i) => 
        `${i+1}. ${typeof f === 'string' ? f : f.finding}`
      ).join('\n');
      context.push(`Findings:\n${findings}`);
    }

    const systemMsg = `You are analyzing this paper. Answer questions about it only.\n\n${context.join('\n\n')}`;

    // Create API messages
    const apiMessages = [
      { role: 'user', content: systemMsg },
      { role: 'model', content: 'I understand. I will answer questions about this paper.' },
      { role: 'user', content: userInput }
    ];

    // Assistant message placeholder
    const assistantMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      content: ''
    };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      let fullResponse = '';
      await streamChatResponse(apiMessages, (chunk) => {
        fullResponse += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...assistantMsg, content: fullResponse };
          return updated;
        });
      });
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...assistantMsg,
          content: '❌ Sorry, I encountered an error. Please try again.',
          isError: true
        };
        return updated;
      });
      toast.error('Failed to get response');
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
    <div className="fixed inset-0 z-50 flex items-end justify-end p-6 bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-2xl h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-prism-600 to-accent-purple text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6" />
            <div>
              <h3 className="font-bold">AI Research Assistant</h3>
              <p className="text-xs text-white/80">Ask me about this paper</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-prism-600 to-accent-purple text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`flex-1 max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-prism-600 to-accent-purple text-white'
                    : msg.isError
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-white text-slate-800 border border-slate-200'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <Bot className="w-4 h-4 text-slate-700" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200">
                <Spinner size="sm" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 rounded-b-2xl">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about methods, findings, implications..."
              className="flex-1 px-4 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-prism-500 text-sm"
              disabled={isLoading}
              maxLength={500}
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
              {isLoading ? <Spinner size="sm" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
