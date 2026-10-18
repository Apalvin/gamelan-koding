import { describe, it, expect, beforeEach } from 'vitest';
import { missionProgressService } from '../../src/services/missionProgressService';

describe('MissionProgressService (Milestone 5)', () => {
  beforeEach(() => {
    missionProgressService.resetProgress();
  });

  it('harus mengembalikan status default belum untuk misi baru', () => {
    const p = missionProgressService.getMissionProgress('C1');
    expect(p.status).toBe('belum');
    expect(p.stars).toBe(0);
  });

  it('harus dapat menyimpan progres misi dan bintang ke localStorage', () => {
    const saved = missionProgressService.saveProgress('C1', 3, 'selesai');
    expect(saved.status).toBe('selesai');
    expect(saved.stars).toBe(3);

    const reloaded = missionProgressService.getMissionProgress('C1');
    expect(reloaded.status).toBe('selesai');
    expect(reloaded.stars).toBe(3);
  });

  it('harus mempertahankan jumlah bintang tertinggi jika percobaan kedua mendapat bintang lebih sedikit', () => {
    missionProgressService.saveProgress('C2', 3, 'selesai');
    // Percobaan kedua mendapat 2 bintang
    const updated = missionProgressService.saveProgress('C2', 2, 'selesai');
    expect(updated.stars).toBe(3); // tetap 3
  });

  it('harus menghitung total perolehan bintang dari semua misi', () => {
    missionProgressService.saveProgress('C1', 3, 'selesai');
    missionProgressService.saveProgress('C2', 2, 'selesai');
    missionProgressService.saveProgress('C3', 3, 'selesai');

    expect(missionProgressService.getTotalStars()).toBe(8);
  });

  it('harus aman dari error localStorage saat akses dibatasi', () => {
    expect(() => {
      missionProgressService.getAllProgress();
      missionProgressService.saveProgress('C4', 1, 'sedang');
    }).not.toThrow();
  });
});
