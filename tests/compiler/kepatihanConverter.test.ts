import { describe, it, expect } from 'vitest';
import { convertEventsToKepatihan } from '../../src/compiler/kepatihanConverter';
import { GamelanEvent } from '../../src/types/gamelan';

describe('kepatihanConverter', () => {
  it('harus mengembalikan teks kosong atau placeholder jika events kosong', () => {
    const res = convertEventsToKepatihan([]);
    expect(res).toBe('// Belum ada nada tabuhan');
  });

  it('harus mengonversi pola 8 ketukan lancaran dengan benar', () => {
    const events: GamelanEvent[] = [
      { tMs: 0, instrument: 'saron', note: '3', velocity: 90 },
      { tMs: 500, instrument: 'saron', note: '5', velocity: 90 },
      { tMs: 1000, instrument: 'saron', note: '3', velocity: 90 },
      { tMs: 1500, instrument: 'saron', note: '2', velocity: 90 },
      { tMs: 2000, instrument: 'saron', note: '3', velocity: 90 },
      { tMs: 2500, instrument: 'saron', note: '5', velocity: 90 },
      { tMs: 3000, instrument: 'saron', note: '6', velocity: 90 },
      { tMs: 3500, instrument: 'saron', note: '5', velocity: 90 },
      { tMs: 3500, instrument: 'gong', velocity: 110 },
    ];

    const res = convertEventsToKepatihan(events);
    expect(res).toContain('3');
    expect(res).toContain('5');
    expect(res).toContain('(5)');
  });

  it('harus menandai gong tunggal dengan simbol (G) jika tidak bersamaan dengan saron', () => {
    const events: GamelanEvent[] = [
      { tMs: 0, instrument: 'saron', note: '1', velocity: 90 },
      { tMs: 500, instrument: 'gong', velocity: 110 },
    ];

    const res = convertEventsToKepatihan(events);
    expect(res).toContain('1');
    expect(res).toContain('(G)');
  });
});
