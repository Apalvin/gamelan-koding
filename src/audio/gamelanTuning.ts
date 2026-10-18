/**
 * gamelanTuning.ts — Pemetaan Frekuensi Pendekatan Laras Slendro Jawa
 *
 * PENTING:
 * Suara simulasi dan nilai frekuensi di bawah ini adalah PENDEKATAN TEORITIS,
 * bukan representasi penuh gamelan asli. Gamelan Jawa tidak memiliki tala baku
 * mutlak (setiap perangkat gamelan / ricikan memiliki laras unik tersendiri).
 *
 * Nilai frekuensi dihimpun dari literatur akustik etnomusikologi rata-rata
 * beberapa set gamelan berlaras Slendro (~240 cent per langkah selang nada).
 *
 * Metadata Validasi Budaya:
 * - validatedBy: null (belum divalidasi langsung oleh praktisi/empu karawitan)
 * - sourceNote: "Rata-rata pengukuran literatur gamelan Jawa slendro; pendekatan numerik digital."
 */

import { SlendroNote } from '../types/gamelan';

export interface TuningMetadata {
  validatedBy: string | null;
  sourceNote: string;
}

export const TUNING_METADATA: TuningMetadata = {
  validatedBy: null,
  sourceNote: 'Contoh — belum divalidasi praktisi karawitan (rata-rata literatur pengukuran akustik slendro).',
};

/**
 * 1. Frekuensi Saron Slendro 7 Bilah (dalam Hz)
 * Rentang terukur instrumen saron pada literatur: ~468 - 1427 Hz.
 * Urutan bilah fisik dari nada terendah ke tertinggi: 6, 1, 2, 3, 5, 6', 1'.
 */
export const SARON_TUNING: Record<string, number> = {
  '6': 496,   // Nem rendah (ngisor / bem)
  '1': 570,   // Ji
  '2': 655,   // Ro
  '3': 752,   // Lu
  '5': 864,   // Ma
  "6'": 992,  // Nem tinggi (cilik)
  "1'": 1139, // Ji tinggi (cilik)
};

/**
 * 2. Frekuensi Demung Slendro (1 oktaf di bawah Saron, f / 2)
 */
export const DEMUNG_TUNING: Record<string, number> = {
  '6': 248,
  '1': 285,
  '2': 327.5,
  '3': 376,
  '5': 432,
  "6'": 496,
  "1'": 569.5,
};

/**
 * 3. Frekuensi Peking Slendro (1 oktaf di atas Saron, f * 2)
 */
export const PEKING_TUNING: Record<string, number> = {
  '6': 992,
  '1': 1140,
  '2': 1310,
  '3': 1504,
  '5': 1728,
  "6'": 1984,
  "1'": 2278,
};

/**
 * 4. Frekuensi Kempul Slendro (Pencon gantung menengah)
 * Acuan literatur: 5=107, 6=124, 1=136, 2=157, 3=180 Hz
 */
export const KEMPUL_TUNING: Record<string, number> = {
  '5': 107,
  '6': 124,
  '1': 136,
  '2': 157,
  '3': 180,
};

/**
 * 5. Frekuensi Kenong Slendro (Pencon besar horizontal, register tengah di atas kempul)
 * Pendekatan: 1 oktaf di atas kempul (~214 - 360 Hz)
 */
export const KENONG_TUNING: Record<string, number> = {
  '5': 214,
  '6': 248,
  '1': 272,
  '2': 314,
  '3': 360,
};

/**
 * 6. Frekuensi Gong Suwukan (~133 Hz laras 1 / ~154 Hz laras 2)
 */
export const GONG_SUWUKAN_TUNING = {
  laras1: 133,
  laras2: 154,
  default: 133,
};

/**
 * 7. Frekuensi Fundamental Gong Ageng (dapat dikonfigurasi, rentang terukur 53 - 91 Hz)
 * Default rata-rata literatur: ~62 Hz
 */
export const DEFAULT_GONG_AGENG_FREQ = 62;

/**
 * 8. Frekuensi Kethuk (pukulan pendek berbobot di register pencon)
 */
export const KETHUK_FREQ = 480;

/**
 * Helper untuk mengambil frekuensi instrumen
 */
export function getInstrumentFrequency(
  instrument: string,
  note?: SlendroNote | string,
  gongAgengFreq: number = DEFAULT_GONG_AGENG_FREQ
): number {
  if (instrument === 'gong') {
    return gongAgengFreq;
  }
  if (instrument === 'gong_suwukan') {
    return note === '2' ? GONG_SUWUKAN_TUNING.laras2 : GONG_SUWUKAN_TUNING.default;
  }
  if (instrument === 'kethuk') {
    return KETHUK_FREQ;
  }

  const noteKey = String(note || '1');

  switch (instrument) {
    case 'demung':
      return DEMUNG_TUNING[noteKey] ?? 285;
    case 'peking':
      return PEKING_TUNING[noteKey] ?? 1140;
    case 'kempul':
      return KEMPUL_TUNING[noteKey] ?? 136;
    case 'kenong':
      return KENONG_TUNING[noteKey] ?? 272;
    case 'saron':
    default:
      return SARON_TUNING[noteKey] ?? 570;
  }
}
