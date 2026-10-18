import {
  GamelanEvent,
  InstrumentType,
  SlendroNote,
  CompileSuccess,
  CompilerOptions,
  DEFAULT_BPM,
  DEFAULT_MAX_STEPS,
  DEFAULT_MAX_EVENTS,
  MIN_BPM,
  MAX_BPM,
} from '../types/gamelan';
import structuresData from '../content/structures.json';

export class VirtualClockSimulator {
  private currentTimeMs: number = 0;
  private maxScheduledTimeMs: number = 0;
  private currentBpm: number = DEFAULT_BPM;
  private events: GamelanEvent[] = [];
  private stepsCount: number = 0;
  private blockIds: Set<string> = new Set();

  private readonly maxSteps: number;
  private readonly maxEvents: number;

  constructor(options?: CompilerOptions) {
    this.maxSteps = options?.maxSteps ?? DEFAULT_MAX_STEPS;
    this.maxEvents = options?.maxEvents ?? DEFAULT_MAX_EVENTS;
    if (options?.defaultBpm) {
      this.setTempo(options.defaultBpm);
    }
  }

  /**
   * Mengatur tempo dalam BPM (dibatasi rentang aman 40–140 BPM)
   */
  public setTempo(bpm: number): void {
    this.step();
    this.currentBpm = Math.max(MIN_BPM, Math.min(MAX_BPM, Math.round(bpm)));
  }

  /**
   * Maju sejumlah ketukan waktu hening (jeda)
   */
  public advanceBeats(beats: number): void {
    this.step();
    const beatDurationMs = (60 / this.currentBpm) * 1000;
    this.currentTimeMs += beats * beatDurationMs;
    this.maxScheduledTimeMs = Math.max(this.maxScheduledTimeMs, this.currentTimeMs);
  }

  /**
   * Merekam satu pukulan tabuhan (saron atau gong)
   */
  public recordHit(
    instrument: InstrumentType,
    note?: SlendroNote,
    blockId?: string,
    beatsDuration: number = 1
  ): void {
    this.step();

    if (this.events.length >= this.maxEvents) {
      throw new Error('EVENT_OVERFLOW');
    }

    if (blockId) {
      this.blockIds.add(blockId);
    }

    const velocity = instrument === 'gong' ? 110 : 90;

    // Gong berbunyi bersamaan dengan event terakhir sebelumnya (nada seleh) di tMs yang sama
    let hitTimeMs = this.currentTimeMs;
    if (instrument === 'gong' && this.events.length > 0) {
      hitTimeMs = this.events[this.events.length - 1].tMs;
    }

    this.events.push({
      tMs: Math.round(hitTimeMs),
      instrument,
      note,
      velocity,
      blockId,
    });

    // Otomatis memajukan waktu sebesar durasi ketukan nada (0 jika gong)
    const beatDurationMs = (60 / this.currentBpm) * 1000;
    this.currentTimeMs += beatsDuration * beatDurationMs;
    this.maxScheduledTimeMs = Math.max(this.maxScheduledTimeMs, this.currentTimeMs);
  }

  /**
   * Merekam satu siklus struktur kolotomik (misal: lancaran 16 ketukan)
   * Berjalan selaras dengan ketukan balungan saron (overlay layer)
   */
  public recordColotomicStructure(
    structureId: string = 'lancaran',
    blockId?: string
  ): void {
    this.step();
    if (blockId) {
      this.blockIds.add(blockId);
    }

    const structure =
      structuresData.structures.find((s) => s.id === structureId) ||
      structuresData.structures[0];

    const beatDurationMs = (60 / this.currentBpm) * 1000;
    const startMs = this.currentTimeMs;

    structure.beats.forEach((b) => {
      const beatOffsetMs = (b.beat - 1) * beatDurationMs;
      const tMs = Math.round(startMs + beatOffsetMs);

      b.instruments.forEach((inst) => {
        if (this.events.length >= this.maxEvents) {
          throw new Error('EVENT_OVERFLOW');
        }

        const velocity =
          inst === 'gong'
            ? 110
            : inst === 'kenong'
            ? 95
            : inst === 'kempul'
            ? 90
            : 80;

        const note =
          inst === 'kenong' ? '1' : inst === 'kempul' ? '5' : undefined;

        this.events.push({
          tMs,
          instrument: inst as InstrumentType,
          note,
          velocity,
          blockId,
        });
      });
    });

    const cycleDurationMs = structure.cycleBeats * beatDurationMs;
    this.maxScheduledTimeMs = Math.max(
      this.maxScheduledTimeMs,
      startMs + cycleDurationMs
    );
  }

  /**
   * Guard pelacak langkah untuk mencegah loop tak terbatas
   */
  public step(): void {
    this.stepsCount++;
    if (this.stepsCount > this.maxSteps) {
      throw new Error('INFINITE_LOOP');
    }
  }

  /**
   * Mengembalikan hasil kompilasi yang berhasil
   */
  public getResult(): CompileSuccess {
    const totalDuration = Math.max(this.currentTimeMs, this.maxScheduledTimeMs);
    // Pastikan event terurut secara temporal
    this.events.sort((a, b) => a.tMs - b.tMs);

    return {
      success: true,
      events: this.events,
      totalDurationMs: Math.round(totalDuration),
      blockIds: Array.from(this.blockIds),
      stepsCount: this.stepsCount,
    };
  }

  public getStepsCount(): number {
    return this.stepsCount;
  }
}
