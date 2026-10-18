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
    <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-squircle)',
              background: 'var(--color-pink-tint)',
              border: '1.5px solid var(--color-pink)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 800,
                margin: 0,
                color: 'var(--text-primary)',
              }}
            >
              Karyaku
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
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
              minHeight: 40,
              padding: '0 14px',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Unggah berkas proyek .gamelan"
          >
            <Upload size={15} /> Impor
          </button>

          <button
            type="button"
            onClick={() => onNavigate('editor')}
            style={{
              minHeight: 40,
              padding: '0 16px',
              background: 'var(--color-pink)',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--text-primary)',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 800,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Plus size={16} strokeWidth={2.5} /> Buat Baru
          </button>
        </div>
      </div>

      <div className="culture-disclaimer">
        <span>Karya disimpan secara lokal di peramban ini (tanpa backend/akun luar).</span>
      </div>

      {projects.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-card)',
            padding: '36px 16px',
            textAlign: 'center',
            border: '2px dashed var(--border-card)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Music size={40} color="var(--text-muted)" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Belum Ada Gending
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0, maxWidth: 280, lineHeight: 1.45 }}>
            Kamu belum menyimpan susunan pola tabuhan. Yuk buat kreasi pertamamu di Editor!
          </p>
          <button
            type="button"
            onClick={() => onNavigate('editor')}
            style={{
              minHeight: 44,
              padding: '0 20px',
              background: 'var(--color-pink)',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--text-primary)',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 800,
              fontSize: '0.88rem',
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
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-card)',
                padding: '16px',
                border: '1.5px solid var(--border-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-card)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
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
                  <Music size={22} strokeWidth={2.5} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h4
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      fontWeight: 800,
                      margin: 0,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {proj.title}
                  </h4>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 2, fontWeight: 600 }}>
                    {proj.date} • {proj.notesCount} ketukan tabuhan
                  </div>
                  {proj.description ? (
                    <div
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--text-primary)',
                        opacity: 0.75,
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
                    minHeight: 40,
                    padding: '0 14px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1.5px solid var(--text-primary)',
                    background: 'var(--color-pink)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontWeight: 800,
                    fontSize: '0.82rem',
                  }}
                  title="Buka dan mainkan di Editor"
                  aria-label={`Buka dan mainkan ${proj.title} di Editor`}
                >
                  <Play size={15} fill="currentColor" />
                  <span>Mainkan</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleShowKepatihan(proj, e)}
                  style={{
                    width: 40,
                    height: 40,
                    minWidth: 40,
                    minHeight: 40,
                    borderRadius: '50%',
                    border: '1.5px solid var(--border-subtle)',
                    background: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                  title="Lihat Partitur Notasi Kepatihan"
                  aria-label={`Lihat Partitur Notasi Kepatihan ${proj.title}`}
                >
                  <FileMusic size={17} />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDownload(proj, e)}
                  style={{
                    width: 40,
                    height: 40,
                    minWidth: 40,
                    minHeight: 40,
                    borderRadius: '50%',
                    border: '1.5px solid var(--border-subtle)',
                    background: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                  title="Unduh Berkas Proyek .gamelan"
                  aria-label={`Unduh Berkas ${proj.title}`}
                >
                  <Download size={17} />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDelete(proj.id, e)}
                  style={{
                    width: 40,
                    height: 40,
                    minWidth: 40,
                    minHeight: 40,
                    borderRadius: '50%',
                    border: '1.5px solid #fecaca',
                    background: '#fef2f2',
                    color: '#dc2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                  title="Hapus karya"
                  aria-label="Hapus karya"
                >
                  <Trash2 size={17} />
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
