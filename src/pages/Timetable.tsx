import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, Calendar, AlertCircle } from 'lucide-react';
import { apiGetTimetable } from '../services/api';
import { TimetableEntry, Department, Year, Division } from '../types';
import { cn, generateICS } from '../lib/utils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
const PERIODS = [
  { period: 1, start: '09:00', end: '10:00' },
  { period: 2, start: '10:00', end: '11:00' },
  { period: 3, start: '11:15', end: '12:15' },
  { period: 4, start: '12:15', end: '13:15' },
  { period: 5, start: '14:00', end: '17:00' },
];

const TYPE_BADGE: Record<string, string> = {
  lecture: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
  lab: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  tutorial: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
};

export default function Timetable() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [view, setView] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState<typeof DAYS[number]>('Monday');
  const [filters, setFilters] = useState({
    department: 'All',
    year: 'All',
    division: 'All',
    faculty: '',
  });

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    apiGetTimetable(filters).then(data => {
      setEntries(data);
      setLoading(false);
    }).catch(() => {
      setEntries([]);
      setLoadError('The timetable could not be loaded. Please try again.');
      setLoading(false);
    });
  }, [filters]);

  const getEntry = (day: string, period: number) =>
    entries.find(e => e.day === day && e.period === period);

  const dayEntries = entries.filter(e => e.day === selectedDay).sort((a, b) => a.period - b.period);

  const handleExport = () => {
    const monday = new Date();
    const day = monday.getDay();
    const daysFromMonday = day === 0 ? -6 : 1 - day;
    monday.setDate(monday.getDate() + daysFromMonday);
    const dayOffsets = Object.fromEntries(DAYS.map((name, index) => [name, index])) as Record<typeof DAYS[number], number>;
    const formatLocalDate = (offset: number) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + offset);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    const icsEvents = entries.map(e => ({
      title: `${e.subject} (${e.type})`,
      start: `${formatLocalDate(dayOffsets[e.day])}T${e.startTime}:00`,
      end: `${formatLocalDate(dayOffsets[e.day])}T${e.endTime}:00`,
      location: e.room,
      description: `Faculty: ${e.faculty}`,
    }));
    const ics = generateICS(icsEvents);
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable_${filters.department}_${filters.year}${filters.division}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Timetable</h1>
          <p className="text-slate-400 text-sm mt-1">{filters.department} · {filters.year} · Div {filters.division}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <button onClick={() => setView('week')} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', view === 'week' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500')}>Week</button>
            <button onClick={() => setView('day')} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', view === 'day' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500')}>Day</button>
          </div>
          <button onClick={handleExport} className="btn-secondary text-sm gap-2">
            <Download className="w-4 h-4" /> Export .ics
          </button>
          <button onClick={() => window.print()} className="btn-secondary text-sm gap-2">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-32">
            <label className="label text-xs">Department</label>
            <select
              value={filters.department}
              onChange={e => setFilters(f => ({ ...f, department: e.target.value as Department }))}
              className="input text-sm py-2"
            >
              {(['All', 'CSE', 'IT', 'ENTC', 'Civil', 'Mechanical', 'Electrical', 'AI/ML', 'Robotics', 'General'] as (Department | 'All')[]).map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-24">
            <label className="label text-xs">Year</label>
            <select
              value={filters.year}
              onChange={e => setFilters(f => ({ ...f, year: e.target.value as Year }))}
              className="input text-sm py-2"
            >
              {(['All', 'FY', 'SY', 'TY', 'BE'] as (Year | 'All')[]).map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-24">
            <label className="label text-xs">Division</label>
            <select
              value={filters.division}
              onChange={e => setFilters(f => ({ ...f, division: e.target.value as Division }))}
              className="input text-sm py-2"
            >
              {(['All', 'A', 'B', 'C'] as (Division | 'All')[]).map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-40">
            <label className="label text-xs">Faculty (search)</label>
            <input
              value={filters.faculty}
              onChange={e => setFilters(f => ({ ...f, faculty: e.target.value }))}
              placeholder="Filter by faculty..."
              className="input text-sm py-2"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-7 gap-2">
          {Array(21).fill(0).map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : loadError ? (
        <div className="card p-12 text-center text-slate-500 dark:text-slate-400">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-amber-500" />
          <p className="font-semibold text-slate-800 dark:text-white">{loadError}</p>
          <button onClick={() => setFilters(current => ({ ...current }))} className="btn-secondary mt-4 text-sm">
            Try again
          </button>
        </div>
      ) : entries.length === 0 ? (
        <div className="card p-12 text-center text-slate-500 dark:text-slate-400">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-semibold text-slate-800 dark:text-white">No classes match these filters</p>
          <p className="text-sm mt-1">Choose “All” or broaden the faculty search to see more classes.</p>
        </div>
      ) : view === 'week' ? (
        /* Weekly Grid */
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="w-24 p-3 text-left text-xs font-semibold text-slate-500">Period</th>
                {DAYS.map(d => (
                  <th key={d} className="p-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map(p => (
                <tr key={p.period} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <td className="p-3 text-xs text-slate-400 font-medium">
                    <div>{p.start}</div>
                    <div>{p.period === 5 ? '17:00' : p.end}</div>
                  </td>
                  {DAYS.map(day => {
                    const entry = getEntry(day, p.period);
                    return (
                      <td key={day} className="p-2">
                        {p.period === 4 && (
                          <div className="text-[10px] text-center text-slate-400 py-1 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg mb-1">Lunch Break</div>
                        )}
                        {entry ? (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-2 rounded-xl text-white relative overflow-hidden cursor-pointer"
                            style={{ backgroundColor: entry.color + 'dd' }}
                          >
                            <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(135deg, white, transparent)` }} />
                            <p className="text-[11px] font-semibold leading-tight line-clamp-2 relative">{entry.subject}</p>
                            <p className="text-[10px] opacity-80 mt-1 relative">{entry.faculty.split(' ').pop()}</p>
                            <p className="text-[10px] opacity-70 relative">{entry.room}</p>
                            <span className={cn('text-[9px] px-1 py-0.5 rounded-sm mt-1 inline-block', entry.type === 'lab' ? 'bg-amber-200 text-amber-800' : entry.type === 'tutorial' ? 'bg-purple-200 text-purple-800' : 'bg-white/30 text-white')}>
                              {entry.type}
                            </span>
                          </motion.div>
                        ) : (
                          <div className="h-16 rounded-xl bg-slate-50 dark:bg-slate-800/30" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Day View */
        <div>
          {/* Day selector */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {DAYS.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium flex-shrink-0 transition-colors',
                  selectedDay === d
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                {d.slice(0, 3)}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {dayEntries.length === 0 ? (
              <div className="card p-12 text-center text-slate-400">
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No classes on {selectedDay}</p>
              </div>
            ) : (
              dayEntries.map(entry => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card p-4 flex items-center gap-4"
                >
                  <div className="w-1 h-14 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{entry.subject}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{entry.faculty}</p>
                      </div>
                      <span className={cn('badge text-xs', TYPE_BADGE[entry.type])}>{entry.type}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>📍 {entry.room}</span>
                      <span>🕐 {entry.startTime} – {entry.endTime}</span>
                      <span>📗 {entry.subjectCode}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
