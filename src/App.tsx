import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppRouter from './router';
import { useSettingsStore } from './store/settingsStore';
import { useLayoutEffect } from 'react';
import CommandPalette from './components/common/CommandPalette';
import AppErrorBoundary from './components/common/AppErrorBoundary';

function App() {
  const theme = useSettingsStore(s => s.theme);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  }, [theme]);

  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <AppRouter />
        <CommandPalette />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: theme === 'dark' ? '#1e293b' : '#ffffff',
              color: theme === 'dark' ? '#f8fafc' : '#0f172a',
              border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
            },
          }}
          richColors
        />
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;
