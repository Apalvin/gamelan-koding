import { describe, it, expect } from 'vitest';
import { createProjectJson, parseProjectJson } from '../../src/services/projectExportImportService';
import { SavedProject } from '../../src/services/karyakuService';

describe('projectExportImportService', () => {
  const sampleProject: SavedProject = {
    id: 'proj_123',
    title: 'Gending Pelog Ceria',
    description: 'Kreasi nada lancaran',
    notesCount: 8,
    xml: '<xml><block type="tabuh_saron"></block></xml>',
    createdAt: 1729000000000,
    updatedAt: 1729000000000,
  };

  it('harus menghasilkan string JSON valid dengan format standar GamelanCode', () => {
    const jsonStr = createProjectJson(sampleProject);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.app).toBe('GamelanCode');
    expect(parsed.version).toBe('1.0');
    expect(parsed.title).toBe('Gending Pelog Ceria');
    expect(parsed.notesCount).toBe(8);
  });

  it('harus berhasil mem-parsing file JSON yang sah', () => {
    const jsonStr = createProjectJson(sampleProject);
    const result = parseProjectJson(jsonStr);
    expect(result.success).toBe(true);
    expect(result.project?.title).toBe('Gending Pelog Ceria');
    expect(result.project?.xml).toBe(sampleProject.xml);
  });

  it('harus menolak JSON yang tidak valid atau struktur rusak', () => {
    const result = parseProjectJson('bukan json valid');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();

    const result2 = parseProjectJson('{"app": "Lain"}');
    expect(result2.success).toBe(false);
  });
});
