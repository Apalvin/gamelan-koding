import { describe, it, expect, beforeEach } from 'vitest';
import { karyakuService, DEFAULT_SAMPLE_XML } from '../../src/services/karyakuService';

describe('karyakuService', () => {
  beforeEach(() => {
    karyakuService.resetAll();
  });

  it('harus mengembalikan 1 sampel awal dengan XML jika belum ada karya', () => {
    const list = karyakuService.getAllProjects();
    expect(list.length).toBe(1);
    expect(list[0].id).toBe('sample-1');
    expect(list[0].xml).toBe(DEFAULT_SAMPLE_XML);
    expect(list[0].notesCount).toBeGreaterThan(0);
  });

  it('harus dapat menyimpan karya baru dan menyertakan XML', () => {
    const dummyXml = '<xml><block type="tabuh_saron"></block></xml>';
    const saved = karyakuService.saveProject({
      title: 'Gending Pelog Cilik',
      description: 'Latihan kreasi sendiri',
      notesCount: 8,
      xml: dummyXml,
    });

    expect(saved.id).toBeDefined();
    expect(saved.title).toBe('Gending Pelog Cilik');
    expect(saved.xml).toBe(dummyXml);

    const reloaded = karyakuService.getAllProjects();
    expect(reloaded.length).toBe(2);
    expect(reloaded[0].id).toBe(saved.id);
    expect(reloaded[0].xml).toBe(dummyXml);
  });

  it('harus dapat menghapus karya berdasarkan ID', () => {
    const p1 = karyakuService.saveProject({
      title: 'Karya 1',
      notesCount: 3,
      xml: '<xml>1</xml>',
    });

    expect(karyakuService.getAllProjects().length).toBe(2);
    karyakuService.deleteProject(p1.id);

    const afterDelete = karyakuService.getAllProjects();
    expect(afterDelete.some((p) => p.id === p1.id)).toBe(false);
  });

  it('harus dapat menyimpan dan membaca draft lembar kerja aktif', () => {
    expect(karyakuService.getDraftXml()).toBeNull();

    const sampleDraft = '<xml><block type="ketika_mulai"></block></xml>';
    karyakuService.saveDraftXml(sampleDraft);
    expect(karyakuService.getDraftXml()).toBe(sampleDraft);

    karyakuService.clearDraftXml();
    expect(karyakuService.getDraftXml()).toBeNull();
  });
});
