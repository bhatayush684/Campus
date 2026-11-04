import { motion } from 'framer-motion';
import { Bot, Mail, Phone, Globe, MapPin, BookOpen, Users, Award, ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'How do I find my timetable?', a: 'Go to the Timetable page and select your department, year, and division from the filters. You can view it in weekly or day view.' },
  { q: 'How accurate are the AI answers?', a: 'Answers are retrieved from official college documents. Each answer shows sources so you can verify. For critical decisions, always confirm with the department.' },
  { q: 'Can I use voice input in Hindi or Marathi?', a: 'Yes! In the chat page, select your language from the language selector (EN/MR/HI) next to the voice button and speak your query.' },
  { q: 'How do I upload documents?', a: 'Faculty and Admin users can drag and drop PDF/DOCX files on the Documents page. Documents are processed through the RAG pipeline automatically.' },
  { q: 'What do I do if my question is not answered?', a: 'Use the thumbs down button on any response to flag it. Admins can review unanswered queries and add new answers to the knowledge base.' },
  { q: 'How do I reset my password?', a: 'Click "Forgot password?" on the login page and enter your registered email. You\'ll receive a reset link (in a real deployment).' },
  { q: 'Who can access the Admin Panel?', a: 'Only users with the Admin role can access the Admin Panel and Evaluation pages. Students and Faculty have access to all other features.' },
];

const departments = [
  { name: 'Computer Science & Engineering', hod: 'Dr. Suresh Jadhav', faculty: 12, labs: 5 },
  { name: 'Electronics & Telecomm.', hod: 'Dr. Priya Nair', faculty: 10, labs: 4 },
  { name: 'Mechanical Engineering', hod: 'Prof. Mohan Shinde', faculty: 14, labs: 6 },
  { name: 'Civil Engineering', hod: 'Dr. Anand Kulkarni', faculty: 11, labs: 3 },
];

export default function Help() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* About Section */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="card p-8 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-950/30 dark:to-slate-900 border-primary-100 dark:border-primary-900">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CampusMind</h1>
              <p className="text-primary-600 dark:text-primary-400 font-medium">AI Campus Assistant for WCE Sangli</p>
              <p className="text-slate-600 dark:text-slate-400 mt-3 leading-relaxed text-sm">
                CampusMind is an AI-powered chatbot built for Walchand College of Engineering, Sangli.
                It uses Retrieval-Augmented Generation (RAG) to answer queries from official college documents —
                providing accurate, sourced answers about timetables, exams, faculty, hostel rules, placements, and more.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* About WCE */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-500" />
          About Walchand College of Engineering
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Walchand College of Engineering (WCE) is one of the oldest and most prestigious engineering colleges in Maharashtra,
              established in <strong>1947</strong> by Seth Walchand Hirachand. Affiliated to Shivaji University, Kolhapur, and
              accredited by NAAC with Grade A+.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>Vishrambag, Sangli – 416415, Maharashtra</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Phone className="w-4 h-4 text-primary-400" />
                <span>0233-2702108</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>info@walchandsangli.ac.in</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Globe className="w-4 h-4 text-primary-400" />
                <a href="https://www.walchandsangli.ac.in" target="_blank" rel="noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                  www.walchandsangli.ac.in
                </a>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { icon: Award, label: 'NAAC Accreditation', value: 'Grade A+' },
              { icon: Award, label: 'NBA Accredited', value: 'CSE, ENTC, Civil, Mech' },
              { icon: Users, label: 'Total Students', value: '~2,400' },
              { icon: BookOpen, label: 'Programs', value: 'B.E., M.E., Ph.D.' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <item.icon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span className="text-xs text-slate-500">{item.label}:</span>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Departments */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-500" />
          Departments
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {departments.map(dept => (
            <div key={dept.name} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <p className="font-semibold text-slate-900 dark:text-white text-sm">{dept.name}</p>
              <p className="text-xs text-slate-500 mt-1">HOD: {dept.hod}</p>
              <div className="flex gap-4 mt-2">
                <span className="text-xs text-slate-400">{dept.faculty} Faculty</span>
                <span className="text-xs text-slate-400">{dept.labs} Labs</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.06 }}
              className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl group"
            >
              <summary className="flex items-center justify-between cursor-pointer text-slate-800 dark:text-slate-200 font-medium text-sm list-none gap-3">
                <span>{faq.q}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" />
              </summary>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
            </motion.details>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Get Help</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Technical Support', contact: 'it@wce.ac.in', note: 'For portal & app issues', icon: '💻' },
            { label: 'Academic Queries', contact: 'academic@wce.ac.in', note: 'Timetables, results, syllabus', icon: '📚' },
            { label: 'Exam Department', contact: 'examination@wce.ac.in', note: 'Hall tickets, schedules', icon: '📝' },
          ].map(c => (
            <a key={c.label} href={`mailto:${c.contact}`} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center block hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-colors">
              <span className="text-2xl">{c.icon}</span>
              <p className="font-semibold text-slate-900 dark:text-white text-sm mt-2">{c.label}</p>
              <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">{c.contact}</p>
              <p className="text-xs text-slate-400 mt-1">{c.note}</p>
            </a>
          ))}
        </div>
        <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900 rounded-xl">
          <p className="text-xs text-primary-700 dark:text-primary-300">
            <strong>CampusMind v1.0</strong> — Built as a RAG-based AI assistant for WCE Sangli.
            This is a demo frontend; connect a real backend by replacing functions in <code className="font-mono">/src/services/api.ts</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
