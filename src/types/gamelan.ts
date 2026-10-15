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
  ch: number | string; // nomor aktuator / bilah
  vel: number;
}

/**
 * Konstanta Pengaman (Guard) Sesuai Bagian 7.2 PRD
 */
export const DEFAULT_MAX_STEPS = 5000;
export const DEFAULT_MAX_EVENTS = 2000;
export const DEFAULT_BPM = 60;
export const MIN_BPM = 40;
export const MAX_BPM = 140;

/**
 * Hasil Kompilasi Sukses
 */
export interface CompileSuccess {
  success: true;
  events: GamelanEvent[];
  totalDurationMs: number;
  blockIds: string[];
  stepsCount: number;
}

/**
 * Hasil Kompilasi Gagal (Terkena Guard Infinite Loop, Overflow, dsb.)
 */
export interface CompileError {
  success: false;
  error: string;
  code: 'INFINITE_LOOP' | 'EVENT_OVERFLOW' | 'EMPTY_PROGRAM' | 'SYNTAX_ERROR';
  step?: number;
}

export type CompileResult = CompileSuccess | CompileError;

export interface CompilerOptions {
  defaultBpm?: number;
  maxSteps?: number;
  maxEvents?: number;
}
