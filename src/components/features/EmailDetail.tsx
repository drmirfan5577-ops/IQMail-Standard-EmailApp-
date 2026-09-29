import {
  ArrowLeft, Star, Trash2, Archive, MailOpen, Mail,
  Forward, Reply, ReplyAll, MoveRight, Tag, Paperclip
} from 'lucide-react';
import { useState } from 'react';
import { Email, EmailCategory } from '@/types/email';
import { CATEGORY_CONFIG } from '@/constants/mockData';

interface EmailDetailProps {
  email: Email;
  onBack: () => void;
  onToggleStar: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, category: EmailCategory) => void;
  onReply?: (toEmail: string) => void;
}

const CATEGORIES: EmailCategory[] = ['inbox', 'outbox', 'delivered', 'betrayed', 'stored', 'specific', 'gallery'];

export default function EmailDetail({
  email,
  onBack,
  onToggleStar,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  onMove,
  onReply,
}: EmailDetailProps) {
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  const handleDelete = () => {
    if (confirm('Delete this email permanently?')) {
      onDelete(email.id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div
        className="flex items-center gap-1.5 px-3 py-2.5 flex-shrink-0 flex-wrap"
        style={{ borderBottom: '1px solid rgba(200,220,255,0.3)' }}
      >
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-white/50 transition-all hover:scale-110 mr-1"
        >
          <ArrowLeft size={16} className="text-slate-500" />
        </button>

        <button onClick={() => onToggleStar(email.id)} className="p-2 rounded-xl hover:bg-white/50 transition-all">
          <Star size={15} className={email.isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-400'} />
        </button>

        <button
          onClick={() => email.isRead ? onMarkAsUnread(email.id) : onMarkAsRead(email.id)}
          className="p-2 rounded-xl hover:bg-white/50 transition-all"
          title={email.isRead ? 'Mark unread' : 'Mark read'}
        >
          {email.isRead
            ? <Mail size={15} className="text-slate-400" />
            : <MailOpen size={15} className="text-blue-500" />}
        </button>

        {/* Move dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMoveMenu(!showMoveMenu)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl hover:bg-white/50 text-xs font-medium text-slate-500 transition-all"
          >
            <MoveRight size={13} />
            <span className="hidden sm:inline">Move</span>
          </button>
          {showMoveMenu && (
            <div
              className="absolute top-full left-0 mt-1 w-36 rounded-2xl p-1.5 z-50"
              style={{
                background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(200,220,255,0.6)',
                boxShadow: '0 8px 32px rgba(100,160,255,0.2)',
              }}
            >
              {CATEGORIES.filter((c) => c !== email.category).map((cat) => (
                <button
                  key={cat}
                  onClick={() => { onMove(email.id, cat); setShowMoveMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-blue-50 transition-colors font-medium"
                >
                  {CATEGORY_CONFIG[cat]?.label || cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => onMove(email.id, 'stored')} className="p-2 rounded-xl hover:bg-white/50 transition-all" title="Archive">
          <Archive size={15} className="text-slate-400" />
        </button>

        <button onClick={handleDelete} className="p-2 rounded-xl hover:bg-red-50 transition-all" title="Delete">
          <Trash2 size={15} className="text-red-400" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => onReply?.(email.fromEmail)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-all"
          >
            <Reply size={13} />
            <span className="hidden sm:inline">Reply</span>
          </button>
          <button className="p-1.5 rounded-xl hover:bg-white/50 transition-all">
            <ReplyAll size={14} className="text-slate-400" />
          </button>
          <button className="p-1.5 rounded-xl hover:bg-white/50 transition-all">
            <Forward size={14} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Email content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
        {/* Subject */}
        <h1 className="text-base sm:text-lg font-bold text-slate-800 mb-4 leading-snug">
          {email.subject}
        </h1>

        {/* Meta card */}
        <div
          className="flex items-start gap-3 p-4 rounded-2xl mb-5"
          style={{
            background: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(200,220,255,0.4)',
          }}
        >
          {email.avatar ? (
            <img src={email.avatar} alt={email.from}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/70 flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {email.from.split(' ').map((n) => n[0]).join('').substring(0, 2)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <div className="font-bold text-sm text-slate-800">{email.from}</div>
                <div className="text-xs text-slate-400 truncate">&lt;{email.fromEmail}&gt;</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-slate-500 font-medium">{email.date}</div>
                {email.tags && email.tags.length > 0 && (
                  <div className="flex gap-1 mt-1 justify-end flex-wrap">
                    {email.tags.slice(0, 3).map((tag) => (
                      <span key={tag}
                        className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold text-violet-600"
                        style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-1 text-xs text-slate-400">To: {email.toEmail}</div>
            {email.ccEmails && email.ccEmails.length > 0 && (
              <div className="mt-0.5 text-xs text-slate-400">CC: {email.ccEmails.join(', ')}</div>
            )}
          </div>
        </div>

        {/* Body */}
        <div
          className="rounded-2xl p-5 text-sm text-slate-700 leading-7 whitespace-pre-wrap"
          style={{
            background: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(200,220,255,0.3)',
          }}
        >
          {email.body}
        </div>

        {/* Attachments */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-1.5">
              <Paperclip size={12} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500">{email.attachments.length} attachment(s)</span>
            </div>
            {email.attachments.map((att) => (
              <div key={att.id}
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: 'rgba(240,248,255,0.8)', border: '1px solid rgba(200,220,255,0.4)' }}>
                <Paperclip size={12} className="text-blue-400 flex-shrink-0" />
                <span className="text-xs font-medium text-slate-600 flex-1 truncate">{att.name}</span>
                <span className="text-[10px] text-slate-400">{att.size}</span>
                {att.url && (
                  <a href={att.url} download className="text-xs text-blue-500 font-semibold hover:underline">Download</a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Category badge */}
        <div className="mt-4 flex items-center gap-2">
          <Tag size={12} className="text-slate-400" />
          <span className="text-xs text-slate-400">Category:</span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
          >
            {CATEGORY_CONFIG[email.category]?.label || email.category}
          </span>
        </div>
      </div>

      {/* Quick reply bar */}
      <div
        className="px-4 py-3 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(200,220,255,0.3)' }}
      >
        <button
          onClick={() => onReply?.(email.fromEmail)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-left transition-all hover:shadow-md"
          style={{
            background: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(200,220,255,0.4)',
          }}
        >
          <Reply size={14} className="text-slate-400 flex-shrink-0" />
          <span className="text-sm text-slate-400 flex-1">Quick reply to {email.from}...</span>
          <span
            className="px-3 py-1 rounded-xl text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
          >
            Reply
          </span>
        </button>
      </div>
    </div>
  );
}
