import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { Skeleton, SkeletonGroup } from '../ui/Skeleton';

export default function CritiqueTab({ analysis }) {
  if (!analysis?.strengths && !analysis?.weaknesses) {
    return (
      <div className="space-y-6">
        <SkeletonGroup count={5} variant="card" />
        <p className="text-center text-slate-600">Analyzing strengths and weaknesses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in-up">
      {/* Strengths */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <ThumbsUp className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Strengths</h2>
        </div>
        <div className="space-y-4">
          {analysis.strengths?.map((strength, i) => (
            <Card key={i} className="p-5 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 font-medium mb-2">{strength.point}</p>
                  <div className="pl-3 border-l-2 border-slate-200">
                    <p className="text-sm text-slate-600 italic">
                      Evidence: "{strength.evidence}"
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Weaknesses */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <ThumbsDown className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Weaknesses & Limitations</h2>
        </div>
        <div className="space-y-4">
          {analysis.weaknesses?.map((weakness, i) => (
            <Card key={i} className="p-5 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 font-medium mb-2">{weakness.point}</p>
                  <div className="pl-3 border-l-2 border-slate-200">
                    <p className="text-sm text-slate-600 italic">
                      Evidence: "{weakness.evidence}"
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
