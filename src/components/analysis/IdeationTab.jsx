import { Lightbulb, FlaskConical, Target } from 'lucide-react';
import { Card } from '../ui/Card';
import { Skeleton, SkeletonGroup } from '../ui/Skeleton';

export default function IdeationTab({ analysis }) {
  if (!analysis?.hypotheses) {
    return (
      <div className="space-y-6">
        <SkeletonGroup count={3} variant="card" />
        <p className="text-center text-slate-600">Generating novel hypotheses and experimental designs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-accent-purple to-accent-pink text-white rounded-2xl shadow-lg mb-4">
          <Lightbulb className="w-6 h-6" />
          <span className="font-bold text-lg">AI-Generated Research Ideas</span>
        </div>
        <p className="text-slate-600 max-w-2xl mx-auto">
          These novel hypotheses extend from the paper's findings and limitations. 
          Each includes a proposed experimental design.
        </p>
      </div>

      <div className="space-y-6">
        {analysis.hypotheses?.map((hyp, i) => (
          <Card key={i} className="p-6 border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {i + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Hypothesis {i + 1}</h3>
                <p className="text-slate-700 leading-relaxed">{hyp.hypothesis}</p>
              </div>
            </div>

            <div className="space-y-4 ml-16">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Experimental Design</h4>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">{hyp.experimentalDesign}</p>
              </div>

              {hyp.expectedOutcome && (
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">Expected Outcome</h4>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{hyp.expectedOutcome}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
