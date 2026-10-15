import { SlendroNote } from '../types/gamelan';

/**
 * Pemetaan Frekuensi Laras Slendro Saron Kepatihan (dalam Hz)
 * Sesuai Bagian 6 & 7.4 PRD: Pendekatan nada Slendro Jawa (1, 2, 3, 5, 6)
 */
export const SLENDRO_FREQUENCIES: Record<number, number> = {
  1: 275, // Ji (C#4/D4)
  2: 315, // Ro (D#4)
  3: 360, // Lu (F4)
  5: 415, // Ma (G#4)
  6: 475, // Nem (A#4)
};

export class GamelanAudioSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: Array<{ stop: () => void; disconnect: () => void }> = [];

  constructor() {
    // AudioContext dibuat lazy saat ada interaksi pengguna
  }

  /**
   * Menginisialisasi dan membuka kunci AudioContext di peramban
   */
  public async initAudio(): Promise<AudioContext | null> {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    return this.ctx;
  }

  public getFrequency(note: SlendroNote): number {
    const num = Number(note);
    return SLENDRO_FREQUENCIES[num] || 275;
  }

  /**
   * Memainkan bunyi bilah Saron Slendro
   * Menggunakan model sintesis multi-osilator inharmonik bilah perunggu
   */
  public playSaronNote(note: SlendroNote, timeOffsetSec: number = 0, velocity: number = 90): void {
    if (!this.ctx || !this.masterGain) {
      // Coba inisialisasi sinkron jika memungkinkan
      if (typeof window !== 'undefined') {
        this.initAudio();
      }
      if (!this.ctx || !this.masterGain) return;
    }

    const t0 = Math.max(this.ctx.currentTime, this.ctx.currentTime + timeOffsetSec);
    const f0 = this.getFrequency(note);
    const velFactor = Math.min(1.2, Math.max(0.2, velocity / 100));

    // 1. Osilator Fundamental (Tubuh Bilah)
    const oscFund = this.ctx.createOscillator();
    const gainFund = this.ctx.createGain();
    oscFund.type = 'sine';
    oscFund.frequency.setValueAtTime(f0, t0);

    // Envelope peluruhan bilah logam (attack cepat 4ms, decay 1.8 detik)
    gainFund.gain.setValueAtTime(0.0001, t0);
    gainFund.gain.exponentialRampToValueAtTime(0.5 * velFactor, t0 + 0.004);
    gainFund.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.8);

    oscFund.connect(gainFund);
    gainFund.connect(this.masterGain);

    oscFund.start(t0);
    oscFund.stop(t0 + 1.85);

    // 2. Overtone Inharmonik 1: Denting Tabuhan Awal (2.76 * f0)
    const oscOvertone1 = this.ctx.createOscillator();
    const gainOvertone1 = this.ctx.createGain();
    oscOvertone1.type = 'sine';
    oscOvertone1.frequency.setValueAtTime(f0 * 2.76, t0);

    gainOvertone1.gain.setValueAtTime(0.0001, t0);
    gainOvertone1.gain.exponentialRampToValueAtTime(0.25 * velFactor, t0 + 0.002);
    gainOvertone1.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.15); // Decay cepat

    oscOvertone1.connect(gainOvertone1);
    gainOvertone1.connect(this.masterGain);

    oscOvertone1.start(t0);
    oscOvertone1.stop(t0 + 0.2);

    // 3. Overtone Inharmonik 2: Desis Logam (5.40 * f0)
    const oscOvertone2 = this.ctx.createOscillator();
    const gainOvertone2 = this.ctx.createGain();
    oscOvertone2.type = 'triangle';
    oscOvertone2.frequency.setValueAtTime(f0 * 5.4, t0);

    gainOvertone2.gain.setValueAtTime(0.0001, t0);
    gainOvertone2.gain.exponentialRampToValueAtTime(0.12 * velFactor, t0 + 0.002);
    gainOvertone2.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.08);

    oscOvertone2.connect(gainOvertone2);
    gainOvertone2.connect(this.masterGain);

    oscOvertone2.start(t0);
    oscOvertone2.stop(t0 + 0.1);

    const voice = {
      stop: () => {
        try {
          oscFund.stop();
          oscOvertone1.stop();
          oscOvertone2.stop();
        } catch {}
      },
      disconnect: () => {
        try {
          gainFund.disconnect();
          gainOvertone1.disconnect();
          gainOvertone2.disconnect();
        } catch {}
      },
    };
    this.activeNodes.push(voice);
  }

  /**
   * Memainkan bunyi Gong Ageng dengan getaran ombak (beating frequency)
   */
  public playGong(timeOffsetSec: number = 0, velocity: number = 110): void {
    if (!this.ctx || !this.masterGain) {
      if (typeof window !== 'undefined') {
        this.initAudio();
      }
      if (!this.ctx || !this.masterGain) return;
    }

    const t0 = Math.max(this.ctx.currentTime, this.ctx.currentTime + timeOffsetSec);
    const f0 = 55; // Nada rendah berwibawa (~A1)
    const velFactor = Math.min(1.2, Math.max(0.3, velocity / 100));

    // 1. Osilator Utama Gong
    const oscGong = this.ctx.createOscillator();
    const gainGong = this.ctx.createGain();
    oscGong.type = 'sine';
    oscGong.frequency.setValueAtTime(f0, t0);

    // 2. Osilator Ombak (LFO 2.2 Hz) untuk efek getaran khas gong Jawa
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(2.2, t0); // Frekuensi getaran ombak 2.2 Hz
    lfoGain.gain.setValueAtTime(0.15, t0);
    lfo.connect(lfoGain);

    // Envelope peluruhan panjang (4.0 detik)
    gainGong.gain.setValueAtTime(0.0001, t0);
    gainGong.gain.exponentialRampToValueAtTime(0.7 * velFactor, t0 + 0.02);
    gainGong.gain.exponentialRampToValueAtTime(0.0001, t0 + 4.0);

    oscGong.connect(gainGong);
    gainGong.connect(this.masterGain);

    lfo.start(t0);
    oscGong.start(t0);
    oscGong.stop(t0 + 4.1);
    lfo.stop(t0 + 4.1);

    // 3. Resonansi Nada Atas Gong (110 Hz)
    const oscHarmonic = this.ctx.createOscillator();
    const gainHarmonic = this.ctx.createGain();
    oscHarmonic.type = 'sine';
    oscHarmonic.frequency.setValueAtTime(110, t0);

    gainHarmonic.gain.setValueAtTime(0.0001, t0);
    gainHarmonic.gain.exponentialRampToValueAtTime(0.3 * velFactor, t0 + 0.015);
    gainHarmonic.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.5);

    oscHarmonic.connect(gainHarmonic);
    gainHarmonic.connect(this.masterGain);

    oscHarmonic.start(t0);
    oscHarmonic.stop(t0 + 2.6);

    const voice = {
      stop: () => {
        try {
          oscGong.stop();
          oscHarmonic.stop();
          lfo.stop();
        } catch {}
      },
      disconnect: () => {
        try {
          gainGong.disconnect();
          gainHarmonic.disconnect();
        } catch {}
      },
    };
    this.activeNodes.push(voice);
  }

  /**
   * Menghentikan seluruh bunyi yang sedang aktif
   */
  public stopAll(): void {
    this.activeNodes.forEach((node) => {
      try {
        node.stop();
        node.disconnect();
      } catch {}
    });
    this.activeNodes = [];
  }
}

// Singleton audio synthesizer untuk digunakan di seluruh aplikasi
export const gamelanSynth = new GamelanAudioSynth();
