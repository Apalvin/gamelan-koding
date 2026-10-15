import React from 'react';
import { Target, Play, Star, ChevronRight, Sparkles } from 'lucide-react';
import { TabId } from '../types/navigation';

interface MisiPageProps {
  onNavigate: (tab: TabId) => void;
}

interface MissionItem {
  code: string;
  level: string;
  name: string;
  activity: string;
  status: 'belum' | 'sedang' | 'selesai';
  isRecommended?: boolean;
}

const MISSIONS: MissionItem[] = [
  { code: 'C1', level: 'Mengingat', name: 'Kenali Gamelan', activity: 'Cocokkan gambar instrumen ↔ nama ↔ bunyi bilah saron.', status: 'belum', isRecommended: true },
  { code: 'C2', level: 'Memahami', name: 'Pahami Polanya', activity: 'Susun potongan tabuhan yang didengar dan temukan repetisinya.', status: 'belum' },
  { code: 'C3', level: 'Menerapkan', name: 'Susun Tabuhan', activity: 'Susun blok instruksi agar menghasilkan pola tabuhan target.', status: 'belum' },
  { code: 'C4', level: 'Menganalisis', name: 'Detektif Tabuhan', activity: 'Program tabuhan memiliki kesalahan; temukan bug dan perbaiki.', status: 'belum' },
  { code: 'C5', level: 'Mengevaluasi', name: 'Kurator Pola', activity: 'Bandingkan dua program blok dan pilih variasi yang paling tepat.', status: 'belum' },
  { code: 'C6', level: 'Mencipta', name: 'Ciptakan Gendingmu', activity: 'Ciptakan pola gending kreasimu sendiri dan simpan ke Karyaku.', status: 'belum' },
];

export const MisiPage: React.FC<MisiPageProps> = ({ onNavigate }) => {
  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>Misi Koding Gamelan</h2>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Taksonomi Bloom Bertingkat (C1–C6)</div>
          </div>
        </div>
      </div>

      <div className="culture-disclaimer">
        <span>ℹ️ Semua level terbuka untuk dijelajahi. Pola tabuhan berstatus contoh simulasi.</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MISSIONS.map((misi) => (
          <div
            key={misi.code}
            style={{
              background: 'white',
              borderRadius: 18,
              padding: '16px',
              border: misi.isRecommended ? '2px solid #f59e0b' : '2px solid #e2e8f0',
              boxShadow: misi.isRecommended ? '0 4px 12px rgba(245, 158, 11, 0.15)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              position: 'relative'
            }}
          >
            {misi.isRecommended && (
              <div style={{
                position: 'absolute',
                top: -10,
                right: 16,
                background: '#f59e0b',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 999
              }}>
                ⭐ Mulai Dari Sini
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: '#f1f5f9',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {misi.code}
                </span>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>{misi.name}</h3>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Tingkat: {misi.level}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 2 }}>
                {[1, 2, 3].map((star) => (
                  <Star key={star} size={15} color="#cbd5e1" />
                ))}
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '4px 0 0', lineHeight: 1.4 }}>
              {misi.activity}
            </p>

            <button
              type="button"
              onClick={() => onNavigate('editor')}
              style={{
                marginTop: 6,
                minHeight: 44,
                background: misi.isRecommended ? '#f59e0b' : '#f8fafc',
                color: misi.isRecommended ? 'white' : '#1e293b',
                border: misi.isRecommended ? 'none' : '2px solid #e2e8f0',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer'
              }}
            >
              <Play size={16} /> Buka Misi di Editor
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
