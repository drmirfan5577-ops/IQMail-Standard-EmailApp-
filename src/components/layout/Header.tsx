import { Search, Bell, Settings, Star, Shield, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadTotal: number;
  onLeftSidebarToggle: () => void;
  onRightSidebarToggle: () => void;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  pushEnabled: boolean;
  onEnablePush: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  unreadTotal,
  onLeftSidebarToggle,
  onRightSidebarToggle,
  leftSidebarOpen,
  rightSidebarOpen,
  pushEnabled,
  onEnablePush,
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      className="relative z-10 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 flex-shrink-0"
      style={{
        background: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 4px 24px rgba(100,160,255,0.1)',
        minHeight: '56px',
      }}
    >
      {/* Left toggle — Star button */}
      <button
        onClick={onLeftSidebarToggle}
        className="relative flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-2xl transition-all hover:scale-110 active:scale-95"
        style={leftSidebarOpen ? {
          background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
          boxShadow: '0 4px 16px rgba(245,158,11,0.45)',
        } : {
          background: 'rgba(255,255,255,0.7)',
          border: '1.5px solid rgba(200,220,255,0.5)',
          boxShadow: '0 2px 8px rgba(100,160,255,0.1)',
        }}
        title="Menu"
        aria-label="Toggle navigation menu"
      >
        <Star
          size={18}
          className={leftSidebarOpen ? 'fill-white text-white' : 'text-amber-400'}
          style={leftSidebarOpen ? {} : { fill: 'rgba(251,191,36,0.3)' }}
        />
        {unreadTotal > 0 && !leftSidebarOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            {unreadTotal > 9 ? '9+' : unreadTotal}
          </div>
        )}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div
          className="hidden sm:flex w-8 h-8 rounded-xl items-center justify-center text-white text-xs font-black"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}
        >
          IQ
        </div>
        <div className="hidden sm:block">
          <div className="text-sm font-black text-slate-800 leading-none">IQMAIL</div>
          <div className="text-[9px] text-slate-400 font-medium">ESOneWorld</div>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex-1 max-w-xl mx-auto">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-2xl transition-all"
          style={{
            background: 'rgba(241,245,249,0.85)',
            border: '1.5px solid rgba(200,220,255,0.5)',
          }}
        >
          <Search size={14} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search emails, senders, subjects..."
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none min-w-0"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-slate-300 hover:text-slate-500 flex-shrink-0"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Push notifications */}
        <button
          onClick={onEnablePush}
          className="relative p-2.5 rounded-2xl transition-all hover:scale-110"
          style={{
            background: pushEnabled ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.7)',
            border: pushEnabled ? '1.5px solid rgba(52,211,153,0.35)' : '1.5px solid rgba(200,220,255,0.5)',
          }}
          title={pushEnabled ? 'Push notifications active' : 'Enable push notifications'}
        >
          <Bell size={15} className={pushEnabled ? 'text-emerald-500' : 'text-slate-400'} />
          {pushEnabled && (
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
          )}
        </button>

        {/* Admin */}
        <button
          onClick={() => navigate('/admin')}
          className="hidden sm:flex p-2.5 rounded-2xl transition-all hover:scale-110"
          style={{
            background: 'rgba(255,255,255,0.7)',
            border: '1.5px solid rgba(200,220,255,0.5)',
          }}
          title="Admin panel"
        >
          <Shield size={15} className="text-violet-400" />
        </button>

        {/* Right sidebar — Star toggle */}
        <button
          onClick={onRightSidebarToggle}
          className="relative flex items-center justify-center w-10 h-10 rounded-2xl transition-all hover:scale-110 active:scale-95"
          style={rightSidebarOpen ? {
            background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
            boxShadow: '0 4px 16px rgba(139,92,246,0.45)',
          } : {
            background: 'rgba(255,255,255,0.7)',
            border: '1.5px solid rgba(200,220,255,0.5)',
            boxShadow: '0 2px 8px rgba(100,160,255,0.1)',
          }}
          title="Contacts"
          aria-label="Toggle contacts panel"
        >
          <Star
            size={18}
            className={rightSidebarOpen ? 'fill-white text-white' : 'text-violet-400'}
            style={rightSidebarOpen ? {} : { fill: 'rgba(167,139,250,0.3)' }}
          />
        </button>
      </div>
    </header>
  );
}
