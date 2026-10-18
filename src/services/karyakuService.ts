export interface SavedProject {
  id: string;
  title: string;
  description?: string;
  date: string;
  notesCount: number;
  xml: string;
}

export const DEFAULT_SAMPLE_XML = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="ketika_mulai" id="hat" x="36" y="40"><next><block type="tabuh_saron" id="s1"><field name="INSTRUMENT">saron</field><field name="NOTE">1</field><next><block type="tabuh_saron" id="s2"><field name="INSTRUMENT">saron</field><field name="NOTE">2</field><next><block type="tabuh_saron" id="s3"><field name="INSTRUMENT">saron</field><field name="NOTE">3</field><next><block type="tabuh_saron" id="s4"><field name="INSTRUMENT">saron</field><field name="NOTE">5</field><next><block type="tabuh_gong" id="g1"></block></next></block></next></block></next></block></next></block></next></block></xml>`;

const STORAGE_KEY_KARYAKU = 'gamelan_karyaku';
const STORAGE_KEY_DRAFT_XML = 'gamelan_editor_draft_xml';

export class KaryakuService {
  public readonly DEFAULT_SAMPLE_XML = DEFAULT_SAMPLE_XML;
  private memoryProjects: SavedProject[] | null = null;
  private memoryDraftXml: string | null = null;

  private isLocalStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && window.localStorage !== null;
    } catch {
      return false;
    }
  }

  /**
   * Mengambil semua karya tersimpan dari localStorage atau memory cache.
   * Jika kosong, sediakan 1 sampel contoh awal dengan XML lengkap.
   */
  public getAllProjects(): SavedProject[] {
    if (this.memoryProjects !== null) {
      return this.memoryProjects;
    }

    if (!this.isLocalStorageAvailable()) {
      this.memoryProjects = [
        {
          id: 'sample-1',
          title: 'Lancaran Saron Slendro (Contoh)',
          description: 'Tabuhan saron nada 1, 2, 3, 5 diakhiri gong',
          date: 'Hari ini',
          notesCount: 5,
          xml: DEFAULT_SAMPLE_XML,
        },
      ];
      return this.memoryProjects;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY_KARYAKU);
      if (!stored) {
        this.memoryProjects = [
          {
            id: 'sample-1',
            title: 'Lancaran Saron Slendro (Contoh)',
            description: 'Tabuhan saron nada 1, 2, 3, 5 diakhiri gong',
            date: 'Hari ini',
            notesCount: 5,
            xml: DEFAULT_SAMPLE_XML,
          },
        ];
        return this.memoryProjects;
      }
      const list: SavedProject[] = JSON.parse(stored);
      // Pastikan data lama yang belum punya xml tetap memiliki fallback XML
      this.memoryProjects = list.map((item) => ({
        ...item,
        xml: item.xml && item.xml.trim().length > 0 ? item.xml : DEFAULT_SAMPLE_XML,
      }));
      return this.memoryProjects;
    } catch (err) {
      console.error('karyakuService: gagal membaca proyek', err);
      this.memoryProjects = [];
      return this.memoryProjects;
    }
  }

  /**
   * Menyimpan karya baru atau memperbarui karya yang sudah ada.
   */
  public saveProject(params: {
    title: string;
    description?: string;
    notesCount: number;
    xml: string;
    id?: string;
  }): SavedProject {
    const list = this.getAllProjects();
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });

    const newProject: SavedProject = {
      id: params.id || 'karya-' + Date.now(),
      title: params.title.trim() || 'Gending Kreasiku',
      description: params.description?.trim() || '',
      date: dateFormatted,
      notesCount: params.notesCount || 0,
      xml: params.xml.trim() || DEFAULT_SAMPLE_XML,
    };

    const updatedList = [newProject, ...list.filter((p) => p.id !== newProject.id)];
    this.memoryProjects = updatedList;

    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.setItem(STORAGE_KEY_KARYAKU, JSON.stringify(updatedList));
      } catch (err) {
        console.error('karyakuService: gagal menyimpan proyek', err);
      }
    }

    return newProject;
  }

  /**
   * Menghapus karya berdasarkan ID.
   */
  public deleteProject(id: string): void {
    const list = this.getAllProjects();
    const updated = list.filter((p) => p.id !== id);
    this.memoryProjects = updated;

    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.setItem(STORAGE_KEY_KARYAKU, JSON.stringify(updated));
      } catch (err) {
        console.error('karyakuService: gagal menghapus proyek', err);
      }
    }
  }

  /**
   * Mengambil draft lembar kerja aktif saat berpindah tab.
   */
  public getDraftXml(): string | null {
    if (this.memoryDraftXml !== null) {
      return this.memoryDraftXml;
    }

    if (!this.isLocalStorageAvailable()) {
      return null;
    }

    try {
      const draft = localStorage.getItem(STORAGE_KEY_DRAFT_XML);
      if (draft && draft.trim().length > 0) {
        this.memoryDraftXml = draft;
        return draft;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Menyimpan draft lembar kerja aktif secara otomatis.
   */
  public saveDraftXml(xml: string): void {
    this.memoryDraftXml = xml;
    if (this.isLocalStorageAvailable()) {
      try {
        if (xml && xml.trim().length > 0) {
          localStorage.setItem(STORAGE_KEY_DRAFT_XML, xml);
        }
      } catch (err) {
        console.error('karyakuService: gagal menyimpan draft xml', err);
      }
    }
  }

  /**
   * Membersihkan draft lembar kerja (misal saat reset total).
   */
  public clearDraftXml(): void {
    this.memoryDraftXml = null;
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.removeItem(STORAGE_KEY_DRAFT_XML);
      } catch (err) {
        console.error('karyakuService: gagal membersihkan draft xml', err);
      }
    }
  }

  /**
   * Reset data untuk keperluan pengujian unit.
   */
  public resetAll(): void {
    this.memoryProjects = null;
    this.memoryDraftXml = null;
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.removeItem(STORAGE_KEY_KARYAKU);
        localStorage.removeItem(STORAGE_KEY_DRAFT_XML);
      } catch {}
    }
  }
}

export const karyakuService = new KaryakuService();
