import { useEffect, useState } from 'react';
import { Activity, X } from 'lucide-react';
import { LiveFeedItem } from '@/types/email';
import { LIVE_FEED_ITEMS } from '@/constants/mockData';

export default function LiveFeed() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<LiveFeedItem[]>(LIVE_FEED_ITEMS);
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((prev) => prev + 1);
      // Simulate new live items occasionally
      if (Math.random() > 0.7) {
        const newMessages = [
          'New connection from Mumbai Chapter',
          'Email batch processed: 23 messages',
          'Real-time sync complete',
          'New member joined from Tokyo',
          'Gallery upload completed: 12 photos',
        ];
        const msg = newMessages[Math.floor(Math.random() * newMessages.length)];
        setItems((prev) => [
          { id: Date.now().toString(), message: msg, time: 'Just now', type: 'incoming' as const },
          ...prev.slice(0, 9),
        ]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const typeColors: Record<string, string> = {
    incoming: 'bg-blue-400',
    sent: 'bg-emerald-400',
    system: 'bg-violet-400',
    alert: 'bg-amber-400',
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all hover:scale-105"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(200,220,255,0.6)',
          boxShadow: '0 4px 20px rgba(100,160,255,0.2)',
        }}
      >
        <div className="relative">
          <Activity size={16} className="text-blue-500" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        </div>
        <span className="text-xs font-bold text-slate-600">Live Feed</span>
      </button>

      {/* Feed panel */}
      {isOpen && (
        <div
          className="fixed bottom-16 left-4 z-50 w-72 max-h-80 rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(200,220,255,0.6)',
            boxShadow: '0 8px 32px rgba(100,160,255,0.2)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
              borderBottom: '1px solid rgba(200,220,255,0.3)',
            }}
          >
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-blue-500" />
              <span className="text-xs font-bold text-slate-700">Live Activity Feed</span>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-white/50">
              <X size={14} className="text-slate-400" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-2">
            {items.map((item, i) => (
              <div
                key={item.id}
                className="flex gap-2 py-2 px-2 rounded-xl hover:bg-white/50 transition-colors"
                style={{ opacity: 1 - i * 0.08 }}
              >
                <div className={`w-2 h-2 rounded-full ${typeColors[item.type]} flex-shrink-0 mt-1.5`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-700 leading-relaxed">{item.message}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
