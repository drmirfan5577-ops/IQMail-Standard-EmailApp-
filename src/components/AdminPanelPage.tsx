import React, { useState } from 'react';
import { 
  Shield, Lock, Sparkles, Server, Cpu, Layers, CheckCircle2, 
  ExternalLink, Globe, Database, Code, Cloud, Youtube, Facebook, MessageSquare 
} from 'lucide-react';
import { processVoiceToEnterpriseMail } from '../lib/gemeniMailEngine';

export const AdminPanelPage = ({ onSelectTheme }: { onSelectTheme: (themeClass: string) => void }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const ADMIN_PASSWORD = '@1122#';

  const [integrations, setIntegrations] = useState<Record<string, boolean>>({
    gemini: true,
    chatgpt: false,
    supabase: true,
    firebase: false,
    netlify: true,
    vercel: false,
    namecheap: false,
    github: true,
    cloudflare: true,
    whatsapp: true,
    youtube: false,
    facebook: false
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
    try {
      const result = await processVoiceToEnterpriseMail(rawVoiceInput, 'YOUR_GEMINI_API_KEY');
      setGeneratedMail(result);
    } catch (err) {
      alert('Gemini AI processing failed. API configuration check karein.');
    }
    setIsProcessing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <form onSubmit={handleAdminAuth} className="w-full max-w-md p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl text-center space-y-6">
          <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl w-fit mx-auto border border-purple-500/20">
            <Lock size={36} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Admin Access Only</h2>
          <p className="text-xs text-slate-400">Tamam backend integrations aur properties protected hain</p>
          <input
            type="password"
            placeholder="Enter Password (@1122#)"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full p-3.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-center font-mono text-white focus:outline-none focus:border-purple-500 text-sm"
          />
          <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-xl text-xs font-bold tracking-wider uppercase shadow-lg">
            Authorize System Access
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 flex items-center gap-2">
            <Shield className="text-pink-500" size={26} /> IQMail Enterprise Admin Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">Active integrations, Gemini AI pipeline, aur 4D Glass Theme Manager</p>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-xs font-semibold hover:bg-red-500/30">
          Lock Access
        </button>
      </div>

      {/* 1. Dynamic Themes */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Layers size={18} className="text-pink-400" /> Dynamic 4D Live Glass Themes & Launchers
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            onClick={() => onSelectTheme('theme-crimson-ice')}
            className="p-4 h-32 rounded-2xl bg-gradient-to-br from-rose-900/80 via-red-950/90 to-slate-950 border border-rose-500/40 backdrop-blur-md flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition shadow-lg shadow-rose-950/50"
          >
            <span className="text-xs font-bold text-rose-200">4D Frozen Crimson Glass</span>
            <span className="text-[10px] text-rose-400/80">Ice Crystal Red Shader</span>
          </div>

          <div 
            onClick={() => onSelectTheme('theme-emerald-glow')}
            className="p-4 h-32 rounded-2xl bg-gradient-to-br from-emerald-900/80 via-teal-950/90 to-slate-950 border border-emerald-500/40 backdrop-blur-md flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition shadow-lg shadow-emerald-950/50"
          >
            <span className="text-xs font-bold text-emerald-200">Emerald Glowing Glass</span>
            <span className="text-[10px] text-emerald-400/80">Neon Cyan Border Aura</span>
          </div>

          <div 
            onClick={() => onSelectTheme('theme-milky-white')}
            className="p-4 h-32 rounded-2xl bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900 border border-white flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition shadow-xl"
          >
            <span className="text-xs font-extrabold text-slate-900">Pure Milky White</span>
            <span className="text-[10px] text-slate-600">Crystal Opaque Glass</span>
          </div>

          <div 
            onClick={() => onSelectTheme('theme-bokeh-neon')}
            className="p-4 h-32 rounded-2xl bg-gradient-to-br from-amber-900/80 via-purple-950/90 to-slate-950 border border-amber-500/40 backdrop-blur-md flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition shadow-lg"
          >
            <span className="text-xs font-bold text-amber-200">24/7 Neon Bokeh Display</span>
            <span className="text-[10px] text-amber-400/80">Vibrant Dynamic Dots</span>
          </div>
        </div>
      </div>

      {/* 2. Gemini AI Pipeline */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-indigo-300 flex items-center gap-2">
            <Sparkles size={20} className="text-indigo-400" /> Gemini AI Voice Note → Enterprise Mail Generator
          </h2>
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] rounded-full font-mono">
            Active Assistant
          </span>
        </div>

        <div className="space-y-3">
          <textarea
            rows={3}
            placeholder="Rough audio ya voice note ka text yahan likhein..."
            value={rawVoiceInput}
            onChange={(e) => setRawVoiceInput(e.target.value)}
            className="w-full p-3.5 bg-slate-950/90 border border-slate-700 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleRunGeminiPipeline}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
          >
            <Cpu size={16} /> {isProcessing ? 'Processing with Gemini AI...' : 'Generate Official Mail & Directions'}
          </button>
        </div>

        {generatedMail && (
          <div className="mt-4 p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3 text-xs">
            <div className="text-emerald-400 font-bold border-b border-slate-800 pb-2">
              Subject: {generatedMail.subject}
            </div>
            <div className="text-purple-300">
              <strong>Key Points Sum-up:</strong> {generatedMail.summary}
            </div>
            <div className="whitespace-pre-wrap text-slate-300 font-mono text-[11px] bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              {generatedMail.body}
            </div>
          </div>
        )}
      </div>

      {/* 3. One-Click Integrations */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Server size={18} className="text-purple-400" /> One-Click Integrations & Cloud Services
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'gemini', name: 'Google Gemini AI', icon: Sparkles, color: 'text-indigo-400' },
            { id: 'chatgpt', name: 'OpenAI ChatGPT', icon: Cpu, color: 'text-emerald-400' },
            { id: 'supabase', name: 'Supabase DB', icon: Database, color: 'text-emerald-500' },
            { id: 'firebase', name: 'Firebase Sync', icon: Cpu, color: 'text-amber-400' },
            { id: 'netlify', name: 'Netlify Deploy', icon: Globe, color: 'text-cyan-400' },
            { id: 'vercel', name: 'Vercel Edge', icon: Cloud, color: 'text-slate-200' },
            { id: 'github', name: 'GitHub Repo', icon: Code, color: 'text-purple-400' },
            { id: 'cloudflare', name: 'Cloudflare CDN', icon: Server, color: 'text-orange-400' },
            { id: 'whatsapp', name: 'WhatsApp API', icon: MessageSquare, color: 'text-emerald-400' },
            { id: 'youtube', name: 'YouTube Engine', icon: Youtube, color: 'text-red-500' },
            { id: 'facebook', name: 'Facebook Connect', icon: Facebook, color: 'text-blue-500' },
            { id: 'namecheap', name: 'Namecheap DNS', icon: ExternalLink, color: 'text-rose-400' },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => toggleIntegration(item.id)}
              className={`p-4 rounded-2xl border backdrop-blur-md cursor-pointer flex items-center justify-between transition ${
                integrations[item.id]
                  ? 'bg-slate-800/90 border-emerald-500/50 shadow-lg'
                  : 'bg-slate-900/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={item.color} size={20} />
                <span className="text-xs font-bold">{item.name}</span>
              </div>
              <CheckCircle2
                size={18}
                className={integrations[item.id] ? 'text-emerald-400' : 'text-slate-600'}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
