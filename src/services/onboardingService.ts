import { GamelanEvent } from '../types/gamelan';
import { karyakuService } from './karyakuService';
import { missionProgressService } from './missionProgressService';

const STORAGE_KEY_ONBOARDING = 'gamelan_onboarding_completed';
const STORAGE_KEY_STUDENT_NAME = 'gamelan_student_name';

/**
 * Pola Target Lancaran 8 Ketukan: 3 - 5 - 3 - 2 - 3 - 5 - 6 - 5
 * Di ketukan ke-8 (nada seleh 5) dibunyikan serempak bersama Gong Ageng.
 * Label Budaya: "Contoh — belum divalidasi praktisi karawitan" (validatedBy: null)
 */
export const FINAL_CHALLENGE_TARGET_EVENTS: GamelanEvent[] = [
  { tMs: 0, instrument: 'saron', note: '3', velocity: 0.85 },
  { tMs: 500, instrument: 'saron', note: '5', velocity: 0.85 },
  { tMs: 1000, instrument: 'saron', note: '3', velocity: 0.85 },
  { tMs: 1500, instrument: 'saron', note: '2', velocity: 0.85 },
  { tMs: 2000, instrument: 'saron', note: '3', velocity: 0.85 },
  { tMs: 2500, instrument: 'saron', note: '5', velocity: 0.85 },
  { tMs: 3000, instrument: 'saron', note: '6', velocity: 0.85 },
  { tMs: 3500, instrument: 'saron', note: '5', velocity: 0.85 },
];

export const FINAL_CHALLENGE_PLAYBACK_EVENTS: GamelanEvent[] = [
  ...FINAL_CHALLENGE_TARGET_EVENTS,
  { tMs: 3500, instrument: 'gong', velocity: 1.0 },
];

export class OnboardingService {
  private memoryCompleted: boolean | null = null;
  private memoryStudentName: string | null = null;

  private isLocalStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && window.localStorage !== null;
    } catch {
      return false;
    }
  }

  public isOnboardingCompleted(): boolean {
    if (this.memoryCompleted !== null) {
      return this.memoryCompleted;
    }

    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      return localStorage.getItem(STORAGE_KEY_ONBOARDING) === 'true';
    } catch {
      return false;
    }
  }

  public setOnboardingCompleted(completed: boolean): void {
    this.memoryCompleted = completed;
    if (this.isLocalStorageAvailable()) {
      try {
        if (completed) {
          localStorage.setItem(STORAGE_KEY_ONBOARDING, 'true');
        } else {
          localStorage.removeItem(STORAGE_KEY_ONBOARDING);
        }
      } catch (err) {
        console.error('onboardingService: gagal menyimpan status onboarding', err);
      }
    }
  }

  public getStudentName(): string {
    if (this.memoryStudentName !== null) {
      return this.memoryStudentName;
    }

    if (!this.isLocalStorageAvailable()) {
      return 'Pengrawit Cilik';
    }

    try {
      return localStorage.getItem(STORAGE_KEY_STUDENT_NAME) || 'Pengrawit Cilik';
    } catch {
      return 'Pengrawit Cilik';
    }
  }

  public setStudentName(name: string): void {
    const trimmed = name.trim() || 'Pengrawit Cilik';
    this.memoryStudentName = trimmed;
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.setItem(STORAGE_KEY_STUDENT_NAME, trimmed);
      } catch (err) {
        console.error('onboardingService: gagal menyimpan nama siswa', err);
      }
    }
  }

  /**
   * Reset seluruh penyimpanan data aplikasi di browser (Clean Slate).
   * Menghapus semua key `gamelan_*` dan me-reset cache memori.
   */
  public resetAllAppStorage(): void {
    this.memoryCompleted = null;
    this.memoryStudentName = null;

    if (this.isLocalStorageAvailable()) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('gamelan_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch (err) {
        console.error('onboardingService: gagal membersihkan storage', err);
      }
    }

    // Reset service-service terkait
    karyakuService.resetAll();
    missionProgressService.resetProgress();
  }

  /**
   * Reset internal memory untuk unit testing
   */
  public resetMemory(): void {
    this.memoryCompleted = null;
    this.memoryStudentName = null;
  }
}

export const onboardingService = new OnboardingService();
