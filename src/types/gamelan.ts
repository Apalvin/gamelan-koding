/**
 * Definisi Model Data & Antarmuka Arsitektur Sesuai Bagian 7 PRD
 */

export type InstrumentType = 'saron' | 'gong' | 'demung' | 'peking';

export type SlendroNote = 1 | 2 | 3 | 5 | 6 | '1' | '2' | '3' | '5' | '6';

/**
 * Event hasil compile Blockly sebelum diputar (Bagian 7.2 PRD)
 */
export interface GamelanEvent {
  tMs: number;
  instrument: InstrumentType;
  note?: SlendroNote;
  velocity: number; // 0 - 127
  blockId?: string;
}

/**
 * Antarmuka output agar hardware mudah disambung nanti (Bagian 7.3 PRD)
 */
export interface GamelanOutput {
  play(events: GamelanEvent[]): Promise<void>;
  stop(): void;
}

/**
 * Format log pesan ke mikrokontroler (Bagian 7.3 PRD)
 */
export interface HardwareSimLog {
  t: number;
  ch: number; // nomor aktuator / bilah
  vel: number;
}
