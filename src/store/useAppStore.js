import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Generate unique hash for paper content (simple but effective)
const generatePaperHash = (text) => {
  // Use first 1000 + middle 1000 + last 1000 chars to create signature
  const start = text.substring(0, 1000);
  const middle = text.substring(Math.floor(text.length / 2), Math.floor(text.length / 2) + 1000);
  const end = text.substring(text.length - 1000);
  const signature = start + middle + end;
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < signature.length; i++) {
    const char = signature.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};

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

      // Analysis history (last 20, with full cache)
      analysisHistory: [],
      addToHistory: (analysis) => set((state) => {
        // Don't add duplicate if same paper hash exists
        const existingIndex = state.analysisHistory.findIndex(
          h => h.paperHash === analysis.paperHash
        );
        
        let newHistory;
        if (existingIndex !== -1) {
          // Update existing entry, move to top
          newHistory = [
            { ...state.analysisHistory[existingIndex], ...analysis, analyzedAt: new Date().toISOString() },
            ...state.analysisHistory.filter((_, i) => i !== existingIndex)
          ];
        } else {
          // Add new entry
          newHistory = [analysis, ...state.analysisHistory];
        }
        
        return { analysisHistory: newHistory.slice(0, 10) }; // Keep last 10
      }),
      
      // Update an existing analysis (e.g., adding tags)
      updateAnalysis: (paperHash, updates) => set((state) => ({
        analysisHistory: state.analysisHistory.map(item => 
          item.paperHash === paperHash ? { ...item, ...updates } : item
        )
      })),

      // Find existing analysis by paper hash
      findInHistory: (paperHash) => {
        const state = get();
        return state.analysisHistory.find(h => h.paperHash === paperHash);
      },
      
      // Generate paper hash helper
      generatePaperHash,

      // UI state
      activeTab: 'overview',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Chat state
      chatMessages: [],
      addChatMessage: (message) => set((state) => ({ 
        chatMessages: [...state.chatMessages, message] 
      })),
      // Global Chat Modal State
      isChatOpen: false,
      setIsChatOpen: (isOpen) => set({ isChatOpen: isOpen }),

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
