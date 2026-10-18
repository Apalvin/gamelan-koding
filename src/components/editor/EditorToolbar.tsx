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
        <Plus size={18} strokeWidth={2.5} />
        <span>Blok</span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {/* Tombol Notasi Kepatihan (Icon Button) */}
        {onShowKepatihan && (
          <button
            type="button"
            className="editor-tool-btn"
            onClick={onShowKepatihan}
            title="Lihat Notasi Kepatihan"
            aria-label="Lihat Notasi Kepatihan"
          >
            <FileMusic size={17} />
          </button>
        )}

        {/* Tombol Simpan Karya ke Karyaku (Icon Button) */}
        <button
          type="button"
          className="editor-tool-btn"
          onClick={onSavePattern}
          title="Simpan Pola ke Karyaku"
          aria-label="Simpan Pola ke Karyaku"
        >
          <Bookmark size={17} />
        </button>

        {/* Tombol Reset Lembar Kerja (Icon Button) */}
        <button
          type="button"
          className="editor-tool-btn"
          onClick={onResetWorkspace}
          title="Bersihkan Lembar Kerja"
          aria-label="Bersihkan Lembar Kerja"
        >
          <RotateCcw size={17} />
        </button>

        {/* Tombol Mainkan / Berhenti (Primary Pill CTA - Selalu Terlihat & Menonjol) */}
        <button
          type="button"
          className={`btn-play-toggle ${isPlaying ? 'stop' : 'play'}`}
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Hentikan Tabuhan' : 'Mainkan Tabuhan'}
        >
          {isPlaying ? (
            <>
              <Square size={15} fill="currentColor" />
              <span>Berhenti</span>
            </>
          ) : (
            <>
              <Play size={15} fill="currentColor" />
              <span>Mainkan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
