import { useState } from 'react';
import { Image as ImageIcon, Maximize2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Spinner } from '../ui/Spinner';
import { explainFigure } from '../../services/analysisService';

export default function FiguresTab({ figures, paperContext }) {
  const [selectedFigure, setSelectedFigure] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const handleFigureClick = async (figure) => {
    setSelectedFigure(figure);
    setExplanation(null);
    setIsExplaining(true);

    try {
      const result = await explainFigure(
        paperContext || 'Research paper figure',
        figure.caption || '',
        figure.pageNumber
      );
      setExplanation(result.explanation);
    } catch (error) {
      console.error('Error explaining figure:', error);
      setExplanation('Failed to generate explanation. Please try again.');
    } finally {
      setIsExplaining(false);
    }
  };

  if (!figures || figures.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-600 mb-2">No Figures Found</h3>
        <p className="text-slate-500 text-sm">
          This document doesn't contain extractable figures, or they haven't been processed yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in-up">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold gradient-text mb-2">Figures & Visualizations</h2>
        <p className="text-slate-600">Click any figure to get an AI-powered explanation</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {figures.map((figure, i) => (
          <Card 
            key={figure.id || i} 
            className="p-4 hover:shadow-2xl transition-all cursor-pointer group"
            onClick={() => handleFigureClick(figure)}
          >
            <div className="relative overflow-hidden rounded-lg bg-slate-100 mb-3">
              <img 
                src={figure.dataUrl} 
                alt={figure.caption || `Figure ${i + 1}`}
                className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-700">
              {figure.caption || `Figure ${figure.pageNumber || i + 1}`}
            </p>
          </Card>
        ))}
      </div>

      {/* Figure Explanation Modal */}
      {selectedFigure && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedFigure(null)}
          title={selectedFigure.caption || `Figure ${selectedFigure.pageNumber}`}
          size="xl"
        >
          <div className="space-y-6">
            <div className="max-h-96 overflow-hidden rounded-xl border-2 border-slate-200">
              <img 
                src={selectedFigure.dataUrl} 
                alt={selectedFigure.caption}
                className="w-full h-auto"
              />
            </div>

            <div className="p-4 bg-gradient-to-r from-prism-50 to-purple-50 rounded-xl">
              <h3 className="font-bold text-slate-800 mb-3">AI Explanation</h3>
              {isExplaining ? (
                <div className="flex items-center gap-3">
                  <Spinner size="sm" />
                  <p className="text-slate-600">Analyzing figure...</p>
                </div>
              ) : (
                <p className="text-slate-700 leading-relaxed">{explanation}</p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
