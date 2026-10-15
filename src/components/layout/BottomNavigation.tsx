import React from 'react';
import { Home, BookOpen, Code2, Target, Sparkles } from 'lucide-react';
import { TabId, TABS_CONFIG } from '../../types/navigation';

interface BottomNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const renderIcon = (iconName: string, isActive: boolean) => {
    const size = isActive ? 22 : 20;
    const strokeWidth = isActive ? 2.5 : 2;

    switch (iconName) {
      case 'Home':
        return <Home size={size} strokeWidth={strokeWidth} />;
      case 'BookOpen':
        return <BookOpen size={size} strokeWidth={strokeWidth} />;
      case 'Code2':
        return <Code2 size={size} strokeWidth={strokeWidth} />;
      case 'Target':
        return <Target size={size} strokeWidth={strokeWidth} />;
      case 'Sparkles':
        return <Sparkles size={size} strokeWidth={strokeWidth} />;
      default:
        return <Code2 size={size} strokeWidth={strokeWidth} />;
    }
  };

  return (
    <nav className="bottom-nav" aria-label="Navigasi Utama">
      {TABS_CONFIG.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`nav-tab-btn ${tab.colorClass} ${isActive ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-label={tab.ariaLabel}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className="tab-icon-wrapper">
              {renderIcon(tab.iconName, isActive)}
            </div>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
