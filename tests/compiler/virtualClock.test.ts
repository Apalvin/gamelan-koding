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

  it('gong tidak menambah totalDurationMs dan berbunyi bersamaan dengan event terakhir sebelumnya (nada seleh) di tMs yang sama', () => {
    const clock = new VirtualClockSimulator({ defaultBpm: 60 }); // 1 ketuk = 1000ms

    // Pola 4 ketukan balungan saron: 1 -> 2 -> 3 -> 5 (seleh) + Gong
    clock.recordHit('saron', '1', 'b1', 1); // t = 0ms
    clock.recordHit('saron', '2', 'b2', 1); // t = 1000ms
    clock.recordHit('saron', '3', 'b3', 1); // t = 2000ms
    clock.recordHit('saron', '5', 'b4', 1); // t = 3000ms (seleh)
    
    // Sebelum gong dimasukkan
    const durationBeforeGong = clock.getResult().totalDurationMs;
    expect(durationBeforeGong).toBe(4000);

    // Masukkan blok tabuh gong (beatsDuration = 0)
    clock.recordHit('gong', undefined, 'bgong', 0);

    const result = clock.getResult();
    expect(result.events).toHaveLength(5);

    // Event ke-4 (saron 5) dan event ke-5 (gong) harus memiliki tMs yang sama (3000ms)
    const selehEvent = result.events[3];
    const gongEvent = result.events[4];

    expect(selehEvent.tMs).toBe(3000);
    expect(gongEvent.tMs).toBe(3000);
    expect(gongEvent.instrument).toBe('gong');

    // Total durasi TIDAK bertambah karena gong berdurasi 0 ketukan
    expect(result.totalDurationMs).toBe(durationBeforeGong);
    expect(result.totalDurationMs).toBe(4000);
  });
});
