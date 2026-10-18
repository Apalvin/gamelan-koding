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
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 20,
          padding: '20px 24px',
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          position: 'relative',
        }}
      >
        {/* Tombol Tutup */}
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
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer',
          }}
          aria-label="Tutup Partitur"
        >
          <X size={18} />
        </button>

        {/* Header Modal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileMusic size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              Partitur Notasi Kepatihan
            </h3>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{title}</div>
          </div>
        </div>

        {/* Area Notasi Kepatihan */}
        <div
          style={{
            background: '#0f172a',
            color: '#fde047',
            padding: '14px 16px',
            borderRadius: 14,
            fontFamily: 'Consolas, monospace',
            fontSize: '0.88rem',
            lineHeight: 1.8,
            overflowX: 'auto',
            whiteSpace: 'pre',
            border: '1.5px solid #334155',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)',
          }}
        >
          {kepatihanText}
        </div>

        <div style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.4 }}>
          *Tanda kurung <strong>(5)</strong> menandai tabuhan nada bersamaan dengan pukulan Gong Ageng sebagai penutup gongan.
        </div>

        <div className="culture-disclaimer" style={{ margin: 0 }}>
          <span>Contoh — belum divalidasi praktisi karawitan</span>
        </div>

        {/* Aksi Salin & Tutup */}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              flex: 1,
              minHeight: 44,
              background: copied ? '#059669' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.25)',
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Notasi Kepatihan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
