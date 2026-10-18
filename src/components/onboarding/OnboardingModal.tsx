import React, { useState } from 'react';
import {
  Sparkles,
  Music,
  Compass,
  Users,
  User,
  Play,
  Square,
  ArrowRight,
  ArrowLeft,
  X,
  Volume2,
  CheckCircle2,
} from 'lucide-react';
import { onboardingService, FINAL_CHALLENGE_PLAYBACK_EVENTS } from '../../services/onboardingService';
import { digitalSimOutput } from '../../audio/digitalSimOutput';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChallenge: () => void;
  onSkipToMissions: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartChallenge,
  onSkipToMissions,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [studentName, setStudentName] = useState(() => onboardingService.getStudentName());
  const [isPlayingTarget, setIsPlayingTarget] = useState(false);

  if (!isOpen) return null;

  const totalSlides = 5;

  const handleNext = () => {
    if (currentSlide === 3) {
      onboardingService.setStudentName(studentName);
    }
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    digitalSimOutput.stop();
    setIsPlayingTarget(false);
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleTogglePlayTarget = async () => {
    if (isPlayingTarget) {
      digitalSimOutput.stop();
      setIsPlayingTarget(false);
      return;
    }

    try {
      setIsPlayingTarget(true);
      await digitalSimOutput.play(FINAL_CHALLENGE_PLAYBACK_EVENTS);
      setIsPlayingTarget(false);
    } catch {
      setIsPlayingTarget(false);
    }
  };

  const handleFinishWithChallenge = () => {
    digitalSimOutput.stop();
    onboardingService.setStudentName(studentName);
    onboardingService.setOnboardingCompleted(true);
    onStartChallenge();
  };

  const handleFinishWithMissions = () => {
    digitalSimOutput.stop();
    onboardingService.setStudentName(studentName);
    onboardingService.setOnboardingCompleted(true);
    onSkipToMissions();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(45, 45, 43, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: 'var(--bg-app)',
          borderRadius: 24,
          padding: '24px 20px',
          width: '100%',
          maxWidth: 480,
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1.5px solid var(--border-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          position: 'relative',
        }}
      >
        {/* Tombol Kembali Header (muncul di slide > 0) */}
        {currentSlide > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              background: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: 'var(--radius-pill)',
              height: 36,
              padding: '0 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 800,
              zIndex: 10,
            }}
            aria-label="Kembali ke slide sebelumnya"
          >
            <ArrowLeft size={15} strokeWidth={2.5} />
            <span>Kembali</span>
          </button>
        )}

        {/* Tombol Tutup Circular Dark */}
        <button
          type="button"
          onClick={onClose}
          className="btn-back-circle"
          style={{ position: 'absolute', top: 14, right: 14, zIndex: 10 }}
          aria-label="Tutup Panduan"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* Indikator Titik Slide */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 4 }}>
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div
              key={idx}
              style={{
                width: idx === currentSlide ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: idx === currentSlide ? 'var(--color-pink)' : 'var(--border-subtle)',
                transition: 'all 0.25s ease',
              }}
            />
          ))}
        </div>

        {/* KONTEN SLIDE */}
        {currentSlide === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'center', padding: '8px 0' }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)',
              }}
            >
              <Music size={36} />
            </div>

            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#ecfdf5',
                  color: '#047857',
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                <Sparkles size={14} /> Belajar Musik & Koding Seru
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 8px', color: '#0f172a' }}>
                Sugeng Rawuh di GamelanCode!
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                Di sini kamu bisa belajar menyusun algoritma koding blok seperti puzzle sambil membunyikan alat musik
                gamelan Jawa laras slendro yang merdu.
              </p>
            </div>

            <div
              style={{
                background: '#f8fafc',
                borderRadius: 16,
                padding: '14px',
                border: '1.5px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem', color: '#1e293b' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span>Membunyikan bilah saron, demung, peking & gong ageng</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem', color: '#1e293b' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span>Menyusun instruksi drag & drop tanpa takut salah</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem', color: '#1e293b' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span>Menaklukkan 6 level misi karawitan berhadiah bintang</span>
              </div>
            </div>
          </div>
        )}

        {currentSlide === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#fef3c7',
                  color: '#b45309',
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                <Compass size={14} /> Jelajahi 5 Tab Utama
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>
                Peta Petualanganmu
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { title: 'Beranda', desc: 'Sapaan hangat & ringkasan petualanganmu.', color: '#3b82f6', bg: '#eff6ff' },
                { title: 'Belajar', desc: 'Materi mengenal instrumen & nada slendro.', color: '#8b5cf6', bg: '#f5f3ff' },
                { title: 'Editor Blok', desc: 'Kanvas bebas menyusun blok & mendengar audio.', color: '#10b981', bg: '#ecfdf5' },
                { title: 'Misi (C1–C6)', desc: 'Tantangan seru kuis, puzzle, dan koding.', color: '#f59e0b', bg: '#fef3c7' },
                { title: 'Karyaku', desc: 'Menyimpan pola gending buatanmu sendiri.', color: '#db2777', bg: '#fdf2f8' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: item.bg,
                    border: `1.5px solid ${item.color}33`,
                    borderRadius: 12,
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: item.color,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#1e293b' }}>{item.title}</strong>
                    <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentSlide === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'center', padding: '6px 0' }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 20,
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <Users size={34} />
            </div>

            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#fef3c7',
                  color: '#b45309',
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                <Sparkles size={14} /> Nilai Tradisi Karawitan
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px', color: '#0f172a' }}>
                Jembatan Menuju Gamelan Asli
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                Aplikasi ini adalah jembatan belajar, bukan pengganti guru atau pengrawit. Melalui simulasi koding ini,
                kamu dipersiapkan agar lebih percaya diri saat berlatih langsung di gamelan fisik bersama bapak/ibu guru di sanggar dan sekolah!
              </p>
            </div>

            <div
              style={{
                background: '#fafaf9',
                border: '1.5px dashed #cbd5e1',
                borderRadius: 16,
                padding: '14px',
                fontStyle: 'italic',
                fontSize: '0.85rem',
                color: '#64748b',
                lineHeight: 1.4,
              }}
            >
              "Gamelan bukan hanya tentang memukul bilah, melainkan tentang kebersamaan, rasa, dan saling mendengarkan dalam keindahan."
            </div>
          </div>
        )}

        {currentSlide === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'center', padding: '6px 0' }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 20,
                background: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <User size={34} />
            </div>

            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#e0f2fe',
                  color: '#0369a1',
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                <Sparkles size={14} /> Profil Pengrawit Cilik
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px', color: '#0f172a' }}>
                Kenalan Dulu, Yuk!
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                Tulis nama panggilanmu agar aplikasi bisa menyapamu secara akrab setiap kali kamu belajar:
              </p>
            </div>

            <div style={{ textAlign: 'left' }}>
              <label
                htmlFor="onboarding-name"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}
              >
                Nama Panggilanmu *
              </label>
              <input
                id="onboarding-name"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="misal: Budi, Siti, Raden"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: '2px solid #cbd5e1',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: 4 }}>
                Data disimpan aman di peramban ini tanpa akun luar / login.
              </div>
            </div>
          </div>
        )}

        {currentSlide === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'center', padding: '4px 0' }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#fef3c7',
                  color: '#b45309',
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                <Sparkles size={14} /> Tantangan Gending Akhir
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px', color: '#0f172a' }}>
                Bisakah Kamu Meniru Pola Ini?
              </h2>
              <p style={{ fontSize: '0.84rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                Sebelum melangkah ke misi dasar, dengarkan tabuhan lancaran 8 ketukan berpadu gong berikut. Bisakah kamu
                langsung menirunya di Editor?
              </p>
            </div>

            {/* Kotak Target Lancaran 8 Ketukan */}
            <div
              style={{
                background: '#fafaf9',
                borderRadius: 16,
                padding: '14px',
                border: '1.5px solid #e7e5e4',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#78350f' }}>
                Pola Lancaran Penutup (8 Ketukan):
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 6,
                  flexWrap: 'wrap',
                }}
              >
                {['3', '5', '3', '2', '3', '5', '6', '5+Gong'].map((note, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: idx === 7 ? '#fef08a' : '#f1f5f9',
                      border: idx === 7 ? '1.5px solid #eab308' : '1.5px solid #cbd5e1',
                      borderRadius: 8,
                      padding: '4px 8px',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      color: idx === 7 ? '#713f12' : '#334155',
                    }}
                  >
                    {note}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={handleTogglePlayTarget}
                style={{
                  minHeight: 42,
                  padding: '0 16px',
                  background: isPlayingTarget ? '#fee2e2' : '#fef3c7',
                  color: isPlayingTarget ? '#dc2626' : '#92400e',
                  border: isPlayingTarget ? '1.5px solid #f87171' : '1.5px solid #f59e0b',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  alignSelf: 'center',
                  marginTop: 2,
                }}
              >
                {isPlayingTarget ? (
                  <>
                    <Square size={16} fill="currentColor" /> Hentikan Contoh
                  </>
                ) : (
                  <>
                    <Volume2 size={16} /> Dengarkan Pola Target
                  </>
                )}
              </button>
            </div>

            {/* Pilihan Aksi Coba / Lewati / Kembali */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <button
                type="button"
                onClick={handleFinishWithChallenge}
                style={{
                  minHeight: 46,
                  background: 'var(--color-pink)',
                  color: 'var(--text-primary)',
                  border: '1.5px solid var(--text-primary)',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Play size={18} fill="currentColor" /> Coba Dulu di Editor! 🚀
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={handlePrev}
                  style={{
                    flex: '0 0 auto',
                    minHeight: 44,
                    padding: '0 16px',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    border: '1.5px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    cursor: 'pointer',
                  }}
                  aria-label="Kembali ke slide sebelumnya"
                >
                  <ArrowLeft size={16} strokeWidth={2.5} />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinishWithMissions}
                  style={{
                    flex: 1,
                    minHeight: 44,
                    padding: '0 14px',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    border: '1.5px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    cursor: 'pointer',
                  }}
                >
                  <span>Lewati & Mulai Misi C1</span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tombol Navigasi Slide (Bawah) untuk Slide 0 s.d. 3 */}
        {currentSlide < 4 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            {currentSlide > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                style={{
                  minHeight: 42,
                  padding: '0 16px',
                  background: 'var(--bg-surface)',
                  border: '1.5px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-pill)',
                  color: 'var(--text-primary)',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft size={16} strokeWidth={2.5} /> Kembali
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              style={{
                minHeight: 44,
                padding: '0 22px',
                background: 'var(--color-pink)',
                border: '1.5px solid var(--text-primary)',
                borderRadius: 'var(--radius-pill)',
                color: 'var(--text-primary)',
                fontWeight: 800,
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>Lanjut</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
