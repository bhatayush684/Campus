import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings, RAGSettings } from '../types';

interface SettingsState extends AppSettings {
  ragSettings: RAGSettings;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: AppSettings['language']) => void;
  toggleEmailNotifications: () => void;
  togglePushNotifications: () => void;
  toggleSound: () => void;
  updateRAGSettings: (settings: RAGSettings) => void;
}

const defaultRAGSettings: RAGSettings = {
  model: 'gemini-1.5-pro',
  chunkSize: 512,
  topK: 5,
  temperature: 0.7,
  maxTokens: 1024,
  similarityThreshold: 0.75,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      language: 'en',
      emailNotifications: true,
      pushNotifications: true,
      soundEnabled: false,
      ragSettings: defaultRAGSettings,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleEmailNotifications: () =>
        set((s) => ({ emailNotifications: !s.emailNotifications })),
      togglePushNotifications: () =>
        set((s) => ({ pushNotifications: !s.pushNotifications })),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      updateRAGSettings: (ragSettings) => set({ ragSettings }),
    }),
    { name: 'campus-mind-settings' }
  )
);
