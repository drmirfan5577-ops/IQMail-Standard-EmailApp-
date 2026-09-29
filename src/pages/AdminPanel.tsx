import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, LogOut, Settings, Bell, Lock, Users, ToggleLeft, ToggleRight,
  ArrowLeft, Eye, EyeOff, Activity, Database, Globe, ChevronRight,
  AlertCircle, CheckCircle2, Wifi
} from 'lucide-react';
import AnimatedBackground from '@/components/features/AnimatedBackground';
import { useAdmin } from '@/hooks/useAdmin';
import { toast } from 'sonner';

type AdminTab = 'dashboard' | 'settings' | 'security' | 'users' | 'system';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { isAdminLoggedIn, settings, adminLogin, adminLogout, updateSettings, changeAdminPassword } = useAdmin();

  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);

  const handleLogin = () => {
    if (adminLogin(loginPassword)) {
      toast.success('Admin access granted');
      setLoginError('');
    } else {
      setLoginError('Invalid password. Please try again.');
    }
  };

  const handleLogout = () => {
    adminLogout();
    toast.info('Admin session ended');
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in both password fields');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (changeAdminPassword(currentPassword, newPassword)) {
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
    } else {
      toast.error('Current password is incorrect');
    }
  };

  const glassCard = {
    background: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.7)',
    boxShadow: '0 4px 24px rgba(100,160,255,0.1)',
  };

  // Login screen
  if (!isAdminLoggedIn) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <AnimatedBackground />
        <div className="relative z-10 w-full max-w-sm mx-4">
          <div className="rounded-3xl p-8" style={glassCard}>
            {/* Back */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-6 transition-colors"
            >
              <ArrowLeft size={14} /> Back to IQMail
            </button>

            {/* Logo */}
            <div className="text-center mb-8">
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}
              >
                <Shield size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-slate-800 mb-1">Admin Panel</h1>
              <p className="text-sm text-slate-400">IQMAIL · ESOneWorld</p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Admin Password</label>
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    border: `1.5px solid ${loginError ? 'rgba(239,68,68,0.4)' : 'rgba(200,220,255,0.5)'}`,
                  }}
                >
                  <Lock size={15} className="text-slate-400 flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="Enter admin password"
                    className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-300 outline-none"
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className="text-slate-300 hover:text-slate-500">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {loginError && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <AlertCircle size={12} className="text-red-400" />
                    <span className="text-xs text-red-500">{loginError}</span>
                  </div>
                )}
                <p className="text-[10px] text-slate-400 mt-1.5">Default password: @1122#</p>
              </div>

              <button
                onClick={handleLogin}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:shadow-xl hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
              >
                Access Admin Panel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const TABS: { id: AdminTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'system', label: 'System', icon: Database },
  ];

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col h-full">
        {/* Admin Header */}
        <header
          className="flex items-center gap-3 px-4 py-3"
          style={{
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 4px 24px rgba(100,160,255,0.1)',
          }}
        >
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl hover:bg-white/50 transition-all"
          >
            <ArrowLeft size={16} className="text-slate-500" />
          </button>

          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            >
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <div className="font-black text-sm text-slate-800">IQMAIL Admin</div>
              <div className="text-[10px] text-slate-400">ESOneWorld Control Center</div>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600">Admin Active</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-all"
              style={{ border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </header>

        {/* Tab navigation */}
        <div
          className="flex items-center gap-1 px-4 py-2 overflow-x-auto"
          style={{
            background: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(200,220,255,0.3)',
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
                  border: '1px solid rgba(99,102,241,0.3)',
                  color: '#4f46e5',
                } : {
                  color: '#94a3b8',
                  border: '1px solid transparent',
                }}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'dashboard' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <h2 className="text-lg font-black text-slate-800">Overview Dashboard</h2>

              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'Total Emails', value: '847', icon: '📧', color: 'from-blue-400 to-cyan-400' },
                  { label: 'Active Members', value: '2,412', icon: '👥', color: 'from-violet-400 to-purple-400' },
                  { label: 'Delivered Today', value: '321', icon: '✅', color: 'from-emerald-400 to-teal-400' },
                  { label: 'Countries', value: '90+', icon: '🌍', color: 'from-pink-400 to-fuchsia-400' },
                ].map((stat, i) => (
                  <div key={i} className="rounded-2xl p-4" style={glassCard}>
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-black text-slate-800">{stat.value}</div>
                    <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                    <div className={`mt-2 h-1 rounded-full bg-gradient-to-r ${stat.color}`} />
                  </div>
                ))}
              </div>

              {/* System status */}
              <div className="rounded-2xl p-5" style={glassCard}>
                <h3 className="text-sm font-bold text-slate-700 mb-4">System Status</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Email Server', status: 'Online', ok: true },
                    { name: 'Database', status: 'Connected', ok: true },
                    { name: 'Push Notifications', status: settings.pushNotificationsEnabled ? 'Active' : 'Disabled', ok: settings.pushNotificationsEnabled },
                    { name: 'Live Updates', status: settings.liveUpdatesEnabled ? 'Active' : 'Disabled', ok: settings.liveUpdatesEnabled },
                    { name: 'Authentication', status: settings.authEnabled ? 'Enabled' : 'Disabled', ok: settings.authEnabled },
                    { name: 'OnSpace Cloud', status: 'Connected ✓', ok: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2"
                      style={{ borderBottom: i < 5 ? '1px solid rgba(200,220,255,0.3)' : undefined }}>
                      <div className="flex items-center gap-2">
                        <Wifi size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-600 font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${item.ok ? 'bg-emerald-400' : 'bg-amber-400'} ${item.ok ? 'animate-pulse' : ''}`} />
                        <span className={`text-xs font-semibold ${item.ok ? 'text-emerald-600' : 'text-amber-600'}`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-lg font-black text-slate-800">Feature Settings</h2>
              <div className="rounded-2xl overflow-hidden" style={glassCard}>
                {[
                  {
                    label: 'Authentication System',
                    desc: 'Enable/disable user authentication for IQMail',
                    key: 'authEnabled' as const,
                    icon: Lock,
                  },
                  {
                    label: 'Push Notifications',
                    desc: 'Send real-time push notifications to users',
                    key: 'pushNotificationsEnabled' as const,
                    icon: Bell,
                  },
                  {
                    label: 'Auto-Categorization',
                    desc: 'Automatically categorize incoming emails',
                    key: 'autoCategorizationEnabled' as const,
                    icon: Settings,
                  },
                  {
                    label: 'Live Updates',
                    desc: 'Real-time email feed and activity monitoring',
                    key: 'liveUpdatesEnabled' as const,
                    icon: Activity,
                  },
                ].map((item, i, arr) => {
                  const Icon = item.icon;
                  const enabled = settings[item.key] as boolean;
                  return (
                    <div
                      key={item.key}
                      className="flex items-center gap-4 p-4"
                      style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(200,220,255,0.3)' : undefined }}
                    >
                      <div className="p-2 rounded-xl"
                        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <Icon size={16} className="text-violet-500" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-700">{item.label}</div>
                        <div className="text-xs text-slate-400">{item.desc}</div>
                      </div>
                      <button
                        onClick={() => {
                          updateSettings({ [item.key]: !enabled });
                          toast.success(`${item.label} ${!enabled ? 'enabled' : 'disabled'}`);
                        }}
                        className="transition-all hover:scale-110"
                      >
                        {enabled
                          ? <ToggleRight size={28} className="text-blue-500" />
                          : <ToggleLeft size={28} className="text-slate-300" />}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Max emails per page */}
              <div className="rounded-2xl p-5" style={glassCard}>
                <div className="text-sm font-bold text-slate-700 mb-3">Emails Per Page</div>
                <div className="flex gap-2 flex-wrap">
                  {[10, 20, 50, 100].map((num) => (
                    <button
                      key={num}
                      onClick={() => updateSettings({ maxEmailsPerPage: num })}
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                      style={settings.maxEmailsPerPage === num ? {
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                      } : {
                        background: 'rgba(255,255,255,0.7)',
                        border: '1px solid rgba(200,220,255,0.5)',
                        color: '#64748b',
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-lg font-black text-slate-800">Security & Access</h2>

              {/* Change password */}
              <div className="rounded-2xl p-5" style={glassCard}>
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Lock size={16} className="text-violet-500" /> Change Admin Password
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Current Password</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(200,220,255,0.5)' }}>
                      <Lock size={13} className="text-slate-400" />
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current password"
                        className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-300 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">New Password</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(200,220,255,0.5)' }}>
                      <Lock size={13} className="text-slate-400" />
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password (min 6 chars)"
                        className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-300 outline-none"
                      />
                      <button onClick={() => setShowNewPw(!showNewPw)} className="text-slate-300 hover:text-slate-500">
                        {showNewPw ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleChangePassword}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-lg hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                  >
                    Update Password
                  </button>
                </div>
              </div>

              {/* Auth enable/disable */}
              <div className="rounded-2xl p-5" style={glassCard}>
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Shield size={16} className="text-violet-500" /> Authentication Control
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">User Authentication</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {settings.authEnabled
                        ? 'Users must log in to access IQMail'
                        : 'IQMail is accessible without login (current)'}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      updateSettings({ authEnabled: !settings.authEnabled });
                      toast.success(`Authentication ${!settings.authEnabled ? 'enabled' : 'disabled'}`);
                    }}
                  >
                    {settings.authEnabled
                      ? <ToggleRight size={32} className="text-blue-500" />
                      : <ToggleLeft size={32} className="text-slate-300" />}
                  </button>
                </div>
                <div className="mt-3 p-3 rounded-xl text-xs"
                  style={{ background: 'rgba(255,220,100,0.1)', border: '1px solid rgba(255,200,50,0.3)' }}>
                  <span className="font-semibold text-amber-700">Note:</span>
                  <span className="text-amber-600"> Authentication is currently disabled as per initial setup. Enable via Admin Panel only.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="max-w-3xl mx-auto space-y-4">
              <h2 className="text-lg font-black text-slate-800">User Management</h2>
              <div className="rounded-2xl p-5" style={glassCard}>
                <div className="text-center py-8">
                  <Users size={40} className="text-slate-300 mx-auto mb-3" />
                  <div className="text-base font-bold text-slate-600">Supabase Integration Required</div>
                  <div className="text-sm text-slate-400 mt-1">Connect Supabase to manage real users</div>
                  <div className="mt-4 p-3 rounded-xl text-xs"
                    style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <div className="font-semibold text-violet-700 mb-1">Supabase Ready</div>
                    <div className="text-slate-500">This dashboard is pre-configured for Supabase integration. Add your API keys to connect the database and manage real user accounts, roles, and authentication.</div>
                  </div>
                </div>
              </div>

              {/* Mock users */}
              <div className="rounded-2xl overflow-hidden" style={glassCard}>
                <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(200,220,255,0.3)' }}>
                  <span className="text-sm font-bold text-slate-700">Sample Members (Mock)</span>
                </div>
                {[
                  { name: 'Sarah Johnson', email: 'sarah@esonworld.com', role: 'Admin', status: 'Active' },
                  { name: 'Dr. Ahmed Al-Rashid', email: 'ahmed@globalfamily.net', role: 'Member', status: 'Active' },
                  { name: 'James Okonkwo', email: 'j.okonkwo@africanchapter.org', role: 'Coordinator', status: 'Active' },
                ].map((user, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3"
                    style={{ borderBottom: i < 2 ? '1px solid rgba(200,220,255,0.2)' : undefined }}>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center text-white text-xs font-bold">
                      {user.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-700">{user.name}</div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </div>
                    <span className="text-xs font-medium text-violet-600 px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                      {user.role}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-lg font-black text-slate-800">System Information</h2>
              <div className="rounded-2xl p-5" style={glassCard}>
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Database size={16} className="text-blue-500" /> Infrastructure
                </h3>
                <div className="space-y-2">
                  {[
                    { key: 'Platform', value: 'OnSpace Cloud' },
                    { key: 'Frontend', value: 'React 18 + Vite + TypeScript' },
                    { key: 'Styling', value: 'Tailwind CSS + Glassmorphism' },
                    { key: 'Backend Ready', value: 'Supabase (not connected)' },
                    { key: 'Functions', value: 'Netlify Functions structure ready' },
                    { key: 'PWA', value: 'Enabled (manifest.json)' },
                    { key: 'Version', value: 'IQMAIL v1.0 — ESOneWorld' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between py-2"
                      style={{ borderBottom: '1px solid rgba(200,220,255,0.2)' }}>
                      <span className="text-xs font-semibold text-slate-500">{item.key}</span>
                      <span className="text-xs text-slate-700 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-5" style={glassCard}>
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Globe size={16} className="text-cyan-500" /> ESOneWorld Global Network
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Members', value: '2.4M+' },
                    { label: 'Countries', value: '90+' },
                    { label: 'Chapters', value: '340+' },
                  ].map((s, i) => (
                    <div key={i} className="text-center py-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(200,220,255,0.4)' }}>
                      <div className="text-lg font-black text-slate-800">{s.value}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
