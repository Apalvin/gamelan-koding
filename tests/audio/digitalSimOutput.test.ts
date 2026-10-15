import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DigitalSimOutput } from '../../src/audio/digitalSimOutput';
import { GamelanEvent } from '../../src/types/gamelan';

describe('DigitalSimOutput (Milestone 4)', () => {
  let mockSynth: any;
  let mockWorkspace: any;
  let digitalOutput: DigitalSimOutput;

  beforeEach(() => {
    vi.useFakeTimers();

    mockSynth = {
      initAudio: vi.fn().mockResolvedValue(null),
      playSaronNote: vi.fn(),
      playGong: vi.fn(),
      stopAll: vi.fn(),
    };

    mockWorkspace = {
      highlightBlock: vi.fn(),
    };

    digitalOutput = new DigitalSimOutput(mockSynth);
    digitalOutput.setWorkspace(mockWorkspace);
  });

  afterEach(() => {
    digitalOutput.stop();
    vi.useRealTimers();
  });

  it('harus menginisialisasi audio saat play() dipanggil', async () => {
    const events: GamelanEvent[] = [
      { tMs: 0, instrument: 'saron', note: 1, velocity: 90, blockId: 'block_1' },
    ];

    digitalOutput.play(events);
    expect(mockSynth.initAudio).toHaveBeenCalledTimes(1);
    expect(digitalOutput.getIsPlaying()).toBe(true);
  });

  it('harus menjadwalkan audio, highlight blok, dan visual bilah secara berurutan', async () => {
    const visualEvents: Array<GamelanEvent | null> = [];
    digitalOutput.setOnVisualEvent((ev) => visualEvents.push(ev));

    const events: GamelanEvent[] = [
      { tMs: 0, instrument: 'saron', note: 1, velocity: 90, blockId: 'block_1' },
      { tMs: 500, instrument: 'saron', note: 2, velocity: 90, blockId: 'block_2' },
      { tMs: 1000, instrument: 'gong', velocity: 110, blockId: 'block_gong' },
    ];

    const playPromise = digitalOutput.play(events);

    // Pada t = 0 ms: Saron nada 1 dibunyikan & block_1 di-highlight
    await vi.advanceTimersByTimeAsync(0);
    expect(mockSynth.playSaronNote).toHaveBeenCalledWith(1, 0, 90);
    expect(mockWorkspace.highlightBlock).toHaveBeenCalledWith('block_1');
    const activeVisuals = visualEvents.filter((ev): ev is GamelanEvent => ev !== null);
    expect(activeVisuals[0]?.note).toBe(1);

    // Maju ke t = 500 ms: Saron nada 2 dibunyikan & block_2 di-highlight
    await vi.advanceTimersByTimeAsync(500);
    expect(mockSynth.playSaronNote).toHaveBeenCalledWith(2, 0, 90);
    expect(mockWorkspace.highlightBlock).toHaveBeenCalledWith('block_2');

    // Maju ke t = 1000 ms: Gong dibunyikan & block_gong di-highlight
    await vi.advanceTimersByTimeAsync(500);
    expect(mockSynth.playGong).toHaveBeenCalledWith(0, 110);
    expect(mockWorkspace.highlightBlock).toHaveBeenCalledWith('block_gong');

    // Maju sampai selesai program (1000 + 500ms padding)
    await vi.advanceTimersByTimeAsync(500);
    await playPromise;

    expect(digitalOutput.getIsPlaying()).toBe(false);
    expect(mockWorkspace.highlightBlock).toHaveBeenLastCalledWith(null);
  });

  it('harus menghentikan audio, membatalkan timer, dan membersihkan highlight saat stop() dipanggil', async () => {
    const events: GamelanEvent[] = [
      { tMs: 0, instrument: 'saron', note: 1, velocity: 90, blockId: 'block_1' },
      { tMs: 1000, instrument: 'saron', note: 2, velocity: 90, blockId: 'block_2' },
    ];

    digitalOutput.play(events);
    await vi.advanceTimersByTimeAsync(200);

    // Hentikan di tengah jalan
    digitalOutput.stop();

    expect(digitalOutput.getIsPlaying()).toBe(false);
    expect(mockSynth.stopAll).toHaveBeenCalled();
    expect(mockWorkspace.highlightBlock).toHaveBeenLastCalledWith(null);

    // Maju ke waktu t = 1000 ms, event kedua tidak boleh diputar
    await vi.advanceTimersByTimeAsync(1000);
    expect(mockSynth.playSaronNote).toHaveBeenCalledTimes(1); // Hanya nada pertama
  });
});
