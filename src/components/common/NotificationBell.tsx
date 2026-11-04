import { Bell } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { formatDate } from '../../lib/utils';

const initialNotifications = [
  { id: '1', title: 'Exam schedule published', message: 'End semester exams start Nov 18', time: '2024-10-22T09:00:00Z', isRead: false, link: '/app/exam-schedules' },
  { id: '2', title: 'New Notice: Placement Drive', message: 'Infosys campus drive on Nov 5', time: '2024-10-21T14:00:00Z', isRead: false, link: '/app/placements' },
  { id: '3', title: 'Technova 2024 Registration', message: 'Register before Nov 10', time: '2024-10-20T10:00:00Z', isRead: true, link: '/app/notices' },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialNotifications);
  const { setNotificationCount } = useUIStore();
  const navigate = useNavigate();
  const unread = items.filter(n => !n.isRead).length;

  const handleOpen = () => setOpen(!open);

  const markAllRead = () => {
    setItems(prev => prev.map(n => ({ ...n, isRead: true })));
    setNotificationCount(0);
  };

  const openItem = (n: typeof items[number]) => {
    setItems(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x));
    setNotificationCount(Math.max(0, unread - (n.isRead ? 0 : 1)));
    setOpen(false);
    navigate(n.link);
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="btn-ghost p-2 relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
          >
            {unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 card shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                <button onClick={markAllRead} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {items.map(n => (
                  <button
                    key={n.id}
                    onClick={() => openItem(n)}
                    className={`w-full text-left p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!n.isRead ? 'bg-primary-50/50 dark:bg-primary-950/20' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      {!n.isRead && <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />}
                      <div className={!n.isRead ? '' : 'ml-5'}>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{n.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{formatDate(n.time)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setOpen(false); navigate('/app/notices'); }}
                className="w-full py-2.5 text-sm text-primary-600 dark:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                View all notices
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
