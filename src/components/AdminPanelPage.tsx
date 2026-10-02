import React, { useState } from 'react';
import { 
  Shield, Lock, Sparkles, Server, Cpu, Layers, CheckCircle2, 
  ExternalLink, Globe, Database, Code, Cloud, Youtube, Facebook, MessageSquare 
} from 'lucide-react';
import { processVoiceToEnterpriseMail } from '../lib/geminiMailEngine';

export const AdminPanelPage = ({ onSelectTheme }: { onSelectTheme: (themeClass: string) => void }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const ADMIN_PASSWORD = '@1122#';

  const [integrations, setIntegrations] = useState<Record<string, boolean>>({
    gemini: true, chatgpt: false, supabase: true, firebase: false,
    netlify: true, vercel: false, namecheap: false, github: true,
    cloudflare: true, whatsapp: true, youtube: false, facebook: false
  });

  const [rawVoiceInput, setRawVoiceInput] = useState('');
  const [generatedMail, setGeneratedMail] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleIntegration = (key: string) => {
    setIntegrations(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Ghalat password! Access denied.');
    }
  };

  const handleRunGeminiPipeline = async () => {
    if (!rawVoiceInput) return;
    setIsProcessing(true);
    const result = await processVoiceToEnterpriseMail(rawVoiceInput, '');
    setGeneratedMail(result);
    setIsProcessing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <form onSubmit={handleAdminAuth} className="w-full max-w-md p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-6">
          <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl w-fit mx-auto border border-purple-500/20">
            <Lock size={36} />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Access Only</h2>
          <p className="text-xs text-slate-400">Enter password to access Admin Controls</p>
          <input
            type="password"
            placeholder="Enter Password (@1122#)"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-xl text-center font-mono text-white text-sm"
          />
          <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-xl text-xs font-bold uppercase shadow-lg">
            Authorize System Access
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto text-white">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-pink-400 flex items-center gap-2">
            <Shield size={26} /> IQMail Enterprise Admin Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">One-click integrations & 4D Glass Theme Launcher</p>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-xs font-semibold">
          Lock Access
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-300 uppercase flex items-center gap-2">
          <Layers size={18} className="text-pink-400" /> Dynamic 4D Live Glass Themes
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div onClick={() => onSelectTheme('theme-crimson-ice')} className="p-4 h-32 rounded-2xl bg-gradient-to-br from-rose-900 via-red-950 to-slate-950 border border-rose-500/40 flex flex-col justify-between cursor-pointer">
            <span className="text-xs font-bold text-rose-200">4D Frozen Crimson Glass</span>
          </div>
          <div onClick={() => onSelectTheme('theme-emerald-glow')} className="p-4 h-32 rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 border border-emerald-500/40 flex flex-col justify-between cursor-pointer">
            <span className="text-xs font-bold text-emerald-200">Emerald Glowing Glass</span>
          </div>
          <div onClick={() => onSelectTheme('theme-milky-white')} className="p-4 h-32 rounded-2xl bg-slate-100 text-slate-900 border border-white flex flex-col justify-between cursor-pointer">
            <span className="text-xs font-extrabold">Pure Milky White</span>
          </div>
          <div onClick={() => onSelectTheme('theme-bokeh-neon')} className="p-4 h-32 rounded-2xl bg-gradient-to-br from-amber-900 via-purple-950 to-slate-950 border border-amber-500/40 flex flex-col justify-between cursor-pointer">
            <span className="text-xs font-bold text-amber-200">24/7 Neon Bokeh Display</span>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl space-y-4">
        <h2 className="text-base font-bold text-indigo-300 flex items-center gap-2">
          <Sparkles size={20} className="text-indigo-400" /> Gemini AI Voice Note → Enterprise Mail Generator
        </h2>
        <textarea
          rows={3}
          placeholder="Rough audio ya voice note ka text yahan likhein..."
          value={rawVoiceInput}
          onChange={(e) => setRawVoiceInput(e.target.value)}
          className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white"
        />
        <button onClick={handleRunGeminiPipeline} disabled={isProcessing} className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg">
          {isProcessing ? 'Processing with Gemini AI...' : 'Generate Official Mail'}
        </button>
        {generatedMail && (
          <div className="mt-4 p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3 text-xs">
            <div className="text-emerald-400 font-bold border-b border-slate-800 pb-2">Subject: {generatedMail.subject}</div>
            <div className="text-purple-300"><strong>Sum-up:</strong> {generatedMail.summary}</div>
            <div className="whitespace-pre-wrap text-slate-300 font-mono text-[11px] bg-slate-900 p-4 rounded-xl">{generatedMail.body}</div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-300 uppercase flex items-center gap-2">
          <Server size={18} className="text-purple-400" /> One-Click Integrations
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'gemini', name: 'Google Gemini AI', icon: Sparkles, color: 'text-indigo-400' },
            { id: 'chatgpt', name: 'OpenAI ChatGPT', icon: Cpu, color: 'text-emerald-400' },
            { id: 'supabase', name: 'Supabase DB', icon: Database, color: 'text-emerald-500' },
            { id: 'netlify', name: 'Netlify Deploy', icon: Globe, color: 'text-cyan-400' },
            { id: 'github', name: 'GitHub Repo', icon: Code, color: 'text-purple-400' },
            { id: 'cloudflare', name: 'Cloudflare CDN', icon: Server, color: 'text-orange-400' },
            { id: 'whatsapp', name: 'WhatsApp API', icon: MessageSquare, color: 'text-emerald-400' },
            { id: 'youtube', name: 'YouTube Engine', icon: Youtube, color: 'text-red-500' },
          ].map((item) => (
            <div key={item.id} onClick={() => toggleIntegration(item.id)} className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between ${integrations[item.id] ? 'bg-slate-800 border-emerald-500' : 'bg-slate-900/40 border-slate-800'}`}>
              <div className="flex items-center gap-3">
                <item.icon className={item.color} size={20} />
                <span className="text-xs font-bold">{item.name}</span>
              </div>
              <CheckCircle2 size={18} className={integrations[item.id] ? 'text-emerald-400' : 'text-slate-600'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
