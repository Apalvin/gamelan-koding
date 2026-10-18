import React from 'react';
import { Play, Square, Plus, RotateCcw, Bookmark } from 'lucide-react';

interface EditorToolbarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenPalette: () => void;
  onResetWorkspace: () => void;
  onSavePattern: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isPlaying,
  onTogglePlay,
  onOpenPalette,
  onResetWorkspace,
  onSavePattern,
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
        {/* Tombol Simpan Karya ke Karyaku */}
        <button
          type="button"
          onClick={onSavePattern}
          style={{
            minHeight: 44,
            padding: '0 12px',
            borderRadius: 14,
            border: '2px solid #fbcfe8',
            background: '#fdf2f8',
            color: '#db2777',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Simpan Pola ke Karyaku"
          aria-label="Simpan Pola ke Karyaku"
        >
          <Bookmark size={17} />
          <span>Simpan</span>
        </button>

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
