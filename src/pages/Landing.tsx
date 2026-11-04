import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, BookOpen, Bot, Calendar, CheckCircle2, FileText,
  MessageSquare, ShieldCheck, Sparkles, Target, Users, Zap
} from 'lucide-react';

const features = [
  { icon: MessageSquare, title: 'Ask the campus', desc: 'Get clear answers about academics, notices, rules, and college resources with cited source context.', color: 'from-violet-500 to-purple-600' },
  { icon: Target, title: 'Study with direction', desc: 'Turn your syllabus into a realistic plan with daily targets, revision checkpoints, and exam practice.', color: 'from-emerald-500 to-teal-600' },
  { icon: Calendar, title: 'Never miss the date', desc: 'See timetables, exam references, notices, and events in one organized academic workspace.', color: 'from-blue-500 to-cyan-600' },
  { icon: BookOpen, title: 'Learn from your syllabus', desc: 'Generate structured notes with unit mapping, worked-example prompts, flashcards, and answer frameworks.', color: 'from-amber-500 to-orange-600' },
  { icon: FileText, title: 'Find official resources', desc: 'Browse documents, faculty information, departments, placements, and downloadable study material.', color: 'from-pink-500 to-rose-600' },
  { icon: ShieldCheck, title: 'Grounded by sources', desc: 'AI responses are designed to prefer connected WCE material and clearly flag missing or stale information.', color: 'from-indigo-500 to-blue-600' },
];

const steps = [
  { number: '01', title: 'Choose your goal', desc: 'Ask a question, select a subject, or set an exam deadline.' },
  { number: '02', title: 'Get an organized answer', desc: 'CampusMind turns scattered college information into readable sections and next actions.' },
  { number: '03', title: 'Keep moving', desc: 'Save notes, track progress, and return to the important information when you need it.' },
];

function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${small ? 'w-9 h-9' : 'w-11 h-11'} bg-gradient-to-br from-primary-500 via-violet-600 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25`}>
        <Bot className={small ? 'w-5 h-5' : 'w-6 h-6'} />
      </div>
      <span className={`${small ? 'text-lg' : 'text-xl'} font-extrabold tracking-tight text-white`}>Campus<span className="text-primary-400">Mind</span></span>
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[number]; index: number }) {
  const Icon = feature.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.06 }}
      className="group relative"
    >
      <div className="absolute inset-0 rounded-3xl bg-primary-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative h-full rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary-400/30 group-hover:bg-white/[0.075]">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg mb-5`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white">{feature.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{feature.desc}</p>
      </div>
    </motion.article>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#070b1a] text-white selection:bg-primary-500/30">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -left-40 top-20 h-[32rem] w-[32rem] rounded-full bg-primary-600/20 blur-[120px]" />
        <div className="absolute -right-40 top-[28rem] h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.16) 1px, transparent 1px)', backgroundSize: '56px 56px', maskImage: 'linear-gradient(to bottom, black, transparent 70%)' }} />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#070b1a]/75 backdrop-blur-2xl">
        <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 lg:px-8" aria-label="Main navigation">
          <Link to="/" aria-label="CampusMind home"><Logo /></Link>
          <div className="hidden items-center gap-1 md:flex">
            <a href="#why" className="rounded-xl px-4 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">Why CampusMind</a>
            <a href="#workflow" className="rounded-xl px-4 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">How it works</a>
            <a href="#features" className="rounded-xl px-4 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">Features</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white">Sign in</Link>
            <Link to="/signup" className="btn-primary px-4 py-2.5 text-sm">Create account <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative px-5 pb-24 pt-36 lg:px-8 lg:pb-32 lg:pt-48">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary-400/25 bg-primary-400/10 px-4 py-2 text-xs font-semibold tracking-wide text-primary-300">
                <Sparkles className="h-4 w-4" /> Built for the WCE academic journey
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="max-w-3xl text-5xl font-black leading-[1.03] tracking-[-.04em] sm:text-6xl lg:text-7xl">
                Less searching.
                <br />
                <span className="bg-gradient-to-r from-primary-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">More studying.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16 }} className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
                CampusMind brings your college information, AI support, syllabus notes, study planning, notices, and schedules into one calm, structured place.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .24 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to="/signup" className="btn-primary justify-center px-6 py-3.5 text-base">Start learning smarter <ArrowRight className="w-5 h-5" /></Link>
                <Link to="/login" className="btn-secondary justify-center px-6 py-3.5 text-base">Explore your workspace</Link>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .35 }} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-500">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Syllabus-aware tools</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Source-conscious AI</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Student-friendly workflow</span>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, x: 28, scale: .97 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ delay: .18, duration: .6 }} className="relative">
              <div className="absolute -inset-8 rounded-[3rem] bg-primary-500/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-slate-900/85 shadow-2xl shadow-primary-950/60 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div className="flex items-center gap-2"><Logo small /></div>
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" /> Workspace ready</span>
                </div>
                <div className="p-5 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary-300">Today at a glance</p>
                  <h2 className="mt-2 text-2xl font-bold">Good morning, WCEian</h2>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[['07', 'Days left'], ['68%', 'Progress'], ['04', 'Tasks']].map(([value, label]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-white/[.05] p-3"><p className="text-xl font-bold text-white">{value}</p><p className="mt-1 text-[10px] text-slate-500">{label}</p></div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
                    <div className="flex items-start gap-3"><div className="rounded-xl bg-violet-500/20 p-2"><MessageSquare className="h-4 w-4 text-violet-300" /></div><div><p className="text-xs font-semibold text-violet-200">Campus AI</p><p className="mt-1 text-sm leading-5 text-slate-300">“Your next step is to revise Unit 3, then practise one 10-mark question.”</p></div></div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {['Revise Decision Trees', 'Read today’s examination notice', 'Complete active recall cards'].map((item, index) => (
                      <div key={item} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[.03] px-3 py-3 text-sm text-slate-300"><span className={`flex h-5 w-5 items-center justify-center rounded-full ${index === 0 ? 'bg-emerald-500/20 text-emerald-300' : 'border border-white/15 text-transparent'}`}><CheckCircle2 className="h-3.5 w-3.5" /></span>{item}<Zap className="ml-auto h-3.5 w-3.5 text-amber-300/70" /></div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="why" className="border-y border-white/10 bg-white/[.025] px-5 py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
            {[['One focused workspace', 'Stop switching between scattered PDFs, chats, notices, and websites.'], ['Answers with context', 'Use structured responses and source signals instead of unexplained AI output.'], ['Built for progress', 'Move from “what do I need?” to a practical next action in seconds.']].map(([title, desc], i) => (
              <div key={title} className="flex gap-4"><span className="text-3xl font-black text-primary-400/50">0{i + 1}</span><div><h2 className="font-bold text-white">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p></div></div>
            ))}
          </div>
        </section>

        <section id="features" className="px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-2xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-primary-400">A better academic rhythm</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Everything important, organized around you.</h2><p className="mt-4 text-lg leading-7 text-slate-400">From the first question to the final revision, each tool is designed to reduce friction and make the next step obvious.</p></div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{features.map((feature, index) => <FeatureCard key={feature.title} feature={feature} index={index} />)}</div>
          </div>
        </section>

        <section id="workflow" className="border-y border-white/10 bg-gradient-to-b from-primary-950/20 to-transparent px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl"><div className="mx-auto max-w-2xl text-center"><p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-300">Simple by design</p><h2 className="mt-3 text-4xl font-black tracking-tight">From question to confidence.</h2><p className="mt-4 text-slate-400">CampusMind does the organizing so you can spend your energy understanding and practising.</p></div><div className="mt-14 grid gap-5 md:grid-cols-3">{steps.map(step => <div key={step.number} className="relative rounded-3xl border border-white/10 bg-white/[.04] p-7"><span className="text-sm font-black text-primary-300">{step.number}</span><h3 className="mt-8 text-xl font-bold">{step.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{step.desc}</p></div>)}</div></div>
        </section>

        <section className="px-5 py-24 lg:px-8"><div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-primary-400/20 bg-gradient-to-br from-primary-900/70 via-slate-900 to-violet-950/70 p-8 text-center shadow-2xl shadow-primary-950/40 sm:p-14"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10"><Users className="h-7 w-7 text-primary-200" /></div><h2 className="mt-6 text-3xl font-black sm:text-4xl">Make your college information work for you.</h2><p className="mx-auto mt-4 max-w-xl text-slate-300">Create your free workspace and make the next academic decision with more clarity.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/signup" className="btn-primary justify-center px-7 py-3.5">Create your workspace <ArrowRight className="w-5 h-5" /></Link><Link to="/login" className="btn-secondary justify-center px-7 py-3.5">I already have an account</Link></div></div></section>
      </main>

      <footer className="border-t border-white/10 px-5 py-10 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><Logo small /><p>Academic companion for Walchand College of Engineering, Sangli.</p><div className="flex gap-4"><Link to="/login" className="hover:text-white">Sign in</Link><Link to="/signup" className="hover:text-white">Get started</Link></div></div></footer>
    </div>
  );
}
