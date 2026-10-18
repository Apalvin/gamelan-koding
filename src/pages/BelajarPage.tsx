import React, { useState } from 'react';
import { BookOpen, Music2, Sparkles, HelpCircle, Layers, Bell, Disc } from 'lucide-react';
import { TabId } from '../types/navigation';
import { BelajarSoundboard } from '../components/belajar/BelajarSoundboard';

interface BelajarPageProps {
  onNavigate: (tab: TabId) => void;
}

export const BelajarPage: React.FC<BelajarPageProps> = ({ onNavigate }) => {
  const [activeGlossary, setActiveGlossary] = useState<string | null>(null);

  const GLOSSARY_ITEMS = [
    {
      term: 'Laras Slendro',
      desc: 'Sistem tangga nada 5 nada pokok (ji, ro, lu, ma, nem) dengan jarak interval yang relatif sama rata antar bilahnya.',
    },
    {
      term: 'Balungan',
      desc: 'Rangka atau kerangka melodi utama lagu gending yang ditabuh oleh kelompok instrumen saron, demung, dan peking.',
    },
    {
      term: 'Gongan',
      desc: 'Satu putaran siklus kalimat lagu penuh dari awal hingga ditutup dengan bunyi dentuman Gong Ageng.',
    },
    {
      term: 'Laya / Irama',
      desc: 'Pengaturan tempo dan kecepatan ketukan musik gamelan, dipimpin oleh pukulan kendhang.',
    },
    {
      term: 'Pathet',
      desc: 'Wilayah suasana atau penekanan nada tertentu yang memberi warna rasa tenang, syahdu, atau gembira pada gending.',
    },
  ];

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header Halaman */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BookOpen size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Kenali Gamelan & Karawitan
          </h2>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Pelajari instrumen, nada laras slendro, dan logika tabuhan
          </div>
        </div>
      </div>

      {/* 1. Tuts Soundboard Interaktif (Milestone 9) */}
      <BelajarSoundboard />

      {/* 2. Anatomi Tiga Fungsi Kelompok Karawitan (Sesuai Esai TLP) */}
      <div
        style={{
          background: 'white',
          borderRadius: 20,
          padding: '16px',
          border: '2px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers size={20} color="#0d9488" />
          <h3 style={{ fontSize: '1.02rem', fontWeight: 800, margin: 0, color: '#0f766e' }}>
            3 Fungsi Kelompok Instrumen Gamelan
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Kelompok Balungan */}
          <div
            style={{
              background: '#f0fdfa',
              border: '1.5px solid #99f6e4',
              borderRadius: 14,
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Music2 size={16} color="#0d9488" />
              <strong style={{ fontSize: '0.88rem', color: '#115e59' }}>
                1. Kelompok Balungan (Saron, Demung, Peking)
              </strong>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#334155', margin: 0, lineHeight: 1.45 }}>
              Bertindak sebagai <strong>kerangka melodi utama</strong>. Demung bersuara berat dan tenang, Saron
              berjalan sebagai melodi acuan, sedangkan Peking menabuh lincah dua kali lebih rapat.
            </p>
          </div>

          {/* Kelompok Kolotomik / Struktural */}
          <div
            style={{
              background: '#fffbeb',
              border: '1.5px solid #fde68a',
              borderRadius: 14,
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Bell size={16} color="#d97706" />
              <strong style={{ fontSize: '0.88rem', color: '#92400e' }}>
                2. Kelompok Kolotomik (Gong Ageng, Kenong, Kempul)
              </strong>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#334155', margin: 0, lineHeight: 1.45 }}>
              Bertindak sebagai <strong>penanda siklus waktu</strong> (pembagi kalimat gongan). Dalam konsep coding,
              Gong Ageng berfungsi seperti penanda akhir perulangan (*loop terminal*)!
            </p>
          </div>

          {/* Kelompok Pamurba Irama */}
          <div
            style={{
              background: '#fdf2f8',
              border: '1.5px solid #fbcfe8',
              borderRadius: 14,
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Disc size={16} color="#db2777" />
              <strong style={{ fontSize: '0.88rem', color: '#9d174d' }}>
                3. Kelompok Pamurba Irama (Kendhang)
              </strong>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#334155', margin: 0, lineHeight: 1.45 }}>
              Bertindak sebagai <strong>pemimpin tempo dan dinamika</strong>. Kendhang menentukan kapan lagu berjalan
              cepat, lambat, atau berhenti.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Glosarium Budaya Karawitan Interaktif */}
      <div
        style={{
          background: 'white',
          borderRadius: 20,
          padding: '16px',
          border: '2px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HelpCircle size={20} color="#6366f1" />
          <h3 style={{ fontSize: '1.02rem', fontWeight: 800, margin: 0, color: '#4338ca' }}>
            Kamus Mini Istilah Karawitan
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {GLOSSARY_ITEMS.map((item, idx) => {
            const isOpen = activeGlossary === item.term;
            return (
              <div
                key={idx}
                onClick={() => setActiveGlossary(isOpen ? null : item.term)}
                style={{
                  background: isOpen ? '#f5f3ff' : '#f8fafc',
                  border: isOpen ? '1.5px solid #818cf8' : '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '10px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.86rem', color: '#312e81' }}>{item.term}</strong>
                  <span style={{ fontSize: '0.74rem', color: '#6366f1', fontWeight: 700 }}>
                    {isOpen ? 'Tutup ▲' : 'Buka ▼'}
                  </span>
                </div>
                {isOpen && (
                  <p style={{ fontSize: '0.8rem', color: '#475569', margin: '6px 0 0', lineHeight: 1.45 }}>
                    {item.desc}
                  </p>
                )}
              </div>
            );
          })}
        </div>

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
          background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
          color: 'white',
          border: 'none',
          borderRadius: 14,
          fontWeight: 800,
          fontSize: '0.95rem',
          cursor: 'pointer',
          marginTop: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
        }}
      >
        <Sparkles size={18} />
        <span>Coba Tabuh & Susun Blok di Editor 🎵</span>
      </button>
    </div>
  );
};
