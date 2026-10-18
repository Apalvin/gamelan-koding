import React, { useState } from 'react';
import { Sparkles, BookmarkCheck, X } from 'lucide-react';

interface SaveCreativeModalProps {
  isOpen: boolean;
  notesCount: number;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
}

export const SaveCreativeModal: React.FC<SaveCreativeModalProps> = ({
  isOpen,
  notesCount,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
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
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 24,
          padding: '24px 20px',
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          position: 'relative',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: '#f1f5f9',
            border: 'none',
            borderRadius: 999,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer',
          }}
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#fdf2f8',
              color: '#db2777',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 999,
              marginBottom: 6,
            }}
          >
            <Sparkles size={13} /> Misi C6 • Ciptakan Gendingmu
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>
            Simpan ke Karyaku
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
            Gending kreasimu memiliki <strong>{notesCount} ketukan tabuhan</strong>. Beri nama agar tersimpan rapi di koleksi Karyaku!
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label
              htmlFor="karya-title"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}
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
                borderRadius: 12,
                border: '1.5px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="karya-desc"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}
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
                borderRadius: 12,
                border: '1.5px solid #cbd5e1',
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
              background: title.trim()
                ? 'linear-gradient(135deg, #db2777 0%, #be185d 100%)'
                : '#cbd5e1',
              color: 'white',
              border: 'none',
              borderRadius: 14,
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: title.trim() ? 'pointer' : 'not-allowed',
              boxShadow: title.trim() ? '0 4px 12px rgba(219, 39, 119, 0.3)' : 'none',
            }}
          >
            <BookmarkCheck size={18} /> Simpan Sekarang
          </button>
        </form>
      </div>
    </div>
  );
};
