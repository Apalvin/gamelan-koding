import React, { useState } from 'react';
import {
  BookOpen,
  Music2,
  Sparkles,
  HelpCircle,
  Layers,
  Bell,
  Disc,
  ArrowRight,
  Volume2,
} from 'lucide-react';
import { TabId } from '../types/navigation';
import { BelajarSoundboard } from '../components/belajar/BelajarSoundboard';
import {
  FlowerShape,
  StarShape,
  ZigZagShape,
} from '../components/ui/AbstractDecorations';

interface BelajarPageProps {
  onNavigate: (tab: TabId) => void;
}

type BelajarSubTab = 'soundboard' | 'katalog' | 'fungsi' | 'glosarium';

interface InstrumentInfo {
  id: string;
  name: string;
  role: string;
  category: 'Balungan' | 'Kolotomik' | 'Pamurba Irama';
  description: string;
  badge: string;
  badgeBg: string;
}

const INSTRUMENTS_DATA: InstrumentInfo[] = [
  {
    id: 'saron',
    name: 'Saron Barung',
    role: 'Melodi Utama',
    category: 'Balungan',
    description: 'Instrumen bilah perunggu beroktaf sedang yang menabuh kerangka melodi acuan lagu gending.',
    badge: 'Balungan Pokok',
    badgeBg: '#FAE0E4',
  },
  {
    id: 'demung',
    name: 'Demung',
    role: 'Penyangga Bass',
    category: 'Balungan',
    description: 'Bilah saron paling besar dengan oktaf rendah, menghasilkan nada tebal dan berwibawa.',
    badge: 'Oktaf Rendah',
    badgeBg: '#FEEFBF',
  },
  {
    id: 'peking',
    name: 'Peking / Saron Panerus',
    role: 'Tabuhan Lincah',
    category: 'Balungan',
    description: 'Bilah saron terkecil dengan oktaf tinggi, menabuh dua kali lipat lebih cepat mengiringi balungan.',
    badge: 'Tempo Dobel',
    badgeBg: '#EAF0F9',
  },
  {
    id: 'gong',
    name: 'Gong Ageng',
    role: 'Penutup Gongan',
    category: 'Kolotomik',
    description: 'Gong perunggu terbesar yang digantung, bersuara dalam dan menandai akhir satu putaran siklus waktu gongan.',
    badge: 'Loop Terminal',
    badgeBg: '#E1E6D1',
  },
  {
    id: 'kenong',
    name: 'Kenong',
    role: 'Penanda Gatra',
    category: 'Kolotomik',
    description: 'Koleksi gong berpencon di atas rancakan kayu yang menegaskan pembagian kalimat melodi gatra.',
    badge: 'Penanda Struktur',
    badgeBg: '#FAE0E4',
  },
  {
    id: 'kempul',
    name: 'Kempul',
    role: 'Gong Gantung Kecil',
    category: 'Kolotomik',
    description: 'Gong gantung berukuran sedang yang mengisi jeda aksen ketukan sebelum menuju Gong Ageng.',
    badge: 'Struktural',
    badgeBg: '#FEEFBF',
  },
  {
    id: 'kendhang',
    name: 'Kendhang',
    role: 'Pengendali Irama',
    category: 'Pamurba Irama',
    description: 'Gendang kulit bermuka dua yang mengatur cepat lambatnya tempo, dinamika tabuhan, dan aba-aba berhenti.',
    badge: 'Master Clock',
    badgeBg: '#EAF0F9',
  },
];

export const BelajarPage: React.FC<BelajarPageProps> = ({ onNavigate }) => {
  const [activeSubTab, setActiveSubTab] = useState<BelajarSubTab>('soundboard');
  const [activeGlossary, setActiveGlossary] = useState<string | null>(null);

  const GLOSSARY_ITEMS = [
    {
      term: 'Laras Slendro',
      desc: 'Sistem tangga nada 5 nada pokok (ji, ro, lu, ma, nem) dengan interval yang relatif seimbang antar bilahnya.',
    },
    {
      term: 'Balungan',
      desc: 'Rangka atau kerangka melodi utama lagu gending yang ditabuh oleh instrumen saron, demung, dan peking.',
    },
    {
      term: 'Gongan',
      desc: 'Satu siklus kalimat lagu penuh dari ketukan awal hingga ditutup dengan bunyi dentuman Gong Ageng.',
    },
    {
      term: 'Irama (Laya)',
      desc: 'Pengaturan tempo dan kecepatan ketukan musik gamelan, dipimpin oleh pukulan kendhang.',
    },
    {
      term: 'Pathet',
      desc: 'Sistem suasana rasa dan penekanan nada dasar yang mewarnai keheningan, ketenangan, atau kegembiraan gending.',
    },
  ];

  return (
    <div
      style={{
        padding: '18px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: '#FFFCF5',
      }}
    >
      {/* 1. Hero Banner Pastel (Khas Moodboard Classly) */}
      <div
        style={{
          background: '#FFB2DD',
          borderRadius: 24,
          padding: '20px 18px',
          border: '1.5px solid rgba(45, 45, 43, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -12,
            right: -12,
            opacity: 0.8,
            pointerEvents: 'none',
          }}
        >
          <FlowerShape size={80} color="#FAE0E4" />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            right: 50,
            opacity: 0.9,
            pointerEvents: 'none',
          }}
        >
          <StarShape size={24} color="#9AAB65" />
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#FFFCF5',
              padding: '3px 10px',
              borderRadius: 9999,
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#2D2D2B',
              marginBottom: 6,
            }}
          >
            <BookOpen size={13} strokeWidth={2.5} />
            <span>Katalog & Belajar</span>
          </div>
          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              margin: '0 0 6px',
              color: '#2D2D2B',
              lineHeight: 1.2,
            }}
          >
            Kenali Gamelan Jawa
          </h2>
          <p
            style={{
              fontSize: '0.84rem',
              color: '#2D2D2B',
              opacity: 0.9,
              margin: '0 0 12px',
              maxWidth: 320,
              lineHeight: 1.35,
            }}
          >
            Pelajari instrumen karawitan, laras nada slendro, dan hubungannya dengan algoritma pemrograman.
          </p>

          {/* 3 Badge Info Hero Header */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                background: '#FEEFBF',
                color: '#2D2D2B',
                padding: '4px 10px',
                borderRadius: 9999,
              }}
            >
              Laras Slendro
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                background: '#E1E6D1',
                color: '#2D2D2B',
                padding: '4px 10px',
                borderRadius: 9999,
              }}
            >
              7 Nada Pokok
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                background: '#EAF0F9',
                color: '#2D2D2B',
                padding: '4px 10px',
                borderRadius: 9999,
              }}
            >
              Tradisi Adiluhung
            </span>
          </div>
        </div>
      </div>

      {/* 2. Segmented Pill Toggle Kategori (Classly Style) */}
      <div
        style={{
          background: '#F8F3E7',
          padding: 4,
          borderRadius: 9999,
          display: 'flex',
          gap: 4,
          border: '1.5px solid rgba(45, 45, 43, 0.08)',
        }}
      >
        {(
          [
            { id: 'soundboard', label: 'Tuts Audio' },
            { id: 'katalog', label: 'Katalog Alat' },
            { id: 'fungsi', label: '3 Fungsi' },
            { id: 'glosarium', label: 'Kamus' },
          ] as const
        ).map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minHeight: 38,
                borderRadius: 9999,
                border: 'none',
                background: isActive ? '#FFB2DD' : 'transparent',
                color: '#2D2D2B',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3. Konten Berdasarkan Tab yang Aktif */}

      {/* TAB A: Tuts Soundboard Interaktif */}
      {activeSubTab === 'soundboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <BelajarSoundboard />
        </div>
      )}

      {/* TAB B: Katalog Instrumen (2-Column Grid) */}
      {activeSubTab === 'katalog' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {INSTRUMENTS_DATA.map((inst) => (
            <div
              key={inst.id}
              style={{
                background: '#F8F3E7',
                borderRadius: 20,
                padding: '14px 12px',
                border: '1.5px solid rgba(45, 45, 43, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    background: inst.badgeBg,
                    color: '#2D2D2B',
                    padding: '2px 8px',
                    borderRadius: 9999,
                    display: 'inline-block',
                    marginBottom: 6,
                  }}
                >
                  {inst.badge}
                </span>
                <h4 style={{ margin: '0 0 2px', fontSize: '0.92rem', fontWeight: 800, color: '#2D2D2B' }}>
                  {inst.name}
                </h4>
                <p style={{ margin: 0, fontSize: '0.74rem', color: '#6C6B66', lineHeight: 1.35 }}>
                  {inst.description}
                </p>
              </div>

              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#2D2D2B',
                  background: '#FFFCF5',
                  padding: '4px 8px',
                  borderRadius: 10,
                  textAlign: 'center',
                }}
              >
                Fungsi: {inst.role}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB C: Tiga Fungsi Kelompok Karawitan */}
      {activeSubTab === 'fungsi' && (
        <div
          style={{
            background: '#F8F3E7',
            borderRadius: 22,
            padding: '16px',
            border: '1.5px solid rgba(45, 45, 43, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={20} color="#2D2D2B" strokeWidth={2.5} />
            <h3 style={{ fontSize: '1.02rem', fontWeight: 800, margin: 0, color: '#2D2D2B' }}>
              3 Fungsi Kelompok Karawitan
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* 1. Kelompok Balungan */}
            <div
              style={{
                background: '#FFFCF5',
                borderRadius: 16,
                padding: '12px 14px',
                border: '1px solid rgba(45, 45, 43, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span
                  style={{
                    background: '#FAE0E4',
                    color: '#2D2D2B',
                    padding: '2px 8px',
                    borderRadius: 9999,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                  }}
                >
                  1. Melodi
                </span>
                <strong style={{ fontSize: '0.88rem', color: '#2D2D2B' }}>
                  Kelompok Balungan
                </strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#6C6B66', margin: 0, lineHeight: 1.4 }}>
                Saron, Demung, dan Peking bertindak sebagai <strong>kerangka melodi utama</strong>. Sama seperti barisan instruksi utama dalam kode algoritma!
              </p>
            </div>

            {/* 2. Kelompok Kolotomik */}
            <div
              style={{
                background: '#FFFCF5',
                borderRadius: 16,
                padding: '12px 14px',
                border: '1px solid rgba(45, 45, 43, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span
                  style={{
                    background: '#FEEFBF',
                    color: '#2D2D2B',
                    padding: '2px 8px',
                    borderRadius: 9999,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                  }}
                >
                  2. Struktur
                </span>
                <strong style={{ fontSize: '0.88rem', color: '#2D2D2B' }}>
                  Kelompok Kolotomik (Gong & Kenong)
                </strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#6C6B66', margin: 0, lineHeight: 1.4 }}>
                Bertindak sebagai <strong>penanda siklus waktu</strong>. Gong Ageng adalah penutup gongan (mirip penanda akhir perulangan / <em>loop terminal</em>).
              </p>
            </div>

            {/* 3. Kelompok Pamurba Irama */}
            <div
              style={{
                background: '#FFFCF5',
                borderRadius: 16,
                padding: '12px 14px',
                border: '1px solid rgba(45, 45, 43, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span
                  style={{
                    background: '#EAF0F9',
                    color: '#2D2D2B',
                    padding: '2px 8px',
                    borderRadius: 9999,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                  }}
                >
                  3. Dinamika
                </span>
                <strong style={{ fontSize: '0.88rem', color: '#2D2D2B' }}>
                  Kelompok Pamurba Irama (Kendhang)
                </strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#6C6B66', margin: 0, lineHeight: 1.4 }}>
                Bertindak sebagai <strong>pemimpin tempo dan dinamika</strong>. Kendhang menentukan kapan lagu berjalan lambat, cepat, atau berhenti.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB D: Glosarium Budaya Karawitan */}
      {activeSubTab === 'glosarium' && (
        <div
          style={{
            background: '#F8F3E7',
            borderRadius: 22,
            padding: '16px',
            border: '1.5px solid rgba(45, 45, 43, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HelpCircle size={20} color="#2D2D2B" strokeWidth={2.5} />
            <h3 style={{ fontSize: '1.02rem', fontWeight: 800, margin: 0, color: '#2D2D2B' }}>
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
                    background: isOpen ? '#FAE0E4' : '#FFFCF5',
                    borderRadius: 14,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    border: '1px solid rgba(45, 45, 43, 0.08)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.86rem', color: '#2D2D2B' }}>{item.term}</strong>
                    <span style={{ fontSize: '0.74rem', color: '#2D2D2B', fontWeight: 700 }}>
                      {isOpen ? 'Tutup ▲' : 'Buka ▼'}
                    </span>
                  </div>
                  {isOpen && (
                    <p style={{ fontSize: '0.8rem', color: '#6C6B66', margin: '6px 0 0', lineHeight: 1.4 }}>
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
      )}

      {/* 4. Tombol Aksi Buka Editor (Full-Pill Classly) */}
      <button
        type="button"
        onClick={() => onNavigate('editor')}
        style={{
          minHeight: 46,
          background: '#FFB2DD',
          color: '#2D2D2B',
          border: 'none',
          borderRadius: 9999,
          fontWeight: 800,
          fontSize: '0.92rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'transform 0.15s ease',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'none')}
      >
        <Sparkles size={18} />
        <span>Coba Tabuh & Susun Blok di Editor 🎵</span>
      </button>
    </div>
  );
};
