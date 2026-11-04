import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, ExternalLink, Search, Building2, TrendingUp,
  CheckCircle2, X, Sparkles
} from 'lucide-react';
import { apiGetPlacements } from '../services/api';
import { ScrapedPlacement } from '../types';
import { toast } from 'sonner';

const TIERS = ['All', 'Dream', 'Super Core', 'Core', 'Differential'];

export default function Placements() {
  const [rows, setRows] = useState<ScrapedPlacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [prepModalCompany, setPrepModalCompany] = useState<ScrapedPlacement | null>(null);

  useEffect(() => {
    apiGetPlacements()
      .then(setRows)
      .catch(() => toast.error('Could not load placement data'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      r.company.toLowerCase().includes(q) ||
      (r.role && r.role.toLowerCase().includes(q)) ||
      (r.package && r.package.toLowerCase().includes(q));
    const matchTier = selectedTier === 'All' || r.tier === selectedTier;
    return matchSearch && matchTier;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            WCE Training & Placement Cell (2024-25 Batch)
          </div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            Campus Placements & Recruiter Vault
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Top recruiters, CTC compensation brackets, selection rounds, and company interview prep roadmaps
          </p>
        </div>
      </div>

      {/* Key Highlights Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Highest Package</span>
          <p className="text-2xl font-black text-emerald-400">33.5 LPA</p>
          <p className="text-[11px] text-slate-500">Google India (SDE-1)</p>
        </div>
        <div className="glass-card p-5 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Package</span>
          <p className="text-2xl font-black text-cyan-400">9.2 LPA</p>
          <p className="text-[11px] text-slate-500">Circuit & Core Branches</p>
        </div>
        <div className="glass-card p-5 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Placement Rate</span>
          <p className="text-2xl font-black text-violet-400">88.4%</p>
          <p className="text-[11px] text-slate-500">Eligible Registered Cohort</p>
        </div>
        <div className="glass-card p-5 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Visiting Companies</span>
          <p className="text-2xl font-black text-amber-400">120+</p>
          <p className="text-[11px] text-slate-500">Core, Product & IT MNCs</p>
        </div>
      </div>

      {/* Tier Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TIERS.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTier(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedTier === t
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                : 'bg-slate-900/60 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {t === 'All' ? 'All Tiers' : `${t} Tier`}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company name (e.g. Google, TCS, Siemens) or job role..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder:text-slate-500 text-sm focus:border-emerald-500 outline-none"
        />
      </div>

      {/* Recruiter Cards Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-44 glass-card animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-400" />
          <p className="text-lg font-semibold text-white">No placement records matched</p>
          <p className="text-sm mt-1">Try resetting the tier or search query</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              className="glass-card p-5 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-white">{p.company}</h3>
                    {p.role && <p className="text-xs text-slate-300 font-medium">{p.role}</p>}
                  </div>
                  {p.package && (
                    <span className="px-3 py-1 rounded-lg text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {p.package}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px]">
                      {p.tier || 'Core'} Tier
                    </span>
                    {p.location && (
                      <span className="text-slate-400 text-[11px]">
                        📍 {p.location}
                      </span>
                    )}
                    {p.students && (
                      <span className="text-slate-400 text-[11px]">
                        👥 {p.students} Hires
                      </span>
                    )}
                  </div>

                  {p.eligibleBranches && (
                    <p className="text-[11px] text-slate-400 pt-1">
                      <strong className="text-slate-300">Eligible:</strong> {p.eligibleBranches.join(', ')}
                    </p>
                  )}

                  {p.selectionProcess && (
                    <p className="text-[11px] text-slate-400 line-clamp-2 pt-1">
                      <strong className="text-slate-300">Rounds:</strong> {p.selectionProcess}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => setPrepModalCompany(p)}
                  className="btn-primary text-xs py-1.5 px-3 gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Prep Blueprint
                </button>

                <a
                  href={p.url || p.source || 'https://walchandsangli.ac.in'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  TPO Notice <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Prep Blueprint Modal */}
      <AnimatePresence>
        {prepModalCompany && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPrepModalCompany(null)}
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
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    {prepModalCompany.company} — Interview Blueprint
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Package: {prepModalCompany.package} · Role: {prepModalCompany.role || 'Engineer'}
                  </p>
                </div>
                <button
                  onClick={() => setPrepModalCompany(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs text-slate-300">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 space-y-1.5">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Hiring Workflow</h4>
                  <p className="text-slate-400">{prepModalCompany.selectionProcess || 'Online Technical Assessment, Core Technical Interview, HR Round.'}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Key Technical Focus Areas</h4>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Data Structures & Algorithms: Graphs, Dynamic Programming, Binary Trees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Core CS / Domain Fundamentals: OS (Deadlocks, Paging), DBMS (Normalization, Transactions)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>System Design & Projects: Live demo of academic capstone project code and architecture</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      toast.success(`Preparation guide saved to your profile!`);
                      setPrepModalCompany(null);
                    }}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    Got It, Let's Prepare!
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
