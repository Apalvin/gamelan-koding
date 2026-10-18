import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Jury Showcase & Essay TLP Alignment (Milestone 11)', () => {
  const showcaseFilePath = path.resolve(__dirname, '../../src/components/showcase/JuryShowcaseModal.tsx');
  const essayFilePath = path.resolve(__dirname, '../../Essay TLP.md');

  it('file JuryShowcaseModal.tsx dan Essay TLP.md harus ada', () => {
    expect(fs.existsSync(showcaseFilePath)).toBe(true);
    expect(fs.existsSync(essayFilePath)).toBe(true);
  });

  it('JuryShowcaseModal harus memuat poin-poin krusial dari Essay TLP', () => {
    const code = fs.readFileSync(showcaseFilePath, 'utf-8');

    // 1. Data PISA & Kemendikdasmen & UNESCO
    expect(code).toContain('427');
    expect(code).toContain('366');
    expect(code).toContain('UNESCO');
    expect(code).toContain('2021');

    // 2. Tiga Prinsip Inti
    expect(code).toContain('Learning by Doing');
    expect(code).toContain('Human-in-the-Loop');
    expect(code).toContain('Dual-Model');

    // 3. Taksonomi Bloom & Productive Failure
    expect(code).toContain('Krathwohl');
    expect(code).toContain('Kapur');
    expect(code).toContain('Productive Failure');
    expect(code).toContain('C1');
    expect(code).toContain('C6');

    // 4. Arsitektur 3-Tahap & Hardware Solenoid
    expect(code).toContain('Compile');
    expect(code).toContain('Guard');
    expect(code).toContain('Play');
    expect(code).toContain('115200');
    expect(code).toContain('UDINUS');
    expect(code).toContain('Sekar Nuswantoro');
    expect(code).toContain('Gamelatron');

    // 5. SDGs & Indonesia Emas 2045
    expect(code).toContain('SDG 4');
    expect(code).toContain('SDG 11');
    expect(code).toContain('SDG 17');
    expect(code).toContain('Indonesia Emas 2045');

    // 6. Standar etika budaya
    expect(code).toContain('belum divalidasi praktisi karawitan');
  });

  it('JuryShowcaseModal tidak boleh mengandung kata gagal pada teks antarmuka', () => {
    const code = fs.readFileSync(showcaseFilePath, 'utf-8');
    // Memastikan tidak ada kata 'gagal'
    expect(code.toLowerCase()).not.toContain('gagal');
  });
});
