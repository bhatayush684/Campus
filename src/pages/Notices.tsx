import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Pin, X, ChevronRight, FileText, Bell, Calendar, Building, Briefcase, Info, ExternalLink, Sparkles } from 'lucide-react';
import { apiGetNotices } from '../services/api';
import { Notice, NoticeCategory } from '../types';
import { cn, formatDate, getCategoryColor } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CATEGORIES: (NoticeCategory | 'All')[] = ['All', 'Exam', 'Placement', 'Hostel', 'Events', 'General', 'Admission'];

const CATEGORY_ICONS: Record<string, any> = {
  Exam: FileText,
  Placement: Briefcase,
  Hostel: Building,
  Events: Calendar,
  General: Info,
  Admission: Sparkles,
};

function NoticeModal({ notice, onClose }: { notice: Notice; onClose: () => void }) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[85vh] flex flex-col glass-card shadow-2xl z-10 overflow-hidden"
        >
          <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-primary-500/5 to-accent-500/5">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-3">
                <span className={cn('badge', getCategoryColor(notice.category))}>{notice.category}</span>
                {notice.isPinned && <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 flex items-center gap-1"><Pin className="w-3 h-3" /> Pinned</span>}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{notice.title}</h2>
              <p className="text-sm text-slate-400 mt-2">{notice.author} · {formatDate(notice.date)}</p>
            </div>
            <button onClick={onClose} className="btn-ghost p-2 flex-shrink-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="markdown-body prose dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{notice.content || 'No additional content available. Please visit the source link for more details.'}</ReactMarkdown>
            </div>
            {notice.url && (
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                <a
                  href={notice.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Original Notice
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<NoticeCategory | 'All'>('All');
  const [selected, setSelected] = useState<Notice | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    apiGetNotices({ category: category !== 'All' ? category : undefined, search }).then(data => {
      setNotices(data);
      setLoading(false);
    });
  }, [category, search]);

  const markRead = (id: string) => setReadIds(s => new Set([...s, id]));

  const openNotice = (n: Notice) => {
    setSelected(n);
    markRead(n.id);
  };

  const pinnedCount = notices.filter(n => n.isPinned).length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              Notices
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {notices.length} notices found · {pinnedCount} pinned
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3 mb-6"
      >
        <div className="relative flex-1 min-w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notices by title, content, or author..."
            className="input pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all border',
                category === cat
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white border-primary-600 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-300 dark:hover:border-primary-700'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notice List */}
      {loading ? (
        <div className="space-y-3">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-24 card animate-pulse" />
          ))}
        </div>
      ) : notices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 text-slate-400"
        >
          <Bell className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="font-medium text-lg">No notices found</p>
          <p className="text-sm mt-2">Try adjusting your search or filter</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice, i) => {
            const Icon = CATEGORY_ICONS[notice.category] ?? Info;
            const isRead = readIds.has(notice.id);
            return (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => openNotice(notice)}
                className={cn(
                  'card p-4 cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-lg group relative overflow-hidden',
                  notice.isPinned && 'border-l-4 border-l-amber-400',
                  !isRead && 'bg-gradient-to-r from-primary-50/50 to-transparent dark:from-primary-950/20'
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-accent-500/5 transition-all duration-300" />
                <div className="relative flex items-start gap-4">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md', notice.category === 'Exam' ? 'bg-red-100 dark:bg-red-900/30' : notice.category === 'Placement' ? 'bg-emerald-100 dark:bg-emerald-900/30' : notice.category === 'Hostel' ? 'bg-amber-100 dark:bg-amber-900/30' : notice.category === 'Events' ? 'bg-purple-100 dark:bg-purple-900/30' : notice.category === 'Admission' ? 'bg-teal-100 dark:bg-teal-900/30' : 'bg-slate-100 dark:bg-slate-800')}>
                    <Icon className={cn('w-6 h-6', notice.category === 'Exam' ? 'text-red-600 dark:text-red-400' : notice.category === 'Placement' ? 'text-emerald-600 dark:text-emerald-400' : notice.category === 'Hostel' ? 'text-amber-600 dark:text-amber-400' : notice.category === 'Events' ? 'text-purple-600 dark:text-purple-400' : notice.category === 'Admission' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {notice.isPinned && <Pin className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                        {!isRead && <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 animate-pulse" />}
                        <span className={cn('badge text-xs', getCategoryColor(notice.category))}>{notice.category}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mt-2 text-base line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{notice.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className="font-medium">{notice.author}</span>
                      <span>·</span>
                      <span>{formatDate(notice.date)}</span>
                      {notice.url && <span className="text-primary-500 flex items-center gap-1"><ExternalLink className="w-3 h-3" /> Source</span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {selected && <NoticeModal notice={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
