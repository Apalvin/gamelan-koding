import { SavedProject } from './karyakuService';

export interface GamelanProjectFile {
  app: 'GamelanCode';
  version: '1.0';
  title: string;
  description: string;
  notesCount: number;
  xml: string;
  exportedAt: string;
}

export function createProjectJson(project: SavedProject): string {
  const fileData: GamelanProjectFile = {
    app: 'GamelanCode',
    version: '1.0',
    title: project.title,
    description: project.description || '',
    notesCount: project.notesCount,
    xml: project.xml,
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(fileData, null, 2);
}

export function parseProjectJson(jsonString: string): {
  success: boolean;
  project?: SavedProject;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || parsed.app !== 'GamelanCode') {
      return {
        success: false,
        error: 'Berkas tidak dikenali sebagai format proyek GamelanCode yang valid.',
      };
    }
    if (!parsed.title || !parsed.xml) {
      return {
        success: false,
        error: 'Data proyek tidak lengkap (judul atau blok program tidak ditemukan).',
      };
    }

    const importedProject: SavedProject = {
      id: `imported_${Date.now()}`,
      title: String(parsed.title),
      description: String(parsed.description || ''),
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      notesCount: Number(parsed.notesCount || 0),
      xml: String(parsed.xml),
    };

    return { success: true, project: importedProject };
  } catch (err) {
    return {
      success: false,
      error: 'Format berkas rusak atau bukan JSON yang valid.',
    };
  }
}

export function downloadProjectFile(project: SavedProject): void {
  const jsonContent = createProjectJson(project);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const safeTitle = project.title.toLowerCase().replace(/[^a-z0-9_-]/g, '_');

  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeTitle}.gamelan`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
