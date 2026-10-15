import React, { useState } from 'react';
import { Settings, User, X, Volume2, Globe, Music } from 'lucide-react';

interface AppHeaderProps {
  onOpenSettings?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = () => {
  const [showModal, setShowModal] = useState(false);
  const [studentName, setStudentName] = useState(() => {
    try {
      return localStorage.getItem('gamelan_student_name') || 'Pengrawit Cilik';
    } catch {
      return 'Pengrawit Cilik';
    }
  });

  const handleSaveName = (newName: string) => {
    setStudentName(newName);
    try {
      localStorage.setItem('gamelan_student_name', newName);
    } catch {
      // safe fallback
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="app-title-group">
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #10b981, #047857)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.35)'
          }}>
            <Music size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="app-title" style={{ margin: 0, lineHeight: 1.2 }}>Gamelan Koding</h1>
            <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Musik Tradisi & Logika Blok</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="app-badge-pill">SD Kelas 4–6</span>
          <button
            type="button"
            className="icon-btn-profile"
            onClick={() => setShowModal(true)}
            aria-label="Pengaturan dan Profil"
            title="Pengaturan Siswa"
          >
            <Settings size={22} color="#334155" />
          </button>
        </div>
      </header>

      {/* Modal Pengaturan & Profil Ramah Anak */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 24,
              padding: 24,
              width: '100%',
              maxWidth: 380,
              boxShadow: '0 20px 35px rgba(0,0,0,0.2)',
              border: '2px solid #e2e8f0'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={24} color="#0f766e" />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f766e' }}>Profil Siswa</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  minWidth: 44,
                  minHeight: 44,
                  borderRadius: '50%',
                  border: 'none',
                  background: '#f1f5f9',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Tutup pengaturan"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                Nama Panggilan:
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => handleSaveName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '2px solid #cbd5e1',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
                placeholder="Tulis nama panggilanmu..."
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                background: '#f8fafc',
                borderRadius: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Volume2 size={18} color="#0284c7" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Suara Simulasi</span>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>Aktif</span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                background: '#f8fafc',
                borderRadius: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Globe size={18} color="#0284c7" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Bahasa Petunjuk</span>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Indonesia</span>
              </div>
            </div>

            <div className="culture-disclaimer" style={{ marginBottom: 16 }}>
              <span>ℹ️ Suara simulasi hanyalah pendekatan, bukan representasi penuh gamelan asli.</span>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                width: '100%',
                minHeight: 46,
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: 14,
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Simpan & Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};
