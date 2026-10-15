import * as Blockly from 'blockly';

export const gamelanTheme = Blockly.Theme.defineTheme('gamelan_theme', {
  name: 'gamelan_theme',
  base: Blockly.Themes.Classic,
  blockStyles: {
    gamelan_blocks: {
      colourPrimary: '#0d9488',
      colourSecondary: '#14b8a6',
      colourTertiary: '#0f766e',
    },
    gamelan_hat: {
      colourPrimary: '#059669',
      colourSecondary: '#10b981',
      colourTertiary: '#047857',
    },
    gamelan_gong: {
      colourPrimary: '#d97706',
      colourSecondary: '#f59e0b',
      colourTertiary: '#b45309',
    },
    loop_blocks: {
      colourPrimary: '#f59e0b',
      colourSecondary: '#fbbf24',
      colourTertiary: '#d97706',
    },
  },
  categoryStyles: {
    gamelan_category: {
      colour: '#0d9488',
    },
    loop_category: {
      colour: '#f59e0b',
    },
  },
  componentStyles: {
    workspaceBackgroundColour: '#f8fafc',
    toolboxBackgroundColour: '#ffffff',
    toolboxForegroundColour: '#1e293b',
    flyoutBackgroundColour: '#f1f5f9',
    flyoutForegroundColour: '#1e293b',
    scrollbarColour: '#cbd5e1',
    scrollbarOpacity: 0.7,
  },
  fontStyle: {
    family: 'Fredoka, Quicksand, system-ui, sans-serif',
    weight: '600',
    size: 13,
  },
});
