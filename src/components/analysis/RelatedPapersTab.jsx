import { useState, useEffect } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { Card } from '../ui/Card';
import { Skeleton, SkeletonGroup } from '../ui/Skeleton';
import { findRelatedPapers } from '../../services/analysisService';

export default function RelatedPapersTab({ title, summary }) {
  const [queries, setQueries] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (title && summary) {
      loadQueries();
    }
  }, [title, summary]);

  const loadQueries = async () => {
    try {
      const result = await findRelatedPapers(title, summary);
      setQueries(result.queries);
    } catch (error) {
      console.error('Error finding related papers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonGroup count={5} variant="card" />
        <p className="text-center text-slate-600">Finding related papers...</p>
      </div>
    );
  }

  const searchUrl = (query) => `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;

  return (
    <div className="space-y-6 fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold gradient-text mb-2">Discover Related Research</h2>
        <p className="text-slate-600">
          AI-generated search queries to help you find relevant papers
        </p>
      </div>

      <div className="grid gap-4">
        {queries?.map((query, i) => (
          <Card 
            key={i} 
            className="p-5 hover:shadow-xl transition-all group cursor-pointer"
            onClick={() => window.open(searchUrl(query), '_blank')}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-prism-600 to-accent-purple rounded-xl flex items-center justify-center text-white shadow-lg">
                <Search className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-medium mb-2 group-hover:text-prism-700 transition-colors">
                  {query}
                </p>
                <div className="flex items-center gap-2 text-sm text-prism-600">
                  <span>Search on Google Scholar</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-sm text-slate-700">
          <strong>💡 Tip:</strong> Click any query to search directly on Google Scholar. 
          These queries are designed to find papers with similar topics, methods, or contradictory findings.
        </p>
      </div>
    </div>
  );
}
