import React, { useState } from 'react';
import { X, Copy, Check, FileMusic } from 'lucide-react';

interface KepatihanModalProps {
  title: string;
  kepatihanText: string;
  onClose: () => void;
}

export const KepatihanModal: React.FC<KepatihanModalProps> = ({
  title,
  kepatihanText,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(kepatihanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(45, 45, 43, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 50,
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
          padding: '22px 20px',
          width: '100%',
          maxWidth: 480,
          border: '1.5px solid var(--border-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          position: 'relative',
        }}
      >
        {/* Tombol Tutup Circular Dark */}
        <button
          type="button"
          onClick={onClose}
          className="btn-back-circle"
          style={{ position: 'absolute', top: 16, right: 16 }}
          aria-label="Tutup Partitur"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* Header Modal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-squircle)',
              background: 'var(--color-yellow-tint)',
              border: '1.5px solid var(--color-yellow)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileMusic size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Partitur Notasi Kepatihan
            </h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{title}</div>
          </div>
        </div>

        {/* Area Notasi Kepatihan */}
        <div
          style={{
            background: 'var(--text-primary)',
            color: 'var(--color-yellow)',
            padding: '14px 16px',
            borderRadius: 'var(--radius-card)',
            fontFamily: 'Consolas, monospace',
            fontSize: '0.9rem',
            lineHeight: 1.8,
            overflowX: 'auto',
            whiteSpace: 'pre',
            border: '1.5px solid var(--border-subtle)',
          }}
        >
          {kepatihanText}
        </div>

        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
          *Tanda kurung <strong>(5)</strong> menandai tabuhan nada bersamaan dengan pukulan Gong Ageng sebagai penutup gongan.
        </div>

        <div className="culture-disclaimer" style={{ margin: 0 }}>
          <span>Contoh — belum divalidasi praktisi karawitan</span>
        </div>

        {/* Aksi Salin Full-Pill */}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              flex: 1,
              minHeight: 46,
              background: copied ? 'var(--color-olive)' : 'var(--color-pink)',
              color: copied ? 'white' : 'var(--text-primary)',
              border: '1.5px solid var(--text-primary)',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 800,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {copied ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} />}
            <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Notasi Kepatihan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
