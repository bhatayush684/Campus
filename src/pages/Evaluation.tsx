import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Loader2 } from 'lucide-react';
import { apiGetAnalytics, apiGetEvalMetrics } from '../services/api';
import { AnalyticsData, EvalMetric } from '../types';
import { cn } from '../lib/utils';
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

function MetricCard({ label, value, color, desc }: { label: string; value: number; color: string; desc: string }) {
  const pct = Math.round(value * 100);
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <div className="flex items-end gap-2 mb-2">
        <span className="text-3xl font-bold text-slate-900 dark:text-white">{pct}%</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <p className="text-xs text-slate-400">{desc}</p>
    </div>
  );
}

export default function Evaluation() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [metrics, setMetrics] = useState<EvalMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiGetAnalytics(), apiGetEvalMetrics()]).then(([a, m]) => {
      setAnalytics(a);
      setMetrics(m);
      setLoading(false);
    });
  }, []);

  const avgMetrics = metrics.length > 0 ? {
    faithfulness: metrics.reduce((s, m) => s + m.faithfulness, 0) / metrics.length,
    answerRelevancy: metrics.reduce((s, m) => s + m.answerRelevancy, 0) / metrics.length,
    contextPrecision: metrics.reduce((s, m) => s + m.contextPrecision, 0) / metrics.length,
    contextRecall: metrics.reduce((s, m) => s + m.contextRecall, 0) / metrics.length,
  } : null;

  const radarData = avgMetrics ? [
    { metric: 'Faithfulness', value: Math.round(avgMetrics.faithfulness * 100) },
    { metric: 'Ans. Relevancy', value: Math.round(avgMetrics.answerRelevancy * 100) },
    { metric: 'Context Precision', value: Math.round(avgMetrics.contextPrecision * 100) },
    { metric: 'Context Recall', value: Math.round(avgMetrics.contextRecall * 100) },
  ] : [];

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">RAGAS Evaluation</h1>
          <p className="text-slate-400 text-sm mt-1">Retrieval-Augmented Generation quality metrics dashboard</p>
        </div>
        <button
          className="btn-secondary text-sm"
          onClick={() => {
            setLoading(true);
            Promise.all([apiGetAnalytics(), apiGetEvalMetrics()]).then(([a, m]) => {
              setAnalytics(a);
              setMetrics(m);
              setLoading(false);
            });
          }}
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Avg RAGAS Metrics */}
      {avgMetrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Faithfulness" value={avgMetrics.faithfulness} color="bg-primary-500" desc="Answer stays true to retrieved context" />
          <MetricCard label="Answer Relevancy" value={avgMetrics.answerRelevancy} color="bg-emerald-500" desc="How relevant is the answer to the query" />
          <MetricCard label="Context Precision" value={avgMetrics.contextPrecision} color="bg-amber-500" desc="Signal-to-noise ratio of retrieved context" />
          <MetricCard label="Context Recall" value={avgMetrics.contextRecall} color="bg-purple-500" desc="Coverage of relevant context retrieved" />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Radar Chart */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Overall Quality Radar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Queries over time */}
        {analytics && (
          <div className="card p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Queries Per Day</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={analytics.queriesPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12 }} />
                <Legend />
                <Line type="monotone" dataKey="queries" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} name="Total" />
                <Line type="monotone" dataKey="answered" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} name="Answered" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Avg Response Time */}
        {analytics && (
          <div className="card p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Avg Response Time (seconds)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.avgResponseTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12 }} />
                <Bar dataKey="time" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Response Time (s)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top questions */}
        {analytics && (
          <div className="card p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Top Questions</h3>
            <div className="space-y-3">
              {analytics.topQuestions.slice(0, 6).map((q, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-5">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-xs text-slate-700 dark:text-slate-300 truncate">{q.question}</p>
                    <div className="mt-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(q.count / 89) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{q.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Test Questions Table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">Test Question Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {['Question', 'Faithfulness', 'Answer Relevancy', 'Context Precision', 'Context Recall'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, i) => (
                <motion.tr
                  key={m.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                >
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs max-w-xs">
                    <p className="truncate">{m.question}</p>
                  </td>
                  {[m.faithfulness, m.answerRelevancy, m.contextPrecision, m.contextRecall].map((v, j) => (
                    <td key={j} className="px-4 py-3">
                      <span className={cn(
                        'font-mono text-xs font-medium',
                        v >= 0.9 ? 'text-emerald-600 dark:text-emerald-400' :
                        v >= 0.8 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500'
                      )}>
                        {(v * 100).toFixed(0)}%
                      </span>
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
