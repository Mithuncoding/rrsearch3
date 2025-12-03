import { useEffect, useState, useRef } from 'react';
import { Card } from '../ui/Card';
import { BarChart3, Clock, BookOpen, Hash } from 'lucide-react';
import cloud from 'd3-cloud';

export default function AnalyticsTab({ analysis, fullText }) {
  const [wordCloudData, setWordCloudData] = useState([]);
  const [readability, setReadability] = useState(null);
  const [citationTimeline, setCitationTimeline] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (fullText) {
      generateAnalytics(fullText);
    }
  }, [fullText]);

  const generateAnalytics = (text) => {
    // 1. Word Cloud Logic
    const stopWords = new Set(['the', 'and', 'of', 'to', 'a', 'in', 'is', 'that', 'for', 'it', 'as', 'was', 'with', 'on', 'by', 'are', 'be', 'this', 'an', 'at', 'from', 'or', 'which', 'but', 'not', 'can', 'has', 'have', 'we', 'our', 'their', 'all', 'also', 'more', 'one', 'use', 'used', 'using', 'based', 'data', 'results', 'model', 'paper', 'proposed', 'method', 'system', 'analysis', 'study', 'et', 'al']);
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopWords.has(w));

    const frequency = {};
    words.forEach(w => frequency[w] = (frequency[w] || 0) + 1);

    const topWords = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
      .map(([text, size]) => ({ text, size: 10 + Math.sqrt(size) * 5 }));

    setWordCloudData(topWords);

    // 2. Readability Logic (Flesch-Kincaid)
    const sentences = text.split(/[.!?]+/).length;
    const wordCount = words.length; // Approximate
    const syllables = countSyllables(text);
    
    const gradeLevel = 0.39 * (wordCount / sentences) + 11.8 * (syllables / wordCount) - 15.59;
    const readingTime = Math.ceil(wordCount / 200); // 200 wpm

    setReadability({
      gradeLevel: Math.max(0, gradeLevel).toFixed(1),
      readingTime,
      wordCount,
      sentenceCount: sentences
    });

    // 3. Citation Timeline Logic
    const yearRegex = /\b(19|20)\d{2}\b/g;
    const years = text.match(yearRegex) || [];
    const yearCounts = {};
    years.forEach(y => {
      const year = parseInt(y);
      if (year >= 1950 && year <= new Date().getFullYear()) {
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      }
    });

    const timeline = Object.entries(yearCounts)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year - b.year);

    setCitationTimeline(timeline);
  };

  const countSyllables = (text) => {
    // Simple heuristic for syllable counting
    return text.length / 3; 
  };

  // Draw Word Cloud
  useEffect(() => {
    if (wordCloudData.length > 0 && canvasRef.current) {
      const layout = cloud()
        .size([600, 300])
        .words(wordCloudData)
        .padding(5)
        .rotate(() => (~~(Math.random() * 2) * 90))
        .font("Impact")
        .fontSize(d => d.size)
        .on("end", draw);

      layout.start();

      function draw(words) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.translate(300, 150);

        words.forEach(word => {
          ctx.font = `${word.size}px Impact`;
          ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
          ctx.fillText(word.text, word.x, word.y);
        });
      }
    }
  }, [wordCloudData]);

  return (
    <div className="space-y-6">
      {/* Readability Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-blue-600 font-semibold">Complexity</p>
              <p className="text-xl font-bold text-slate-800">Grade {readability?.gradeLevel || '-'}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-green-50 border-green-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-green-600 font-semibold">Reading Time</p>
              <p className="text-xl font-bold text-slate-800">{readability?.readingTime || '-'} min</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-purple-50 border-purple-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Hash className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-purple-600 font-semibold">Word Count</p>
              <p className="text-xl font-bold text-slate-800">{readability?.wordCount?.toLocaleString() || '-'}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-orange-50 border-orange-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-orange-600 font-semibold">Sentences</p>
              <p className="text-xl font-bold text-slate-800">{readability?.sentenceCount?.toLocaleString() || '-'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Word Cloud */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Topic Word Cloud</h3>
        <div className="flex justify-center">
          <canvas ref={canvasRef} width={600} height={300} className="max-w-full" />
        </div>
      </Card>

      {/* Citation Timeline */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Citation Timeline</h3>
        <div className="h-48 flex items-end gap-1 overflow-x-auto pb-2">
          {citationTimeline.map((item, i) => (
            <div key={i} className="flex flex-col items-center group relative">
              <div 
                className="w-8 bg-prism-500 rounded-t-sm hover:bg-prism-600 transition-colors"
                style={{ height: `${Math.min(item.count * 10, 150)}px` }}
              ></div>
              <span className="text-xs text-slate-500 mt-1 rotate-45 origin-left">{item.year}</span>
              <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {item.count} citations
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
