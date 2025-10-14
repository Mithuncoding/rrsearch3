import { useState, useRef, useEffect } from 'react';
import { Send, X, Paperclip, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { streamChatResponse } from '../../services/geminiApi';

export default function ChatInterface({ paperContext, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm your AI research assistant. I have full context of the paper${paperContext?.title ? ` "${paperContext.title}"` : ''}. Feel free to ask me anything about it!`
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    // Prepare messages for API
    const apiMessages = [
      {
        role: 'user',
        content: `You are analyzing this research paper${paperContext?.title ? `: "${paperContext.title}"` : ''}. ${paperContext?.summary ? `Summary: ${paperContext.summary}. ` : ''}Answer questions based on this context.`
      },
      ...messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role,
        content: m.content
      })),
      {
        role: 'user',
        content: input
      }
    ];

    // Stream response
    let assistantMessage = {
      role: 'assistant',
      content: ''
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      await streamChatResponse(apiMessages, (chunk) => {
        assistantMessage.content += chunk;
        setMessages(prev => [
          ...prev.slice(0, -1),
          { ...assistantMessage }
        ]);
      });
    } catch (error) {
      console.error('Chat error:', error);
      assistantMessage.content = 'Sorry, I encountered an error. Please try again.';
      setMessages(prev => [
        ...prev.slice(0, -1),
        assistantMessage
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
      <div className="w-full max-w-2xl h-[600px] glass-card flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-lg gradient-text">AI Research Assistant</h3>
            <p className="text-xs text-slate-600">Ask me anything about this paper</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-custom">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-prism-600 to-accent-purple text-white'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                {message.figure && (
                  <div className="mb-2 p-2 bg-white/10 rounded-lg">
                    <p className="text-xs opacity-80 mb-1">Attached Figure:</p>
                    <img
                      src={message.figure.dataUrl}
                      alt="Attached figure"
                      className="w-full h-auto rounded max-h-32 object-contain"
                    />
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isStreaming && (
            <div className="flex justify-start">
              <div className="bg-slate-100 p-4 rounded-2xl">
                <Spinner size="sm" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about methodology, findings, or request explanations..."
              className="flex-1 px-4 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-prism-500 text-sm"
              disabled={isStreaming}
            />

            <Button onClick={handleSend} disabled={isStreaming || !input.trim()}>
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
