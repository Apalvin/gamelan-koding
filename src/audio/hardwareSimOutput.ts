import { GamelanEvent, GamelanOutput } from '../types/gamelan';

export interface HardwarePacket {
  t: number;
  ch: number; // 1-7 (saron), 8 (gong)
  noteLabel: string;
  vel: number;
  pulseMs: number;
  rawHex: string;
}

export const SLENDRO_NOTE_TO_CHANNEL: Record<string, number> = {
  '6': 1,
  '1': 2,
  '2': 3,
  '3': 4,
  '5': 5,
  "6'": 6,
  "1'": 7,
};

export class HardwareSimOutput implements GamelanOutput {
  private isRunning: boolean = false;
  private timerIds: number[] = [];
  private pulseDurationMs: number = 35;
  private onPacketEmitCallback: ((packet: HardwarePacket) => void) | null = null;
  private onStopCallback: (() => void) | null = null;

  public setPulseDuration(ms: number): void {
    this.pulseDurationMs = Math.max(10, Math.min(100, ms));
  }

  public getPulseDuration(): number {
    return this.pulseDurationMs;
  }

  public setOnPacketEmit(cb: ((packet: HardwarePacket) => void) | null): void {
    this.onPacketEmitCallback = cb;
  }

  public setOnStop(cb: (() => void) | null): void {
    this.onStopCallback = cb;
  }

  public mapEventToChannel(event: GamelanEvent): { ch: number; label: string } {
    if (event.instrument === 'gong') {
      return { ch: 8, label: 'GONG' };
    }
    const noteKey = String(event.note ?? '1');
    const ch = SLENDRO_NOTE_TO_CHANNEL[noteKey] ?? 2;
    return { ch, label: noteKey };
  }

  public formatHexPacket(ch: number, vel: number, pulseMs: number): string {
    const toHex = (n: number) => '0x' + n.toString(16).toUpperCase().padStart(2, '0');
    return `${toHex(0xAA)} ${toHex(ch)} ${toHex(vel)} ${toHex(pulseMs)} ${toHex(0xFE)}`;
  }

  public convertToPackets(events: GamelanEvent[], customPulseMs?: number): HardwarePacket[] {
    const pulse = customPulseMs ?? this.pulseDurationMs;
    return events.map((ev) => {
      const { ch, label } = this.mapEventToChannel(ev);
      const vel = Math.max(0, Math.min(127, Math.round(ev.velocity || 90)));
      return {
        t: ev.tMs,
        ch,
        noteLabel: label,
        vel,
        pulseMs: pulse,
        rawHex: this.formatHexPacket(ch, vel, pulse),
      };
    });
  }

  public async play(events: GamelanEvent[]): Promise<void> {
    this.stop();
    if (!events || events.length === 0) return;

    this.isRunning = true;
    const packets = this.convertToPackets(events);
    const maxT = Math.max(...packets.map((p) => p.t)) + this.pulseDurationMs + 200;

    packets.forEach((packet) => {
      const tid = setTimeout(() => {
        if (!this.isRunning) return;
        this.onPacketEmitCallback?.(packet);
      }, packet.t) as unknown as number;
      this.timerIds.push(tid);
    });

    // Timer akhir simulasi
    const endTid = setTimeout(() => {
      this.stop();
    }, maxT) as unknown as number;
    this.timerIds.push(endTid);
  }

  public stop(): void {
    this.isRunning = false;
    this.timerIds.forEach((id) => clearTimeout(id));
    this.timerIds = [];
    this.onStopCallback?.();
  }
}

export const hardwareSimOutput = new HardwareSimOutput();
