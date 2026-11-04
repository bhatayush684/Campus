/**
 * api.ts — All fake API calls with 400–1200ms delay.
 * To connect a real backend, replace each function body with a real fetch/axios call.
 * See README.md for the endpoint mapping table.
 */

import { User, Conversation, Message, TimetableEntry, Notice, KnowledgeDocument, AnalyticsData, EvalMetric, RAGSettings, ScrapedSyllabus, ScrapedExamSchedule, StudyPlan, GeneratedNotes } from '../types';
import { mockUsers } from '../mock/users';
import { mockTimetable } from '../mock/timetable';
import { mockDocuments } from '../mock/documents';
import { mockAnalytics, mockEvalMetrics } from '../mock/analytics';
import scrapedNotices from '../data/scraped/notices.json';
import scrapedFaculty from '../data/scraped/faculty.json';
import scrapedDocs from '../data/scraped/syllabus_docs.json';
import scrapedSyllabus from '../data/scraped/syllabus.json';
import scrapedExamSchedules from '../data/scraped/exam_schedules.json';
import scrapedPlacements from '../data/scraped/placements.json';
import scrapedEvents from '../data/scraped/events.json';
import scrapedDepartments from '../data/scraped/departments.json';


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// ─── AUTH ───────────────────────────────────────────────────────────────────

/**
 * Login a user.
 * Real API: POST /api/auth/login { email, password }
 */
export async function apiLogin(email: string, password: string): Promise<User> {
  await delay(rand(400, 800));
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password');
  if (!user.isActive) throw new Error('Your account has been deactivated. Contact admin.');
  return user;
}

/**
 * Register a new user.
 * Real API: POST /api/auth/register { ...userData }
 */
export async function apiSignup(userData: Omit<User, 'id' | 'isActive' | 'createdAt'>): Promise<User> {
  await delay(rand(600, 1200));
  const existing = mockUsers.find(u => u.email === userData.email);
  if (existing) throw new Error('An account with this email already exists');
  const newUser: User = {
    ...userData,
    id: `u${Date.now()}`,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  return newUser;
}

/**
 * Send password reset email.
 * Real API: POST /api/auth/forgot-password { email }
 */
export async function apiForgotPassword(email: string): Promise<void> {
  await delay(rand(600, 1000));
  const user = mockUsers.find(u => u.email === email);
  if (!user) throw new Error('No account found with this email address');
}

// ─── USERS ──────────────────────────────────────────────────────────────────

/**
 * Get all users (admin only).
 * Real API: GET /api/users
 */
export async function apiGetUsers(): Promise<User[]> {
  await delay(rand(400, 800));
  return [...mockUsers];
}

/**
 * Update user role.
 * Real API: PATCH /api/users/:id { role }
 */
export async function apiUpdateUserRole(userId: string, role: User['role']): Promise<User> {
  await delay(rand(400, 800));
  const user = mockUsers.find(u => u.id === userId);
  if (!user) throw new Error('User not found');
  user.role = role;
  return user;
}

/**
 * Toggle user active status.
 * Real API: PATCH /api/users/:id/status { isActive }
 */
export async function apiToggleUserStatus(userId: string): Promise<User> {
  await delay(rand(400, 800));
  const user = mockUsers.find(u => u.id === userId);
  if (!user) throw new Error('User not found');
  user.isActive = !user.isActive;
  return user;
}

/**
 * Update user profile.
 * Real API: PATCH /api/users/:id { ...profileData }
 */
export async function apiUpdateProfile(userId: string, data: Partial<User>): Promise<User> {
  await delay(rand(500, 900));
  const idx = mockUsers.findIndex(u => u.id === userId);
  if (idx === -1) throw new Error('User not found');
  mockUsers[idx] = { ...mockUsers[idx], ...data };
  return mockUsers[idx];
}

// ─── CHAT ────────────────────────────────────────────────────────────────────

/**
 * Get all conversations for a user.
 * Real API: GET /api/conversations?userId=:id
 */
function loadConversations(userId: string): Conversation[] {
  try {
    const stored = localStorage.getItem(`conversations_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveConversations(userId: string, convos: Conversation[]) {
  localStorage.setItem(`conversations_${userId}`, JSON.stringify(convos));
}

export async function apiGetConversations(userId: string): Promise<Conversation[]> {
  await delay(rand(200, 400));
  return loadConversations(userId);
}

/**
 * Create a new conversation.
 * Real API: POST /api/conversations { userId, title }
 */
export async function apiCreateConversation(userId: string, title: string): Promise<Conversation> {
  await delay(rand(300, 600));
  const newConvo: Conversation = {
    id: `conv_${Date.now()}`,
    userId,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
  };
  const stored = loadConversations(userId);
  const updated = [newConvo, ...stored];
  saveConversations(userId, updated);
  return newConvo;
}

/**
 * Update conversation title.
 * Real API: PATCH /api/conversations/:id { title }
 */
export async function apiUpdateConversation(userId: string, convId: string, title: string): Promise<void> {
  await delay(rand(300, 500));
  const stored = loadConversations(userId);
  const updated = stored.map(c => c.id === convId ? { ...c, title, updatedAt: new Date().toISOString() } : c);
  saveConversations(userId, updated);
}

/**
 * Delete a conversation.
 * Real API: DELETE /api/conversations/:id
 */
export async function apiDeleteConversation(userId: string, convId: string): Promise<void> {
  await delay(rand(300, 600));
  const stored = loadConversations(userId);
  const updated = stored.filter(c => c.id !== convId);
  saveConversations(userId, updated);
}

export async function apiSaveConversations(userId: string, convos: Conversation[]): Promise<void> {
  saveConversations(userId, convos);
}

/**
 * Send a message and get bot response.
 * Real API: POST /api/conversations/:id/messages { content }
 */
export async function apiSendMessage(
  _userId: string,
  convId: string,
  content: string
): Promise<Message> {
  const response = await fetch('/api/chat/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId: convId, message: content }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || `Chat request failed (${response.status})`);
  }
  const payload = await response.json();
  const botResponse = payload.data;
  const msg: Message = {
    id: `msg_${Date.now()}`,
    conversationId: convId,
    role: 'assistant',
    content: botResponse.content,
    timestamp: botResponse.timestamp || new Date().toISOString(),
    sources: botResponse.sources,
    feedback: null,
  };
  return msg;
}

export async function apiGetChatStatus(): Promise<{ ready: boolean; provider: string; model: string | null; models: string[] }> {
  const response = await fetch('/api/chat/status');
  if (!response.ok) throw new Error('Could not check local AI status');
  return response.json();
}


/**
 * Submit message feedback.
 * Real API: PATCH /api/messages/:id/feedback { feedback: 'up' | 'down' }
 */
export async function apiSubmitFeedback(_messageId: string, _feedback: 'up' | 'down'): Promise<void> {
  await delay(rand(200, 400));
  // In real API, persists to backend
}

/**
 * Get faculty information.
 * Real API: GET /api/faculty?department=:dept
 */
export async function apiGetFaculty(filters?: { department?: string }): Promise<any[]> {
  await delay(rand(400, 700));
  let data = [...scrapedFaculty];
  if (filters?.department) {
    data = data.filter(f => f.department === filters.department);
  }
  return data;
}

/**
 * Get syllabus information.
 * Real API: GET /api/syllabus?department=:dept
 */
export async function apiGetSyllabus(filters?: { department?: string }): Promise<ScrapedSyllabus[]> {
  await delay(rand(400, 700));
  let data = [...scrapedSyllabus];
  if (filters?.department) {
    data = data.filter(s => s.department === filters.department);
  }
  return data;
}

/**
 * Get exam schedules.
 * Real API: GET /api/exam-schedules
 */
export async function apiGetExamSchedules(): Promise<ScrapedExamSchedule[]> {
  await delay(rand(400, 700));
  return scrapedExamSchedules;
}

/**
 * Get placements data.
 * Real API: GET /api/placements
 */
export async function apiGetPlacements(): Promise<any[]> {
  await delay(rand(400, 700));
  return scrapedPlacements;
}

/**
 * Get events data.
 * Real API: GET /api/events
 */
export async function apiGetEvents(): Promise<any[]> {
  await delay(rand(400, 700));
  return scrapedEvents;
}

/**
 * Get departments data.
 * Real API: GET /api/departments
 */
export async function apiGetDepartments(): Promise<any[]> {
  await delay(rand(400, 700));
  return scrapedDepartments;
}

/**
 * Generate study plan based on syllabus and exam schedule.
 * Real API: POST /api/study-plans/generate { userId, department, examDate }
 */
export async function apiGenerateStudyPlan(userId: string, department: string, examDate: string): Promise<StudyPlan> {
  await delay(rand(1000, 2000));
  const plan: StudyPlan = {
    id: `sp_${Date.now()}`,
    userId,
    title: `${department} Study Plan - ${new Date(examDate).toLocaleDateString()}`,
    subjects: (scrapedSyllabus.filter(s => s.department === department).length
      ? scrapedSyllabus.filter(s => s.department === department)
      : scrapedSyllabus
    )
      .slice(0, 6)
      .map((s, i) => ({
        name: s.title,
        chapters: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Revision'],
        priority: (i < 2 ? 'high' : i < 4 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
        estimatedHours: 12 + i * 2,
        completed: false,
      })),
    examDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return plan;
}

/**
 * Generate notes based on syllabus.
 * Real API: POST /api/notes/generate { userId, subject, topic }
 */
export async function apiGenerateNotes(userId: string, subject: string, topic: string): Promise<GeneratedNotes> {
  await delay(rand(800, 1500));
  
  const content = `# 📚 ${topic}
## Subject: ${subject} | Walchand College of Engineering, Sangli (Autonomous)

---

### 1. Executive Summary & Core Concept
**${topic}** is a foundational concept in **${subject}**, carrying significant weightage in both Mid-Semester (MSE) and End-Semester (ESE) examinations.

* **Definition:** A formal framework and methodology designed to model, analyze, and optimize systems operating under ${subject} constraints.
* **Prerequisites:** Fundamentals of discrete mathematics, algorithmic complexity, and foundational principles of ${subject}.
* **Primary Objective:** To provide guaranteed performance, deterministic behavior, and computational efficiency in real-world engineering applications.

---

### 2. Theoretical Breakdown & Architecture

\`\`\`
   [ Input / Data Stream ]
             │
             ▼
   ┌─────────────────────────────────────────┐
   │         Processing & Invariants         │
   │  - State Verification & Normalization    │
   │  - Core Algorithmic Logic (${topic})     │
   └─────────────────────────────────────────┘
             │
             ▼
   [ Optimized Output / State Transition ]
\`\`\`

#### Key Pillars:
1. **Structural Invariants:** Conditions that remain strictly invariant before and after execution of operations.
2. **Computational Complexity:**
   * **Best Case:** \`O(1)\` or \`O(log N)\` when optimal preconditions are met.
   * **Average Case:** \`O(N log N)\` under standard randomized inputs.
   * **Worst Case:** \`O(N^2)\` without balancing or regularization heuristics.
   * **Auxiliary Space:** \`O(N)\` for representation and execution memory.

3. **Core Mathematical Formulation:**
   $$\\mathcal{L}(\\theta) = \\sum_{i=1}^{N} \\ell(f(x_i; \\theta), y_i) + \\lambda \\cdot \\Omega(\\theta)$$
   Where $\\mathcal{L}(\\theta)$ represents the loss / cost function, and $\\Omega(\\theta)$ enforces regularized stability.

---

### 3. Implementation Blueprint & Pseudo-Code

\`\`\`python
def execute_${topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}(data, threshold=0.01):
    """
    Executes ${topic} procedure with defensive invariant checks.
    """
    if not data:
        raise ValueError("Input sequence cannot be null")
        
    state = initialize_state(data)
    converged = False
    iteration = 0
    
    while not converged and iteration < 1000:
        gradient = compute_gradient(state, data)
        state = update_state(state, gradient)
        
        if evaluate_convergence(gradient, threshold):
            converged = True
        iteration += 1
        
    return summarize_results(state)
\`\`\`

---

### 4. High-Yield WCE Exam Questions & Model Solutions

#### Q1. Explain the fundamental principles and operational trade-offs of ${topic}. (6 Marks)
* **Model Answer:** State the formal definition, provide the block architecture diagram, contrast trade-offs between memory utilization versus latency, and conclude with two industrial applications.

#### Q2. Compare and contrast ${topic} with traditional alternative techniques in ${subject}. (4 Marks)
* **Model Answer:** Create a structured comparison table analyzing time complexity, hardware requirements, scalability, and ease of debugging.

#### Q3. What failure modes occur when boundary conditions are violated, and how are they handled? (4 Marks)
* **Model Answer:** Discuss overflow/underflow, deadlock/starvation conditions, and mitigation via defensive checks, timeout triggers, and graceful degradation.

---

### 5. Exam Day Quick-Revision Checklist
- [x] Memorized formal definitions and state transition equations.
- [x] Drawn and labeled the architectural diagram without looking at notes.
- [x] Verified worst-case and average-case space/time complexity bounds.
- [x] Practiced writing the pseudo-code on paper within 5 minutes.

*(Notes compiled by CampusMind AI Study Companion for WCE Sangli)*`;

  const notes: GeneratedNotes = {
    id: `notes_${Date.now()}`,
    userId,
    subject,
    topic,
    content,
    createdAt: new Date().toISOString(),
  };
  return notes;
}

// ─── TIMETABLE ───────────────────────────────────────────────────────────────

/**
 * Get timetable entries.
 * Real API: GET /api/timetable?department=:dept&year=:year&division=:div
 */
export async function apiGetTimetable(filters?: {
  department?: string;
  year?: string;
  division?: string;
  faculty?: string;
}): Promise<TimetableEntry[]> {
  await delay(rand(400, 700));
  let data = [...mockTimetable];
  if (filters?.department) data = data.filter(t => t.department === filters.department);
  if (filters?.year) data = data.filter(t => t.year === filters.year);
  if (filters?.division) data = data.filter(t => t.division === filters.division);
  if (filters?.faculty) data = data.filter(t => t.faculty.toLowerCase().includes(filters.faculty!.toLowerCase()));
  return data;
}

// ─── NOTICES ─────────────────────────────────────────────────────────────────

/**
 * Get all notices.
 * Real API: GET /api/notices?category=:cat&search=:q
 */
export async function apiGetNotices(filters?: {
  category?: string;
  search?: string;
}): Promise<Notice[]> {
  await delay(rand(400, 700));
  // Use scraped notices with content
  let data = [...scrapedNotices] as Notice[];
  if (filters?.category && filters.category !== 'All') {
    data = data.filter(n => n.category === filters.category);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    data = data.filter(n =>
      n.title.toLowerCase().includes(q) ||
      (n.content && n.content.toLowerCase().includes(q)) ||
      n.author.toLowerCase().includes(q)
    );
  }
  return data.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// ─── DOCUMENTS ───────────────────────────────────────────────────────────────

/**
 * Get knowledge base documents.
 * Real API: GET /api/documents
 */
export async function apiGetDocuments(): Promise<KnowledgeDocument[]> {
  await delay(rand(400, 800));
  // Combine mock documents with scraped docs
  const scrapedAsDocs = scrapedDocs.map(d => ({
    id: d.id,
    name: d.title,
    originalName: d.title,
    size: 0,
    type: d.type === 'PDF' ? 'application/pdf' : 'text/html',
    status: 'Uploaded' as const,
    progress: 100,
    category: d.category,
    uploadedBy: 'WCE',
    uploadedAt: new Date().toISOString(),
  }));
  return [...mockDocuments, ...scrapedAsDocs];
}

/**
 * Upload a document.
 * Real API: POST /api/documents (multipart/form-data)
 */
export async function apiUploadDocument(file: File, category: string, uploadedBy: string): Promise<KnowledgeDocument> {
  await delay(rand(800, 1200));
  const newDoc: KnowledgeDocument = {
    id: `doc_${Date.now()}`,
    name: file.name,
    originalName: file.name,
    size: file.size,
    type: file.type,
    status: 'Uploaded',
    progress: 0,
    category,
    uploadedBy,
    uploadedAt: new Date().toISOString(),
  };
  mockDocuments.unshift(newDoc);
  return newDoc;
}

/**
 * Delete a document.
 * Real API: DELETE /api/documents/:id
 */
export async function apiDeleteDocument(docId: string): Promise<void> {
  await delay(rand(400, 700));
  const idx = mockDocuments.findIndex(d => d.id === docId);
  if (idx !== -1) mockDocuments.splice(idx, 1);
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────

/**
 * Get analytics data (admin only).
 * Real API: GET /api/analytics?range=:days
 */
export async function apiGetAnalytics(): Promise<AnalyticsData> {
  await delay(rand(600, 1000));
  return mockAnalytics;
}

/**
 * Get RAGAS evaluation metrics (admin only).
 * Real API: GET /api/evaluation/metrics
 */
export async function apiGetEvalMetrics(): Promise<EvalMetric[]> {
  await delay(rand(500, 900));
  return [...mockEvalMetrics];
}

export async function apiChangePassword(userId: string, current: string, next: string): Promise<void> {
  await delay(rand(400, 700));
  const user = mockUsers.find(u => u.id === userId);
  if (!user) throw new Error('User not found');
  if (user.password !== current) throw new Error('Current password is incorrect');
  user.password = next;
}

// ─── RAG SETTINGS ────────────────────────────────────────────────────────────

/**
 * Get RAG settings.
 * Real API: GET /api/settings/rag
 */
export async function apiGetRAGSettings(): Promise<RAGSettings> {
  await delay(rand(300, 600));
  const stored = localStorage.getItem('rag_settings');
  if (stored) return JSON.parse(stored);
  const defaults: RAGSettings = {
    model: 'gemini-1.5-pro',
    chunkSize: 512,
    topK: 5,
    temperature: 0.7,
    maxTokens: 1024,
    similarityThreshold: 0.75,
  };
  return defaults;
}

/**
 * Save RAG settings.
 * Real API: PUT /api/settings/rag { ...settings }
 */
export async function apiSaveRAGSettings(settings: RAGSettings): Promise<void> {
  await delay(rand(400, 700));
  localStorage.setItem('rag_settings', JSON.stringify(settings));
}
