import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, Calendar, Bell, FileText,
  Settings, HelpCircle, LogOut, Shield, BarChart3, X, Bot, ChevronRight,
  Download, BookOpen, CalendarClock, Target, Sparkles, Award, Users, Briefcase,
  PanelLeftClose, PanelLeft
} from 'lucide-react';
import { cn, getInitials } from '../../lib/utils';
import { toast } from 'sonner';

type NavItem = {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: string[];
};

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: 'Overview',
    items: [
      { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['student', 'faculty', 'admin'] },
      { path: '/app/chat', label: 'Chat with AI', icon: MessageSquare, roles: ['student', 'faculty', 'admin'] },
    ],
  },
  {
    title: 'Academics',
    items: [
      { path: '/app/timetable', label: 'Timetable', icon: Calendar, roles: ['student', 'faculty', 'admin'] },
      { path: '/app/syllabus', label: 'Syllabus', icon: BookOpen, roles: ['student', 'faculty', 'admin'] },
      { path: '/app/exam-schedules', label: 'Exam Schedules', icon: CalendarClock, roles: ['student', 'faculty', 'admin'] },
      { path: '/app/credit-system', label: 'Credit System', icon: Award, roles: ['student', 'faculty', 'admin'] },
      { path: '/app/faculty', label: 'Faculty', icon: Users, roles: ['student', 'faculty', 'admin'] },
    ],
  },
  {
    title: 'Campus',
    items: [
      { path: '/app/notices', label: 'Notices', icon: Bell, roles: ['student', 'faculty', 'admin'] },
      { path: '/app/documents', label: 'Documents', icon: FileText, roles: ['student', 'faculty', 'admin'] },
      { path: '/app/downloads', label: 'Downloads', icon: Download, roles: ['student', 'faculty', 'admin'] },
      { path: '/app/placements', label: 'Placements', icon: Briefcase, roles: ['student', 'faculty', 'admin'] },
    ],
  },
  {
    title: 'Study tools',
    items: [
      { path: '/app/study-plan', label: 'Study Plan', icon: Target, roles: ['student', 'faculty', 'admin'] },
      { path: '/app/notes-generator', label: 'AI Notes', icon: Sparkles, roles: ['student', 'faculty', 'admin'] },
    ],
  },
  {
    title: 'Admin',
    items: [
      { path: '/app/admin', label: 'Admin Panel', icon: Shield, roles: ['admin'] },
      { path: '/app/evaluation', label: 'Evaluation', icon: BarChart3, roles: ['admin'] },
    ],
  },
  {
    title: 'Account',
    items: [
      { path: '/app/settings', label: 'Settings', icon: Settings, roles: ['student', 'faculty', 'admin'] },
      { path: '/app/help', label: 'Help & About', icon: HelpCircle, roles: ['student', 'faculty', 'admin'] },
    ],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 268 : 0 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className={cn(
          'h-full flex-shrink-0 overflow-hidden',
          'fixed lg:relative z-50 lg:z-auto',
          'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl',
          'border-r border-slate-200 dark:border-slate-800'
        )}
      >
        <div className="w-[268px] h-full flex flex-col">
          <div className="flex items-center justify-between px-4 h-14 border-b border-slate-200 dark:border-slate-800">
            <Link to="/app/dashboard" className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center shadow-md shadow-primary-500/30">
                <Bot className="text-white" size={18} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 dark:text-white leading-tight">CampusMind</p>
                <p className="text-[10px] text-slate-400 truncate">WCE Sangli</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="btn-ghost p-1.5 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={toggleSidebar}
              className="btn-ghost p-1.5 hidden lg:inline-flex"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-4">
            {navGroups.map((group) => {
              const items = group.items.filter((item) => user && item.roles.includes(user.role));
              if (items.length === 0) return null;
              return (
                <div key={group.title}>
                  <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {group.title}
                  </p>
                  <div className="space-y-0.5">
                    {items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                          className={cn('sidebar-link', active && 'active')}
                        >
                          <Icon className="flex-shrink-0" size={18} />
                          <span className="truncate">{item.label}</span>
                          {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {user && (
            <div className="p-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/70">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {getInitials(user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role} · {user.department}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.aside>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="hidden lg:flex fixed left-3 bottom-4 z-40 w-10 h-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700"
          aria-label="Open sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
      )}
    </>
  );
}
