import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Trash2, Search, CheckCircle, AlertCircle, Loader, Clock, Eye, Tag } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { apiGetDocuments, apiUploadDocument, apiDeleteDocument } from '../services/api';
import { KnowledgeDocument } from '../types';
import { cn, formatDate, formatFileSize, getStatusColor } from '../lib/utils';
import { toast } from 'sonner';

const CATEGORIES = ['Syllabus', 'Examination', 'Rules & Policies', 'Faculty', 'Timetable', 'Administrative', 'Placement', 'Other'];

const STATUS_ICONS: Record<string, any> = {
  Uploaded: Clock,
  Chunking: Loader,
  Embedded: Loader,
  Ready: CheckCircle,
  Error: AlertCircle,
};

export default function Documents() {
  const { user } = useAuthStore();
  const [docs, setDocs] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('Syllabus');
  const [, setProcessingIds] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<KnowledgeDocument | null>(null);
  const [reviewedIds, setReviewedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('campusmind_reviewed_documents') || '[]'); } catch { return []; }
  });

  const canUpload = user?.role === 'faculty' || user?.role === 'admin';

  const loadDocs = () => {
    apiGetDocuments().then(d => { setDocs(d); setLoading(false); });
  };

  useEffect(() => { loadDocs(); }, []);

  // Simulate processing pipeline for new uploads
  const simulateProcessing = (docId: string) => {
    setProcessingIds(s => new Set([...s, docId]));
    const stages: [string, number, number][] = [
      ['Chunking', 30, 1500],
      ['Chunking', 60, 3000],
      ['Embedded', 80, 5000],
      ['Embedded', 95, 7000],
      ['Ready', 100, 9000],
    ];
    stages.forEach(([status, progress, delay]) => {
      setTimeout(() => {
        setDocs(prev => prev.map(d => d.id === docId ? { ...d, status: status as any, progress } : d));
        if (status === 'Ready') {
          setProcessingIds(s => { const n = new Set(s); n.delete(docId); return n; });
          toast.success('Document processed and ready!');
        }
      }, delay);
    });
  };

  const handleFiles = async (files: File[]) => {
    const valid = files.filter(f => ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(f.type));
    if (valid.length === 0) { toast.error('Only PDF and DOCX files are allowed'); return; }
    for (const file of valid) {
      try {
        const doc = await apiUploadDocument(file, uploadCategory, user?.name ?? 'Faculty');
        setDocs(prev => [doc, ...prev]);
        toast.success(`"${file.name}" uploaded!`);
        simulateProcessing(doc.id);
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  }, [uploadCategory, user]);

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteDocument(id);
      setDocs(prev => prev.filter(d => d.id !== id));
      setReviewedIds(prev => {
        const next = prev.filter(reviewedId => reviewedId !== id);
        localStorage.setItem('campusmind_reviewed_documents', JSON.stringify(next));
        return next;
      });
      toast.success('Document deleted');
    } catch {
      toast.error('Could not delete the document');
    }
  };

  const filtered = docs.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase()) ||
    d.uploadedBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {canUpload ? 'Knowledge Base' : 'Documents'}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {canUpload ? 'Upload and manage documents for the AI knowledge base' : 'Browse available college documents'}
        </p>
      </div>

      {/* Upload Area — Faculty/Admin only */}
      {canUpload && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="label text-xs">Upload Category</label>
              <select value={uploadCategory} onChange={e => setUploadCategory(e.target.value)} className="input py-2 text-sm">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer',
              isDragging
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-slate-50 dark:hover:bg-slate-800/30'
            )}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.accept = '.pdf,.docx';
              input.onchange = e => handleFiles(Array.from((e.target as HTMLInputElement).files ?? []));
              input.click();
            }}
          >
            <Upload className={cn('w-10 h-10 mx-auto mb-3', isDragging ? 'text-primary-500' : 'text-slate-300 dark:text-slate-600')} />
            <p className="font-medium text-slate-700 dark:text-slate-300">Drop files here or click to upload</p>
            <p className="text-sm text-slate-400 mt-1">Supports PDF and DOCX · Max 50MB per file</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search documents..."
          className="input pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {['Ready', 'Embedded', 'Chunking', 'Uploaded'].map(status => {
          const count = docs.filter(d => d.status === status).length;
          return (
            <div key={status} className="card px-4 py-3 flex items-center gap-3">
              <span className={cn('badge text-xs', getStatusColor(status))}>{status}</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => <div key={i} className="h-16 card animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No documents found</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Document</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Uploaded</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((doc, i) => {
                    const Icon = STATUS_ICONS[doc.status] ?? FileText;
                    return (
                      <motion.tr
                        key={doc.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4 text-red-500" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white truncate max-w-xs">{doc.name}</p>
                              <p className="text-xs text-slate-400">{formatFileSize(doc.size)} {doc.chunks ? `· ${doc.chunks} chunks` : ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs">
                            <Tag className="w-2.5 h-2.5 mr-1 inline" />{doc.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1.5">
                            <span className={cn('badge text-xs w-fit', getStatusColor(doc.status))}>
                              <Icon className={cn('w-3 h-3 mr-1 inline', (doc.status === 'Chunking' || doc.status === 'Embedded') && 'animate-spin')} />
                              {doc.status}
                            </span>
                            {doc.status !== 'Ready' && doc.status !== 'Error' && (
                              <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${doc.progress}%` }}
                                  className="h-full bg-primary-500 rounded-full"
                                  transition={{ duration: 0.5 }}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">
                          <p>{doc.uploadedBy}</p>
                          <p>{formatDate(doc.uploadedAt)}</p>
                        </td>
                        <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button className="btn-ghost p-1.5" onClick={() => setPreview(doc)} title="Preview">
                                <Eye className="w-4 h-4" />
                              </button>
                              {canUpload && (
                                <button
                                  onClick={() => handleDelete(doc.id)}
                                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPreview(null)} />
          <div className="relative card p-6 max-w-lg w-full z-10">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{preview.name}</h3>
            <p className="text-sm text-slate-500 mb-4">
              {preview.category} · {preview.status} · {formatFileSize(preview.size)} · uploaded by {preview.uploadedBy}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              This is a knowledge-base document used by CampusMind. Review the metadata before relying on its contents.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setPreview(null)}>Close</button>
              <button
                className="btn-primary"
                onClick={() => {
                  const next = reviewedIds.includes(preview.id)
                    ? reviewedIds.filter(id => id !== preview.id)
                    : [...reviewedIds, preview.id];
                  setReviewedIds(next);
                  localStorage.setItem('campusmind_reviewed_documents', JSON.stringify(next));
                  toast.success(next.includes(preview.id) ? 'Document marked as reviewed' : 'Review mark removed');
                  setPreview(null);
                }}
              >
                {reviewedIds.includes(preview.id) ? 'Remove reviewed mark' : 'Mark reviewed'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
