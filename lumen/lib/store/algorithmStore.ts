import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AlgorithmCategory, AlgorithmInput, Language } from "@/lib/types/algorithm";

export interface Preset {
  id: string;
  name: string;
  algorithmSlug: string;
  category: AlgorithmCategory;
  input: AlgorithmInput;
  speed: number;
  createdAt: number;
}

interface AlgorithmState {
  selectedCategory: AlgorithmCategory;
  selectedSlug: string;
  input: AlgorithmInput | null;
  inputSize: number;
  language: Language;
  compareSlug: string | null;
  compareMode: boolean;
  presets: Preset[];
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  codeEditorOpen: boolean;
  codeEditorHeight: number;

  // Actions
  selectAlgorithm: (category: AlgorithmCategory, slug: string) => void;
  setInput: (input: AlgorithmInput) => void;
  setInputSize: (size: number) => void;
  setLanguage: (lang: Language) => void;
  setCompareSlug: (slug: string | null) => void;
  toggleCompareMode: () => void;
  savePreset: (name: string, input: AlgorithmInput, speed: number) => void;
  deletePreset: (id: string) => void;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  toggleCodeEditor: () => void;
  setCodeEditorHeight: (h: number) => void;
}

export const useAlgorithmStore = create<AlgorithmState>()(
  persist(
    (set, get) => ({
      selectedCategory: "sorting",
      selectedSlug: "bubble-sort",
      input: [64, 34, 25, 12, 22, 11, 90],
      inputSize: 20,
      language: "javascript",
      compareSlug: null,
      compareMode: false,
      presets: [],
      sidebarOpen: true,
      rightPanelOpen: true,
      codeEditorOpen: true,
      codeEditorHeight: 320,

      selectAlgorithm: (category, slug) =>
        set({ selectedCategory: category, selectedSlug: slug, input: null }),

      setInput: (input) => set({ input }),
      setInputSize: (inputSize) => set({ inputSize }),
      setLanguage: (language) => set({ language }),
      setCompareSlug: (slug) => set({ compareSlug: slug }),
      toggleCompareMode: () => set((s) => ({ compareMode: !s.compareMode })),

      savePreset: (name, input, speed) => {
        const { selectedSlug, selectedCategory } = get();
        const preset: Preset = {
          id: crypto.randomUUID(),
          name,
          algorithmSlug: selectedSlug,
          category: selectedCategory,
          input,
          speed,
          createdAt: Date.now(),
        };
        set((s) => ({ presets: [...s.presets, preset] }));
      },

      deletePreset: (id) =>
        set((s) => ({ presets: s.presets.filter((p) => p.id !== id) })),

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
      toggleCodeEditor: () => set((s) => ({ codeEditorOpen: !s.codeEditorOpen })),
      setCodeEditorHeight: (h) => set({ codeEditorHeight: h }),
    }),
    {
      name: "lumen-algorithm-store",
      partialize: (s) => ({
        language: s.language,
        presets: s.presets,
        sidebarOpen: s.sidebarOpen,
        rightPanelOpen: s.rightPanelOpen,
        codeEditorOpen: s.codeEditorOpen,
        codeEditorHeight: s.codeEditorHeight,
      }),
    }
  )
);
