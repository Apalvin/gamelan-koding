import { GamelanEvent } from '../types/gamelan';
import { EvaluationResult } from '../types/mission';

const TARGET_NOTES = ['3', '5', '3', '2', '3', '5', '6', '5'];

/**
 * Mesin Evaluator Otomatis untuk Tantangan Gending Akhir (Milestone 6)
 * Mengevaluasi pola lancaran 8 ketukan berpadu gong ageng di nada seleh.
 * Prinsip: 100% ramah anak SD, bebas dari kata "gagal", mengapresiasi keberanian mencoba.
 */
export function evaluateFinalChallenge(events: GamelanEvent[]): EvaluationResult {
  if (!events || events.length === 0) {
    return {
      isCorrect: false,
      stars: 0,
      title: 'Yuk Mulai Koding!',
      message: 'Belum ada tabuhan yang disambung ke blok ketika ▶ ditekan. Sambungkan blok tabuhan saron dan gong ya!',
    };
  }

  // Ambil seluruh nada bilah saron/demung/peking berurutan
  const playedNotes: string[] = [];
  let hasGong = false;

  for (const ev of events) {
    if (ev.instrument === 'gong') {
      hasGong = true;
    } else if (ev.note !== undefined && ev.note !== null) {
      playedNotes.push(String(ev.note));
    }
  }

  const isExactNotes =
    playedNotes.length === TARGET_NOTES.length &&
    playedNotes.every((n, i) => n === TARGET_NOTES[i]);

  if (isExactNotes && hasGong) {
    return {
      isCorrect: true,
      stars: 3,
      title: 'Luar Biasa! Jenius Karawitan! 🌟',
      message:
        'Hebat sekali! Kamu berhasil meniru seluruh pola gending akhir 8 ketukan berpadu gong ageng dengan sangat sempurna!',
      detail: 'Pola tabuhan: 3 - 5 - 3 - 2 - 3 - 5 - 6 - 5 berpadu Gong Ageng.',
    };
  }

  // Jika siswa sudah mencoba (skenario pemula yang diharapkan di awal sebelum C1)
  return {
    isCorrect: false,
    stars: 1, // Beri 1 bintang apresiasi karena berani mencoba tantangan akhir
    title: 'Hebat, Kamu Sudah Berani Mencoba! 👏',
    message:
      'Tantangan ini memang sengaja dirancang untuk tingkat akhir setelah kamu menguasai semua jenis tabuhan. Jangan berkecil hati, yuk kita mulai dari level dasar (Misi C1) agar kamu bisa mahir selangkah demi selangkah!',
    hint: 'Pola target akhir: 3 - 5 - 3 - 2 - 3 - 5 - 6 - 5 diakhiri Gong Ageng.',
    detail: `Kamu sudah menyusun ${playedNotes.length} ketukan tabuhan. Terus semangat belajar!`,
  };
}
