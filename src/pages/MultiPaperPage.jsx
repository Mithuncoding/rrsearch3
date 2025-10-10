import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileStack } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { generateMultiPaperSynthesis } from '../services/analysisService';
import { exportSynthesisAsPDF } from '../services/exportService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingOverlay } from '../components/ui/Spinner';
import { Skeleton, SkeletonGroup } from '../components/ui/Skeleton';
import { toast } from '../components/ui/Toaster';

export default function MultiPaperPage() {
  const navigate = useNavigate();
  const { uploadedFiles, multiPaperAnalysis, setMultiPaperAnalysis } = useAppStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (uploadedFiles.length < 2) {
      navigate('/');
      return;
    }

    if (!multiPaperAnalysis) {
      analyzePapers();
    }
  }, []);

  const analyzePapers = async () => {
    setIsAnalyzing(true);

    try {
      // First analyze each paper individually (simplified)
      const paperAnalyses = await Promise.all(
        uploadedFiles.map(async (file) => {
          const text = file.parsedData.text;
          // Extract basic info
          return {
            title: file.name.replace(/\.[^/.]+$/, ''),
            summary: text.substring(0, 1000),
            keyFindings: [
              { finding: 'Placeholder finding 1', evidence: '...' },
              { finding: 'Placeholder finding 2', evidence: '...' }
            ]
          };
        })
      );

      // Generate synthesis
      const synthesis = await generateMultiPaperSynthesis(paperAnalyses);
      setMultiPaperAnalysis({
        papers: paperAnalyses,
        synthesis: synthesis
      });

      toast.success('Multi-paper synthesis complete!');
    } catch (error) {
      console.error('Error analyzing papers:', error);
      toast.error('Failed to analyze papers');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = () => {
    if (multiPaperAnalysis) {
      const paperTitles = multiPaperAnalysis.papers.map(p => p.title);
      exportSynthesisAsPDF(multiPaperAnalysis.synthesis, paperTitles);
      toast.success('Exported as PDF');
    }
  };

  if (isAnalyzing) {
    return <LoadingOverlay message="Analyzing multiple papers and generating synthesis..." />;
  }

  if (!multiPaperAnalysis) {
    return null;
  }

  const { papers, synthesis } = multiPaperAnalysis;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')} size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="h-8 w-px bg-slate-300" />
              <div>
                <h1 className="text-xl font-bold gradient-text">Multi-Paper Synthesis</h1>
                <p className="text-sm text-slate-600">{papers.length} papers analyzed</p>
              </div>
            </div>

            <Button variant="secondary" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Papers List */}
          <Card glass>
            <div className="flex items-center gap-3 mb-6">
              <FileStack className="w-6 h-6 text-prism-600" />
              <h2 className="text-2xl font-bold gradient-text">Analyzed Papers</h2>
            </div>
            <div className="space-y-3">
              {papers.map((paper, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl border-l-4 border-prism-500">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-prism-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 mb-1">{paper.title}</h3>
                      <p className="text-sm text-slate-600 line-clamp-2">{paper.summary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Overall Synthesis */}
          <Card glass>
            <h2 className="text-2xl font-bold gradient-text mb-6">Overall Synthesis</h2>
            <p className="text-slate-700 leading-relaxed">{synthesis.overallSynthesis}</p>
          </Card>

          {/* Common Themes */}
          <Card glass>
            <h2 className="text-2xl font-bold gradient-text mb-6">Common Themes</h2>
            <div className="space-y-4">
              {synthesis.commonThemes.map((theme, i) => (
                <div key={i} className="p-4 bg-gradient-to-r from-prism-50 to-purple-50 rounded-xl">
                  <h3 className="font-bold text-slate-800 mb-2">Theme {i + 1}: {theme.theme}</h3>
                  <p className="text-sm text-slate-600">
                    <strong>Discussed in:</strong> {theme.papersDiscussing.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Conflicting Findings */}
          <Card glass>
            <h2 className="text-2xl font-bold gradient-text mb-6">Conflicting Findings</h2>
            <div className="space-y-4">
              {synthesis.conflictingFindings.map((conflict, i) => (
                <div key={i} className="p-4 bg-orange-50 rounded-xl border-l-4 border-orange-500">
                  <h3 className="font-bold text-orange-900 mb-2">{conflict.topic}</h3>
                  <p className="text-sm text-slate-700">{conflict.conflicts}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Concept Evolution */}
          <Card glass>
            <h2 className="text-2xl font-bold gradient-text mb-6">Concept Evolution</h2>
            <p className="text-slate-700 leading-relaxed">{synthesis.conceptEvolution}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
