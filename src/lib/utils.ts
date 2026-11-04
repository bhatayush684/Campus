import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function generateICS(entries: {
  title: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
}[]): string {
  const events = entries.map(e => `BEGIN:VEVENT
DTSTART:${e.start.replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${e.end.replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${e.title}
LOCATION:${e.location ?? ''}
DESCRIPTION:${e.description ?? ''}
END:VEVENT`).join('\n');

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CampusMind//WCE//EN
${events}
END:VCALENDAR`;
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.substring(0, n) + '...' : str;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getRoleColor(role: string): string {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'faculty': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'student': return 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400';
    default: return 'bg-slate-100 text-slate-700';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Ready': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'Embedded': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'Chunking': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'Uploaded': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    case 'Error': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-slate-100 text-slate-700';
  }
}

export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    'Exam': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'Placement': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Hostel': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Events': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'General': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  };
  return map[category] ?? 'bg-slate-100 text-slate-700';
}
