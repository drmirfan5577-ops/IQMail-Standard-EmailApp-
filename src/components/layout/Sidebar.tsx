import {
  Inbox, Send, Archive, AlertTriangle, CheckCircle, Image,
  Star, PenSquare, Globe, Users
} from 'lucide-react';
import { EmailCategory } from '@/types/email';
import { CATEGORY_CONFIG } from '@/constants/mockData';

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Inbox, Send, Archive, AlertTriangle, CheckCircle, Image, Star,
};

interface SidebarProps {
  activeCategory: EmailCategory;
  onCategoryChange: (c: EmailCategory) => void;
  getCategoryCount: (c: EmailCategory) => number;
  getUnreadCount: (c: EmailCategory) => number;
  onCompose: () => void;
  collapsed?: boolean;
}

const CATEGORIES: EmailCategory[] = ['inbox', 'outbox', 'delivered', 'betrayed', 'stored', 'specific', 'gallery'];

export default function Sidebar({
  activeCategory,
  onCategoryChange,
  getCategoryCount,
  getUnreadCount,
  onCompose,
  collapsed = false,
}: SidebarProps) {
  return (
    <aside
      className="relative z-10 flex flex-col h-full transition-all duration-300"
      style={{
        width: collapsed ? '56px' : '200px',
        background: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.7)',
        boxShadow: '4px 0 24px rgba(100,160,255,0.07)',
      }}
    >
      {/* Compose button */}
      <div className="p-2.5">
        <button
          onClick={onCompose}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl font-bold text-sm text-white transition-all hover:shadow-lg hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
          }}
          title="Compose"
        >
          <PenSquare size={15} />
          {!collapsed && <span>Compose</span>}
        </button>
      </div>

      {/* Categories */}
      <nav className="flex-1 px-1.5 py-1 space-y-0.5 overflow-y-auto">
        {CATEGORIES.map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          const Icon = ICON_MAP[config.icon] || Inbox;
          const unread = getUnreadCount(cat);
          const isActive = activeCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-xl text-left transition-all group hover:scale-[1.02]"
              title={config.label}
              style={isActive ? {
                background: 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(139,92,246,0.18))',
                border: '1px solid rgba(99,102,241,0.3)',
                boxShadow: '0 2px 12px rgba(99,102,241,0.12)',
              } : {
                border: '1px solid transparent',
              }}
            >
              <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-white/50' : 'bg-white/20 group-hover:bg-white/40'}`}>
                <Icon size={13} className={isActive ? 'text-blue-600' : 'text-slate-500'} />
              </div>
              {!collapsed && (
                <>
                  <span className={`flex-1 text-xs font-semibold truncate ${isActive ? 'text-blue-700' : 'text-slate-600'}`}>
                    {config.label}
                  </span>
                  {unread > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                      {unread}
                    </span>
                  )}
                </>
              )}
              {collapsed && unread > 0 && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      {!collapsed && (
        <div className="p-2.5">
          <div className="rounded-xl p-2.5"
            style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(200,220,255,0.4)' }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Globe size={11} className="text-blue-400" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Global Network</span>
            </div>
            <div className="text-xs font-bold text-slate-700">2.4M Members</div>
            <div className="text-[10px] text-slate-400">90+ Countries</div>
            <div className="mt-1.5 h-1.5 rounded-full bg-white/60 overflow-hidden">
              <div className="h-full w-3/4 rounded-full"
                style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }} />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
