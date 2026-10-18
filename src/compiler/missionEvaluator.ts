import { GamelanEvent } from '../types/gamelan';
import { EvaluationResult, Mission } from '../types/mission';

/**
 * Evaluator Misi C1: Kenali Gamelan (Kuis Pilihan Ganda Ramah Anak)
 */
export function evaluateC1(
  userAnswers: Record<string, string>,
  mission: Mission
): EvaluationResult {
  const questions = mission.quiz?.questions || [];
  if (questions.length === 0) {
    return {
      isCorrect: true,
      stars: 3,
      title: 'Hebat!',
      message: 'Kamu telah menyelesaikan pengenalan instrumen!',
    };
  }

  let correctCount = 0;
  questions.forEach((q) => {
    if (userAnswers[q.id] === q.correctAnswerId) {
      correctCount++;
    }
  });

  if (correctCount === questions.length) {
    return {
      isCorrect: true,
      stars: 3,
      title: 'Luar Biasa!',
      message: 'Luar biasa! Telingamu sangat peka mengenali perbedaan denting saron dan dengungan gong ageng!',
    };
  }

  if (correctCount > 0) {
    return {
      isCorrect: false,
      stars: 2,
      title: 'Bagus Sekali!',
      message: 'Kamu sudah mengenali sebagian instrumen dengan tepat. Dengarkan kembali suara yang belum pas ya!',
      hint: 'Denting bilah perunggu tebal bersuara nyaring adalah Saron, sedangkan dengungan besar bergetar lambat adalah Gong Ageng.',
    };
  }

  return {
    isCorrect: false,
    stars: 1,
    title: 'Ayo Dengarkan Lagi!',
    message: 'Setiap instrumen gamelan memiliki watak suara yang berbeda. Tekan tombol dengarkan dan coba lagi!',
    hint: 'Gong memiliki suara paling berat dan dalam, sementara Saron berdenting cerah.',
  };
}

/**
 * Evaluator Misi C2: Pahami Polanya (Urutan Potongan Pola)
 */
export function evaluateC2(
  userSequence: string[],
  mission: Mission
): EvaluationResult {
  const puzzle = mission.patternPuzzle;
  if (!puzzle) {
    return {
      isCorrect: true,
      stars: 3,
      title: 'Hebat!',
      message: 'Pola tabuhan tersusun dengan baik!',
    };
  }

  const isExact =
    userSequence.length === puzzle.correctSequence.length &&
    userSequence.every((val, idx) => val === puzzle.correctSequence[idx]);

  if (isExact) {
    return {
      isCorrect: true,
      stars: 3,
      title: 'Susunan Pola Tepat!',
      message: 'Hebat! Kamu berhasil menyusun potongan melodi menjadi kalimat tabuhan yang utuh dan selaras!',
    };
  }

  return {
    isCorrect: false,
    stars: 1,
    title: 'Hampir Jadi!',
    message: 'Potongan irama masih belum pas urutannya. Dengarkan kembali contoh lagu dan susun dari nada awal ya!',
    hint: 'Pola ini dimulai dari nada 1 - 2, lalu dilanjutkan dengan nada 3 - 5.',
  };
}

/**
 * Helper pembanding event tabuhan
 */
function compareEvents(
  actual: GamelanEvent[],
  target: GamelanEvent[]
): {
  isMatch: boolean;
  missingGong: boolean;
  notesMatch: boolean;
  wrongNotes: boolean;
  hasGapIssue: boolean;
} {
  if (actual.length === 0) {
    return { isMatch: false, missingGong: false, notesMatch: false, wrongNotes: false, hasGapIssue: false };
  }

  const actualNotes = actual.filter((e) => e.instrument !== 'gong').map((e) => String(e.note));
  const targetNotes = target.filter((e) => e.instrument !== 'gong').map((e) => String(e.note));

  const hasActualGong = actual.some((e) => e.instrument === 'gong');
  const hasTargetGong = target.some((e) => e.instrument === 'gong');

  const notesMatch =
    actualNotes.length === targetNotes.length &&
    actualNotes.every((n, i) => n === targetNotes[i]);

  const missingGong = hasTargetGong && !hasActualGong && notesMatch;
  const wrongNotes = !notesMatch;

  // Deteksi masalah jeda ketukan (gap timing)
  let hasGapIssue = false;
  if (notesMatch && actual.length === target.length) {
    for (let i = 1; i < target.length; i++) {
      const targetDelta = target[i].tMs - target[i - 1].tMs;
      const actualDelta = actual[i].tMs - actual[i - 1].tMs;
      // Jika di target ada jeda tambahan (delta lebih besar) tapi actual tidak menyertakan
      if (targetDelta > actualDelta + 300) {
        hasGapIssue = true;
        break;
      }
    }
  }

  const isMatch = notesMatch && (!hasTargetGong || hasActualGong) && !hasGapIssue && actual.length === target.length;

  return { isMatch, missingGong, notesMatch, wrongNotes, hasGapIssue };
}

/**
 * Evaluator Misi C3: Susun Tabuhan di Editor (Target 1 -> 2 -> 3 -> Gong)
 */
export function evaluateC3(
  compiledEvents: GamelanEvent[],
  mission: Mission
): EvaluationResult {
  const target = mission.editorTarget?.targetEvents || [];
  if (compiledEvents.length === 0) {
    return {
      isCorrect: false,
      stars: 1,
      title: 'Kanvas Masih Kosong',
      message: 'Ayo tarik blok tabuh saron dan sambungkan ke bawah blok ketika mulai!',
    };
  }

  const comparison = compareEvents(compiledEvents, target);

  if (comparison.isMatch) {
    return {
      isCorrect: true,
      stars: 3,
      title: 'Sempurna!',
      message: 'Luar biasa! Tabuhanmu berbunyi persis seperti pola yang diminta. Telingamu sangat peka!',
    };
  }

  if (comparison.missingGong) {
    return {
      isCorrect: false,
      stars: 2,
      title: 'Hampir Tepat!',
      message: 'Nadanya sudah benar! Tapi jangan lupa tambahkan blok tabuh gong di bagian akhir ya!',
      hint: 'Pasang blok tabuh gong di urutan paling bawah.',
    };
  }

  if (compiledEvents.length < target.length) {
    return {
      isCorrect: false,
      stars: 1,
      title: 'Sedikit Lagi!',
      message: `Kamu sudah menyusun ${compiledEvents.length} tabuhan. Ayo lengkapi hingga menjadi 4 tabuhan!`,
      hint: 'Pola yang diminta: Saron 1, Saron 2, Saron 3, lalu Gong.',
    };
  }

  return {
    isCorrect: false,
    stars: 1,
    title: 'Periksa Nadanya',
    message: 'Ada nada yang masih berbeda dengan pola target. Perhatikan angka bilah yang diminta!',
    hint: 'Gunakan nada 1 (Ji), 2 (Ro), dan 3 (Lu).',
  };
}

/**
 * Evaluator Misi C4: Detektif Tabuhan (Mencari dan Memperbaiki Bug)
 */
export function evaluateC4(
  compiledEvents: GamelanEvent[],
  mission: Mission
): EvaluationResult {
  const target = mission.editorTarget?.targetEvents || [];
  if (compiledEvents.length === 0) {
    return {
      isCorrect: false,
      stars: 1,
      title: 'Belum Ada Blok',
      message: 'Jangan hapus semua bloknya ya, cukup perbaiki nada yang salah dan tambahkan jeda ketuk!',
    };
  }

  const comparison = compareEvents(compiledEvents, target);

  if (comparison.isMatch) {
    return {
      isCorrect: true,
      stars: 3,
      title: 'Detektif Hebat!',
      message: 'Hebat sekali detektif cilik! Kamu berhasil menemukan nada yang salah dan menyisipkan jeda dengan sempurna!',
    };
  }

  if (comparison.hasGapIssue) {
    return {
      isCorrect: false,
      stars: 2,
      title: 'Periksa Jeda Ketukan',
      message: 'Nadamu sudah benar! Tapi ada jeda ketukan yang terlewat sebelum nada 2 berbunyi.',
      hint: 'Sisipkan blok jeda 1 ketuk di antara nada 1 dan nada 2.',
    };
  }

  return {
    isCorrect: false,
    stars: 1,
    title: 'Ayo Teliti Lagi',
    message: 'Pola target membutuhkan nada 6, lalu 1, jeda 1 ketuk, nada 2, dan ditutup gong.',
    hint: 'Ganti nada 5 menjadi nada 1, lalu beri jeda sebelum nada 2.',
  };
}

/**
 * Evaluator Misi C5: Kurator Pola (Evaluasi Efisiensi Kode Blok)
 */
export function evaluateC5(
  selectedOptionId: string,
  selectedReasonId: string,
  mission: Mission
): EvaluationResult {
  const task = mission.curatorTask;
  if (!task) {
    return {
      isCorrect: true,
      stars: 3,
      title: 'Pilihan Bagus!',
      message: 'Kamu telah memilih program dengan cermat!',
    };
  }

  const isOptionCorrect = selectedOptionId === task.correctOptionId;
  const isReasonCorrect = selectedReasonId === task.correctReasonId;

  if (isOptionCorrect && isReasonCorrect) {
    return {
      isCorrect: true,
      stars: 3,
      title: 'Pilihan Kurator Terbaik!',
      message: 'Analisis yang hebat! Memakai blok pengulangan (loop) membuat kodingmu jauh lebih ringkas, rapi, dan mudah dibaca!',
    };
  }

  if (isOptionCorrect && !isReasonCorrect) {
    return {
      isCorrect: false,
      stars: 2,
      title: 'Pilihan Program Benar!',
      message: 'Pilihan programmu sudah tepat, namun coba teliti kembali alasan logis mengapa blok pengulangan lebih baik.',
      hint: 'Pikirkan tentang kerapian ruang blok dan kemudahan saat ingin menambah jumlah putaran.',
    };
  }

  return {
    isCorrect: false,
    stars: 1,
    title: 'Bandingkan Kembali',
    message: 'Menyusun 8 blok secara manual memakan banyak tempat di layar. Bagaimana jika disederhanakan dengan blok ulangi?',
    hint: 'Pilihlah Program B yang menggunakan blok pengulangan (loop).',
  };
}

/**
 * Evaluator Misi C6: Ciptakan Gendingmu (Kreasi Bebas Mandiri)
 */
export function evaluateC6(
  compiledEvents: GamelanEvent[],
  title: string,
  mission: Mission
): EvaluationResult {
  const minEvents = mission.creativeCriteria?.minEvents || 4;
  const trimmedTitle = (title || '').trim();

  if (trimmedTitle.length < 2) {
    return {
      isCorrect: false,
      stars: 1,
      title: 'Beri Judul Karyamu',
      message: 'Setiap gending karawitan memiliki nama. Beri judul yang indah untuk gending kreasimu sebelum disimpan ya!',
      hint: 'Contoh judul: Ladrang Cilik, Dendang Slendro, atau Tabuhan Pagi.',
    };
  }

  if (compiledEvents.length < minEvents) {
    return {
      isCorrect: false,
      stars: 1,
      title: 'Tambahkan Lebih Banyak Nada',
      message: `Gendingmu baru memiliki ${compiledEvents.length} tabuhan. Susun minimal ${minEvents} tabuhan agar melodinya terdengar utuh!`,
      hint: 'Kamu boleh memadukan Demung, Saron, Peking, jeda ketuk, dan Gong.',
    };
  }

  return {
    isCorrect: true,
    stars: 3,
    title: 'Gending Berhasil Diciptakan!',
    message: `Selamat, Pencipta Gending Muda! Karya "${trimmedTitle}" tersusun dengan indah (${compiledEvents.length} ketukan) dan siap kamu simpan ke tab Karyaku!`,
  };
}

/**
 * General Dispatcher Evaluasi Misi
 */
export function evaluateMission(
  mission: Mission,
  userInput: any
): EvaluationResult {
  switch (mission.code) {
    case 'C1':
      return evaluateC1(userInput as Record<string, string>, mission);
    case 'C2':
      return evaluateC2(userInput as string[], mission);
    case 'C3':
      return evaluateC3(userInput as GamelanEvent[], mission);
    case 'C4':
      return evaluateC4(userInput as GamelanEvent[], mission);
    case 'C5':
      return evaluateC5(
        userInput.optionId as string,
        userInput.reasonId as string,
        mission
      );
    case 'C6':
      return evaluateC6(
        userInput.events as GamelanEvent[],
        userInput.title as string,
        mission
      );
    default:
      return {
        isCorrect: true,
        stars: 3,
        title: 'Misi Selesai!',
        message: 'Kerja bagus!',
      };
  }
}
