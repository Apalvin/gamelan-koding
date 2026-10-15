import * as Blockly from 'blockly';
import { GamelanEvent, GamelanOutput } from '../types/gamelan';
import { GamelanAudioSynth, gamelanSynth } from './gamelanSynth';

export type VisualEventCallback = (event: GamelanEvent | null) => void;

/**
 * DigitalSimOutput: Implementasi GamelanOutput Sesuai Bagian 7.3 & 7.4 PRD
 *
 * Mengatur orkestrasi pemutaran audio digital sintesis Web Audio API,
 * penyorotan blok aktif di kanvas Blockly (block highlighting),
 * serta animasi visual bilah saron dan gong yang menyala serasi.
 */
export class DigitalSimOutput implements GamelanOutput {
  private synth: GamelanAudioSynth;
  private workspace: Blockly.WorkspaceSvg | null = null;
  private onVisualEvent: VisualEventCallback | null = null;
  private onFinish: (() => void) | null = null;
  private timeoutIds: any[] = [];
  private isPlaying: boolean = false;
  private resolveCurrentPlay: (() => void) | null = null;
  private lastHighlightedBlock: any = null;

  constructor(synth: GamelanAudioSynth = gamelanSynth) {
    this.synth = synth;
  }

  /**
   * Menghubungkan kanvas Blockly aktif untuk fitur highlightBlock(blockId)
   */
  public setWorkspace(workspace: Blockly.WorkspaceSvg | null): void {
    this.workspace = workspace;
  }

  /**
   * Mendaftarkan listener untuk pembaruan visualisasi bilah / gong
   */
  public setOnVisualEvent(callback: VisualEventCallback | null): void {
    this.onVisualEvent = callback;
  }

  /**
   * Mendaftarkan callback ketika seluruh tabuhan selesai
   */
  public setOnFinish(callback: (() => void) | null): void {
    this.onFinish = callback;
  }

  /**
   * Status apakah pemutar simulasi sedang aktif berjalan
   */
  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Memainkan antrean event tabuhan gamelan (Bagian 7.3 PRD)
   */
  public async play(events: GamelanEvent[]): Promise<void> {
    // 1. Hentikan pemutaran sebelumnya jika sedang berjalan
    this.stop();

    if (!events || events.length === 0) {
      return;
    }

    this.isPlaying = true;

    // 2. Aktifkan AudioContext Web Audio API jika belum aktif
    await this.synth.initAudio();

    // Jika dihentikan saat proses inisialisasi audio
    if (!this.isPlaying) {
      return;
    }

    return new Promise<void>((resolve) => {
      this.resolveCurrentPlay = resolve;

      // Urutkan event berdasarkan waktu tMs
      const sortedEvents = [...events].sort((a, b) => a.tMs - b.tMs);
      const totalDuration = sortedEvents[sortedEvents.length - 1].tMs;

      sortedEvents.forEach((ev, idx) => {
        const timeoutId = setTimeout(() => {
          if (!this.isPlaying) return;

          // 1. Putar bunyi melalui synthesizer
          if (ev.instrument === 'gong') {
            this.synth.playGong(0, ev.velocity);
          } else if (ev.note) {
            this.synth.playSaronNote(ev.note, 0, ev.velocity);
          }

          // 2. Bersihkan styling blok sebelumnya
          if (this.lastHighlightedBlock) {
            try {
              this.lastHighlightedBlock.getSvgRoot()?.classList.remove('blockly-block-playing');
            } catch {}
            this.lastHighlightedBlock = null;
          }

          // 3. Sorot blok Blockly yang sedang berbunyi di kanvas
          if (this.workspace && typeof this.workspace.highlightBlock === 'function') {
            this.workspace.highlightBlock(ev.blockId || null);
          }

          if (ev.blockId && this.workspace && typeof this.workspace.getBlockById === 'function') {
            try {
              const blk = this.workspace.getBlockById(ev.blockId);
              if (blk) {
                blk.getSvgRoot()?.classList.add('blockly-block-playing');
                this.lastHighlightedBlock = blk;
              }
            } catch {}
          }

          // 4. Picu animasi visual bilah / gong menyala
          if (this.onVisualEvent) {
            this.onVisualEvent(ev);
          }

          // 5. Hitung durasi reset animasi visual sebelum nada berikutnya
          const nextEvent = sortedEvents[idx + 1];
          const timeToNext = nextEvent ? nextEvent.tMs - ev.tMs : 450;
          const visualResetDuration = Math.min(Math.max(timeToNext - 50, 150), 400);

          const resetTimeoutId = setTimeout(() => {
            if (this.isPlaying && this.onVisualEvent) {
              this.onVisualEvent(null);
            }
          }, visualResetDuration);
          this.timeoutIds.push(resetTimeoutId);
        }, ev.tMs);

        this.timeoutIds.push(timeoutId);
      });

      // Jadwalkan akhir program (tMs terakhir + padding suara meluruh)
      const finishPaddingMs = 500;
      const finishTimeoutId = setTimeout(() => {
        this.stop();
        if (this.onFinish) {
          this.onFinish();
        }
      }, totalDuration + finishPaddingMs);

      this.timeoutIds.push(finishTimeoutId);
    });
  }

  /**
   * Menghentikan pemutaran, mematikan audio, dan membersihkan penyorotan blok
   */
  public stop(): void {
    // Batalkan seluruh timeout yang tertunda
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds = [];

    // Matikan suara synth
    this.synth.stopAll();

    // Bersihkan highlight pada blok Blockly
    if (this.workspace && typeof this.workspace.highlightBlock === 'function') {
      try {
        this.workspace.highlightBlock(null);
      } catch {}
    }

    if (this.lastHighlightedBlock) {
      try {
        this.lastHighlightedBlock.getSvgRoot()?.classList.remove('blockly-block-playing');
      } catch {}
      this.lastHighlightedBlock = null;
    }

    // Reset visualisasi bilah
    if (this.onVisualEvent) {
      try {
        this.onVisualEvent(null);
      } catch {}
    }

    this.isPlaying = false;

    // Selesaikan Promise play() jika masih menunggu
    if (this.resolveCurrentPlay) {
      const resolve = this.resolveCurrentPlay;
      this.resolveCurrentPlay = null;
      resolve();
    }
  }
}

// Instance singleton DigitalSimOutput untuk digunakan di Editor
export const digitalSimOutput = new DigitalSimOutput();
