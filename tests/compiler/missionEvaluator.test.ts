import { describe, it, expect } from 'vitest';
import missionsData from '../../src/content/missions.json';
import { Mission } from '../../src/types/mission';
import { GamelanEvent } from '../../src/types/gamelan';
import {
  evaluateC1,
  evaluateC2,
  evaluateC3,
  evaluateC4,
  evaluateC5,
  evaluateC6,
  evaluateMission,
} from '../../src/compiler/missionEvaluator';

describe('Mission Evaluator Engine (Milestone 5)', () => {
  const missions = missionsData.missions as Mission[];
  const c1 = missions.find((m) => m.code === 'C1')!;
  const c2 = missions.find((m) => m.code === 'C2')!;
  const c3 = missions.find((m) => m.code === 'C3')!;
  const c4 = missions.find((m) => m.code === 'C4')!;
  const c5 = missions.find((m) => m.code === 'C5')!;
  const c6 = missions.find((m) => m.code === 'C6')!;

  describe('C1: Kuis Kenali Gamelan', () => {
    it('harus memberikan 3 bintang jika semua jawaban kuis benar', () => {
      const answers = { q1: 'saron', q2: 'gong' };
      const result = evaluateC1(answers, c1);
      expect(result.isCorrect).toBe(true);
      expect(result.stars).toBe(3);
      expect(result.message).toContain('Luar biasa');
    });

    it('harus memberikan umpan balik ramah tanpa kata gagal jika ada jawaban salah', () => {
      const answers = { q1: 'saron', q2: 'bonang' };
      const result = evaluateC1(answers, c1);
      expect(result.isCorrect).toBe(false);
      expect(result.stars).toBeGreaterThanOrEqual(1);
      expect(result.message.toLowerCase()).not.toContain('gagal');
    });
  });

  describe('C2: Pahami Polanya', () => {
    it('harus benar jika susunan potongan pola sesuai urutan target', () => {
      const sequence = ['piece-awal', 'piece-akhir'];
      const result = evaluateC2(sequence, c2);
      expect(result.isCorrect).toBe(true);
      expect(result.stars).toBe(3);
    });

    it('harus memberikan bimbingan ramah jika susunan potongan terbalik', () => {
      const sequence = ['piece-akhir', 'piece-awal'];
      const result = evaluateC2(sequence, c2);
      expect(result.isCorrect).toBe(false);
      expect(result.message.toLowerCase()).not.toContain('gagal');
    });
  });

  describe('C3: Susun Tabuhan di Editor', () => {
    it('harus memberikan 3 bintang jika event tabuhan cocok dengan pola target (1, 2, 3, Gong)', () => {
      const events: GamelanEvent[] = [
        { tMs: 0, instrument: 'saron', note: '1', velocity: 90 },
        { tMs: 1000, instrument: 'saron', note: '2', velocity: 90 },
        { tMs: 2000, instrument: 'saron', note: '3', velocity: 90 },
        { tMs: 3000, instrument: 'gong', velocity: 110 },
      ];
      const result = evaluateC3(events, c3);
      expect(result.isCorrect).toBe(true);
      expect(result.stars).toBe(3);
    });

    it('harus mendeteksi jika nada tabuh sudah benar tetapi gong tertinggal', () => {
      const events: GamelanEvent[] = [
        { tMs: 0, instrument: 'saron', note: '1', velocity: 90 },
        { tMs: 1000, instrument: 'saron', note: '2', velocity: 90 },
        { tMs: 2000, instrument: 'saron', note: '3', velocity: 90 },
      ];
      const result = evaluateC3(events, c3);
      expect(result.isCorrect).toBe(false);
      expect(result.stars).toBe(2);
      expect(result.message).toContain('gong');
    });

    it('harus memberikan petunjuk jika nada yang disusun keliru', () => {
      const events: GamelanEvent[] = [
        { tMs: 0, instrument: 'saron', note: '1', velocity: 90 },
        { tMs: 1000, instrument: 'saron', note: '5', velocity: 90 },
        { tMs: 2000, instrument: 'gong', velocity: 110 },
      ];
      const result = evaluateC3(events, c3);
      expect(result.isCorrect).toBe(false);
      expect(result.message.toLowerCase()).not.toContain('gagal');
    });
  });

  describe('C4: Detektif Tabuhan', () => {
    it('harus lulus jika bug berhasil diperbaiki (6, 1, jeda, 2, gong)', () => {
      const events: GamelanEvent[] = [
        { tMs: 0, instrument: 'saron', note: '6', velocity: 90 },
        { tMs: 1000, instrument: 'saron', note: '1', velocity: 90 },
        { tMs: 3000, instrument: 'saron', note: '2', velocity: 90 },
        { tMs: 4000, instrument: 'gong', velocity: 110 },
      ];
      const result = evaluateC4(events, c4);
      expect(result.isCorrect).toBe(true);
      expect(result.stars).toBe(3);
      expect(result.message).toContain('detektif');
    });

    it('harus mengingatkan jika nada sudah benar tetapi jeda ketukan terlewat', () => {
      const events: GamelanEvent[] = [
        { tMs: 0, instrument: 'saron', note: '6', velocity: 90 },
        { tMs: 1000, instrument: 'saron', note: '1', velocity: 90 },
        { tMs: 2000, instrument: 'saron', note: '2', velocity: 90 }, // tanpa jeda
        { tMs: 3000, instrument: 'gong', velocity: 110 },
      ];
      const result = evaluateC4(events, c4);
      expect(result.isCorrect).toBe(false);
      expect(result.message).toContain('jeda');
    });
  });

  describe('C5: Kurator Pola', () => {
    it('harus memberikan 3 bintang jika memilih program loop dan alasan yang tepat', () => {
      const result = evaluateC5('opt-loop', 'reason-efficient', c5);
      expect(result.isCorrect).toBe(true);
      expect(result.stars).toBe(3);
    });

    it('harus memberi saran jika memilih program loop tapi alasannya kurang tepat', () => {
      const result = evaluateC5('opt-loop', 'reason-louder', c5);
      expect(result.isCorrect).toBe(false);
      expect(result.stars).toBe(2);
    });
  });

  describe('C6: Ciptakan Gendingmu', () => {
    it('harus menerima karya kreatif jika memiliki judul dan minimal 4 tabuhan', () => {
      const events: GamelanEvent[] = [
        { tMs: 0, instrument: 'demung', note: '1', velocity: 90 },
        { tMs: 1000, instrument: 'demung', note: '2', velocity: 90 },
        { tMs: 2000, instrument: 'saron', note: '3', velocity: 90 },
        { tMs: 3000, instrument: 'gong', velocity: 110 },
      ];
      const result = evaluateC6(events, 'Gending Sore Cilik', c6);
      expect(result.isCorrect).toBe(true);
      expect(result.stars).toBe(3);
    });

    it('harus mengingatkan jika judul karya belum diisi', () => {
      const events: GamelanEvent[] = [
        { tMs: 0, instrument: 'saron', note: '1', velocity: 90 },
        { tMs: 1000, instrument: 'saron', note: '2', velocity: 90 },
        { tMs: 2000, instrument: 'saron', note: '3', velocity: 90 },
        { tMs: 3000, instrument: 'gong', velocity: 110 },
      ];
      const result = evaluateC6(events, '   ', c6);
      expect(result.isCorrect).toBe(false);
      expect(result.message).toContain('judul');
    });

    it('harus menyarankan menambah nada jika tabuhan kurang dari batas minimal', () => {
      const events: GamelanEvent[] = [
        { tMs: 0, instrument: 'saron', note: '1', velocity: 90 },
      ];
      const result = evaluateC6(events, 'Nada Singkat', c6);
      expect(result.isCorrect).toBe(false);
      expect(result.message).toContain('minimal');
    });
  });

  describe('General Dispatcher: evaluateMission', () => {
    it('harus dapat mendispatch evaluasi berdasarkan kode misi', () => {
      const res = evaluateMission(c1, { q1: 'saron', q2: 'gong' });
      expect(res.isCorrect).toBe(true);
    });
  });
});
