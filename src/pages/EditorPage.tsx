import React, { useState, useRef, useEffect } from 'react';
import * as Blockly from 'blockly';
import { Code2, Music, AlertTriangle, CheckCircle2, X, Sparkles, Volume2, Square } from 'lucide-react';
import { BlocklyWorkspace, addBlockToWorkspace } from '../components/editor/BlocklyWorkspace';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { BlockPaletteDrawer } from '../components/editor/BlockPaletteDrawer';
import { GamelanVisualizer } from '../components/output/GamelanVisualizer';
import { HardwareSimulationPanel, OutputMode } from '../components/output/HardwareSimulationPanel';
import { SlendroNote, GamelanEvent } from '../types/gamelan';
import { compileWorkspace } from '../compiler/compileWorkspace';
import { digitalSimOutput } from '../audio/digitalSimOutput';
import { hardwareSimOutput, HardwarePacket } from '../audio/hardwareSimOutput';
import { MissionEditorBanner } from '../components/missions/MissionEditorBanner';
import { MissionSuccessModal } from '../components/missions/MissionSuccessModal';
import { SaveCreativeModal } from '../components/missions/SaveCreativeModal';
import missionsData from '../content/missions.json';
import { Mission, EvaluationResult } from '../types/mission';
import { evaluateMission, evaluateC6 } from '../compiler/missionEvaluator';
import { evaluateFinalChallenge } from '../compiler/finalChallengeEvaluator';
import { FINAL_CHALLENGE_PLAYBACK_EVENTS } from '../services/onboardingService';
import { missionProgressService } from '../services/missionProgressService';
import { karyakuService, SavedProject } from '../services/karyakuService';
import { TabId } from '../types/navigation';
import { convertEventsToKepatihan } from '../compiler/kepatihanConverter';
import { KepatihanModal } from '../components/karyaku/KepatihanModal';

type EditorTopTab = 'editor' | 'output';

interface CompilerNotice {
  type: 'success' | 'warning' | 'error';
  message: string;
}

interface SaveSuccessToast {
  title: string;
  message: string;
}

interface EditorPageProps {
  activeMissionId?: string | null;
  isFinalChallengeActive?: boolean;
  onExitFinalChallenge?: () => void;
  projectToLoad?: SavedProject | null;
  shouldAutoPlayProject?: boolean;
  onClearProjectToLoad?: () => void;
  onExitMission?: () => void;
  onNavigateToTab?: (tab: TabId) => void;
  onSelectMission?: (code: string) => void;
}

export const EditorPage: React.FC<EditorPageProps> = ({
  activeMissionId,
  isFinalChallengeActive = false,
  onExitFinalChallenge,
  projectToLoad,
  shouldAutoPlayProject = false,
  onClearProjectToLoad,
  onExitMission,
  onNavigateToTab,
  onSelectMission,
}) => {
  const [activeTopTab, setActiveTopTab] = useState<EditorTopTab>('editor');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [outputMode, setOutputMode] = useState<OutputMode>('digital');

  // Misi aktif jika ada
  const activeMission: Mission | undefined = missionsData.missions.find(
    (m) => m.code === activeMissionId
  ) as Mission | undefined;

  // Evaluasi & Karyaku modals
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [isCreativeModalOpen, setIsCreativeModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isKepatihanModalOpen, setIsKepatihanModalOpen] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState<SaveSuccessToast | null>(null);
  const [isPlayingFinalChallengeTarget, setIsPlayingFinalChallengeTarget] = useState(false);

  // Compiler results
  const [compiledEvents, setCompiledEvents] = useState<GamelanEvent[]>([]);
  const [compilerNotice, setCompilerNotice] = useState<CompilerNotice | null>(null);

  // Preview visual state
  const [previewNote, setPreviewNote] = useState<SlendroNote | null>(null);
  const [previewGong, setPreviewGong] = useState(false);

  // Hardware simulation stream state
  const [activeHardwareChannel, setActiveHardwareChannel] = useState<number | null>(null);
  const [streamedPackets, setStreamedPackets] = useState<HardwarePacket[]>([]);
  const [latestPacket, setLatestPacket] = useState<HardwarePacket | null>(null);

  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  const stopPlayback = () => {
    digitalSimOutput.stop();
    hardwareSimOutput.stop();
    setIsPlaying(false);
    setPreviewNote(null);
    setPreviewGong(false);
    setActiveHardwareChannel(null);
  };

  const loadBuggyXmlIfC4 = (ws: Blockly.WorkspaceSvg) => {
    if (activeMission?.code === 'C4' && activeMission.editorTarget?.initialBuggyXml) {
      try {
        stopPlayback();
        ws.clear();
        const dom = Blockly.utils.xml.textToDom(activeMission.editorTarget.initialBuggyXml);
        Blockly.Xml.domToWorkspace(dom, ws);
        const res = compileWorkspace(ws);
        if (res.success) {
          setCompiledEvents(res.events);
        }
      } catch (err) {
        console.error('Failed to load buggy xml', err);
      }
    }
  };

  const loadProjectXml = (ws: Blockly.WorkspaceSvg, proj: SavedProject, autoPlay = false) => {
    try {
      stopPlayback();
      ws.clear();
      const xmlToUse = proj.xml && proj.xml.trim().length > 0 ? proj.xml : karyakuService.DEFAULT_SAMPLE_XML;
      const dom = Blockly.utils.xml.textToDom(xmlToUse);
      Blockly.Xml.domToWorkspace(dom, ws);
      karyakuService.saveDraftXml(xmlToUse);
      onClearProjectToLoad?.();

      const res = compileWorkspace(ws);
      if (res.success) {
        setCompiledEvents(res.events);
        if (autoPlay && res.events.length > 0) {
          setTimeout(() => {
            digitalSimOutput.play(res.events);
            setIsPlaying(true);
          }, 150);
        }
      }
    } catch (err) {
      console.error('Failed to load project into workspace', err);
    }
  };

  const handleWorkspaceReady = (ws: Blockly.WorkspaceSvg) => {
    workspaceRef.current = ws;
    digitalSimOutput.setWorkspace(ws);

    // 1. Tentukan apa yang harus dimuat
    if (projectToLoad && projectToLoad.xml) {
      loadProjectXml(ws, projectToLoad, shouldAutoPlayProject);
    } else if (activeMission?.code === 'C4' && activeMission.editorTarget?.initialBuggyXml) {
      loadBuggyXmlIfC4(ws);
    } else {
      const draftXml = karyakuService.getDraftXml();
      if (draftXml) {
        try {
          ws.clear();
          const dom = Blockly.utils.xml.textToDom(draftXml);
          Blockly.Xml.domToWorkspace(dom, ws);
          const res = compileWorkspace(ws);
          if (res.success) {
            setCompiledEvents(res.events);
          }
        } catch {
          // fallback biarkan blok ketika_mulai bawaan
        }
      } else if (ws.getAllBlocks(false).length === 0) {
        const startBlock = ws.newBlock('ketika_mulai');
        startBlock.initSvg();
        startBlock.render();
        startBlock.moveBy(36, 40);
      }
    }

    // 2. Auto-save draft ke localStorage setiap kali ada perubahan blok oleh pengguna
    ws.addChangeListener((event: any) => {
      if (!event || event.isUiEvent) return;
      try {
        const dom = Blockly.Xml.workspaceToDom(ws);
        const xml = Blockly.Xml.domToText(dom);
        karyakuService.saveDraftXml(xml);
      } catch {}
    });
  };

  // Muat proyek jika projectToLoad diperbarui dari Karyaku saat workspace sudah aktif
  useEffect(() => {
    if (workspaceRef.current && projectToLoad && projectToLoad.xml) {
      loadProjectXml(workspaceRef.current, projectToLoad, shouldAutoPlayProject);
    }
  }, [projectToLoad, shouldAutoPlayProject]);

  // Muat kode awal C4 jika berganti ke misi C4 saat workspace sudah aktif
  useEffect(() => {
    if (workspaceRef.current && activeMission?.code === 'C4') {
      loadBuggyXmlIfC4(workspaceRef.current);
    }
  }, [activeMissionId]);

  const handleAddBlock = (blockType: string) => {
    if (workspaceRef.current) {
      addBlockToWorkspace(workspaceRef.current, blockType);
      setCompilerNotice(null);
    }
  };

  const handleResetWorkspace = () => {
    if (workspaceRef.current) {
      const confirmReset = window.confirm('Apakah kamu ingin mengulang kanvas koding dari awal?');
      if (confirmReset) {
        stopPlayback();
        workspaceRef.current.clear();
        setCompilerNotice(null);
        setCompiledEvents([]);
        karyakuService.clearDraftXml();
        if (activeMission?.code === 'C4') {
          loadBuggyXmlIfC4(workspaceRef.current);
        } else {
          const startBlock = workspaceRef.current.newBlock('ketika_mulai');
          startBlock.initSvg();
          startBlock.render();
          startBlock.moveBy(36, 40);
          try {
            const dom = Blockly.Xml.workspaceToDom(workspaceRef.current);
            const xml = Blockly.Xml.domToText(dom);
            karyakuService.saveDraftXml(xml);
          } catch {}
        }
      }
    }
  };

  const handleTogglePlay = async () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    if (!workspaceRef.current) return;

    // 1. Compile workspace Blockly sesuai PRD Bagian 7.2
    const result = compileWorkspace(workspaceRef.current);

    if (!result.success) {
      setCompilerNotice({
        type: result.code === 'INFINITE_LOOP' ? 'error' : 'warning',
        message: result.error,
      });
      return;
    }

    setCompiledEvents(result.events);
    setCompilerNotice({
      type: 'success',
      message: `Program siap! Memainkan ${result.events.length} tabuhan...`,
    });

    // 2. Putar melalui Output yang dipilih (DigitalSimOutput atau HardwareSimOutput)
    try {
      setIsPlaying(true);

      if (outputMode === 'hardware') {
        setStreamedPackets([]);
        setLatestPacket(null);

        hardwareSimOutput.setOnPacketEmit((packet) => {
          setActiveHardwareChannel(packet.ch);
          setLatestPacket(packet);
          setStreamedPackets((prev) => [...prev, packet]);
          setTimeout(() => {
            setActiveHardwareChannel((curr) => (curr === packet.ch ? null : curr));
          }, packet.pulseMs);
        });

        hardwareSimOutput.setOnStop(() => {
          setIsPlaying(false);
          setActiveHardwareChannel(null);
        });

        await hardwareSimOutput.play(result.events);
      } else {
        await digitalSimOutput.play(result.events);
        setIsPlaying(false);
      }
    } catch (err) {
      console.error('Playback error', err);
      setIsPlaying(false);
    }
  };

  // Evaluasi tabuhan terhadap target misi aktif
  const handleCheckMission = () => {
    if (!workspaceRef.current || !activeMission) return;

    const result = compileWorkspace(workspaceRef.current);
    if (!result.success) {
      setCompilerNotice({
        type: result.code === 'INFINITE_LOOP' ? 'error' : 'warning',
        message: result.error,
      });
      return;
    }

    setCompiledEvents(result.events);

    // Misi C6 membuka modal input nama gending
    if (activeMission.code === 'C6') {
      setIsCreativeModalOpen(true);
      return;
    }

    // Evaluasi C3 atau C4
    const evaluation = evaluateMission(activeMission, result.events);
    setEvalResult(evaluation);

    if (evaluation.isCorrect) {
      missionProgressService.saveProgress(activeMission.id, evaluation.stars, 'selesai');
    }
  };

  // Toggle pemutaran audio target untuk Tantangan Gending Akhir
  const handleTogglePlayFinalChallengeTarget = async () => {
    if (isPlayingFinalChallengeTarget) {
      digitalSimOutput.stop();
      setIsPlayingFinalChallengeTarget(false);
      return;
    }

    try {
      setIsPlayingFinalChallengeTarget(true);
      await digitalSimOutput.play(FINAL_CHALLENGE_PLAYBACK_EVENTS);
      setIsPlayingFinalChallengeTarget(false);
    } catch {
      setIsPlayingFinalChallengeTarget(false);
    }
  };

  // Evaluasi tabuhan siswa terhadap Tantangan Gending Akhir
  const handleCheckFinalChallenge = () => {
    if (!workspaceRef.current) return;
    const result = compileWorkspace(workspaceRef.current);
    if (!result.success) {
      setCompilerNotice({
        type: result.code === 'INFINITE_LOOP' ? 'error' : 'warning',
        message: result.error,
      });
      return;
    }

    setCompiledEvents(result.events);
    const evaluation = evaluateFinalChallenge(result.events);
    setEvalResult(evaluation);
  };

  const handleOpenCreativeModal = () => {
    if (!workspaceRef.current) return;
    const result = compileWorkspace(workspaceRef.current);
    if (result.success) {
      setCompiledEvents(result.events);
    }
    setIsCreativeModalOpen(true);
  };

  // Buka modal simpan pola umum kapan saja dari Toolbar
  const handleOpenSaveModal = () => {
    if (!workspaceRef.current) return;
    const result = compileWorkspace(workspaceRef.current);
    if (!result.success || result.events.length === 0) {
      setCompilerNotice({
        type: 'warning',
        message: 'Yuk sambungkan minimal satu blok tabuhan ke blok ketika ▶ ditekan sebelum menyimpan!',
      });
      return;
    }
    setCompiledEvents(result.events);
    setIsSaveModalOpen(true);
  };

  // Konfirmasi simpan pola umum ke Karyaku
  const handleConfirmSaveGeneralPattern = (title: string, description: string) => {
    if (!workspaceRef.current) return;
    try {
      const dom = Blockly.Xml.workspaceToDom(workspaceRef.current);
      const xml = Blockly.Xml.domToText(dom);
      const saved = karyakuService.saveProject({
        title,
        description,
        notesCount: compiledEvents.length,
        xml,
      });
      setIsSaveModalOpen(false);
      setSaveSuccessToast({
        title: saved.title,
        message: `Pola "${saved.title}" berhasil disimpan ke tab Karyaku!`,
      });
    } catch (err) {
      console.error('Failed to save pattern', err);
    }
  };

  // Konfirmasi simpan karya C6 ke localStorage dan evaluasi
  const handleConfirmSaveCreative = (title: string, description: string) => {
    if (!activeMission || !workspaceRef.current) return;
    const evaluation = evaluateC6(compiledEvents, title, activeMission);
    setEvalResult(evaluation);
    setIsCreativeModalOpen(false);

    if (evaluation.isCorrect) {
      missionProgressService.saveProgress('C6', evaluation.stars, 'selesai');
      try {
        const dom = Blockly.Xml.workspaceToDom(workspaceRef.current);
        const xml = Blockly.Xml.domToText(dom);
        karyakuService.saveProject({
          title,
          description,
          notesCount: compiledEvents.length,
          xml,
        });
      } catch (err) {
        console.error('Failed to save C6 creation', err);
      }
    }
  };

  const handleOpenKepatihan = () => {
    if (workspaceRef.current) {
      const res = compileWorkspace(workspaceRef.current);
      if (res.success) {
        setCompiledEvents(res.events);
      }
    }
    setIsKepatihanModalOpen(true);
  };

  // Navigasi saat misi atau tantangan akhir selesai/ditindaklanjuti
  const handleNextMission = () => {
    setEvalResult(null);
    if (isFinalChallengeActive) {
      onExitFinalChallenge?.();
      onNavigateToTab?.('misi');
      return;
    }
    if (activeMission?.code === 'C3' && onSelectMission) {
      onSelectMission('C4');
    } else if (activeMission?.code === 'C6' && onNavigateToTab) {
      onExitMission?.();
      onNavigateToTab('karyaku');
    } else if (onNavigateToTab) {
      onExitMission?.();
      onNavigateToTab('misi');
    }
  };

  // Daftarkan listener visual & pembersihan saat unmount (auto-save draft)
  useEffect(() => {
    digitalSimOutput.setOnVisualEvent((ev) => {
      if (!ev) {
        setPreviewNote(null);
        setPreviewGong(false);
      } else if (ev.instrument === 'gong') {
        setPreviewGong(true);
        setPreviewNote(null);
      } else if (ev.note) {
        setPreviewNote(ev.note);
        setPreviewGong(false);
      }
    });

    digitalSimOutput.setOnFinish(() => {
      setIsPlaying(false);
    });

    return () => {
      // Simpan draft sebelum unmount
      if (workspaceRef.current && workspaceRef.current.getAllBlocks(false).length > 0) {
        try {
          const dom = Blockly.Xml.workspaceToDom(workspaceRef.current);
          const xml = Blockly.Xml.domToText(dom);
          karyakuService.saveDraftXml(xml);
        } catch {}
      }
      digitalSimOutput.stop();
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, position: 'relative' }}>
      {/* Banner Misi Aktif jika Editor dibuka dari Misi C3/C4/C6 */}
      {activeMission && (
        <MissionEditorBanner
          mission={activeMission}
          onCheck={handleCheckMission}
          onExit={onExitMission || (() => {})}
          onSaveCreative={handleOpenCreativeModal}
        />
      )}

      {/* Banner Tantangan Gending Akhir jika diaktifkan dari Onboarding */}
      {isFinalChallengeActive && (
        <div
          style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            borderBottom: '2px solid #fde68a',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            boxShadow: '0 4px 10px rgba(245, 158, 11, 0.08)',
            zIndex: 11,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#f59e0b',
                  color: 'white',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 999,
                  marginBottom: 4,
                }}
              >
                <Sparkles size={12} /> Tantangan Awal • Gending Akhir
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#78350f' }}>
                Pola Lancaran 8 Ketukan: 3 • 5 • 3 • 2 • 3 • 5 • 6 • 5 (+ Gong)
              </div>
              <div style={{ fontSize: '0.74rem', color: '#92400e', marginTop: 2 }}>
                Susun blok saron dan gong untuk membunyikan pola penutup ini! (Contoh — belum divalidasi praktisi karawitan)
              </div>
            </div>

            <button
              type="button"
              onClick={onExitFinalChallenge}
              style={{
                background: 'white',
                border: '1.5px solid #cbd5e1',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#64748b',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Keluar
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleTogglePlayFinalChallengeTarget}
              style={{
                minHeight: 40,
                padding: '0 12px',
                background: isPlayingFinalChallengeTarget ? '#fee2e2' : '#fef08a',
                color: isPlayingFinalChallengeTarget ? '#dc2626' : '#713f12',
                border: isPlayingFinalChallengeTarget ? '1.5px solid #f87171' : '1.5px solid #eab308',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              {isPlayingFinalChallengeTarget ? <Square size={15} fill="currentColor" /> : <Volume2 size={15} />}
              <span>{isPlayingFinalChallengeTarget ? 'Hentikan Contoh' : 'Dengarkan Target'}</span>
            </button>

            <button
              type="button"
              onClick={handleCheckFinalChallenge}
              style={{
                minHeight: 40,
                padding: '0 14px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                fontWeight: 800,
                fontSize: '0.84rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
              }}
            >
              <CheckCircle2 size={16} />
              <span>Periksa Tabuhanku</span>
            </button>
          </div>
        </div>
      )}

      {/* Dua Tab Di Atas Sesuai Sketsa 1 PRD */}
      <div className="editor-top-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTopTab === 'editor'}
          className={`editor-tab-item ${activeTopTab === 'editor' ? 'active' : ''}`}
          onClick={() => setActiveTopTab('editor')}
        >
          <Code2 size={18} />
          <span>Editor Blok</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTopTab === 'output'}
          className={`editor-tab-item ${activeTopTab === 'output' ? 'active' : ''}`}
          onClick={() => setActiveTopTab('output')}
        >
          <Music size={18} />
          <span>Output Gamelan</span>
        </button>
      </div>

      {/* Toolbar Kontrol (Selalu Terlihat Sesuai PRD) */}
      <EditorToolbar
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onOpenPalette={() => setIsPaletteOpen(true)}
        onResetWorkspace={handleResetWorkspace}
        onSavePattern={handleOpenSaveModal}
        onShowKepatihan={handleOpenKepatihan}
      />

      {/* Toast Notifikasi Berhasil Simpan ke Karyaku */}
      {saveSuccessToast && (
        <div
          style={{
            margin: '6px 12px 0',
            padding: '10px 14px',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            fontSize: '0.84rem',
            fontWeight: 700,
            background: '#ecfdf5',
            color: '#065f46',
            border: '1.5px solid #a7f3d0',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
            zIndex: 16,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🎉 {saveSuccessToast.message}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('karyaku')}
                style={{
                  background: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Lihat di Karyaku
              </button>
            )}
            <button
              type="button"
              onClick={() => setSaveSuccessToast(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#047857',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
              }}
              aria-label="Tutup notifikasi"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Banner Notifikasi Hasil Kompilasi & Guard */}
      {compilerNotice && (
        <div
          style={{
            margin: '6px 12px 0',
            padding: '8px 12px',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            fontSize: '0.8rem',
            fontWeight: 600,
            background:
              compilerNotice.type === 'success'
                ? '#ecfdf5'
                : compilerNotice.type === 'error'
                ? '#fef2f2'
                : '#fffbeb',
            color:
              compilerNotice.type === 'success'
                ? '#065f46'
                : compilerNotice.type === 'error'
                ? '#991b1b'
                : '#92400e',
            border: `1px solid ${
              compilerNotice.type === 'success'
                ? '#a7f3d0'
                : compilerNotice.type === 'error'
                ? '#fecaca'
                : '#fde68a'
            }`,
            animation: 'fadeIn 0.2s ease-out',
            zIndex: 15,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {compilerNotice.type === 'success' ? (
              <CheckCircle2 size={16} color="#059669" />
            ) : (
              <AlertTriangle size={16} color={compilerNotice.type === 'error' ? '#dc2626' : '#d97706'} />
            )}
            <span>{compilerNotice.message}</span>
          </div>

          <button
            type="button"
            onClick={() => setCompilerNotice(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              padding: 2,
              display: 'flex',
            }}
            aria-label="Tutup notifikasi"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Isi Layar Berdasarkan Tab Atas */}
      <div style={{ flex: '1 1 0%', minHeight: 0, position: 'relative', overflow: 'hidden' }}>
        {/* Tab 1: Kanvas Blockly */}
        <div
          style={{
            width: '100%',
            height: '100%',
            display: activeTopTab === 'editor' ? 'block' : 'none',
          }}
        >
          <BlocklyWorkspace onWorkspaceReady={handleWorkspaceReady} />
        </div>

        {/* Tab 2: Output Gamelan & Simulasi Hardware */}
        {activeTopTab === 'output' && (
          <div style={{ height: '100%', overflowY: 'auto' }}>
            {outputMode === 'digital' && (
              <GamelanVisualizer activeNote={previewNote} isGongActive={previewGong} />
            )}
            <div style={{ padding: '0 12px 20px', marginTop: outputMode === 'hardware' ? 12 : 0 }}>
              <HardwareSimulationPanel
                mode={outputMode}
                onModeChange={(newMode) => {
                  stopPlayback();
                  setOutputMode(newMode);
                }}
                compiledEvents={compiledEvents}
                activeChannel={activeHardwareChannel}
                streamedPackets={streamedPackets}
                latestPacket={latestPacket}
                onClearLogs={() => {
                  setStreamedPackets([]);
                  setLatestPacket(null);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Drawer Palet Blok (+ Blok) Sesuai PRD */}
      <BlockPaletteDrawer
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onAddBlock={handleAddBlock}
      />

      {/* Modal Evaluasi Misi Berhasil / Umpan Balik */}
      {evalResult && (
        <MissionSuccessModal
          result={evalResult}
          onClose={() => setEvalResult(null)}
          onNextMission={handleNextMission}
          onRetry={() => setEvalResult(null)}
        />
      )}

      {/* Modal Simpan Karya C6 ke Karyaku */}
      <SaveCreativeModal
        isOpen={isCreativeModalOpen}
        notesCount={compiledEvents.length}
        badgeLabel="Misi C6 • Ciptakan Gendingmu"
        onClose={() => setIsCreativeModalOpen(false)}
        onSave={handleConfirmSaveCreative}
      />

      {/* Modal Simpan Pola Bebas ke Karyaku */}
      <SaveCreativeModal
        isOpen={isSaveModalOpen}
        notesCount={compiledEvents.length}
        badgeLabel="Koleksi Karyaku • Simpan Pola"
        defaultTitle="Gending Kreasiku"
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleConfirmSaveGeneralPattern}
      />

      {/* Modal Notasi Kepatihan */}
      {isKepatihanModalOpen && (
        <KepatihanModal
          title={activeMission ? `Misi ${activeMission.code}: ${activeMission.name}` : (projectToLoad?.title || 'Karya Editor')}
          kepatihanText={convertEventsToKepatihan(compiledEvents)}
          onClose={() => setIsKepatihanModalOpen(false)}
        />
      )}
    </div>
  );
};
