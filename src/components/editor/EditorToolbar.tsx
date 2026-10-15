import React from 'react';
import { Play, Square, Plus, RotateCcw } from 'lucide-react';

interface EditorToolbarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenPalette: () => void;
  onResetWorkspace: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isPlaying,
  onTogglePlay,
  onOpenPalette,
  onResetWorkspace,
}) => {
  return (
    <div className="editor-toolbar" role="toolbar" aria-label="Alat Kontrol Editor">
      {/* Tombol + Blok untuk Buka Drawer Palet */}
      <button
        type="button"
        className="btn-add-block"
        onClick={onOpenPalette}
        aria-label="Tambah Blok Koding"
      >
        <Plus size={20} strokeWidth={2.5} />
        <span>+ Blok</span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Tombol Reset */}
        <button
          type="button"
          onClick={onResetWorkspace}
          style={{
            minWidth: 44,
            minHeight: 44,
            borderRadius: '50%',
            border: '2px solid #e2e8f0',
            background: 'white',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          title="Bersihkan Lembar Kerja"
          aria-label="Bersihkan Lembar Kerja"
        >
          <RotateCcw size={18} />
        </button>

        {/* Tombol Mainkan / Berhenti (Selalu Terlihat Sesuai PRD) */}
        <button
          type="button"
          className={`btn-play-toggle ${isPlaying ? 'stop' : 'play'}`}
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Hentikan Tabuhan' : 'Mainkan Tabuhan'}
        >
          {isPlaying ? (
            <>
              <Square size={18} fill="white" />
              <span>Berhenti</span>
            </>
          ) : (
            <>
              <Play size={18} fill="white" />
              <span>Mainkan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
