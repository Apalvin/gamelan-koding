import React from 'react';
import { Play, Sparkles, BookOpen, Target, ArrowRight, Award } from 'lucide-react';
import { TabId } from '../types/navigation';
import { onboardingService } from '../services/onboardingService';
import { missionProgressService } from '../services/missionProgressService';

interface BerandaPageProps {
  onNavigate: (tab: TabId) => void;
  onOpenOnboarding?: () => void;
  onOpenJuryShowcase?: () => void;
}

export const BerandaPage: React.FC<BerandaPageProps> = ({
  onNavigate,
  onOpenOnboarding,
  onOpenJuryShowcase,
}) => {
  const studentName = onboardingService.getStudentName();
  const totalStars = missionProgressService.getTotalStars();

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Kartu Sapaan Ramah */}
      <div
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
          color: 'white',
          borderRadius: 20,
          padding: '20px',
          boxShadow: '0 8px 18px rgba(16, 185, 129, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,0.2)',
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            <Sparkles size={14} /> Selamat Datang!
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 6px' }}>Halo, {studentName}! 👋</h2>
          <p style={{ fontSize: '0.88rem', opacity: 0.95, margin: '0 0 16px', lineHeight: 1.4 }}>
            Ayo belajar menyusun alur logika coding sambil membunyikan tabuhan gamelan Jawa!
          </p>
          <button
            type="button"
            onClick={() => onNavigate('editor')}
            style={{
              minHeight: 44,
              padding: '0 20px',
              backgroundColor: '#facc15',
              color: '#713f12',
              border: 'none',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            }}
          >
            <Play size={18} fill="#713f12" /> Buka Editor Bebas
          </button>
        </div>
      </div>

      {/* Kartu Showcase Presentasi Dewan Juri */}
      {onOpenJuryShowcase && (
        <div
          onClick={onOpenJuryShowcase}
          style={{
            background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
            borderRadius: 18,
            padding: '16px',
            border: '2px solid #fde047',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(234, 179, 8, 0.15)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(234, 179, 8, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 179, 8, 0.15)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 3px 8px rgba(217, 119, 6, 0.3)',
              }}
            >
              <Award size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>
                Mode Dewan Juri • Esai Lomba
              </div>
              <h3 style={{ margin: '2px 0 0', fontSize: '1rem', fontWeight: 800, color: '#78350f' }}>
                Showcase Presentasi GamelanCode 🏆
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#854d0e' }}>
                PISA 427, UNESCO 2021, Taksonomi Bloom C1-C6, & Hardware Solenoid
              </p>
            </div>
          </div>
          <div
            style={{
              minWidth: 40,
              minHeight: 40,
              borderRadius: 10,
              background: '#fef3c7',
              color: '#92400e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowRight size={20} />
          </div>
        </div>
      )}

      {/* Kartu Lanjutkan Misi */}
      <div
        style={{
          background: 'white',
          borderRadius: 18,
          padding: '16px',
          border: '2px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Target size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>
                Misi Rekomendasi
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                C1: Kenali Gamelan
              </h3>
            </div>
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              background: '#e0f2fe',
              color: '#0369a1',
              padding: '3px 8px',
              borderRadius: 999,
            }}
          >
            Mulai Dari Sini
          </span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
          Mengenal bilah saron slendro dan bunyi penanda gong dalam tradisi karawitan.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('misi')}
          style={{
            minHeight: 44,
            background: '#f8fafc',
            border: '2px solid #cbd5e1',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: '0.9rem',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            cursor: 'pointer',
          }}
        >
          Lihat Semua Misi <ArrowRight size={16} />
        </button>
      </div>

      {/* Ringkasan Progres & Catatan Budaya */}
      <div
        style={{
          background: 'white',
          borderRadius: 18,
          padding: '16px',
          border: '2px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#334155', margin: 0 }}>
          Ringkasan Belajar Siswa
        </h4>
        <div style={{ display: 'flex', gap: 12 }}>
          <div
            style={{
              flex: 1,
              background: '#f0fdf4',
              padding: '12px',
              borderRadius: 12,
              border: '1px solid #bbf7d0',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#15803d' }}>6</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534' }}>Misi Tersedia</div>
          </div>
          <div
            style={{
              flex: 1,
              background: '#fefce8',
              padding: '12px',
              borderRadius: 12,
              border: '1px solid #fef08a',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#a16207' }}>{totalStars}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#854d0e' }}>Bintang Diraih</div>
          </div>
        </div>

        {/* Tombol Putar Ulang Panduan Onboarding */}
        {onOpenOnboarding && (
          <button
            type="button"
            onClick={onOpenOnboarding}
            style={{
              minHeight: 44,
              background: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              borderRadius: 12,
              padding: '0 14px',
              color: '#475569',
              fontSize: '0.84rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <BookOpen size={16} /> Putar Ulang Panduan Awal & Tantangan
          </button>
        )}

        <div className="culture-disclaimer">
          <span>
            ⚠️ <strong>Integritas Budaya:</strong> Pola tabuhan di aplikasi ini adalah contoh simulasi (belum divalidasi
            praktisi karawitan).
          </span>
        </div>
      </div>
    </div>
  );
};
