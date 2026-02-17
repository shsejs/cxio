
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { TRANSLATIONS } from '../constants';
import { Message } from '../types';
import { apiService } from '../services/apiService';
import { 
  Copy, Check, LogOut, Send, Share2, Trash2, Camera, X, Settings, 
  Download, LayoutDashboard, User as UserIcon, Lock
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { lang, currentUser, setView, setCurrentUser } = useApp();
  const t = TRANSLATIONS[lang];
  const [messages, setMessages] = useState<Message[]>([]);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMessageForCard, setSelectedMessageForCard] = useState<Message | null>(null);
  const [settingsData, setSettingsData] = useState({ fullName: currentUser?.fullName || '', password: '' });

  useEffect(() => {
    fetchMessages();
  }, [currentUser]);

  const fetchMessages = async () => {
    if (!currentUser) return;
    const data = await apiService.getMessages(currentUser.username);
    setMessages(data);
  };

  const profileLink = `${window.location.origin}/#/@${currentUser?.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('home');
    window.location.hash = '/';
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const res = await apiService.updateProfile(currentUser.username, settingsData.fullName, settingsData.password);
    if (!res.error) {
      setCurrentUser({ ...currentUser, fullName: settingsData.fullName });
      setShowSettings(false);
      alert(lang === 'bn' ? 'প্রোফাইল আপডেট হয়েছে!' : 'Profile updated!');
    }
  };

  const deleteMessage = async (id: string) => {
    await apiService.deleteMessage(id);
    fetchMessages();
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="relative group overflow-hidden rounded-[3rem] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl shadow-slate-200/50 dark:shadow-none transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-teal-500 via-blue-500 to-indigo-600"></div>
        
        <div className="relative pt-16 pb-8 px-8 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-zinc-800 p-1.5 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full rounded-[2.2rem] bg-gradient-to-tr from-teal-400 to-blue-500 flex items-center justify-center text-white text-5xl font-black">
                {currentUser?.fullName.charAt(0)}
              </div>
            </div>
            <button className="absolute bottom-1 right-1 p-3 bg-white dark:bg-zinc-700 text-teal-600 rounded-2xl shadow-xl border border-slate-100 dark:border-zinc-600 hover:scale-110 active:scale-95 transition-all">
              <Camera size={18} />
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-[900] tracking-tighter">{currentUser?.fullName}</h2>
            <p className="text-slate-400 dark:text-zinc-500 font-black text-sm uppercase tracking-widest">@{currentUser?.username}</p>
          </div>

          <div className="w-full mt-8 grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-3xl border border-slate-100 dark:border-zinc-800">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Inbox</p>
              <p className="text-2xl font-black text-teal-500">{messages.length}</p>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-3xl border border-slate-100 dark:border-zinc-800">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Member Since</p>
              <p className="text-sm font-black">{new Date(currentUser?.createdAt || Date.now()).getFullYear() || '2025'}</p>
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => setShowSettings(true)} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white transition-all">
            <Settings size={20} />
          </button>
          <button onClick={handleLogout} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="glass p-8 rounded-[2.5rem] border border-white/40 dark:border-zinc-800 shadow-xl space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.yourLink}</label>
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 p-2 rounded-2xl border border-slate-100 dark:border-zinc-700">
            <input readOnly value={profileLink} className="flex-1 bg-transparent px-3 py-2 text-sm font-bold text-teal-600 dark:text-teal-400 outline-none" />
            <button onClick={copyToClipboard} className="bg-teal-500 text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-teal-500/20">
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(t.tagline + ' ' + profileLink)}`)} className="bg-[#25D366] text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs hover:opacity-90 transition-all">WhatsApp</button>
          <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileLink)}`)} className="bg-[#1877F2] text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs hover:opacity-90 transition-all">Facebook</button>
          <button className="bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs hover:opacity-90 transition-all">Instagram</button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-2xl font-[900] chirkut-font flex items-center gap-3"><LayoutDashboard className="text-teal-500" />{t.inbox}</h3>
          {messages.length > 0 && <span className="bg-teal-500/10 text-teal-600 dark:text-teal-400 px-4 py-1 rounded-full text-xs font-black">{messages.length} Messages</span>}
        </div>

        {messages.length === 0 ? (
          <div className="py-24 text-center glass rounded-[3rem] border border-dashed border-slate-300 dark:border-zinc-800">
            <div className="inline-block p-8 bg-slate-50 dark:bg-zinc-800 rounded-full mb-6"><Send size={48} className="text-slate-300 animate-pulse" /></div>
            <p className="text-xl font-black chirkut-font opacity-60 mb-2">{t.noMessages}</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {messages.map((msg) => (
              <div key={msg.id} className="group relative bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    {new Date(msg.timestamp).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <button onClick={() => deleteMessage(msg.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                </div>
                <p className="chirkut-font text-2xl font-bold leading-relaxed text-slate-800 dark:text-zinc-100">{msg.content}</p>
                <div className="mt-8 flex justify-end">
                  <button onClick={() => setSelectedMessageForCard(msg)} className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all"><Share2 size={14} />{t.shareCard}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/60 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[3rem] p-8 shadow-2xl space-y-8 relative">
            <button onClick={() => setShowSettings(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={24} /></button>
            <div className="text-center space-y-2"><h4 className="text-2xl font-black">{t.settings}</h4></div>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.fullName}</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" required value={settingsData.fullName} onChange={(e) => setSettingsData({...settingsData, fullName: e.target.value})} className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-teal-500 outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'}</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="password" placeholder="••••••••" value={settingsData.password} onChange={(e) => setSettingsData({...settingsData, password: e.target.value})} className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-teal-500 outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-black rounded-3xl shadow-xl">{t.saveChanges}</button>
            </form>
          </div>
        </div>
      )}

      {selectedMessageForCard && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/70 animate-in fade-in zoom-in duration-300">
          <div className="w-full max-w-sm space-y-8">
            <div className="aspect-[4/5] relative rounded-[3rem] p-10 flex flex-col justify-between text-white overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-blue-600 to-indigo-700"></div>
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-white text-2xl font-black border border-white/30">{currentUser?.fullName.charAt(0)}</div>
                <div><p className="font-black text-lg tracking-tight">@{currentUser?.username}</p><p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Chirkut Anonymous</p></div>
              </div>
              <div className="relative py-12"><p className="text-3xl font-[900] chirkut-font leading-tight break-words tracking-tight">{selectedMessageForCard.content}</p></div>
              <div className="relative space-y-4"><div className="w-full h-px bg-white/20"></div><div className="flex flex-col items-center gap-3"><div className="px-6 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20"><p className="text-[10px] font-black uppercase tracking-[0.2em]">Send me a chirkut!</p></div><p className="text-xs font-black opacity-50">chirkut.app/@{currentUser?.username}</p></div></div>
            </div>
            <div className="grid grid-cols-2 gap-4 px-2">
              <button onClick={() => setSelectedMessageForCard(null)} className="py-4 glass rounded-3xl text-white font-black flex items-center justify-center gap-2 border border-white/10"><X size={20} /> {t.close}</button>
              <button onClick={() => alert('Feature coming soon!')} className="py-4 bg-white text-teal-600 rounded-3xl font-black flex items-center justify-center gap-2 shadow-xl"><Download size={20} /> {t.download}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
