import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Users, Mail, GraduationCap, MapPin, Clock, Calendar,
  CheckCircle2, X, Sparkles, Send
} from 'lucide-react';
import { apiGetFaculty } from '../services/api';
import { ScrapedFaculty } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function Faculty() {
  const [faculty, setFaculty] = useState<ScrapedFaculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [bookingFaculty, setBookingFaculty] = useState<ScrapedFaculty | null>(null);
  const [bookingDate, setBookingDate] = useState('2024-11-12');
  const [bookingSlot, setBookingSlot] = useState('11:30 AM - 12:00 PM');
  const [bookingPurpose, setBookingPurpose] = useState('Major Project Guidance & Problem Discussion');

  useEffect(() => {
    apiGetFaculty()
      .then((data) => setFaculty(data))
      .catch(() => toast.error('Could not load faculty directory'))
      .finally(() => setLoading(false));
  }, []);

  const departments = useMemo(
    () => ['All', 'CSE', 'IT', 'ENTC', 'Civil', 'Mechanical', 'Electrical', 'AI/ML', 'Robotics'],
    []
  );

  const filtered = faculty.filter((f) => {
    const q = search.toLowerCase();
    const matchesSearch =
      f.name.toLowerCase().includes(q) ||
      (f.specialization && f.specialization.toLowerCase().includes(q)) ||
      (f.designation && f.designation.toLowerCase().includes(q));
    const matchesDept = department === 'All' || f.department === department;
    return matchesSearch && matchesDept;
  });

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingFaculty) return;
    toast.success(`Consultation confirmed with ${bookingFaculty.name} on ${bookingDate} at ${bookingSlot}!`);
    setBookingFaculty(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Distinguished Professors, Deans & HODs
          </div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Users className="w-5 h-5 text-white" />
            </div>
            Faculty Directory & Consultation
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Browse faculty by department, research expertise, office hours, and schedule academic consultations
          </p>
        </div>
      </div>

      {/* Department Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {departments.map((d) => (
          <button
            key={d}
            onClick={() => setDepartment(d)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border',
              department === d
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                : 'bg-slate-900/60 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-white'
            )}
          >
            {d === 'All' ? 'All Departments' : d}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by professor name, research area (e.g. AI, VLSI, Thermal), or designation..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder:text-slate-500 text-sm focus:border-emerald-500 outline-none"
        />
      </div>

      <div className="text-xs text-slate-400">
        Showing {filtered.length} faculty members across departments
      </div>

      {/* Faculty Cards Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 glass-card animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-400" />
          <p className="text-lg font-semibold text-white">No faculty members found</p>
          <p className="text-sm mt-1">Try searching for a different keyword or department</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              whileHover={{ y: -4 }}
              className="glass-card p-5 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shadow-md flex-shrink-0">
                    {f.name.replace('Dr.', '').replace('Prof.', '').trim().split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      {f.department}
                    </span>
                    <h3 className="font-bold text-base text-white mt-1 truncate">{f.name}</h3>
                    <p className="text-xs text-slate-300 font-medium">{f.designation}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-400 pt-3 border-t border-white/5">
                  <p className="flex items-center gap-2 text-slate-300">
                    <GraduationCap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{f.qualification}</span>
                  </p>
                  {f.specialization && (
                    <p className="text-slate-400 leading-relaxed">
                      <strong className="text-slate-300">Areas:</strong> {f.specialization}
                    </p>
                  )}
                  {f.cabin && (
                    <p className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>{f.cabin}</span>
                    </p>
                  )}
                  {f.hours && (
                    <p className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span>{f.hours}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                <a
                  href={`mailto:${f.email || 'info@wce.ac.in'}`}
                  className="btn-secondary text-xs py-2 px-3 flex-1 justify-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </a>
                <button
                  onClick={() => setBookingFaculty(f)}
                  className="btn-primary text-xs py-2 px-3 flex-1 justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Book Slot
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Book Consultation Modal */}
      <AnimatePresence>
        {bookingFaculty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingFaculty(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-slate-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 border-b border-white/10 bg-slate-950 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    Book Office Consultation
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Meeting with {bookingFaculty.name} ({bookingFaculty.designation})
                  </p>
                </div>
                <button
                  onClick={() => setBookingFaculty(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmBooking} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Select Consultation Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Select Time Slot</label>
                  <select
                    value={bookingSlot}
                    onChange={(e) => setBookingSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500"
                  >
                    <option>10:30 AM - 11:00 AM</option>
                    <option>11:30 AM - 12:00 PM</option>
                    <option>02:30 PM - 03:00 PM</option>
                    <option>03:30 PM - 04:00 PM</option>
                    <option>04:30 PM - 05:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Topic / Discussion Purpose</label>
                  <textarea
                    rows={3}
                    value={bookingPurpose}
                    onChange={(e) => setBookingPurpose(e.target.value)}
                    placeholder="Briefly state your query, academic doubt, or project consultation topic..."
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white placeholder:text-slate-500 outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Consultation Venue
                  </p>
                  <p>{bookingFaculty.cabin || 'Faculty Cabin, Main Academic Wing'}</p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingFaculty(null)}
                    className="btn-secondary text-xs py-2 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs py-2 px-4 gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Confirm Appointment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
