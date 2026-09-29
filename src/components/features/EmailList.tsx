import { Star, Paperclip, Circle } from 'lucide-react';
import { Email, EmailCategory } from '@/types/email';
import { CATEGORY_CONFIG } from '@/constants/mockData';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (id: string) => void;
  onToggleStar: (id: string) => void;
  activeCategory: EmailCategory;
  searchQuery: string;
}

function getAvatarFallback(name: string) {
  return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
}

const AVATAR_GRADIENTS = [
  'from-blue-400 to-cyan-400',
  'from-violet-400 to-purple-400',
  'from-emerald-400 to-teal-400',
  'from-pink-400 to-rose-400',
  'from-amber-400 to-orange-400',
  'from-cyan-400 to-blue-400',
];

export default function EmailList({
  emails,
  selectedEmailId,
  onSelectEmail,
  onToggleStar,
  activeCategory,
  searchQuery,
}: EmailListProps) {
  const config = CATEGORY_CONFIG[activeCategory];

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 px-4">
        <div className="text-5xl mb-4">📭</div>
        <div className="text-base font-bold text-slate-600 mb-1">
          {searchQuery ? 'No results found' : `${config.label} is empty`}
        </div>
        <div className="text-sm text-slate-400 text-center">
          {searchQuery
            ? `No emails match "${searchQuery}"`
            : 'Nothing here yet. Check back later.'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Category header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(200,220,255,0.3)' }}>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${config.color}`} />
          <span className="text-sm font-bold text-slate-700">{config.label}</span>
          <span className="text-xs text-slate-400">({emails.length})</span>
        </div>
        {searchQuery && (
          <span className="text-xs text-blue-500 font-medium">
            Searching: "{searchQuery}"
          </span>
        )}
      </div>

      {/* Email items */}
      <div className="flex-1 overflow-y-auto">
        {emails.map((email, idx) => {
          const isSelected = email.id === selectedEmailId;
          const gradient = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];

          return (
            <div
              key={email.id}
              onClick={() => onSelectEmail(email.id)}
              className="relative flex items-start gap-3 px-3 py-3 cursor-pointer transition-all group"
              style={
                isSelected
                  ? {
                      background: 'rgba(99,102,241,0.12)',
                      borderLeft: '3px solid rgba(99,102,241,0.7)',
                      borderBottom: '1px solid rgba(200,220,255,0.3)',
                    }
                  : {
                      borderLeft: '3px solid transparent',
                      borderBottom: '1px solid rgba(200,220,255,0.2)',
                    }
              }
            >
              {/* Hover overlay */}
              {!isSelected && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(255,255,255,0.4)' }} />
              )}

              {/* Avatar */}
              <div className="relative flex-shrink-0 z-10">
                {email.avatar ? (
                  <img
                    src={email.avatar}
                    alt={email.from}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white/70"
                  />
                ) : (
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/70`}>
                    {getAvatarFallback(email.from)}
                  </div>
                )}
                {!email.isRead && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 z-10">
                <div className="flex items-start justify-between gap-1 mb-0.5">
                  <span className={`text-xs truncate ${!email.isRead ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                    {email.from}
                  </span>
                  <span className="text-[10px] text-slate-400 flex-shrink-0 font-medium">
                    {email.date}
                  </span>
                </div>
                <div className={`text-xs truncate mb-0.5 ${!email.isRead ? 'font-semibold text-slate-700' : 'font-medium text-slate-500'}`}>
                  {email.subject}
                </div>
                <div className="text-[11px] text-slate-400 truncate leading-relaxed">
                  {email.preview}
                </div>

                {/* Tags */}
                {email.tags && email.tags.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {email.tags.slice(0, 2).map((tag) => (
                      <span key={tag}
                        className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold text-blue-600"
                        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Star */}
              <button
                onClick={(e) => { e.stopPropagation(); onToggleStar(email.id); }}
                className="flex-shrink-0 z-10 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
              >
                <Star
                  size={14}
                  className={email.isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
