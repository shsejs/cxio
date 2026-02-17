
import React, { useState } from 'react';
import { useApp } from '../App';
import { TRANSLATIONS } from '../constants';
import { Mail, Lock, User as UserIcon, ShieldCheck, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { apiService } from '../services/apiService';

const Home: React.FC = () => {
  const { lang, setView, setCurrentUser } = useApp();
  const t = TRANSLATIONS[lang];
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ username: '', fullName: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'username' ? value.toLowerCase().replace(/[^a-z0-9_]/g, '') : value 
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) return;
    
    setIsLoading(true);
    try {
      if (mode === 'register') {
        const res = await apiService.register(formData);
        if (res.error) throw new Error(res.error);
        // Automatically log in after register for better UX
        const loginRes = await apiService.login({ username: formData.username, password: formData.password });
        setCurrentUser(loginRes.user);
      } else {
        const res = await apiService.login({ username: formData.username, password: formData.password });
        if (res.error) throw new Error(res.error);
        setCurrentUser(res.user);
      }
      setView('dashboard');
    } catch (err: any) {
      setError(err.message === 'Username already taken' ? t.errorUsernameTaken : t.errorAuth);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="text-center space-y-6 pt-4">
        <div className="relative inline-block group">
          <div className="absolute inset-0 bg-teal-500/20 blur-3xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
          <div className="relative p-6 rounded-[2.5rem] bg-gradient-to-tr from-teal-500 to-blue-600 text-white shadow-2xl shadow-teal-500/20 animate-float">
            <Mail size={48} strokeWidth={2.5} />
            <div className="absolute -top-2 -right-2 p-2 bg-yellow-400 rounded-full text-black shadow-lg">
              <Sparkles size={16} fill="currentColor" />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-6xl font-[900] tracking-tighter chirkut-font bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent">
            {t.appName}
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 max-w-[300px] mx-auto text-lg font-medium leading-tight">
            {t.tagline}
          </p>
        </div>
      </div>

      <div className="w-full glass border border-white/40 dark:border-zinc-800 p-8 rounded-[3rem] shadow-2xl space-y-8">
        <div className="flex p-1 bg-slate-100 dark:bg-zinc-800/50 rounded-2xl">
          <button 
            onClick={() => {setMode('login'); setError('');}}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'login' ? 'bg-white dark:bg-zinc-700 shadow-sm text-teal-600 dark:text-teal-400' : 'text-slate-500'}`}
          >
            {t.login}
          </button>
          <button 
            onClick={() => {setMode('register'); setError('');}}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'register' ? 'bg-white dark:bg-zinc-700 shadow-sm text-teal-600 dark:text-teal-400' : 'text-slate-500'}`}
          >
            {t.register}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">
                {t.fullName}
              </label>
              <div className="relative">
                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={t.fullNamePlaceholder}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                />
              </div>
            </div>
          )}

          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">
              {t.username}
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 font-black text-lg transition-colors">@</span>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                placeholder={t.usernamePlaceholder}
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">
              {t.password}
            </label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t.passwordPlaceholder}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500 text-center font-bold bg-red-50 dark:bg-red-900/10 py-2 rounded-lg border border-red-100 dark:border-red-900/20">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full group relative flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-[1.5rem] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl overflow-hidden disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative flex items-center gap-2">
              {isLoading ? '...' : (mode === 'register' ? <UserPlus size={20} /> : <LogIn size={20} />)}
              {!isLoading && (mode === 'register' ? t.register : t.login)}
            </span>
          </button>
        </form>
      </div>

      <div className="flex items-center gap-3 opacity-40">
        <ShieldCheck size={16} />
        <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Privacy Guaranteed</span>
      </div>
    </div>
  );
};

export default Home;
