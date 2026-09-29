export type EmailCategory = 'inbox' | 'outbox' | 'stored' | 'betrayed' | 'delivered' | 'gallery' | 'specific';

export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  to: string;
  toEmail: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  timestamp: number;
  isRead: boolean;
  isStarred: boolean;
  category: EmailCategory;
  attachments?: Attachment[];
  avatar?: string;
  tags?: string[];
  ccEmails?: string[];
  bccEmails?: string[];
  scheduledAt?: string | null;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'document' | 'video' | 'audio' | 'other';
  url?: string;
  storagePath?: string;
}

export interface Draft {
  id: string;
  toEmail: string;
  subject: string;
  body: string;
  ccEmails: string[];
  bccEmails: string[];
  scheduledAt?: string | null;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  isFavorite: boolean;
  lastContacted?: string | null;
}

export interface AdminSettings {
  authEnabled: boolean;
  pushNotificationsEnabled: boolean;
  autoCategorizationEnabled: boolean;
  liveUpdatesEnabled: boolean;
  maxEmailsPerPage: number;
  adminPassword: string;
}

export interface LiveFeedItem {
  id: string;
  message: string;
  time: string;
  type: 'incoming' | 'sent' | 'system' | 'alert';
}
