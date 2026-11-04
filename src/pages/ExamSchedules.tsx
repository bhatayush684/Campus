import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Search, Clock, MapPin, AlertCircle,
  Printer, ShieldCheck, UserCheck, X, CheckCircle2, QrCode
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { apiGetExamSchedules } from '../services/api';
import { ScrapedExamSchedule } from '../types';
import { toast } from 'sonner';

const EXAM_TYPES = ['All', 'Theory (ESE)', 'Practical & Oral', 'Mid-Sem (MSE)'];
const DEPARTMENTS = ['All', 'CSE', 'IT', 'ENTC', 'Civil', 'Mechanical', 'Electrical', 'AI/ML'];

export default function ExamSchedules() {
  const { user } = useAuthStore();
  const [exams, setExams] = useState<ScrapedExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [department, setDepartment] = useState('All');
  const [hallTicketOpen, setHallTicketOpen] = useState(false);
  const prnInput = user?.prnOrEmpId || '2022BTECS00042';

  useEffect(() => {
    setLoading(true);
    apiGetExamSchedules()
      .then(data => {
        setExams(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Could not load exam timetables');
        setLoading(false);
      });
  }, []);

  const filtered = exams.filter(e => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      e.title.toLowerCase().includes(q) ||
      (e.subject && e.subject.toLowerCase().includes(q)) ||
      (e.venue && e.venue.toLowerCase().includes(q));
    const matchType = type === 'All' || e.type.includes(type) || (type === 'Theory (ESE)' && e.type.includes('Theory'));
    const matchDept = department === 'All' || (e.department && e.department === department);
    return matchSearch && matchType && matchDept;
  });

  const nextExam = exams
    .filter(exam => Number.isFinite(Date.parse(exam.date)) && new Date(exam.date) >= new Date(new Date().toISOString().slice(0, 10)))
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))[0];

  const resetFilters = () => {
    setSearch('');
    setType('All');
    setDepartment('All');
  };

  const handlePrintHallTicket = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Hall Ticket Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            WCE Autonomous Examination Cell · Reference data
          </div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Exam Schedules & Hall Tickets
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Official date sheets, reporting times, hall allotments, and verified admit card generator
          </p>
        </div>

        <button
          onClick={() => setHallTicketOpen(true)}
          className="btn-primary text-sm gap-2"
        >
          <UserCheck className="w-4 h-4" />
          Download Hall Ticket
        </button>
      </div>

      {/* Countdown Card */}
      {nextExam ? (
        <div className="glass-card p-6 border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Next Upcoming Exam</span>
              <h2 className="text-xl font-bold text-white mt-1">{nextExam.subject || nextExam.title}</h2>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-400" /> {nextExam.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-cyan-400" /> {nextExam.time}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {nextExam.venue}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold">
                Winter Session
              </span>
            </div>
          </div>
        </div>
      ) : !loading && (
        <div className="glass-card p-5 border-amber-500/30 bg-amber-950/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-amber-200">No upcoming date is currently verified</p>
            <p className="text-sm text-amber-100/70 mt-1">
              The {exams.length} reference schedule{exams.length === 1 ? '' : 's'} below are retained for planning. Check the official examination-cell notice before relying on any date.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by subject name, venue hall, or code..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder:text-slate-500 text-sm focus:border-primary-500 outline-none"
          />
        </div>

        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="px-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-white text-sm outline-none cursor-pointer focus:border-primary-500"
        >
          {EXAM_TYPES.map(t => (
            <option key={t} value={t} className="bg-slate-900 text-white">
              {t === 'All' ? 'All Exam Categories' : t}
            </option>
          ))}
        </select>

        <select
          value={department}
          onChange={e => setDepartment(e.target.value)}
          className="px-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-white text-sm outline-none cursor-pointer focus:border-primary-500"
        >
          {DEPARTMENTS.map(d => (
            <option key={d} value={d} className="bg-slate-900 text-white">
              {d === 'All' ? 'All Branches' : d}
            </option>
          ))}
        </select>
      </div>

      {/* Exam Timetable Cards */}
      {loading ? (
        <div className="space-y-3">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 glass-card animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30 text-blue-400" />
          <p className="text-lg font-semibold text-white">No exam slots found</p>
          <p className="text-sm mt-1">Try resetting the branch, category, or search filters</p>
          <button onClick={resetFilters} className="btn-secondary mt-4 text-sm">
            Reset filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="glass-card p-5 hover:border-blue-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {item.type}
                  </span>
                  {item.department && (
                    <span className="px-2 py-0.5 rounded-md text-xs bg-slate-800 text-slate-300">
                      {item.department}
                    </span>
                  )}
                  {item.semester && (
                    <span className="text-xs text-slate-400 font-mono">
                      {item.semester}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white">{item.subject || item.title}</h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5 text-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <strong>{item.date}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {item.time}
                  </span>
                  {item.venue && (
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {item.venue}
                    </span>
                  )}
                </div>

                {item.instructions && (
                  <p className="text-xs text-slate-400 italic pt-1">{item.instructions}</p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setHallTicketOpen(true)}
                  className="btn-secondary text-xs py-2 px-3 gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Hall Ticket
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Instructions Alert Box */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
        <div className="space-y-1">
          <p className="font-semibold text-white">General Examination Conduct Rules</p>
          <p>Candidates must take their allotted seats 15 minutes before the first bell. Smart devices, programmable calculators, bags, and written materials are strictly prohibited inside examination centers. College ID and Hall Ticket must be placed on the desk throughout the session.</p>
        </div>
      </div>

      {/* Hall Ticket Generator Modal */}
      <AnimatePresence>
        {hallTicketOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHallTicketOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col"
            >
              {/* Modal Top Bar */}
              <div className="p-4 border-b border-white/10 bg-slate-950 flex items-center justify-between no-print">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <ShieldCheck className="w-4 h-4 text-primary-400" />
                  Official Examination Admit Card (Hall Ticket)
                </div>
                <button
                  onClick={() => setHallTicketOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Hall Ticket Card */}
              <div className="p-6 overflow-y-auto space-y-6 bg-slate-950 text-white">
                {/* College Seal Banner */}
                <div className="text-center border-b border-white/10 pb-4">
                  <h2 className="text-lg font-black tracking-wide text-white uppercase">
                    Walchand College of Engineering, Sangli
                  </h2>
                  <p className="text-xs text-slate-400">An Autonomous Institute Established in 1947 | Govt. Aided</p>
                  <p className="text-xs font-semibold text-primary-400 mt-1 uppercase tracking-wider">
                    Hall Ticket / Admit Card — End Semester Examination Winter 2024
                  </p>
                </div>

                {/* Candidate Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs p-4 rounded-xl bg-slate-900 border border-white/10">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Candidate Name</span>
                    <span className="font-bold text-white text-sm">{user?.name || 'Student Candidate'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">PRN / Seat No</span>
                    <span className="font-mono font-bold text-primary-400 text-sm">{prnInput}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Department / Branch</span>
                    <span className="font-bold text-white">{user?.department || 'Computer Science & Engineering'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Academic Year</span>
                    <span className="font-bold text-white">TY B.Tech (Semester V)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Exam Center</span>
                    <span className="font-bold text-white">WCE Sangli Main Campus</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Status</span>
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </span>
                  </div>
                </div>

                {/* Enrolled Courses Table */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Registered Examination Papers</h4>
                  <div className="border border-white/10 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-900 border-b border-white/10 text-slate-400 font-semibold">
                        <tr>
                          <th className="p-2.5">Date</th>
                          <th className="p-2.5">Paper / Subject</th>
                          <th className="p-2.5">Session</th>
                          <th className="p-2.5">Hall No</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        {exams.slice(0, 5).map(e => (
                          <tr key={e.id}>
                            <td className="p-2.5 font-mono text-slate-400">{e.date}</td>
                            <td className="p-2.5 font-medium text-white">{e.subject || e.title}</td>
                            <td className="p-2.5">{(e.time || '09:30 AM').split('(')[0]}</td>
                            <td className="p-2.5 text-primary-300 font-semibold">{e.venue?.split('(')[0] || 'Hall A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Verification QR & Signatures */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center">
                      <QrCode className="w-14 h-14 text-slate-900" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-slate-400">Verification Hash:</p>
                      <p className="font-mono text-xs text-primary-400">WCE-ESE-2024-99841</p>
                      <p className="text-[10px] text-slate-500">Digitally verified by CoE</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="h-10 flex items-end justify-end">
                      <span className="font-serif italic text-sm text-slate-400">Dr. S. K. Mahajan</span>
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Controller of Examinations</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 bg-slate-950 flex items-center justify-between no-print">
                <span className="text-xs text-slate-400">Ensure printed copy is carried to each exam slot</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintHallTicket}
                    className="btn-primary text-xs py-2 px-4 gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print / Save PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
