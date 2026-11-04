import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, MessageSquare, Calendar, Bell, FileText, Settings, HelpCircle,
  Shield, BarChart3, ArrowRight, Download, BookOpen, CalendarClock, Target, Sparkles, Award, Users, Briefcase, LogOut
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

const commands = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard', category: 'Navigation', roles: ['student','faculty','admin'] },
  { id: 'chat', label: 'Chat with AI', icon: MessageSquare, path: '/app/chat', category: 'Navigation', roles: ['student','faculty','admin'] },
  { id: 'timetable', label: 'Timetable', icon: Calendar, path: '/app/timetable', category: 'Academics', roles: ['student','faculty','admin'] },
  { id: 'syllabus', label: 'Syllabus', icon: BookOpen, path: '/app/syllabus', category: 'Academics', roles: ['student','faculty','admin'] },
  { id: 'exams', label: 'Exam Schedules', icon: CalendarClock, path: '/app/exam-schedules', category: 'Academics', roles: ['student','faculty','admin'] },
  { id: 'credits', label: 'Credit System', icon: Award, path: '/app/credit-system', category: 'Academics', roles: ['student','faculty','admin'] },
  { id: 'faculty', label: 'Faculty Directory', icon: Users, path: '/app/faculty', category: 'Academics', roles: ['student','faculty','admin'] },
  { id: 'notices', label: 'Notices', icon: Bell, path: '/app/notices', category: 'Campus', roles: ['student','faculty','admin'] },
  { id: 'documents', label: 'Documents', icon: FileText, path: '/app/documents', category: 'Campus', roles: ['student','faculty','admin'] },
  { id: 'downloads', label: 'Downloads', icon: Download, path: '/app/downloads', category: 'Campus', roles: ['student','faculty','admin'] },
  { id: 'placements', label: 'Placements', icon: Briefcase, path: '/app/placements', category: 'Campus', roles: ['student','faculty','admin'] },
  { id: 'study', label: 'Study Plan', icon: Target, path: '/app/study-plan', category: 'Tools', roles: ['student','faculty','admin'] },
  { id: 'notes', label: 'AI Notes', icon: Sparkles, path: '/app/notes-generator', category: 'Tools', roles: ['student','faculty','admin'] },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/app/settings', category: 'Account', roles: ['student','faculty','admin'] },
  { id: 'help', label: 'Help & About', icon: HelpCircle, path: '/app/help', category: 'Account', roles: ['student','faculty','admin'] },
  { id: 'admin', label: 'Admin Panel', icon: Shield, path: '/app/admin', category: 'Admin', roles: ['admin'] },
  { id: 'evaluation', label: 'Evaluation', icon: BarChart3, path: '/app/evaluation', category: 'Admin', roles: ['admin'] },
  { id: 'logout', label: 'Log out', icon: LogOut, path: '__logout__', category: 'Account', roles: ['student','faculty','admin'] },
];

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { user, logout } = useAuthStore();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') setCommandPaletteOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setCommandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelected(0);
    }
  }, [commandPaletteOpen]);

  const filtered = commands.filter(c => {
    const matchRole = user && c.roles.includes(user.role);
    const matchQuery = c.label.toLowerCase().includes(query.toLowerCase());
    return matchRole && matchQuery;
  });

  const handleSelect = (path: string) => {
    setCommandPaletteOpen(false);
    if (path === '__logout__') {
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
      return;
    }
    navigate(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && filtered[selected]) { handleSelect(filtered[selected].path); }
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCommandPaletteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-lg card shadow-2xl overflow-hidden z-10"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setSelected(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Search pages and actions..."
                className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none text-sm"
              />
              <kbd className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded font-mono text-slate-500">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No results found</p>
              ) : (
                filtered.map((cmd, i) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => handleSelect(cmd.path)}
                      onMouseEnter={() => setSelected(i)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                        i === selected
                          ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-sm font-medium">{cmd.label}</span>
                      <span className="text-xs text-slate-400">{cmd.category}</span>
                      {i === selected && <ArrowRight className="w-4 h-4" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
