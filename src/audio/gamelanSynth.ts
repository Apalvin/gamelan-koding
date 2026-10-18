import { SlendroNote, InstrumentType } from '../types/gamelan';
import {
  SARON_TUNING,
  DEMUNG_TUNING,
  PEKING_TUNING,
  KEMPUL_TUNING,
  KENONG_TUNING,
  GONG_SUWUKAN_TUNING,
  DEFAULT_GONG_AGENG_FREQ,
  KETHUK_FREQ,
  getInstrumentFrequency,
  TUNING_METADATA,
} from './gamelanTuning';

export { TUNING_METADATA };

/**
 * 12 Partial Aditif untuk Sintesis Gong Ageng Realistis (Pendekatan Teoretis)
 * Dirancang agar memiliki energi spektrum yang cukup pada rentang 150 - 1000 Hz
 * sehingga getaran dan dengungan tetap terdengar berwibawa di speaker HP / laptop kecil.
 */
export const GONG_AGENG_PARTIALS = [
  { ratio: 1.0, gain: 0.85, decay: 6.5 },   // Fundamental (~62 Hz)
  { ratio: 1.48, gain: 0.40, decay: 5.5 },  // Inharmonik sub-resonansi
  { ratio: 2.0, gain: 0.60, decay: 5.0 },   // Harmonik 2 (~124 Hz)
  { ratio: 2.78, gain: 0.50, decay: 4.5 },  // Mid-low inharmonik (~172 Hz - terdengar di HP)
  { ratio: 3.14, gain: 0.45, decay: 4.0 },  // (~195 Hz)
  { ratio: 4.02, gain: 0.40, decay: 3.5 },  // (~249 Hz)
  { ratio: 5.21, gain: 0.35, decay: 3.0 },  // (~323 Hz)
  { ratio: 6.38, gain: 0.30, decay: 2.6 },  // (~395 Hz)
  { ratio: 7.82, gain: 0.25, decay: 2.2 },  // (~485 Hz)
  { ratio: 9.15, gain: 0.20, decay: 1.8 },  // (~567 Hz)
  { ratio: 11.4, gain: 0.15, decay: 1.4 },  // (~707 Hz)
  { ratio: 14.2, gain: 0.12, decay: 1.0 },  // (~880 Hz - denting awal benturan tabuh)
];

/**
 * Rasio Bilah Logam Kuningan/Perunggu Saron (Pendekatan Teoretis Chladni / Inharmonic Modes)
 */
export const SARON_MODES = {
  fundamental: 1.0,
  overtone1: 2.76, // Denting inharmonik mode pertama
  overtone2: 5.40, // Mode kedua desis bilah logam
};

interface VoiceControl {
  stop: () => void;
  damp: () => void;
  instrument: string;
}

export class GamelanAudioSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private activeVoices: VoiceControl[] = [];
  private lastVoicePerInstrument: Map<string, VoiceControl> = new Map();
  private sampleBuffers: Map<string, AudioBuffer> = new Map();

  constructor() {
    // Inisialisasi lazy saat interaksi pengguna
  }

  /**
   * Menginisialisasi AudioContext, DynamicsCompressor, dan Master Gain
   */
  public async initAudio(): Promise<AudioContext | null> {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // 1. DynamicsCompressor untuk mencegah clipping saat banyak instrumen berbunyi serempak
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(24, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(5, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

        // 2. Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

        // Routing: Voice -> Compressor -> MasterGain -> Destination
        this.compressor.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    return this.ctx;
  }

  public getAudioContext(): AudioContext | null {
    return this.ctx;
  }

  /**
   * Helper frekuensi nada sesuai laras Slendro acuan literatur
   */
  public getFrequency(
    note: SlendroNote | string,
    instrument: InstrumentType | string = 'saron'
  ): number {
    return getInstrumentFrequency(instrument, note);
  }

  /**
   * Membuat noise burst pendek (~25ms) dengan bandpass filter untuk simulasi benturan fisik pemukul
   */
  private triggerNoiseImpulse(
    ctx: AudioContext,
    destination: AudioNode,
    time: number,
    filterFreq: number,
    durationSec: number = 0.025,
    gainLevel: number = 0.3
  ): void {
    const bufferSize = Math.floor(ctx.sampleRate * durationSec);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(filterFreq, time);
    bandpass.Q.setValueAtTime(3.0, time);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(gainLevel, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + durationSec);

    noiseSource.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(destination);

    noiseSource.start(time);
    noiseSource.stop(time + durationSec);
  }

  /**
   * Memainkan bilah balungan (Saron, Demung, Peking)
   * Menyertakan:
   * - Redaman (damping/mathet) bilah sebelumnya pada instrumen yang sama
   * - Variasi velocity mikro acak alami (humanization)
   * - Timbre berbeda (Demung lebih gelap/panjang, Peking lebih cerah/pendek)
   */
  public playNote(
    instrument: 'saron' | 'demung' | 'peking' | string = 'saron',
    note: SlendroNote | string,
    timeOffsetSec: number = 0,
    velocity: number = 90
  ): void {
    if (!this.ctx || !this.compressor) {
      if (typeof window !== 'undefined') {
        this.initAudio();
      }
      if (!this.ctx || !this.compressor) return;
    }

    const ctx = this.ctx;
    const dest = this.compressor;
    const t0 = Math.max(ctx.currentTime, ctx.currentTime + timeOffsetSec);
    const f0 = this.getFrequency(note, instrument);

    // Variasi acak velocity kecil (±5%) untuk dinamika sentuhan alami
    const humanizedVel = velocity * (0.95 + Math.random() * 0.1);
    const velFactor = Math.min(1.2, Math.max(0.2, humanizedVel / 100));

    // Peredaman bilah sebelumnya (teknik 'mathet')
    const prevVoice = this.lastVoicePerInstrument.get(instrument);
    if (prevVoice) {
      prevVoice.damp();
    }

    // Karakteristik Envelope & Timbre Berdasarkan Instrumen
    let decayDuration = 1.8;
    let gainFundPeak = 0.52 * velFactor;
    let gainOver1Peak = 0.26 * velFactor;
    let gainOver2Peak = 0.12 * velFactor;
    let decayOver1 = 0.15;
    let decayOver2 = 0.08;
    let clickFilter = 1200;

    if (instrument === 'demung') {
      decayDuration = 2.8; // Lebih panjang
      gainFundPeak = 0.68 * velFactor; // Lebih berbobot & gelap
      gainOver1Peak = 0.14 * velFactor;
      gainOver2Peak = 0.04 * velFactor;
      decayOver1 = 0.10;
      decayOver2 = 0.05;
      clickFilter = 800;
    } else if (instrument === 'peking') {
      decayDuration = 0.95; // Lebih pendek
      gainFundPeak = 0.38 * velFactor;
      gainOver1Peak = 0.35 * velFactor; // Lebih cerah & berdenting
      gainOver2Peak = 0.20 * velFactor;
      decayOver1 = 0.22;
      decayOver2 = 0.12;
      clickFilter = 2200;
    }

    // Voice Node Master Gain (untuk peredaman bilah)
    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(1.0, t0);
    voiceGain.connect(dest);

    // 1. Noise transient pukulan bilah kayu/tanduk
    this.triggerNoiseImpulse(ctx, voiceGain, t0, clickFilter, 0.015, 0.15 * velFactor);

    // 2. Osilator Fundamental
    const oscFund = ctx.createOscillator();
    const gainFund = ctx.createGain();
    oscFund.type = 'sine';
    oscFund.frequency.setValueAtTime(f0, t0);

    gainFund.gain.setValueAtTime(0.0001, t0);
    gainFund.gain.exponentialRampToValueAtTime(gainFundPeak, t0 + 0.004);
    gainFund.gain.exponentialRampToValueAtTime(0.0001, t0 + decayDuration);

    oscFund.connect(gainFund);
    gainFund.connect(voiceGain);

    oscFund.start(t0);
    oscFund.stop(t0 + decayDuration + 0.05);

    // 3. Overtone Inharmonik 1 (2.76 * f0)
    const oscOver1 = ctx.createOscillator();
    const gainOver1 = ctx.createGain();
    oscOver1.type = 'sine';
    oscOver1.frequency.setValueAtTime(f0 * SARON_MODES.overtone1, t0);

    gainOver1.gain.setValueAtTime(0.0001, t0);
    gainOver1.gain.exponentialRampToValueAtTime(gainOver1Peak, t0 + 0.002);
    gainOver1.gain.exponentialRampToValueAtTime(0.0001, t0 + decayOver1);

    oscOver1.connect(gainOver1);
    gainOver1.connect(voiceGain);

    oscOver1.start(t0);
    oscOver1.stop(t0 + decayOver1 + 0.05);

    // 4. Overtone Inharmonik 2 (5.40 * f0)
    const oscOver2 = ctx.createOscillator();
    const gainOver2 = ctx.createGain();
    oscOver2.type = 'triangle';
    oscOver2.frequency.setValueAtTime(f0 * SARON_MODES.overtone2, t0);

    gainOver2.gain.setValueAtTime(0.0001, t0);
    gainOver2.gain.exponentialRampToValueAtTime(gainOver2Peak, t0 + 0.002);
    gainOver2.gain.exponentialRampToValueAtTime(0.0001, t0 + decayOver2);

    oscOver2.connect(gainOver2);
    gainOver2.connect(voiceGain);

    oscOver2.start(t0);
    oscOver2.stop(t0 + decayOver2 + 0.05);

    // Objek kendali voice
    const voiceControl: VoiceControl = {
      instrument,
      stop: () => {
        try {
          oscFund.stop();
          oscOver1.stop();
          oscOver2.stop();
          voiceGain.disconnect();
        } catch {}
      },
      damp: () => {
        // Redam bilah dalam waktu 40ms saat bilah berikutnya dipukul
        try {
          const now = Math.max(ctx.currentTime, t0);
          voiceGain.gain.cancelScheduledValues(now);
          voiceGain.gain.setValueAtTime(voiceGain.gain.value, now);
          voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        } catch {}
      },
    };

    this.activeVoices.push(voiceControl);
    this.lastVoicePerInstrument.set(instrument, voiceControl);

    // Pembersihan otomatis saat selesai
    oscFund.onended = () => {
      this.activeVoices = this.activeVoices.filter((v) => v !== voiceControl);
      if (this.lastVoicePerInstrument.get(instrument) === voiceControl) {
        this.lastVoicePerInstrument.delete(instrument);
      }
    };
  }

  public playSaronNote(note: SlendroNote, timeOffsetSec: number = 0, velocity: number = 90): void {
    this.playNote('saron', note, timeOffsetSec, velocity);
  }

  /**
   * Memainkan bunyi Gong Ageng:
   * - ~12 Partial aditif dengan peluruhan individual
   * - Dual LFO modulasi nyata (ombak lambat 2.5 Hz + mikro-getas 20 Hz) tersambung ke AudioParam
   * - Noise burst pendek hentakan pemukul empuk
   * - Energi terjaga di 150-1000 Hz agar mantap di speaker laptop/HP
   */
  public playGong(timeOffsetSec: number = 0, velocity: number = 110): void {
    if (!this.ctx || !this.compressor) {
      if (typeof window !== 'undefined') {
        this.initAudio();
      }
      if (!this.ctx || !this.compressor) return;
    }

    const ctx = this.ctx;
    const dest = this.compressor;
    const t0 = Math.max(ctx.currentTime, ctx.currentTime + timeOffsetSec);
    const f0 = DEFAULT_GONG_AGENG_FREQ;
    const velFactor = Math.min(1.2, Math.max(0.3, velocity / 100));

    // Master voice gain untuk Gong Ageng
    const gongMasterGain = ctx.createGain();
    gongMasterGain.gain.setValueAtTime(1.0, t0);
    gongMasterGain.connect(dest);

    // 1. Noise burst lembut hentakan tabuh empuk
    this.triggerNoiseImpulse(ctx, gongMasterGain, t0, 320, 0.04, 0.35 * velFactor);

    // 2. Modulasi Ombak Lambat (LFO ~2.5 Hz) - Efek Ombak Khas Gong Ageng Jawa
    const slowLfo = ctx.createOscillator();
    const slowLfoGain = ctx.createGain();
    slowLfo.frequency.setValueAtTime(2.5, t0);
    slowLfoGain.gain.setValueAtTime(0.18, t0); // Kedalaman modulasi ombak ~18%
    slowLfo.connect(slowLfoGain);

    // 3. Modulasi Getaran Mikro Cepat (LFO ~20 Hz) - Getaran Pencon Perunggu
    const fastLfo = ctx.createOscillator();
    const fastLfoGain = ctx.createGain();
    fastLfo.frequency.setValueAtTime(20.0, t0);
    fastLfoGain.gain.setValueAtTime(0.04, t0); // Kedalaman getaran ~4%
    fastLfo.connect(fastLfoGain);

    // Node pembawa modulasi gabungan
    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(0.85, t0);
    slowLfoGain.connect(modGain.gain);
    fastLfoGain.connect(modGain.gain);
    modGain.connect(gongMasterGain);

    slowLfo.start(t0);
    fastLfo.start(t0);

    const oscillators: OscillatorNode[] = [slowLfo, fastLfo];
    let maxDecay = 6.5;

    // 4. Membuat 12 Partial Aditif
    GONG_AGENG_PARTIALS.forEach((p) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freq = f0 * p.ratio;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t0);

      const peakGain = p.gain * velFactor;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(peakGain, t0 + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + p.decay);

      osc.connect(gain);
      // Partial rendah tersambung modulasi ombak, partial sangat tinggi langsung ke gongMasterGain
      if (p.ratio < 6.0) {
        gain.connect(modGain);
      } else {
        gain.connect(gongMasterGain);
      }

      osc.start(t0);
      osc.stop(t0 + p.decay + 0.1);
      oscillators.push(osc);

      if (p.decay > maxDecay) maxDecay = p.decay;
    });

    slowLfo.stop(t0 + maxDecay + 0.1);
    fastLfo.stop(t0 + maxDecay + 0.1);

    const voiceControl: VoiceControl = {
      instrument: 'gong',
      stop: () => {
        oscillators.forEach((o) => {
          try {
            o.stop();
          } catch {}
        });
        try {
          gongMasterGain.disconnect();
        } catch {}
      },
      damp: () => {
        try {
          const now = Math.max(ctx.currentTime, t0);
          gongMasterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
        } catch {}
      },
    };

    this.activeVoices.push(voiceControl);
    oscillators[2].onended = () => {
      this.activeVoices = this.activeVoices.filter((v) => v !== voiceControl);
    };
  }

  /**
   * Memainkan Gong Suwukan (~133 Hz / ~154 Hz)
   */
  public playGongSuwukan(note: string = '1', timeOffsetSec: number = 0, velocity: number = 100): void {
    if (!this.ctx || !this.compressor) {
      if (typeof window !== 'undefined') this.initAudio();
      if (!this.ctx || !this.compressor) return;
    }

    const ctx = this.ctx;
    const dest = this.compressor;
    const t0 = Math.max(ctx.currentTime, ctx.currentTime + timeOffsetSec);
    const f0 = note === '2' ? GONG_SUWUKAN_TUNING.laras2 : GONG_SUWUKAN_TUNING.laras1;
    const velFactor = Math.min(1.2, Math.max(0.3, velocity / 100));

    const gain = ctx.createGain();
    gain.connect(dest);

    // LFO Ombak sedang (~3.2 Hz)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(3.2, t0);
    lfoGain.gain.setValueAtTime(0.15, t0);
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(f0, t0);
    osc.connect(gain);

    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.6 * velFactor, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.8);

    osc.start(t0);
    lfo.start(t0);
    osc.stop(t0 + 4.0);
    lfo.stop(t0 + 4.0);

    const voice: VoiceControl = {
      instrument: 'gong_suwukan',
      stop: () => {
        try {
          osc.stop();
          lfo.stop();
          gain.disconnect();
        } catch {}
      },
      damp: () => {
        try {
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
        } catch {}
      },
    };
    this.activeVoices.push(voice);
  }

  /**
   * Memainkan Kenong (Pencon besar horizontal, suara memanjang jernih dan berbobot)
   */
  public playKenong(note: SlendroNote | string = '1', timeOffsetSec: number = 0, velocity: number = 95): void {
    if (!this.ctx || !this.compressor) {
      if (typeof window !== 'undefined') this.initAudio();
      if (!this.ctx || !this.compressor) return;
    }

    const ctx = this.ctx;
    const dest = this.compressor;
    const t0 = Math.max(ctx.currentTime, ctx.currentTime + timeOffsetSec);
    const f0 = this.getFrequency(note, 'kenong');
    const velFactor = Math.min(1.2, Math.max(0.2, velocity / 100));

    const kGain = ctx.createGain();
    kGain.connect(dest);

    // Fundamental (Kaya, nyaring berbobot)
    const oscFund = ctx.createOscillator();
    const gFund = ctx.createGain();
    oscFund.frequency.setValueAtTime(f0, t0);
    gFund.gain.setValueAtTime(0.0001, t0);
    gFund.gain.exponentialRampToValueAtTime(0.65 * velFactor, t0 + 0.008);
    gFund.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.2);
    oscFund.connect(gFund);
    gFund.connect(kGain);

    // Overtone pencon (~2.04 dan 3.42)
    const oscOver = ctx.createOscillator();
    const gOver = ctx.createGain();
    oscOver.frequency.setValueAtTime(f0 * 2.04, t0);
    gOver.gain.setValueAtTime(0.0001, t0);
    gOver.gain.exponentialRampToValueAtTime(0.3 * velFactor, t0 + 0.005);
    gOver.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.2);
    oscOver.connect(gOver);
    gOver.connect(kGain);

    oscFund.start(t0);
    oscOver.start(t0);
    oscFund.stop(t0 + 3.3);
    oscOver.stop(t0 + 1.3);

    const voice: VoiceControl = {
      instrument: 'kenong',
      stop: () => {
        try {
          oscFund.stop();
          oscOver.stop();
          kGain.disconnect();
        } catch {}
      },
      damp: () => {
        try {
          kGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
        } catch {}
      },
    };
    this.activeVoices.push(voice);
  }

  /**
   * Memainkan Kempul (Pencon gantung register tengah)
   */
  public playKempul(note: SlendroNote | string = '5', timeOffsetSec: number = 0, velocity: number = 90): void {
    if (!this.ctx || !this.compressor) {
      if (typeof window !== 'undefined') this.initAudio();
      if (!this.ctx || !this.compressor) return;
    }

    const ctx = this.ctx;
    const dest = this.compressor;
    const t0 = Math.max(ctx.currentTime, ctx.currentTime + timeOffsetSec);
    const f0 = this.getFrequency(note, 'kempul');
    const velFactor = Math.min(1.2, Math.max(0.2, velocity / 100));

    const pGain = ctx.createGain();
    pGain.connect(dest);

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.setValueAtTime(f0, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.55 * velFactor, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.5);

    osc.connect(g);
    g.connect(pGain);

    osc.start(t0);
    osc.stop(t0 + 2.6);

    const voice: VoiceControl = {
      instrument: 'kempul',
      stop: () => {
        try {
          osc.stop();
          pGain.disconnect();
        } catch {}
      },
      damp: () => {
        try {
          pGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
        } catch {}
      },
    };
    this.activeVoices.push(voice);
  }

  /**
   * Memainkan Kethuk (Pukulan pendek, kering, tanpa dengungan/ombak panjang)
   */
  public playKethuk(timeOffsetSec: number = 0, velocity: number = 85): void {
    if (!this.ctx || !this.compressor) {
      if (typeof window !== 'undefined') this.initAudio();
      if (!this.ctx || !this.compressor) return;
    }

    const ctx = this.ctx;
    const dest = this.compressor;
    const t0 = Math.max(ctx.currentTime, ctx.currentTime + timeOffsetSec);
    const f0 = KETHUK_FREQ;
    const velFactor = Math.min(1.2, Math.max(0.2, velocity / 100));

    const kGain = ctx.createGain();
    kGain.connect(dest);

    // Kethuk bersifat sangat 'percussive' dan teredam rapat oleh tali rancakan
    this.triggerNoiseImpulse(ctx, kGain, t0, 950, 0.02, 0.3 * velFactor);

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(f0, t0);

    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.6 * velFactor, t0 + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18); // Sangat cepat / kering

    osc.connect(g);
    g.connect(kGain);

    osc.start(t0);
    osc.stop(t0 + 0.22);

    const voice: VoiceControl = {
      instrument: 'kethuk',
      stop: () => {
        try {
          osc.stop();
          kGain.disconnect();
        } catch {}
      },
      damp: () => {},
    };
    this.activeVoices.push(voice);
  }

  /**
   * Dispatcher instrumen umum berdasarkan tipe instrumen
   */
  public playAnyInstrument(
    instrument: InstrumentType | string,
    note?: SlendroNote | string,
    timeOffsetSec: number = 0,
    velocity: number = 90
  ): void {
    switch (instrument) {
      case 'gong':
        this.playGong(timeOffsetSec, velocity);
        break;
      case 'gong_suwukan':
        this.playGongSuwukan(String(note || '1'), timeOffsetSec, velocity);
        break;
      case 'kenong':
        this.playKenong(note || '1', timeOffsetSec, velocity);
        break;
      case 'kempul':
        this.playKempul(note || '5', timeOffsetSec, velocity);
        break;
      case 'kethuk':
        this.playKethuk(timeOffsetSec, velocity);
        break;
      case 'demung':
      case 'peking':
      case 'saron':
      default:
        this.playNote(instrument as any, (note as SlendroNote) || '1', timeOffsetSec, velocity);
        break;
    }
  }

  /**
   * Menghentikan seluruh suara yang sedang aktif
   */
  public stopAll(): void {
    this.activeVoices.forEach((v) => {
      try {
        v.stop();
      } catch {}
    });
    this.activeVoices = [];
    this.lastVoicePerInstrument.clear();
  }
}

// Singleton audio synthesizer untuk digunakan di seluruh aplikasi
export const gamelanSynth = new GamelanAudioSynth();
