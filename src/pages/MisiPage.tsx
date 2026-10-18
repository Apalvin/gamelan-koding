import React, { useState, useEffect } from 'react';
import { Target, Play, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { TabId } from '../types/navigation';
import missionsData from '../content/missions.json';
import { Mission, MissionProgressMap } from '../types/mission';
import { missionProgressService } from '../services/missionProgressService';
import { MissionModalC1 } from '../components/missions/MissionModalC1';
import { MissionModalC2 } from '../components/missions/MissionModalC2';
import { MissionModalC5 } from '../components/missions/MissionModalC5';

interface MisiPageProps {
  onNavigate: (tab: TabId) => void;
  onStartMission: (code: string) => void;
}

export const MisiPage: React.FC<MisiPageProps> = ({ onNavigate, onStartMission }) => {
  const missions = missionsData.missions as Mission[];
  const [progress, setProgress] = useState<MissionProgressMap>({});
  const [activeModalMission, setActiveModalMission] = useState<Mission | null>(null);

  const refreshProgress = () => {
    setProgress({ ...missionProgressService.getAllProgress() });
  };

  useEffect(() => {
    refreshProgress();
  }, []);

  const totalStars = Object.values(progress).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  const completedCount = Object.values(progress).filter((p) => p.status === 'selesai').length;

  const handleOpenMission = (misi: Mission) => {
    if (misi.code === 'C1' || misi.code === 'C2' || misi.code === 'C5') {
      setActiveModalMission(misi);
    } else {
      // C3, C4, C6 dibuka langsung di Editor
      onStartMission(misi.code);
    }
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header Halaman Misi */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: '#fef3c7',
              color: '#b45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Target size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Misi Koding Gamelan
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Taksonomi Bloom Bertingkat (C1–C6)</div>
          </div>
        </div>

        {/* Ringkasan Bintang */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#fef3c7',
            border: '1.5px solid #fde047',
            padding: '6px 12px',
            borderRadius: 999,
          }}
        >
          <Star size={16} fill="#f59e0b" color="#f59e0b" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#b45309' }}>
            {totalStars} / 18
          </span>
        </div>
      </div>

      {/* Ringkasan Progres & Disclaimer */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          border: '1.5px solid #bbf7d0',
          borderRadius: 16,
          padding: '12px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
            Progres Belajar
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#14532d', marginTop: 2 }}>
            {completedCount} dari 6 Misi Selesai
          </div>
        </div>

        <span
          style={{
            fontSize: '0.74rem',
            background: '#dcfce7',
            color: '#15803d',
            padding: '4px 10px',
            borderRadius: 999,
            fontWeight: 700,
          }}
        >
          Semua Level Terbuka
        </span>
      </div>

      <div className="culture-disclaimer">
        <span>ℹ️ Pola tabuhan berstatus contoh simulasi — belum divalidasi praktisi karawitan.</span>
      </div>

      {/* Daftar Kartu Misi C1 - C6 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {missions.map((misi) => {
          const mProgress = progress[misi.code] || { status: 'belum', stars: 0 };
          const isDone = mProgress.status === 'selesai';
          const starsCount = mProgress.stars || 0;
          const isEditorMission = misi.code === 'C3' || misi.code === 'C4' || misi.code === 'C6';

          return (
            <div
              key={misi.code}
              style={{
                background: 'white',
                borderRadius: 20,
                padding: '16px',
                border: isDone
                  ? '2px solid #86efac'
                  : misi.isRecommended
                  ? '2px solid #f59e0b'
                  : '2px solid #e2e8f0',
                boxShadow: isDone
                  ? '0 4px 12px rgba(34, 197, 94, 0.1)'
                  : misi.isRecommended
                  ? '0 4px 12px rgba(245, 158, 11, 0.15)'
                  : '0 2px 6px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                position: 'relative',
              }}
            >
              {/* Badge Rekomendasi atau Selesai */}
              {isDone ? (
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: 16,
                    background: '#16a34a',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 10px',
                    borderRadius: 999,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <CheckCircle2 size={12} /> Selesai
                </div>
              ) : misi.isRecommended ? (
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: 16,
                    background: '#f59e0b',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 999,
                  }}
                >
                  ⭐ Mulai Dari Sini
                </div>
              ) : null}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: isDone ? '#dcfce7' : '#f1f5f9',
                      color: isDone ? '#166534' : '#334155',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {misi.code}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '1.02rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      {misi.name}
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                      Tingkat: {misi.bloomLevel}
                    </span>
                  </div>
                </div>

                {/* Indikator 3 Bintang */}
                <div style={{ display: 'flex', gap: 3 }}>
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      size={17}
                      fill={starIdx <= starsCount ? '#f59e0b' : '#f1f5f9'}
                      color={starIdx <= starsCount ? '#f59e0b' : '#cbd5e1'}
                    />
                  ))}
                </div>
              </div>

              <p style={{ fontSize: '0.84rem', color: '#475569', margin: 0, lineHeight: 1.45 }}>
                {misi.activity}
              </p>

              {/* Tombol Buka Misi */}
              <button
                type="button"
                onClick={() => handleOpenMission(misi)}
                style={{
                  marginTop: 4,
                  minHeight: 44,
                  background: isDone
                    ? '#f0fdf4'
                    : misi.isRecommended
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : '#f8fafc',
                  color: isDone ? '#15803d' : misi.isRecommended ? 'white' : '#1e293b',
                  border: isDone
                    ? '1.5px solid #86efac'
                    : misi.isRecommended
                    ? 'none'
                    : '1.5px solid #cbd5e1',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  boxShadow: misi.isRecommended && !isDone ? '0 4px 10px rgba(245, 158, 11, 0.25)' : 'none',
                }}
              >
                <Play size={15} />
                {isDone
                  ? 'Mainkan Ulang'
                  : isEditorMission
                  ? 'Buka Misi di Editor'
                  : 'Buka Aktivitas'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Aktivitas Interaktif untuk C1, C2, dan C5 */}
      {activeModalMission?.code === 'C1' && (
        <MissionModalC1
          mission={activeModalMission}
          onClose={() => setActiveModalMission(null)}
          onComplete={refreshProgress}
        />
      )}

      {activeModalMission?.code === 'C2' && (
        <MissionModalC2
          mission={activeModalMission}
          onClose={() => setActiveModalMission(null)}
          onComplete={refreshProgress}
        />
      )}

      {activeModalMission?.code === 'C5' && (
        <MissionModalC5
          mission={activeModalMission}
          onClose={() => setActiveModalMission(null)}
          onComplete={refreshProgress}
        />
      )}
    </div>
  );
};
