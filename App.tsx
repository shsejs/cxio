
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Language, Theme, User } from './types';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';

interface AppContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Language;
  setLang: (l: Language) => void;
  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;
  view: 'home' | 'dashboard' | 'profile';
  setView: (v: 'home' | 'dashboard' | 'profile') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<Language>('bn');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'dashboard' | 'profile'>('home');
  const [profileUsername, setProfileUsername] = useState<string>('');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      // Support /@username format
      if (hash.startsWith('#/@')) {
        const username = hash.split('#/@')[1];
        if (username) {
          setProfileUsername(username);
          setView('profile');
          return;
        }
      }
      
      // If we are logged in and just hit base domain, go to dashboard
      const saved = localStorage.getItem('chirkut_session');
      if (saved && (hash === '' || hash === '#/')) {
        setView('dashboard');
      } else if (!hash || hash === '#/') {
        setView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); 
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser]);

  useEffect(() => {
    const saved = localStorage.getItem('chirkut_session');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('chirkut_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('chirkut_session');
    }
  }, [currentUser]);

  const value = {
    theme, setTheme,
    lang, setLang,
    currentUser, setCurrentUser,
    view, setView
  };

  return (
    <AppContext.Provider value={value}>
      <Layout>
        {view === 'home' && <Home />}
        {view === 'dashboard' && <Dashboard />}
        {view === 'profile' && <PublicProfile username={profileUsername} />}
      </Layout>
    </AppContext.Provider>
  );
};

export default App;
