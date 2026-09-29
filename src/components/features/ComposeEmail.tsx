import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, Send, Paperclip, Minimize2, Maximize2,
  Bold, Italic, Underline, List, AlignLeft,
  Clock, ChevronDown, ChevronUp, AtSign, Trash2,
  Image as ImageIcon, Link
} from 'lucide-react';
import { Email, EmailCategory } from '@/types/email';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ComposeEmailProps {
  onClose: () => void;
  onSend: (email: Omit<Email, 'id' | 'timestamp'>) => void;
  initialTo?: string;
  draftId?: string;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
}

const AUTO_SAVE_DELAY = 5000; // 5 seconds

export default function ComposeEmail({ onClose, onSend, initialTo = '', draftId }: ComposeEmailProps) {
  const [to, setTo] = useState(initialTo);
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(draftId);
  const [sending, setSending] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>();

  // Auto-save draft
  const saveDraft = useCallback(async () => {
    if (!to && !subject && !body) return;
    setSavingDraft(true);
    const payload = {
      to_email: to,
      subject,
      body,
      cc_emails: cc ? cc.split(',').map((e) => e.trim()) : [],
      bcc_emails: bcc ? bcc.split(',').map((e) => e.trim()) : [],
      scheduled_at: scheduledAt || null,
      updated_at: new Date().toISOString(),
    };

    if (currentDraftId) {
      await supabase.from('drafts').update(payload).eq('id', currentDraftId);
    } else {
      const { data } = await supabase.from('drafts').insert([payload]).select().single();
      if (data) setCurrentDraftId(data.id);
    }
    setSavingDraft(false);
  }, [to, subject, body, cc, bcc, scheduledAt, currentDraftId]);

  // Trigger auto-save on content change
  useEffect(() => {
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(saveDraft, AUTO_SAVE_DELAY);
    return () => clearTimeout(autoSaveTimer.current);
  }, [to, subject, body, cc, bcc, saveDraft]);

  const execFormat = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    bodyRef.current?.focus();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    for (const file of files) {
      const path = `drafts/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { data, error } = await supabase.storage
        .from('email-attachments')
        .upload(path, file);

      if (error) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const { data: urlData } = supabase.storage.from('email-attachments').getPublicUrl(path);
      setAttachments((prev) => [...prev, {
        name: file.name,
        size: file.size,
        type: file.type,
        url: urlData.publicUrl,
        path,
      }]);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = async (path: string) => {
    await supabase.storage.from('email-attachments').remove([path]);
    setAttachments((prev) => prev.filter((a) => a.path !== path));
  };

  const handleSend = async () => {
    if (!to.trim()) { toast.error('Please enter a recipient'); return; }
    if (!subject.trim()) { toast.error('Please enter a subject'); return; }
    const bodyText = bodyRef.current?.innerText || body;
    if (!bodyText.trim()) { toast.error('Please write a message'); return; }

    setSending(true);

    // Delete draft if exists
    if (currentDraftId) {
      await supabase.from('drafts').delete().eq('id', currentDraftId);
    }

    await onSend({
      from: 'You',
      fromEmail: 'admin@iqmail.com',
      to,
      toEmail: to,
      subject,
      preview: bodyText.substring(0, 120),
      body: bodyText,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isRead: true,
      isStarred: false,
      category: scheduledAt ? ('stored' as EmailCategory) : ('outbox' as EmailCategory),
      tags: scheduledAt ? ['scheduled'] : ['sent'],
      ccEmails: cc ? cc.split(',').map((e) => e.trim()) : [],
      bccEmails: bcc ? bcc.split(',').map((e) => e.trim()) : [],
      scheduledAt: scheduledAt || null,
    });

    toast.success(scheduledAt ? `Scheduled for ${new Date(scheduledAt).toLocaleString()}` : 'Message sent!');
    setSending(false);
    onClose();
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (minimized) {
    return (
      <div
        className="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(200,220,255,0.6)',
          boxShadow: '0 8px 32px rgba(100,160,255,0.25)',
        }}
        onClick={() => setMinimized(false)}
      >
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        <span className="text-sm font-semibold text-slate-700 max-w-[160px] truncate">
          {subject || 'New Message'}
        </span>
        {savingDraft && <span className="text-[10px] text-slate-400">Saving...</span>}
        <Maximize2 size={14} className="text-slate-400" />
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-0.5 hover:text-red-400">
          <X size={14} className="text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-0 right-2 sm:right-4 z-50 w-full sm:max-w-lg rounded-t-3xl overflow-hidden flex flex-col"
      style={{
        maxHeight: '90vh',
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(200,220,255,0.7)',
        borderBottom: 'none',
        boxShadow: '0 -8px 48px rgba(100,160,255,0.25)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0 cursor-default"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.12))',
          borderBottom: '1px solid rgba(200,220,255,0.4)',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-sm font-bold text-slate-700">New Message</span>
          {savingDraft && (
            <span className="text-[10px] text-emerald-500 font-medium">● Draft saved</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setMinimized(true)} className="p-1.5 rounded-lg hover:bg-white/60 transition-all" title="Minimize">
            <Minimize2 size={14} className="text-slate-400" />
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-red-50 transition-all" title="Close">
            <X size={14} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-3 space-y-0">
          {/* To */}
          <div className="flex items-center gap-2 pb-2.5" style={{ borderBottom: '1px solid rgba(200,220,255,0.3)' }}>
            <span className="text-xs font-bold text-slate-400 w-8 flex-shrink-0">To</span>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-300 outline-none py-0.5"
            />
            <button
              onClick={() => setShowCcBcc(!showCcBcc)}
              className="text-xs text-blue-500 font-semibold px-2 py-1 rounded-lg hover:bg-blue-50 flex-shrink-0"
            >
              {showCcBcc ? 'Hide' : 'CC/BCC'}
            </button>
          </div>

          {/* CC/BCC */}
          {showCcBcc && (
            <>
              <div className="flex items-center gap-2 py-2.5" style={{ borderBottom: '1px solid rgba(200,220,255,0.3)' }}>
                <span className="text-xs font-bold text-slate-400 w-8 flex-shrink-0">CC</span>
                <input
                  type="text"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="cc@example.com, another@example.com"
                  className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-300 outline-none"
                />
              </div>
              <div className="flex items-center gap-2 py-2.5" style={{ borderBottom: '1px solid rgba(200,220,255,0.3)' }}>
                <span className="text-xs font-bold text-slate-400 w-8 flex-shrink-0">BCC</span>
                <input
                  type="text"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  placeholder="bcc@example.com"
                  className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-300 outline-none"
                />
              </div>
            </>
          )}

          {/* Subject */}
          <div className="flex items-center gap-2 py-2.5" style={{ borderBottom: '1px solid rgba(200,220,255,0.3)' }}>
            <span className="text-xs font-bold text-slate-400 w-8 flex-shrink-0">Re</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject..."
              className="flex-1 bg-transparent text-sm font-medium text-slate-700 placeholder-slate-300 outline-none"
            />
          </div>
        </div>

        {/* Rich text toolbar */}
        <div
          className="flex items-center gap-1 px-4 py-2 flex-wrap"
          style={{ borderBottom: '1px solid rgba(200,220,255,0.25)', background: 'rgba(248,250,255,0.8)' }}
        >
          {[
            { icon: Bold, cmd: 'bold', title: 'Bold' },
            { icon: Italic, cmd: 'italic', title: 'Italic' },
            { icon: Underline, cmd: 'underline', title: 'Underline' },
          ].map(({ icon: Icon, cmd, title }) => (
            <button
              key={cmd}
              onMouseDown={(e) => { e.preventDefault(); execFormat(cmd); }}
              className="p-1.5 rounded-lg hover:bg-white/80 transition-all"
              title={title}
            >
              <Icon size={13} className="text-slate-500" />
            </button>
          ))}
          <div className="w-px h-4 bg-slate-200 mx-0.5" />
          <button
            onMouseDown={(e) => { e.preventDefault(); execFormat('insertUnorderedList'); }}
            className="p-1.5 rounded-lg hover:bg-white/80 transition-all"
            title="Bullet list"
          >
            <List size={13} className="text-slate-500" />
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); execFormat('justifyLeft'); }}
            className="p-1.5 rounded-lg hover:bg-white/80 transition-all"
            title="Align left"
          >
            <AlignLeft size={13} className="text-slate-500" />
          </button>
          <div className="w-px h-4 bg-slate-200 mx-0.5" />
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              const url = prompt('Enter link URL:');
              if (url) execFormat('createLink', url);
            }}
            className="p-1.5 rounded-lg hover:bg-white/80 transition-all"
            title="Insert link"
          >
            <Link size={13} className="text-slate-500" />
          </button>
          <button
            onClick={() => setScheduling(!scheduling)}
            className="p-1.5 rounded-lg hover:bg-amber-50 transition-all ml-auto"
            title="Schedule send"
          >
            <Clock size={13} className={scheduling ? 'text-amber-500' : 'text-slate-400'} />
          </button>
        </div>

        {/* Schedule picker */}
        {scheduling && (
          <div className="px-4 py-2.5 flex items-center gap-3"
            style={{ background: 'rgba(255,243,200,0.4)', borderBottom: '1px solid rgba(255,200,50,0.3)' }}>
            <Clock size={14} className="text-amber-500 flex-shrink-0" />
            <span className="text-xs font-semibold text-amber-700">Schedule for:</span>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="flex-1 bg-transparent text-xs text-amber-700 outline-none"
              min={new Date().toISOString().slice(0, 16)}
            />
            {scheduledAt && (
              <button onClick={() => setScheduledAt('')} className="text-amber-400 hover:text-amber-600">
                <X size={13} />
              </button>
            )}
          </div>
        )}

        {/* Body — contenteditable rich text */}
        <div
          ref={bodyRef}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setBody((e.target as HTMLDivElement).innerHTML)}
          data-placeholder="Write your message..."
          className="min-h-[160px] px-4 py-3 text-sm text-slate-700 leading-7 outline-none compose-body"
          style={{ minHeight: '160px' }}
        />

        {/* Attachments list */}
        {attachments.length > 0 && (
          <div className="px-4 py-2 space-y-1.5" style={{ borderTop: '1px solid rgba(200,220,255,0.3)' }}>
            {attachments.map((file) => (
              <div key={file.path}
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: 'rgba(240,248,255,0.8)', border: '1px solid rgba(200,220,255,0.4)' }}>
                <Paperclip size={12} className="text-blue-400 flex-shrink-0" />
                <span className="text-xs text-slate-600 font-medium flex-1 truncate">{file.name}</span>
                <span className="text-[10px] text-slate-400">{formatBytes(file.size)}</span>
                <button onClick={() => removeAttachment(file.path)} className="text-slate-300 hover:text-red-400">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div
        className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(200,220,255,0.3)', background: 'rgba(248,250,255,0.9)' }}
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-xl hover:bg-white/70 transition-all"
          title="Attach file"
          disabled={uploading}
        >
          <Paperclip size={16} className={uploading ? 'text-blue-400 animate-pulse' : 'text-slate-400'} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
        />

        <button
          onClick={() => setScheduling(!scheduling)}
          className={`p-2 rounded-xl transition-all ${scheduling ? 'bg-amber-50' : 'hover:bg-white/70'}`}
          title="Schedule"
        >
          <Clock size={16} className={scheduling ? 'text-amber-500' : 'text-slate-400'} />
        </button>

        <button
          onClick={saveDraft}
          className="p-2 rounded-xl hover:bg-white/70 transition-all text-xs font-medium text-slate-500"
          title="Save draft"
        >
          Save
        </button>

        <div className="flex-1" />

        <button
          onClick={handleSend}
          disabled={sending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white transition-all hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}
        >
          <Send size={14} />
          {scheduledAt ? 'Schedule' : 'Send'}
        </button>
      </div>
    </div>
  );
}
