import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Skeleton, SkeletonGroup } from '../ui/Skeleton';
import { regenerateSummary } from '../../services/analysisService';
import { toast } from '../ui/Toaster';

export default function OverviewTab({ analysis }) {
  const [customSummary, setCustomSummary] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [summaryParams, setSummaryParams] = useState({
    persona: 'Engineer',
    length: 'medium',
    depth: 'balanced'
  });

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const result = await regenerateSummary(
        analysis.summary, 
        summaryParams.persona,
        summaryParams.length,
        summaryParams.depth
      );
      setCustomSummary(result.summary);
      toast.success('Summary regenerated!');
    } catch (error) {
      toast.error('Failed to regenerate summary');
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!analysis) {
    return <SkeletonGroup count={10} variant="text" />;
  }

  return (
    <div className="space-y-8 fade-in-up">
      {/* Summary Controls */}
      <Card className="p-4 bg-gradient-to-r from-prism-50 to-purple-50">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Customize Summary</h3>
        <div className="grid md:grid-cols-3 gap-3 mb-3">
          <select 
            className="input-field py-2 text-sm"
            value={summaryParams.persona}
            onChange={(e) => setSummaryParams({...summaryParams, persona: e.target.value})}
          >
            <option value="Student">Student Level</option>
            <option value="Engineer">Engineer Level</option>
            <option value="Expert">Expert Level</option>
          </select>
          <select 
            className="input-field py-2 text-sm"
            value={summaryParams.length}
            onChange={(e) => setSummaryParams({...summaryParams, length: e.target.value})}
          >
            <option value="short">Short (100-150 words)</option>
            <option value="medium">Medium (200-300 words)</option>
            <option value="long">Long (400-500 words)</option>
          </select>
          <select 
            className="input-field py-2 text-sm"
            value={summaryParams.depth}
            onChange={(e) => setSummaryParams({...summaryParams, depth: e.target.value})}
          >
            <option value="high_level">High Level</option>
            <option value="balanced">Balanced</option>
            <option value="technical">Technical</option>
          </select>
        </div>
        <Button size="sm" onClick={handleRegenerate} disabled={isRegenerating} className="w-full">
          <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
          Regenerate Summary
        </Button>
      </Card>

      {/* Summary */}
      <Section title="Summary">
        <p className="text-slate-700 leading-relaxed">
          {customSummary || analysis.summary}
        </p>
      </Section>

      {/* Problem Statement */}
      <Section title="Problem Statement">
        <p className="text-slate-700 leading-relaxed">
          {analysis.problemStatement}
        </p>
      </Section>

      {/* Methodology */}
      <Section title="Methodology">
        <p className="text-slate-700 leading-relaxed">
          {analysis.methodology}
        </p>
      </Section>

      {/* Key Findings */}
      <Section title="Key Findings">
        <div className="space-y-4">
          {analysis.keyFindings?.map((finding, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-xl border-l-4 border-prism-500">
              <h4 className="font-semibold text-slate-800 mb-2">Finding {i + 1}</h4>
              <p className="text-slate-700 mb-3">{finding.finding}</p>
              <div className="pl-4 border-l-2 border-slate-300">
                <p className="text-sm text-slate-600 italic">
                  <strong>Evidence:</strong> "{finding.evidence}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-bold gradient-text mb-4">{title}</h2>
      {children}
    </div>
  );
}
