export type Role = 'student' | 'faculty' | 'admin';

export type Department = 'CSE' | 'ENTC' | 'Civil' | 'Mechanical' | 'Electrical' | 'IT' | 'AI/ML' | 'Robotics' | 'General';

export type Year = 'FY' | 'SY' | 'TY' | 'BE';

export type Division = 'A' | 'B' | 'C';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  department: Department;
  year?: Year;
  division?: Division;
  prnOrEmpId: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Source[];
  feedback?: 'up' | 'down' | null;
  isStreaming?: boolean;
}

export interface Source {
  id: string;
  title: string;
  page: number;
  excerpt: string;
  category: string;
  date?: string | null;
  relevance?: number;
  url?: string | null;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export interface TimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  subjectCode: string;
  faculty: string;
  room: string;
  department: Department;
  year: Year;
  division: Division;
  type: 'lecture' | 'lab' | 'tutorial';
  color: string;
}

export type NoticeCategory = 'Exam' | 'Placement' | 'Hostel' | 'Events' | 'General' | 'Admission';

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  date: string;
  isPinned: boolean;
  isRead?: boolean;
  author: string;
  attachments?: string[];
  url?: string;
}

export type DocumentStatus = 'Uploaded' | 'Chunking' | 'Embedded' | 'Ready' | 'Error';

export interface KnowledgeDocument {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  status: DocumentStatus;
  progress: number;
  category: string;
  uploadedBy: string;
  uploadedAt: string;
  chunks?: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  timestamp: string;
  link?: string;
}

export interface RAGSettings {
  model: string;
  chunkSize: number;
  topK: number;
  temperature: number;
  maxTokens: number;
  similarityThreshold: number;
}

export interface EvalMetric {
  id: string;
  question: string;
  answer: string;
  faithfulness: number;
  answerRelevancy: number;
  contextPrecision: number;
  contextRecall: number;
  timestamp: string;
}

export interface AnalyticsData {
  queriesPerDay: { date: string; queries: number; answered: number }[];
  topQuestions: { question: string; count: number }[];
  feedbackRatio: { date: string; positive: number; negative: number }[];
  avgResponseTime: { date: string; time: number }[];
  unansweredQueries: { id: string; query: string; timestamp: string; department: string }[];
}

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  path?: string;
  action?: () => void;
  category: string;
}

export interface ThemeConfig {
  mode: 'light' | 'dark';
}

export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'en' | 'mr' | 'hi';
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
}

// ── Scraped Data Types ───────────────────────────────────────────────────────
export interface ScrapedNotice {
  id: string;
  title: string;
  url: string;
  type: 'PDF' | 'LINK';
  category: string;
  isPinned: boolean;
  date: string;
  author: string;
  source: string;
  content?: string;
}

export interface ScrapedDocument {
  id: string;
  title: string;
  url: string;
  downloadUrl?: string;
  type: 'PDF' | 'DOC' | 'LINK';
  category: string;
  department: string;
  source: string;
}

export interface ScrapedFaculty {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  department: string;
  email?: string;
  cabin?: string;
  hours?: string;
}

export interface ScrapedPlacement {
  id: string;
  company: string;
  package: string;
  tier?: string;
  year: string;
  students: string;
  eligibleBranches?: string[];
  role?: string;
  location?: string;
  selectionProcess?: string;
  url?: string;
  source?: string;
}

export interface ScrapedEvent {
  id: string;
  title: string;
  url?: string;
  date: string;
  venue?: string;
  description?: string;
  source?: string;
}

export interface ScrapedDepartment {
  id: string;
  name: string;
  url: string;
  overview: string;
  hod: string;
  intake?: string;
  established?: number;
  accreditation?: string;
  links?: Array<{ text: string; url: string }>;
}

export interface ScrapedSyllabus {
  id: string;
  courseCode?: string;
  title: string;
  url?: string;
  syllabusUrl?: string;
  downloadUrl?: string;
  department: string;
  year: string;
  semester: string;
  credits?: number;
  hours?: string;
  category?: string;
  description?: string;
  units?: Array<{ unit: number; title: string; topics: string }>;
  textbooks?: string[];
  examPattern?: string;
  source?: string;
  content?: string;
}

export interface ScrapedExamSchedule {
  id: string;
  title: string;
  url?: string;
  type: string;
  date: string;
  time?: string;
  subject?: string;
  department?: string;
  year?: string;
  semester?: string;
  venue?: string;
  reportingTime?: string;
  instructions?: string;
  source?: string;
}

export interface StudyPlan {
  id: string;
  userId: string;
  title: string;
  subjects: Array<{
    name: string;
    chapters: string[];
    priority: 'high' | 'medium' | 'low';
    estimatedHours: number;
    completed: boolean;
  }>;
  examDate: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    daysAvailable: number;
    checkedOn: string;
    officialExamReference: {
      date: string;
      subject?: string;
      source?: string;
    } | null;
    note: string;
    pyqs?: PYQ[];
    resources?: StudyResource[];
  };
}

export interface PYQ {
  id: string;
  subject: string;
  year: string;
  marks: number;
  question: string;
  unit?: string;
  type: 'theory' | 'numerical' | 'programming' | 'diagram';
}

export interface StudyResource {
  title: string;
  type: 'syllabus' | 'notes' | 'pyq' | 'textbook' | 'official';
  url?: string;
  description: string;
}

export type NotesGenerationMode = 'course' | 'module' | 'topic';

export interface GeneratedNotes {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  content: string;
  syllabusUrl?: string;
  createdAt: string;
}
