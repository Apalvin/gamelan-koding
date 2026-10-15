export type TabId = 'beranda' | 'belajar' | 'editor' | 'misi' | 'karyaku';

export interface TabConfig {
  id: TabId;
  label: string;
  iconName: string;
  ariaLabel: string;
  colorClass: string;
}

export const TABS_CONFIG: TabConfig[] = [
  { id: 'beranda', label: 'Beranda', iconName: 'Home', ariaLabel: 'Tab Beranda', colorClass: 'tab-beranda' },
  { id: 'belajar', label: 'Belajar', iconName: 'BookOpen', ariaLabel: 'Tab Belajar', colorClass: 'tab-belajar' },
  { id: 'editor', label: 'Editor', iconName: 'Code2', ariaLabel: 'Tab Editor Koding', colorClass: 'tab-editor' },
  { id: 'misi', label: 'Misi', iconName: 'Target', ariaLabel: 'Tab Misi Belajar', colorClass: 'tab-misi' },
  { id: 'karyaku', label: 'Karyaku', iconName: 'Sparkles', ariaLabel: 'Tab Karyaku', colorClass: 'tab-karyaku' },
];
