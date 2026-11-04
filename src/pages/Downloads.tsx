import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download, Search, FileText, ExternalLink,
  BookOpen, GraduationCap, Calendar, ClipboardList, Award, Briefcase, X, Globe, FolderOpen
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import studyMateResources from '../data/scraped/studymate_resources.json';

// ── Types ──────────────────────────────────────────────────────────────
interface ScrapedDoc {
  id: string;
  title: string;
  url: string;
  downloadUrl?: string;
  type: 'PDF' | 'DOC' | 'LINK' | 'TXT';
  category: string;
  department?: string;
  source?: string;
}

// ── Curated WCE Real Links & Study Downloads ─────────────
const WCE_LINKS: ScrapedDoc[] = [
  // Downloadable Complete Study Notes
  { id: 'n-ml', title: 'Machine Learning (4CS301) — Complete Revision Notes & Derivations', url: '/downloads/notes-machine-learning-complete.txt', downloadUrl: '/downloads/notes-machine-learning-complete.txt', type: 'TXT', category: 'Study Notes', department: 'CSE' },
  { id: 'n-dbms', title: 'Database Management Systems (4CS302) — Normalization & SQL Notes', url: '/downloads/notes-dbms-sql-complete.txt', downloadUrl: '/downloads/notes-dbms-sql-complete.txt', type: 'TXT', category: 'Study Notes', department: 'CSE' },
  { id: 'n-cn', title: 'Computer Networks (4CS303) — Formulas, TCP & Subnetting Guide', url: '/downloads/notes-computer-networks-complete.txt', downloadUrl: '/downloads/notes-computer-networks-complete.txt', type: 'TXT', category: 'Study Notes', department: 'CSE' },
  { id: 'n-os', title: 'Operating Systems (4CS304) — Process Sync, Paging & Scheduling Notes', url: '/downloads/notes-operating-systems-complete.txt', downloadUrl: '/downloads/notes-operating-systems-complete.txt', type: 'TXT', category: 'Study Notes', department: 'CSE' },
  { id: 'n-dsa', title: 'Data Structures & Algorithms (4CS201) — Trees, Graphs & DP Cheat Sheet', url: '/downloads/notes-data-structures-algorithms.txt', downloadUrl: '/downloads/notes-data-structures-algorithms.txt', type: 'TXT', category: 'Study Notes', department: 'CSE' },
  { id: 'n-cred', title: 'WCE Autonomy Academic Credit Regulations & Grading Guide 2024-25', url: '/downloads/wce-credit-system-regulations.txt', downloadUrl: '/downloads/wce-credit-system-regulations.txt', type: 'TXT', category: 'Academic', department: 'General' },

  // Calendars & Schedules
  { id: 'l1', title: 'Academic Calendars & Schedules', url: 'https://walchandsangli.ac.in/academics-programmes/calendars-and-schedules/', type: 'LINK', category: 'Timetable', department: 'General' },
  { id: 'l2', title: 'Credit System & Credit Bank', url: 'https://walchandsangli.ac.in/academics-programmes/credit-system-and-bank/', type: 'LINK', category: 'Academic', department: 'General' },
  { id: 'l3', title: 'Overview of Academic Philosophy', url: 'https://walchandsangli.ac.in/academics-programmes/overview-of-academic-philosophy/', type: 'LINK', category: 'Academic', department: 'General' },
  // Annual Reports
  { id: 'l4', title: 'Annual Reports', url: 'https://walchandsangli.ac.in/about/annual-reports/', type: 'LINK', category: 'Accreditation', department: 'General' },
  { id: 'l5', title: 'IQAC Reports', url: 'https://walchandsangli.ac.in/about/iqac-reports/', type: 'LINK', category: 'Accreditation', department: 'General' },
  { id: 'l6', title: 'NIRF Submissions', url: 'https://walchandsangli.ac.in/about/nirf-submissions/', type: 'LINK', category: 'Accreditation', department: 'General' },
  { id: 'l7', title: 'Academic Audits', url: 'https://walchandsangli.ac.in/about/academic-audits/', type: 'LINK', category: 'Accreditation', department: 'General' },
  { id: 'l8', title: 'Mandatory Disclosures', url: 'https://walchandsangli.ac.in/about/mandatory-disclosures/', type: 'LINK', category: 'Accreditation', department: 'General' },
  // Admissions
  { id: 'l9', title: 'First Year B.Tech Admissions', url: 'https://walchandsangli.ac.in/admissions/first-year-btech/', type: 'LINK', category: 'Admission', department: 'General' },
  { id: 'l10', title: 'Direct Second Year B.Tech', url: 'https://walchandsangli.ac.in/admissions/direct-second-year-b-tech/', type: 'LINK', category: 'Admission', department: 'General' },
  { id: 'l11', title: 'Fees as per Authorities (DTE/FRA)', url: 'https://walchandsangli.ac.in/admissions/fees-as-per-authorities-dte-fra/', type: 'LINK', category: 'Fees', department: 'General' },
  { id: 'l12', title: 'Institute Level Notifications', url: 'https://walchandsangli.ac.in/admissions/institute-level-notifications/', type: 'LINK', category: 'Circular', department: 'General' },
  { id: 'l13', title: 'Certificate Courses', url: 'https://walchandsangli.ac.in/admissions/certificate-courses/', type: 'LINK', category: 'Academic', department: 'General' },
  { id: 'l14', title: 'Ph.D. Admissions', url: 'https://walchandsangli.ac.in/admissions/phd/', type: 'LINK', category: 'Admission', department: 'General' },
  // Departments
  { id: 'l15', title: 'Computer Science & Engineering — Dept Page', url: 'https://walchandsangli.ac.in/department-of-computer-engineering/overview/', type: 'LINK', category: 'Syllabus', department: 'CSE' },
  { id: 'l16', title: 'Information Technology — Dept Page', url: 'https://walchandsangli.ac.in/department-of-information-technology/overview-it/', type: 'LINK', category: 'Syllabus', department: 'IT' },
  { id: 'l17', title: 'Electronics Engineering — Dept Page', url: 'https://walchandsangli.ac.in/department-of-electronics-engg/overview-electronics/', type: 'LINK', category: 'Syllabus', department: 'ENTC' },
  { id: 'l18', title: 'Civil Engineering — Dept Page', url: 'https://www.walchandsangli.ac.in/department-of-civil-engineering/overview-ce/', type: 'LINK', category: 'Syllabus', department: 'Civil' },
  { id: 'l19', title: 'Mechanical Engineering — Dept Page', url: 'https://www.walchandsangli.ac.in/department-of-mechanical-engineering/overview/', type: 'LINK', category: 'Syllabus', department: 'Mechanical' },
  { id: 'l20', title: 'Electrical Engineering — Dept Page', url: 'https://walchandsangli.ac.in/department-of-electrical-engg/overview-electrical/', type: 'LINK', category: 'Syllabus', department: 'Electrical' },
  { id: 'l21', title: 'AI & Machine Learning — Dept Page', url: 'https://walchandsangli.ac.in/department-of-artificial-intelligence-and-machine-learning/overview-ai/', type: 'LINK', category: 'Syllabus', department: 'AI/ML' },
  { id: 'l22', title: 'Robotics & Automation — Dept Page', url: 'https://walchandsangli.ac.in/department-of-robotics-and-automation/overview-ra/', type: 'LINK', category: 'Syllabus', department: 'Robotics' },
  { id: 'l23', title: 'Applied Mechanics — Dept Page', url: 'https://www.walchandsangli.ac.in/department-of-applied-mechanics/overview-am/', type: 'LINK', category: 'Syllabus', department: 'Mech' },
  { id: 'l24', title: 'Department of Design — Overview', url: 'https://walchandsangli.ac.in/department-of-design/overview/', type: 'LINK', category: 'Syllabus', department: 'Design' },
  // About
  { id: 'l25', title: 'WCE at a Glance', url: 'https://walchandsangli.ac.in/about/wce-at-glance/', type: 'LINK', category: 'About', department: 'General' },
  { id: 'l26', title: 'Vision and Mission', url: 'https://walchandsangli.ac.in/about/vision-mission/', type: 'LINK', category: 'About', department: 'General' },
  { id: 'l27', title: 'Heads and Deans', url: 'https://walchandsangli.ac.in/about/heads-and-deans/', type: 'LINK', category: 'About', department: 'General' },
  { id: 'l28', title: 'NIRF, NBA and NAAC Reports', url: 'https://walchandsangli.ac.in/about/nirf-nba-and-naac/', type: 'LINK', category: 'Accreditation', department: 'General' },
  { id: 'l29', title: 'RTI Information', url: 'https://walchandsangli.ac.in/about/rti/', type: 'LINK', category: 'About', department: 'General' },
  { id: 'l30', title: 'Online Services & Platforms', url: 'https://www.walchandsangli.ac.in/campus-life/online-platforms/', type: 'LINK', category: 'Campus Life', department: 'General' },
  // Communication
  { id: 'l31', title: 'Communication & Notifications', url: 'https://www.walchandsangli.ac.in/communication/', type: 'LINK', category: 'Circular', department: 'General' },
  // Shivaji University Syllabus
  { id: 'su1', title: '📘 Shivaji University B.Tech Syllabus (Official)', url: 'https://www.unishivaji.ac.in/uploads/sylabbi/', type: 'LINK', category: 'Syllabus', department: 'General' },
  { id: 'su2', title: '📘 Shivaji University Exam Timetable', url: 'https://www.unishivaji.ac.in/', type: 'LINK', category: 'Timetable', department: 'General' },
  // Programs
  { id: 'pg1', title: 'Overview of Programmes & Intake Capacity', url: 'https://walchandsangli.ac.in/overview-of-programmes-and-intake-capacity/overview/', type: 'LINK', category: 'Academic', department: 'General' },
  { id: 'pg2', title: 'M.Tech Programmes', url: 'https://walchandsangli.ac.in/post-graduate/m-tech/', type: 'LINK', category: 'Academic', department: 'General' },
  { id: 'pg3', title: 'MBA Programme', url: 'https://walchandsangli.ac.in/master-of-business-administration/', type: 'LINK', category: 'Academic', department: 'General' },
  { id: 'pg4', title: 'Bachelor of Design (B.Des)', url: 'https://walchandsangli.ac.in/bachelor-of-design/', type: 'LINK', category: 'Academic', department: 'General' },
  { id: 'pg5', title: 'Integrated B.Tech-M.Tech (VLSI & Embedded)', url: 'https://walchandsangli.ac.in/integrated-b-tech-m-tech-programme/', type: 'LINK', category: 'Academic', department: 'General' },
];

const ALL_CATEGORIES = ['All', 'Study Notes', 'Syllabus', 'Timetable', 'Examination', 'Results', 'Circular', 'Accreditation', 'Admission', 'Fees', 'Placement', 'Academic', 'About', 'Campus Life', 'Document'];
const ALL_DEPARTMENTS = ['All', 'General', 'CSE', 'IT', 'ENTC', 'Civil', 'Mechanical', 'Electrical', 'AI/ML', 'Robotics'];

const studyMateDocs: ScrapedDoc[] = studyMateResources.map((resource) => ({
  ...resource,
  type: resource.type === 'PDF' ? 'PDF' : 'LINK',
}));

const CAT_ICONS: Record<string, any> = {
  'Study Notes': BookOpen,
  Syllabus: BookOpen,
  Timetable: Calendar,
  Examination: ClipboardList,
  Results: Award,
  Placement: Briefcase,
  Accreditation: Award,
  Admission: GraduationCap,
  Academic: BookOpen,
  Fees: FileText,
  Circular: FileText,
  About: Globe,
  Document: FileText,
};

const CAT_COLORS: Record<string, string> = {
  'Study Notes': 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
  Syllabus: 'bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
  Timetable: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
  Examination: 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400',
  Results: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
  Placement: 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
  Accreditation: 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
  Admission: 'bg-teal-100 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400',
  Fees: 'bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400',
  Circular: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
};

function DocCard({ doc, index }: { doc: ScrapedDoc; index: number }) {
  const Icon = CAT_ICONS[doc.category] || FileText;
  const colorClass = CAT_COLORS[doc.category] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';

  const handleOpen = () => {
    if (doc.downloadUrl) {
      const a = document.createElement('a');
      a.href = doc.downloadUrl;
      a.download = doc.title.replace(/\s+/g, '_') + '.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success(`Downloaded: ${doc.title}`);
    } else {
      window.open(doc.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const downloadTarget = doc.downloadUrl || doc.url;
    const a = document.createElement('a');
    a.href = downloadTarget;
    a.download = doc.title;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`Downloading: ${doc.title}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.5) }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="card p-4 cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all group relative overflow-hidden"
      onClick={handleOpen}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-accent-500/5 transition-all duration-300" />
      <div className="relative flex items-start gap-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md', colorClass)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {doc.title}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={cn('badge text-[10px] font-medium', CAT_COLORS[doc.category] || 'bg-slate-100 text-slate-600')}>
              {doc.category}
            </span>
            {doc.department && doc.department !== 'General' && (
              <span className="badge text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500">{doc.department}</span>
            )}
            <span className={cn('badge text-[10px]', doc.type === 'PDF' ? 'bg-red-50 dark:bg-red-950/40 text-red-500' : doc.type === 'DOC' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-500')}>
              {doc.type}
            </span>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={handleDownload}
            title={doc.type === 'PDF' || doc.type === 'DOC' ? 'Download' : 'Open'}
            className="p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
          >
            {doc.type === 'PDF' || doc.type === 'DOC' ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Downloads() {
  const [scrapedDocs, setScrapedDocs] = useState<ScrapedDoc[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [department, setDepartment] = useState('All');
  const [lastScraped, setLastScraped] = useState<string | null>(null);

  // Load scraped data if available
  useEffect(() => {
    const loadScraped = async () => {
      try {
        const r = await fetch('/scraped/syllabus_docs.json');
        if (r.ok) {
          const data = await r.json();
          setScrapedDocs(data);
        }
      } catch {}
      try {
        const r2 = await fetch('/scraped/scrape_summary.json');
        if (r2.ok) {
          const s = await r2.json();
          setLastScraped(s.scrapedAt);
        }
      } catch {}
    };
    loadScraped();
  }, []);

  const allDocs = [...WCE_LINKS, ...scrapedDocs, ...studyMateDocs].filter((d, i, a) => a.findIndex(x => x.url === d.url) === i);

  const filtered = allDocs.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q) || (d.department || '').toLowerCase().includes(q);
    const matchCat = category === 'All' || d.category === category;
    const matchDept = department === 'All' || d.department === department || (department === 'General' && !d.department);
    return matchSearch && matchCat && matchDept;
  });

  const downloadAll = () => {
    const pdfs = filtered.filter(d => d.type === 'PDF');
    if (pdfs.length === 0) { toast.info('No PDFs in current filter to download'); return; }
    pdfs.forEach((d, i) => setTimeout(() => window.open(d.url, '_blank'), i * 500));
    toast.success(`Opening ${pdfs.length} PDF(s) in new tabs`);
  };

  const categoryGroups = ALL_CATEGORIES.filter(c => c !== 'All').map(cat => ({
    name: cat,
    count: allDocs.filter(d => d.category === cat).length,
  })).filter(g => g.count > 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              Downloads & Resources
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Official WCE Sangli documents, syllabus, circulars & curated StudyMate resources
              {lastScraped && <span className="ml-2 text-emerald-500">· Last scraped: {new Date(lastScraped).toLocaleDateString()}</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://walchandsangli.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm gap-2"
            >
              <Globe className="w-4 h-4" /> WCE Website
            </a>
            <button onClick={downloadAll} className="btn-primary text-sm gap-2">
              <Download className="w-4 h-4" /> Download All PDFs
            </button>
          </div>
        </div>
      </motion.div>

      {/* Category overview cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6"
      >
        {categoryGroups.slice(0, 12).map((g, i) => {
          const Icon = CAT_ICONS[g.name] || FileText;
          return (
            <motion.button
              key={g.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCategory(g.name === category ? 'All' : g.name)}
              className={cn(
                'card p-4 text-left hover:shadow-md transition-all relative overflow-hidden',
                category === g.name && 'ring-2 ring-primary-500 border-primary-500'
              )}
            >
              {category === g.name && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10" />
              )}
              <div className="relative">
                <Icon className="w-5 h-5 mb-2 text-primary-500" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{g.name}</p>
                <p className="text-xs text-slate-400">{g.count} items</p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-3 mb-4"
      >
        <div className="relative flex-1 min-w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search syllabus, notices, PDFs..."
            className="input pl-10"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="input py-2 text-sm w-auto min-w-36">
          {ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={department} onChange={e => setDepartment(e.target.value)} className="input py-2 text-sm w-auto min-w-36">
          {ALL_DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
      </motion.div>

      <p className="text-xs text-slate-400 mb-4">{filtered.length} of {allDocs.length} resources shown</p>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 text-slate-400"
        >
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="font-medium text-lg">No resources found</p>
          <p className="text-sm mt-2">Try adjusting your search or filters</p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doc, i) => <DocCard key={doc.id} doc={doc} index={i} />)}
        </div>
      )}

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-xl"
      >
        <p className="text-xs text-amber-700 dark:text-amber-400">
          <strong>📌 Note:</strong> These links redirect to the official WCE Sangli website (<a href="https://walchandsangli.ac.in" target="_blank" rel="noopener noreferrer" className="underline">walchandsangli.ac.in</a>).
          PDF downloads open in a new tab. Run <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">node scripts/scrape-wce.js</code> to refresh scraped data.
        </p>
      </motion.div>
    </div>
  );
}
