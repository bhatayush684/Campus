import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Palette, Trash2, Save, Loader2, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { useChatStore } from '../store/chatStore';
import { apiUpdateProfile, apiChangePassword } from '../services/api';
import { toast } from 'sonner';
import { cn, getInitials } from '../lib/utils';

const profileSchema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  prnOrEmpId: z.string().min(1, 'Required'),
});

const passwordSchema = z.object({
  current: z.string().min(1, 'Required'),
  newPass: z.string().min(6, 'Min 6 characters'),
  confirm: z.string(),
}).refine(d => d.newPass === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

type Tab = 'profile' | 'security' | 'appearance' | 'notifications';

export default function Settings() {
  const { user, updateUser } = useAuthStore();
  const { theme, setTheme, language, setLanguage, emailNotifications, pushNotifications, soundEnabled, toggleEmailNotifications, togglePushNotifications, toggleSound } = useSettingsStore();
  const { setConversations } = useChatStore();
  const [tab, setTab] = useState<Tab>('profile');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '', prnOrEmpId: user?.prnOrEmpId ?? '' },
  });

  const passwordForm = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  const onSaveProfile = async (data: ProfileData) => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const updated = await apiUpdateProfile(user.id, data);
      updateUser(updated);
      toast.success('Profile updated successfully!');
    } catch (e: any) { toast.error(e.message); }
    finally { setSavingProfile(false); }
  };

  const onChangePassword = async (data: PasswordData) => {
    if (!user) return;
    setSavingPass(true);
    try {
      await apiChangePassword(user.id, data.current, data.newPass);
      updateUser({ password: data.newPass });
      toast.success('Password changed successfully!');
      passwordForm.reset();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSavingPass(false);
    }
  };

  const handleClearChats = () => {
    if (!user) return;
    localStorage.removeItem(`conversations_${user.id}`);
    setConversations([]);
    toast.success('Chat history cleared');
  };

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar nav */}
        <div className="w-full md:w-48 flex-shrink-0">
          <nav className="space-y-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn('sidebar-link w-full', tab === t.id && 'active')}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>

            {/* Profile */}
            {tab === 'profile' && (
              <div className="card p-6 space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl font-bold">
                    {user ? getInitials(user.name) : 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="text-sm text-slate-400 capitalize">{user?.role} · {user?.department}</p>
                  </div>
                </div>

                <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input {...profileForm.register('name')} className="input" />
                    {profileForm.formState.errors.name && <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input {...profileForm.register('email')} type="email" className="input" />
                    {profileForm.formState.errors.email && <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="label">{user?.role === 'student' ? 'PRN Number' : 'Employee ID'}</label>
                    <input {...profileForm.register('prnOrEmpId')} className="input" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Department</label>
                      <input value={user?.department ?? ''} disabled className="input opacity-60 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="label">Role</label>
                      <input value={user?.role ?? ''} disabled className="input opacity-60 cursor-not-allowed capitalize" />
                    </div>
                  </div>
                  <button type="submit" disabled={savingProfile} className="btn-primary">
                    {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {savingProfile ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="font-medium text-slate-900 dark:text-white mb-3">Danger Zone</h3>
                  <button onClick={handleClearChats} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Clear all chat history
                  </button>
                </div>
              </div>
            )}

            {/* Security */}
            {tab === 'security' && (
              <div className="card p-6">
                <h2 className="font-semibold text-slate-900 dark:text-white mb-6">Change Password</h2>
                <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                  <div>
                    <label className="label">Current Password</label>
                    <div className="relative">
                      <input {...passwordForm.register('current')} type={showCurrent ? 'text' : 'password'} className="input pr-10" />
                      <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.current && <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.current.message}</p>}
                  </div>
                  <div>
                    <label className="label">New Password</label>
                    <div className="relative">
                      <input {...passwordForm.register('newPass')} type={showNew ? 'text' : 'password'} className="input pr-10" />
                      <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.newPass && <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.newPass.message}</p>}
                  </div>
                  <div>
                    <label className="label">Confirm New Password</label>
                    <input {...passwordForm.register('confirm')} type="password" className="input" />
                    {passwordForm.formState.errors.confirm && <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.confirm.message}</p>}
                  </div>
                  <button type="submit" disabled={savingPass} className="btn-primary">
                    {savingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    {savingPass ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}

            {/* Appearance */}
            {tab === 'appearance' && (
              <div className="card p-6 space-y-6">
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-3">Theme</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {(['light', 'dark'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={cn(
                          'flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                          theme === t
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        )}
                      >
                        {t === 'light' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-500" />}
                        <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">{t} Mode</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-3">Language</h3>
                  <select
                    value={language}
                    onChange={e => {
                      setLanguage(e.target.value as any);
                      toast.success('Language preference saved');
                    }}
                    className="input max-w-xs"
                  >
                    <option value="en">English</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="hi">हिंदी (Hindi)</option>
                  </select>
                  <p className="text-xs text-slate-400 mt-2">Language affects voice input and UI labels (UI labels in English always)</p>
                </div>
              </div>
            )}

            {/* Notifications */}
            {tab === 'notifications' && (
              <div className="card p-6 space-y-4">
                <h2 className="font-semibold text-slate-900 dark:text-white mb-2">Notification Preferences</h2>
                {[
                  { label: 'Email Notifications', desc: 'Receive notices and exam alerts via email', value: emailNotifications, toggle: toggleEmailNotifications },
                  { label: 'Push Notifications', desc: 'Browser push notifications for important updates', value: pushNotifications, toggle: togglePushNotifications },
                  { label: 'Sound Effects', desc: 'Play sound when a new message arrives', value: soundEnabled, toggle: toggleSound },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={item.toggle}
                      className={cn(
                        'relative w-11 h-6 rounded-full transition-colors flex-shrink-0',
                        item.value ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
                      )}
                    >
                      <div className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', item.value ? 'translate-x-5' : 'translate-x-0.5')} />
                    </button>
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </div>
  );
}
