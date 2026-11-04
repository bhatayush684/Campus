import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, BookOpen, Clock, CheckCircle, Circle, Sparkles, Target, TrendingUp, Gauge, RotateCcw, ListChecks } from 'lucide-react';
import { cn } from '../lib/utils';
import { apiGenerateStudyPlan } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { StudyPlan as StudyPlanData } from '../types';
import { toast } from 'sonner';

const DEPARTMENTS = ['CSE', 'IT', 'ENTC', 'Civil', 'Mechanical', 'Electrical', 'AI/ML', 'Robotics', 'General'];

function SubjectCard({ subject, onToggle, index }: {
  subject: StudyPlanData['subjects'][number];
  onToggle: () => void;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const priorityColors: Record<string, string> = {
    high: 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    medium: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    low: 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.5) }}
      className={cn(
        'card p-4 border-l-4 transition-all hover:shadow-md',
        subject.completed ? 'border-l-green-500 opacity-60' : 'border-l-primary-500'
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          aria-label={`${subject.completed ? 'Mark' : 'Complete'} ${subject.name}`}
          onClick={onToggle}
          className={cn(
            'mt-1 flex-shrink-0 transition-colors',
            subject.completed ? 'text-green-500' : 'text-slate-300 hover:text-primary-500'
          )}
        >
          {subject.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={cn('font-semibold text-sm', subject.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white')}>
              {subject.name}
            </h3>
            <span className={cn('badge text-[10px]', priorityColors[subject.priority])}>
              {subject.priority}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {subject.estimatedHours}h
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {subject.chapters.length} chapters
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {(expanded ? subject.chapters : subject.chapters.slice(0, 3)).map((ch, i) => (
              <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">
                {ch}
              </span>
            ))}
            {subject.chapters.length > 3 && !expanded && (
              <button type="button" onClick={() => setExpanded(true)} className="text-[10px] text-primary-500 hover:underline">
                +{subject.chapters.length - 3} more
              </button>
            )}
          </div>
          {expanded && subject.chapters.length > 3 && (
            <button type="button" onClick={() => setExpanded(false)} className="text-[10px] text-slate-400 hover:text-primary-500 mt-1">
              Show less
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function StudyPlan() {
  const { user } = useAuthStore();
  const [generating, setGenerating] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlanData | null>(() => {
    try {
      const stored = localStorage.getItem('campus-mind-study-plan');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [department, setDepartment] = useState('CSE');
  const [examDate, setExamDate] = useState('');
  const [progress, setProgress] = useState(0);
  const [today] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (studyPlan) {
      localStorage.setItem('campus-mind-study-plan', JSON.stringify(studyPlan));
      const completed = studyPlan.subjects.filter(s => s.completed).length;
      setProgress(studyPlan.subjects.length ? (completed / studyPlan.subjects.length) * 100 : 0);
    }
  }, [studyPlan]);

  const handleGenerate = async () => {
    if (!examDate) {
      toast.error('Please select an exam date');
      return;
    }

    setGenerating(true);
    try {
      const plan = await apiGenerateStudyPlan(user!.id, department, examDate);
      setStudyPlan(plan);
      toast.success('Study plan generated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate study plan');
    } finally {
      setGenerating(false);
    }
  };

  const toggleSubject = (index: number) => {
    if (!studyPlan) return;
    const updated: StudyPlanData = {
      ...studyPlan,
      subjects: studyPlan.subjects.map((subject, subjectIndex) =>
        subjectIndex === index ? { ...subject, completed: !subject.completed } : subject
      ),
      updatedAt: new Date().toISOString(),
    };
    setStudyPlan(updated);
    
    // Update progress
    const completed = updated.subjects.filter(s => s.completed).length;
    setProgress((completed / updated.subjects.length) * 100);
  };

  const totalHours = studyPlan?.subjects.reduce((sum, subject) => sum + subject.estimatedHours, 0) || 0;
  const completedHours = studyPlan?.subjects.reduce((sum, subject) => subject.completed ? sum + subject.estimatedHours : sum, 0) || 0;
  const daysAvailable = useMemo(() => studyPlan?.metadata?.daysAvailable
    || (studyPlan ? Math.max(1, Math.ceil((new Date(`${studyPlan.examDate}T00:00:00`).getTime() - new Date(`${today}T00:00:00`).getTime()) / 86400000)) : 1), [studyPlan, today]);
  const dailyTarget = Math.ceil((totalHours / daysAvailable) * 10) / 10;
  const remainingHours = Math.max(0, totalHours - completedHours);
  const examDateLabel = useMemo(
    () => studyPlan ? new Date(`${studyPlan.examDate}T00:00:00`).toLocaleDateString('en-IN') : '',
    [studyPlan]
  );
  const deadlineLabel = useMemo(
    () => studyPlan ? new Date(`${studyPlan.examDate}T00:00:00`).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '',
    [studyPlan]
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          Study Plan Generator
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Generate personalized study plans based on syllabus and exam schedules
        </p>
      </motion.div>

      {!studyPlan ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Create Your Study Plan
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Department
                </label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="input w-full"
                >
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Exam Date
                </label>
                <input
                  type="date"
                  value={examDate}
                  min={today}
                  onChange={e => setExamDate(e.target.value)}
                  className="input w-full"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn-primary w-full justify-center"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Study Plan
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-950/20 rounded-xl border border-primary-200 dark:border-primary-800">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <p className="font-medium text-primary-600 dark:text-primary-400 mb-1">
                    How it works
                  </p>
                      <p className="text-xs">
                        The plan uses the available syllabus units, estimated workload, active recall, practice, and revision. Treat dates as planning targets and verify official notices before relying on them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-emerald-100">Your next best action</p>
                <h2 className="text-xl font-bold mt-1">
                  Complete about {dailyTarget} hours per day
                </h2>
                <p className="text-sm text-emerald-100 mt-1">
                  {remainingHours} hours remain across {daysAvailable} day{daysAvailable === 1 ? '' : 's'} before your planning deadline.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/15 rounded-xl px-4 py-3">
                <Gauge className="w-5 h-5" />
                <span>{Math.round(progress)}% complete</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          {studyPlan.metadata && (
            <div className="card p-4 mb-6 border-l-4 border-l-blue-500">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Planning checks</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {studyPlan.metadata.daysAvailable} day(s) available. {studyPlan.metadata.note}
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-4 text-center"
            >
              <BookOpen className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{studyPlan.subjects.length}</p>
              <p className="text-xs text-slate-400">Subjects</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="card p-4 text-center"
            >
              <Clock className="w-6 h-6 text-accent-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalHours}h</p>
              <p className="text-xs text-slate-400">Total Hours</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="card p-4 text-center"
            >
              <TrendingUp className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{progress.toFixed(0)}%</p>
              <p className="text-xs text-slate-400">Progress</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="card p-4 text-center"
            >
              <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {examDateLabel}
              </p>
              <p className="text-xs text-slate-400">Exam Date</p>
            </motion.div>
          </div>

          <div className="card p-4 mb-6 grid sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div><p className="text-xs text-slate-400">Planning deadline</p><p className="font-semibold text-slate-900 dark:text-white">{deadlineLabel}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-accent-500" />
              <div><p className="text-xs text-slate-400">Suggested daily target</p><p className="font-semibold text-slate-900 dark:text-white">{dailyTarget} hours/day</p></div>
            </div>
            <div className="flex items-center gap-3">
              <ListChecks className="w-5 h-5 text-emerald-500" />
              <div><p className="text-xs text-slate-400">Official reference</p><p className="font-semibold text-slate-900 dark:text-white">{studyPlan.metadata?.officialExamReference ? 'Found — verify notice' : 'Not matched'}</p></div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="card p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Overall Progress
              </span>
              <span className="text-sm text-slate-400">
                {completedHours}h / {totalHours}h completed
              </span>
            </div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
              />
            </div>
          </div>

          {/* Subjects */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Study Subjects
              </h2>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Start a new plan? Your current progress will be replaced.')) setStudyPlan(null);
                }}
                className="text-sm text-slate-400 hover:text-primary-500 transition-colors inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Generate New Plan
              </button>
            </div>
            {studyPlan.subjects.map((subject: any, index: number) => (
              <SubjectCard
                key={index}
                subject={subject}
                onToggle={() => toggleSubject(index)}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
