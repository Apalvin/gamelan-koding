import React, { useState, useEffect } from 'react';
import { TabId } from './types/navigation';
import { AppLayout } from './components/layout/AppLayout';
import { BerandaPage } from './pages/BerandaPage';
import { BelajarPage } from './pages/BelajarPage';
import { EditorPage } from './pages/EditorPage';
import { MisiPage } from './pages/MisiPage';
import { KaryakuPage } from './pages/KaryakuPage';
import { DebugAudioPage } from './pages/DebugAudioPage';

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('editor');
  const [isDebugRoute, setIsDebugRoute] = useState(
    typeof window !== 'undefined' &&
      (window.location.pathname === '/debug-audio' || window.location.hash === '#debug-audio')
  );

  useEffect(() => {
    const handlePopState = () => {
      setIsDebugRoute(
        window.location.pathname === '/debug-audio' || window.location.hash === '#debug-audio'
      );
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  if (isDebugRoute) {
    return (
      <DebugAudioPage
        onBack={() => {
          if (window.location.pathname === '/debug-audio') {
            window.history.pushState({}, '', '/');
          } else {
            window.location.hash = '';
          }
          setIsDebugRoute(false);
        }}
      />
    );
  }

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'beranda':
        return <BerandaPage onNavigate={setActiveTab} />;
      case 'belajar':
        return <BelajarPage onNavigate={setActiveTab} />;
      case 'editor':
        return <EditorPage />;
      case 'misi':
        return <MisiPage onNavigate={setActiveTab} />;
      case 'karyaku':
        return <KaryakuPage onNavigate={setActiveTab} />;
      default:
        return <EditorPage />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderCurrentPage()}
    </AppLayout>
  );
}

export default App;
