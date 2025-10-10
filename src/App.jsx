import { Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/Toaster';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import MultiPaperPage from './pages/MultiPaperPage';
import HistoryPage from './pages/HistoryPage';
import MetricsPage from './pages/MetricsPage';

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/multi-paper" element={<MultiPaperPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/metrics" element={<MetricsPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
