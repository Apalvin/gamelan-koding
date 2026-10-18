import { GamelanEvent } from '../types/gamelan';

export interface KepatihanFormatOptions {
  beatsPerGatra?: number;
  gatrasPerLine?: number;
}

export function convertEventsToKepatihan(
  events: GamelanEvent[],
  options: KepatihanFormatOptions = {}
): string {
  if (!events || events.length === 0) {
    return '// Belum ada nada tabuhan';
  }

  const beatsPerGatra = options.beatsPerGatra ?? 4;
  const gatrasPerLine = options.gatrasPerLine ?? 2;

  // Kelompokkan event berdasarkan waktu tMs
  const timeMap = new Map<number, { saron?: string; hasGong: boolean }>();
  const sortedTimes: number[] = [];

  events.forEach((ev) => {
    let entry = timeMap.get(ev.tMs);
    if (!entry) {
      entry = { hasGong: false };
      timeMap.set(ev.tMs, entry);
      sortedTimes.push(ev.tMs);
    }
    if (ev.instrument === 'gong') {
      entry.hasGong = true;
    } else {
      entry.saron = String(ev.note ?? '1');
    }
  });

  sortedTimes.sort((a, b) => a - b);

  const formattedTokens: string[] = [];

  sortedTimes.forEach((t) => {
    const item = timeMap.get(t)!;
    if (item.saron && item.hasGong) {
      formattedTokens.push(`(${item.saron})`);
    } else if (item.saron) {
      formattedTokens.push(item.saron);
    } else if (item.hasGong) {
      formattedTokens.push('(G)');
    }
  });

  // Susun gatra dan baris
  const lines: string[] = [];
  let currentLineGatras: string[] = [];
  let currentGatraTokens: string[] = [];

  formattedTokens.forEach((tok, idx) => {
    currentGatraTokens.push(tok.padStart(3, ' '));

    if (currentGatraTokens.length === beatsPerGatra || idx === formattedTokens.length - 1) {
      currentLineGatras.push(currentGatraTokens.join(' '));
      currentGatraTokens = [];

      if (currentLineGatras.length === gatrasPerLine || idx === formattedTokens.length - 1) {
        lines.push(currentLineGatras.join('   |  '));
        currentLineGatras = [];
      }
    }
  });

  return lines.join('\n');
}
