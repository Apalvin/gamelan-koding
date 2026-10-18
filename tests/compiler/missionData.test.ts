import { describe, it, expect } from 'vitest';
import missionsData from '../../src/content/missions.json';
import { Mission } from '../../src/types/mission';

describe('Missions Content Data (Milestone 5)', () => {
  const missions = missionsData.missions as Mission[];

  it('harus memuat tepat 6 misi bertingkat C1 hingga C6', () => {
    expect(missions).toHaveLength(6);
    const codes = missions.map((m) => m.code);
    expect(codes).toEqual(['C1', 'C2', 'C3', 'C4', 'C5', 'C6']);
  });

  it('semua misi harus memiliki metadata integritas budaya dengan label belum divalidasi', () => {
    missions.forEach((m) => {
      expect(m.validatedBy).toBeNull();
      expect(m.sourceNote).toContain('belum divalidasi praktisi karawitan');
      expect(m.cultureContext).toBeDefined();
      expect(m.cultureContext.length).toBeGreaterThan(10);
    });
  });

  it('misi C1 harus memiliki opsi kuis pengenalan instrumen dan kunci jawaban', () => {
    const c1 = missions.find((m) => m.code === 'C1');
    expect(c1).toBeDefined();
    expect(c1?.quiz).toBeDefined();
    expect(c1?.quiz?.questions.length).toBeGreaterThanOrEqual(1);
    expect(c1?.quiz?.questions[0].correctAnswerId).toBeDefined();
  });

  it('misi C2 harus memiliki potongan pola dan urutan kunci', () => {
    const c2 = missions.find((m) => m.code === 'C2');
    expect(c2).toBeDefined();
    expect(c2?.patternPuzzle).toBeDefined();
    expect(c2?.patternPuzzle?.pieces.length).toBeGreaterThanOrEqual(2);
    expect(c2?.patternPuzzle?.correctSequence).toBeDefined();
  });

  it('misi C3 harus memiliki pola target tabuhan untuk disusun di editor', () => {
    const c3 = missions.find((m) => m.code === 'C3');
    expect(c3).toBeDefined();
    expect(c3?.editorTarget).toBeDefined();
    expect(c3?.editorTarget?.targetEvents.length).toBeGreaterThanOrEqual(3);
  });

  it('misi C4 harus memiliki kode awal bermasalah (buggy) dan target perbaikan', () => {
    const c4 = missions.find((m) => m.code === 'C4');
    expect(c4).toBeDefined();
    expect(c4?.editorTarget).toBeDefined();
    expect(c4?.editorTarget?.initialBuggyXml).toBeDefined();
    expect(c4?.editorTarget?.targetEvents.length).toBeGreaterThanOrEqual(3);
  });

  it('misi C5 harus memiliki 2 program perbandingan dan kunci kurasi yang benar', () => {
    const c5 = missions.find((m) => m.code === 'C5');
    expect(c5).toBeDefined();
    expect(c5?.curatorTask).toBeDefined();
    expect(c5?.curatorTask?.options).toHaveLength(2);
    expect(c5?.curatorTask?.correctOptionId).toBeDefined();
    expect(c5?.curatorTask?.correctReasonId).toBeDefined();
  });

  it('misi C6 harus memiliki kriteria kreasi bebas mandiri', () => {
    const c6 = missions.find((m) => m.code === 'C6');
    expect(c6).toBeDefined();
    expect(c6?.creativeCriteria).toBeDefined();
    expect(c6?.creativeCriteria?.minEvents).toBeGreaterThanOrEqual(4);
  });
});
