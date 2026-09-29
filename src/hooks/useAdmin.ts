import { useState, useEffect } from 'react';
import { AdminSettings } from '@/types/email';
import { DEFAULT_ADMIN_SETTINGS } from '@/constants/mockData';

const ADMIN_STORAGE_KEY = 'iqmail_admin_settings';
const ADMIN_SESSION_KEY = 'iqmail_admin_session';

export function useAdmin() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });

  const [settings, setSettings] = useState<AdminSettings>(() => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : DEFAULT_ADMIN_SETTINGS;
      // Always use latest default password if stored has old default
      if (parsed.adminPassword === 'iqmail2026') parsed.adminPassword = '@1122#';
      return parsed;
    } catch {
      return DEFAULT_ADMIN_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const adminLogin = (password: string): boolean => {
    if (password === settings.adminPassword) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  };

  const updateSettings = (updates: Partial<AdminSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const changeAdminPassword = (currentPassword: string, newPassword: string): boolean => {
    if (currentPassword === settings.adminPassword) {
      updateSettings({ adminPassword: newPassword });
      return true;
    }
    return false;
  };

  return {
    isAdminLoggedIn,
    settings,
    adminLogin,
    adminLogout,
    updateSettings,
    changeAdminPassword,
  };
}
