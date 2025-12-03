import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, MessageSquare, Moon, Sun, Home, History, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { analysisHistory, setCurrentAnalysis, currentAnalysis, setIsChatOpen } = useAppStore();

  // Toggle with Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter actions and history based on query
  const actions = [
    { id: 'home', label: 'Go to Home', icon: <Home className="w-4 h-4" />, action: () => navigate('/') },
    { id: 'history', label: 'Go to History', icon: <History className="w-4 h-4" />, action: () => navigate('/history') },
    { id: 'chat', label: 'Ask AI Chat', icon: <MessageSquare className="w-4 h-4" />, action: () => { 
      if (currentAnalysis) {
        navigate('/analysis');
        setIsChatOpen(true);
      } else {
        // If no analysis, maybe go to home
        navigate('/');
      }
    } },
    // { id: 'theme', label: 'Toggle Dark Mode', icon: <Moon className="w-4 h-4" />, action: () => console.log('Dark mode toggle') },
  ];

  const filteredHistory = analysisHistory.filter(item => 
    (item.title || item.fileName).toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredActions = actions.filter(action => 
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  const allItems = [...filteredActions, ...filteredHistory];

  const handleSelect = (item) => {
    if (item.action) {
      item.action();
    } else {
      // It's a history item
      setCurrentAnalysis(item);
      navigate('/analysis');
    }
    setIsOpen(false);
    setQuery('');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % allItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + allItems.length) % allItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allItems[selectedIndex]) {
          handleSelect(allItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allItems]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden relative z-10 border border-slate-200"
        >
          <div className="flex items-center px-4 py-3 border-b border-slate-100">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input
              autoFocus
              type="text"
              placeholder="Type a command or search papers..."
              className="flex-1 outline-none text-lg text-slate-700 placeholder:text-slate-400"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
            />
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="px-2 py-1 bg-slate-100 rounded">Esc</span>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto py-2">
            {allItems.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-500">
                No results found.
              </div>
            ) : (
              <>
                {filteredActions.length > 0 && (
                  <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Actions
                  </div>
                )}
                {filteredActions.map((action, i) => (
                  <div
                    key={action.id}
                    onClick={() => handleSelect(action)}
                    className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${
                      i === selectedIndex ? 'bg-prism-50 text-prism-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${i === selectedIndex ? 'bg-prism-100' : 'bg-slate-100'}`}>
                      {action.icon}
                    </div>
                    <span className="font-medium">{action.label}</span>
                  </div>
                ))}

                {filteredHistory.length > 0 && (
                  <div className="px-4 py-2 mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Recent Papers
                  </div>
                )}
                {filteredHistory.map((item, i) => {
                  const globalIndex = filteredActions.length + i;
                  return (
                    <div
                      key={globalIndex}
                      onClick={() => handleSelect(item)}
                      className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${
                        globalIndex === selectedIndex ? 'bg-prism-50 text-prism-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${globalIndex === selectedIndex ? 'bg-prism-100' : 'bg-slate-100'}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.title || item.fileName}</p>
                        <p className="text-xs text-slate-500 truncate">{new Date(item.analyzedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
          
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            <div className="flex gap-4">
              <span><kbd className="font-sans bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">↑↓</kbd> to navigate</span>
              <span><kbd className="font-sans bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">↵</kbd> to select</span>
            </div>
            <span>PRISM Command Center</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
