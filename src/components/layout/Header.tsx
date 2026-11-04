import { Menu, Search, Settings, Shield, GraduationCap, Users } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import NotificationBell from '../common/NotificationBell';
import { mockUsers } from '../../mock/users';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const breadcrumbMap: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/chat': 'Chat with AI',
  '/app/timetable': 'Timetable',
  '/app/notices': 'Notices',
  '/app/documents': 'Documents',
  '/app/downloads': 'Downloads & Resources',
  '/app/syllabus': 'Syllabus',
  '/app/exam-schedules': 'Exam Schedules',
  '/app/study-plan': 'Study Plan',
  '/app/notes-generator': 'AI Notes',
  '/app/credit-system': 'Credit System',
  '/app/faculty': 'Faculty Directory',
  '/app/placements': 'Placements',
  '/app/admin': 'Admin Panel',
  '/app/evaluation': 'Evaluation',
  '/app/settings': 'Settings',
  '/app/help': 'Help & About',
};

function resolveTitle(pathname: string) {
  if (pathname.startsWith('/app/chat')) return 'Chat with AI';
  return breadcrumbMap[pathname] ?? 'CampusMind';
}

export default function Header() {
  const { toggleSidebar, setCommandPaletteOpen } = useUIStore();
  const { user, login } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const title = resolveTitle(location.pathname);

  const handleQuickRoleSwitch = (role: 'student' | 'faculty' | 'admin') => {
    const target = mockUsers.find(u => u.role === role) || mockUsers[0];
    login(target);
    toast.success(`Switched role to ${role.toUpperCase()}: ${target.name}`);
  };

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center gap-3 px-4 sticky top-0 z-30 no-print"
    >
      <button
        onClick={toggleSidebar}
        className="btn-ghost p-2"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-slate-400">CampusMind</p>
        <h1 className="text-base font-semibold text-slate-900 dark:text-white truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Quick Demo Role Switcher */}
        <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-900 border border-white/10 rounded-xl p-0.5 text-xs font-semibold">
          <button
            onClick={() => handleQuickRoleSwitch('student')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
              user?.role === 'student'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to Student view"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Student
          </button>
          <button
            onClick={() => handleQuickRoleSwitch('faculty')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
              user?.role === 'faculty'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to Faculty view"
          >
            <Users className="w-3.5 h-3.5" />
            Faculty
          </button>
          <button
            onClick={() => handleQuickRoleSwitch('admin')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
              user?.role === 'admin'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to Admin view"
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </button>
        </div>

        {/* Global Search / Command Palette */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm text-slate-500 dark:text-slate-400 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden md:inline ml-2 text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </button>

        <ThemeToggle />
        <NotificationBell />

        <button
          onClick={() => navigate('/app/settings')}
          className="btn-ghost p-2"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </motion.header>
  );
}
