import { describe, it, expect, beforeEach } from 'vitest';
import { GamelanAudioSynth } from '../../src/audio/gamelanSynth';
import {
  SARON_TUNING,
  KEMPUL_TUNING,
  GONG_SUWUKAN_TUNING,
  DEFAULT_GONG_AGENG_FREQ,
  KETHUK_FREQ,
  TUNING_METADATA,
} from '../../src/audio/gamelanTuning';
import { SlendroNote } from '../../src/types/gamelan';

describe('GamelanAudioSynth & GamelanTuning (Tahap 2 & 3)', () => {
  let synth: GamelanAudioSynth;

  beforeEach(() => {
    synth = new GamelanAudioSynth();
  });

  it('harus memiliki metadata validasi budaya yang jujur (belum divalidasi praktisi)', () => {
    expect(TUNING_METADATA.validatedBy).toBeNull();
    expect(TUNING_METADATA.sourceNote).toContain('belum divalidasi praktisi karawitan');
  });

  it('harus memiliki pemetaan frekuensi laras slendro acuan literatur akustik gamelan Jawa', () => {
    // Saron: 6=496, 1=570, 2=655, 3=752, 5=864, 6'=992, 1'=1139 Hz
    expect(SARON_TUNING['6']).toBe(496);
    expect(SARON_TUNING['1']).toBe(570);
    expect(SARON_TUNING['2']).toBe(655);
    expect(SARON_TUNING['3']).toBe(752);
    expect(SARON_TUNING['5']).toBe(864);
    expect(SARON_TUNING["6'"]).toBe(992);
    expect(SARON_TUNING["1'"]).toBe(1139);

    // Kempul: 5=107, 6=124, 1=136, 2=157, 3=180 Hz
    expect(KEMPUL_TUNING['5']).toBe(107);
    expect(KEMPUL_TUNING['6']).toBe(124);
    expect(KEMPUL_TUNING['1']).toBe(136);
    expect(KEMPUL_TUNING['2']).toBe(157);
    expect(KEMPUL_TUNING['3']).toBe(180);

    // Gong suwukan: 133 / 154 Hz
    expect(GONG_SUWUKAN_TUNING.laras1).toBe(133);
    expect(GONG_SUWUKAN_TUNING.laras2).toBe(154);

    // Gong ageng: default 62 Hz
    expect(DEFAULT_GONG_AGENG_FREQ).toBe(62);

    // Kethuk: 480 Hz
    expect(KETHUK_FREQ).toBe(480);
  });

  it('harus dapat mengembalikan frekuensi nada berdasarkan input angka maupun string', () => {
    expect(synth.getFrequency('1')).toBe(570);
    expect(synth.getFrequency(1)).toBe(570);
    expect(synth.getFrequency('6')).toBe(496);
    expect(synth.getFrequency(6)).toBe(496);
    expect(synth.getFrequency("6'")).toBe(992);
    expect(synth.getFrequency("1'")).toBe(1139);
  });

  it("5 -> 6' -> 1' harus naik secara monoton (864 < 992 < 1139 Hz)", () => {
    const f5 = synth.getFrequency('5');
    const f6High = synth.getFrequency("6'");
    const f1High = synth.getFrequency("1'");

    expect(f5).toBe(864);
    expect(f6High).toBe(992);
    expect(f1High).toBe(1139);

    expect(f5).toBeLessThan(f6High);
    expect(f6High).toBeLessThan(f1High);
  });

  it("seluruh 7 bilah saron berurutan (6, 1, 2, 3, 5, 6', 1') harus berfrekuensi naik monoton", () => {
    const notes: SlendroNote[] = ['6', '1', '2', '3', '5', "6'", "1'"];
    const freqs = notes.map((n) => synth.getFrequency(n));

    expect(freqs).toEqual([496, 570, 655, 752, 864, 992, 1139]);

    for (let i = 0; i < freqs.length - 1; i++) {
      expect(freqs[i]).toBeLessThan(freqs[i + 1]);
    }
  });

  it('demung harus bernada 1 oktaf di bawah saron dan peking 1 oktaf di atas saron', () => {
    const note = '1';
    const saronFreq = synth.getFrequency(note, 'saron');
    const demungFreq = synth.getFrequency(note, 'demung');
    const pekingFreq = synth.getFrequency(note, 'peking');

    expect(demungFreq).toBe(saronFreq / 2);
    expect(pekingFreq).toBe(saronFreq * 2);
  });

  it('harus dapat memanggil seluruh instrumen (saron, demung, peking, gong, kempul, kenong, gong suwukan, kethuk) tanpa error', async () => {
    expect(() => {
      synth.playNote('demung', '6');
      synth.playNote('saron', '1');
      synth.playNote('peking', "1'");
      synth.playSaronNote('2', 0.1, 90);
      synth.playGong();
      synth.playGongSuwukan('1');
      synth.playKenong('1');
      synth.playKempul('5');
      synth.playKethuk();
      synth.playAnyInstrument('kenong', '2');
      synth.stopAll();
    }).not.toThrow();
  });

  it('harus dapat memainkan blok instrumen yang sama secara berurutan (misal: 3 demung atau 3 gong) tanpa saling meredam prematur', () => {
    expect(() => {
      // 3 blok Demung berurutan dengan jeda lookahead
      synth.playNote('demung', '1', 0.0);
      synth.playNote('demung', '2', 0.6);
      synth.playNote('demung', '3', 1.2);

      // 3 blok Gong berurutan
      synth.playGong(0.0);
      synth.playGong(1.0);
      synth.playGong(2.0);

      synth.stopAll();
    }).not.toThrow();
  });
});
