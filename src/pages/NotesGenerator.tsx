import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles, FileText, Copy, Download, Check, Loader2,
  BookOpen, Bookmark, BookmarkCheck, History
} from 'lucide-react';
import { apiGenerateNotes } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { GeneratedNotes } from '../types';
import { toast } from 'sonner';

const POPULAR_SUBJECTS = [
  'Machine Learning',
  'Database Management Systems',
  'Computer Networks',
  'Operating Systems',
  'Data Structures & Algorithms',
  'Web Technologies & Cloud Computing',
  'Digital Signal Processing',
  'Structural Analysis',
  'Applied Thermodynamics',
  'Control Systems Engineering',
  'Deep Learning & Computer Vision'
];

const SUGGESTED_TOPICS: Record<string, string[]> = {
  'Machine Learning': [
    'Supervised vs Unsupervised & Regularization (L1/L2)',
    'Support Vector Machines & Kernel Trick',
    'Decision Trees, Random Forests & AdaBoost',
    'K-Means Clustering & PCA Dimensionality Reduction',
    'Multi-Layer Perceptron & Backpropagation'
  ],
  'Database Management Systems': [
    'Normalization from 1NF to BCNF with Functional Dependencies',
    'ACID Properties & Two-Phase Locking (2PL)',
    'Serializability & Concurrency Control Protocols',
    'B+ Tree Indexing & Query Optimization',
    'NoSQL Architecture & CAP Theorem'
  ],
  'Computer Networks': [
    'TCP Congestion Control (Slow Start, Fast Retransmit, Fast Recovery)',
    'IPv4 vs IPv6 Subnetting & CIDR Address Calculations',
    'Distance Vector vs Link State Routing (OSPF, RIP, BGP)',
    'Sliding Window Protocols (Go-Back-N & Selective Repeat)',
    'TLS/SSL Cryptographic Handshake & HTTPS Flow'
  ],
  'Operating Systems': [
    'Process Synchronization, Semaphores & Dining Philosophers',
    'CPU Scheduling Algorithms (SJF, Round Robin, Multilevel)',
    'Deadlock Prevention & Banker Algorithm',
    'Virtual Memory, Paging, Page Fault Handling & LRU Replacement',
    'File System Architecture & Inode Allocation'
  ],
  'Data Structures & Algorithms': [
    'Asymptotic Notation & Time-Space Complexity Analysis',
    'Balanced Binary Search Trees (AVL & Red-Black Trees)',
    'Graph Traversals (BFS, DFS, Dijkstra, Kruskal, Prim)',
    'Dynamic Programming (0/1 Knapsack, LCS, Matrix Chain)',
    'Hash Tables, Collision Resolution & Universal Hashing'
  ]
};

export default function NotesGenerator() {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [subject, setSubject] = useState(searchParams.get('subject') || 'Machine Learning');
  const [topic, setTopic] = useState('Supervised vs Unsupervised & Regularization (L1/L2)');
  const [generating, setGenerating] = useState(false);
  const [notes, setNotes] = useState<GeneratedNotes | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedNotes, setSavedNotes] = useState<GeneratedNotes[]>(() => {
    try {
      const stored = localStorage.getItem('wce_saved_ai_notes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState<'editor' | 'history'>('editor');

  // Load from URL params if present
  useEffect(() => {
    const urlSubject = searchParams.get('subject');
    if (urlSubject) {
      setSubject(urlSubject);
      const defaults = SUGGESTED_TOPICS[urlSubject];
      if (defaults && defaults.length > 0) {
        setTopic(defaults[0]);
      }
    }
  }, [searchParams]);

  const handleGenerate = async () => {
    if (!subject.trim() || !topic.trim()) {
      toast.error('Please specify both subject and topic');
      return;
    }

    setGenerating(true);
    try {
      const result = await apiGenerateNotes(user?.id || 'demo_user', subject, topic);
      setNotes(result);
      toast.success('Study notes generated with exam blueprints!');
    } catch (error) {
      toast.error('Failed to generate study notes');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!notes) return;
    navigator.clipboard.writeText(notes.content);
    setCopied(true);
    toast.success('Copied full study notes to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'md' | 'txt') => {
    if (!notes) return;
    const blob = new Blob([notes.content], { type: format === 'md' ? 'text/markdown' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WCE_${notes.subject.replace(/\s+/g, '_')}_${notes.topic.replace(/\s+/g, '_')}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded notes as .${format} file!`);
  };

  const handleSaveToCollection = () => {
    if (!notes) return;
    const exists = savedNotes.some(n => n.id === notes.id || (n.subject === notes.subject && n.topic === notes.topic));
    let updated: GeneratedNotes[];
    if (exists) {
      updated = savedNotes.filter(n => n.id !== notes.id && !(n.subject === notes.subject && n.topic === notes.topic));
      toast.info('Removed from saved study notes');
    } else {
      updated = [notes, ...savedNotes];
      toast.success('Saved to your study collection!');
    }
    setSavedNotes(updated);
    localStorage.setItem('wce_saved_ai_notes', JSON.stringify(updated));
  };

  const isSaved = notes && savedNotes.some(n => n.id === notes.id || (n.subject === notes.subject && n.topic === notes.topic));
  const suggestedForCurrent = SUGGESTED_TOPICS[subject] || [
    `Foundations and Definitions of ${subject}`,
    `Core Mathematical Model and Architecture`,
    `Standard Industrial Applications & Best Practices`,
    `Common Examination Questions and Solutions`
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered WCE Curriculum Study Engine
          </div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            AI Study Notes & Formula Synthesizer
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Generate high-yield study guides, mathematical derivations, pseudo-code blueprints, and exam model answers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
              activeTab === 'editor'
                ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/30'
                : 'bg-slate-900 text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            Generator
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/30'
                : 'bg-slate-900 text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Saved Notes ({savedNotes.length})
          </button>
        </div>
      </div>

      {activeTab === 'history' ? (
        /* Saved Notes View */
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-purple-400" />
            Your Saved Study Collections
          </h3>
          {savedNotes.length === 0 ? (
            <div className="glass-card p-12 text-center text-slate-400">
              <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30 text-purple-400" />
              <p className="text-lg font-semibold text-white">No saved notes yet</p>
              <p className="text-sm mt-1">Generate notes and click the bookmark button to save them here for offline revision</p>
              <button
                onClick={() => setActiveTab('editor')}
                className="btn-primary text-xs mt-4"
              >
                Go to Generator
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {savedNotes.map((item) => (
                <div key={item.id} className="glass-card p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-md">
                      {item.subject}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">{item.topic}</h4>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-mono">
                    {item.content.slice(0, 200)}...
                  </p>
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => {
                        setNotes(item);
                        setActiveTab('editor');
                      }}
                      className="btn-primary text-xs py-1.5 px-3 flex-1 justify-center gap-1"
                    >
                      Open Notes
                    </button>
                    <button
                      onClick={() => {
                        const updated = savedNotes.filter(n => n.id !== item.id);
                        setSavedNotes(updated);
                        localStorage.setItem('wce_saved_ai_notes', JSON.stringify(updated));
                        toast.info('Deleted from saved notes');
                      }}
                      className="btn-secondary text-xs py-1.5 px-3"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Generator & Notes View */
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card p-6 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Customize Study Target
              </h2>

              {/* Subject selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Academic Subject
                </label>
                <input
                  list="subjects-list"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Select or enter subject name..."
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-purple-500"
                />
                <datalist id="subjects-list">
                  {POPULAR_SUBJECTS.map(s => <option key={s} value={s} />)}
                </datalist>
              </div>

              {/* Topic selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Specific Syllabus Topic
                </label>
                <input
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. Normalization 1NF to BCNF, Kernel Trick in SVM..."
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-purple-500"
                />
              </div>

              {/* Quick Topic Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  High-Yield WCE Exam Topics for this Subject:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedForCurrent.map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTopic(t)}
                      className={`text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors border ${
                        topic === t
                          ? 'bg-purple-600/30 text-purple-300 border-purple-500'
                          : 'bg-slate-950/60 text-slate-400 border-white/5 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Action Button */}
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn-primary w-full py-3 justify-center text-sm gap-2 mt-4"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Synthesizing WCE Syllabus Notes...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Comprehensive Notes
                  </>
                )}
              </button>
            </div>

            {/* Quick Tips Box */}
            <div className="glass-card p-5 space-y-2 border-purple-500/20 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-400" /> WCE Examination Insights
              </span>
              <p className="text-slate-400 leading-relaxed">
                Generated notes are structured per WCE autonomous examination patterns: formal definition, system architecture diagram, algorithmic analysis, and model 4-to-6 mark questions.
              </p>
            </div>
          </div>

          {/* Output Document Column (7 cols) */}
          <div className="lg:col-span-7">
            {!notes ? (
              <div className="glass-card p-16 text-center text-slate-400 h-full flex flex-col items-center justify-center min-h-[420px]">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-purple-400 opacity-60" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Notes Generated Yet</h3>
                <p className="text-sm max-w-md mx-auto text-slate-400">
                  Pick a subject and topic on the left, then click <strong>Generate Comprehensive Notes</strong> to create an instant revision study guide.
                </p>
                <button
                  onClick={handleGenerate}
                  className="btn-primary text-xs mt-6 gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Try Sample (Machine Learning)
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card overflow-hidden flex flex-col"
              >
                {/* Notes Document Action Bar */}
                <div className="p-4 border-b border-white/10 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                      {notes.subject}
                    </span>
                    <h3 className="text-base font-bold text-white truncate max-w-sm">
                      {notes.topic}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={handleSaveToCollection}
                      className={`p-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                        isSaved
                          ? 'bg-purple-600 text-white border-purple-500'
                          : 'bg-slate-900 text-slate-300 border-white/10 hover:text-white'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save to my notes'}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4 text-white" /> : <Bookmark className="w-4 h-4" />}
                      <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                    </button>

                    <button
                      onClick={handleCopy}
                      className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1.5"
                      title="Copy full text"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span className="hidden sm:inline">Copy</span>
                    </button>

                    <button
                      onClick={() => handleDownload('md')}
                      className="btn-secondary text-xs py-2 px-3 gap-1"
                      title="Download Markdown"
                    >
                      <Download className="w-3.5 h-3.5" />
                      .MD
                    </button>

                    <button
                      onClick={() => handleDownload('txt')}
                      className="btn-primary text-xs py-2 px-3 gap-1"
                      title="Download Plain Text"
                    >
                      <Download className="w-3.5 h-3.5" />
                      .TXT
                    </button>
                  </div>
                </div>

                {/* Rendered Markdown Body */}
                <div className="p-6 md:p-8 overflow-y-auto max-h-[75vh] space-y-4 text-slate-200">
                  <div className="markdown-body prose prose-invert prose-purple max-w-none text-sm leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {notes.content}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Document Footer */}
                <div className="p-4 border-t border-white/10 bg-slate-950/80 text-xs text-slate-500 flex items-center justify-between">
                  <span>Generated by CampusMind AI Engine</span>
                  <span>{new Date(notes.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
