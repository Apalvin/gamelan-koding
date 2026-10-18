import { MissionProgressMap, MissionProgressRecord, MissionStatus } from '../types/mission';

const STORAGE_KEY = 'gamelan_mission_progress';

export class MissionProgressService {
  private cache: MissionProgressMap | null = null;

  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  public getAllProgress(): MissionProgressMap {
    if (this.cache !== null) {
      return this.cache;
    }

    if (!this.isLocalStorageAvailable()) {
      return {};
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.cache = JSON.parse(stored);
        return this.cache || {};
      }
    } catch {
      // Fallback aman jika localStorage diblokir
    }

    this.cache = {};
    return this.cache;
  }

  public getMissionProgress(code: string): MissionProgressRecord {
    const all = this.getAllProgress();
    return (
      all[code] || {
        status: 'belum',
        stars: 0,
      }
    );
  }

  public saveProgress(
    code: string,
    stars: number,
    status: MissionStatus = 'selesai'
  ): MissionProgressRecord {
    const all = { ...this.getAllProgress() };
    const current = all[code] || { status: 'belum', stars: 0 };

    const newStars = Math.max(current.stars || 0, Math.min(3, Math.max(0, stars)));
    const newStatus: MissionStatus =
      status === 'selesai' || current.status === 'selesai' ? 'selesai' : status;

    const updatedRecord: MissionProgressRecord = {
      status: newStatus,
      stars: newStars,
      completedAt: newStatus === 'selesai' ? new Date().toISOString() : current.completedAt,
    };

    all[code] = updatedRecord;
    this.cache = all;

    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      } catch {
        // Fallback aman
      }
    }

    return updatedRecord;
  }

  public isCompleted(code: string): boolean {
    return this.getMissionProgress(code).status === 'selesai';
  }

  public getTotalStars(): number {
    const all = this.getAllProgress();
    return Object.values(all).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  }

  public resetProgress(): void {
    this.cache = {};
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }
}

export const missionProgressService = new MissionProgressService();
