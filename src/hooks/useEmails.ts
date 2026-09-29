import { useState, useEffect, useCallback } from 'react';
import { Email, EmailCategory } from '@/types/email';
import { supabase, DbEmail } from '@/lib/supabase';
import { toast } from 'sonner';

function dbToEmail(row: DbEmail): Email {
  return {
    id: row.id,
    from: row.from_name,
    fromEmail: row.from_email,
    to: 'You',
    toEmail: row.to_email,
    subject: row.subject,
    preview: row.preview || row.body.substring(0, 120),
    body: row.body,
    date: new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timestamp: new Date(row.created_at).getTime(),
    isRead: row.is_read,
    isStarred: row.is_starred,
    category: row.category as EmailCategory,
    tags: row.tags || [],
    ccEmails: row.cc_emails || [],
    bccEmails: row.bcc_emails || [],
    avatar: row.avatar || undefined,
    scheduledAt: row.scheduled_at,
  };
}

export function useEmails() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<EmailCategory>('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load emails from Supabase
  const fetchEmails = useCallback(async () => {
    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load emails:', error);
      return;
    }
    setEmails((data as DbEmail[]).map(dbToEmail));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEmails();
    // Poll every 30 seconds for new emails
    const interval = setInterval(fetchEmails, 30000);
    return () => clearInterval(interval);
  }, [fetchEmails]);

  const filteredEmails = emails.filter((email) => {
    const cat = activeCategory === 'specific'
      ? email.isStarred
      : email.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.fromEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return cat && matchesSearch;
  });

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || null;

  const markAsRead = useCallback(async (id: string) => {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, isRead: true } : e)));
    await supabase.from('emails').update({ is_read: true }).eq('id', id);
  }, []);

  const markAsUnread = useCallback(async (id: string) => {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, isRead: false } : e)));
    await supabase.from('emails').update({ is_read: false }).eq('id', id);
  }, []);

  const toggleStar = useCallback(async (id: string) => {
    const email = emails.find((e) => e.id === id);
    if (!email) return;
    const newVal = !email.isStarred;
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, isStarred: newVal } : e)));
    await supabase.from('emails').update({ is_starred: newVal }).eq('id', id);
  }, [emails]);

  const moveToCategory = useCallback(async (id: string, category: EmailCategory) => {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, category } : e)));
    await supabase.from('emails').update({ category }).eq('id', id);
  }, []);

  const deleteEmail = useCallback(async (id: string) => {
    setEmails((prev) => prev.filter((e) => e.id !== id));
    setSelectedEmailId(null);
    await supabase.from('emails').delete().eq('id', id);
  }, []);

  const addEmail = useCallback(async (email: Omit<Email, 'id' | 'timestamp'>) => {
    const { data, error } = await supabase
      .from('emails')
      .insert([{
        from_name: email.from,
        from_email: email.fromEmail,
        to_email: email.toEmail,
        subject: email.subject,
        body: email.body,
        category: email.category,
        is_read: email.isRead,
        is_starred: email.isStarred,
        tags: email.tags || [],
        cc_emails: email.ccEmails || [],
        bcc_emails: email.bccEmails || [],
        scheduled_at: email.scheduledAt || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Failed to send email:', error);
      toast.error('Failed to send email');
      return;
    }
    if (data) {
      setEmails((prev) => [dbToEmail(data as DbEmail), ...prev]);
    }
  }, []);

  const selectEmail = useCallback((id: string) => {
    setSelectedEmailId(id);
    markAsRead(id);
  }, [markAsRead]);

  const getCategoryCount = useCallback((category: EmailCategory) => {
    if (category === 'specific') return emails.filter((e) => e.isStarred).length;
    return emails.filter((e) => e.category === category).length;
  }, [emails]);

  const getUnreadCount = useCallback((category: EmailCategory) => {
    if (category === 'specific') return emails.filter((e) => e.isStarred && !e.isRead).length;
    return emails.filter((e) => e.category === category && !e.isRead).length;
  }, [emails]);

  return {
    emails,
    filteredEmails,
    selectedEmail,
    selectedEmailId,
    activeCategory,
    searchQuery,
    loading,
    setActiveCategory,
    setSelectedEmailId,
    setSearchQuery,
    selectEmail,
    markAsRead,
    markAsUnread,
    toggleStar,
    moveToCategory,
    deleteEmail,
    addEmail,
    getCategoryCount,
    getUnreadCount,
    refetch: fetchEmails,
  };
}
