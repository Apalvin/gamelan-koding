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
    <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header Halaman Misi */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-squircle)',
              background: 'var(--color-yellow-tint)',
              border: '1.5px solid var(--color-yellow)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Target size={20} strokeWidth={2.5} />
          </div>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.12rem',
                fontWeight: 800,
                margin: 0,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Misi GamelanCode
            </h2>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              Taksonomi Bloom (C1–C6)
            </div>
          </div>
        </div>

        {/* Ringkasan Bintang */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--color-yellow-tint)',
            border: '1.5px solid var(--color-yellow)',
            padding: '5px 12px',
            borderRadius: 'var(--radius-pill)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <Star size={16} fill="var(--color-yellow)" color="var(--text-primary)" />
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalStars} / 18
          </span>
        </div>
      </div>

      {/* Ringkasan Progres Homework Style */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--border-card)',
          borderRadius: 'var(--radius-card)',
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Progres Belajar
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.02rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: 2,
            }}
          >
            {completedCount} dari 6 Misi Selesai
          </div>
        </div>

        <span
          style={{
            fontSize: '0.76rem',
            background: 'var(--color-olive-tint)',
            border: '1.5px solid var(--color-olive)',
            color: 'var(--text-primary)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 800,
          }}
        >
          Semua Terbuka
        </span>
      </div>

      {/* Daftar Kartu Misi C1 - C6 (Homework style) */}
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
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-card)',
                padding: '16px',
                border: isDone
                  ? '1.5px solid var(--color-olive)'
                  : misi.isRecommended
                  ? '2px solid var(--color-yellow)'
                  : '1.5px solid var(--border-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
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
                    background: 'var(--color-olive)',
                    color: 'white',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 12px',
                    borderRadius: 'var(--radius-pill)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <CheckCircle2 size={13} strokeWidth={2.5} /> Selesai
                </div>
              ) : misi.isRecommended ? (
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: 16,
                    background: 'var(--color-yellow)',
                    color: 'var(--text-primary)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 12px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid rgba(45, 45, 43, 0.15)',
                  }}
                >
                  ⭐ Mulai Dari Sini
                </div>
              ) : null}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 'var(--radius-squircle)',
                      background: isDone ? 'var(--color-olive-tint)' : 'var(--bg-app)',
                      border: '1.5px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '0.96rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {misi.code}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.02rem',
                        fontWeight: 800,
                        margin: 0,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {misi.name}
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Tingkat: {misi.bloomLevel}
                    </span>
                  </div>
                </div>

                {/* Indikator 3 Bintang */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      size={18}
                      fill={starIdx <= starsCount ? 'var(--color-yellow)' : 'transparent'}
                      color={starIdx <= starsCount ? 'var(--color-yellow)' : 'rgba(45, 45, 43, 0.25)'}
                    />
                  ))}
                </div>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.45, opacity: 0.85 }}>
                {misi.activity}
              </p>

              {/* Tombol Buka Misi Full-Pill */}
              <button
                type="button"
                onClick={() => handleOpenMission(misi)}
                style={{
                  marginTop: 2,
                  minHeight: 44,
                  background: isDone
                    ? 'var(--color-olive-tint)'
                    : misi.isRecommended
                    ? 'var(--color-pink)'
                    : 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  border: isDone
                    ? '1.5px solid var(--color-olive)'
                    : misi.isRecommended
                    ? '1.5px solid var(--text-primary)'
                    : '1.5px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Play size={16} fill="currentColor" />
                <span>
                  {isDone
                    ? 'Mainkan Ulang'
                    : isEditorMission
                    ? 'Buka Misi di Editor'
                    : 'Buka Aktivitas'}
                </span>
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
