import React, { useState, useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { Sparkles, Music, Trash2, Plus, Play, Download, Upload, FileMusic } from 'lucide-react';
import { TabId } from '../types/navigation';
import { karyakuService, SavedProject } from '../services/karyakuService';
import { downloadProjectFile, parseProjectJson } from '../services/projectExportImportService';
import { convertEventsToKepatihan } from '../compiler/kepatihanConverter';
import { compileWorkspace } from '../compiler/compileWorkspace';
import { KepatihanModal } from '../components/karyaku/KepatihanModal';

interface KaryakuPageProps {
  onNavigate: (tab: TabId) => void;
  onOpenProject?: (project: SavedProject, autoPlay?: boolean) => void;
}

export const KaryakuPage: React.FC<KaryakuPageProps> = ({
  onNavigate,
  onOpenProject,
}) => {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [activeKepatihanProject, setActiveKepatihanProject] = useState<{ title: string; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshProjects = () => {
    setProjects(karyakuService.getAllProjects());
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm('Apakah kamu yakin ingin menghapus karya ini dari Karyaku?');
    if (confirmed) {
      karyakuService.deleteProject(id);
      refreshProjects();
    }
  };

  const handleOpen = (proj: SavedProject, autoPlay = true) => {
    if (onOpenProject) {
      onOpenProject(proj, autoPlay);
    } else {
      karyakuService.saveDraftXml(proj.xml);
      onNavigate('editor');
    }
  };

  const handleDownload = (proj: SavedProject, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadProjectFile(proj);
  };

  const handleShowKepatihan = (proj: SavedProject, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const headlessWs = new Blockly.Workspace();
      const dom = Blockly.utils.xml.textToDom(proj.xml);
      Blockly.Xml.domToWorkspace(dom, headlessWs);
      const res = compileWorkspace(headlessWs);
      headlessWs.dispose();
      if (res.success) {
        const text = convertEventsToKepatihan(res.events);
        setActiveKepatihanProject({ title: proj.title, text });
      } else {
        setActiveKepatihanProject({ title: proj.title, text: `// Belum dapat diekstrak: ${res.error}` });
      }
    } catch (err) {
      console.error('Failed to parse XML for Kepatihan', err);
      setActiveKepatihanProject({ title: proj.title, text: '// Belum dapat membaca blok untuk notasi kepatihan' });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const res = parseProjectJson(content);
      if (res.success && res.project) {
        karyakuService.saveProject({
          title: res.project.title,
          description: res.project.description,
          notesCount: res.project.notesCount,
          xml: res.project.xml,
        });
        refreshProjects();
        alert(`Berhasil mengimpor proyek: "${res.project.title}"!`);
      } else {
        alert(res.error || 'Gagal mengimpor berkas proyek.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#fdf2f8',
              color: '#db2777',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>
              Karyaku
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Koleksi tabuhan dan gending kreasimu
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Input Tersembunyi Berkas Proyek */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".gamelan,.json"
            style={{ display: 'none' }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              minHeight: 44,
              padding: '0 12px',
              background: '#f1f5f9',
              color: '#334155',
              border: '1.5px solid #cbd5e1',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
            title="Unggah berkas proyek .gamelan"
          >
            <Upload size={16} /> Impor
          </button>

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
              cursor: 'pointer',
            }}
          >
            <Plus size={18} /> Buat Baru
          </button>
        </div>
      </div>

      <div className="culture-disclaimer">
        <span>Karya disimpan secara lokal di peramban ini (tanpa backend/akun luar).</span>
      </div>

      {projects.length === 0 ? (
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: '32px 16px',
            textAlign: 'center',
            border: '2px dashed #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Music size={40} color="#94a3b8" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', margin: 0 }}>
            Belum Ada Gending
          </h3>
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
              cursor: 'pointer',
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
              onClick={() => handleOpen(proj, false)}
              style={{
                background: 'white',
                borderRadius: 16,
                padding: '16px',
                border: '2px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: '#fef3c7',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Music size={22} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h4
                    style={{
                      fontSize: '0.98rem',
                      fontWeight: 700,
                      margin: 0,
                      color: '#1e293b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {proj.title}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                    {proj.date} • {proj.notesCount} ketukan tabuhan
                  </div>
                  {proj.description ? (
                    <div
                      style={{
                        fontSize: '0.74rem',
                        color: '#94a3b8',
                        marginTop: 2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {proj.description}
                    </div>
                  ) : null}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 12, flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpen(proj, true);
                  }}
                  style={{
                    minHeight: 44,
                    padding: '0 14px',
                    borderRadius: 12,
                    border: 'none',
                    background: '#10b981',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)',
                  }}
                  title="Buka dan mainkan di Editor"
                  aria-label={`Buka dan mainkan ${proj.title} di Editor`}
                >
                  <Play size={16} fill="white" />
                  <span>Mainkan</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleShowKepatihan(proj, e)}
                  style={{
                    minWidth: 44,
                    minHeight: 44,
                    borderRadius: 10,
                    border: '1.5px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#334155',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Lihat Partitur Notasi Kepatihan"
                  aria-label={`Lihat Partitur Notasi Kepatihan ${proj.title}`}
                >
                  <FileMusic size={18} />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDownload(proj, e)}
                  style={{
                    minWidth: 44,
                    minHeight: 44,
                    borderRadius: 10,
                    border: '1.5px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#334155',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Unduh Berkas Proyek .gamelan"
                  aria-label={`Unduh Berkas ${proj.title}`}
                >
                  <Download size={18} />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDelete(proj.id, e)}
                  style={{
                    minWidth: 44,
                    minHeight: 44,
                    borderRadius: 10,
                    border: '1.5px solid #fee2e2',
                    background: '#fef2f2',
                    color: '#dc2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Hapus karya"
                  aria-label="Hapus karya"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeKepatihanProject && (
        <KepatihanModal
          title={activeKepatihanProject.title}
          kepatihanText={activeKepatihanProject.text}
          onClose={() => setActiveKepatihanProject(null)}
        />
      )}
    </div>
  );
};
