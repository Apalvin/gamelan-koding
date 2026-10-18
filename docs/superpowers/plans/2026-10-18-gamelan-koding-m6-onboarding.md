# Gamelan Koding (Milestone 6) Implementation Plan: Onboarding + Tantangan Gending Akhir + Reset Total

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun alur Onboarding interaktif 5 slide, input nama siswa, audio teaser Tantangan Gending Akhir (Lancaran 8 ketukan), mode evaluasi ramah anak di Editor tanpa kata "gagal", serta fitur Reset Total Aplikasi (*clean slate*) di menu Pengaturan.

**Architecture:** Layanan `onboardingService.ts` mengelola status onboarding, nama siswa, dan pembersihan total `localStorage` / memory cache. `OnboardingModal.tsx` menyajikan 5 slide berurutan dengan tombol pemutar audio pola target. `finalChallengeEvaluator.ts` mengevaluasi tabuhan siswa terhadap target lancaran 8 ketukan dengan umpan balik apresiatif. `EditorPage.tsx` dan `AppHeader.tsx` mengintegrasikan banner tantangan akhir dan tombol reset total. `App.tsx` mengoordinasikan pembukaan otomatis onboarding saat pertama kali aplikasi dimuat.

**Tech Stack:**
- React 19 + TypeScript + Vite
- Lucide React Icons
- Blockly (`blockly`)
- Web Audio API (`digitalSimOutput` & `gamelanSynth`)
- Vitest untuk unit testing

## Global Constraints
- Bahasa UI: 100% Bahasa Indonesia, ramah anak SD kelas 4–6, tidak ada kata "gagal" (pesan apresiatif).
- Integritas Budaya: Pola lancaran 8 ketukan diberi label jelas `"Contoh — belum divalidasi praktisi karawitan"` (`validatedBy: null`).
- Touch Target: Minimal 44px × 44px untuk semua tombol dan kartu interaktif.
- Client-side only: Semua status disimpan di `localStorage` tanpa dependensi backend.

---

### Task 1: Layanan Onboarding & Reset Storage (`src/services/onboardingService.ts`)

**Files:**
- Create: `src/services/onboardingService.ts`
- Test: `tests/services/onboardingService.test.ts`

**Interfaces:**
- Produces: `onboardingService` (`isOnboardingCompleted`, `setOnboardingCompleted`, `getStudentName`, `setStudentName`, `resetAllAppStorage`, `FINAL_CHALLENGE_TARGET_EVENTS`)

- [x] **Step 1: Tulis unit test untuk onboardingService (baca/tulis status, simpan nama, dan reset total)**
- [x] **Step 2: Jalankan test dan pastikan gagal karena file belum dibuat**
- [x] **Step 3: Implementasikan `src/services/onboardingService.ts` dengan penanganan aman localStorage dan memori cache**
- [x] **Step 4: Jalankan test dan pastikan seluruh test lulus**
- [x] **Step 5: Commit Task 1**

---

### Task 2: Mesin Evaluator Tantangan Gending Akhir (`src/compiler/finalChallengeEvaluator.ts`)

**Files:**
- Create: `src/compiler/finalChallengeEvaluator.ts`
- Test: `tests/compiler/finalChallengeEvaluator.test.ts`

**Interfaces:**
- Produces: `evaluateFinalChallenge(events: GamelanEvent[]): EvaluationResult`
- Pola Target: Lancaran 8 ketukan (`3, 5, 3, 2, 3, 5, 6, 5` + gong seleh di ketuk ke-8).

- [x] **Step 1: Tulis unit test untuk evaluator tantangan akhir (skenario sempurna, mencoba/belum tepat, dan pesan menguatkan)**
- [x] **Step 2: Jalankan test dan pastikan gagal**
- [x] **Step 3: Implementasikan logika evaluasi di `src/compiler/finalChallengeEvaluator.ts`**
- [x] **Step 4: Jalankan test dan pastikan lulus**
- [x] **Step 5: Commit Task 2**

---

### Task 3: Modal Interaktif Onboarding 5 Slide (`src/components/onboarding/OnboardingModal.tsx`)

**Files:**
- Create: `src/components/onboarding/OnboardingModal.tsx`

**Interfaces:**
- Props:
  - `isOpen: boolean`
  - `onClose: () => void`
  - `onStartChallenge: () => void` (membuka Editor mode tantangan akhir)
  - `onSkipToMissions: () => void` (mengarahkan langsung ke Misi C1)

- [x] **Step 1: Buat slide 1 (Pengantar Seni & Koding) dan slide 2 (Peta 5 Tab Seru)**
- [x] **Step 2: Buat slide 3 (Jembatan Tradisi Bersama Guru/Pengrawit) dan slide 4 (Input Nama Siswa)**
- [x] **Step 3: Buat slide 5 (Tantangan Gending Akhir + Tombol Dengarkan Target + Aksi Coba/Lewati)**
- [x] **Step 4: Commit Task 3**

---

### Task 4: Integrasi Tantangan Gending Akhir di Editor (`src/pages/EditorPage.tsx`)

**Files:**
- Modify: `src/pages/EditorPage.tsx`

**Interfaces:**
- Props baru di `EditorPageProps`:
  - `isFinalChallengeActive?: boolean`
  - `onExitFinalChallenge?: () => void`

- [x] **Step 1: Tambahkan banner visual Tantangan Gending Akhir di Editor jika mode aktif**
- [x] **Step 2: Hubungkan tombol "Dengarkan Target" ke pemutar audio target lancaran 8 ketukan**
- [x] **Step 3: Hubungkan tombol "Periksa Tabuhanku" ke `evaluateFinalChallenge`**
- [x] **Step 4: Tampilkan modal hasil apresiasi yang mengarahkan anak ke Misi C1**
- [x] **Step 5: Commit Task 4**

---

### Task 5: Tombol Reset Total & Akses Ulang Onboarding (`src/components/layout/AppHeader.tsx` & `BerandaPage.tsx`)

**Files:**
- Modify: `src/components/layout/AppHeader.tsx`
- Modify: `src/pages/BerandaPage.tsx`

- [x] **Step 1: Tambahkan tombol "Panduan Onboarding" di modal Pengaturan/Profil (`AppHeader.tsx`)**
- [x] **Step 2: Tambahkan tombol "Reset Total Aplikasi" dengan dialog konfirmasi aman di `AppHeader.tsx`**
- [x] **Step 3: Tambahkan tombol pintas "Buka Panduan Awal" di `BerandaPage.tsx`**
- [x] **Step 4: Commit Task 5**

---

### Task 6: Integrasi Alur Utama di `App.tsx` & Pengujian End-to-End

**Files:**
- Modify: `src/App.tsx`

- [x] **Step 1: Periksa status onboarding di `App.tsx` dan picu `OnboardingModal` otomatis jika baru pertama buka**
- [x] **Step 2: Hubungkan aksi "Coba Dulu di Editor" dan "Lewati & Mulai Misi" di `App.tsx`**
- [x] **Step 3: Hubungkan callback reset total aplikasi agar state langsung ter-refresh bersih**
- [x] **Step 4: Jalankan seluruh test vitest (`cmd /c "npx vitest run"`)**
- [x] **Step 5: Jalankan build produksi (`cmd /c "npm run build"`)**
- [x] **Step 6: Commit dan Push ke GitHub**
