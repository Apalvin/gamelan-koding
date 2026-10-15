import React, { useState, useEffect } from 'react';
import { Sparkles, Music, Trash2, Plus, Play } from 'lucide-react';
import { TabId } from '../types/navigation';

interface KaryakuPageProps {
  onNavigate: (tab: TabId) => void;
}

interface SavedProject {
  id: string;
  title: string;
  date: string;
  notesCount: number;
}

export const KaryakuPage: React.FC<KaryakuPageProps> = ({ onNavigate }) => {
  const [projects, setProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gamelan_karyaku');
      if (stored) {
        setProjects(JSON.parse(stored));
      } else {
        // Dummy data contoh awal
        setProjects([
          {
            id: 'sample-1',
            title: 'Ladrang Saron Cilik (Contoh)',
            date: 'Hari ini',
            notesCount: 8,
          },
        ]);
      }
    } catch {
      setProjects([]);
    }
  }, []);

  const handleDelete = (id: string) => {
    try {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      localStorage.setItem('gamelan_karyaku', JSON.stringify(updated));
    } catch {
      // safe fallback
    }
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fdf2f8', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>Karyaku</h2>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Koleksi tabuhan dan gending kreasimu</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('editor')}
          style={{
            minHeight: 44,
            padding: '0 14px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer'
          }}
        >
          <Plus size={18} /> Buat Baru
        </button>
      </div>

      <div className="culture-disclaimer">
        <span>Karya disimpan secara lokal di peramban ini (tanpa backend/akun luar).</span>
      </div>

      {projects.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: 20,
          padding: '32px 16px',
          textAlign: 'center',
          border: '2px dashed #cbd5e1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12
        }}>
          <Music size={40} color="#94a3b8" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', margin: 0 }}>Belum Ada Gending</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, maxWidth: 260 }}>
            Kamu belum menyimpan susunan pola tabuhan. Yuk buat kreasi pertamamu di Editor!
          </p>
          <button
            type="button"
            onClick={() => onNavigate('editor')}
            style={{
              minHeight: 44,
              padding: '0 20px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Mulai Koding di Editor
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {projects.map((proj) => (
            <div
              key={proj.id}
              style={{
                background: 'white',
                borderRadius: 16,
                padding: '16px',
                border: '2px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Music size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>{proj.title}</h4>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                    {proj.date} • {proj.notesCount} ketukan
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => onNavigate('editor')}
                  style={{
                    minWidth: 44,
                    minHeight: 44,
                    borderRadius: 10,
                    border: 'none',
                    background: '#f0fdf4',
                    color: '#15803d',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Buka di Editor"
                  aria-label="Buka di Editor"
                >
                  <Play size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(proj.id)}
                  style={{
                    minWidth: 44,
                    minHeight: 44,
                    borderRadius: 10,
                    border: 'none',
                    background: '#fef2f2',
                    color: '#dc2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Hapus"
                  aria-label="Hapus karya"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
