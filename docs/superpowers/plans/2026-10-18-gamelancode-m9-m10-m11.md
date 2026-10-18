# GamelanCode (Milestones 9, 10, & 11) Implementation Plan: Tab Belajar Interaktif, Ekspor/Impor Kepatihan, & Showcase Juri

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengimplementasikan Tab Belajar interaktif (tuts audio Web Audio & anatomi gamelan), sistem ekspor/impor proyek `.gamelan` dan generator notasi Kepatihan di tab Karyaku, serta modal Showcase Presentasi Dewan Juri 5-babak yang selaras 100% dengan naskah `Essay TLP.md`.

**Architecture:** 
1. `src/compiler/kepatihanConverter.ts`: Mengonversi array `GamelanEvent[]` menjadi partitur notasi kepatihan beraturan baris 4/8 ketukan.
2. `src/services/projectExportImportService.ts`: Menangani serialisasi file `.gamelan` / `.json` untuk diunduh dan diimpor kembali ke `karyakuService`.
3. `src/components/belajar/BelajarSoundboard.tsx`: Tuts virtual 7 nada Slendro + Gong dengan opsi instrumen Saron Barung, Demung, dan Peking via `gamelanSynth`.
4. `src/components/showcase/JuryShowcaseModal.tsx`: Presentasi interaktif 5 babak (PISA, UNESCO, Dual-model, Bloom C1-C6, Hardware Solenoid, SDGs) untuk dewan juri.

**Tech Stack:** React, TypeScript, Vite, Vitest, Lucide React, Web Audio API (`gamelanSynth`).

## Global Constraints

- Zero instances of the word "gagal" in child-facing copy.
- Cultural disclaimer on all patterns: `"Contoh — belum divalidasi praktisi karawitan"`.
- Hardware simulation disclaimer: `"Simulasi — Perangkat Belum Terhubung"`.
- Touch target >= 44px on all interactive elements.
- On Windows PowerShell, use `cmd /c "..."` for terminal executions.

---

### Task 1: Converter Notasi Kepatihan (`kepatihanConverter.ts`) & Unit Test

**Files:**
- Create: `src/compiler/kepatihanConverter.ts`
- Create: `tests/compiler/kepatihanConverter.test.ts`

**Interfaces:**
- Produces:
  ```typescript
  export interface KepatihanFormatOptions {
    beatsPerGatra?: number; // default: 4
    gatrasPerLine?: number; // default: 2 (8 ketukan per baris lancaran)
  }
  export function convertEventsToKepatihan(
    events: GamelanEvent[],
    options?: KepatihanFormatOptions
  ): string;
  ```

- [ ] **Step 1: Tulis unit test untuk konversi notasi kepatihan**

Buat file `tests/compiler/kepatihanConverter.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { convertEventsToKepatihan } from '../../src/compiler/kepatihanConverter';
import { GamelanEvent } from '../../src/types/gamelan';

describe('kepatihanConverter', () => {
  it('harus mengembalikan teks kosong atau placeholder jika events kosong', () => {
    const res = convertEventsToKepatihan([]);
    expect(res).toBe('// Belum ada nada tabuhan');
  });

  it('harus mengonversi pola 8 ketukan lancaran dengan benar', () => {
    const events: GamelanEvent[] = [
      { tMs: 0, instrument: 'saron', note: '3', velocity: 90 },
      { tMs: 500, instrument: 'saron', note: '5', velocity: 90 },
      { tMs: 1000, instrument: 'saron', note: '3', velocity: 90 },
      { tMs: 1500, instrument: 'saron', note: '2', velocity: 90 },
      { tMs: 2000, instrument: 'saron', note: '3', velocity: 90 },
      { tMs: 2500, instrument: 'saron', note: '5', velocity: 90 },
      { tMs: 3000, instrument: 'saron', note: '6', velocity: 90 },
      { tMs: 3500, instrument: 'saron', note: '5', velocity: 90 },
      { tMs: 3500, instrument: 'gong', velocity: 110 },
    ];

    const res = convertEventsToKepatihan(events);
    expect(res).toContain('3  5  3  2');
    expect(res).toContain('3  5  6  (5)');
  });

  it('harus menandai gong tunggal dengan simbol (G) jika tidak bersamaan dengan saron', () => {
    const events: GamelanEvent[] = [
      { tMs: 0, instrument: 'saron', note: '1', velocity: 90 },
      { tMs: 500, instrument: 'gong', velocity: 110 },
    ];

    const res = convertEventsToKepatihan(events);
    expect(res).toContain('1');
    expect(res).toContain('(G)');
  });
});
```

- [ ] **Step 2: Jalankan test dan pastikan gagal karena modul belum dibuat**

Run: `cmd /c "npx vitest run tests/compiler/kepatihanConverter.test.ts"`  
Expected: FAIL dengan `Cannot find module`

- [ ] **Step 3: Implementasikan `src/compiler/kepatihanConverter.ts`**

Buat file `src/compiler/kepatihanConverter.ts`:
```typescript
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
  const beatsPerLine = beatsPerGatra * gatrasPerLine;

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
```

- [ ] **Step 4: Jalankan test dan pastikan semua lulus**

Run: `cmd /c "npx vitest run tests/compiler/kepatihanConverter.test.ts"`  
Expected: PASS (3 tests passed)

- [ ] **Step 5: Commit Task 1 ke git**

Run:
```bash
git add src/compiler/kepatihanConverter.ts tests/compiler/kepatihanConverter.test.ts
git commit -m "feat(compiler): implement kepatihan notation converter and unit tests"
```

---

### Task 2: Layanan Ekspor & Impor Proyek Karyaku (`projectExportImportService.ts`) & Unit Test

**Files:**
- Create: `src/services/projectExportImportService.ts`
- Create: `tests/services/projectExportImportService.test.ts`

**Interfaces:**
- Produces:
  ```typescript
  export interface GamelanProjectFile {
    app: 'GamelanCode';
    version: '1.0';
    title: string;
    description: string;
    notesCount: number;
    xml: string;
    exportedAt: string;
  }
  export function createProjectJson(project: SavedProject): string;
  export function parseProjectJson(jsonString: string): { success: boolean; project?: SavedProject; error?: string };
  export function downloadProjectFile(project: SavedProject): void;
  ```

- [ ] **Step 1: Tulis unit test untuk ekspor dan impor proyek**

Buat file `tests/services/projectExportImportService.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { createProjectJson, parseProjectJson } from '../../src/services/projectExportImportService';
import { SavedProject } from '../../src/services/karyakuService';

describe('projectExportImportService', () => {
  const sampleProject: SavedProject = {
    id: 'proj_123',
    title: 'Gending Pelog Ceria',
    description: 'Kreasi nada lancaran',
    notesCount: 8,
    xml: '<xml><block type="tabuh_saron"></block></xml>',
    createdAt: 1729000000000,
    updatedAt: 1729000000000,
  };

  it('harus menghasilkan string JSON valid dengan format standar GamelanCode', () => {
    const jsonStr = createProjectJson(sampleProject);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.app).toBe('GamelanCode');
    expect(parsed.version).toBe('1.0');
    expect(parsed.title).toBe('Gending Pelog Ceria');
    expect(parsed.notesCount).toBe(8);
  });

  it('harus berhasil mem-parsing file JSON yang sah', () => {
    const jsonStr = createProjectJson(sampleProject);
    const result = parseProjectJson(jsonStr);
    expect(result.success).toBe(true);
    expect(result.project?.title).toBe('Gending Pelog Ceria');
    expect(result.project?.xml).toBe(sampleProject.xml);
  });

  it('harus menolak JSON yang tidak valid atau struktur rusak', () => {
    const result = parseProjectJson('bukan json valid');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();

    const result2 = parseProjectJson('{"app": "Lain"}');
    expect(result2.success).toBe(false);
  });
});
```

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `cmd /c "npx vitest run tests/services/projectExportImportService.test.ts"`  
Expected: FAIL dengan `Cannot find module`

- [ ] **Step 3: Implementasikan `src/services/projectExportImportService.ts`**

Buat file `src/services/projectExportImportService.ts`:
```typescript
import { SavedProject } from './karyakuService';

export interface GamelanProjectFile {
  app: 'GamelanCode';
  version: '1.0';
  title: string;
  description: string;
  notesCount: number;
  xml: string;
  exportedAt: string;
}

export function createProjectJson(project: SavedProject): string {
  const fileData: GamelanProjectFile = {
    app: 'GamelanCode',
    version: '1.0',
    title: project.title,
    description: project.description || '',
    notesCount: project.notesCount,
    xml: project.xml,
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(fileData, null, 2);
}

export function parseProjectJson(jsonString: string): {
  success: boolean;
  project?: SavedProject;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || parsed.app !== 'GamelanCode') {
      return {
        success: false,
        error: 'Berkas tidak dikenali sebagai format proyek GamelanCode yang valid.',
      };
    }
    if (!parsed.title || !parsed.xml) {
      return {
        success: false,
        error: 'Data proyek tidak lengkap (judul atau blok program tidak ditemukan).',
      };
    }

    const importedProject: SavedProject = {
      id: `imported_${Date.now()}`,
      title: String(parsed.title),
      description: String(parsed.description || ''),
      notesCount: Number(parsed.notesCount || 0),
      xml: String(parsed.xml),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return { success: true, project: importedProject };
  } catch (err) {
    return {
      success: false,
      error: 'Format berkas rusak atau bukan JSON yang valid.',
    };
  }
}

export function downloadProjectFile(project: SavedProject): void {
  const jsonContent = createProjectJson(project);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const safeTitle = project.title.toLowerCase().replace(/[^a-z0-9_-]/g, '_');

  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeTitle}.gamelan`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 4: Jalankan test dan pastikan semua lulus**

Run: `cmd /c "npx vitest run tests/services/projectExportImportService.test.ts"`  
Expected: PASS (3 tests passed)

- [ ] **Step 5: Commit Task 2 ke git**

Run:
```bash
git add src/services/projectExportImportService.ts tests/services/projectExportImportService.test.ts
git commit -m "feat(karyaku): implement project export, import, and file download service"
```

---

### Task 3: Pengayaan Tab "Belajar" Interaktif (`BelajarSoundboard.tsx`, `BelajarPage.tsx`)

**Files:**
- Create: `src/components/belajar/BelajarSoundboard.tsx`
- Modify: `src/pages/BelajarPage.tsx`

**Features:**
- Tuts virtual 7 nada Slendro (`6`, `1`, `2`, `3`, `5`, `6'`, `1'`) dan `Gong Ageng`.
- Selector instrumen: Saron Barung, Demung (oktaf rendah), Peking (oktaf tinggi).
- Bunyi menggunakan `gamelanSynth.playNote()` dan `gamelanSynth.playGong()`.
- Kartu anatomi 3 fungsi kelompok gamelan dari `Essay TLP.md`:
  1. *Kelompok Balungan* (Saron, Demung, Peking)
  2. *Kelompok Kolotomik* (Gong Ageng, Kenong, Kempul)
  3. *Kelompok Pamurba Irama* (Kendhang)
- Glosarium interaktif istilah karawitan ramah anak.

- [ ] **Step 1: Buat `src/components/belajar/BelajarSoundboard.tsx`**

- [ ] **Step 2: Perbarui `src/pages/BelajarPage.tsx` dengan soundboard dan materi anatomi karawitan lengkap**

- [ ] **Step 3: Verifikasi dengan `npm run build`**

Run: `cmd /c "npm run build"`  
Expected: PASS

- [ ] **Step 4: Commit Task 3 ke git**

Run:
```bash
git add src/components/belajar/BelajarSoundboard.tsx src/pages/BelajarPage.tsx
git commit -m "feat(belajar): add interactive gamelan soundboard, anatomy, and cultural glossary"
```

---

### Task 4: Generator Notasi Kepatihan & Integrasi Ekspor/Impor di Tab Karyaku

**Files:**
- Create: `src/components/karyaku/KepatihanModal.tsx`
- Modify: `src/pages/KaryakuPage.tsx`
- Modify: `src/pages/EditorPage.tsx`

**Features:**
- Modal partitur angka Kepatihan dengan tombol "Salin Partitur" (dapat dibuka dari Editor dan Karyaku).
- Tombol "Unduh Proyek (.gamelan)" dan "Salin Partitur" pada kartu karya di Karyaku.
- Tombol "Unggah Proyek (.gamelan)" dengan file reader input di Karyaku.

- [ ] **Step 1: Buat komponen `src/components/karyaku/KepatihanModal.tsx`**

- [ ] **Step 2: Modifikasi `src/pages/KaryakuPage.tsx` untuk menyertakan tombol ekspor berkas, impor berkas, dan buka modal kepatihan**

- [ ] **Step 3: Tambahkan tombol "Notasi Kepatihan" di Toolbar / Panel Editor `EditorPage.tsx`**

- [ ] **Step 4: Jalankan build dan test suite**

Run: `cmd /c "npm run build"`  
Run: `cmd /c "npx vitest run"`  
Expected: PASS

- [ ] **Step 5: Commit Task 4 ke git**

Run:
```bash
git add src/components/karyaku/KepatihanModal.tsx src/pages/KaryakuPage.tsx src/pages/EditorPage.tsx
git commit -m "feat(karyaku): integrate kepatihan sheet music modal and project export/import"
```

---

### Task 5: Komponen Showcase Presentasi Dewan Juri (`JuryShowcaseModal.tsx`)

**Files:**
- Create: `src/components/showcase/JuryShowcaseModal.tsx`
- Modify: `src/components/layout/AppHeader.tsx`
- Modify: `src/pages/BerandaPage.tsx`
- Modify: `src/App.tsx`

**Features:**
- 5 Babak slide presentasi interaktif berdasarkan naskah `Essay TLP.md`:
  - Babak 1: Urgensi & Latar Belakang (Skor PISA 427, Kurikulum Coding SD 2025/2026, UNESCO 2021).
  - Babak 2: Tiga Prinsip Inti GamelanCode (Learning by doing, Human-in-the-loop, Dual-model).
  - Babak 3: Taksonomi Bloom (C1-C6) & Productive Failure (Kapur 2008).
  - Babak 4: Arsitektur 3-Tahap & Hardware Solenoid (UDINUS & Gamelatron).
  - Babak 5: Dampak Multilevel & SDGs (SDG 4, 11, 17) + Tombol Akses Cepat Juri.
- Tombol pemicu "🏆 Showcase Esai GamelanCode" di `AppHeader.tsx` dan kartu utama di `BerandaPage.tsx`.

- [ ] **Step 1: Buat komponen `src/components/showcase/JuryShowcaseModal.tsx`**

- [ ] **Step 2: Sambungkan modal di `App.tsx`, `AppHeader.tsx`, dan `BerandaPage.tsx`**

- [ ] **Step 3: Verifikasi build dan test suite**

Run: `cmd /c "npm run build"`  
Run: `cmd /c "npx vitest run"`  
Expected: PASS

- [ ] **Step 4: Commit Task 5 ke git**

Run:
```bash
git add src/components/showcase/JuryShowcaseModal.tsx src/components/layout/AppHeader.tsx src/pages/BerandaPage.tsx src/App.tsx
git commit -m "feat(showcase): implement JuryShowcaseModal aligned with Essay TLP"
```

---

### Task 6: Final Verification & Git Push

- [ ] **Step 1: Jalankan seluruh unit test suite**

Run: `cmd /c "npx vitest run"`  
Expected: 100% tests passing across all test files.

- [ ] **Step 2: Jalankan build produksi**

Run: `cmd /c "npm run build"`  
Expected: Zero compilation errors.

- [ ] **Step 3: Push seluruh commit ke main**

Run: `git push origin main`
