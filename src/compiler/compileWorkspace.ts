import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { initGamelanGenerators } from './generator';
import { VirtualClockSimulator } from './virtualClock';
import { CompileResult, CompilerOptions } from '../types/gamelan';

// Inisialisasi generator
initGamelanGenerators();

/**
 * Mengompilasi isi workspace Blockly menjadi daftar GamelanEvent yang aman
 * Sesuai arsitektur 3-tahap PRD Bagian 7.2 (Compile, Guard, Play)
 */
export function compileWorkspace(
  workspace: Blockly.Workspace,
  options?: CompilerOptions
): CompileResult {
  // 1. Cari blok awal "ketika ▶ ditekan"
  const allBlocks = workspace.getAllBlocks(false);
  if (allBlocks.length === 0) {
    return {
      success: false,
      code: 'EMPTY_PROGRAM',
      error: 'Lembar kerja masih kosong. Tarik blok tabuhan untuk mulai!',
    };
  }

  const startBlocks = workspace.getBlocksByType('ketika_mulai', false);
  if (startBlocks.length === 0) {
    return {
      success: false,
      code: 'EMPTY_PROGRAM',
      error: 'Belum ada blok "ketika ▶ ditekan". Tarik dari menu + Blok!',
    };
  }

  const startBlock = startBlocks[0];
  const firstActionBlock = startBlock.getNextBlock();
  if (!firstActionBlock) {
    return {
      success: false,
      code: 'EMPTY_PROGRAM',
      error: 'Belum ada blok tabuhan yang tersambung di bawah "ketika ▶ ditekan".',
    };
  }

  // 2. Generate kode JavaScript terisolasi dari tumpukan blok
  let generatedCode: string;
  try {
    javascriptGenerator.init(workspace);
    generatedCode = javascriptGenerator.blockToCode(startBlock) as string;
  } catch (err: any) {
    return {
      success: false,
      code: 'SYNTAX_ERROR',
      error: `Gagal membaca blok: ${err?.message || err}`,
    };
  }

  // 3. Eksekusi dalam Sandbox Jam Virtual dengan Guard
  const clock = new VirtualClockSimulator(options);

  try {
    const sandboxRunner = new Function('clock', generatedCode);
    sandboxRunner(clock);
  } catch (err: any) {
    if (err?.message === 'INFINITE_LOOP') {
      return {
        success: false,
        code: 'INFINITE_LOOP',
        error: 'Loop terlalu panjang atau tak terbatas terdeteksi (> 5.000 langkah)! Coba periksa angka pada blok pengulanganmu.',
        step: clock.getStepsCount(),
      };
    }

    if (err?.message === 'EVENT_OVERFLOW') {
      return {
        success: false,
        code: 'EVENT_OVERFLOW',
        error: 'Jumlah tabuhan melebihi batas aman (maksimal 2.000 tabuhan). Coba kurangi pengulanganmu.',
        step: clock.getStepsCount(),
      };
    }

    return {
      success: false,
      code: 'SYNTAX_ERROR',
      error: `Kesalahan saat menjalankan kode: ${err?.message || err}`,
    };
  }

  const result = clock.getResult();

  if (result.events.length === 0) {
    return {
      success: false,
      code: 'EMPTY_PROGRAM',
      error: 'Program belum menghasilkan bunyi tabuhan. Pastikan menyambungkan blok tabuh saron atau gong!',
    };
  }

  return result;
}
