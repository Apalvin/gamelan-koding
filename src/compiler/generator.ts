import { javascriptGenerator, Order } from 'blockly/javascript';
import { registerGamelanBlocks } from '../blockly/blocks/gamelanBlocks';

// Pastikan blok kustom terdaftar
registerGamelanBlocks();

let isInitialized = false;

/**
 * Pendaftaran Generator JavaScript untuk Blok Kustom Gamelan
 */
export function initGamelanGenerators() {
  if (isInitialized) return;
  isInitialized = true;

  // 1. Blok Awal: ketika ▶ ditekan (Hat Block)
  // Tidak perlu memanggil blockToCode untuk nextBlock karena Blockly otomatis melanjutkan ke blok berikutnya
  javascriptGenerator.forBlock['ketika_mulai'] = function () {
    return '// Titik Mulai Program\n';
  };

  // 2. Blok Aksi: tabuh [instrumen] nada [1|2|3|5|6]
  javascriptGenerator.forBlock['tabuh_saron'] = function (block) {
    const instrument = block.getFieldValue('INSTRUMENT') || 'saron';
    const note = block.getFieldValue('NOTE') || '1';
    const blockId = block.id;
    return `clock.recordHit('${instrument}', '${note}', '${blockId}', 1);\n`;
  };

  // 3. Blok Jeda: jeda [n] ketuk
  javascriptGenerator.forBlock['jeda_ketuk'] = function (block) {
    const beats = Number(block.getFieldValue('BEATS')) || 1;
    return `clock.advanceBeats(${beats});\n`;
  };

  // 4. Blok Tempo: atur tempo [BPM]
  javascriptGenerator.forBlock['atur_tempo'] = function (block) {
    const bpm = Number(block.getFieldValue('BPM')) || 60;
    return `clock.setTempo(${bpm});\n`;
  };

  // 5. Blok Gong: tabuh gong
  javascriptGenerator.forBlock['tabuh_gong'] = function (block) {
    const blockId = block.id;
    return `clock.recordHit('gong', undefined, '${blockId}', 2);\n`;
  };

  // 6. Overwrite loop bawaan: controls_repeat_ext agar menyisipkan clock.step() pengaman loop
  javascriptGenerator.forBlock['controls_repeat_ext'] = function (block) {
    let repeats: string | number;
    if (block.getField('TIMES')) {
      repeats = String(Number(block.getFieldValue('TIMES')));
    } else {
      repeats = javascriptGenerator.valueToCode(block, 'TIMES', Order.ASSIGNMENT) || '0';
    }

    const branch = javascriptGenerator.statementToCode(block, 'DO') || '';
    const loopVar = javascriptGenerator.nameDB_
      ? javascriptGenerator.nameDB_.getDistinctName('count', 'VARIABLE')
      : 'loop_idx';

    return (
      `for (let ${loopVar} = 0; ${loopVar} < ${repeats}; ${loopVar}++) {\n` +
      `  clock.step();\n` +
      branch +
      `}\n`
    );
  };
}
