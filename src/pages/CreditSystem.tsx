import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Calculator, Info, BookOpen, Clock, BarChart3, CheckCircle } from 'lucide-react';

const CREDIT_INFO = {
  totalCredits: 160,
  creditsPerSemester: 20,
  creditTypes: [
    { type: 'Theory', credits: 3, hours: 3, description: 'Lecture-based subjects' },
    { type: 'Practical', credits: 2, hours: 4, description: 'Lab sessions' },
    { type: 'Tutorial', credits: 1, hours: 2, description: 'Problem-solving sessions' },
    { type: 'Project', credits: 4, hours: 8, description: 'Major/Minor projects' },
  ],
  grading: [
    { grade: 'O', points: 10, range: '90-100' },
    { grade: 'A+', points: 9, range: '85-89' },
    { grade: 'A', points: 8, range: '75-84' },
    { grade: 'B+', points: 7, range: '65-74' },
    { grade: 'B', points: 6, range: '55-64' },
    { grade: 'C', points: 5, range: '45-54' },
    { grade: 'D', points: 4, range: '40-44' },
    { grade: 'F', points: 0, range: '0-39' },
  ],
};

type CreditSubject = { id: number; name: string; credits: number; grade: string };

function CreditCalculator() {
  const [subjects, setSubjects] = useState<CreditSubject[]>(() => {
    try {
      const stored = localStorage.getItem('campus-mind-credits');
      if (stored) return JSON.parse(stored) as CreditSubject[];
    } catch { /* ignore */ }
    return [
      { id: 1, name: 'Subject 1', credits: 3, grade: 'A' },
      { id: 2, name: 'Subject 2', credits: 4, grade: 'B+' },
      { id: 3, name: 'Subject 3', credits: 3, grade: 'A+' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('campus-mind-credits', JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = () => {
    setSubjects([...subjects, { id: Date.now(), name: `Subject ${subjects.length + 1}`, credits: 3, grade: 'A' }]);
  };

  const removeSubject = (id: number) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const updateSubject = (id: number, field: string, value: any) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const calculateSGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    subjects.forEach(subject => {
      const gradePoints = CREDIT_INFO.grading.find(g => g.grade === subject.grade)?.points || 0;
      totalCredits += subject.credits;
      totalPoints += subject.credits * gradePoints;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const calculateCGPA = () => {
    return calculateSGPA(); // Simplified for demo
  };

  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary-500" />
          SGPA/CGPA Calculator
        </h3>
        <button
          onClick={addSubject}
          className="btn-ghost text-sm"
        >
          + Add Subject
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {subjects.map((subject) => (
          <div key={subject.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <input
              value={subject.name}
              onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
              className="input flex-1 text-sm py-2"
              placeholder="Subject name"
            />
            <input
              type="number"
              value={subject.credits}
              onChange={(e) => updateSubject(subject.id, 'credits', parseInt(e.target.value) || 0)}
              className="input w-20 text-sm py-2 text-center"
              placeholder="Credits"
              min="1"
              max="8"
            />
            <select
              value={subject.grade}
              onChange={(e) => updateSubject(subject.id, 'grade', e.target.value)}
              className="input w-24 text-sm py-2"
            >
              {CREDIT_INFO.grading.map(g => <option key={g.grade} value={g.grade}>{g.grade}</option>)}
            </select>
            <button
              onClick={() => removeSubject(subject.id)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-xl border border-primary-200 dark:border-primary-800">
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-1">Total Credits</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalCredits}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-1">SGPA</p>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{calculateSGPA()}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-1">CGPA</p>
          <p className="text-2xl font-bold text-accent-600 dark:text-accent-400">{calculateCGPA()}</p>
        </div>
      </div>
    </div>
  );
}

function CreditInfoCard({ item, index }: { item: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 dark:text-white">{item.type}</h4>
          <p className="text-sm text-slate-400 mb-2">{item.description}</p>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1 text-slate-500">
              <Award className="w-3 h-3" />
              {item.credits} Credits
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3 h-3" />
              {item.hours} Hours/Week
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GradeTable() {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-accent-500" />
        Grading System
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="text-left py-2 px-3 text-slate-400 font-medium">Grade</th>
              <th className="text-left py-2 px-3 text-slate-400 font-medium">Grade Points</th>
              <th className="text-left py-2 px-3 text-slate-400 font-medium">Marks Range</th>
            </tr>
          </thead>
          <tbody>
            {CREDIT_INFO.grading.map((grade, i) => (
              <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">{grade.grade}</td>
                <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{grade.points}</td>
                <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{grade.range}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CreditSystem() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          Credit System & Analysis
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Understand the credit system, grading, and calculate your SGPA/CGPA
        </p>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="card p-4 text-center">
          <Award className="w-6 h-6 text-primary-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{CREDIT_INFO.totalCredits}</p>
          <p className="text-xs text-slate-400">Total Credits</p>
        </div>
        <div className="card p-4 text-center">
          <TrendingUp className="w-6 h-6 text-accent-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{CREDIT_INFO.creditsPerSemester}</p>
          <p className="text-xs text-slate-400">Credits/Sem</p>
        </div>
        <div className="card p-4 text-center">
          <BookOpen className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900 dark:text-white">8</p>
          <p className="text-xs text-slate-400">Semesters</p>
        </div>
        <div className="card p-4 text-center">
          <Calculator className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900 dark:text-white">10</p>
          <p className="text-xs text-slate-400">Grade Scale</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Credit Types */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-slate-400" />
            Credit Types
          </h2>
          <div className="space-y-3">
            {CREDIT_INFO.creditTypes.map((item, index) => (
              <CreditInfoCard key={index} item={item} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CreditCalculator />
        </motion.div>
      </div>

      {/* Grading System */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <GradeTable />
      </motion.div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-primary-50 dark:bg-primary-950/20 rounded-xl border border-primary-200 dark:border-primary-800"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <p className="font-medium text-primary-600 dark:text-primary-400 mb-1">
              Credit System Overview
            </p>
            <p className="text-xs">
              WCE follows the Shivaji University credit system. Each subject is assigned credits based on lecture, tutorial, and practical hours. 
              SGPA is calculated per semester, while CGPA is the cumulative average across all semesters. 
              A minimum of 5.0 CGPA is required to pass each semester.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
