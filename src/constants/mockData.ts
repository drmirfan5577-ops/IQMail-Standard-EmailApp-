import { LiveFeedItem, AdminSettings } from '@/types/email';

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  authEnabled: false,
  pushNotificationsEnabled: true,
  autoCategorizationEnabled: true,
  liveUpdatesEnabled: true,
  maxEmailsPerPage: 20,
  adminPassword: '@1122#',
};

export const LIVE_FEED_ITEMS: LiveFeedItem[] = [
  { id: '1', message: 'New email from sarah.johnson@esonworld.com', time: 'Just now', type: 'incoming' },
  { id: '2', message: 'Message delivered to 847 recipients', time: '2m ago', type: 'sent' },
  { id: '3', message: 'System sync complete — all folders updated', time: '5m ago', type: 'system' },
  { id: '4', message: 'Push notification sent to mobile devices', time: '8m ago', type: 'alert' },
  { id: '5', message: 'New email from ahmed@globalfamily.net', time: '12m ago', type: 'incoming' },
  { id: '6', message: 'Gallery updated with 47 new photos', time: '18m ago', type: 'system' },
  { id: '7', message: 'Monthly report generated and stored', time: '1h ago', type: 'system' },
];

export const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: string; description: string }> = {
  inbox:     { label: 'I_Box',      color: 'from-blue-400 to-cyan-400',      icon: 'Inbox',         description: 'Incoming messages' },
  outbox:    { label: 'O_Box',      color: 'from-violet-400 to-purple-400',  icon: 'Send',          description: 'Outgoing messages' },
  delivered: { label: 'Delivered',  color: 'from-emerald-400 to-teal-400',   icon: 'CheckCircle',   description: 'Successfully delivered' },
  betrayed:  { label: 'Betrayed',   color: 'from-red-400 to-rose-400',       icon: 'AlertTriangle', description: 'Failed / undelivered' },
  stored:    { label: 'Store',      color: 'from-amber-400 to-orange-400',   icon: 'Archive',       description: 'Archived messages' },
  specific:  { label: 'Specific',   color: 'from-pink-400 to-fuchsia-400',   icon: 'Star',          description: 'Starred & important' },
  gallery:   { label: 'Gallery',    color: 'from-cyan-400 to-blue-400',      icon: 'Image',         description: 'Media & attachments' },
};
