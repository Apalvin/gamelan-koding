import React, { useState } from 'react';
import { TabId } from './types/navigation';
import { AppLayout } from './components/layout/AppLayout';
import { BerandaPage } from './pages/BerandaPage';
import { BelajarPage } from './pages/BelajarPage';
import { EditorPage } from './pages/EditorPage';
import { MisiPage } from './pages/MisiPage';
import { KaryakuPage } from './pages/KaryakuPage';

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('editor');

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
