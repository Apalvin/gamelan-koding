# Gamelan Koding (Milestone 5) Implementation Plan: Misi & Evaluator Otomatis (C1–C6)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun sistem Misi bertingkat Taksonomi Bloom (C1–C6) lengkap dengan berkas data JSON statis, mesin evaluator otomatis ramah anak (tanpa kata "gagal"), penyimpanan progres di `localStorage`, modal interaktif untuk kuis/pola (C1, C2, C5), dan integrasi langsung ke kanvas Editor (C3, C4, C6).

**Architecture:** Misi didefinisikan secara deklaratif di `src/content/missions.json` dengan label budaya statis (`validatedBy: null`). Mesin evaluator murni (`missionEvaluator.ts`) membandingkan jawaban kuis atau luaran `GamelanEvent[]` hasil kompilasi workspace dengan target. Service `missionProgressService.ts` mengelola persistensi `localStorage` dengan penanganan try/catch aman. `App.tsx` mengoordinasikan transisi antara `MisiPage` dan `EditorPage` saat misi aktif dimainkan.

**Tech Stack:**
- React 19 + TypeScript + Vite
- Lucide React Icons
- Blockly (`blockly`)
- Web Audio API (`digitalSimOutput` & `gamelanSynth`)
- Vitest untuk unit testing evaluator dan service

## Global Constraints
- Bahasa UI: 100% Bahasa Indonesia, ramah anak SD kelas 4–6, tidak ada kata "gagal" (umpan balik menyemangati).
- Integritas Budaya: Pola tabuhan diberi label jelas `"Contoh — belum divalidasi praktisi karawitan"` (`validatedBy: null`).
- Touch Target: Minimal 44px × 44px untuk semua elemen interaktif (kartu, tombol, pilihan).
- Client-side only: Semua status disimpan di `localStorage` tanpa dependensi server eksternal.

---

### Task 1: Tipe Data Misi & Berkas Konten JSON (`src/types/mission.ts` & `src/content/missions.json`)

**Files:**
- Create: `src/types/mission.ts`
- Create: `src/content/missions.json`
- Test: `tests/compiler/missionData.test.ts`

**Interfaces:**
- Produces: `Mission`, `MissionId`, `BloomLevel`, `MissionProgress`, `EvaluationResult`, `missionsData`

- [x] **Step 1: Tulis unit test untuk memvalidasi struktur data 6 misi C1–C6**
- [x] **Step 2: Jalankan test dan pastikan gagal karena file belum dibuat**
- [x] **Step 3: Buat definisi tipe data di `src/types/mission.ts`**
- [x] **Step 4: Buat berkas konten JSON `src/content/missions.json` berisi 6 misi C1–C6**
- [x] **Step 5: Jalankan test dan pastikan lulus**
- [x] **Step 6: Commit Task 1**

---

### Task 2: Mesin Evaluator Otomatis Ramah Anak (`src/compiler/missionEvaluator.ts`)

**Files:**
- Create: `src/compiler/missionEvaluator.ts`
- Test: `tests/compiler/missionEvaluator.test.ts`

**Interfaces:**
- Consumes: `GamelanEvent` dari `src/types/gamelan.ts`, `Mission` dari `src/types/mission.ts`
- Produces: `evaluateMission(mission, input)` dengan evaluator khusus `evaluateC1`, `evaluateC2`, `evaluateC3`, `evaluateC4`, `evaluateC5`, `evaluateC6`

- [x] **Step 1: Tulis unit test untuk evaluator C1–C6 (jawaban benar, hampir tepat, dan apresiasi anak)**
- [x] **Step 2: Jalankan test dan pastikan gagal**
- [x] **Step 3: Implementasikan logika evaluator di `src/compiler/missionEvaluator.ts`**
- [x] **Step 4: Jalankan unit test dan pastikan semua lulus**
- [x] **Step 5: Commit Task 2**

---

### Task 3: Layanan Penyimpanan Progres Misi (`src/services/missionProgressService.ts`)

**Files:**
- Create: `src/services/missionProgressService.ts`
- Test: `tests/services/missionProgressService.test.ts`

**Interfaces:**
- Produces: `missionProgressService` (`getAllProgress`, `getProgress(id)`, `saveProgress(id, stars, status)`, `resetAll()`)

- [x] **Step 1: Tulis unit test untuk membaca dan menyimpan progres misi ke localStorage**
- [x] **Step 2: Jalankan test dan pastikan gagal**
- [x] **Step 3: Implementasikan `missionProgressService.ts` dengan penanganan try/catch aman**
- [x] **Step 4: Jalankan test dan pastikan lulus**
- [x] **Step 5: Commit Task 3**

---

### Task 4: Modal Interaktif Misi C1, C2, dan C5

**Files:**
- Create: `src/components/missions/MissionModalC1.tsx` (Kuis Cocokkan Gambar & Suara)
- Create: `src/components/missions/MissionModalC2.tsx` (Puzzle Susun Potongan Pola)
- Create: `src/components/missions/MissionModalC5.tsx` (Evaluasi Kurator Pola & Alasan)
- Create: `src/components/missions/MissionSuccessModal.tsx` (Pop-up Selamat & Bintang)

- [x] **Step 1: Buat `MissionSuccessModal.tsx` dengan animasi bintang dan pesan apresiasi ramah anak**
- [x] **Step 2: Buat `MissionModalC1.tsx` dengan tombol tes bunyi instrumen dan pilihan instrumen**
- [x] **Step 3: Buat `MissionModalC2.tsx` dengan pemutar audio pola dan kartu urutan interaktif**
- [x] **Step 4: Buat `MissionModalC5.tsx` dengan perbandingan visual dua program blok dan pilihan alasan**
- [x] **Step 5: Commit Task 4**

---

### Task 5: Integrasi Misi ke Editor (C3, C4, C6)

**Files:**
- Create: `src/components/missions/MissionEditorBanner.tsx`
- Modify: `src/pages/EditorPage.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- `EditorPage` menerima props `activeMissionId: string | null` dan callback `onExitMission: () => void`

- [x] **Step 1: Buat komponen `MissionEditorBanner.tsx` (target tabuhan, dengarkan target, periksa hasil, keluar)**
- [x] **Step 2: Perbarui `EditorPage.tsx` untuk memuat banner misi, tombol periksa hasil, dan kode awal C4 (buggy starter)**
- [x] **Step 3: Hubungkan tombol "Periksa Hasil" ke `missionEvaluator` dan tampilkan `MissionSuccessModal`**
- [x] **Step 4: Perbarui `App.tsx` untuk mengelola state `activeMissionId` saat navigasi antara `MisiPage` dan `EditorPage`**
- [x] **Step 5: Commit Task 5**

---

### Task 6: Pembaharuan Layar Misi (`src/pages/MisiPage.tsx`)

**Files:**
- Modify: `src/pages/MisiPage.tsx`

- [x] **Step 1: Muat data dari `src/content/missions.json` dan progres dari `missionProgressService`**
- [x] **Step 2: Tampilkan bintang penguasaan (⭐) dan badge status (Belum, Sedang, Selesai)**
- [x] **Step 3: Hubungkan klik kartu misi: buka modal untuk C1/C2/C5, dan arahkan ke Editor untuk C3/C4/C6**
- [x] **Step 4: Commit Task 6**

---

### Task 7: Verifikasi End-to-End, Tes Build, dan Dokumentasi

- [x] **Step 1: Jalankan seluruh test vitest (`cmd /c "npx vitest run"`)**
- [x] **Step 2: Jalankan build produksi (`cmd /c "npm run build"`)**
- [x] **Step 3: Buka aplikasi di browser, uji alur C1 hingga C6 end-to-end**
- [x] **Step 4: Commit dan Push ke GitHub**
