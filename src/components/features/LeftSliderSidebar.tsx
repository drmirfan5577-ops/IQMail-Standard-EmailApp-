import { useEffect, useRef, useState } from 'react';
import {
  X, Star, Users, Clock, ChevronRight, Mail,
  Inbox, Send, CheckCircle, AlertTriangle,
  Archive, Image as GalleryIcon, Settings
} from 'lucide-react';
import { EmailCategory } from '@/types/email';
import { CATEGORY_CONFIG } from '@/constants/mockData';
import { useNavigate } from 'react-router-dom';

type NavCategory = EmailCategory | 'admin';

interface LeftSliderSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: EmailCategory;
  onCategoryChange: (cat: EmailCategory) => void;
  getCategoryCount: (cat: EmailCategory) => number;
  getUnreadCount: (cat: EmailCategory) => number;
  onCompose: () => void;
}

const NAV_ITEMS: { id: NavCategory; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
  { id: 'inbox', label: 'I_Box', icon: Inbox },
  { id: 'outbox', label: 'O_Box', icon: Send },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle },
  { id: 'betrayed', label: 'Betrayed', icon: AlertTriangle },
  { id: 'stored', label: 'Store', icon: Archive },
  { id: 'specific', label: 'Specific', icon: Star },
  { id: 'gallery', label: 'Gallery', icon: GalleryIcon },
  { id: 'admin', label: 'Management', icon: Settings },
];

export default function LeftSliderSidebar({
  isOpen,
  onClose,
  activeCategory,
  onCategoryChange,
  getCategoryCount,
  getUnreadCount,
  onCompose,
}: LeftSliderSidebarProps) {
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleItemClick = (id: NavCategory) => {
    if (id === 'admin') {
      navigate('/admin');
    } else {
      onCategoryChange(id as EmailCategory);
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: 'rgba(15, 30, 60, 0.25)',
          backdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div
        className="fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 ease-out"
        style={{
          width: '280px',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderRight: '1px solid rgba(200,220,255,0.5)',
          boxShadow: '8px 0 40px rgba(100,160,255,0.2)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
            borderBottom: '1px solid rgba(200,220,255,0.4)',
          }}
        >
          <div>
            <div className="text-base font-black text-slate-800">IQMAIL</div>
            <div className="text-[10px] text-slate-400 font-medium">Global Family Platform</div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/70 transition-all"
          >
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        {/* Compose */}
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={() => { onCompose(); onClose(); }}
            className="w-full py-3 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
            }}
          >
            <Mail size={15} />
            Compose New
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isCategory = id !== 'admin';
            const isActive = isCategory && id === activeCategory;
            const unread = isCategory ? getUnreadCount(id as EmailCategory) : 0;
            const count = isCategory ? getCategoryCount(id as EmailCategory) : 0;
            const config = isCategory ? CATEGORY_CONFIG[id] : null;

            return (
              <button
                key={id}
                onClick={() => handleItemClick(id)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all hover:scale-[1.01] group"
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
                  border: '1.5px solid rgba(99,102,241,0.3)',
                  boxShadow: '0 2px 12px rgba(99,102,241,0.12)',
                } : {
                  border: '1.5px solid transparent',
                }}
              >
                {/* Color dot */}
                {config && (
                  <div className={`w-1.5 h-5 rounded-full bg-gradient-to-b ${config.color} flex-shrink-0`} />
                )}

                {/* Icon */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                  style={isActive ? {
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                  } : {
                    background: id === 'admin' ? 'rgba(239,68,68,0.1)' : 'rgba(241,245,249,0.8)',
                  }}
                >
                  <Icon size={15} className={isActive ? 'text-white' : id === 'admin' ? 'text-red-500' : 'text-slate-500'} />
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-bold ${isActive ? 'text-blue-700' : id === 'admin' ? 'text-red-600' : 'text-slate-700'}`}>
                    {label}
                  </div>
                  {config && (
                    <div className="text-[10px] text-slate-400 font-medium">{config.description}</div>
                  )}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-1.5">
                  {unread > 0 && (
                    <span
                      className="min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                    >
                      {unread}
                    </span>
                  )}
                  {count > 0 && unread === 0 && (
                    <span className="text-[10px] text-slate-400 font-medium">{count}</span>
                  )}
                  <ChevronRight size={13} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-4 py-4 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(200,220,255,0.3)' }}
        >
          <div
            className="rounded-2xl p-3"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.07), rgba(139,92,246,0.07))', border: '1px solid rgba(200,220,255,0.4)' }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Users size={12} className="text-blue-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ESOneWorld</span>
            </div>
            <div className="text-xs font-bold text-slate-700">Global Family Platform</div>
            <div className="text-[10px] text-slate-400 mt-0.5">2.4M Members · 90+ Countries</div>
            <div className="mt-2 h-1.5 rounded-full overflow-hidden bg-white/60">
              <div className="h-full w-3/4 rounded-full" style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }} />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
              <span>Storage</span><span>2.3 / 15 GB</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
