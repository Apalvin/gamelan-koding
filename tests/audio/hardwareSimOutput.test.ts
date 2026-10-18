import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HardwareSimOutput } from '../../src/audio/hardwareSimOutput';
import { GamelanEvent } from '../../src/types/gamelan';

describe('HardwareSimOutput', () => {
  let hw: HardwareSimOutput;

  beforeEach(() => {
    hw = new HardwareSimOutput();
  });

  it('harus memetakan nada slendro saron ke nomor kanal solenoid CH 1 s.d. CH 7 dengan benar', () => {
    const events: GamelanEvent[] = [
      { tMs: 0, instrument: 'saron', note: '6', velocity: 90 },
      { tMs: 500, instrument: 'saron', note: '1', velocity: 95 },
      { tMs: 1000, instrument: 'saron', note: '2', velocity: 90 },
      { tMs: 1500, instrument: 'saron', note: '3', velocity: 90 },
      { tMs: 2000, instrument: 'saron', note: '5', velocity: 90 },
      { tMs: 2500, instrument: 'saron', note: "6'", velocity: 90 },
      { tMs: 3000, instrument: 'saron', note: "1'", velocity: 90 },
    ];

    const packets = hw.convertToPackets(events, 35);
    expect(packets).toHaveLength(7);
    expect(packets[0].ch).toBe(1);
    expect(packets[1].ch).toBe(2);
    expect(packets[2].ch).toBe(3);
    expect(packets[3].ch).toBe(4);
    expect(packets[4].ch).toBe(5);
    expect(packets[5].ch).toBe(6);
    expect(packets[6].ch).toBe(7);
  });

  it('harus memetakan instrumen gong ke kanal solenoid CH 8', () => {
    const events: GamelanEvent[] = [
      { tMs: 1000, instrument: 'gong', velocity: 110 },
    ];

    const packets = hw.convertToPackets(events, 45);
    expect(packets).toHaveLength(1);
    expect(packets[0].ch).toBe(8);
    expect(packets[0].noteLabel).toBe('GONG');
    expect(packets[0].pulseMs).toBe(45);
    expect(packets[0].rawHex).toBe('0xAA 0x08 0x6E 0x2D 0xFE');
  });

  it('harus menghentikan semua timer penjadwalan saat stop() dipanggil', () => {
    vi.useFakeTimers();
    const emitSpy = vi.fn();
    hw.setOnPacketEmit(emitSpy);

    const events: GamelanEvent[] = [
      { tMs: 100, instrument: 'saron', note: '1', velocity: 90 },
      { tMs: 500, instrument: 'saron', note: '2', velocity: 90 },
    ];

    hw.play(events);
    vi.advanceTimersByTime(150);
    expect(emitSpy).toHaveBeenCalledTimes(1);

    hw.stop();
    vi.advanceTimersByTime(600);
    expect(emitSpy).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
