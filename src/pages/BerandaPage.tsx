import React from 'react';
import {
  Play,
  Sparkles,
  BookOpen,
  Target,
  ArrowRight,
  Award,
  Volume2,
  Code2,
} from 'lucide-react';
import { TabId } from '../types/navigation';
import { onboardingService } from '../services/onboardingService';
import { missionProgressService } from '../services/missionProgressService';
import {
  FlowerShape,
  StarShape,
  ZigZagShape,
  CircularProgressRing,
} from '../components/ui/AbstractDecorations';

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
  const progressMap = missionProgressService.getAllProgress();
  const completedMissionsCount = Object.values(progressMap).filter(
    (p) => p.status === 'selesai'
  ).length;

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
      {/* 1. Header Sapaan Ramah Anak dengan Dekorasi Geometris Classly */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'relative',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#FAE0E4',
              color: '#2D2D2B',
              padding: '4px 12px',
              borderRadius: 9999,
              fontSize: '0.74rem',
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            <span>Kreator Muda</span>
          </div>
          <h2
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              margin: '0 0 4px',
              color: '#2D2D2B',
              letterSpacing: '-0.02em',
            }}
          >
            Halo, {studentName}! 👋
          </h2>
          <p
            style={{
              fontSize: '0.86rem',
              color: '#6C6B66',
              margin: 0,
              lineHeight: 1.35,
            }}
          >
            Ayo rangkai logika koding dan bunyikan gamelan Jawa!
          </p>
        </div>

        {/* Dekorasi Bunga & Bintang Abstrak */}
        <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
          <FlowerShape size={42} color="#FFB2DD" opacity={0.8} />
          <div style={{ position: 'absolute', bottom: -4, right: -4 }}>
            <StarShape size={18} color="#9AAB65" />
          </div>
        </div>
      </div>

      {/* 2. Highlight Banner / Terakhir Dimainkan (Classly Flat Horizontal Card) */}
      <div
        style={{
          background: '#F8F3E7',
          borderRadius: 22,
          padding: '16px',
          border: '1.5px solid rgba(45, 45, 43, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -10,
            right: -10,
            opacity: 0.12,
            pointerEvents: 'none',
          }}
        >
          <ZigZagShape width={100} height={40} color="#2D2D2B" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 13,
                background: '#FFB2DD',
                color: '#2D2D2B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Code2 size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#6C6B66',
                  textTransform: 'uppercase',
                }}
              >
                Arena Koding Bebas
              </div>
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  margin: 0,
                  color: '#2D2D2B',
                }}
              >
                Susun & Bunyikan Gending
              </h3>
            </div>
          </div>

          <div
            style={{
              background: '#FEEFBF',
              color: '#2D2D2B',
              padding: '4px 10px',
              borderRadius: 9999,
              fontSize: '0.75rem',
              fontWeight: 800,
            }}
          >
            {totalStars} ⭐ Bintang
          </div>
        </div>

        <p
          style={{
            fontSize: '0.84rem',
            color: '#6C6B66',
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          Tarik blok tabuh saron, atur tempo, dan dengarkan perulangan irama gending secara langsung.
        </p>

        <button
          type="button"
          onClick={() => onNavigate('editor')}
          style={{
            minHeight: 44,
            padding: '0 20px',
            backgroundColor: '#FFB2DD',
            color: '#2D2D2B',
            border: 'none',
            borderRadius: 9999,
            fontWeight: 800,
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'none')}
        >
          <Play size={17} fill="#2D2D2B" color="#2D2D2B" />
          <span>Buka Editor Bebas</span>
        </button>
      </div>

      {/* 3. Bento Grid Modul (2 Kolom Khas Moodboard Classly) */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#2D2D2B',
              margin: 0,
            }}
          >
            Pilihan Modul Belajar
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#6C6B66', fontWeight: 600 }}>
            4 Area Interaktif
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {/* Bento 1: Eksplorasi Gamelan (Yellow) */}
          <div
            onClick={() => onNavigate('belajar')}
            style={{
              background: '#FEEFBF',
              borderRadius: 22,
              padding: '16px 14px',
              border: '1.5px solid rgba(247, 214, 110, 0.45)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 140,
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'none')}
          >
            <div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: '#F7D66E',
                  color: '#2D2D2B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Volume2 size={20} strokeWidth={2.5} />
              </div>
              <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#2D2D2B', margin: '0 0 2px' }}>
                Eksplorasi Gamelan
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#6C6B66', margin: 0, lineHeight: 1.3 }}>
                Tuts Saron, Demung & Gong
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <CircularProgressRing progressPercent={100} size={28} ringColor="#F7D66E" />
            </div>
          </div>

          {/* Bento 2: Susun Koding (Pink) */}
          <div
            onClick={() => onNavigate('editor')}
            style={{
              background: '#FAE0E4',
              borderRadius: 22,
              padding: '16px 14px',
              border: '1.5px solid rgba(255, 178, 221, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 140,
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'none')}
          >
            <div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: '#FFB2DD',
                  color: '#2D2D2B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Code2 size={20} strokeWidth={2.5} />
              </div>
              <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#2D2D2B', margin: '0 0 2px' }}>
                Susun Koding
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#6C6B66', margin: 0, lineHeight: 1.3 }}>
                Blok Logika & Tempo
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <CircularProgressRing progressPercent={80} size={28} ringColor="#FFB2DD" />
            </div>
          </div>

          {/* Bento 3: Tantangan Misi (Blue) */}
          <div
            onClick={() => onNavigate('misi')}
            style={{
              background: '#EAF0F9',
              borderRadius: 22,
              padding: '16px 14px',
              border: '1.5px solid rgba(182, 202, 235, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 140,
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'none')}
          >
            <div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: '#B6CAEB',
                  color: '#2D2D2B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Target size={20} strokeWidth={2.5} />
              </div>
              <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#2D2D2B', margin: '0 0 2px' }}>
                Tantangan Misi
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#6C6B66', margin: 0, lineHeight: 1.3 }}>
                {completedMissionsCount} / 6 Level Selesai
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <CircularProgressRing
                progressPercent={Math.round((completedMissionsCount / 6) * 100)}
                size={28}
                ringColor="#B6CAEB"
              />
            </div>
          </div>

          {/* Bento 4: Koleksi Karyaku (Olive Green) */}
          <div
            onClick={() => onNavigate('karyaku')}
            style={{
              background: '#E1E6D1',
              borderRadius: 22,
              padding: '16px 14px',
              border: '1.5px solid rgba(154, 171, 101, 0.45)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 140,
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'none')}
          >
            <div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: '#9AAB65',
                  color: '#2D2D2B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Sparkles size={20} strokeWidth={2.5} />
              </div>
              <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#2D2D2B', margin: '0 0 2px' }}>
                Koleksi Karyaku
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#6C6B66', margin: 0, lineHeight: 1.3 }}>
                Partitur Kepatihan & File
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <CircularProgressRing progressPercent={100} size={28} ringColor="#9AAB65" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Kartu Showcase Esai Dewan Juri (Warm Cream Surface) */}
      {onOpenJuryShowcase && (
        <div
          onClick={onOpenJuryShowcase}
          style={{
            background: '#F8F3E7',
            borderRadius: 22,
            padding: '16px',
            border: '1.5px solid rgba(45, 45, 43, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'none')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: '#FFB2DD',
                color: '#2D2D2B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Award size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#6C6B66',
                  textTransform: 'uppercase',
                }}
              >
                Esai Lomba • 5 Babak
              </div>
              <h3
                style={{
                  margin: '2px 0 0',
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  color: '#2D2D2B',
                }}
              >
                Showcase Presentasi Dewan Juri 🏆
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#6C6B66' }}>
                PISA 427, UNESCO 2021, Taksonomi Bloom & Hardware
              </p>
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9999,
              background: '#2D2D2B',
              color: '#FFFCF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ArrowRight size={18} />
          </div>
        </div>
      )}

      {/* 5. Tombol Putar Ulang Onboarding & Etika Budaya */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {onOpenOnboarding && (
          <button
            type="button"
            onClick={onOpenOnboarding}
            style={{
              minHeight: 44,
              background: '#F8F3E7',
              border: '1.5px solid rgba(45, 45, 43, 0.08)',
              borderRadius: 9999,
              padding: '0 16px',
              color: '#2D2D2B',
              fontSize: '0.84rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            <BookOpen size={16} /> Putar Ulang Panduan Onboarding
          </button>
        )}
      </div>
    </div>
  );
};
