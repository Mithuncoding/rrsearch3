import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Clock, FileText, Trash2, Search, Tag, Plus, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { formatDate } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { analysisHistory, setCurrentAnalysis, setUploadedFiles, updateAnalysis } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [editingTags, setEditingTags] = useState(null); // paperHash of item being edited
  const [newTagInput, setNewTagInput] = useState('');

  // Extract all unique tags
  const allTags = Array.from(new Set(
    analysisHistory.flatMap(item => item.tags || [])
  ));

  const filteredHistory = analysisHistory.filter(item => {
    const matchesSearch = (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.fileName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.summary || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? (item.tags || []).includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleViewAnalysis = (analysis) => {
    setCurrentAnalysis(analysis);
    const mockFile = {
      name: analysis.fileName,
      type: 'application/pdf',
      parsedData: {
        text: analysis.fullText || '',
        images: []
      }
    };
    setUploadedFiles([mockFile]);
    navigate('/analysis');
  };

  const handleAddTag = (paperHash) => {
    if (!newTagInput.trim()) return;
    const item = analysisHistory.find(h => h.paperHash === paperHash);
    if (item) {
      const currentTags = item.tags || [];
      if (!currentTags.includes(newTagInput.trim())) {
        updateAnalysis(paperHash, { tags: [...currentTags, newTagInput.trim()] });
      }
    }
    setNewTagInput('');
  };

  const removeTag = (paperHash, tagToRemove) => {
    const item = analysisHistory.find(h => h.paperHash === paperHash);
    if (item) {
      updateAnalysis(paperHash, { 
        tags: (item.tags || []).filter(t => t !== tagToRemove) 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold gradient-text mb-2">Smart Library</h1>
              <p className="text-slate-600">Manage and organize your research history</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search title, summary, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-prism-500 focus:ring-2 focus:ring-prism-200 outline-none transition-all"
              />
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  !selectedTag ? 'bg-prism-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag ? 'bg-prism-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {analysisHistory.length === 0 ? (
            <Card glass className="p-12 text-center">
              <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-600 mb-2">No History Yet</h3>
              <p className="text-slate-500 mb-6">Your analyzed papers will appear here</p>
              <Button onClick={() => navigate('/')}>Upload Your First Paper</Button>
            </Card>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredHistory.map((analysis, index) => (
                  <motion.div
                    key={analysis.paperHash || `history-item-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                  >
                    <Card glass className="p-6 hover:shadow-xl transition-all group relative overflow-visible">
                      <div className="flex items-start gap-4">
                        <div 
                          onClick={() => handleViewAnalysis(analysis)}
                          className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-prism-600 to-accent-purple rounded-2xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform"
                        >
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 
                              onClick={() => handleViewAnalysis(analysis)}
                              className="text-xl font-bold text-slate-800 mb-1 group-hover:text-prism-700 transition-colors cursor-pointer line-clamp-1"
                            >
                              {analysis.title || analysis.fileName}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                                <Clock className="w-3 h-3" />
                                {formatDate(analysis.analyzedAt)}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                            {analysis.summary || 'No summary available'}
                          </p>

                          {/* Tags Section */}
                          <div className="flex flex-wrap items-center gap-2">
                            {(analysis.tags || []).map(tag => (
                              <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-prism-50 text-prism-700 text-xs font-medium border border-prism-100">
                                #{tag}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); removeTag(analysis.paperHash, tag); }}
                                  className="hover:text-red-500"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                            
                            {editingTags === analysis.paperHash ? (
                              <div className="flex items-center gap-2">
                                <input
                                  autoFocus
                                  type="text"
                                  placeholder="New tag..."
                                  className="w-24 px-2 py-1 text-xs rounded border border-prism-200 focus:outline-none focus:border-prism-500"
                                  value={newTagInput}
                                  onChange={(e) => setNewTagInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddTag(analysis.paperHash);
                                      setEditingTags(null);
                                    } else if (e.key === 'Escape') {
                                      setEditingTags(null);
                                    }
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            ) : (
                              <button
                                onClick={(e) => { e.stopPropagation(); setEditingTags(analysis.paperHash); }}
                                className="px-2 py-1 rounded-md bg-slate-50 text-slate-500 text-xs hover:bg-slate-100 hover:text-prism-600 transition-colors flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" /> Add Tag
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredHistory.length === 0 && searchQuery && (
                <div className="text-center py-12 text-slate-500">
                  No papers found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
