import { Mail } from 'lucide-react';

export const TopHeader = () => {
  return (
    <header
      className="flex items-center gap-3 px-4 py-2.5 flex-shrink-0 z-20 relative"
      style={{
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
      >
        IQ
      </div>
      <div>
        <div className="text-sm font-black text-white leading-none">IQMAIL</div>
        <div className="text-[9px] text-slate-400 font-medium">ESOneWorld — A Global Family Platform</div>
      </div>
      <div className="ml-auto">
        <Mail size={18} className="text-slate-400" />
      </div>
    </header>
  );
};
