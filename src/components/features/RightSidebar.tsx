import { useState, useRef, useEffect } from 'react';
import {
  X, Star, Mail, Clock, Search, UserPlus, ChevronRight,
  MessageCircle, Phone, Globe, History
} from 'lucide-react';
import { Contact } from '@/types/email';
import { useContacts } from '@/hooks/useContacts';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onComposeTo?: (email: string) => void;
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
}

const GRADIENTS = [
  'from-blue-400 to-cyan-400',
  'from-violet-400 to-purple-400',
  'from-emerald-400 to-teal-400',
  'from-pink-400 to-rose-400',
  'from-amber-400 to-orange-400',
  'from-cyan-400 to-blue-400',
  'from-fuchsia-400 to-pink-400',
];

const EMAIL_HISTORY = [
  { email: 'sarah.johnson@esonworld.com', name: 'Sarah Johnson', count: 28, lastDate: 'Today' },
  { email: 'ahmed@globalfamily.net', name: 'Dr. Ahmed Al-Rashid', count: 19, lastDate: 'Yesterday' },
  { email: 'j.okonkwo@africanchapter.org', name: 'James Okonkwo', count: 14, lastDate: 'Sep 25' },
  { email: 'priya.sharma@asiafamily.in', name: 'Priya Sharma', count: 11, lastDate: 'Sep 24' },
  { email: 'maria.g@familyconnect.org', name: 'Maria Gonzalez', count: 8, lastDate: 'Sep 23' },
  { email: 'chen.wei@asiapacific.esonworld.com', name: 'Chen Wei', count: 6, lastDate: 'Sep 22' },
];

type Tab = 'contacts' | 'history';

export default function RightSidebar({ isOpen, onClose, onComposeTo }: RightSidebarProps) {
  const { contacts, loading, toggleFavorite } = useContacts();
  const [tab, setTab] = useState<Tab>('contacts');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const filteredContacts = contacts.filter((c) =>
    searchQuery === '' ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteContacts = filteredContacts.filter((c) => c.isFavorite);
  const otherContacts = filteredContacts.filter((c) => !c.isFavorite);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: 'rgba(15,30,60,0.2)',
          backdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300 ease-out"
        style={{
          width: '300px',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          background: 'rgba(255,255,255,0.93)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderLeft: '1px solid rgba(200,220,255,0.5)',
          boxShadow: '-8px 0 40px rgba(100,160,255,0.18)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-4 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))',
            borderBottom: '1px solid rgba(200,220,255,0.4)',
          }}
        >
          <div>
            <div className="text-sm font-black text-slate-800">Contacts</div>
            <div className="text-[10px] text-slate-400">{contacts.length} saved · {favoriteContacts.length} favorites</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/70 transition-all">
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-3 pt-3 pb-1 gap-2 flex-shrink-0">
          {(['contacts', 'history'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-2xl text-xs font-bold transition-all capitalize"
              style={tab === t ? {
                background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
                color: '#4f46e5',
                border: '1.5px solid rgba(99,102,241,0.3)',
              } : {
                color: '#94a3b8',
                border: '1.5px solid transparent',
              }}
            >
              {t === 'contacts' ? 'Contacts' : 'History'}
            </button>
          ))}
        </div>

        {/* Search */}
        {tab === 'contacts' && (
          <div className="px-3 py-2 flex-shrink-0">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-2xl"
              style={{ background: 'rgba(241,245,249,0.9)', border: '1px solid rgba(200,220,255,0.4)' }}
            >
              <Search size={13} className="text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="flex-1 bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <X size={12} className="text-slate-300" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {tab === 'contacts' ? (
            loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-1">
                {/* Favorites */}
                {favoriteContacts.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center gap-1.5 px-2 py-2">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Favorites</span>
                    </div>
                    {favoriteContacts.map((contact, idx) => (
                      <ContactCard
                        key={contact.id}
                        contact={contact}
                        gradient={GRADIENTS[idx % GRADIENTS.length]}
                        onToggleFavorite={toggleFavorite}
                        onCompose={onComposeTo}
                      />
                    ))}
                  </div>
                )}

                {/* All contacts */}
                {otherContacts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 px-2 py-2">
                      <Globe size={11} className="text-blue-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">All Contacts</span>
                    </div>
                    {otherContacts.map((contact, idx) => (
                      <ContactCard
                        key={contact.id}
                        contact={contact}
                        gradient={GRADIENTS[(idx + favoriteContacts.length) % GRADIENTS.length]}
                        onToggleFavorite={toggleFavorite}
                        onCompose={onComposeTo}
                      />
                    ))}
                  </div>
                )}

                {filteredContacts.length === 0 && (
                  <div className="text-center py-10">
                    <div className="text-3xl mb-2">📭</div>
                    <div className="text-sm font-medium text-slate-500">No contacts found</div>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-1.5 px-2 py-2">
                <History size={11} className="text-violet-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Activity</span>
              </div>
              {EMAIL_HISTORY.map((item, idx) => (
                <button
                  key={item.email}
                  onClick={() => onComposeTo?.(item.email)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left hover:bg-white/60 transition-all group"
                >
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {getInitials(item.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-700 truncate">{item.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{item.email}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] font-bold text-blue-500">{item.count}</div>
                    <div className="text-[9px] text-slate-400">{item.lastDate}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Signed-in info */}
        <div
          className="px-4 py-3 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(200,220,255,0.3)', background: 'rgba(248,250,255,0.8)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            >
              IQ
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-700 truncate">admin@iqmail.com</div>
              <div className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Signed in
              </div>
            </div>
            <Mail size={14} className="text-slate-300" />
          </div>
        </div>
      </div>
    </>
  );
}

function ContactCard({
  contact,
  gradient,
  onToggleFavorite,
  onCompose,
}: {
  contact: Contact;
  gradient: string;
  onToggleFavorite: (id: string) => void;
  onCompose?: (email: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/60 transition-all group">
      {contact.avatar ? (
        <img src={contact.avatar} alt={contact.name}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-white/70" />
      ) : (
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-2 ring-white/70`}>
          {getInitials(contact.name)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-slate-700 truncate">{contact.name}</div>
        <div className="text-[10px] text-slate-400 truncate">{contact.email}</div>
        {contact.lastContacted && (
          <div className="flex items-center gap-1 mt-0.5">
            <Clock size={9} className="text-slate-300" />
            <span className="text-[9px] text-slate-300">
              {new Date(contact.lastContacted).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onToggleFavorite(contact.id)}
          className="p-1 rounded-lg hover:bg-amber-50"
        >
          <Star size={11} className={contact.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
        </button>
        <button
          onClick={() => onCompose?.(contact.email)}
          className="p-1 rounded-lg hover:bg-blue-50"
        >
          <Mail size={11} className="text-blue-400" />
        </button>
      </div>
    </div>
  );
}
