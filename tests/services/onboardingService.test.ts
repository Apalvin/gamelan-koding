import { describe, it, expect, beforeEach } from 'vitest';
import { onboardingService, FINAL_CHALLENGE_TARGET_EVENTS } from '../../src/services/onboardingService';
import { karyakuService } from '../../src/services/karyakuService';
import { missionProgressService } from '../../src/services/missionProgressService';

describe('onboardingService (Milestone 6)', () => {
  beforeEach(() => {
    onboardingService.resetMemory();
    karyakuService.resetAll();
    missionProgressService.resetProgress();
  });

  it('harus mengembalikan status belum selesai secara default untuk pengguna baru', () => {
    expect(onboardingService.isOnboardingCompleted()).toBe(false);
  });

  it('harus dapat menyimpan dan membaca status onboarding', () => {
    onboardingService.setOnboardingCompleted(true);
    expect(onboardingService.isOnboardingCompleted()).toBe(true);

    onboardingService.setOnboardingCompleted(false);
    expect(onboardingService.isOnboardingCompleted()).toBe(false);
  });

  it('harus mengembalikan nama default Pengrawit Cilik jika belum diset', () => {
    expect(onboardingService.getStudentName()).toBe('Pengrawit Cilik');
  });

  it('harus dapat memperbarui nama siswa', () => {
    onboardingService.setStudentName('Budi');
    expect(onboardingService.getStudentName()).toBe('Budi');
  });

  it('harus memiliki definisi event target lancaran 8 ketukan', () => {
    expect(FINAL_CHALLENGE_TARGET_EVENTS).toBeDefined();
    expect(FINAL_CHALLENGE_TARGET_EVENTS.length).toBe(8);
    // 8 ketukan: 3, 5, 3, 2, 3, 5, 6, 5 (dengan gong di nada ke-8)
    const notes = FINAL_CHALLENGE_TARGET_EVENTS.map((e) => e.note);
    expect(notes).toEqual(['3', '5', '3', '2', '3', '5', '6', '5']);
    const gongEvent = FINAL_CHALLENGE_TARGET_EVENTS[7];
    expect(gongEvent.instrument).toBe('saron'); // nada seleh 5 dibunyikan
    // Dan ada gong di tMs yang sama
  });

  it('harus dapat mereset seluruh storage aplikasi (clean slate)', () => {
    // Siapkan data simulasi
    onboardingService.setOnboardingCompleted(true);
    onboardingService.setStudentName('Anak Juara');
    karyakuService.saveProject({
      title: 'Karya Uji',
      notesCount: 4,
      xml: '<xml></xml>',
    });
    missionProgressService.saveProgress('C1', 3, 'selesai');

    // Eksekusi Reset Total
    onboardingService.resetAllAppStorage();

    // Verifikasi semua kembali ke kondisi bersih awal
    expect(onboardingService.isOnboardingCompleted()).toBe(false);
    expect(onboardingService.getStudentName()).toBe('Pengrawit Cilik');
    expect(missionProgressService.getMissionProgress('C1').status).toBe('belum');
    expect(missionProgressService.getMissionProgress('C1').stars).toBe(0);
    expect(karyakuService.getAllProjects().length).toBe(1); // kembali ke 1 sample bawaan
  });
});
