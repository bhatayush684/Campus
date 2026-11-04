import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Search, ChevronDown, ToggleLeft, ToggleRight, Sliders, Save, Loader2 } from 'lucide-react';
import { apiGetUsers, apiGetAnalytics, apiUpdateUserRole, apiToggleUserStatus, apiGetRAGSettings, apiSaveRAGSettings } from '../services/api';
import { User, AnalyticsData, RAGSettings } from '../types';
import { cn, getRoleColor, formatDate } from '../lib/utils';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type Tab = 'users' | 'feedback' | 'rag' | 'unanswered';

export default function Admin() {
  const [tab, setTab] = useState<Tab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [ragSettings, setRagSettings] = useState<RAGSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [savingRAG, setSavingRAG] = useState(false);
  const [answerFor, setAnswerFor] = useState<{ id: string; query: string } | null>(null);
  const [answerText, setAnswerText] = useState('');

  useEffect(() => {
    Promise.all([apiGetUsers(), apiGetAnalytics(), apiGetRAGSettings()]).then(([u, a, r]) => {
      setUsers(u);
      setAnalytics(a);
      setRagSettings(r);
      setLoading(false);
    });
  }, []);

  const handleRoleChange = async (userId: string, role: User['role']) => {
    await apiUpdateUserRole(userId, role);
    setUsers(u => u.map(user => user.id === userId ? { ...user, role } : user));
    toast.success('Role updated');
  };

  const handleToggleStatus = async (userId: string) => {
    const updated = await apiToggleUserStatus(userId);
    setUsers(u => u.map(user => user.id === userId ? updated : user));
    toast.success(updated.isActive ? 'User activated' : 'User deactivated');
  };

  const handleSaveRAG = async () => {
    if (!ragSettings) return;
    setSavingRAG(true);
    await apiSaveRAGSettings(ragSettings);
    setSavingRAG(false);
    toast.success('RAG settings saved!');
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.prnOrEmpId.toLowerCase().includes(search.toLowerCase())
  );

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'unanswered', label: 'Unanswered', icon: MessageSquare },
    { id: 'feedback', label: 'Feedback Log', icon: ChevronDown },
    { id: 'rag', label: 'RAG Settings', icon: Sliders },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>
        <p className="text-slate-400 text-sm mt-1">Manage users, review queries, and configure AI settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              tab === t.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            )}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">{Array(6).fill(0).map((_, i) => <div key={i} className="h-24 card animate-pulse" />)}</div>
      ) : (
        <>
          {/* Users Tab */}
          {tab === 'users' && (
            <div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="input pl-10" />
              </div>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        {['User', 'ID/PRN', 'Department', 'Role', 'Status', 'Actions'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u, i) => (
                        <motion.tr
                          key={u.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.04 }}
                          className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                                {u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 dark:text-white">{u.name}</p>
                                <p className="text-xs text-slate-400">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs font-mono">{u.prnOrEmpId}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{u.department}</td>
                          <td className="px-4 py-3">
                            <select
                              value={u.role}
                              onChange={e => handleRoleChange(u.id, e.target.value as User['role'])}
                              className={cn('badge border-0 cursor-pointer text-xs', getRoleColor(u.role))}
                            >
                              <option value="student">student</option>
                              <option value="faculty">faculty</option>
                              <option value="admin">admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn('badge text-xs', u.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400')}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleToggleStatus(u.id)}
                              className={cn('flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors', u.isActive ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500' : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-500')}
                            >
                              {u.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Unanswered Queries */}
          {tab === 'unanswered' && (
            <div className="space-y-3">
              <p className="text-sm text-slate-500">{analytics?.unansweredQueries.length} unanswered queries pending review</p>
              {analytics?.unansweredQueries.map((q, i) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="card p-4 flex items-start gap-4"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{q.query}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                      <span>Dept: {q.department}</span>
                      <span>·</span>
                      <span>{formatDate(q.timestamp)}</span>
                    </div>
                  </div>
                  <button
                    className="btn-secondary text-xs py-1.5"
                    onClick={() => { setAnswerFor(q); setAnswerText(''); }}
                  >
                    Add Answer
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Feedback Log */}
          {tab === 'feedback' && analytics && (
            <div className="space-y-6">
              <div className="card p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Feedback Ratio (Last 9 Days)</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={analytics.feedbackRatio}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12 }} />
                    <Legend />
                    <Bar dataKey="positive" fill="#10b981" radius={[4, 4, 0, 0]} name="Positive" />
                    <Bar dataKey="negative" fill="#ef4444" radius={[4, 4, 0, 0]} name="Negative" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Top Questions</h3>
                <div className="space-y-3">
                  {analytics.topQuestions.map((q, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400 w-6 text-right">{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm text-slate-700 dark:text-slate-300">{q.question}</p>
                        <div className="mt-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 rounded-full"
                            style={{ width: `${(q.count / 89) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-500 w-10 text-right">{q.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* RAG Settings */}
          {tab === 'rag' && ragSettings && (
            <div className="max-w-2xl">
              <div className="card p-6 space-y-6">
                <div>
                  <label className="label">AI Model</label>
                  <select
                    value={ragSettings.model}
                    onChange={e => setRagSettings({ ...ragSettings, model: e.target.value })}
                    className="input"
                  >
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  </select>
                </div>

                {[
                  { key: 'chunkSize', label: 'Chunk Size (tokens)', min: 128, max: 2048, step: 128 },
                  { key: 'topK', label: 'Top-K Retrieved Documents', min: 1, max: 20, step: 1 },
                  { key: 'maxTokens', label: 'Max Output Tokens', min: 256, max: 4096, step: 256 },
                ].map(({ key, label, min, max, step }) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="label mb-0">{label}</label>
                      <span className="text-sm font-mono font-medium text-primary-600 dark:text-primary-400">{(ragSettings as any)[key]}</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={step}
                      value={(ragSettings as any)[key]}
                      onChange={e => setRagSettings({ ...ragSettings, [key]: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>{min}</span><span>{max}</span>
                    </div>
                  </div>
                ))}

                {[
                  { key: 'temperature', label: 'Temperature', min: 0, max: 2, step: 0.1 },
                  { key: 'similarityThreshold', label: 'Similarity Threshold', min: 0.5, max: 1.0, step: 0.05 },
                ].map(({ key, label, min, max, step }) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="label mb-0">{label}</label>
                      <span className="text-sm font-mono font-medium text-primary-600 dark:text-primary-400">{(ragSettings as any)[key].toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={step}
                      value={(ragSettings as any)[key]}
                      onChange={e => setRagSettings({ ...ragSettings, [key]: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>{min}</span><span>{max}</span>
                    </div>
                  </div>
                ))}

                <button onClick={handleSaveRAG} disabled={savingRAG} className="btn-primary w-full justify-center">
                  {savingRAG ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {savingRAG ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {answerFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAnswerFor(null)} />
          <div className="relative card p-6 max-w-lg w-full z-10">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Add knowledge answer</h3>
            <p className="text-sm text-slate-500 mb-4">{answerFor.query}</p>
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              rows={5}
              className="input w-full"
              placeholder="Write the official answer to add to the knowledge base..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setAnswerFor(null)}>Cancel</button>
              <button
                className="btn-primary"
                onClick={() => {
                  if (!answerText.trim()) {
                    toast.error('Please write an answer');
                    return;
                  }
                  setAnalytics((prev) => prev ? {
                    ...prev,
                    unansweredQueries: prev.unansweredQueries.filter((q) => q.id !== answerFor.id),
                  } : prev);
                  toast.success('Answer added to the knowledge base');
                  setAnswerFor(null);
                }}
              >
                Save answer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
