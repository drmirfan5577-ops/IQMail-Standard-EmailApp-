import React, { useState } from 'react';
import { TopHeader } from './components/TopHeader';
import { Dashboard } from './components/Dashboard';
import { VoiceMailPage } from './components/VoiceMailPage';
import { AdminPanelPage } from './components/AdminPanelPage';
import { Mail, Mic, Shield } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentTheme, setCurrentTheme] = useState<string>('theme-crimson-ice');

  return (
    <div className={`min-h-screen ${currentTheme} text-white flex flex-col font-sans select-none transition-all duration-500`}>
      <TopHeader />

      <div className="flex justify-around bg-slate-900/80 border-b border-white/10 p-2 text-xs font-semibold">
        <button onClick={() => setCurrentPage(0)} className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${currentPage === 0 ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
          <Mail size={14} /> Text Mail
        </button>
        <button onClick={() => setCurrentPage(1)} className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${currentPage === 1 ? 'bg-pink-600 text-white' : 'text-slate-400'}`}>
          <Mic size={14} /> Voice Mail
        </button>
        <button onClick={() => setCurrentPage(2)} className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${currentPage === 2 ? 'bg-purple-600 text-white' : 'text-slate-400'}`}>
          <Shield size={14} /> Admin
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {currentPage === 0 && <Dashboard />}
        {currentPage === 1 && <VoiceMailPage />}
        {currentPage === 2 && <AdminPanelPage onSelectTheme={(t) => setCurrentTheme(t)} />}
      </div>

      <div className="bg-slate-900/90 border-t border-white/10 py-2 px-6 flex justify-between items-center text-xs text-slate-400">
        <button onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>◄ Swipe Left</button>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${currentPage === i ? 'bg-pink-500' : 'bg-slate-700'}`} />
          ))}
        </div>
        <button onClick={() => currentPage < 2 && setCurrentPage(currentPage + 1)} disabled={currentPage === 2}>Swipe Right ►</button>
      </div>
    </div>
  );
}
