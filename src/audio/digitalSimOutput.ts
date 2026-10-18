import * as Blockly from 'blockly';
import { GamelanEvent, GamelanOutput } from '../types/gamelan';
import { GamelanAudioSynth, gamelanSynth } from './gamelanSynth';

export type VisualEventCallback = (event: GamelanEvent | null) => void;

/**
 * DigitalSimOutput: Lookahead Web Audio Scheduler & Visual Synchronizer
 *
 * Menjadwalkan bunyi langsung ke timeline Web Audio API (AudioContext.currentTime)
 * saat konteks audio peramban tersedia, sehingga bebas dari jitter setTimeout.
 * Visual bilah menyala dan block highlighting disinkronkan secara presisi
 * membaca waktu AudioContext melalui requestAnimationFrame.
 */
export class DigitalSimOutput implements GamelanOutput {
  private synth: GamelanAudioSynth;
  private workspace: Blockly.WorkspaceSvg | null = null;
  private onVisualEvent: VisualEventCallback | null = null;
  private onFinish: (() => void) | null = null;
  private isPlaying: boolean = false;
  private resolveCurrentPlay: (() => void) | null = null;
  private lastHighlightedBlock: any = null;
  private rafId: number | null = null;
  private timerIds: any[] = [];

  constructor(synth: GamelanAudioSynth = gamelanSynth) {
    this.synth = synth;
  }

  public setWorkspace(workspace: Blockly.WorkspaceSvg | null): void {
    this.workspace = workspace;
  }

  public setOnVisualEvent(callback: VisualEventCallback | null): void {
    this.onVisualEvent = callback;
  }

  public setOnFinish(callback: (() => void) | null): void {
    this.onFinish = callback;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Menyorot blok Blockly dan memicu visualisasi bilah menyala
   */
  private triggerVisualAndHighlight(ev: GamelanEvent): void {
    if (this.lastHighlightedBlock) {
      try {
        this.lastHighlightedBlock.getSvgRoot()?.classList.remove('blockly-block-playing');
      } catch {}
      this.lastHighlightedBlock = null;
    }

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

    if (this.onVisualEvent) {
      this.onVisualEvent(ev);
    }
  }

  /**
   * Membunyikan instrumen melalui synthesizer
   */
  private triggerAudioVoice(ev: GamelanEvent, timeOffsetSec: number = 0): void {
    if (ev.instrument === 'gong') {
      this.synth.playGong(timeOffsetSec, ev.velocity);
    } else if (ev.instrument === 'demung' || ev.instrument === 'peking') {
      if (typeof this.synth.playNote === 'function') {
        this.synth.playNote(ev.instrument, ev.note as any, timeOffsetSec, ev.velocity);
      } else {
        this.synth.playSaronNote(ev.note as any, timeOffsetSec, ev.velocity);
      }
    } else if (
      ev.instrument === 'kenong' ||
      ev.instrument === 'kempul' ||
      ev.instrument === 'kethuk' ||
      ev.instrument === 'gong_suwukan'
    ) {
      if (typeof this.synth.playAnyInstrument === 'function') {
        this.synth.playAnyInstrument(ev.instrument, ev.note, timeOffsetSec, ev.velocity);
      }
    } else if (ev.note) {
      this.synth.playSaronNote(ev.note, timeOffsetSec, ev.velocity);
    }
  }

  /**
   * Memainkan antrean event tabuhan gamelan dengan Web Audio Lookahead Scheduler
   */
  public async play(events: GamelanEvent[]): Promise<void> {
    this.stop();

    if (!events || events.length === 0) {
      return;
    }

    this.isPlaying = true;

    // Inisialisasi AudioContext jika belum dibuka
    await this.synth.initAudio();

    if (!this.isPlaying) return;

    return new Promise<void>((resolve) => {
      this.resolveCurrentPlay = resolve;

      const sortedEvents = [...events].sort((a, b) => a.tMs - b.tMs);
      const totalDuration = sortedEvents[sortedEvents.length - 1].tMs;

      const ctx =
        typeof this.synth.getAudioContext === 'function'
          ? this.synth.getAudioContext()
          : null;

      const isRealAudioContext = ctx && typeof ctx.currentTime === 'number';

      // Jika AudioContext aktif di peramban riil:
      // Jadwalkan seluruh audio langsung ke timeline AudioContext.currentTime (Lookahead)
      if (isRealAudioContext) {
        const leadTimeSec = 0.04;
        sortedEvents.forEach((ev) => {
          const timeOffsetSec = leadTimeSec + ev.tMs / 1000;
          this.triggerAudioVoice(ev, timeOffsetSec);
        });
      }

      // Sinkronisasi visual, highlight, dan audio (jika mock/non-browser)
      sortedEvents.forEach((ev, idx) => {
        const tid = setTimeout(() => {
          if (!this.isPlaying) return;

          // Jika non-browser atau mock synthesizer tanpa AudioContext, picu bunyi saat timer aktif
          if (!isRealAudioContext) {
            this.triggerAudioVoice(ev, 0);
          }

          // Picu visualisasi bilah & highlight blok di kanvas
          this.triggerVisualAndHighlight(ev);

          const nextEv = sortedEvents[idx + 1];
          const timeToNext = nextEv ? nextEv.tMs - ev.tMs : 450;
          const resetDur = Math.min(Math.max(timeToNext - 40, 150), 400);

          const rTid = setTimeout(() => {
            if (this.isPlaying && this.onVisualEvent) {
              this.onVisualEvent(null);
            }
          }, resetDur);
          this.timerIds.push(rTid);
        }, ev.tMs);

        this.timerIds.push(tid);
      });

      // Jadwalkan akhir program (tMs terakhir + padding suara meluruh)
      const finishPaddingMs = 500;
      const finishTid = setTimeout(() => {
        this.stop();
        if (this.onFinish) {
          this.onFinish();
        }
      }, totalDuration + finishPaddingMs);

      this.timerIds.push(finishTid);
    });
  }

  /**
   * Menghentikan pemutaran, mematikan audio, dan membersihkan penyorotan blok
   */
  public stop(): void {
    if (this.rafId !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.timerIds.forEach((id) => clearTimeout(id));
    this.timerIds = [];

    this.synth.stopAll();

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

    if (this.onVisualEvent) {
      try {
        this.onVisualEvent(null);
      } catch {}
    }

    this.isPlaying = false;

    if (this.resolveCurrentPlay) {
      const resolve = this.resolveCurrentPlay;
      this.resolveCurrentPlay = null;
      resolve();
    }
  }
}

export const digitalSimOutput = new DigitalSimOutput();
