import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Clock, FileText, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { formatDate } from '../utils/helpers';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { analysisHistory, setCurrentAnalysis } = useAppStore();

  const handleViewAnalysis = (analysis) => {
    setCurrentAnalysis(analysis);
    navigate('/analysis');
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

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold gradient-text mb-2">Analysis History</h1>
            <p className="text-slate-600">Your last 10 analyzed papers</p>
          </div>

          {analysisHistory.length === 0 ? (
            <Card glass className="p-12 text-center">
              <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-600 mb-2">No History Yet</h3>
              <p className="text-slate-500 mb-6">
                Your analyzed papers will appear here
              </p>
              <Button onClick={() => navigate('/')}>
                Upload Your First Paper
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {analysisHistory.map((analysis, i) => (
                <Card key={i} glass className="p-6 hover:shadow-2xl transition-all cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-prism-600 to-accent-purple rounded-xl flex items-center justify-center shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-prism-700 transition-colors line-clamp-2">
                        {analysis.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">
                        {analysis.fileName}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(analysis.analyzedAt)}
                        </span>
                        <span>
                          {analysis.takeaways?.length || 0} takeaways
                        </span>
                        <span>
                          {analysis.keyFindings?.length || 0} findings
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewAnalysis(analysis);
                      }}
                    >
                      View Analysis
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
