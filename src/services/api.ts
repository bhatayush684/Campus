/**
 * api.ts — Frontend data access layer.
 * Static scraped datasets provide an offline-safe fallback while the deployed
 * backend handles AI requests and future persistence.
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
const today = () => new Date(new Date().toISOString().slice(0, 10));
const formatDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { dateStyle: 'medium' });
const daysBetween = (from: Date, to: Date) => Math.max(1, Math.ceil((to.getTime() - from.getTime()) / 86400000));

function subjectMatches(title: string, subject: string) {
  const normalize = (value: string) => value.toLowerCase().replace(/database management systems/g, 'dbms');
  return normalize(title).includes(normalize(subject)) || normalize(subject).includes(normalize(title));
}

function syllabusFor(subject: string) {
  return scrapedSyllabus.find(item => subjectMatches(item.title, subject))
    || scrapedSyllabus.find(item => item.title.toLowerCase().split(/\s+/).some(word => word.length > 3 && subject.toLowerCase().includes(word)))
    || null;
}

function currentExamReference(subject: string, department?: string, requestedDate?: string) {
  const now = today();
  const candidates = (scrapedExamSchedules as ScrapedExamSchedule[])
    .filter(exam => (!department || !exam.department || exam.department === department)
      && (!subject || !exam.subject || subjectMatches(exam.subject, subject)))
    .filter(exam => Number.isFinite(Date.parse(exam.date)) && new Date(exam.date) >= now)
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  const requested = requestedDate ? new Date(`${requestedDate}T00:00:00`) : null;
  return {
    official: candidates[0] || null,
    requested,
    isPast: Boolean(requested && requested < now),
    checkedOn: now.toISOString().slice(0, 10),
  };
}

function markdownCell(value: string) {
  return value.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function topicWords(value: string) {
  return new Set(value.toLowerCase().match(/[a-z0-9]+/g)?.filter(word => word.length > 2) || []);
}

function relevantUnits(units: NonNullable<ScrapedSyllabus['units']>, topic: string) {
  const requestedWords = topicWords(topic);
  return units
    .map(unit => {
      const words = topicWords(`${unit.title} ${unit.topics}`);
      const overlap = [...requestedWords].filter(word => words.has(word)).length;
      return { unit, score: overlap + (topic.toLowerCase().includes(unit.title.toLowerCase()) ? 3 : 0) };
    })
    .sort((a, b) => b.score - a.score || a.unit.unit - b.unit.unit)
    .filter(item => item.score > 0)
    .map(item => item.unit);
}

function topicBlueprint(subject: string, topic: string) {
  const value = `${subject} ${topic}`.toLowerCase();
  if (value.includes('normal') || value.includes('database') || value.includes('sql')) {
    return {
      definition: 'A database concept should be explained through its data model, constraints, operation, and effect on correctness or performance.',
      mechanism: 'Start with the relation/schema, state the dependency or query requirement, apply the rule step by step, and verify the resulting data is lossless and dependency-preserving where applicable.',
      worked: 'Use a small relation with named attributes and show each transformation or query result. State every assumption before deriving the answer.',
      compare: '| Criterion | Normalized relational design | Denormalized design |\\n|---|---|---|\\n| Redundancy | Lower | Higher |\\n| Read performance | May require joins | Often faster for reads |\\n| Update anomalies | Reduced | Must be controlled |',
      formula: '`Lossless join` and `dependency preservation` must be checked explicitly; do not claim a decomposition is correct without showing the test or reasoning.'
    };
  }
  if (value.includes('network') || value.includes('tcp') || value.includes('routing') || value.includes('subnet')) {
    return {
      definition: 'A networking answer is strongest when it identifies the layer, packet fields/state, sender-receiver sequence, and the failure or control mechanism.',
      mechanism: 'Draw the flow from sender to receiver, label each transition, then explain acknowledgements, timers, windows, routing decisions, or address calculations in order.',
      worked: 'For a numerical problem, write the given values, convert units or binary fields, show the intermediate calculation, and finish with a sanity check.',
      compare: '| Criterion | TCP | UDP |\\n|---|---|---|\\n| Connection | Connection-oriented | Connectionless |\\n| Reliability | Ordered delivery and retransmission | Application-dependent |\\n| Typical use | Web, file transfer | Streaming, DNS, real-time traffic |',
      formula: '`Throughput`, `delay`, `window size`, and `CIDR prefix` calculations must include units and a final interpretation.'
    };
  }
  if (value.includes('operating system') || value.includes('scheduling') || value.includes('deadlock') || value.includes('paging')) {
    return {
      definition: 'An operating-systems answer should connect the resource, process state, policy/algorithm, and measurable outcome such as waiting time, throughput, safety, or page faults.',
      mechanism: 'List the initial state, apply one transition at a time, update the relevant table or queue, and explain why the next transition is valid.',
      worked: 'Use a timeline, allocation table, or page-reference table. Show each row rather than jumping to the final average or safe sequence.',
      compare: '| Criterion | Preemptive policy | Non-preemptive policy |\\n|---|---|---|\\n| Context switches | More likely | Fewer |\\n| Response time | Usually better | May be worse |\\n| Complexity | Higher | Simpler |',
      formula: '`Turnaround time = completion time − arrival time`; always define the metric before calculating it.'
    };
  }
  if (value.includes('machine learning') || value.includes('regression') || value.includes('classification') || value.includes('clustering') || value.includes('svm')) {
    return {
      definition: 'A machine-learning answer should identify the task, data representation, objective/loss, training procedure, evaluation metric, and generalization risk.',
      mechanism: 'Describe the input features and target, explain how parameters are learned, state the decision rule, and separate training, validation, and test behavior.',
      worked: 'Use a tiny dataset or symbolic example. Show the prediction, loss or split decision, parameter update, and the meaning of the result.',
      compare: '| Criterion | Supervised learning | Unsupervised learning |\\n|---|---|---|\\n| Target labels | Required | Not required |\\n| Main goal | Predict a target | Discover structure |\\n| Typical evaluation | Accuracy, F1, RMSE | Silhouette, WCSS, qualitative analysis |',
      formula: 'State the loss or objective before discussing optimization. Include the effect of regularization, hyperparameters, and data leakage when relevant.'
    };
  }
  return {
    definition: `Define **${topic}** in one sentence, then state its purpose, inputs, outputs, assumptions, and the problem it solves.`,
    mechanism: `Explain **${topic}** as a sequence: prerequisites → input → core operation → output → verification. Use the syllabus terms below as the vocabulary for the answer.`,
    worked: `Create a small representative example for **${topic}**. Show the given values, each intermediate step, and a final interpretation instead of only stating the result.`,
    compare: '| Criterion | Approach A | Approach B |\\n|---|---|---|\\n| Main idea | State the defining idea | State the closest alternative |\\n| Strength | When it is useful | When it is useful |\\n| Limitation | What can go wrong | What can go wrong |',
    formula: 'Include a formula, diagram, pseudocode block, or labelled process only when it is supported by your course material.'
  };
}

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
  return [...(scrapedExamSchedules as ScrapedExamSchedule[])].sort((a, b) => {
    const first = Date.parse(a.date);
    const second = Date.parse(b.date);
    return (Number.isFinite(first) ? first : Number.MAX_SAFE_INTEGER)
      - (Number.isFinite(second) ? second : Number.MAX_SAFE_INTEGER);
  });
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
  const exam = new Date(`${examDate}T00:00:00`);
  if (!examDate || Number.isNaN(exam.getTime()) || exam < today()) {
    throw new Error('Choose an exam date today or later. Past dates cannot produce a useful study plan.');
  }
  await delay(rand(500, 900));
  const subjects = scrapedSyllabus.filter(s => s.department === department);
  const selected = (subjects.length ? subjects : scrapedSyllabus).slice(0, 8);
  const daysAvailable = daysBetween(today(), exam);
  const officialExam = (scrapedExamSchedules as ScrapedExamSchedule[])
    .filter(item => item.department === department && Date.parse(item.date) >= today().getTime())
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))[0];
  const plan: StudyPlan = {
    id: `sp_${Date.now()}`,
    userId,
    title: `${department} Evidence-Based Study Plan`,
    subjects: selected.map((s, i) => ({
        name: s.title,
        chapters: [
          ...(s.units || []).map(unit => `Unit ${unit.unit}: ${unit.title}`),
          'Active recall and previous-question practice',
          'Final revision'
        ],
        priority: (i < 2 ? 'high' : i < 4 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
        estimatedHours: Math.max(4, Math.min(28, Math.round(((s.credits || 3) * 4 + (s.units?.length || 5) * 1.5) * 2) / 2)),
        completed: false,
      })),
    examDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  plan.metadata = {
    daysAvailable,
    checkedOn: today().toISOString().slice(0, 10),
    officialExamReference: officialExam ? {
      date: officialExam.date,
      subject: officialExam.subject,
      source: officialExam.source
    } : null,
    note: officialExam
      ? `An official future exam reference was found for ${officialExam.subject || department} on ${formatDate(officialExam.date)}. Confirm the final timetable before relying on it.`
      : 'No future official exam date matched this department; the selected date is treated as your planning deadline.'
  };
  return plan;
}

/**
 * Generate notes based on syllabus.
 * Real API: POST /api/notes/generate { userId, subject, topic }
 */
export async function apiGenerateNotes(userId: string, subject: string, topic: string): Promise<GeneratedNotes> {
  await delay(rand(800, 1500));
  
  const syllabus = syllabusFor(subject);
  const units = syllabus?.units || [];
  const selectedUnits = relevantUnits(units, topic);
  const outline = (selectedUnits.length ? selectedUnits : units).slice(0, 6);
  const blueprint = topicBlueprint(subject, topic);
  const exam = currentExamReference(subject, syllabus?.department);
  const unitRows = outline.length
    ? outline.map(unit => `| Unit ${unit.unit} | ${unit.title} | ${unit.topics} |`).join('\n')
    : '| - | Topic-specific outline unavailable | Verify against the linked syllabus and lecturer notes. |';
  const vocabulary = outline
    .flatMap(unit => unit.topics.split(/[,;|]/).map(item => item.trim()).filter(Boolean))
    .slice(0, 12);
  const vocabularyRows = vocabulary.length
    ? vocabulary.map((item, index) => `| ${index + 1} | ${markdownCell(item)} | Define it, state its role, and connect it to ${topic}. |`).join('\n')
    : `| 1 | ${markdownCell(topic)} | Verify the definition from the official syllabus or lecturer notes. |`;
  const content = `# ${topic}

## Subject context
- **Subject:** ${subject}
- **Course code:** ${syllabus?.courseCode || 'Not matched to the local syllabus'}
- **Source status:** ${syllabus ? 'Matched to the WCE syllabus dataset' : 'No exact syllabus match; verify against your course material'}
- **Generated:** ${formatDate(new Date().toISOString().slice(0, 10))}
- **Study mode:** Learn → practise → retrieve → revise

> **How to use this pack:** Read the concept map once, cover the right-hand column and recall it, solve the worked-example task without notes, then attempt the 2-, 5-, and 10-mark questions.

## 0. Five-minute quick revision
| Recall point | Your one-line answer |
|---|---|
| What is it? | Define **${topic}** in one precise sentence. |
| Why is it used? | State the problem it solves and the benefit it provides. |
| How does it work? | List the main steps in the correct order. |
| How is it checked? | Name the correctness test, metric, boundary case, or sanity check. |
| Where can it fail? | State one limitation and the condition that causes it. |

## 1. Topic in one page
### Definition and purpose
${blueprint.definition}

### Core mechanism
${blueprint.mechanism}

### Why it matters
${syllabus?.description || `This topic matters because it gives a systematic way to solve, analyse, or compare problems in ${subject}. Connect each claim to the syllabus and your lecturer's examples.`}

### Exam vocabulary
| # | Term from the matched syllabus | What you must be able to say |
|---|---|---|
${vocabularyRows}

## 2. Syllabus alignment
| Unit | Focus | Topics from the syllabus |
|---|---|---|
${unitRows}

## 3. Learn it step by step
1. **Prerequisites:** Write the definitions and assumptions required before starting ${topic}.
2. **Represent:** Draw the relevant architecture, relation/schema, state diagram, graph, timeline, or model.
3. **Execute:** Apply the algorithm or process to a small example and show every intermediate state.
4. **Verify:** Check correctness, units, boundary cases, complexity, safety, or evaluation metric as appropriate.
5. **Generalise:** Explain when the method works, when it fails, and what alternative you would choose.

## 4. Worked-example blueprint
${blueprint.worked}

### Answer layout
\`\`\`text
Given / assumptions:
Required:
Representation or diagram:
Step 1:
Step 2:
Verification:
Final answer and interpretation:
\`\`\`

## 5. Formula, algorithm, or decision checklist
${blueprint.formula}

- Define every symbol before substituting values.
- Keep units and indexing consistent.
- State the stopping condition or decision boundary.
- Check one edge case or limiting case.
- End with a sentence explaining what the result means.

## 6. Compare and choose
${blueprint.compare}

**Decision rule:** Choose an approach only after stating the input conditions, objective, constraints, and trade-off. Never compare methods using a single metric.

## 7. Common mistakes to avoid
- Writing a definition without explaining purpose or assumptions.
- Listing steps without showing the state or intermediate calculation.
- Using a formula without defining symbols or units.
- Confusing training/performance metrics, or reporting a result without interpretation.
- Claiming a date, rule, or syllabus detail that is not present in the cited source.

## 8. Exam practice ladder
### 2-mark recall
1. Define **${topic}** and name one use.
2. State two assumptions, properties, or terms associated with it.

### 5-mark understanding
1. Explain **${topic}** with a labelled diagram, sequence, or small example.
2. Compare it with the closest alternative and justify when each is preferred.

### 10-mark application
1. Solve a complete representative problem on **${topic}**, showing assumptions, intermediate work, verification, and interpretation.
2. Analyse one failure case or limitation and propose a technically justified improvement.

### Marking guide for a 10-mark answer
- **1-2 marks:** accurate definition, scope, and assumptions.
- **2-3 marks:** labelled diagram, algorithm, formula, or architecture.
- **3-4 marks:** ordered application with intermediate work and correct terminology.
- **1-2 marks:** verification, comparison, limitation, and a clear conclusion.
- Do not spend most of the answer on an unlabelled diagram or unsupported claims.

## 9. Active-recall flashcards
- **Q:** What problem does ${topic} solve? **A:** State the input, objective, and output in one sentence.
- **Q:** What are the prerequisites? **A:** Recall the terms in the exam-vocabulary table without looking.
- **Q:** What is the critical step? **A:** Explain the transition that changes the input into the output.
- **Q:** How do you verify the answer? **A:** Name the correctness, metric, boundary, or sanity check.
- **Q:** What is the closest alternative? **A:** Give one advantage and one limitation of each.

## 10. Revision schedule
| Session | Task | Evidence of mastery |
|---|---|---|
| Today | Read the one-page summary and redraw the core representation | Explain it aloud in 90 seconds |
| Tomorrow | Solve the worked-example blueprint from memory | No skipped intermediate steps |
| In 3 days | Attempt the 2- and 5-mark questions | Correct definitions and comparisons |
| In 7 days | Attempt the 10-mark question under time pressure | Complete, verified, exam-ready answer |

## 11. Final readiness checklist
- [ ] I can define the topic, its purpose, inputs, outputs, and assumptions.
- [ ] I can reproduce the relevant diagram, formula, algorithm, or schema.
- [ ] I can solve one fresh example and verify the result.
- [ ] I can compare two approaches with justified trade-offs.
- [ ] I can write a 10-mark answer without copying the notes.
- [ ] I can adapt the answer to a numerical, diagram-based, or theory question.

## Reference date check
- Checked on **${formatDate(exam.checkedOn)}**.
- ${exam.official ? `The local dataset has a future reference for **${exam.official.subject || subject}** on **${formatDate(exam.official.date)}**. Confirm the official notice before treating it as final.` : 'No future official exam reference matched this topic. Do not infer an exam date from older notices.'}

## Sources and verification
${syllabus?.syllabusUrl || 'WCE syllabus source was not matched for this subject.'}`;

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
