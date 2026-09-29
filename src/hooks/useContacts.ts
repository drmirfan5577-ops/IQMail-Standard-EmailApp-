import { useState, useEffect, useCallback } from 'react';
import { Contact } from '@/types/email';
import { supabase, DbContact } from '@/lib/supabase';

function dbToContact(row: DbContact): Contact {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar,
    isFavorite: row.is_favorite,
    lastContacted: row.last_contacted,
  };
}

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('is_favorite', { ascending: false })
      .order('name');

    if (error) {
      console.error('Failed to load contacts:', error);
      return;
    }
    setContacts((data as DbContact[]).map(dbToContact));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const toggleFavorite = useCallback(async (id: string) => {
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return;
    const newVal = !contact.isFavorite;
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, isFavorite: newVal } : c)));
    await supabase.from('contacts').update({ is_favorite: newVal }).eq('id', id);
  }, [contacts]);

  const addContact = useCallback(async (name: string, email: string) => {
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email }])
      .select()
      .single();
    if (error) { console.error('Failed to add contact:', error); return; }
    if (data) setContacts((prev) => [...prev, dbToContact(data as DbContact)]);
  }, []);

  return { contacts, loading, toggleFavorite, addContact, refetch: fetchContacts };
}
