import { useState } from 'react';
import AnimatedBackground from '@/components/features/AnimatedBackground';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import EmailList from '@/components/features/EmailList';
import EmailDetail from '@/components/features/EmailDetail';
import ComposeEmail from '@/components/features/ComposeEmail';
import LiveFeed from '@/components/features/LiveFeed';
import LeftSliderSidebar from '@/components/features/LeftSliderSidebar';
import RightSidebar from '@/components/features/RightSidebar';
import { useEmails } from '@/hooks/useEmails';
import { usePWA } from '@/hooks/usePWA';
import { EmailCategory } from '@/types/email';
import { Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Index() {
  const {
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
  } = useEmails();

  const { pushEnabled, requestPushPermission, showLocalNotification } = usePWA();

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [composing, setComposing] = useState(false);
  const [composeTo, setComposeTo] = useState('');

  const totalUnread = (['inbox', 'outbox', 'stored', 'betrayed', 'delivered', 'gallery', 'specific'] as EmailCategory[])
    .reduce((sum, cat) => sum + getUnreadCount(cat), 0);

  const handleEnablePush = async () => {
    if (pushEnabled) {
      toast.success('Push notifications are active!');
      return;
    }
    const granted = await requestPushPermission();
    if (granted) {
      toast.success('Push notifications enabled!');
      showLocalNotification('IQMAIL', 'Push notifications are now active for IQMAIL.');
    } else {
      toast.error('Push notification permission denied. Please enable in browser settings.');
    }
  };

  const handleComposeTo = (email: string) => {
    setComposeTo(email);
    setComposing(true);
    setRightSidebarOpen(false);
  };

  const handleCategoryChange = (cat: EmailCategory) => {
    setActiveCategory(cat);
    setSelectedEmailId(null);
  };

  const isMobile = () => window.innerWidth < 768;

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Animated background */}
      <AnimatedBackground />

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          unreadTotal={totalUnread}
          onLeftSidebarToggle={() => {
            setRightSidebarOpen(false);
            setLeftSidebarOpen((v) => !v);
          }}
          onRightSidebarToggle={() => {
            setLeftSidebarOpen(false);
            setRightSidebarOpen((v) => !v);
          }}
          leftSidebarOpen={leftSidebarOpen}
          rightSidebarOpen={rightSidebarOpen}
          pushEnabled={pushEnabled}
          onEnablePush={handleEnablePush}
        />

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Compact permanent sidebar — hidden on mobile */}
          <div className="hidden md:flex flex-shrink-0">
            <Sidebar
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              getCategoryCount={getCategoryCount}
              getUnreadCount={getUnreadCount}
              onCompose={() => setComposing(true)}
              collapsed={true}
            />
          </div>

          {/* Email list panel */}
          <div
            className="flex flex-col overflow-hidden transition-all duration-300"
            style={{
              flex: selectedEmail && !isMobile() ? '0 0 320px' : selectedEmail ? '0 0 0px' : '1 1 0',
              display: selectedEmail && window.innerWidth < 768 ? 'none' : 'flex',
              background: 'rgba(255,255,255,0.38)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRight: '1px solid rgba(255,255,255,0.55)',
              minWidth: selectedEmail ? '0' : '280px',
            }}
          >
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 size={24} className="text-blue-400 animate-spin" />
              </div>
            ) : (
              <EmailList
                emails={filteredEmails}
                selectedEmailId={selectedEmailId}
                onSelectEmail={selectEmail}
                onToggleStar={toggleStar}
                activeCategory={activeCategory}
                searchQuery={searchQuery}
              />
            )}
          </div>

          {/* Email detail panel */}
          {selectedEmail ? (
            <div
              className="flex-1 overflow-hidden flex flex-col"
              style={{
                background: 'rgba(255,255,255,0.48)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <EmailDetail
                email={selectedEmail}
                onBack={() => setSelectedEmailId(null)}
                onToggleStar={toggleStar}
                onMarkAsRead={markAsRead}
                onMarkAsUnread={markAsUnread}
                onDelete={deleteEmail}
                onMove={moveToCategory}
                onReply={(email) => handleComposeTo(email)}
              />
            </div>
          ) : (
            <div
              className="hidden lg:flex flex-1 items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.22)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="text-center px-6">
                <div
                  className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.65)',
                    border: '1px solid rgba(200,220,255,0.55)',
                    boxShadow: '0 8px 32px rgba(100,160,255,0.14)',
                  }}
                >
                  <Mail size={36} className="text-blue-400" />
                </div>
                <div className="text-base font-bold text-slate-600 mb-1">Select an email</div>
                <div className="text-sm text-slate-400">Choose a message from the list to read</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Left slider sidebar */}
      <LeftSliderSidebar
        isOpen={leftSidebarOpen}
        onClose={() => setLeftSidebarOpen(false)}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        getCategoryCount={getCategoryCount}
        getUnreadCount={getUnreadCount}
        onCompose={() => { setComposing(true); setLeftSidebarOpen(false); }}
      />

      {/* Right sidebar */}
      <RightSidebar
        isOpen={rightSidebarOpen}
        onClose={() => setRightSidebarOpen(false)}
        onComposeTo={handleComposeTo}
      />

      {/* Compose modal */}
      {composing && (
        <ComposeEmail
          onClose={() => { setComposing(false); setComposeTo(''); }}
          onSend={addEmail}
          initialTo={composeTo}
        />
      )}

      {/* Live feed */}
      <LiveFeed />
    </div>
  );
}
