import { describe, it, expect } from 'vitest';
import { VirtualClockSimulator } from '../../src/compiler/virtualClock';

describe('VirtualClockSimulator', () => {
  it('harus menghitung waktu tMs dengan benar pada tempo default 60 BPM (1 ketuk = 1000ms)', () => {
    const clock = new VirtualClockSimulator({ defaultBpm: 60 });
    
    // Tabuh saron 1 (t = 0), jeda 1 ketuk (t = 1000), tabuh saron 2 (t = 2000)
    clock.recordHit('saron', 1, 'block_1', 1);
    clock.advanceBeats(1);
    clock.recordHit('saron', 2, 'block_2', 1);

    const result = clock.getResult();
    expect(result.events).toHaveLength(2);
    expect(result.events[0]).toMatchObject({
      tMs: 0,
      instrument: 'saron',
      note: 1,
      blockId: 'block_1',
    });
    expect(result.events[1]).toMatchObject({
      tMs: 2000,
      instrument: 'saron',
      note: 2,
      blockId: 'block_2',
    });
    expect(result.totalDurationMs).toBe(3000);
  });

  it('harus menyesuaikan penghitungan milidetik saat tempo diubah (120 BPM = 500ms per ketuk)', () => {
    const clock = new VirtualClockSimulator({ defaultBpm: 60 });
    clock.setTempo(120); // 120 BPM
    
    clock.recordHit('saron', 1, 'b1', 1); // t = 0, durasi 1 ketuk (500ms)
    clock.recordHit('saron', 2, 'b2', 1); // t = 500, durasi 1 ketuk (500ms)
    
    const result = clock.getResult();
    expect(result.events[0].tMs).toBe(0);
    expect(result.events[1].tMs).toBe(500);
    expect(result.totalDurationMs).toBe(1000);
  });

  it('harus membatasi tempo pada rentang aman 40 - 140 BPM', () => {
    const clock = new VirtualClockSimulator();
    clock.setTempo(20); // di bawah 40 -> harus di-clamp ke 40
    clock.recordHit('saron', 1, 'b1', 1);
    
    // Pada 40 BPM, 1 ketuk = (60/40)*1000 = 1500ms
    expect(clock.getResult().totalDurationMs).toBe(1500);

    clock.setTempo(300); // di atas 140 -> harus di-clamp ke 140
    clock.advanceBeats(1);
    // 1 ketuk pada 140 BPM = (60/140)*1000 = ~428.57ms
    expect(clock.getResult().totalDurationMs).toBe(1500 + Math.round((60 / 140) * 1000));
  });

  it('harus melempar error INFINITE_LOOP jika langkah eksekusi melampaui batas maxSteps', () => {
    const clock = new VirtualClockSimulator({ maxSteps: 10 });
    expect(() => {
      for (let i = 0; i < 20; i++) {
        clock.step();
      }
    }).toThrowError('INFINITE_LOOP');
  });

  it('harus melempar error EVENT_OVERFLOW jika jumlah event melampaui batas maxEvents', () => {
    const clock = new VirtualClockSimulator({ maxEvents: 3 });
    expect(() => {
      clock.recordHit('saron', 1, 'b1', 1);
      clock.recordHit('saron', 2, 'b2', 1);
      clock.recordHit('saron', 3, 'b3', 1);
      clock.recordHit('saron', 5, 'b4', 1); // event ke-4 melampaui batas 3
    }).toThrowError('EVENT_OVERFLOW');
  });

  it('tabuh nada dilanjutkan dengan gong harus berbunyi secara berurutan tanpa menimpa nada sebelumnya', () => {
    const clock = new VirtualClockSimulator({ defaultBpm: 60 }); // 1 ketuk = 1000ms

    // Pola: 3 blok demung dilanjutkan dengan blok gong (masing-masing 1 ketukan)
    clock.recordHit('demung', '1', 'b1', 1); // t = 0ms
    clock.recordHit('demung', '2', 'b2', 1); // t = 1000ms
    clock.recordHit('demung', '3', 'b3', 1); // t = 2000ms
    clock.recordHit('gong', undefined, 'bgong', 1); // t = 3000ms

    const result = clock.getResult();
    expect(result.events).toHaveLength(4);

    expect(result.events[0]).toMatchObject({ tMs: 0, instrument: 'demung', note: '1' });
    expect(result.events[1]).toMatchObject({ tMs: 1000, instrument: 'demung', note: '2' });
    expect(result.events[2]).toMatchObject({ tMs: 2000, instrument: 'demung', note: '3' });
    expect(result.events[3]).toMatchObject({ tMs: 3000, instrument: 'gong' });

    // Total durasi bertambah secara tepat: 4 ketukan = 4000ms
    expect(result.totalDurationMs).toBe(4000);
  });

  it('3 blok gong berurutan harus berbunyi secara sekuensial pada tMs yang berbeda (tidak saling menimpa)', () => {
    const clock = new VirtualClockSimulator({ defaultBpm: 60 }); // 1 ketuk = 1000ms

    clock.recordHit('gong', undefined, 'g1', 1); // t = 0ms
    clock.recordHit('gong', undefined, 'g2', 1); // t = 1000ms
    clock.recordHit('gong', undefined, 'g3', 1); // t = 2000ms

    const result = clock.getResult();
    expect(result.events).toHaveLength(3);
    expect(result.events[0].tMs).toBe(0);
    expect(result.events[1].tMs).toBe(1000);
    expect(result.events[2].tMs).toBe(2000);
    expect(result.totalDurationMs).toBe(3000);
  });
});
