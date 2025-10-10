import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Metrics Store - Tracks evaluation metrics for IEEE validation
 */
export const useMetricsStore = create(
  persist(
    (set, get) => ({
      // Evaluation metrics for each analysis
      evaluations: [],
      
      // Aggregate statistics
      statistics: {
        totalPapersAnalyzed: 0,
        totalProcessingTime: 0,
        averageQualityScore: 0,
        averageRouge2F1: 0,
        averageSemanticSimilarity: 0,
        averageCitationAccuracy: 0,
        totalCitationsVerified: 0,
        correctCitations: 0,
        lastUpdated: null
      },
      
      // User interaction metrics
      userMetrics: {
        sessionStart: Date.now(),
        papersUploaded: 0,
        analysesGenerated: 0,
        critiquesGenerated: 0,
        figuresExplained: 0,
        exportsPerformed: 0,
        chatMessages: 0,
        timeSpentAnalyzing: 0,
        timeSpentReading: 0
      },
      
      // Add evaluation result
      addEvaluation: (evaluation) => {
        set((state) => {
          const newEvaluations = [...state.evaluations, evaluation];
          
          // Update aggregate statistics
          const stats = {
            totalPapersAnalyzed: newEvaluations.length,
            totalProcessingTime: newEvaluations.reduce((sum, e) => 
              sum + parseFloat(e.metrics.performance.processingTime), 0
            ),
            averageQualityScore: newEvaluations.reduce((sum, e) => 
              sum + e.qualityScore, 0
            ) / newEvaluations.length,
            averageRouge2F1: newEvaluations.reduce((sum, e) => 
              sum + parseFloat(e.metrics.rouge2.f1), 0
            ) / newEvaluations.length,
            averageSemanticSimilarity: newEvaluations.reduce((sum, e) => 
              sum + parseFloat(e.metrics.semanticSimilarity), 0
            ) / newEvaluations.length,
            averageCitationAccuracy: newEvaluations.reduce((sum, e) => 
              sum + parseFloat(e.metrics.citationAccuracy.accuracy || 0), 0
            ) / newEvaluations.length,
            totalCitationsVerified: newEvaluations.reduce((sum, e) => 
              sum + e.metrics.citationAccuracy.totalCitations, 0
            ),
            correctCitations: newEvaluations.reduce((sum, e) => 
              sum + e.metrics.citationAccuracy.correctCitations, 0
            ),
            lastUpdated: new Date().toISOString()
          };
          
          return {
            evaluations: newEvaluations,
            statistics: stats
          };
        });
      },
      
      // Update user metrics
      updateUserMetrics: (updates) => {
        set((state) => ({
          userMetrics: { ...state.userMetrics, ...updates }
        }));
      },
      
      // Increment counter
      incrementMetric: (metric) => {
        set((state) => ({
          userMetrics: {
            ...state.userMetrics,
            [metric]: (state.userMetrics[metric] || 0) + 1
          }
        }));
      },
      
      // Track time spent
      trackTimeSpent: (activity, seconds) => {
        set((state) => ({
          userMetrics: {
            ...state.userMetrics,
            [activity]: (state.userMetrics[activity] || 0) + seconds
          }
        }));
      },
      
      // Get all metrics for export
      getAllMetrics: () => {
        const state = get();
        return {
          statistics: state.statistics,
          userMetrics: state.userMetrics,
          evaluations: state.evaluations,
          exportedAt: new Date().toISOString()
        };
      },
      
      // Reset metrics (for testing)
      resetMetrics: () => {
        set({
          evaluations: [],
          statistics: {
            totalPapersAnalyzed: 0,
            totalProcessingTime: 0,
            averageQualityScore: 0,
            averageRouge2F1: 0,
            averageSemanticSimilarity: 0,
            averageCitationAccuracy: 0,
            totalCitationsVerified: 0,
            correctCitations: 0,
            lastUpdated: null
          },
          userMetrics: {
            sessionStart: Date.now(),
            papersUploaded: 0,
            analysesGenerated: 0,
            critiquesGenerated: 0,
            figuresExplained: 0,
            exportsPerformed: 0,
            chatMessages: 0,
            timeSpentAnalyzing: 0,
            timeSpentReading: 0
          }
        });
      }
    }),
    {
      name: 'prism-metrics-storage',
      version: 1
    }
  )
);
