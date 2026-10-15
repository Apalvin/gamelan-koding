import React, { useState, useRef } from 'react';
import * as Blockly from 'blockly';
import { Code2, Music, Volume2 } from 'lucide-react';
import { BlocklyWorkspace, addBlockToWorkspace } from '../components/editor/BlocklyWorkspace';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { BlockPaletteDrawer } from '../components/editor/BlockPaletteDrawer';
import { GamelanVisualizer } from '../components/output/GamelanVisualizer';
import { HardwareSimulationPanel, OutputMode } from '../components/output/HardwareSimulationPanel';
import { SlendroNote } from '../types/gamelan';

type EditorTopTab = 'editor' | 'output';

export const EditorPage: React.FC = () => {
  const [activeTopTab, setActiveTopTab] = useState<EditorTopTab>('editor');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [outputMode, setOutputMode] = useState<OutputMode>('digital');

  // Preview visual state
  const [previewNote, setPreviewNote] = useState<SlendroNote | null>(null);
  const [previewGong, setPreviewGong] = useState(false);

  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  const handleWorkspaceReady = (ws: Blockly.WorkspaceSvg) => {
    workspaceRef.current = ws;
  };

  const handleAddBlock = (blockType: string) => {
    if (workspaceRef.current) {
      addBlockToWorkspace(workspaceRef.current, blockType);
    }
  };

  const handleResetWorkspace = () => {
    if (workspaceRef.current) {
      const confirmReset = window.confirm('Apakah kamu ingin mengulang kanvas koding dari awal?');
      if (confirmReset) {
        workspaceRef.current.clear();
        // Berikan blok awal kembali
        const startBlock = workspaceRef.current.newBlock('ketika_mulai');
        startBlock.initSvg();
        startBlock.render();
        startBlock.moveBy(36, 40);
      }
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Animasi simulasi ketukan visual pada bilah jika beralih atau di output
      setPreviewNote(1);
      setTimeout(() => setPreviewNote(2), 500);
      setTimeout(() => setPreviewNote(3), 1000);
      setTimeout(() => {
        setPreviewNote(null);
        setPreviewGong(true);
      }, 1500);
      setTimeout(() => {
        setPreviewGong(false);
        setIsPlaying(false);
      }, 2000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
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

      {/* Isi Layar Berdasarkan Tab Atas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
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
              <HardwareSimulationPanel mode={outputMode} onModeChange={setOutputMode} />
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
