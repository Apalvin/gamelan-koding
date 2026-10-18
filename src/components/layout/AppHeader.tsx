import React, { useState } from 'react';
import { Settings, User, X, Volume2, Globe, Music, BookOpen, RotateCcw, Award } from 'lucide-react';
import { onboardingService } from '../../services/onboardingService';

interface AppHeaderProps {
  onOpenSettings?: () => void;
  onOpenOnboarding?: () => void;
  onOpenJuryShowcase?: () => void;
  onResetAllData?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenOnboarding,
  onOpenJuryShowcase,
  onResetAllData,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [studentName, setStudentName] = useState(() => {
    return onboardingService.getStudentName();
  });

  const handleSaveName = (newName: string) => {
    setStudentName(newName);
    onboardingService.setStudentName(newName);
  };

  const handleResetTotal = () => {
    const confirmed = window.confirm(
      '⚠️ Apakah kamu yakin ingin mereset seluruh data aplikasi?\n\nSemua karya simpanan, bintang misi, draf blok koding, dan nama panggilan akan dihapus bersih kembali seperti saat baru pertama kali membuka aplikasi.'
    );
    if (confirmed) {
      onboardingService.resetAllAppStorage();
      setShowModal(false);
      if (onResetAllData) {
        onResetAllData();
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="app-title-group" style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: 36,
              height: 36,
              minWidth: 36,
              borderRadius: 12,
              background: '#FFB2DD',
              color: '#2D2D2B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid rgba(45, 45, 43, 0.1)',
              flexShrink: 0,
            }}
          >
            <Music size={19} strokeWidth={2.5} />
          </div>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <h1 className="app-title" style={{ margin: 0, lineHeight: 1.15, fontSize: '1.12rem', whiteSpace: 'nowrap' }}>
              GamelanCode
            </h1>
            <div style={{ fontSize: '0.66rem', color: '#6C6B66', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Musik Tradisi & Logika Blok
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span className="app-badge-pill" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
            SD Kelas 4–6
          </span>
          <button
            type="button"
            className="icon-btn-profile"
            onClick={() => setShowModal(true)}
            aria-label="Pengaturan dan Profil"
            title="Pengaturan Siswa"
          >
            <Settings size={20} color="#2D2D2B" />
          </button>
        </div>
      </header>

      {/* Modal Pengaturan & Profil (Classly Warm Surface Aesthetic) */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(45, 45, 43, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#F8F3E7',
              borderRadius: 24,
              padding: 24,
              width: '100%',
              maxWidth: 380,
              border: '1.5px solid rgba(45, 45, 43, 0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: '#FFB2DD',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2D2D2B',
                  }}
                >
                  <User size={18} strokeWidth={2.5} />
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#2D2D2B' }}>Profil Siswa</h2>
              </div>
              <button
                type="button"
                className="btn-back-circle"
                onClick={() => setShowModal(false)}
                aria-label="Tutup pengaturan"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#2D2D2B', marginBottom: 6 }}>
                Nama Panggilan:
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => handleSaveName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: '1.5px solid rgba(45, 45, 43, 0.15)',
                  background: '#FFFCF5',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  color: '#2D2D2B',
                  outline: 'none',
                }}
                placeholder="Tulis nama panggilanmu..."
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#FFFCF5',
                  borderRadius: 14,
                  border: '1px solid rgba(45, 45, 43, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Volume2 size={18} color="#2D2D2B" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#2D2D2B' }}>Suara Simulasi</span>
                </div>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: '#2D2D2B',
                    background: '#E1E6D1',
                    padding: '3px 8px',
                    borderRadius: 9999,
                  }}
                >
                  Aktif
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#FFFCF5',
                  borderRadius: 14,
                  border: '1px solid rgba(45, 45, 43, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Globe size={18} color="#2D2D2B" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#2D2D2B' }}>Bahasa Petunjuk</span>
                </div>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: '#2D2D2B',
                    background: '#FEEFBF',
                    padding: '3px 8px',
                    borderRadius: 9999,
                  }}
                >
                  Indonesia
                </span>
              </div>
            </div>

            {/* Peringatan Integritas Budaya Khusus di Pengaturan */}
            <div
              style={{
                background: '#FFFCF5',
                border: '1.5px solid rgba(45, 45, 43, 0.12)',
                borderRadius: 14,
                padding: '12px 14px',
                marginBottom: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: '0.9rem' }}>⚠️</span>
                <strong style={{ fontSize: '0.8rem', color: '#2D2D2B', fontWeight: 800 }}>
                  Integritas Budaya
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.73rem', color: '#6C6B66', lineHeight: 1.45 }}>
                Pola tabuhan prototipe adalah contoh simulasi (belum divalidasi praktisi karawitan). Media ini melatih berpikir komputasional, bukan menggantikan estetika rasa penabuh gamelan asli.
              </p>
            </div>

            {/* Buka Panduan Onboarding */}
            {onOpenOnboarding && (
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  onOpenOnboarding();
                }}
                style={{
                  width: '100%',
                  minHeight: 44,
                  padding: '0 14px',
                  background: '#FAE0E4',
                  border: 'none',
                  borderRadius: 9999,
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  color: '#2D2D2B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <BookOpen size={16} /> Buka Panduan Onboarding
              </button>
            )}

            {/* Showcase Dewan Juri */}
            {onOpenJuryShowcase && (
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  onOpenJuryShowcase();
                }}
                style={{
                  width: '100%',
                  minHeight: 44,
                  padding: '0 14px',
                  background: '#FEEFBF',
                  border: 'none',
                  borderRadius: 9999,
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  color: '#2D2D2B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <Award size={16} /> Showcase Esai Dewan Juri
              </button>
            )}

            {/* Lab / Debug Audio */}
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                window.location.hash = '#debug-audio';
              }}
              style={{
                width: '100%',
                minHeight: 44,
                padding: '0 14px',
                background: '#EAF0F9',
                border: 'none',
                borderRadius: 9999,
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#2D2D2B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                marginBottom: 8,
              }}
            >
              🛠️ Buka Lab / Debug Audio
            </button>

            {/* Reset Total Aplikasi (Clean Slate) */}
            <button
              type="button"
              onClick={handleResetTotal}
              style={{
                width: '100%',
                minHeight: 44,
                padding: '0 14px',
                background: '#FFFCF5',
                border: '1.5px solid rgba(220, 38, 38, 0.3)',
                borderRadius: 9999,
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#dc2626',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <RotateCcw size={16} /> Reset Semua Data
            </button>
          </div>
        </div>
      )}
    </>
  );
};
