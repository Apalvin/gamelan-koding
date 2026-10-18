# GamelanCode — Spesifikasi Desain Milestone 9, 10, dan 11 (Selaras dengan Esai TLP)

**Tanggal:** 2026-10-18  
**Status:** Approved by User  
**Rujukan Dokumen:** `Essay TLP.md` (Esai Kompetisi GamelanCode) dan `PRD_Gamelan_Koding.md`  

---

## 1. Latar Belakang & Integrasi dengan Esai TLP

Berdasarkan naskah kompetisi pada `Essay TLP.md`, **GamelanCode** adalah media pembelajaran interaktif yang memadukan *block-based coding* dengan pola tabuhan karawitan Jawa untuk melatih berpikir komputasional (*computational thinking*) siswa sekolah dasar kelas V, selaras dengan mata pelajaran pilihan Coding dan AI (Kemendikdasmen 2025/2026).

Tiga milestone pelengkap ini dirancang untuk mewujudkan konsep esai menjadi fitur konkret yang siap diuji dan dipresentasikan di hadapan dewan juri:
1. **Milestone 9: Pengayaan Tab "Belajar"**: Menyediakan eksplorasi audio interaktif (*tuts soundboard* instrumen Balungan & Kolotomik), anatomi gamelan, dan glosarium budaya.
2. **Milestone 10: Ekspor, Impor & Generator Notasi Kepatihan (Tab "Karyaku")**: Fitur berbagi karya antar-siswa/guru serta konversi program blok menjadi partitur angka kepatihan tradisional.
3. **Milestone 11: Mode Showcase Presentasi Juri**: Modul terpadu 5 babak yang merangkum tesis, metodologi, dan bukti kerja prototipe secara langsung di dalam aplikasi untuk mempermudah penilaian dewan juri.

---

## 2. Rincian Desain Tiap Milestone

### 2.1 Milestone 9: Tab "Belajar" Interaktif (Audio Soundboard & Anatomi Gamelan)

#### A. Tuts Soundboard Interaktif (`BelajarSoundboard.tsx`)
- Menampilkan bilah interaktif 7 nada laras Slendro: `6 (Nem Low)`, `1 (Ji)`, `2 (Ro)`, `3 (Lu)`, `5 (Ma)`, `6' (Nem High)`, `1' (Ji High)` serta instrumen `Gong Ageng`.
- Selector jenis instrumen balungan:
  - **Saron Barung**: Oktaf standar (nada jernih, acuan melodi).
  - **Demung**: 1 oktaf lebih rendah (suara berat, lambat, berwibawa).
  - **Peking**: 1 oktaf lebih tinggi (suara nyaring, lincah).
- Menggunakan `gamelanSynth` untuk membunyikan frekuensi Web Audio akurat saat bilah ditekan, disertai animasi getar logam dan sorotan nama nada Kepatihan Jawa.

#### B. Anatomi & Tiga Fungsi Kelompok Karawitan
- Visualisasi 3 kelompok peran instrumen sesuai etnomusikologi karawitan Jawa:
  1. **Kelompok Balungan (Saron, Demung, Peking)**: Tulang punggung melodi utama gending.
  2. **Kelompok Kolotomik / Struktural (Gong Ageng, Kenong, Kempul)**: Penanda siklus waktu atau pembagi kalimat lagu (gongan).
  3. **Kelompok Pamurba Irama (Kendhang)**: Pemimpin irama, tempo, dan dinamika tabuhan.

#### C. Glosarium Budaya Karawitan
- Kamus mini interaktif dengan penjelasan bahasa anak:
  - *Laras Slendro*: Sistem tangga nada 5 nada pokok berjarak relatif merata.
  - *Balungan*: Kerangka melodi utama gending.
  - *Gongan*: Satu siklus kalimat lagu penuh yang diakhiri tabuhan Gong.
  - *Laya / Irama*: Kecepatan dan kerapatan tabuhan musik gamelan.
  - *Pathet*: Wilayah rasa atau suasana nada dalam karawitan.
- Menyertakan label wajib budaya: *"Contoh — belum divalidasi praktisi karawitan"*.

---

### 2.2 Milestone 10: Ekspor, Impor & Generator Notasi Kepatihan (Tab "Karyaku")

#### A. Ekspor & Impor File Proyek (`.json` / `.gamelan`)
- **Ekspor Proyek**:
  - Tombol pada setiap kartu proyek di Karyaku untuk mengunduh berkas format JSON:
    ```json
    {
      "app": "GamelanCode",
      "version": "1.0",
      "title": "Gending Kreasiku",
      "description": "Pola lancaran gending Jawa",
      "notesCount": 8,
      "xml": "<xml>...</xml>",
      "exportedAt": "2026-10-18T10:00:00Z"
    }
    ```
- **Impor Proyek**:
  - Input berkas di tab Karyaku untuk mengunggah file `.json` atau `.gamelan`.
  - Memvalidasi schema berkas, menyimpannya ke `karyakuService`, dan menyajikan tombol **"Buka di Editor 🚀"**.

#### B. Generator Notasi Angka Kepatihan (`KepatihanModal.tsx`)
- Mengonversi `GamelanEvent[]` hasil kompilasi blok menjadi notasi kepatihan baris per baris.
- Contoh format:
  - Pola 8 ketukan: `.  3  .  5  |  .  3  .  2  |  .  3  .  5  |  .  6  .(5)`
  - Penanda Gong ditulis dengan tanda kurung `(5)` atau penanda khusus `G`.
- Fitur modal:
  - Pratinjau partitur berformat font monospace elegan.
  - Tombol **"Salin Notasi Kepatihan"** dengan toast notifikasi tersalin.

---

### 2.3 Milestone 11: Mode Showcase Presentasi Dewan Juri (Berdasarkan Esai TLP)

Modal presentasi interaktif yang dipicu dari tombol **"🏆 Showcase Esai GamelanCode"** pada Header dan Beranda:

#### Babak 1: Urgensi & Latar Belakang Riset
- **Data Skor PISA**:
  - Skor matematika Indonesia 366 (OECD 2023) dan penilaian *computational problem solving* PISA 2025 skor 427 (di bawah rerata dunia 500).
- **Konteks Kurikulum**:
  - Mata pelajaran pilihan Coding & AI kelas V SD (Kemendikdasmen 2025/2026).
- **Konteks Budaya**:
  - Penetapan Gamelan sebagai Warisan Budaya Takbenda oleh UNESCO (2021). Tantangan minimnya minat generasi muda dan keterbatasan alat gamelan fisik di sekolah.

#### Babak 2: Tiga Prinsip Inti GamelanCode
- **Prinsip 1 — Learning by Doing**: Belajar lewat aksi nyata (susun blok, uji coba simulasi, analisis umpan balik, perbaiki logika).
- **Prinsip 2 — Human-in-the-Loop**: Guru dan praktisi karawitan sebagai pemandu dan penjaga nilai estetika rasa; aplikasi berperan sebagai jembatan pembantu, bukan pengganti manusia.
- **Prinsip 3 — Dual-Model**: Kombinasi simulasi digital inklusif tanpa syarat kepemilikan alat, dengan fasilitas praktik gamelan akustik fisik di sanggar/sekolah.

#### Babak 3: Jalur Belajar Taksonomi Bloom (C1–C6) & Productive Failure
- Menampilkan visualisasi kurikulum 6 level Krathwohl (2002):
  - *C1 Kenali Gamelan* (Mengingat instrumen & nada).
  - *C2 Pahami Polanya* (Memahami struktur pengulangan).
  - *C3 Susun Tabuhan* (Menerapkan blok logika).
  - *C4 Detektif Tabuhan* (Menganalisis & debugging kesalahan).
  - *C5 Kurator Pola* (Mengevaluasi ragam variasi pola).
  - *C6 Ciptakan Gendingmu* (Mencipta gending orisinal).
- **Productive Failure (Kapur, 2008)**: Penjelasan ilmiah di balik Tantangan Awal sebelum masuk ke misi berjenjang.

#### Babak 4: Arsitektur Perangkat Lunak & Simulasi Hardware
- **Arsitektur 3-Tahap**: Compile (Blockly ke GamelanEvent) → Guard (anti-freeze guard 5000 step) → Play (Web Audio scheduler).
- **Bukti Konsep Hardware**: Protokol serial 115200 Baud ke Mikrokontroler (ESP32/Arduino) → driver solenoid pemukul saron dan gong fisik (merujuk preseden Robot Gamelan Sekar Nuswantoro UDINUS & Gamelatron).

#### Babak 5: Dampak Multilevel & SDGs Menuju Indonesia Emas 2045
- **Tingkat Individu**: Daya pikir komputasional + rasa cinta tradisi lokal.
- **Tingkat Sosial**: Ekosistem kemitraan sekolah dan sanggar karawitan.
- **Dukungan SDGs**: SDG 4 (Pendidikan Berkualitas), SDG 11 (Pelestarian Budaya), dan SDG 17 (Kemitraan Multipihak).
- **Pintu Masuk Langsung**:
  - Tombol `[ Uji Coba Editor 🚀 ]`, `[ Coba Misi Bloom 🎯 ]`, dan `[ Lihat Simulasi Hardware ⚡ ]`.

---

## 3. Rencana Pengujian Otomatis

1. **Unit Test `kepatihanConverter.test.ts`**:
   - Memvalidasi pembentukan teks notasi kepatihan dari array `GamelanEvent[]`.
   - Menguji penanganan jeda (simbol `.`), nada kepatihan, dan penanda gong `(n)`.
2. **Unit Test `projectImportExport.test.ts`**:
   - Memvalidasi serialisasi proyek ke JSON dan parsing berkas yang diimpor.
   - Menguji penolakan file invalid atau rusak dengan pesan kesalahan ramah pengguna.
3. **Integration Test Suite**:
   - Memverifikasi pembukaan modal Showcase, Soundboard Belajar, dan interaksi Ekspor/Impor.
   - Seluruh test suite (`npx vitest run`) dan build produksi (`npm run build`) wajib 100% lulus.

---

## 4. Standar Bahasa & Nilai
- Nol kata "gagal" pada antarmuka.
- Label baku etika budaya: *"Contoh — belum divalidasi praktisi karawitan"*.
- Penegasan bahwa aplikasi adalah media edukasi komputasional, bukan pengganti estetika rasa penabuh gamelan asli.
