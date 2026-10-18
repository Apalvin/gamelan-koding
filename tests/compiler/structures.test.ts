import { describe, it, expect } from 'vitest';
import structuresData from '../../src/content/structures.json';
import { VirtualClockSimulator } from '../../src/compiler/virtualClock';

describe('Struktur Kolotomik (Tahap 4)', () => {
  const lancaran = structuresData.structures.find((s) => s.id === 'lancaran')!;

  it('harus memuat struktur lancaran dengan panjang siklus tepat 16 ketukan', () => {
    expect(lancaran).toBeDefined();
    expect(lancaran.cycleBeats).toBe(16);
    expect(lancaran.beats).toHaveLength(16);
  });

  it('harus memiliki label jujur: validatedBy null dan catatan belum divalidasi praktisi', () => {
    expect(lancaran.validatedBy).toBeNull();
    expect(lancaran.sourceNote).toContain('belum divalidasi praktisi karawitan');
  });

  it('harus mematuhi aturan hierarki pembagian gongan tanpa tabrakan instrumen selain kenong+gong di ketukan 16', () => {
    lancaran.beats.forEach((b) => {
      const beat = b.beat;
      const insts = b.instruments;

      if (beat === 16) {
        // Akhir gongan: kenong dan gong berbunyi bersamaan
        expect(insts).toContain('kenong');
        expect(insts).toContain('gong');
        expect(insts).toHaveLength(2);
      } else if (beat % 4 === 0) {
        // Kenong membagi gongan jadi 4 (ketukan 4, 8, 12)
        expect(insts).toEqual(['kenong']);
      } else if (beat % 2 === 0) {
        // Kempul membagi tiap bagian jadi 2 (ketukan 6, 10, 14; ketukan 2 wela/kosong)
        if (beat === 2) {
          expect(insts).toHaveLength(0); // Wela
        } else {
          expect(insts).toEqual(['kempul']);
        }
      } else {
        // Kethuk membagi lagi jadi 2 (seluruh ketukan ganjil 1, 3, 5, 7, 9, 11, 13, 15)
        expect(insts).toEqual(['kethuk']);
      }

      // Memastikan tidak ada tabrakan instrumen struktural selain pada ketukan 16 (kenong + gong)
      if (beat !== 16) {
        expect(insts.length).toBeLessThanOrEqual(1);
      }
    });
  });

  it('VirtualClockSimulator harus merekam lapisan kolotomik selaras dengan balungan saron', () => {
    const clock = new VirtualClockSimulator({ defaultBpm: 60 }); // 1 ketuk = 1000ms

    // Pasang lapisan struktur kolotomik lancaran (16 ketukan)
    clock.recordColotomicStructure('lancaran', 'blk_struktur');

    // Pasang 16 ketukan balungan saron secara paralel
    for (let i = 1; i <= 16; i++) {
      const note = i === 16 ? '5' : '1'; // Nada 5 adalah seleh gongan di ketukan 16
      clock.recordHit('saron', note as any, `blk_saron_${i}`, 1);
    }

    const result = clock.getResult();

    // Verifikasi total durasi siklus 16 ketukan (16.000 ms pada 60 BPM)
    expect(result.totalDurationMs).toBe(16000);

    // Di ketukan 16 (tMs = 15.000 ms, indeks 0-based untuk beat ke-16):
    // Balungan saron 5, Kenong, dan Gong Ageng harus berbunyi serentak di tMs 15000!
    const beat16Events = result.events.filter((e) => e.tMs === 15000);
    const instrumentsAtBeat16 = beat16Events.map((e) => e.instrument);

    expect(instrumentsAtBeat16).toContain('saron');
    expect(instrumentsAtBeat16).toContain('kenong');
    expect(instrumentsAtBeat16).toContain('gong');

    // Nada seleh saron di akhir siklus
    const saronSeleh = beat16Events.find((e) => e.instrument === 'saron');
    expect(saronSeleh?.note).toBe('5');
  });
});
