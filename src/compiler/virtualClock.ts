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

export class VirtualClockSimulator {
  private currentTimeMs: number = 0;
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

    this.events.push({
      tMs: Math.round(this.currentTimeMs),
      instrument,
      note,
      velocity,
      blockId,
    });

    // Otomatis memajukan waktu sebesar durasi ketukan nada
    const beatDurationMs = (60 / this.currentBpm) * 1000;
    this.currentTimeMs += beatsDuration * beatDurationMs;
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
    return {
      success: true,
      events: this.events,
      totalDurationMs: Math.round(this.currentTimeMs),
      blockIds: Array.from(this.blockIds),
      stepsCount: this.stepsCount,
    };
  }

  public getStepsCount(): number {
    return this.stepsCount;
  }
}
