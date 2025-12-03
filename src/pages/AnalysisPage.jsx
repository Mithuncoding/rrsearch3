import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, MessageSquare, Sparkles, BookOpen, Lightbulb, User, CheckCircle2, Star, Search, Network, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useMetricsStore } from '../store/useMetricsStore';
import { generateCoreAnalysis, generateAdvancedAnalysis } from '../services/analysisService';
import { evaluateAnalysisQuality } from '../services/evaluationService';
import { exportAsPDF, exportAsMarkdown, exportAsPPTX } from '../services/exportService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingOverlay } from '../components/ui/Spinner';
import { SkeletonCard } from '../components/ui/LoadingSpinner';
import { Modal } from '../components/ui/Modal';
import { toast } from '../components/ui/Toaster';
import OverviewTab from '../components/analysis/OverviewTab';
import CritiqueTab from '../components/analysis/CritiqueTab';
import IdeationTab from '../components/analysis/IdeationTab';
import RelatedPapersTab from '../components/analysis/RelatedPapersTab';
import KnowledgeGraphTab from '../components/analysis/KnowledgeGraphTab';
import AnalyticsTab from '../components/analysis/AnalyticsTab';
import ChatInterface from '../components/chat/ChatInterface';

export default function AnalysisPage() {
  const navigate = useNavigate();
  const { uploadedFiles, currentAnalysis, setCurrentAnalysis, persona, setPersona, addToHistory, findInHistory, generatePaperHash, isChatOpen, setIsChatOpen } = useAppStore();
  const { addEvaluation, incrementMetric } = useMetricsStore();
  const [activeTab, setActiveTab] = useState('takeaways');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [showExpertiseSelector, setShowExpertiseSelector] = useState(!persona);
  // const [showChat, setShowChat] = useState(false); // Moved to global store
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Smart caching - cache all loaded data (persists during session)
  const [cache, setCache] = useState({
    takeaways: null,
    overview: null,
    critique: null,
    ideation: null,
    related: null
  });
  
  const [loadingTabs, setLoadingTabs] = useState({});
  const [paperHash, setPaperHash] = useState(null);

  useEffect(() => {
    if (uploadedFiles.length === 0) {
      navigate('/');
      return;
    }

    // If currentAnalysis is already set (from history page), restore the cache
    if (currentAnalysis && !cache.overview) {
      console.log('📚 Restoring analysis from history...');
      
      // Set paper hash if available
      if (currentAnalysis.paperHash) {
        setPaperHash(currentAnalysis.paperHash);
      }
      
      // Restore cache from the existing analysis
      setCache({
        takeaways: currentAnalysis.keyFindings,
        overview: currentAnalysis,
        critique: currentAnalysis.strengths ? currentAnalysis : null,
        ideation: currentAnalysis.hypotheses ? currentAnalysis : null
      });
      
      toast.success('Analysis restored from history!');
      return;
    }

    if (!currentAnalysis && persona) {
      checkHistoryOrAnalyze();
    }
  }, [persona, currentAnalysis]);
  
  // Check if paper was analyzed before
  const checkHistoryOrAnalyze = async () => {
    const file = uploadedFiles[0];
    const text = file.parsedData.text;
    const hash = generatePaperHash(text);
    setPaperHash(hash);
    
    // Check history
    const existingAnalysis = findInHistory(hash);
    
    if (existingAnalysis) {
      console.log('📚 Found in history! Using cached analysis.');
      toast.success('Found previous analysis! Loading instantly...');
      
      // Restore from history
      setCurrentAnalysis(existingAnalysis);
      setCache({
        takeaways: existingAnalysis.keyFindings,
        overview: existingAnalysis,
        critique: existingAnalysis.strengths ? existingAnalysis : null,
        ideation: existingAnalysis.hypotheses ? existingAnalysis : null
      });
      
      return;
    }
    
    // New paper, perform analysis
    console.log('🆕 New paper detected. Starting analysis...');
    performAnalysis(hash);
  };

  const handleExpertiseSelection = (level) => {
    setPersona(level);
    setShowExpertiseSelector(false);
    toast.success(`Expertise level set to ${level}`);
  };

  const performAnalysis = async (hash) => {
    setIsAnalyzing(true);
    const file = uploadedFiles[0];
    const text = file.parsedData.text;

    try {
      const textLength = text.length;
      if (textLength > 200000) {
        setLoadingStage('Large document detected. Extracting key sections...');
      } else {
        setLoadingStage('Analyzing paper structure and content...');
      }
      
      const coreAnalysis = await generateCoreAnalysis(text, persona);

      // Store in currentAnalysis AND cache for persistence
      setCurrentAnalysis(coreAnalysis);
      
      setCache(prev => ({
        ...prev,
        takeaways: coreAnalysis.keyFindings,
        overview: coreAnalysis
      }));

      // Stop loading immediately after core analysis
      setIsAnalyzing(false);
      setLoadingStage('');

      // Evaluate quality in background (non-blocking)
      evaluateAnalysisQuality(coreAnalysis, text)
        .then(evaluation => {
          addEvaluation(evaluation);
          incrementMetric('analysesGenerated');
          console.log('Quality Score:', evaluation.qualityScore, '- Rating:', evaluation.rating);
        })
        .catch(error => {
          console.error('Evaluation error:', error);
        });

      // Add to history with paper hash and full cache
      addToHistory({
        ...coreAnalysis,
        paperHash: hash || paperHash,
        fileName: file.name,
        fullText: text, // Store full text for restoration
        analyzedAt: new Date().toISOString(),
      });

      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Error performing analysis:', error);
      toast.error(error.message || 'Failed to analyze paper');
      setIsAnalyzing(false);
      setLoadingStage('');
    }
  };

  // Load critique with caching
  const loadCritique = async () => {
    if (cache.critique) {
      setActiveTab('critique');
      return;
    }

    if (loadingTabs.critique) return;
    
    // Check if currentAnalysis is available
    if (!currentAnalysis) {
      toast.error('Please wait for analysis to complete first');
      return;
    }

    setLoadingTabs(prev => ({ ...prev, critique: true }));
    
    try {
      const file = uploadedFiles[0];
      const text = file.parsedData.text;
      
      const advAnalysis = await generateAdvancedAnalysis(text, currentAnalysis);
      
      const updatedAnalysis = { ...currentAnalysis, ...advAnalysis };
      setCurrentAnalysis(updatedAnalysis);
      setCache(prev => ({ ...prev, critique: advAnalysis }));
      
      // Update history with critique data
      addToHistory({
        ...updatedAnalysis,
        paperHash,
        fileName: file.name,
        fullText: text, // Store full text
        analyzedAt: new Date().toISOString(),
      });
      
      toast.success('Critique analysis ready!');
    } catch (error) {
      console.error('Critique error:', error);
      toast.error('Failed to generate critique');
    } finally {
      setLoadingTabs(prev => ({ ...prev, critique: false }));
    }
  };

  // Load ideation with caching
  const loadIdeation = async () => {
    if (cache.ideation) {
      setActiveTab('ideation');
      return;
    }

    if (loadingTabs.ideation) return;

    setLoadingTabs(prev => ({ ...prev, ideation: true }));
    
    try {
      const file = uploadedFiles[0];
      const text = file.parsedData.text;
      const result = await generateAdvancedAnalysis(text, currentAnalysis);
      
      const updatedAnalysis = { 
        ...currentAnalysis, 
        hypotheses: result.hypotheses,
        strengths: result.strengths,
        weaknesses: result.weaknesses
      };
      setCurrentAnalysis(updatedAnalysis);
      setCache(prev => ({ ...prev, ideation: updatedAnalysis }));
      
      // Update history with ideation data
      addToHistory({
        ...updatedAnalysis,
        paperHash,
        fileName: file.name,
        fullText: text, // Store full text
        analyzedAt: new Date().toISOString(),
      });
      
      toast.success('AI Ideation Lab loaded!');
    } catch (error) {
      console.error('Ideation error:', error);
      toast.error('Failed to generate hypotheses');
    } finally {
      setLoadingTabs(prev => ({ ...prev, ideation: false }));
    }
  };



  const handleExport = async (format) => {
    try {
      if (format === 'pdf') {
        exportAsPDF(currentAnalysis);
      } else if (format === 'markdown') {
        exportAsMarkdown(currentAnalysis);
      } else if (format === 'pptx') {
        // Generate presentation slides from analysis
        const presentation = {
          slides: [
            {
              title: currentAnalysis.title || 'Research Analysis',
              content: []
            },
            {
              title: 'Key Takeaways',
              content: currentAnalysis.takeaways || []
            },
            {
              title: 'Summary',
              content: [currentAnalysis.summary || 'No summary available']
            },
            {
              title: 'Problem Statement',
              content: [currentAnalysis.problemStatement || 'Not available']
            },
            {
              title: 'Methodology',
              content: [currentAnalysis.methodology || 'Not available']
            }
          ]
        };
        
        if (currentAnalysis.keyFindings && currentAnalysis.keyFindings.length > 0) {
          presentation.slides.push({
            title: 'Key Findings',
            content: currentAnalysis.keyFindings.map(f => 
              typeof f === 'string' ? f : f.finding || 'Finding'
            )
          });
        }
        
        exportAsPPTX(presentation, currentAnalysis.title || 'Research Analysis');
      }
      toast.success(`Exported as ${format.toUpperCase()}`);
      setShowExportMenu(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export');
    }
  };

  const handleTabClick = (tab) => {
    // If already on this tab and data is cached, just switch
    if (cache[tab]) {
      setActiveTab(tab);
      return;
    }

    // Otherwise load the data
    switch(tab) {
      case 'takeaways':
      case 'overview':
      case 'related':
        setActiveTab(tab);
        break;
      case 'critique':
        loadCritique();
        setActiveTab(tab);
        break;
      case 'ideation':
        loadIdeation();
        setActiveTab(tab);
        break;
      default:
        setActiveTab(tab);
    }
  };

  if (isAnalyzing) {
    return <LoadingOverlay message={loadingStage} />;
  }

  if (showExpertiseSelector) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl w-full"
        >
          <Card glass className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-prism-600 to-accent-purple rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-3">Select Your Expertise Level</h2>
              <p className="text-slate-600">Choose the level that best describes your background for personalized analysis</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { level: 'Engineer', desc: 'Technical background in engineering', icon: '⚙️' },
                { level: 'Researcher', desc: 'Academic or scientific researcher', icon: '🔬' },
                { level: 'Student', desc: 'Undergraduate or graduate student', icon: '🎓' },
                { level: 'General', desc: 'General reader or enthusiast', icon: '📚' }
              ].map(({ level, desc, icon }) => (
                <motion.button
                  key={level}
                  onClick={() => handleExpertiseSelection(level)}
                  className="group relative p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-prism-500 transition-all duration-300 text-left"
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-prism-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="text-4xl mb-3">{icon}</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{level}</h3>
                    <p className="text-sm text-slate-600">{desc}</p>
                  </div>
                  {persona === level && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="w-6 h-6 text-prism-600" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button onClick={() => navigate('/')} variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!currentAnalysis) {
    return <LoadingOverlay message="Preparing analysis..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/')} variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-800 line-clamp-1 max-w-[150px] md:max-w-none">{currentAnalysis.title}</h1>
                <p className="text-xs md:text-sm text-slate-600 hidden sm:block">Analyzing as: <span className="font-semibold text-prism-600">{persona}</span></p>
              </div>
            </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => setShowExpertiseSelector(true)} variant="ghost" size="sm" className="px-2 md:px-3">
                  <User className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Change Level</span>
                </Button>
                <Button onClick={() => setIsChatOpen(true)} variant="ghost" size="sm" className="px-2 md:px-3">
                  <MessageSquare className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Chat</span>
                </Button>
              <div className="relative">
                <Button onClick={() => setShowExportMenu(!showExportMenu)} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <button onClick={() => handleExport('pdf')} className="w-full px-4 py-2 text-left hover:bg-slate-50 text-sm">Export as PDF</button>
                    <button onClick={() => handleExport('markdown')} className="w-full px-4 py-2 text-left hover:bg-slate-50 text-sm">Export as Markdown</button>
                    <button onClick={() => handleExport('pptx')} className="w-full px-4 py-2 text-left hover:bg-slate-50 text-sm">Export as PPTX</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Modern Horizontal Navigation at Top */}
        <Card glass className="mb-6 p-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <TopTab 
              active={activeTab === 'takeaways'} 
              onClick={() => handleTabClick('takeaways')}
              icon={<Sparkles className="w-4 h-4" />}
              gradient="from-prism-600 to-prism-500"
              loaded={!!cache.takeaways}
            >
              Key Takeaways
            </TopTab>
            <TopTab 
              active={activeTab === 'overview'} 
              onClick={() => handleTabClick('overview')}
              icon={<BookOpen className="w-4 h-4" />}
              gradient="from-blue-600 to-blue-500"
              loaded={!!cache.overview}
            >
              Overview
            </TopTab>
            <TopTab 
              active={activeTab === 'critique'} 
              onClick={() => handleTabClick('critique')}
              icon={<Star className="w-4 h-4" />}
              gradient="from-purple-600 to-purple-500"
              loading={loadingTabs.critique}
              loaded={!!cache.critique}
            >
              Critique
            </TopTab>
            <TopTab 
              active={activeTab === 'ideation'} 
              onClick={() => handleTabClick('ideation')}
              icon={<Lightbulb className="w-4 h-4" />}
              gradient="from-pink-600 to-pink-500"
              loading={loadingTabs.ideation}
              loaded={!!cache.ideation}
            >
              Ideation Lab
            </TopTab>
            <TopTab 
              active={activeTab === 'related'} 
              onClick={() => handleTabClick('related')}
              icon={<Search className="w-4 h-4" />}
              gradient="from-green-600 to-green-500"
              loading={loadingTabs.related}
              loaded={!!cache.related}
            >
              Related Papers
            </TopTab>
            <TopTab 
              active={activeTab === 'graph'} 
              onClick={() => handleTabClick('graph')}
              icon={<Network className="w-4 h-4" />}
              gradient="from-indigo-600 to-indigo-500"
              loaded={!!cache.overview}
            >
              Knowledge Graph
            </TopTab>
            <TopTab 
              active={activeTab === 'analytics'} 
              onClick={() => handleTabClick('analytics')}
              icon={<BarChart3 className="w-4 h-4" />}
              gradient="from-orange-600 to-orange-500"
              loaded={!!cache.overview}
            >
              Deep Analytics
            </TopTab>

          </div>
        </Card>

        {/* Content Area */}
        <Card glass className="min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'takeaways' && (cache.takeaways || currentAnalysis?.keyFindings) && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold gradient-text mb-6">Key Takeaways</h2>
                  {(cache.takeaways || currentAnalysis.keyFindings).map((finding, i) => {
                    // Handle both string and object formats
                    const findingText = typeof finding === 'string' ? finding : finding.finding;
                    const evidence = typeof finding === 'object' ? finding.evidence : null;
                    
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-slate-100 hover:border-prism-200 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-prism-600 to-accent-purple flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-700 leading-relaxed mb-2">{findingText}</p>
                            {evidence && (
                              <p className="text-sm text-slate-500 italic pl-4 border-l-2 border-prism-200">
                                {evidence}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'overview' && (cache.overview || currentAnalysis) && (
                <OverviewTab analysis={cache.overview || currentAnalysis} />
              )}

              {activeTab === 'critique' && (
                loadingTabs.critique ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center animate-pulse">
                        <Star className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-64 bg-slate-100 rounded animate-pulse"></div>
                      </div>
                    </div>
                    {[1, 2, 3].map((i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : cache.critique ? (
                  <CritiqueTab analysis={{ ...currentAnalysis, ...cache.critique }} />
                ) : (
                  <div className="text-center py-16">
                    <p className="text-slate-600">Critique analysis not loaded yet</p>
                  </div>
                )
              )}

              {activeTab === 'ideation' && (
                loadingTabs.ideation ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-pink-500 flex items-center justify-center animate-pulse">
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
                  </div>
                ) : cache.ideation ? (
                  <IdeationTab analysis={cache.ideation} />
                ) : (
                  <div className="text-center py-16">
                    <p className="text-slate-600">Click to generate AI hypotheses</p>
                  </div>
                )
              )}

              {activeTab === 'related' && currentAnalysis && (
                <RelatedPapersTab 
                  title={currentAnalysis.title}
                  summary={currentAnalysis.summary}
                  methodology={currentAnalysis.methodology}
                  keyFindings={currentAnalysis.keyFindings}
                />
              )}

              {activeTab === 'graph' && (cache.overview || currentAnalysis) && (
                <KnowledgeGraphTab analysis={cache.overview || currentAnalysis} />
              )}

              {activeTab === 'analytics' && (cache.overview || currentAnalysis) && (
                <AnalyticsTab 
                  analysis={cache.overview || currentAnalysis} 
                  fullText={currentAnalysis.fullText || uploadedFiles[0]?.parsedData?.text} 
                />
              )}

              {activeTab === 'references' && (
                loadingTabs.references ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse">
                        <div className="h-5 bg-slate-200 rounded w-4/5 mb-2"></div>
                        <div className="h-3 bg-slate-100 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : null
              )}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>

      {/* Chat Modal */}
      {isChatOpen && currentAnalysis && (
        <ChatInterface 
          paperContext={currentAnalysis} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}
    </div>
  );
}

// Top Navigation Tab Component
function TopTab({ active, onClick, icon, children, gradient, loading, loaded }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`group relative flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
        active 
          ? `bg-gradient-to-r ${gradient} text-white shadow-lg scale-105` 
          : 'bg-white text-slate-700 hover:shadow-md hover:scale-102 border-2 border-transparent hover:border-slate-200'
      } ${loading ? 'opacity-50 cursor-wait' : ''}`}
    >
      {active && <div className="absolute inset-0 bg-white/20 rounded-xl blur-xl"></div>}
      <div className={`relative ${active ? 'text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            {icon}
          </motion.div>
        ) : (
          icon
        )}
      </div>
      <span className="relative text-sm">{children}</span>
      {loaded && !active && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
      )}
      {active && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-white rounded-full"></div>
      )}
    </button>
  );
}
