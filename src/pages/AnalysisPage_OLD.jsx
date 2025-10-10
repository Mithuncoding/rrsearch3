import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, MessageSquare, Sparkles, BookOpen, Lightbulb, Image as ImageIcon, BookMarked, ExternalLink, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { generateCoreAnalysis, generateAdvancedAnalysis, generateQuiz, extractReferences, generateGlossary, generatePresentation, regenerateSummary, explainFigure } from '../services/analysisService';
import { extractPDFImages } from '../services/fileParser';
import { exportAsPDF, exportAsMarkdown, exportAsPPTX } from '../services/exportService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Spinner, LoadingOverlay } from '../components/ui/Spinner';
import { LoadingSpinner, ProgressBar, SkeletonCard } from '../components/ui/LoadingSpinner';
import { Skeleton, SkeletonGroup } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Modal';
import { toast } from '../components/ui/Toaster';
import OverviewTab from '../components/analysis/OverviewTab';
import CritiqueTab from '../components/analysis/CritiqueTab';
import IdeationTab from '../components/analysis/IdeationTab';
import FiguresTab from '../components/analysis/FiguresTab';
import ReferencesTab from '../components/analysis/ReferencesTab';
import RelatedPapersTab from '../components/analysis/RelatedPapersTab';
import ChatInterface from '../components/chat/ChatInterface';

export default function AnalysisPage() {
  const navigate = useNavigate();
  const { uploadedFiles, currentAnalysis, setCurrentAnalysis, persona, setPersona, addToHistory } = useAppStore();
  const [activeTab, setActiveTab] = useState('takeaways');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [showExpertiseSelector, setShowExpertiseSelector] = useState(!persona);
  const [showChat, setShowChat] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [figures, setFigures] = useState([]);
  const [loadedSections, setLoadedSections] = useState({
    critique: false,
    ideation: false,
    figures: false,
    references: false,
    related: false,
    glossary: false
  });
  const [loadingSections, setLoadingSections] = useState({});
  
  // Smart caching - store all loaded data
  const [cachedData, setCachedData] = useState({});

  useEffect(() => {
    if (uploadedFiles.length === 0) {
      navigate('/');
      return;
    }

    if (!currentAnalysis) {
      startAnalysis();
    }
  }, []);

  const startAnalysis = async () => {
    // Show expertise selector if not already set
    if (!persona) {
      setShowExpertiseSelector(true);
      return;
    }

    setIsAnalyzing(true);
    await performAnalysis();
  };

  const performAnalysis = async () => {
    const file = uploadedFiles[0];
    const text = file.parsedData.text;

    try {
      // Core analysis (blocking - shows immediately)
      const textLength = text.length;
      if (textLength > 200000) {
        setLoadingStage('Large document detected. Extracting key sections...');
      } else {
        setLoadingStage('Analyzing paper structure and content...');
      }
      
      const coreAnalysis = await generateCoreAnalysis(text, persona);

      // Show initial results (Key Takeaways, Overview)
      setCurrentAnalysis(coreAnalysis);
      setIsAnalyzing(false);
      setLoadingStage('');

      // Cache the core analysis
      setCachedData(prev => ({
        ...prev,
        takeaways: coreAnalysis.keyFindings,
        overview: coreAnalysis
      }));

      // Automatically load critique (essential analysis)
      loadCritique();

      // Add to history
      addToHistory({
        ...coreAnalysis,
        fileName: file.name,
        analyzedAt: new Date().toISOString(),
      });

      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Error performing analysis:', error);
      
      // User-friendly error messages
      let errorMessage = 'Failed to analyze paper';
      if (error.message.includes('overloaded')) {
        errorMessage = 'AI model is busy. Retrying automatically...';
        // Retry after 3 seconds
        setTimeout(() => {
          performAnalysis();
        }, 3000);
      } else if (error.message.includes('token')) {
        errorMessage = 'Paper is too long. Analyzing key sections only...';
        // Will work on next retry with truncated text
      } else if (error.message.includes('quota')) {
        errorMessage = 'API quota exceeded. Please try again later.';
      }
      
      toast.error(errorMessage);
      setIsAnalyzing(false);
    }
  };

  const handleQuizComplete = (score, detectedPersona) => {
    setPersona(detectedPersona);
    setQuizCompleted(true);
    setShowQuiz(false);
    performAnalysis();
  };

  const handleSkipQuiz = () => {
    setShowQuiz(false);
    performAnalysis();
  };

  // Load optional sections on demand
  const loadIdeation = async () => {
    if (loadedSections.ideation) return;
    setLoadingSections(prev => ({ ...prev, ideation: true }));
    
    try {
      const file = uploadedFiles[0];
      const text = file.parsedData.text;
      const hypotheses = await generateAdvancedAnalysis(text, currentAnalysis);
      setCurrentAnalysis(prev => ({ ...prev, hypotheses: hypotheses.hypotheses }));
      setLoadedSections(prev => ({ ...prev, ideation: true }));
      toast.success('AI Ideation Lab loaded!');
    } catch (error) {
      toast.error('Failed to generate hypotheses');
    } finally {
      setLoadingSections(prev => ({ ...prev, ideation: false }));
    }
  };

  const loadFigures = async () => {
    if (loadedSections.figures) return;
    setLoadingSections(prev => ({ ...prev, figures: true }));
    
    try {
      const file = uploadedFiles[0];
      if (file.name.endsWith('.pdf')) {
        const imgs = await extractPDFImages(new File([file.parsedData], file.name));
        setFigures(imgs);
        setLoadedSections(prev => ({ ...prev, figures: true }));
        toast.success(`Extracted ${imgs.length} figures!`);
      }
    } catch (error) {
      toast.error('Failed to extract figures');
    } finally {
      setLoadingSections(prev => ({ ...prev, figures: false }));
    }
  };

  const loadReferences = async () => {
    if (loadedSections.references) return;
    setLoadingSections(prev => ({ ...prev, references: true }));
    
    try {
      const file = uploadedFiles[0];
      const text = file.parsedData.text;
      const refs = await extractReferences(text);
      setCurrentAnalysis(prev => ({ ...prev, references: refs.references }));
      setLoadedSections(prev => ({ ...prev, references: true }));
      toast.success('References extracted!');
    } catch (error) {
      toast.error('Failed to extract references');
    } finally {
      setLoadingSections(prev => ({ ...prev, references: false }));
    }
  };

  const loadRelatedPapers = async () => {
    if (loadedSections.related) return;
    setLoadingSections(prev => ({ ...prev, related: true }));
    
    try {
      // Related papers are generated from current analysis
      setLoadedSections(prev => ({ ...prev, related: true }));
      toast.success('Related papers suggestions ready!');
    } catch (error) {
      toast.error('Failed to generate related papers');
    } finally {
      setLoadingSections(prev => ({ ...prev, related: false }));
    }
  };

  const handleExport = async (format) => {
    try {
      if (format === 'pdf') {
        exportAsPDF(currentAnalysis);
      } else if (format === 'markdown') {
        exportAsMarkdown(currentAnalysis);
      } else if (format === 'pptx') {
        const presentation = await generatePresentation(currentAnalysis, currentAnalysis);
        exportAsPPTX(presentation, currentAnalysis.title);
      }
      toast.success(`Exported as ${format.toUpperCase()}`);
      setShowExportMenu(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export');
    }
  };

  if (!uploadedFiles[0]) {
    return null;
  }

  if (showQuiz && quiz && !quizCompleted) {
    return (
      <div className="min-h-screen p-6">
        <ExpertiseQuiz 
          quiz={quiz} 
          onComplete={handleQuizComplete}
          onSkip={handleSkipQuiz}
        />
      </div>
    );
  }

  if (isAnalyzing) {
    return <LoadingOverlay message={loadingStage} />;
  }

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
                <h1 className="text-xl font-bold text-slate-800 line-clamp-1">
                  {currentAnalysis?.title || 'Analyzing...'}
                </h1>
                <p className="text-sm text-slate-600">
                  Viewing as: <span className="font-semibold text-prism-600">{persona}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setShowChat(!showChat)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </Button>
              <div className="relative">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 glass-card p-2 shadow-xl">
                    <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors">
                      Export as PDF
                    </button>
                    <button onClick={() => handleExport('markdown')} className="w-full text-left px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors">
                      Export as Markdown
                    </button>
                    <button onClick={() => handleExport('pptx')} className="w-full text-left px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors">
                      Export as PowerPoint
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sticky Navigation Sidebar */}
            <div className="lg:hidden mb-6">
              <div className="overflow-x-auto">
                <div className="flex gap-2 pb-2">
                  <MobileTab active={activeTab === 'takeaways'} onClick={() => setActiveTab('takeaways')} icon={<Sparkles className="w-4 h-4" />}>
                    Takeaways
                  </MobileTab>
                  <MobileTab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<BookOpen className="w-4 h-4" />}>
                    Overview
                  </MobileTab>
                  <MobileTab active={activeTab === 'critique'} onClick={() => setActiveTab('critique')} icon={<BookMarked className="w-4 h-4" />}>
                    Critique
                  </MobileTab>
                  <MobileTab active={activeTab === 'ideation'} onClick={() => setActiveTab('ideation')} icon={<Lightbulb className="w-4 h-4" />}>
                    Ideation
                  </MobileTab>
                  <MobileTab active={activeTab === 'figures'} onClick={() => setActiveTab('figures')} icon={<ImageIcon className="w-4 h-4" />}>
                    Figures
                  </MobileTab>
                  <MobileTab active={activeTab === 'references'} onClick={() => setActiveTab('references')} icon={<BookMarked className="w-4 h-4" />}>
                    References
                  </MobileTab>
                  <MobileTab active={activeTab === 'related'} onClick={() => setActiveTab('related')} icon={<ExternalLink className="w-4 h-4" />}>
                    Related
                  </MobileTab>
                </div>
              </div>
            </div>

            {/* Desktop Sidebar Navigation */}
            <div className="hidden lg:block mb-6">
              <Card glass className="p-4">
                <div className="space-y-2">
                  <SidebarTab active={activeTab === 'takeaways'} onClick={() => setActiveTab('takeaways')} icon={<Sparkles className="w-5 h-5" />} gradient="from-prism-600 to-prism-500">
                    Key Takeaways
                  </SidebarTab>
                  <SidebarTab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<BookOpen className="w-5 h-5" />} gradient="from-blue-600 to-blue-500">
                    Overview
                  </SidebarTab>
                  <SidebarTab active={activeTab === 'critique'} onClick={() => setActiveTab('critique')} icon={<BookMarked className="w-5 h-5" />} gradient="from-accent-purple to-purple-500">
                    Critique
                  </SidebarTab>
                  <SidebarTab active={activeTab === 'ideation'} onClick={() => setActiveTab('ideation')} icon={<Lightbulb className="w-5 h-5" />} gradient="from-accent-pink to-pink-500">
                    AI Ideation Lab
                  </SidebarTab>
                  <SidebarTab active={activeTab === 'figures'} onClick={() => setActiveTab('figures')} icon={<ImageIcon className="w-5 h-5" />} gradient="from-emerald-600 to-emerald-500">
                    Figures
                  </SidebarTab>
                  <SidebarTab active={activeTab === 'references'} onClick={() => setActiveTab('references')} icon={<BookMarked className="w-5 h-5" />} gradient="from-orange-600 to-orange-500">
                    References
                  </SidebarTab>
                  <SidebarTab active={activeTab === 'related'} onClick={() => setActiveTab('related')} icon={<ExternalLink className="w-5 h-5" />} gradient="from-violet-600 to-violet-500">
                    Related Papers
                  </SidebarTab>
                </div>
              </Card>
            </div>

            {/* Content Card */}
            <Card glass>

              <div className="min-h-[400px]">
                {activeTab === 'takeaways' && currentAnalysis && (
                  <div className="space-y-6 fade-in-up">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-prism-600 to-accent-purple rounded-2xl flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold gradient-text">Key Takeaways</h2>
                        <p className="text-sm text-slate-600 mt-1">The most important contributions from this paper</p>
                      </div>
                    </div>
                    
                    <div className="grid gap-4">
                      {currentAnalysis.takeaways?.map((takeaway, i) => (
                        <div 
                          key={i} 
                          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 border-2 border-slate-200 hover:border-prism-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-prism-400/10 to-accent-purple/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
                          <div className="relative flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-prism-600 via-accent-purple to-accent-pink rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {i + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-slate-800 leading-relaxed text-lg font-medium">{takeaway}</p>
                            </div>
                          </div>
                        </div>
                      )) || <SkeletonGroup count={5} variant="card" />}
                    </div>
                  </div>
                )}

                {activeTab === 'overview' && (
                  <OverviewTab analysis={currentAnalysis} />
                )}

                {activeTab === 'critique' && (
                  <CritiqueTab analysis={currentAnalysis} />
                )}

                {activeTab === 'ideation' && (
                  loadedSections.ideation ? (
                    <IdeationTab analysis={currentAnalysis} />
                  ) : loadingSections.ideation ? (
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center animate-pulse-glow">
                          <Lightbulb className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-2"></div>
                          <div className="h-4 w-64 bg-slate-100 rounded animate-pulse"></div>
                        </div>
                      </div>
                      {[1, 2, 3].map((i) => (
                        <SkeletonCard key={i} />
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-16 fade-in-up">
                      <div className="w-20 h-20 bg-gradient-to-br from-accent-purple to-accent-pink rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <Lightbulb className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">AI Ideation Lab</h3>
                      <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        Generate novel hypotheses and experimental designs based on this paper's findings
                      </p>
                      <Button 
                        size="lg" 
                        onClick={loadIdeation} 
                        className="shadow-xl group"
                      >
                        <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                        Generate Novel Hypotheses
                      </Button>
                    </div>
                  )
                )}

                {activeTab === 'figures' && (
                  loadedSections.figures ? (
                    <FiguresTab figures={figures} paperContext={currentAnalysis?.summary} />
                  ) : loadingSections.figures ? (
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-prism-600 to-accent-purple flex items-center justify-center animate-pulse-glow">
                          <ImageIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-2"></div>
                          <div className="h-4 w-56 bg-slate-100 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse">
                            <div className="aspect-video bg-slate-200 rounded-lg mb-3"></div>
                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-slate-100 rounded w-full"></div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-16 fade-in-up">
                      <div className="w-20 h-20 bg-gradient-to-br from-prism-600 to-accent-purple rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <ImageIcon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">Extract Figures</h3>
                      <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        Extract all figures, charts, and diagrams from the PDF with AI explanations
                      </p>
                      <Button 
                        size="lg" 
                        onClick={loadFigures} 
                        className="shadow-xl group"
                      >
                        <ImageIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Extract All Figures
                      </Button>
                    </div>
                  )
                )}

                {activeTab === 'references' && (
                  loadedSections.references ? (
                    <ReferencesTab references={currentAnalysis?.references} />
                  ) : loadingSections.references ? (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-prism-500 to-accent-purple flex items-center justify-center animate-pulse-glow">
                          <BookMarked className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="h-6 w-36 bg-slate-200 rounded animate-pulse mb-2"></div>
                          <div className="h-4 w-52 bg-slate-100 rounded animate-pulse"></div>
                        </div>
                      </div>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse">
                          <div className="h-5 bg-slate-200 rounded w-4/5 mb-2"></div>
                          <div className="h-3 bg-slate-100 rounded w-full mb-2"></div>
                          <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-16 fade-in-up">
                      <div className="w-20 h-20 bg-gradient-to-br from-prism-500 to-accent-purple rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <BookMarked className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">References</h3>
                      <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        Extract and format all references in APA and BibTeX formats
                      </p>
                      <Button 
                        size="lg" 
                        onClick={loadReferences} 
                        className="shadow-xl group"
                      >
                        <BookMarked className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Extract References
                      </Button>
                    </div>
                  )
                )}

                {activeTab === 'related' && (
                  loadedSections.related ? (
                    <RelatedPapersTab title={currentAnalysis?.title} summary={currentAnalysis?.summary} />
                  ) : loadingSections.related ? (
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center animate-pulse-glow">
                          <ExternalLink className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="h-6 w-44 bg-slate-200 rounded animate-pulse mb-2"></div>
                          <div className="h-4 w-60 bg-slate-100 rounded animate-pulse"></div>
                        </div>
                      </div>
                      {[1, 2, 3].map((i) => (
                        <SkeletonCard key={i} />
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-16 fade-in-up">
                      <div className="w-20 h-20 bg-gradient-to-br from-accent-purple to-accent-pink rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <ExternalLink className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">Related Papers</h3>
                      <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        Discover related research papers and generate Google Scholar search queries
                      </p>
                      <Button 
                        size="lg" 
                        onClick={loadRelatedPapers} 
                        className="shadow-xl group"
                      >
                        <ExternalLink className="w-5 h-5 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Find Related Papers
                      </Button>
                    </div>
                  )
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card glass>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Analysis Stats</h3>
              <div className="space-y-3">
                <StatItem label="Persona" value={persona} />
                <StatItem label="Key Findings" value={currentAnalysis?.keyFindings?.length || '...'} />
                <StatItem label="References" value={currentAnalysis?.references?.length || '...'} />
                <StatItem label="Figures" value={figures.length || '...'} />
              </div>
            </Card>

            {/* Glossary */}
            {currentAnalysis?.glossary && currentAnalysis.glossary.length > 0 && (
              <Card glass>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Technical Glossary</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-custom">
                  {currentAnalysis.glossary.map((term, i) => (
                    <div key={i} className="pb-3 border-b border-slate-200 last:border-0">
                      <p className="font-semibold text-prism-700 text-sm">{term.term}</p>
                      <p className="text-xs text-slate-600 mt-1">{term.definition}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && currentAnalysis && (
        <ChatInterface 
          paperContext={currentAnalysis} 
          figures={figures}
          onClose={() => setShowChat(false)} 
        />
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-prism-600 to-accent-purple text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{children}</span>
    </button>
  );
}

function ModernTab({ active, onClick, icon, children, gradient }) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
        active 
          ? `bg-gradient-to-r ${gradient} text-white shadow-lg scale-105` 
          : 'bg-white text-slate-700 hover:shadow-md hover:scale-102 border-2 border-transparent hover:border-slate-200'
      }`}
    >
      {active && <div className="absolute inset-0 bg-white/20 rounded-xl blur-xl"></div>}
      <div className={`relative ${active ? 'text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>
        {icon}
      </div>
      <span className="relative text-sm sm:text-base">{children}</span>
      {active && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-white rounded-full"></div>
      )}
    </button>
  );
}

function SidebarTab({ active, onClick, icon, children, gradient }) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-left ${
        active 
          ? `bg-gradient-to-r ${gradient} text-white shadow-lg transform translate-x-2` 
          : 'bg-white/50 text-slate-700 hover:bg-white hover:shadow-md hover:translate-x-1'
      }`}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
      )}
      <div className={`${active ? 'text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>
        {icon}
      </div>
      <span className="text-sm">{children}</span>
      {active && (
        <div className="ml-auto">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      )}
    </button>
  );
}

function MobileTab({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-prism-600 to-accent-purple text-white shadow-md' 
          : 'bg-white/80 text-slate-700 border border-slate-200'
      }`}
    >
      {icon}
      <span className="text-sm whitespace-nowrap">{children}</span>
    </button>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-bold text-prism-700">{value}</span>
    </div>
  );
}
