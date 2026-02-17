
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { TRANSLATIONS } from '../constants';
import { getMessageSuggestion } from '../services/geminiService';
import { apiService } from '../services/apiService';
import { Sparkles, Send, CheckCircle2, User as UserIcon, MessageSquare, ShieldCheck } from 'lucide-react';

interface PublicProfileProps {
  username: string;
}

const PublicProfile: React.FC<PublicProfileProps> = ({ username }) => {
  const { lang, setView } = useApp();
  const t = TRANSLATIONS[lang];
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;
    setIsSending(true);
    try {
      await apiService.sendMessage(username, message);
      setIsSent(true);
      setMessage('');
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleAISuggestion = async () => {
    setLoadingSuggestion(true);
    const suggestion = await getMessageSuggestion(lang);
    setMessage(suggestion);
    setLoadingSuggestion(false);
  };

  if (isSent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-8 animate-in zoom-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative p-10 bg-green-500 text-white rounded-[3rem] shadow-2xl shadow-green-500/20"><CheckCircle2 size={72} strokeWidth={2.5} /></div>
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-[900] chirkut-font tracking-tight">{t.success}</h2>
          <p className="text-slate-500 max-w-xs mx-auto font-medium">{lang === 'bn' ? 'আপনার গোপন কথাটি সঠিক জায়গায় পৌঁছে গেছে!' : 'Your secret message has been delivered safely.'}</p>
        </div>
        <div className="flex flex-col w-full gap-4 pt-6">
          <button onClick={() => { setView('home'); window.location.hash = '/'; }} className="w-full py-5 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl hover:scale-[1.02] transition-all">{lang === 'bn' ? 'নিজের ইনবক্স তৈরি করুন' : 'Create your own inbox'}</button>
          <button onClick={() => setIsSent(false)} className="text-slate-400 font-bold hover:text-teal-500 transition-colors uppercase tracking-widest text-xs">Send another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16 animate-in slide-in-from-bottom-12 duration-700">
      <div className="text-center space-y-5">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-teal-500 blur-3xl opacity-10"></div>
          <div className="relative w-32 h-32 mx-auto rounded-[3rem] bg-white dark:bg-zinc-900 border-4 border-white dark:border-zinc-800 shadow-2xl flex items-center justify-center text-5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-teal-500 to-blue-600 rotate-6 group">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-[900] tracking-tighter">@{username}</h2>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full"><span className="text-teal-500 font-black">@</span><span className="text-sm font-black tracking-widest text-slate-500 dark:text-zinc-400">{username}</span></div>
        </div>
      </div>

      <div className="glass border border-white/40 dark:border-zinc-800 rounded-[3.5rem] p-10 shadow-2xl space-y-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 text-teal-500/5 transition-colors duration-1000"><MessageSquare size={160} /></div>
        <div className="space-y-4 relative">
          <div className="flex items-center justify-between px-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.sendMessage}</label><button onClick={handleAISuggestion} disabled={loadingSuggestion} className="flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl text-xs font-black transition-all hover:scale-105 disabled:opacity-50"><Sparkles size={14} className={loadingSuggestion ? 'animate-spin' : ''} />{t.aiSuggest}</button></div>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t.anonymousPlaceholder} rows={6} className="w-full bg-slate-50/50 dark:bg-zinc-800/50 rounded-[2.5rem] p-8 outline-none border-2 border-transparent focus:border-teal-500 transition-all resize-none chirkut-font text-2xl font-bold shadow-inner" />
        </div>
        <button onClick={handleSend} disabled={!message.trim() || isSending} className="relative w-full overflow-hidden bg-slate-900 dark:bg-white text-white dark:text-black font-black py-6 rounded-[2rem] shadow-2xl disabled:opacity-50 text-xl">
          <span className="relative flex items-center justify-center gap-3">
            {isSending ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Send size={24} />{t.send}</>}
          </span>
        </button>
      </div>
    </div>
  );
};

export default PublicProfile;
