import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Bot, Mail, Loader2, CheckCircle } from 'lucide-react';
import { apiForgotPassword } from '../services/api';
import { toast } from 'sonner';

const schema = z.object({ email: z.string().email('Enter a valid email') });
type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await apiForgotPassword(data.email);
      setSent(true);
      toast.success('Reset link sent to your email!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CampusMind</span>
          </Link>
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
          <p className="text-slate-400 mt-1">We'll send a reset link to your email</p>
        </div>

        <div className="card p-6 bg-slate-900/80 border-slate-800">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="font-semibold text-white text-lg">Check your email</h3>
              <p className="text-slate-400 text-sm mt-2">We've sent a password reset link. Check your inbox and follow the instructions.</p>
              <Link to="/login" className="btn-primary mt-6 w-full justify-center inline-flex">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input {...register('email')} type="email" placeholder="you@wce.ac.in" className="input pl-10 bg-slate-800/50 border-slate-700 text-white" />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <Link to="/login" className="btn-secondary w-full justify-center inline-flex">Back to Login</Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
