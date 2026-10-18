import React from 'react';
import { TabId } from '../../types/navigation';
import { AppHeader } from './AppHeader';
import { BottomNavigation } from './BottomNavigation';

interface AppLayoutProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onOpenOnboarding?: () => void;
  onResetAllData?: () => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeTab,
  onTabChange,
  onOpenOnboarding,
  onResetAllData,
  children,
}) => {
  return (
    <div className="app-container">
      <AppHeader onOpenOnboarding={onOpenOnboarding} onResetAllData={onResetAllData} />
      <main className="main-content">
        {children}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};
