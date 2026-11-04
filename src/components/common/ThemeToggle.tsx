import { Moon, Sun } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme } = useSettingsStore();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="btn-ghost p-2 rounded-lg"
      aria-label="Toggle theme"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -30, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 30, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-500" />
        ) : (
          <Moon className="w-5 h-5 text-slate-600" />
        )}
      </motion.div>
    </motion.button>
  );
}
