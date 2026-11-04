import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Bot, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { apiSignup } from '../services/api';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'faculty', 'admin']),
  department: z.enum(['CSE', 'ENTC', 'Civil', 'Mechanical', 'Electrical', 'IT', 'AI/ML', 'Robotics']),
  year: z.enum(['FY', 'SY', 'TY', 'BE']).optional(),
  prnOrEmpId: z.string().min(3, 'Required'),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

export default function Signup() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'student', department: 'CSE' },
  });

  const role = watch('role');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { confirmPassword, ...rest } = data;
      const user = await apiSignup({
        ...rest,
        password: data.password,
        isActive: true,
      } as any);
      login(user);
      toast.success('Account created! Welcome to CampusMind 🎉');
      navigate('/app/dashboard');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center glow-border">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold gradient-text">CampusMind</span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
          <p className="text-slate-400">Join WCE's AI campus assistant</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input {...register('name')} placeholder="Rahul Patil" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" />
                {errors.name && <p className="text-red-400 text-sm mt-2">{errors.name.message}</p>}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input {...register('email')} type="email" placeholder="you@wce.ac.in" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" />
                {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <select {...register('role')} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all">
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
                <select {...register('department')} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all">
                  <option>CSE</option>
                  <option>ENTC</option>
                  <option>Civil</option>
                  <option>Mechanical</option>
                  <option>Electrical</option>
                  <option>IT</option>
                  <option>AI/ML</option>
                  <option>Robotics</option>
                </select>
              </div>

              {role === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Year</label>
                  <select {...register('year')} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all">
                    <option value="FY">FY</option>
                    <option value="SY">SY</option>
                    <option value="TY">TY</option>
                    <option value="BE">BE</option>
                  </select>
                </div>
              )}

              <div className={role === 'student' ? '' : 'col-span-2'}>
                <label className="block text-sm font-medium text-slate-300 mb-2">{role === 'student' ? 'PRN' : 'Employee ID'}</label>
                <input {...register('prnOrEmpId')} placeholder={role === 'student' ? '2021BCS001' : 'FAC001'} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" />
                {errors.prnOrEmpId && <p className="text-red-400 text-sm mt-2">{errors.prnOrEmpId.message}</p>}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" className="w-full px-4 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-sm mt-2">{errors.password.message}</p>}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                <input {...register('confirmPassword')} type="password" placeholder="Repeat password" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" />
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-2">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-lg py-4 mt-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
