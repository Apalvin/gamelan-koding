import { describe, it, expect, beforeEach } from 'vitest';
import { GamelanAudioSynth, SLENDRO_FREQUENCIES } from '../../src/audio/gamelanSynth';

describe('GamelanAudioSynth', () => {
  let synth: GamelanAudioSynth;

  beforeEach(() => {
    synth = new GamelanAudioSynth();
  });

  it('harus memiliki pemetaan frekuensi laras slendro kepatihan yang akurat', () => {
    expect(SLENDRO_FREQUENCIES[1]).toBe(275);
    expect(SLENDRO_FREQUENCIES[2]).toBe(315);
    expect(SLENDRO_FREQUENCIES[3]).toBe(360);
    expect(SLENDRO_FREQUENCIES[5]).toBe(415);
    expect(SLENDRO_FREQUENCIES[6]).toBe(475);
  });

  it('harus dapat mengembalikan frekuensi nada berdasarkan input angka maupun string', () => {
    expect(synth.getFrequency(1)).toBe(275);
    expect(synth.getFrequency('1')).toBe(275);
    expect(synth.getFrequency(6)).toBe(475);
    expect(synth.getFrequency('6')).toBe(475);
    // Fallback jika nada tidak terdaftar
    expect(synth.getFrequency(4 as any)).toBe(275);
  });

  it('harus dapat memanggil playSaronNote dan playGong tanpa melempar error meskipun di environment non-browser', async () => {
    expect(() => {
      synth.playSaronNote(1);
      synth.playSaronNote(2, 0.5, 90);
      synth.playGong();
      synth.stopAll();
    }).not.toThrow();
  });
});
