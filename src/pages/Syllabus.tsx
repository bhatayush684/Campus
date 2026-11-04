import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, ExternalLink, Download, Sparkles, X,
  CheckCircle2, BookText, Layers, Award, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { apiGetSyllabus } from '../services/api';
import { ScrapedSyllabus } from '../types';
import { toast } from 'sonner';

const DEPARTMENTS = ['All', 'CSE', 'IT', 'ENTC', 'Civil', 'Mechanical', 'Electrical', 'AI/ML', 'Robotics'];
const YEARS = ['All', 'FY', 'SY', 'TY', 'Final Year'];

const DEPT_COLORS: Record<string, string> = {
  CSE: 'from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-400',
  IT: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
  ENTC: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
  Civil: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
  Mechanical: 'from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-400',
  Electrical: 'from-yellow-500/20 to-amber-500/20 border-yellow-400',
  'AI/ML': 'from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/30 text-fuchsia-400',
  Robotics: 'from-teal-500/20 to-cyan-500/20 border-teal-500/30 text-teal-400',
  General: 'from-slate-500/20 to-slate-600/20 border-slate-500/30 text-slate-400',
};

export default function Syllabus() {
  const [syllabus, setSyllabus] = useState<ScrapedSyllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [year, setYear] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<ScrapedSyllabus | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'units' | 'books' | 'scheme'>('units');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    apiGetSyllabus()
      .then(data => {
        setSyllabus(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load syllabus records');
        setLoading(false);
      });
  }, []);

  const filtered = syllabus.filter(s => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      (s.courseCode && s.courseCode.toLowerCase().includes(q)) ||
      s.department.toLowerCase().includes(q);
    const matchDept = department === 'All' || s.department === department;
    const matchYear = year === 'All' || s.year === year;
    return matchSearch && matchDept && matchYear;
  });

  const handleDownload = (e: React.MouseEvent, course: ScrapedSyllabus) => {
    e.stopPropagation();
    if (course.downloadUrl) {
      const a = document.createElement('a');
      a.href = course.downloadUrl;
      a.download = `${course.courseCode || 'WCE'}_${course.title.replace(/\s+/g, '_')}_Notes.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success(`Downloading comprehensive study notes for ${course.title}`);
    } else {
      window.open(course.syllabusUrl || course.url || 'https://walchandsangli.ac.in', '_blank');
      toast.success('Opened curriculum portal in a new tab');
    }
  };

  const handleGenerateNotes = (course: ScrapedSyllabus) => {
    navigate(`/app/notes-generator?subject=${encodeURIComponent(course.title)}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            WCE Autonomy Academic Curriculum (2024-25)
          </div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            Syllabus & Course Catalog
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Explore autonomous syllabus schemes, unit-by-unit topics, credits, and download study notes for all branches
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/notes-generator')}
            className="btn-primary text-sm gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Notes Generator
          </button>
        </div>
      </div>

      {/* Department Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DEPARTMENTS.map(d => (
          <button
            key={d}
            onClick={() => setDepartment(d)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border',
              department === d
                ? 'bg-primary-600 text-white border-primary-500 shadow-lg shadow-primary-500/30'
                : 'bg-slate-900/60 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-white'
            )}
          >
            {d === 'All' ? 'All Departments' : d}
          </button>
        ))}
      </div>

      {/* Search and Secondary Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search subjects by name, course code (e.g. 4CS301), or topic..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder:text-slate-500 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
        </div>

        <select
          value={year}
          onChange={e => setYear(e.target.value)}
          className="px-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-white text-sm outline-none cursor-pointer focus:border-primary-500"
        >
          {YEARS.map(y => (
            <option key={y} value={y} className="bg-slate-900 text-white">
              {y === 'All' ? 'All Years' : `${y}`}
            </option>
          ))}
        </select>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing {filtered.length} of {syllabus.length} accredited courses</span>
        <span>Click any card to inspect full unit syllabus & study material</span>
      </div>

      {/* Grid of Courses */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-48 glass-card animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30 text-primary-400" />
          <p className="text-lg font-semibold text-white">No courses match your criteria</p>
          <p className="text-sm mt-1">Try resetting the department or search filter</p>
          <button
            onClick={() => { setSearch(''); setDepartment('All'); setYear('All'); }}
            className="btn-secondary text-xs mt-4"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.4) }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedCourse(course)}
              className="glass-card p-5 cursor-pointer hover:border-primary-500/50 hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={cn('px-2.5 py-1 rounded-lg text-[11px] font-bold border', DEPT_COLORS[course.department] || DEPT_COLORS.General)}>
                    {course.department}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="bg-slate-800/80 px-2 py-0.5 rounded-md font-mono text-[11px] text-slate-300">
                      {course.courseCode || 'CORE'}
                    </span>
                    {course.year && (
                      <span className="bg-slate-800/80 px-2 py-0.5 rounded-md text-[11px]">
                        {course.year}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {course.description || 'Comprehensive autonomous curriculum including theory, tutorials, and practical laboratory assignments.'}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 mt-4 pt-3 border-t border-white/5">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    {course.credits || 4} Credits
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {course.hours || '3L-0T-2P'}
                  </span>
                  {course.units && (
                    <span className="flex items-center gap-1 ml-auto text-primary-400">
                      <Layers className="w-3.5 h-3.5" />
                      {course.units.length} Units
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                <button
                  onClick={(e) => handleDownload(e, course)}
                  className="flex-1 btn-secondary text-xs py-2 justify-center gap-1.5 hover:text-white"
                  title="Download full study notes"
                >
                  <Download className="w-3.5 h-3.5" />
                  Notes
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateNotes(course);
                  }}
                  className="btn-primary text-xs py-2 px-3 gap-1"
                  title="Generate AI Notes"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Notes
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 bg-slate-950/50 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={cn('px-2.5 py-0.5 rounded-md text-xs font-bold border', DEPT_COLORS[selectedCourse.department] || DEPT_COLORS.General)}>
                      {selectedCourse.department}
                    </span>
                    <span className="font-mono text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                      {selectedCourse.courseCode || 'CORE'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {selectedCourse.year} · {selectedCourse.semester}
                    </span>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      {selectedCourse.credits || 4} Credits
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedCourse.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">{selectedCourse.category || 'Professional Core Course'} · {selectedCourse.hours || '3L-0T-2P'}</p>
                </div>

                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center px-6 border-b border-white/10 bg-slate-900/50">
                <button
                  onClick={() => setActiveModalTab('units')}
                  className={cn(
                    'py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5',
                    activeModalTab === 'units'
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Unit Syllabus ({selectedCourse.units?.length || 6})
                </button>
                <button
                  onClick={() => setActiveModalTab('books')}
                  className={cn(
                    'py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5',
                    activeModalTab === 'books'
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  )}
                >
                  <BookText className="w-3.5 h-3.5" />
                  Textbooks & References
                </button>
                <button
                  onClick={() => setActiveModalTab('scheme')}
                  className={cn(
                    'py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5',
                    activeModalTab === 'scheme'
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  )}
                >
                  <Award className="w-3.5 h-3.5" />
                  Examination Scheme
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {activeModalTab === 'units' && (
                  <div className="space-y-3">
                    {selectedCourse.units && selectedCourse.units.length > 0 ? (
                      selectedCourse.units.map(u => (
                        <div key={u.unit} className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary-400 uppercase tracking-wide">
                              Unit {u.unit}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">{u.title}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{u.topics}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 py-4">
                        {selectedCourse.description || 'Full unit breakdown is available in the WCE academic curriculum repository.'}
                      </p>
                    )}
                  </div>
                )}

                {activeModalTab === 'books' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recommended Textbooks & Standard References</h4>
                    {selectedCourse.textbooks && selectedCourse.textbooks.length > 0 ? (
                      selectedCourse.textbooks.map((b, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-white/5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-slate-200">{b}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400">Standard references per Shivaji University and WCE Autonomous Board of Studies.</p>
                    )}
                  </div>
                )}

                {activeModalTab === 'scheme' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Evaluation Components</h4>
                      <p className="text-sm font-semibold text-primary-400">{selectedCourse.examPattern || 'In-Sem: 20% | Mid-Sem: 30% | End-Sem: 50%'}</p>
                      <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4 mt-2">
                        <li><strong>In-Semester Evaluation (ISE):</strong> Continuous assessment via quizzes, class tests, and lab journal submissions.</li>
                        <li><strong>Mid-Semester Examination (MSE):</strong> 30-mark written test covering Units 1 to 3.</li>
                        <li><strong>End-Semester Examination (ESE):</strong> Comprehensive 50-mark final examination covering all Units 1 to 6.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={selectedCourse.syllabusUrl || selectedCourse.url || 'https://walchandsangli.ac.in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View on Official WCE Site
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDownload(e, selectedCourse)}
                    className="btn-secondary text-xs py-2 px-3 gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Notes File
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourse(null);
                      handleGenerateNotes(selectedCourse);
                    }}
                    className="btn-primary text-xs py-2 px-3 gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Study Assistant
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
