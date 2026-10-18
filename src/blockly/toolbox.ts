/**
 * Definisi Toolbox XML / JSON untuk Blockly Workspace dan Palet Bottom Sheet
 */

export interface PaletteBlockItem {
  type: string;
  label: string;
  description: string;
  category: 'gamelan' | 'kontrol';
  color: string;
  badge?: string;
}

export const PALETTE_BLOCKS: PaletteBlockItem[] = [
  {
    type: 'ketika_mulai',
    label: 'ketika ▶ ditekan',
    description: 'Titik awal tabuhan gamelan dimulai',
    category: 'gamelan',
    color: '#059669',
    badge: 'Mulai',
  },
  {
    type: 'tabuh_saron',
    label: "tabuh [Instrumen] nada [6..1']",
    description: "Pukul satu bilah saron, demung, atau peking laras slendro (6, 1, 2, 3, 5, 6', 1')",
    category: 'gamelan',
    color: '#0d9488',
    badge: 'Bilah',
  },
  {
    type: 'jeda_ketuk',
    label: 'jeda [n] ketukan',
    description: 'Hening sejenak selama n ketukan nada',
    category: 'gamelan',
    color: '#0d9488',
    badge: 'Hening',
  },
  {
    type: 'atur_tempo',
    label: 'atur tempo [BPM]',
    description: 'Kecepatan tabuhan (40–140 BPM)',
    category: 'gamelan',
    color: '#0d9488',
    badge: 'Tempo',
  },
  {
    type: 'tabuh_gong',
    label: 'tabuh gong 🔔',
    description: 'Pukulan gong penutup siklus',
    category: 'gamelan',
    color: '#d97706',
    badge: 'Gong',
  },
  {
    type: 'mainkan_struktur',
    label: 'mainkan struktur [Lancaran]',
    description: 'Lapisan instrumen kolotomik (kethuk, kempul, kenong, gong)',
    category: 'gamelan',
    color: '#d97706',
    badge: 'Struktur',
  },
  {
    type: 'controls_repeat_ext',
    label: 'ulangi [n] kali',
    description: 'Ulangi serangkaian tabuhan berkali-kali',
    category: 'kontrol',
    color: '#f59e0b',
    badge: 'Loop',
  },
];

export const blocklyToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Gamelan',
      categorystyle: 'gamelan_category',
      contents: [
        { kind: 'block', type: 'ketika_mulai' },
        { kind: 'block', type: 'tabuh_saron' },
        { kind: 'block', type: 'jeda_ketuk' },
        { kind: 'block', type: 'atur_tempo' },
        { kind: 'block', type: 'tabuh_gong' },
        { kind: 'block', type: 'mainkan_struktur' },
      ],
    },
    {
      kind: 'category',
      name: 'Kontrol',
      categorystyle: 'loop_category',
      contents: [
        {
          kind: 'block',
          type: 'controls_repeat_ext',
          inputs: {
            TIMES: {
              shadow: {
                type: 'math_number',
                fields: { NUM: 4 },
              },
            },
          },
        },
      ],
    },
  ],
};
