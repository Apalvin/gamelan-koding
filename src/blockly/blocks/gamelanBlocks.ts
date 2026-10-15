import * as Blockly from 'blockly';

/**
 * Registrasi Blok Kustom Kategori "Gamelan" Sesuai Bagian 6 PRD
 */
export function registerGamelanBlocks() {
  // Blok JSON Array Definitions
  Blockly.common.defineBlocksWithJsonArray([
    // 1. Blok Awal: ketika ▶ ditekan (Hat Block)
    {
      type: 'ketika_mulai',
      message0: 'ketika ▶ ditekan',
      nextStatement: null,
      style: 'gamelan_hat',
      tooltip: 'Titik mulai program tabuhan gamelan saat tombol ▶ ditekan.',
      helpUrl: '',
      hat: 'cap',
    },

    // 2. Blok Aksi: tabuh [instrumen] nada [1|2|3|5|6]
    {
      type: 'tabuh_saron',
      message0: 'tabuh %1 nada %2',
      args0: [
        {
          type: 'field_dropdown',
          name: 'INSTRUMENT',
          options: [
            ['Saron', 'saron'],
            ['Demung', 'demung'],
            ['Peking', 'peking'],
          ],
        },
        {
          type: 'field_dropdown',
          name: 'NOTE',
          options: [
            ['1 (ji)', '1'],
            ['2 (ro)', '2'],
            ['3 (lu)', '3'],
            ['5 (ma)', '5'],
            ['6 (nem)', '6'],
          ],
        },
      ],
      previousStatement: null,
      nextStatement: null,
      style: 'gamelan_blocks',
      tooltip: 'Memukul satu bilah saron pada laras slendro (1, 2, 3, 5, 6).',
      helpUrl: '',
    },

    // 3. Blok Jeda: jeda [n] ketuk
    {
      type: 'jeda_ketuk',
      message0: 'jeda %1 ketuk',
      args0: [
        {
          type: 'field_number',
          name: 'BEATS',
          value: 1,
          min: 0.5,
          max: 16,
          precision: 0.5,
        },
      ],
      previousStatement: null,
      nextStatement: null,
      style: 'gamelan_blocks',
      tooltip: 'Hening (istirahat) selama beberapa ketukan nada.',
      helpUrl: '',
    },

    // 4. Blok Tempo: atur tempo [BPM] (rentang aman 40-140)
    {
      type: 'atur_tempo',
      message0: 'atur tempo %1 BPM',
      args0: [
        {
          type: 'field_number',
          name: 'BPM',
          value: 60,
          min: 40,
          max: 140,
          precision: 1,
        },
      ],
      previousStatement: null,
      nextStatement: null,
      style: 'gamelan_blocks',
      tooltip: 'Mengatur kecepatan tempo tabuhan (rentang aman 40 - 140 BPM).',
      helpUrl: '',
    },

    // 5. Blok Gong: tabuh gong
    {
      type: 'tabuh_gong',
      message0: 'tabuh gong 🔔',
      previousStatement: null,
      nextStatement: null,
      style: 'gamelan_gong',
      tooltip: 'Memukul gong ageng sebagai penanda akhir siklus kalimat tabuhan.',
      helpUrl: '',
    },
  ]);
}
