import { describe, it, expect } from 'vitest';
import { evaluateFinalChallenge } from '../../src/compiler/finalChallengeEvaluator';
import { GamelanEvent } from '../../src/types/gamelan';

describe('finalChallengeEvaluator (Milestone 6)', () => {
  it('harus meminta anak menyambung blok jika event kosong', () => {
    const res = evaluateFinalChallenge([]);
    expect(res.isCorrect).toBe(false);
    expect(res.stars).toBe(0);
    expect(res.message).toContain('blok');
    expect(res.message).not.toContain('gagal');
  });

  it('harus memberikan apresiasi menguatkan tanpa kata gagal jika tabuhan belum tepat', () => {
    const partialEvents: GamelanEvent[] = [
      { tMs: 0, instrument: 'saron', note: '1' },
      { tMs: 500, instrument: 'saron', note: '2' },
    ];
    const res = evaluateFinalChallenge(partialEvents);
    expect(res.isCorrect).toBe(false);
    expect(res.stars).toBe(1); // Tetap dapat 1 bintang apresiasi keberanian mencoba
    expect(res.title).toContain('Berani Mencoba');
    expect(res.message).not.toContain('gagal');
    expect(res.hint).toContain('3 - 5 - 3 - 2');
  });

  it('harus memberikan 3 bintang dan selebrasi jika pola 8 ketukan dan gong tepat', () => {
    const perfectEvents: GamelanEvent[] = [
      { tMs: 0, instrument: 'saron', note: '3' },
      { tMs: 500, instrument: 'saron', note: '5' },
      { tMs: 1000, instrument: 'saron', note: '3' },
      { tMs: 1500, instrument: 'saron', note: '2' },
      { tMs: 2000, instrument: 'saron', note: '3' },
      { tMs: 2500, instrument: 'saron', note: '5' },
      { tMs: 3000, instrument: 'saron', note: '6' },
      { tMs: 3500, instrument: 'saron', note: '5' },
      { tMs: 3500, instrument: 'gong' },
    ];
    const res = evaluateFinalChallenge(perfectEvents);
    expect(res.isCorrect).toBe(true);
    expect(res.stars).toBe(3);
    expect(res.title).toContain('Luar Biasa');
    expect(res.message).not.toContain('gagal');
  });
});
