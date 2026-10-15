import React from 'react';
import { BookOpen, Info, Music2 } from 'lucide-react';
import { TabId } from '../types/navigation';

interface BelajarPageProps {
  onNavigate: (tab: TabId) => void;
}

export const BelajarPage: React.FC<BelajarPageProps> = ({ onNavigate }) => {
  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Kenali Gamelan</h2>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pelajari instrumen dan laras gamelan Jawa</div>
        </div>
      </div>

      {/* Kartu Materi 1: Saron & Laras Slendro */}
      <div style={{
        background: 'white',
        borderRadius: 18,
        padding: '16px',
        border: '2px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Music2 size={18} color="#0f766e" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#0f766e' }}>Instrumen Saron & Notasi Kepatihan</h3>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
          Saron adalah instrumen gamelan berbilah logam (perunggu atau kuningan) yang diletakkan di atas kotak kayu (rancakan).
        </p>
        <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
          Pada laras <strong>Slendro</strong>, tangga nadanya menggunakan sistem 5 nada pokok:
          <span style={{ display: 'block', margin: '8px 0', padding: '8px', background: '#f8fafc', borderRadius: 8, fontWeight: 700, textAlign: 'center', color: '#92400e', letterSpacing: '4px' }}>
            1 (ji) • 2 (ro) • 3 (lu) • 5 (ma) • 6 (nem)
          </span>
        </p>
        <div className="culture-disclaimer">
          <span>Contoh — belum divalidasi praktisi karawitan</span>
        </div>
      </div>

      {/* Kartu Materi 2: Peran Gong */}
      <div style={{
        background: 'white',
        borderRadius: 18,
        padding: '16px',
        border: '2px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Music2 size={18} color="#b45309" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#b45309' }}>Gong Sebagai Penutup Siklus</h3>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
          Gong merupakan instrumen terbesar dengan suara dengungan dalam. Dalam karawitan, tabuhan gong menandai akhir suatu siklus gongan (kalimat lagu).
        </p>
        <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
          Dalam coding, tabuhan gong mirip dengan titik akhir atau penanda selesai satu putaran logika!
        </p>
        <div className="culture-disclaimer">
          <span>Contoh — belum divalidasi praktisi karawitan</span>
        </div>
      </div>

      {/* Tombol ke Editor */}
      <button
        type="button"
        onClick={() => onNavigate('editor')}
        style={{
          minHeight: 48,
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: 14,
          fontWeight: 700,
          fontSize: '0.95rem',
          cursor: 'pointer',
          marginTop: 8
        }}
      >
        Coba Tabuh di Editor Koding 🎵
      </button>
    </div>
  );
};
