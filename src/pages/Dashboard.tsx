import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { apiGetConversations, apiGetDocuments, apiGetNotices, apiGetTimetable } from '../services/api';
import { TimetableEntry, KnowledgeDocument } from '../types';
import { motion } from 'framer-motion';
import { MessageSquare, Calendar, Bell, FileText, TrendingUp, BookOpen, Users, BarChart3, Upload, ArrowRight, Plus, Download, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, formatDate, getCategoryColor } from '../lib/utils';

function StatCard({ icon: Icon, label, value, trend, color, delay }: {
  icon: any; label: string; value: string | number; trend?: string; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="card p-5 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </span>
          )}
        </div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const { conversations, setConversations } = useChatStore();
  const [notices, setNotices] = useState<any[]>([]);
  const [todayClasses, setTodayClasses] = useState<TimetableEntry[]>([]);
  const [documentCount, setDocumentCount] = useState(0);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const dayName = new Date().toLocaleDateString('en-IN', { weekday: 'long' }) as any;

  useEffect(() => {
    if (!user) return;
    Promise.all([
      apiGetConversations(user.id).then(setConversations),
      apiGetNotices().then(data => setNotices(data.slice(0, 5))),
      apiGetTimetable(user.role === 'student'
        ? { department: user.department, year: user.year, division: user.division }
        : { department: user.department })
        .then(data => setTodayClasses(data.filter(item => item.day === dayName))),
      apiGetDocuments().then((docs: KnowledgeDocument[]) => setDocumentCount(docs.length)),
    ]).catch(() => {
      setTodayClasses([]);
      setDocumentCount(0);
    });
  }, [user]);

  const recentChats = conversations.slice(0, 4);
  const pinnedNotices = notices.filter(n => n.isPinned);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
              <span className="gradient-text">{user?.name.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400">{today}</p>
          </div>
        </div>
      </motion.div>

      {/* Student Dashboard */}
      {user?.role === 'student' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={MessageSquare} label="Total Chats" value={conversations.length} trend="+2 today" color="bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400" delay={0} />
            <StatCard icon={Calendar} label="Classes Today" value={todayClasses.length} color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" delay={0.1} />
            <StatCard icon={Bell} label="Pinned Notices" value={pinnedNotices.length} color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" delay={0.2} />
            <StatCard icon={BookOpen} label="Documents" value={documentCount} color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" delay={0.3} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Today's Classes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-5 lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  Today's Classes
                </h2>
                <Link to="/app/timetable" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                  Full schedule <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {todayClasses.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Calendar className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No classes today</p>
                  <p className="text-xs mt-1">Enjoy your free day!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayClasses.map((cls, i) => (
                    <motion.div
                      key={cls.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all group"
                    >
                      <div className="w-2 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: cls.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{cls.subject}</p>
                        <p className="text-xs text-slate-500">{cls.faculty} · {cls.room}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{cls.startTime}</p>
                        <p className="text-xs text-slate-400">{cls.type}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-5"
            >
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Ask AI', icon: MessageSquare, path: '/app/chat', color: 'from-violet-500 to-purple-600' },
                  { label: 'Timetable', icon: Calendar, path: '/app/timetable', color: 'from-blue-500 to-cyan-600' },
                  { label: 'Notices', icon: Bell, path: '/app/notices', color: 'from-amber-500 to-orange-600' },
                  { label: 'Study Plan', icon: BookOpen, path: '/app/study-plan', color: 'from-emerald-500 to-teal-600' },
                  { label: 'Credits', icon: BarChart3, path: '/app/credit-system', color: 'from-pink-500 to-rose-600' },
                  { label: 'Faculty', icon: Users, path: '/app/faculty', color: 'from-slate-500 to-slate-600' },
                ].map((action, i) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                  >
                    <Link
                      to={action.path}
                      className={`flex flex-col items-center gap-2 p-4 bg-gradient-to-br ${action.color} rounded-xl text-white font-medium text-sm hover:opacity-90 hover:scale-105 transition-all shadow-lg`}
                    >
                      <action.icon className="w-5 h-5" />
                      <span>{action.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Latest Notices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  Latest Notices
                </h2>
                <Link to="/app/notices" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                  All notices <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {notices.slice(0, 4).map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                  <Link
                    to="/app/notices"
                    className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer group"
                  >
                    <span className={cn('badge flex-shrink-0 mt-0.5', getCategoryColor(n.category))}>{n.category}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{n.title}</p>
                      <p className="text-xs text-slate-400">{formatDate(n.date)}</p>
                    </div>
                    {n.isPinned && <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />}
                  </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Chats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-violet-500" />
                  Recent Chats
                </h2>
                <Link to="/app/chat" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                  All chats <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {recentChats.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <MessageSquare className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No conversations yet</p>
                  <Link to="/app/chat" className="btn-primary mt-4 text-sm py-2">
                    <Plus className="w-3.5 h-3.5" /> Start Chatting
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentChats.map((conv, i) => (
                    <motion.div
                      key={conv.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                    >
                      <Link
                        to={`/app/chat/${conv.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                          <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{conv.title}</p>
                          <p className="text-xs text-slate-400">{conv.messages.length} messages</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}

      {/* Faculty Dashboard */}
      {user?.role === 'faculty' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Calendar} label="Lectures Today" value={3} color="bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400" delay={0} />
            <StatCard icon={Upload} label="Uploaded Docs" value={4} color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" delay={0.1} />
            <StatCard icon={MessageSquare} label="Chats" value={conversations.length} color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" delay={0.2} />
            <StatCard icon={Bell} label="Notices" value={notices.length} color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" delay={0.3} />
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-5"
            >
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                My Lectures Today
              </h2>
              <div className="space-y-3">
                {todayClasses.filter(t => {
                  const name = (user?.name ?? '').toLowerCase();
                  const last = name.split(' ').pop() ?? '';
                  return t.faculty.toLowerCase().includes(last);
                }).slice(0, 4).map((cls, i) => (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    <div className="w-2 h-12 rounded-full" style={{ backgroundColor: cls.color }} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{cls.subject}</p>
                      <p className="text-xs text-slate-500">{cls.department} {cls.year} {cls.division} · {cls.room}</p>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{cls.startTime}–{cls.endTime}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-5"
            >
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Upload Docs', icon: Upload, path: '/app/documents', color: 'from-violet-500 to-purple-600' },
                  { label: 'Ask AI', icon: MessageSquare, path: '/app/chat', color: 'from-blue-500 to-cyan-600' },
                  { label: 'Timetable', icon: Calendar, path: '/app/timetable', color: 'from-emerald-500 to-teal-600' },
                  { label: 'Notices', icon: Bell, path: '/app/notices', color: 'from-amber-500 to-orange-600' },
                  { label: 'Downloads', icon: Download, path: '/app/downloads', color: 'from-pink-500 to-rose-600' },
                  { label: 'Settings', icon: Users, path: '/app/settings', color: 'from-slate-500 to-slate-600' },
                ].map((a, i) => (
                  <motion.div
                    key={a.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                  >
                    <Link to={a.path} className={`flex flex-col items-center gap-2 p-4 bg-gradient-to-br ${a.color} rounded-xl text-white font-medium text-sm hover:opacity-90 hover:scale-105 transition-all shadow-lg`}>
                      <a.icon className="w-5 h-5" />
                      <span>{a.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Admin Dashboard */}
      {user?.role === 'admin' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total Users" value={8} trend="+1 this week" color="bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400" delay={0} />
            <StatCard icon={MessageSquare} label="Queries Today" value={76} trend="+12%" color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" delay={0.1} />
            <StatCard icon={FileText} label="Documents" value={267} trend="All ready" color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" delay={0.2} />
            <StatCard icon={BarChart3} label="Avg Response" value="1.4s" trend="Good" color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" delay={0.3} />
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-5"
            >
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Quick Links
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Admin Panel', icon: Users, path: '/app/admin', color: 'from-red-500 to-rose-600' },
                  { label: 'Evaluation', icon: BarChart3, path: '/app/evaluation', color: 'from-violet-500 to-purple-600' },
                  { label: 'Documents', icon: Upload, path: '/app/documents', color: 'from-emerald-500 to-teal-600' },
                  { label: 'Ask AI', icon: MessageSquare, path: '/app/chat', color: 'from-blue-500 to-cyan-600' },
                  { label: 'Downloads', icon: Download, path: '/app/downloads', color: 'from-pink-500 to-rose-600' },
                  { label: 'Settings', icon: Users, path: '/app/settings', color: 'from-slate-500 to-slate-600' },
                ].map((a, i) => (
                  <motion.div
                    key={a.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                  >
                    <Link to={a.path} className={`flex flex-col items-center gap-2 p-4 bg-gradient-to-br ${a.color} rounded-xl text-white font-medium text-sm hover:opacity-90 hover:scale-105 transition-all shadow-lg`}>
                      <a.icon className="w-5 h-5" />
                      <span>{a.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-5"
            >
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                Latest Notices
              </h2>
              <div className="space-y-2">
                {notices.slice(0, 5).map((n, i) => (
                  <Link to="/app/notices" key={n.id} className="block">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
                  >
                    <span className={cn('badge flex-shrink-0 text-[10px]', getCategoryColor(n.category))}>{n.category}</span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{n.title}</p>
                  </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
