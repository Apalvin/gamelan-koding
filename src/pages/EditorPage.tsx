import React, { useState, useRef, useEffect } from 'react';
import * as Blockly from 'blockly';
import { Code2, Music, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { BlocklyWorkspace, addBlockToWorkspace } from '../components/editor/BlocklyWorkspace';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { BlockPaletteDrawer } from '../components/editor/BlockPaletteDrawer';
import { GamelanVisualizer } from '../components/output/GamelanVisualizer';
import { HardwareSimulationPanel, OutputMode } from '../components/output/HardwareSimulationPanel';
import { SlendroNote, GamelanEvent } from '../types/gamelan';
import { compileWorkspace } from '../compiler/compileWorkspace';

type EditorTopTab = 'editor' | 'output';

interface CompilerNotice {
  type: 'success' | 'warning' | 'error';
  message: string;
}

export const EditorPage: React.FC = () => {
  const [activeTopTab, setActiveTopTab] = useState<EditorTopTab>('editor');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [outputMode, setOutputMode] = useState<OutputMode>('digital');

  // Compiler results
  const [compiledEvents, setCompiledEvents] = useState<GamelanEvent[]>([]);
  const [compilerNotice, setCompilerNotice] = useState<CompilerNotice | null>(null);

  // Preview visual state
  const [previewNote, setPreviewNote] = useState<SlendroNote | null>(null);
  const [previewGong, setPreviewGong] = useState(false);

  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const playTimeoutsRef = useRef<number[]>([]);

  const handleWorkspaceReady = (ws: Blockly.WorkspaceSvg) => {
    workspaceRef.current = ws;
  };

  const handleAddBlock = (blockType: string) => {
    if (workspaceRef.current) {
      addBlockToWorkspace(workspaceRef.current, blockType);
      // Bersihkan notifikasi saat anak mulai menambah blok
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
        // Berikan blok awal kembali
        const startBlock = workspaceRef.current.newBlock('ketika_mulai');
        startBlock.initSvg();
        startBlock.render();
        startBlock.moveBy(36, 40);
      }
    }
  };

  const stopPlayback = () => {
    playTimeoutsRef.current.forEach((id) => clearTimeout(id));
    playTimeoutsRef.current = [];
    setIsPlaying(false);
    setPreviewNote(null);
    setPreviewGong(false);
  };

  const handleTogglePlay = () => {
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

    // 2. Jika kompilasi sukses
    setCompiledEvents(result.events);
    setCompilerNotice({
      type: 'success',
      message: `Tersusun ${result.events.length} tabuhan (${(result.totalDurationMs / 1000).toFixed(1)} detik).`,
    });

    setIsPlaying(true);
    playTimeoutsRef.current = [];

    // Jadwalkan visualisasi bilah / gong menyala
    result.events.forEach((ev) => {
      const timeoutId = window.setTimeout(() => {
        if (ev.instrument === 'gong') {
          setPreviewGong(true);
          window.setTimeout(() => setPreviewGong(false), 500);
        } else if (ev.note) {
          setPreviewNote(ev.note);
          window.setTimeout(() => setPreviewNote(null), 350);
        }
      }, ev.tMs);
      playTimeoutsRef.current.push(timeoutId);
    });

    // Timeout untuk akhir program
    const endTimeout = window.setTimeout(() => {
      setIsPlaying(false);
    }, result.totalDurationMs + 200);
    playTimeoutsRef.current.push(endTimeout);
  };

  // Bersihkan timeouts saat komponen unmount
  useEffect(() => {
    return () => {
      playTimeoutsRef.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, position: 'relative' }}>
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
      />

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
            <GamelanVisualizer activeNote={previewNote} isGongActive={previewGong} />
            <div style={{ padding: '0 12px 20px' }}>
              <HardwareSimulationPanel
                mode={outputMode}
                onModeChange={setOutputMode}
                compiledEvents={compiledEvents}
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
    </div>
  );
};
