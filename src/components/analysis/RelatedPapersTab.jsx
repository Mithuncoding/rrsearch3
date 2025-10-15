import { useState, useEffect } from 'react';
import { ExternalLink, Search, BookOpen, Calendar, Users, TrendingUp, Target, Sparkles, RefreshCw, Bookmark, Copy, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Skeleton, SkeletonGroup } from '../ui/Skeleton';
import { findRelatedPapers } from '../../services/analysisService';

export default function RelatedPapersTab({ title, summary, methodology, keyFindings }) {
  const [searchQueries, setSearchQueries] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (title && summary) {
      loadQueries();
    }
  }, [title, summary]);

  const loadQueries = async () => {
    setIsLoading(true);
    try {
      const result = await findRelatedPapers(title, summary, methodology, keyFindings);
      setSearchQueries(result);
    } catch (error) {
      console.error('Error finding related papers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyQuery = (query, index) => {
    navigator.clipboard.writeText(query);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const searchUrl = (query) => `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;

  const categories = [
    { id: 'all', label: 'All Queries', icon: Sparkles },
    { id: 'similar', label: 'Similar Work', icon: BookOpen },
    { id: 'methodology', label: 'Methods', icon: Target },
    { id: 'evolution', label: 'Evolution', icon: TrendingUp },
    { id: 'contradictory', label: 'Contradictory', icon: RefreshCw }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-prism-600 to-accent-purple rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-2xl">
            <Search className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold gradient-text mb-2">Discovering Related Research</h2>
          <p className="text-slate-600">AI is analyzing your paper to find the most relevant research...</p>
        </div>
        <SkeletonGroup count={6} variant="card" />
      </div>
    );
  }

  const displayQueries = selectedCategory === 'all' 
    ? searchQueries?.queries || []
    : searchQueries?.categorizedQueries?.[selectedCategory] || [];

  return (
    <div className="space-y-6 fade-in-up">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-prism-600 to-accent-purple rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
          <Search className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold gradient-text mb-3">Discover Related Research</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          AI-powered search queries designed to help you explore the research landscape around your paper
        </p>
      </div>

      {/* Category Filters */}
      {searchQueries?.categorizedQueries && (
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === id
                  ? 'bg-gradient-to-r from-prism-600 to-accent-purple text-white shadow-lg scale-105'
                  : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-prism-300 hover:shadow-md'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {id !== 'all' && searchQueries.categorizedQueries[id] && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  selectedCategory === id ? 'bg-white/20' : 'bg-slate-100'
                }`}>
                  {searchQueries.categorizedQueries[id].length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Stats Section */}
      {searchQueries?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Queries</p>
                <p className="text-2xl font-bold text-blue-900">{searchQueries.stats.totalQueries}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Categories</p>
                <p className="text-2xl font-bold text-purple-900">{searchQueries.stats.categories}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Similar Work</p>
                <p className="text-2xl font-bold text-green-900">
                  {searchQueries.categorizedQueries?.similar?.length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border border-pink-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-pink-600 font-medium">Evolution</p>
                <p className="text-2xl font-bold text-pink-900">
                  {searchQueries.categorizedQueries?.evolution?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Queries Grid */}
      <div className="grid gap-4">
        {displayQueries.map((query, i) => {
          const queryText = typeof query === 'string' ? query : query.query;
          const queryCategory = typeof query === 'object' ? query.category : selectedCategory;
          const queryReason = typeof query === 'object' ? query.reason : null;

          return (
            <Card 
              key={i} 
              className="p-5 hover:shadow-2xl transition-all group border-2 border-slate-100 hover:border-prism-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-prism-600 to-accent-purple rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  {queryCategory && queryCategory !== 'all' && (
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-prism-100 to-purple-100 text-prism-700 text-xs font-semibold rounded-full mb-2">
                      {queryCategory.charAt(0).toUpperCase() + queryCategory.slice(1)}
                    </span>
                  )}
                  <p className="text-slate-800 font-medium mb-2 leading-relaxed group-hover:text-prism-700 transition-colors">
                    {queryText}
                  </p>
                  {queryReason && (
                    <p className="text-sm text-slate-600 mb-3 italic">
                      {queryReason}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => window.open(searchUrl(queryText), '_blank')}
                      className="bg-gradient-to-r from-prism-600 to-accent-purple hover:from-prism-700 hover:to-accent-purple text-white"
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Search on Google Scholar
                    </Button>
                    <Button
                      onClick={() => handleCopyQuery(queryText, i)}
                      variant="outline"
                      size="sm"
                    >
                      {copiedIndex === i ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Query
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-blue-800">
                Click any query to search directly on Google Scholar. Use the category filters to narrow down specific types of research.
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-purple-900 mb-2">🎯 Search Strategy</h3>
              <p className="text-sm text-purple-800">
                Start with "Similar Work" to find closely related papers, then explore "Evolution" for historical context and "Contradictory" for alternative views.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center mt-8">
        <Button
          onClick={loadQueries}
          variant="outline"
          className="border-2 hover:border-prism-400"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate New Queries
        </Button>
      </div>
    </div>
  );
}
