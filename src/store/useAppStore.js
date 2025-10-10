import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // User persona
      persona: 'Engineer', // 'Student' | 'Engineer' | 'Expert'
      setPersona: (persona) => set({ persona }),

      // Current analysis state
      currentAnalysis: null,
      setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

      // Multiple papers analysis
      multiPaperAnalysis: null,
      setMultiPaperAnalysis: (analysis) => set({ multiPaperAnalysis: analysis }),

      // Uploaded files
      uploadedFiles: [],
      setUploadedFiles: (files) => set({ uploadedFiles: files }),
      addUploadedFile: (file) => set((state) => ({ 
        uploadedFiles: [...state.uploadedFiles, file] 
      })),
      removeUploadedFile: (fileName) => set((state) => ({ 
        uploadedFiles: state.uploadedFiles.filter(f => f.name !== fileName) 
      })),
      clearUploadedFiles: () => set({ uploadedFiles: [] }),

      // Analysis history (last 10)
      analysisHistory: [],
      addToHistory: (analysis) => set((state) => {
        const newHistory = [analysis, ...state.analysisHistory].slice(0, 10);
        return { analysisHistory: newHistory };
      }),

      // UI state
      activeTab: 'overview',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Chat state
      chatMessages: [],
      addChatMessage: (message) => set((state) => ({ 
        chatMessages: [...state.chatMessages, message] 
      })),
      clearChat: () => set({ chatMessages: [] }),

      // Loading states
      isAnalyzing: false,
      setIsAnalyzing: (value) => set({ isAnalyzing: value }),

      // Glossary
      glossaryTerms: [],
      setGlossaryTerms: (terms) => set({ glossaryTerms: terms }),

      // Reset everything
      resetApp: () => set({
        currentAnalysis: null,
        multiPaperAnalysis: null,
        uploadedFiles: [],
        activeTab: 'overview',
        chatMessages: [],
        isAnalyzing: false,
        glossaryTerms: [],
      }),
    }),
    {
      name: 'prism-storage',
      partialize: (state) => ({
        persona: state.persona,
        analysisHistory: state.analysisHistory,
      }),
    }
  )
);
