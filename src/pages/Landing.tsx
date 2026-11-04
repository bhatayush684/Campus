import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, MessageSquare, Calendar, Bell, Shield, ArrowRight, Brain, FileText, Download, BookOpen, FileText as File, Sparkles, Users } from 'lucide-react';

const features = [
  { icon: MessageSquare, title: 'AI Chat Assistant', desc: 'Ask anything about campus life, academics, rules and get instant answers with source citations.', color: 'from-violet-500 to-purple-600' },
  { icon: Calendar, title: 'Smart Timetables', desc: 'View and filter timetables for any department, year, and division with real-time updates.', color: 'from-blue-500 to-cyan-600' },
  { icon: Bell, title: 'Notices & Alerts', desc: 'Stay updated with exam alerts, placement drives, and campus events in real-time.', color: 'from-amber-500 to-orange-600' },
  { icon: FileText, title: 'Knowledge Base', desc: 'Access syllabi, rules, faculty info, and official documents instantly.', color: 'from-emerald-500 to-teal-600' },
  { icon: Brain, title: 'RAG-Powered', desc: 'Answers backed by real college documents with accurate source citations.', color: 'from-pink-500 to-rose-600' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Student, Faculty, and Admin dashboards with tailored features.', color: 'from-indigo-500 to-violet-600' },
];

const quickAccess = [
  { icon: Download, title: 'Download Notes', desc: 'Access all lecture notes in one click', color: 'from-emerald-500 to-teal-500', link: '/login' },
  { icon: BookOpen, title: 'Syllabus', desc: 'Complete syllabus for all departments', color: 'from-blue-500 to-cyan-500', link: '/login' },
  { icon: File, title: 'Question Papers', desc: 'Previous year question papers', color: 'from-purple-500 to-pink-500', link: '/login' },
];

const stats = [
  { value: '57+', label: 'Notices', icon: Bell },
  { value: '267+', label: 'Documents', icon: FileText },
  { value: '15+', label: 'Faculty', icon: Users },
  { value: '8', label: 'Departments', icon: Shield },
];

const testimonials = [
  { name: 'Rahul Sharma', role: 'CSE Student', text: 'CampusMind made finding exam schedules and notices so easy. The AI assistant is incredibly helpful!' },
  { name: 'Priya Patil', role: 'Faculty', text: 'As a faculty member, I can quickly access timetables and upload documents. Great tool for WCE!' },
  { name: 'Amit Deshmukh', role: 'IT Student', text: 'The placement alerts feature helped me never miss a recruitment drive. Highly recommended!' },
];

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
      <div className="relative glass-card p-6 card-hover h-full">
        <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-bold text-lg text-white mb-2">{feature.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
      </div>
    </motion.div>
  );
}

function StatCard({ stat, index }: { stat: any; index: number }) {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass-card p-6 text-center card-hover"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-3xl font-bold gradient-text mb-1">{stat.value}</p>
      <p className="text-slate-400 text-sm">{stat.label}</p>
    </motion.div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen text-white overflow-hidden relative bg-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/50" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 glass-card">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center glow-border"
            >
              <Bot className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-bold text-xl gradient-text">CampusMind</span>
          </Link>
          <div className="flex items-center gap-4">
            <a href="#features" className="btn-ghost text-slate-300 hover:text-white hidden sm:inline-flex">Features</a>
            <Link to="/login" className="btn-ghost text-slate-300 hover:text-white">Sign in</Link>
            <Link to="/signup" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-400 text-sm font-semibold mb-8 glass-card"
          >
            <Sparkles className="w-4 h-4" />
            Powered by RAG + Real-time Scraping
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-8 leading-tight"
          >
            Your AI Campus
            <br />
            <span className="gradient-text">Assistant</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Get instant answers about timetables, exams, faculty, hostel rules, and everything WCE.
            <br />
            <span className="text-primary-400">Powered by AI with real-time scraped college data.</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup" className="btn-primary text-lg px-8 py-4 group">
              Start Chatting Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4">
              Sign In
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16"
          >
            {stats.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Quick Access</h2>
            <p className="text-slate-400 text-lg">Everything you need, just one click away</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {quickAccess.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={item.link} className="glass-card card-hover p-8 cursor-pointer group block relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-2xl text-white mb-3">{item.title}</h3>
                    <p className="text-slate-400">{item.desc}</p>
                    <div className="mt-6 flex items-center gap-2 text-primary-400 font-semibold group-hover:gap-4 transition-all">
                      <span>Access Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything you need</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">CampusMind integrates all your college needs into one intelligent platform</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by WCEians</h2>
            <p className="text-slate-400 text-lg">See what students and faculty say about CampusMind</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 card-hover"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Sparkles key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-slate-400">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center glow-border relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10" />
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4">Ready to explore WCE smarter?</h2>
              <p className="text-slate-400 text-lg mb-8">Join CampusMind today and get instant answers powered by AI.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup" className="btn-primary text-lg px-10 py-4">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-10 py-4">
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-400">CampusMind — Walchand College of Engineering, Sangli</span>
          </div>
          <p>© 2026 WCE. Built with ❤️ for WCEians</p>
        </div>
      </footer>
    </div>
  );
}
