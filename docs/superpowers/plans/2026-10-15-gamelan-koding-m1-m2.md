# Gamelan Koding (Milestone 1 & 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun fondasi prototype web Gamelan Koding (Milestone 1 & 2 dari PRD), mencakup kerangka aplikasi portrait-first responsif, navigasi bawah 5 tab ramah anak (Bahasa Indonesia), serta layar Editor berbasis Blockly dengan blok kustom gamelan, bottom-sheet palet blok "+ Blok", tombol Mainkan/Berhenti, dan tab Output Gamelan.

**Architecture:** Aplikasi web client-side SPA menggunakan Vite, React 19 / TypeScript, dan Tailwind CSS / Vanilla CSS dengan pendekatan mobile/portrait-first yang terpusat di layar tablet/desktop. Layar Editor mengintegrasikan core Blockly dengan definisi blok kustom kategori "Gamelan" dan palet blok berupa drawer bottom-sheet kustom yang menyisipkan blok ke workspace saat diklik/disentuh, serta tab atas untuk beralih antara kanvas Blockly dan visual Output Gamelan.

**Tech Stack:**
- Vite + React + TypeScript
- Blockly (`blockly`)
- Lucide React (ikon navigasi dan tombol)
- CSS kustom / Tailwind utility styling (ramah anak, warna cerah, kontras tinggi, touch target ≥ 44px)

## Global Constraints
- **Kepatuhan Arsitektur Bagian 7 PRD**: 
  - Stack client-side tanpa backend (7.1): Vite + React + TypeScript + Blockly + localStorage (try/catch).
  - Model eksekusi 3 tahap (7.2): Tipe data `GamelanEvent` `{ tMs, instrument, note, velocity, blockId }` disiapkan di `src/types/gamelan.ts` untuk memisahkan tahapan compile, guard, dan play.
  - Antarmuka output (7.3): Menyiapkan interface `GamelanOutput` (`play()`, `stop()`) dan representasi `DigitalSimOutput` serta `HardwareSimOutput` (log pesan `{"t":...,"ch":...,"vel":...}`).
  - Integritas data & budaya (7.5): Disimpan statis dengan label "Contoh - belum divalidasi praktisi".
- Target perangkat: Layar sentuh portrait (mobile-first), responsif untuk tablet dan laptop.
- Bahasa UI: 100% Bahasa Indonesia, ramah anak SD kelas 4–6, kalimat pendek.
- Desain aksesibilitas: Font besar, kontras jelas, target sentuh minimal 44px × 44px, tombol berikon + teks.
- Batasan milestone: Hanya mengerjakan Milestone 1 & 2 (tombol Mainkan belum memutar audio Web Audio, visual layout dan struktur event disiapkan).

---

### Task 1: Inisialisasi Proyek Vite + React + TypeScript & Dependensi

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`

**Interfaces:**
- Produces: Proyek Vite yang dapat di-build (`cmd /c "npm run build"`) dan dijalankan (`cmd /c "npm run dev"`).
- Dependencies: `react`, `react-dom`, `blockly`, `lucide-react`, `@types/react`, `@types/react-dom`, `vite`, `typescript`.

- [x] **Step 1: Inisialisasi package.json dan instalasi dependensi**
  Menyiapkan package.json dengan dependensi React, TypeScript, Blockly, Lucide-React, dan Vite.
  Jalankan instalasi menggunakan `cmd /c "npm install"`.

- [x] **Step 2: Buat konfigurasi Vite, TypeScript, dan index.html**
  Atur `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, dan `index.html` dengan judul "Gamelan Koding" dan font Google "Fredoka" atau "Nunito" yang bulat dan ramah anak.

- [x] **Step 3: Setup styling dasar ramah anak di index.css**
  Definisikan CSS variables untuk warna gamelan (emas, hijau toska, merah bata, kayu jati), touch target minimum 44px, reset CSS, dan container responsif portrait-first (maksimal 480px di desktop dengan shadow elegan).

- [x] **Step 4: Verifikasi build dev**
  Jalankan `cmd /c "npm run build"` untuk memastikan tidak ada error kompilasi TypeScript atau bundling.

---

### Task 2: Layout Navigasi Bawah 5 Tab & Header Profil

**Files:**
- Create: `src/types/navigation.ts`
- Create: `src/components/layout/AppHeader.tsx`
- Create: `src/components/layout/BottomNavigation.tsx`
- Create: `src/components/layout/AppLayout.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- `TabId`: `'beranda' | 'belajar' | 'editor' | 'misi' | 'karyaku'`
- `AppLayout`: Menerima active tab dan membungkus halaman dengan container portrait responsif, header atas, dan navigasi 5 tab di bawah.

- [x] **Step 1: Buat tipe data tab navigasi di `src/types/navigation.ts`**
  Mendefinisikan 5 tab: Beranda, Belajar, Editor, Misi, Karyaku beserta label, ikon, dan aksen warna khusus (Editor: Hijau, Misi: Kuning).

- [x] **Step 2: Buat komponen `AppHeader.tsx`**
  Menampilkan logo/judul "Gamelan Koding", badge mini, dan tombol pengaturan/profil di kanan atas berukuran minimal 44px dengan modal pengaturan dummy (Nama siswa, suara on/off, Bahasa petunjuk).

- [x] **Step 3: Buat komponen `BottomNavigation.tsx`**
  Navigasi 5 tab:
  - Tab aktif tampil **lebih besar** (scale 1.15, elevated, badge teks tebal, ikon lebih besar).
  - Target sentuh minimal 44px × 44px per tab.
  - Warna aksen sesuai sketsa PRD (Tab Editor hijau ceria, Tab Misi kuning hangat).

- [x] **Step 4: Integrasikan di `AppLayout.tsx` & `App.tsx`**
  Bungkus layar dalam container portrait `max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col` yang elegan di HP, tablet, dan laptop.

---

### Task 3: Halaman Placeholder (Beranda, Belajar, Misi, Karyaku)

**Files:**
- Create: `src/pages/BerandaPage.tsx`
- Create: `src/pages/BelajarPage.tsx`
- Create: `src/pages/MisiPage.tsx`
- Create: `src/pages/KaryakuPage.tsx`

**Interfaces:**
- Komponen halaman React mandiri yang menampilkan konten awal ramah anak, tombol aksi cepat menuju Editor, dan badge peringatan "Contoh - belum divalidasi praktisi".

- [x] **Step 1: Buat `BerandaPage.tsx`**
  Sapaan ramah ("Halo Pengrawit Cilik!"), kartu "Lanjutkan Misi", ringkasan progres dummy, dan tombol aksi "Buka Editor Bebas".

- [x] **Step 2: Buat `BelajarPage.tsx`**
  Materi singkat pengenalan instrumen (Saron, Slendro, Gong) berlabel "Contoh — belum divalidasi praktisi".

- [x] **Step 3: Buat `MisiPage.tsx`**
  Daftar kartu misi bertingkat C1–C6 sesuai Taksonomi Bloom revisi di PRD (C1 Kenali Gamelan, C2 Pahami Polanya, C3 Susun Tabuhan, dst.) dengan badge "Mulai dari sini" dan tombol buka ke Editor.

- [x] **Step 4: Buat `KaryakuPage.tsx`**
  Daftar gending yang disimpan siswa (placeholder kartu dengan try/catch `localStorage`).

---

### Task 4: Definisi Blok Kustom Gamelan di Blockly & Tipe Data Arsitektur Bagian 7
 
**Files:**
- Create: `src/types/gamelan.ts`
- Create: `src/blockly/blocks/gamelanBlocks.ts`
- Create: `src/blockly/theme/gamelanTheme.ts`
- Create: `src/blockly/toolbox.ts`

**Interfaces:**
- Arsitektur Bagian 7.2 & 7.3:
  - `GamelanEvent`: `{ tMs: number; instrument: 'saron' | 'gong'; note?: number | string; velocity: number; blockId?: string; }`
  - `GamelanOutput`: `interface { play(events: GamelanEvent[]): Promise<void>; stop(): void; }`
  - `HardwareSimLog`: `{ t: number; ch: number; vel: number; }`
- Blok Kustom Blockly:
  1. `ketika_mulai`: Hat block / blok awal ("ketika ▶ ditekan"), tidak ada previousStatement, memiliki nextStatement.
  2. `tabuh_saron`: "tabuh [instrumen] nada [1|2|3|5|6]" (instrumen dropdown Saron, nada kepatihan slendro 1 2 3 5 6).
  3. `jeda_ketuk`: "jeda [n] ketuk" (input angka ketukan, default 1).
  4. `atur_tempo`: "atur tempo [BPM]" (input angka, rentang 40-140, default 60).
  5. `tabuh_gong`: "tabuh gong" (penanda akhir siklus).
- Blok Bawaan:
  - `controls_repeat_ext` ("ulangi [n] kali") dan blok angka `math_number`.

- [x] **Step 1: Definisikan arsitektur data Bagian 7 di `src/types/gamelan.ts`**
  Membuat interface `GamelanEvent`, `GamelanOutput`, dan tipe instrumen/nada slendro sesuai spesifikasi PRD 7.2 & 7.3.

- [x] **Step 2: Registrasi tema warna ramah anak di `gamelanTheme.ts`**
  Atur warna kategori: Gamelan (warna emerald/teal atau gold khas gamelan), Kontrol (amber/oranye), Matematika/Angka (biru langit). Font blok besar dan mudah dibaca.

- [x] **Step 3: Buat file `gamelanBlocks.ts`**
  Gunakan API modern Blockly (`Blockly.common.defineBlocksWithJsonArray` atau blok builder) untuk mendefinisikan kelima blok kustom dengan teks Bahasa Indonesia, ikon yang jelas, dan tooltip ramah anak.

- [x] **Step 4: Siapkan definisi toolbox / palet di `toolbox.ts`**
  Menyediakan metadata blok untuk digunakan baik pada workspace maupun drawer palet kustom.

---

### Task 5: Layar Editor (Sketsa 1), Bottom-Sheet "+ Blok", & Tombol Kontrol Mainkan/Berhenti

**Files:**
- Create: `src/components/editor/BlockPaletteDrawer.tsx`
- Create: `src/components/editor/EditorToolbar.tsx`
- Create: `src/components/editor/BlocklyWorkspace.tsx`
- Create: `src/pages/EditorPage.tsx`

**Interfaces:**
- `EditorPage`: Memiliki 2 tab atas ("Editor" | "Output Gamelan").
- `EditorToolbar`: Tombol ▶ Mainkan / ■ Berhenti yang selalu terlihat + status playback.
- `BlockPaletteDrawer`: Bottom-sheet yang dibuka dari tombol "+ Blok", menampilkan kartu-kartu blok per kategori (Gamelan, Kontrol). Mengklik kartu blok akan menyisipkan blok tersebut langsung ke kanvas Blockly di posisi aktif.

- [x] **Step 1: Buat `BlockPaletteDrawer.tsx`**
  Komponen bottom-sheet geser yang muncul saat tombol "+ Blok" ditekan:
  - Tab kategori: "Tabuhan Gamelan", "Kontrol & Pengulangan".
  - Daftar blok dengan preview visual dan tombol "Tambah ke Kanvas".
  - Tombol tutup/swipe down yang ramah sentuhan (touch target ≥ 44px).

- [x] **Step 2: Buat `BlocklyWorkspace.tsx`**
  Menginisialisasi `Blockly.inject` ke div container responsif dengan zoom, scroll, dan trashcan.
  Menyediakan helper untuk menyisipkan blok dari bottom sheet (`addBlockToWorkspace(blockType)`).
  Menyediakan blok default `ketika_mulai` di workspace jika kanvas baru dibuka.

- [x] **Step 3: Buat `EditorToolbar.tsx`**
  Toolbar yang selalu terlihat dengan:
  - Tombol "+ Blok" (membuka bottom sheet).
  - Tombol toggle ▶ Mainkan / ■ Berhenti (selalu terlihat, target sentuh besar, warna kontras).
  - Tombol Bersihkan / Reset kanvas.

- [x] **Step 4: Satukan di `EditorPage.tsx` dengan tab ganda ("Editor" | "Output Gamelan")**
  Menyediakan switch tab atas sesuai Sketsa 1 di PRD.

---

### Task 6: Tab Output Gamelan & Mode Keluaran

**Files:**
- Create: `src/components/output/GamelanVisualizer.tsx`
- Create: `src/components/output/HardwareSimulationPanel.tsx`
- Modify: `src/pages/EditorPage.tsx`

**Interfaces:**
- `GamelanVisualizer`: Visual bilah saron slendro (1, 2, 3, 5, 6) dan Gong kayu/kuningan dengan layout responsif.
- `HardwareSimulationPanel`: Panel mode keluaran "Simulasi Digital" vs "Gamelan Akustik (Simulasi)" lengkap dengan label disclaimer "Simulasi — perangkat belum terhubung" dan terminal log simulasi instruksi solenoid/aktuator `{ t, ch, vel }`.

- [x] **Step 1: Buat `GamelanVisualizer.tsx`**
  Tampilan visual instrumen Saron (bilah kuningan dengan nomor kepatihan 1, 2, 3, 5, 6) di atas rancakan kayu Jawa yang indah, serta instrumen Gong.

- [x] **Step 2: Buat `HardwareSimulationPanel.tsx`**
  Mode switch antara "Simulasi Digital" dan "Gamelan Akustik (Simulasi)" sesuai Bagian 4.2 & 7.3 PRD, dengan keterangan edukatif untuk esai lomba.

- [x] **Step 3: Hubungkan visualizer ke tab "Output Gamelan" di `EditorPage.tsx`**
  Pengguna dapat berpindah dengan mulus antara tab "Editor" dan "Output Gamelan".

---

### Task 7: Verifikasi Sistem, Pengujian Browser, & Tangkapan Layar

**Files:**
- Test & Verification via browser subagent

- [x] **Step 1: Jalankan dev server lokal**
  Jalankan `cmd /c "npm run dev"` dan pastikan aplikasi menyala di port lokal (misal `http://localhost:5173`).

- [x] **Step 2: Buka browser subagent & verifikasi UI/UX**
  - Uji navigasi bawah: pastikan 5 tab berpindah dengan lancar, tab aktif membesar, touch target nyaman.
  - Uji tab Editor: pastikan kanvas Blockly memuat blok `ketika ▶ ditekan`.
  - Uji tombol "+ Blok": pastikan bottom-sheet palet muncul, memilih blok menambahkannya ke kanvas.
  - Uji tombol Mainkan/Berhenti: status berubah saat ditekan.
  - Uji tab Output Gamelan: pastikan bilah saron dan mode keluaran ditampilkan.

- [x] **Step 3: Ambil screenshot bukti pengujian**
  Tunjukkan screenshot layar Editor dan navigasi bawah sebagai bukti penyelesaian milestone 1 & 2.
