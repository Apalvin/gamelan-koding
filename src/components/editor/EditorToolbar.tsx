import React from 'react';
import { Play, Square, Plus, RotateCcw, Bookmark, FileMusic } from 'lucide-react';

interface EditorToolbarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenPalette: () => void;
  onResetWorkspace: () => void;
  onSavePattern: () => void;
  onShowKepatihan?: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isPlaying,
  onTogglePlay,
  onOpenPalette,
  onResetWorkspace,
  onSavePattern,
  onShowKepatihan,
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
        {/* Tombol Notasi Kepatihan */}
        {onShowKepatihan && (
          <button
            type="button"
            onClick={onShowKepatihan}
            style={{
              minHeight: 42,
              padding: '0 14px',
              borderRadius: 'var(--radius-pill)',
              border: '1.5px solid rgba(45, 45, 43, 0.12)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Lihat Notasi Kepatihan"
            aria-label="Lihat Notasi Kepatihan"
          >
            <FileMusic size={16} />
            <span>Notasi</span>
          </button>
        )}

        {/* Tombol Simpan Karya ke Karyaku */}
        <button
          type="button"
          onClick={onSavePattern}
          style={{
            minHeight: 42,
            padding: '0 14px',
            borderRadius: 'var(--radius-pill)',
            border: '1.5px solid var(--color-pink)',
            background: 'var(--color-pink-tint)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 800,
            fontSize: '0.84rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Simpan Pola ke Karyaku"
          aria-label="Simpan Pola ke Karyaku"
        >
          <Bookmark size={16} />
          <span>Simpan</span>
        </button>

        {/* Tombol Reset (Circular Flat) */}
        <button
          type="button"
          onClick={onResetWorkspace}
          style={{
            width: 42,
            height: 42,
            minWidth: 42,
            minHeight: 42,
            borderRadius: '50%',
            border: '1.5px solid rgba(45, 45, 43, 0.12)',
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Bersihkan Lembar Kerja"
          aria-label="Bersihkan Lembar Kerja"
        >
          <RotateCcw size={17} />
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
              <Square size={17} fill="currentColor" />
              <span>Berhenti</span>
            </>
          ) : (
            <>
              <Play size={17} fill="currentColor" />
              <span>Mainkan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
