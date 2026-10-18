import React, { useState, useEffect } from 'react';
import { TabId } from './types/navigation';
import { AppLayout } from './components/layout/AppLayout';
import { BerandaPage } from './pages/BerandaPage';
import { BelajarPage } from './pages/BelajarPage';
import { EditorPage } from './pages/EditorPage';
import { MisiPage } from './pages/MisiPage';
import { KaryakuPage } from './pages/KaryakuPage';
import { DebugAudioPage } from './pages/DebugAudioPage';
import { SavedProject } from './services/karyakuService';
import { onboardingService } from './services/onboardingService';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { JuryShowcaseModal } from './components/showcase/JuryShowcaseModal';

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('editor');
  const [isDebugRoute, setIsDebugRoute] = useState(
    typeof window !== 'undefined' &&
      (window.location.pathname === '/debug-audio' || window.location.hash === '#debug-audio')
  );

  // Status modal onboarding & tantangan akhir & showcase
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    return !onboardingService.isOnboardingCompleted();
  });
  const [isFinalChallengeActive, setIsFinalChallengeActive] = useState(false);
  const [isJuryShowcaseOpen, setIsJuryShowcaseOpen] = useState(false);

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

  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [projectToLoad, setProjectToLoad] = useState<SavedProject | null>(null);
  const [shouldAutoPlayProject, setShouldAutoPlayProject] = useState(false);

  const handleStartMission = (code: string) => {
    setIsFinalChallengeActive(false);
    setActiveMissionId(code);
    setActiveTab('editor');
  };

  const handleOpenProject = (project: SavedProject, autoPlay = true) => {
    setIsFinalChallengeActive(false);
    setActiveMissionId(null);
    setProjectToLoad(project);
    setShouldAutoPlayProject(autoPlay);
    setActiveTab('editor');
  };

  const handleClearProjectToLoad = () => {
    setProjectToLoad(null);
    setShouldAutoPlayProject(false);
  };

  const handleStartFinalChallenge = () => {
    setIsOnboardingOpen(false);
    setActiveMissionId(null);
    setIsFinalChallengeActive(true);
    setActiveTab('editor');
  };

  const handleSkipToMissions = () => {
    setIsOnboardingOpen(false);
    setIsFinalChallengeActive(false);
    setActiveTab('misi');
  };

  const handleResetAllData = () => {
    onboardingService.resetAllAppStorage();
    setActiveMissionId(null);
    setProjectToLoad(null);
    setIsFinalChallengeActive(false);
    setIsOnboardingOpen(true);
    setActiveTab('editor');
  };

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'beranda':
        return (
          <BerandaPage
            onNavigate={setActiveTab}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onOpenJuryShowcase={() => setIsJuryShowcaseOpen(true)}
          />
        );
      case 'belajar':
        return <BelajarPage onNavigate={setActiveTab} />;
      case 'editor':
        return (
          <EditorPage
            activeMissionId={activeMissionId}
            isFinalChallengeActive={isFinalChallengeActive}
            onExitFinalChallenge={() => setIsFinalChallengeActive(false)}
            projectToLoad={projectToLoad}
            shouldAutoPlayProject={shouldAutoPlayProject}
            onClearProjectToLoad={handleClearProjectToLoad}
            onExitMission={() => setActiveMissionId(null)}
            onNavigateToTab={setActiveTab}
            onSelectMission={(code) => setActiveMissionId(code)}
          />
        );
      case 'misi':
        return (
          <MisiPage
            onNavigate={setActiveTab}
            onStartMission={handleStartMission}
          />
        );
      case 'karyaku':
        return (
          <KaryakuPage
            onNavigate={setActiveTab}
            onOpenProject={handleOpenProject}
          />
        );
      default:
        return (
          <EditorPage
            activeMissionId={activeMissionId}
            isFinalChallengeActive={isFinalChallengeActive}
            onExitFinalChallenge={() => setIsFinalChallengeActive(false)}
            projectToLoad={projectToLoad}
            shouldAutoPlayProject={shouldAutoPlayProject}
            onClearProjectToLoad={handleClearProjectToLoad}
            onExitMission={() => setActiveMissionId(null)}
            onNavigateToTab={setActiveTab}
            onSelectMission={(code) => setActiveMissionId(code)}
          />
        );
    }
  };

  return (
    <>
      <AppLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenJuryShowcase={() => setIsJuryShowcaseOpen(true)}
        onResetAllData={handleResetAllData}
      >
        {renderCurrentPage()}
      </AppLayout>

      {/* Modal Onboarding Interaktif */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onStartChallenge={handleStartFinalChallenge}
        onSkipToMissions={handleSkipToMissions}
      />

      {/* Modal Showcase Dewan Juri Berdasarkan Esai TLP */}
      <JuryShowcaseModal
        isOpen={isJuryShowcaseOpen}
        onClose={() => setIsJuryShowcaseOpen(false)}
        onNavigate={(tab) => {
          setIsJuryShowcaseOpen(false);
          setActiveTab(tab);
        }}
        onStartBloomMission={(code) => {
          setIsJuryShowcaseOpen(false);
          handleStartMission(code);
        }}
      />
    </>
  );
}

export default App;
