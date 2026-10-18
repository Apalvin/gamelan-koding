import React, { useState } from 'react';
import { Sparkles, BookmarkCheck, X } from 'lucide-react';

interface SaveCreativeModalProps {
  isOpen: boolean;
  notesCount: number;
  badgeLabel?: string;
  defaultTitle?: string;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
}

export const SaveCreativeModal: React.FC<SaveCreativeModalProps> = ({
  isOpen,
  notesCount,
  badgeLabel,
  defaultTitle = '',
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim(), description.trim());
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(45, 45, 43, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: 'var(--bg-app)',
          borderRadius: 24,
          padding: '24px 20px',
          width: '100%',
          maxWidth: 420,
          border: '1.5px solid var(--border-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          position: 'relative',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="btn-back-circle"
          style={{ position: 'absolute', top: 16, right: 16 }}
          aria-label="Tutup"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--color-pink)',
              color: 'var(--text-primary)',
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(45, 45, 43, 0.15)',
              marginBottom: 8,
            }}
          >
            <Sparkles size={13} /> {badgeLabel || 'Koleksi Karyaku • Simpan Pola'}
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 800,
              margin: '0 0 4px',
              color: 'var(--text-primary)',
            }}
          >
            Simpan ke Karyaku
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
            Pola tabuhanmu memiliki <strong>{notesCount} ketukan tabuhan</strong>. Beri nama agar tersimpan rapi di koleksi Karyaku!
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label
              htmlFor="karya-title"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}
            >
              Judul Gending *
            </label>
            <input
              id="karya-title"
              type="text"
              required
              placeholder="misal: Ladrang Slendro Cilik"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 14px',
                borderRadius: 'var(--radius-squircle)',
                background: 'var(--bg-surface)',
                border: '1.5px solid var(--border-card)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="karya-desc"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}
            >
              Cerita / Inspirasi (Opsional)
            </label>
            <textarea
              id="karya-desc"
              rows={2}
              placeholder="Ceritakan tentang gending kreasimu ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 14px',
                borderRadius: 'var(--radius-squircle)',
                background: 'var(--bg-surface)',
                border: '1.5px solid var(--border-card)',
                color: 'var(--text-primary)',
                fontSize: '0.86rem',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            style={{
              marginTop: 6,
              minHeight: 46,
              width: '100%',
              background: title.trim() ? 'var(--color-pink)' : 'var(--bg-surface)',
              color: title.trim() ? 'var(--text-primary)' : 'var(--text-muted)',
              border: title.trim() ? '1.5px solid var(--text-primary)' : '1.5px solid var(--border-subtle)',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 800,
              fontSize: '0.92rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: title.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s ease',
            }}
          >
            <BookmarkCheck size={18} /> Simpan Sekarang
          </button>
        </form>
      </div>
    </div>
  );
};
