import React from 'react';
import { TabId } from '../../types/navigation';
import { AppHeader } from './AppHeader';
import { BottomNavigation } from './BottomNavigation';

interface AppLayoutProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeTab,
  onTabChange,
  children,
}) => {
  return (
    <div className="app-container">
      <AppHeader />
      <main className="main-content">
        {children}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};
