# Gamelan Koding (Milestone 4) Implementation Plan: DigitalSimOutput & Web Audio API

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun `DigitalSimOutput` (Milestone 4 PRD), menghasilkan sintesis suara gamelan digital realistis menggunakan Web Audio API (bilah saron slendro dan gong ageng dengan ombak), animasi bilah menyala secara presisi, serta penyorotan blok aktif (*block highlighting*) di kanvas Blockly secara real-time saat program dimainkan.

**Architecture:** Mengimplementasikan antarmuka `GamelanOutput` dari PRD Bagian 7.3. `DigitalSimOutput` menggunakan `AudioContext` Web Audio API dengan multi-osilator inharmonik (meniru getaran fisik bilah logam kuningan/perunggu saron dan dengungan ombak gong). Penjadwalan audio menggunakan jam presisi `audioCtx.currentTime`, disinkronkan dengan visual bilah menyala dan API bawaan Blockly `workspace.highlightBlock(blockId)` untuk menyorot blok yang sedang bersuara.

**Tech Stack:**
- Web Audio API (AudioContext, GainNode, OscillatorNode)
- Blockly Workspace Highlighting API (`workspace.highlightBlock`)
- React 18 + TypeScript

## Global Constraints
- Kepatuhan Arsitektur Bagian 7.3 & 7.4 PRD:
  - Antarmuka `GamelanOutput` dengan method `play(events: GamelanEvent[]): Promise<void>` dan `stop(): void`.
  - Fallback sintesis logam: multi-osilator sinus + envelope peluruhan (decay) panjang.
  - Penanganan AudioContext: Diaktifkan/di-resume saat interaksi pengguna (klik pertama tombol ▶ Mainkan atau ketukan bilah).
  - Catatan akurasi suara: "Suara simulasi hanyalah pendekatan, bukan representasi penuh gamelan asli".
- Kriteria Penerimaan (PRD 9.1): Menghasilkan bunyi + visual bilah menyala + blok ter-highlight secara berurutan.
- Tanpa backend & bebas dependensi audio eksternal yang berat (murni sintesis web audio).

---

### Task 1: Engine Sintesis Suara Gamelan (Web Audio API)

**Files:**
- Create: `src/audio/gamelanSynth.ts`
- Create: `tests/audio/gamelanSynth.test.ts`

**Interfaces:**
- Produces: `class GamelanAudioSynth`
  - `initAudio(): Promise<void>`
  - `playSaronNote(note: SlendroNote, timeOffset?: number, velocity?: number): void`
  - `playGong(timeOffset?: number, velocity?: number): void`
  - `stopAll(): void`
  - Frekuensi nada Slendro Kepatihan:
    - 1 (Ji): 275 Hz
    - 2 (Ro): 315 Hz
    - 3 (Lu): 360 Hz
    - 5 (Ma): 415 Hz
    - 6 (Nem): 475 Hz
    - Gong Ageng: Fundamental 55 Hz + ombak sub-osilator 2 Hz + decay 4.0 detik.

- [ ] **Step 1: Tulis unit test untuk `GamelanAudioSynth` di `tests/audio/gamelanSynth.test.ts`**
  Memastikan mapping frekuensi slendro tepat dan pemanggilan node audio tidak melempar error.

- [ ] **Step 2: Implementasikan `GamelanAudioSynth` di `src/audio/gamelanSynth.ts`**
  Buat pemodelan fisik suara bilah logam dengan osilator fundamental + overtone denting logam cepat + gain decay envelope.

- [ ] **Step 3: Jalankan unit test audio**
  Run: `cmd /c "npm test"`
  Expected: PASS

---

### Task 2: Implementasi `DigitalSimOutput` Scheduler & Blockly Highlight

**Files:**
- Create: `src/audio/digitalSimOutput.ts`
- Modify: `src/types/gamelan.ts`
- Create: `tests/audio/digitalSimOutput.test.ts`

**Interfaces:**
- Consumes: `GamelanEvent`, `GamelanOutput`, `GamelanAudioSynth`, `Blockly.WorkspaceSvg`
- Produces: `class DigitalSimOutput implements GamelanOutput`
  - `play(events: GamelanEvent[]): Promise<void>`
  - `stop(): void`
  - `setWorkspace(workspace: Blockly.WorkspaceSvg | null): void`
  - `setOnVisualEvent(callback: (event: GamelanEvent | null) => void): void`

- [ ] **Step 1: Tulis test mock untuk `DigitalSimOutput` scheduler di `tests/audio/digitalSimOutput.test.ts`**
  Verifikasi event dijadwalkan berurutan dan method `stop()` menghentikan scheduler.

- [ ] **Step 2: Implementasikan `DigitalSimOutput` di `src/audio/digitalSimOutput.ts`**
  Jadwalkan audio lewat Web Audio API, trigger highlight blok via `workspace.highlightBlock(event.blockId)`, dan kirim callback visual bilah menyala.

- [ ] **Step 3: Jalankan seluruh test suite**
  Run: `cmd /c "npm test"`
  Expected: PASS

---

### Task 3: Integrasi `DigitalSimOutput` ke Editor UI & Interaktivitas Bilah

**Files:**
- Modify: `src/pages/EditorPage.tsx`
- Modify: `src/components/output/GamelanVisualizer.tsx`

**Interfaces:**
- Menghubungkan klik **▶ Mainkan** ke `digitalSimOutput.play(compiledEvents)`.
- Mengizinkan pengetukan bilah Saron atau Gong langsung di tab **Output Gamelan** untuk menghasilkan bunyi real-time.
- Menyorot blok Blockly yang sedang dieksekusi dengan border kuning terang secara otomatis.

- [ ] **Step 1: Hubungkan `DigitalSimOutput` di `EditorPage.tsx`**
  Ganti simulasi timeout manual dengan eksekusi `digitalSimOutput.play()`.
  Hubungkan workspace Blockly untuk highlight blok.

- [ ] **Step 2: Tambahkan audio preview langsung pada `GamelanVisualizer.tsx`**
  Saat anak mengetuk bilah 1, 2, 3, 5, 6 atau Gong langsung dengan sentuhan/mouse, bunyikan instrumen tersebut.

- [ ] **Step 3: Verifikasi build dev**
  Jalankan `cmd /c "npm run build"` untuk memastikan tidak ada error kompilasi.

---

### Task 4: Verifikasi Browser Subagent & Rekaman Audio-Visual

**Files:**
- Test via browser subagent

- [ ] **Step 1: Uji alur lengkap end-to-end (PRD 9.1)**
  Susun program: `ketika ▶ ditekan` → `ulangi 4x [tabuh saron 1, tabuh saron 2, jeda 1]` → tekan ▶ Mainkan.
  Verifikasi blok ter-highlight secara berurutan dan tabungan berjalan mulus.
- [ ] **Step 2: Uji tab Output Gamelan & pengetukan bilah langsung**
  Buka tab Output Gamelan, ketuk bilah saron dan gong, verifikasi animasi visual menyala.
- [ ] **Step 3: Ambil screenshot bukti pengujian & push ke GitHub.**
