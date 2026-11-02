import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'te';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en', // Default as English
      setLanguage: (lang: Language) => set({ language: lang }),
      toggleLanguage: () =>
        set((state) => ({ language: state.language === 'en' ? 'te' : 'en' })),
    }),
    {
      name: 'str_language_preference',
    }
  )
);

