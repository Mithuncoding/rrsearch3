import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Sparkles, Brain, Zap, Clock, History, Lightbulb, BookMarked, Image as ImageIcon, MessageSquare, ExternalLink, Download } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useMetricsStore } from '../store/useMetricsStore';
import { parseFile, validateFile } from '../services/fileParser';
import { validateDocument } from '../services/geminiApi';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingOverlay } from '../components/ui/Spinner';
import { toast } from '../components/ui/Toaster';

export default function HomePage() {
  const navigate = useNavigate();
  const { setUploadedFiles, addUploadedFile, uploadedFiles, clearUploadedFiles } = useAppStore();
  const { incrementMetric } = useMetricsStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    await processFiles(files);
    // Reset input to allow selecting the same file again
    e.target.value = '';
  };

  const processFiles = async (files) => {
    setIsProcessing(true);
    clearUploadedFiles();
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProcessingMessage(`Processing ${file.name}... (${i + 1}/${files.length})`);

        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
          toast.error(validation.error);
          continue;
        }

        // Parse file
        const parsed = await parseFile(file);
        
        // Validate it's a scientific paper
        const docValidation = await validateDocument(parsed.text);
        if (!docValidation.isValid) {
          toast.error(`${file.name}: ${docValidation.reason}`);
          continue;
        }

        // Add to store
        addUploadedFile({
          name: file.name,
          parsedData: parsed,
          uploadedAt: new Date().toISOString(),
        });
        
        // Track metric
        incrementMetric('papersUploaded');
      }

      toast.success(`Successfully processed ${uploadedFiles.length + 1} file(s)`);

      // Navigate based on number of files
      if (files.length === 1) {
        navigate('/analysis');
      } else if (files.length > 1) {
        navigate('/multi-paper');
      }
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error(error.message || 'Failed to process files');
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {isProcessing && <LoadingOverlay message={processingMessage} />}
      
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-prism-50 via-purple-50 to-pink-50" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-prism-400/20 rounded-full blur-3xl floating-element" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl floating-element" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent-pink/20 rounded-full blur-3xl floating-element" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <img src="/icon.svg" alt="Prism" className="w-10 h-10 md:w-14 md:h-14" />
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">PRISM</h1>
              <p className="text-xs md:text-sm text-slate-600">AI Research Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate('/metrics')}
              className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="hidden sm:inline">Metrics</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/history')}
              className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2"
            >
              <History className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">History</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero section */}
          <div className="text-center mb-12 md:mb-16 fade-in-up">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-3 bg-gradient-to-r from-prism-100 to-purple-100 px-6 py-3 rounded-full border-2 border-prism-200 shadow-lg">
                <Sparkles className="w-5 h-5 text-prism-600 animate-pulse" />
                <span className="text-sm font-semibold text-prism-700">Powered by Advanced AI Technology</span>
              </div>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-display font-black mb-6 px-4 leading-tight">
              Research Analysis
              <br />
              <span className="bg-gradient-to-r from-prism-600 via-accent-purple to-accent-pink bg-clip-text text-transparent">
                Reimagined
              </span>
            </h2>
            
            <p className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4 mb-8">
              Transform dense academic papers into <span className="font-bold text-prism-600">crystal-clear insights</span> in seconds.
              Upload, analyze, and discover with the power of AI.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-prism-100 hover:border-prism-300 hover:scale-105">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black gradient-text mb-2">&lt; 5s</div>
                  <div className="text-sm font-semibold text-slate-600">Lightning Fast</div>
                  <div className="text-xs text-slate-400 mt-1">Analysis Time</div>
                </div>
              </div>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 hover:scale-105">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">7+</div>
                  <div className="text-sm font-semibold text-slate-600">Powerful Tools</div>
                  <div className="text-xs text-slate-400 mt-1">AI Features</div>
                </div>
              </div>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-green-100 hover:border-green-300 hover:scale-105">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">100%</div>
                  <div className="text-sm font-semibold text-slate-600">Secure & Private</div>
                  <div className="text-xs text-slate-400 mt-1">Your Data Safe</div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload area */}
          <Card glass className="p-6 md:p-12 mb-12 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-4 border-dashed rounded-2xl p-8 md:p-16 text-center transition-all duration-300 touch-manipulation ${
                isDragging 
                  ? 'border-prism-500 bg-prism-50/50 scale-105' 
                  : 'border-slate-300 hover:border-prism-400 hover:bg-slate-50/50 active:border-prism-500 active:bg-prism-50/50'
              }`}
            >
              <div className="flex flex-col items-center gap-4 md:gap-6">
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-prism-600 to-accent-purple rounded-2xl flex items-center justify-center shadow-2xl">
                    <Upload className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 md:w-8 md:h-8 bg-accent-pink rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
                    Drop your research papers here
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 mb-4 md:mb-6">
                    or tap to browse • PDF, DOCX, TXT • Up to 50MB
                  </p>

                  <div>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label htmlFor="file-upload">
                      <Button size="lg" className="cursor-pointer" as="span">
                        <FileText className="w-5 h-5 mr-2" />
                        Choose Files
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* How It Works */}
          <div className="mb-20 fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="gradient-text">How It Works</span>
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <StepCard 
                number="1" 
                title="Upload Paper" 
                description="Drop your PDF, DOCX, or TXT file"
                icon={<Upload className="w-6 h-6" />}
              />
              <StepCard 
                number="2" 
                title="AI Analysis" 
                description="Advanced AI processes in seconds"
                icon={<Brain className="w-6 h-6" />}
              />
              <StepCard 
                number="3" 
                title="Explore Insights" 
                description="Navigate through 7 powerful analysis tabs"
                icon={<Sparkles className="w-6 h-6" />}
              />
              <StepCard 
                number="4" 
                title="Export & Share" 
                description="Save as PDF, Markdown, or PowerPoint"
                icon={<FileText className="w-6 h-6" />}
              />
            </div>
          </div>

          {/* Features grid */}
          <div className="mb-20 fade-in-up" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="gradient-text">Powerful Features</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Sparkles className="w-8 h-8" />}
                title="Key Takeaways"
                description="Instantly extract the 3-5 most important contributions from any paper"
                gradient="from-prism-600 to-prism-500"
              />
              <FeatureCard
                icon={<Brain className="w-8 h-8" />}
                title="Deep Analysis"
                description="Get comprehensive breakdowns of methodology, findings, and evidence"
                gradient="from-blue-600 to-blue-500"
              />
              <FeatureCard
                icon={<BookMarked className="w-8 h-8" />}
                title="Critical Critique"
                description="Identify strengths, weaknesses, and areas for improvement"
                gradient="from-accent-purple to-purple-500"
              />
              <FeatureCard
                icon={<Lightbulb className="w-8 h-8" />}
                title="AI Ideation Lab"
                description="Generate novel hypotheses and experimental designs automatically"
                gradient="from-accent-pink to-pink-500"
              />
              <FeatureCard
                icon={<ImageIcon className="w-8 h-8" />}
                title="Figure Analysis"
                description="Extract and explain all figures, charts, and diagrams with AI"
                gradient="from-emerald-600 to-emerald-500"
              />
              <FeatureCard
                icon={<MessageSquare className="w-8 h-8" />}
                title="Interactive Chat"
                description="Ask questions about the paper and get instant AI responses"
                gradient="from-orange-600 to-orange-500"
              />
              <FeatureCard
                icon={<BookMarked className="w-8 h-8" />}
                title="Smart References"
                description="Auto-extract and format citations in APA and BibTeX"
                gradient="from-violet-600 to-violet-500"
              />
              <FeatureCard
                icon={<ExternalLink className="w-8 h-8" />}
                title="Related Papers"
                description="Discover connected research with smart Google Scholar queries"
                gradient="from-rose-600 to-rose-500"
              />
              <FeatureCard
                icon={<Download className="w-8 h-8" />}
                title="Multi-Format Export"
                description="Export your analysis as PDF, Markdown, or PowerPoint"
                gradient="from-indigo-600 to-indigo-500"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 md:px-6 py-6 md:py-8 mt-12 md:mt-20">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <span className="text-2xl">💜</span>
            <p className="text-sm md:text-base font-medium">
              Built with love by{' '}
              <span className="font-bold bg-gradient-to-r from-prism-600 to-accent-purple bg-clip-text text-transparent">
                Mithun
              </span>
              {', '}
              <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Damodar
              </span>
              {', '}
              <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Kaifulla
              </span>
              {' & '}
              <span className="font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                Ranjith
              </span>
            </p>
          </div>
          <p className="text-xs text-slate-400">Powered by Advanced AI • Designed for Researchers</p>
        </div>
      </footer>
    </div>
  );
}

function StepCard({ number, title, description, icon }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-prism-600 via-accent-purple to-accent-pink rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
      <Card glass className="relative p-6 text-center h-full">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-prism-600 to-accent-purple rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {number}
        </div>
        <div className="mb-3 text-prism-600 flex justify-center">
          {icon}
        </div>
        <h4 className="text-lg font-bold text-slate-800 mb-2">{title}</h4>
        <p className="text-slate-600 text-sm">{description}</p>
      </Card>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient }) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-prism-600 via-accent-purple to-accent-pink rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
      <Card glass className="relative p-6 h-full hover:scale-105 transition-all duration-300">
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:shadow-2xl transition-shadow`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
      </Card>
    </div>
  );
}
