
import React, { ReactNode } from 'react';
import { useApp } from '../App';
import { TRANSLATIONS } from '../constants';
import { Moon, Sun, Languages, ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, setTheme, lang, setLang, view, setView, currentUser } = useApp();
  const t = TRANSLATIONS[lang];

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(lang === 'bn' ? 'en' : 'bn');

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'dark' : ''}`}>
      <header className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {view === 'profile' && (
              <button 
                onClick={() => { setView('home'); window.location.hash = '/'; }}
                className="p-3 bg-slate-100 dark:bg-zinc-800 rounded-2xl text-slate-500 hover:text-teal-500 transition-all"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-3xl font-[950] tracking-tighter chirkut-font bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent select-none">
              {t.appName}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLang}
              className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400"
            >
              <Languages size={18} />
              <span>{lang === 'bn' ? 'EN' : 'BN'}</span>
            </button>
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all text-slate-500 dark:text-zinc-400"
            >
              {theme === 'dark' ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-xl mx-auto px-6 py-12">
        {children}
      </main>

      <footer className="py-12 px-6 text-center space-y-4">
        <div className="w-12 h-1 bg-slate-100 dark:bg-zinc-800 mx-auto rounded-full"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 select-none">
          &copy; {new Date().getFullYear()} {t.appName} Platform
        </p>
      </footer>
    </div>
  );
};

export default Layout;
