import { useState } from 'react';
import { Copy, Check, BookMarked } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Skeleton, SkeletonGroup } from '../ui/Skeleton';
import { copyToClipboard } from '../../utils/helpers';
import { toast } from '../ui/Toaster';

export default function ReferencesTab({ references }) {
  const [format, setFormat] = useState('apa');
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!references) {
    return (
      <div className="space-y-4">
        <SkeletonGroup count={8} variant="text" />
        <p className="text-center text-slate-600">Extracting references...</p>
      </div>
    );
  }

  if (references.length === 0) {
    return (
      <div className="text-center py-12">
        <BookMarked className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-600 mb-2">No References Found</h3>
        <p className="text-slate-500 text-sm">
          This document doesn't contain a clear bibliography section.
        </p>
      </div>
    );
  }

  const handleCopy = async (text, index) => {
    try {
      await copyToClipboard(text);
      setCopiedIndex(index);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleCopyAll = async () => {
    const allRefs = references.map((ref, i) => 
      format === 'apa' ? `${i + 1}. ${ref.apa}` : ref.bibtex
    ).join('\n\n');
    
    try {
      await copyToClipboard(allRefs);
      toast.success('All references copied!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text">References ({references.length})</h2>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setFormat('apa')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                format === 'apa' 
                  ? 'bg-white text-prism-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              APA
            </button>
            <button
              onClick={() => setFormat('bibtex')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                format === 'bibtex' 
                  ? 'bg-white text-prism-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              BibTeX
            </button>
          </div>
          <Button variant="secondary" size="sm" onClick={handleCopyAll}>
            <Copy className="w-4 h-4 mr-2" />
            Copy All
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {references.map((ref, i) => (
          <Card key={i} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-prism-100 rounded-full flex items-center justify-center text-prism-700 font-bold text-sm">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                {format === 'apa' ? (
                  <p className="text-slate-700 text-sm leading-relaxed">{ref.apa}</p>
                ) : (
                  <pre className="text-slate-700 text-xs font-mono bg-slate-50 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {ref.bibtex}
                  </pre>
                )}
              </div>
              <button
                onClick={() => handleCopy(format === 'apa' ? ref.apa : ref.bibtex, i)}
                className="flex-shrink-0 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {copiedIndex === i ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
