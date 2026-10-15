# Gamelan Koding (Milestone 3) Implementation Plan: Compiler & Guard

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun engine eksekusi koding gamelan (Milestone 3 dari PRD), mencakup generator Blockly ke kode instruksi, virtual clock simulator untuk menghasilkan daftar `GamelanEvent` `{ tMs, instrument, note, velocity, blockId }`, sistem pengaman (guard) terhadap loop tak terbatas, serta unit test otomatis untuk memvalidasi compiler.

**Architecture:** Model eksekusi 3-tahap PRD Bagian 7.2. Workspace Blockly dikonversi melalui generator kustom menjadi urutan eksekusi terisolasi (sandbox). Generator menyisipkan pelacak langkah (step counter) untuk menghentikan program jika melampaui batas (5.000 langkah / 2.000 event). Virtual clock menghitung waktu tabuhan (milidetik) berdasarkan tempo BPM dinamis dan jeda ketukan. Hasil kompilasi berupa array `GamelanEvent[]` yang siap dikonsumsi oleh audio scheduler di Milestone 4.

**Tech Stack:**
- Vite + React + TypeScript
- Blockly Generator API (`blockly/javascript` / custom generator)
- Vitest (`vitest`) untuk unit testing compiler

## Global Constraints
- **Kepatuhan Arsitektur Bagian 7.2 PRD**:
  - Format event wajib: `{ tMs: number, instrument: InstrumentType, note?: SlendroNote, velocity: number, blockId?: string }`.
  - Guard batas langkah: Maksimal 5.000 langkah dan maksimal 2.000 event.
  - Pesan error ramah anak: Kalimat pendek dan mendidik jika batas loop terlampaui.
- Tanpa backend: Semua eksekusi berjalan di client-side (sandbox peramban).
- Unit testing dapat dijalankan secara konsisten melalui perintah `cmd /c "npm test"`.

---

### Task 1: Setup Framework Unit Testing (Vitest) & Dependensi

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

**Interfaces:**
- Produces: Script `npm test` yang mengeksekusi pengujian TypeScript via Vitest.

- [x] **Step 1: Tambahkan `vitest` ke devDependencies di package.json**
  Menambahkan `vitest` dan update script `"test": "vitest run"`.
  Jalankan instalasi menggunakan `cmd /c "npm install"`.

- [x] **Step 2: Buat konfigurasi `vitest.config.ts`**
  Konfigurasi Vitest untuk environment node/happy-dom.

- [x] **Step 3: Uji konfigurasi dasar test runner**
  Jalankan `cmd /c "npm test"` dan pastikan test runner bekerja.

---

### Task 2: Definisi Tipe Data Compiler & Interface Guard

**Files:**
- Modify: `src/types/gamelan.ts`

**Interfaces:**
- `CompileSuccess`: `{ success: true, events: GamelanEvent[], totalDurationMs: number, blockIds: string[] }`
- `CompileError`: `{ success: false, error: string, code: 'INFINITE_LOOP' | 'EVENT_OVERFLOW' | 'EMPTY_PROGRAM' | 'SYNTAX_ERROR' }`
- `CompileResult`: `CompileSuccess | CompileError`
- `CompilerOptions`: `{ defaultBpm?: number, maxSteps?: number, maxEvents?: number }`

- [x] **Step 1: Tulis interface hasil kompilasi di `src/types/gamelan.ts`**
  Mendefinisikan tipe `CompileResult`, `CompileSuccess`, `CompileError`, dan konstanta batas aman (`DEFAULT_MAX_STEPS = 5000`, `DEFAULT_MAX_EVENTS = 2000`).

---

### Task 3: Virtual Clock & Simulator Eksekusi

**Files:**
- Create: `src/compiler/virtualClock.ts`
- Create: `tests/compiler/virtualClock.test.ts`

**Interfaces:**
- Consumes: `GamelanEvent`, `CompilerOptions`
- Produces: `class VirtualClockSimulator`
  - `setTempo(bpm: number): void`
  - `advanceBeats(beats: number): void`
  - `recordHit(instrument: InstrumentType, note?: SlendroNote, blockId?: string, beatsDuration?: number): void`
  - `getEvents(): GamelanEvent[]`
  - `getDurationMs(): number`

- [x] **Step 1: Tulis test kasus uji VirtualClock di `tests/compiler/virtualClock.test.ts`**
  Uji penghitungan tMs pada 60 BPM (1 ketuk = 1000ms), perubahan tempo ke 120 BPM (1 ketuk = 500ms), dan akumulasi waktu jeda.

- [x] **Step 2: Implementasikan `VirtualClockSimulator` di `src/compiler/virtualClock.ts`**
  Implementasikan logika penghitungan waktu virtual, konversi BPM ke ms per ketuk, dan penataan array event.

- [x] **Step 3: Jalankan test untuk memverifikasi VirtualClock lolos uji**
  Run: `cmd /c "npm test"`
  Expected: PASS

---

### Task 4: Blockly Custom Code Generator & Guard Sandbox

**Files:**
- Create: `src/compiler/generator.ts`
- Create: `src/compiler/compileWorkspace.ts`
- Create: `tests/compiler/compiler.test.ts`

**Interfaces:**
- Consumes: `Blockly.WorkspaceSvg`, `Blockly.Block`
- Produces:
  - `gamelanGenerator`: Generator Blockly kustom untuk blok `ketika_mulai`, `tabuh_saron`, `jeda_ketuk`, `atur_tempo`, `tabuh_gong`, dan `controls_repeat_ext`.
  - `compileWorkspace(workspace: Blockly.Workspace): CompileResult`: Fungsi utama penerjemah workspace menjadi daftar event aman.

- [x] **Step 1: Tulis unit test untuk `compileWorkspace` di `tests/compiler/compiler.test.ts`**
  Test 1: Program dasar `ketika ▶ ditekan` → `tabuh saron nada 1` menghasilkan 1 event pada t = 0.
  Test 2: Program berurutan `tabuh 1` → `jeda 1 ketuk` → `tabuh 2` pada 60 BPM menghasilkan event t = 0 dan t = 2000ms.
  Test 3: Program loop `ulangi 4x [tabuh saron 1]` menghasilkan 4 event berurutan.
  Test 4: Program loop tak terbatas / batas langkah terlampaui mengembalikan `success: false` dengan kode `INFINITE_LOOP` dan pesan ramah anak.

- [x] **Step 2: Implementasikan generator blok gamelan di `src/compiler/generator.ts`**
  Mendaftarkan generator JavaScript untuk 5 blok gamelan dan loop bawaan dengan penyisipan counter penjaga langkah (`guard.step()`).

- [x] **Step 3: Implementasikan fungsi `compileWorkspace` di `src/compiler/compileWorkspace.ts`**
  Mengekstrak blok dari workspace, menjalankan kode dalam sandbox aman dengan simulator jam virtual, menangkap loop tak terbatas, dan mengembalikan `CompileResult`.

- [x] **Step 4: Jalankan seluruh test suite**
  Run: `cmd /c "npm test"`
  Expected: Semua test lolos (100% PASS).

---

### Task 5: Integrasi Compiler ke Editor UI (Tombol Mainkan)

**Files:**
- Modify: `src/pages/EditorPage.tsx`
- Modify: `src/components/output/HardwareSimulationPanel.tsx`

**Interfaces:**
- Menghubungkan klik tombol **▶ Mainkan** dengan `compileWorkspace(workspace)`.
- Jika kompilasi berhasil: Tampilkan jumlah event dan durasi total, kirim log ke panel simulasi hardware.
- Jika kompilasi gagal (misal loop tak terbatas): Tampilkan peringatan banner ramah anak di atas kanvas tanpa membekukan peramban.

- [x] **Step 1: Integrasikan `compileWorkspace` di `EditorPage.tsx`**
  Saat tombol ▶ Mainkan ditekan, compile workspace Blockly.
  Jika ada error, tampilkan toast/banner pesan ramah ("Wah, programmu terlalu panjang atau berputar tanpa henti! Ayo periksa blok pengulanganmu.").

- [x] **Step 2: Sambungkan event hasil kompilasi ke log HardwareSimulationPanel**
  Hasil event dikonversi menjadi baris serial `{ t: event.tMs, ch: note, vel: event.velocity }` di panel hardware.

- [x] **Step 3: Verifikasi build dev**
  Jalankan `cmd /c "npm run build"` untuk memastikan tidak ada error kompilasi.

---

### Task 6: Verifikasi Browser Subagent & Tangkapan Layar Hasil Kompilasi

**Files:**
- Test via browser subagent

- [ ] **Step 1: Uji alur kompilasi di browser**
  Buka Editor di `http://localhost:5173/`, susun balok `ketika ▶ ditekan` → `ulangi 4x [tabuh saron 1]`, lalu tekan tombol Mainkan.
  Verifikasi daftar event terkompilasi dan log serial terisi sesuai urutan.
- [ ] **Step 2: Uji pengaman infinite loop**
  Susun loop besar dan verifikasi guard menangkapnya dengan pesan ramah anak tanpa freeze.
- [ ] **Step 3: Ambil screenshot bukti pengujian & commit hasil Milestone 3 ke GitHub.**
