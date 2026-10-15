# PRD — Gamelan Koding (Prototype Web App)

> Dokumen ini adalah sumber kebenaran untuk membangun **prototype** Gamelan Koding. Tujuan prototype: didemokan di lomba esai (bukti konsep UI/UX + simulasi alur), BUKAN produk jadi dan BUKAN perangkat fisik yang berfungsi.
> Bagian bertanda **[ASUMSI]** = belum diverifikasi/diputuskan; jangan dianggap fakta.

## 1. Ringkasan produk
Aplikasi belajar coding berbasis blok (drag & drop, mirip Scratch) untuk siswa SD, di mana tantangan coding-nya dibangun dari pola tabuhan karawitan Jawa. Program blok menghasilkan urutan tabuhan yang dibunyikan oleh **simulasi gamelan digital**. Pada rancangan lanjutan (di luar prototype), urutan yang sama dikirim ke mikrokontroler dan pemukul otomatis pada gamelan akustik.

Prinsip desain (harus terlihat di UI):
1. Budaya adalah konteks belajar, bukan hiasan: setiap misi punya penjelasan konteks karawitan.
2. Coding itu aktivitas inti: anak menyusun, menjalankan, memperbaiki program.
3. Aplikasi adalah jembatan menuju praktik gamelan langsung, bukan pengganti guru/pengrawit.

## 2. Tujuan & non-tujuan
**Tujuan prototype**
- Alur lengkap yang bisa didemokan: onboarding → pilih misi → susun blok → jalankan → lihat/dengar output → ulangi/perbaiki.
- Editor blok berfungsi sungguhan (bukan mockup gambar) dengan output suara + visual gamelan.
- Satu mode "Gamelan Akustik (Simulasi)" yang menampilkan bagaimana instruksi akan dikirim ke perangkat, tanpa perangkat nyata.

**Non-tujuan (jangan dibangun)**
- Koneksi hardware sungguhan (Web Serial/Bluetooth), backend, database, login sungguhan, multi-user, fitur guru/dashboard.
- Klaim pedagogis bahwa aplikasi terbukti efektif.

## 3. Pengguna
- Utama: siswa SD (perkiraan kelas 4–6) **[ASUMSI — tentukan dan konsisten dengan esai]**.
- Pendamping: guru / pengrawit (hanya disebut di konten & layar "konteks budaya", belum ada fitur khusus).
- Perangkat target: layar sentuh portrait (sketsa desain berformat portrait) tapi harus tetap layak di tablet dan laptop (responsive). Drag & drop harus bekerja dengan sentuhan dan mouse.

## 4. Struktur layar (berdasarkan sketsa)
Navigasi bawah, 5 tab; tab aktif ditampilkan lebih besar. Dari sketsa: tab hijau = **Editor**, tab kuning = **Misi**. Tiga tab lain belum didefinisikan di sketsa → **[ASUMSI]**:
| Tab | Isi |
|---|---|
| Beranda | Sapaan, lanjutkan misi terakhir, ringkasan progres |
| Belajar | Materi "Kenali Gamelan" (instrumen, bunyi, istilah) |
| **Editor** | Kanvas blok + output (lihat 4.2) |
| **Misi** | Daftar misi C1–C6 (lihat 4.3) |
| Karyaku | Pola/gending yang disimpan siswa |

Ikon lingkaran kanan-atas di kedua sketsa → **[ASUMSI]** profil/pengaturan (nama, suara on/off, bahasa petunjuk).

### 4.1 Onboarding (pertama kali membuka aplikasi)
- 3–4 kartu singkat: apa itu aplikasi, fungsi tiap tab (usulan Najma: penjelasan fitur setelah buat akun), dan peran guru/pengrawit.
- **"Tantangan Gending Akhir"** (usulan Alvin): sebelum misi apa pun, siswa diberi pola target pendek yang diputar, lalu diminta menirunya di editor bebas. Hampir pasti belum berhasil → layar hasil: "Kamu belum bisa… ayo naik level" lalu menuju Misi. Wajib ada tombol **Coba dulu / Lewati**, dan umpan balik harus menyemangati (tidak ada kata "gagal"). **[ASUMSI]** efek motivasinya belum terbukti; ini hipotesis yang diuji.
- Tidak ada akun sungguhan: simpan nama panggilan + progres di localStorage.

### 4.2 Layar Editor (sketsa 1)
- Dua tab di atas: **Editor** dan **Output Gamelan**.
- Tab Editor: kanvas Blockly memenuhi layar, blok bertumpuk vertikal di kiri sesuai sketsa. Sketsa belum menggambar **palet blok** dan **tombol Mainkan** → tambahkan: palet sebagai bottom-sheet/drawer yang dibuka dari tombol "+ Blok", dan tombol ▶ Mainkan / ■ Berhenti yang selalu terlihat.
- Tab Output Gamelan: visual instrumen (bilah saron yang menyala saat dipukul, gong), blok yang sedang berjalan ter-highlight di editor, dan panel "Mode keluaran": **Simulasi Digital** (aktif) | **Gamelan Akustik (Simulasi)** (menampilkan log pesan yang akan dikirim ke pengendali; lihat 7.3).
- **Editor bebas selalu terbuka sejak awal** (tidak terkunci oleh level). Jika dibuka dari sebuah misi, editor memuat tujuan misi, pola target, tombol "Dengarkan target", dan petunjuk.

### 4.3 Layar Misi (sketsa 2)
- Daftar kartu vertikal, satu kartu per level Bloom: C1 Kenali Gamelan, C2 Pahami Polanya, C3 Susun Tabuhan, C4 Detektif Tabuhan, C5 Kurator Pola, C6 Ciptakan Gendingmu. (Label "Misi 1…" di sketsa adalah placeholder.)
- Tiap level punya tampilan sendiri (usulan Najma: satu level satu tampilan).
- Status kartu: belum dimulai / sedang / selesai, plus bintang atau indikator penguasaan.
- **Aturan akses — KEPUTUSAN TERBUKA, lihat bagian 10.** Default prototype: semua level bisa dibuka, urutan hanya "disarankan" (badge "Mulai dari sini"); tidak ada kunci.

## 5. Misi (Taksonomi Bloom revisi)
Tiap misi = tujuan, konteks budaya (1–2 kalimat), pola target, aktivitas, umpan balik. Untuk prototype, buat **1 misi contoh per level** (6 total) dan satu pola sederhana.

| Level | Nama | Aktivitas | Pemeriksaan otomatis |
|---|---|---|---|
| C1 | Kenali Gamelan | Cocokkan gambar instrumen ↔ nama ↔ bunyi | Pilihan benar/salah |
| C2 | Pahami Polanya | Susun potongan pola yang didengar; tandai bagian yang berulang | Urutan sama dengan pola |
| C3 | Susun Tabuhan | Susun blok agar menghasilkan pola target | Bandingkan daftar event dengan target |
| C4 | Detektif Tabuhan | Program berisi bug; temukan dan perbaiki | Hasil program == target |
| C5 | Kurator Pola | Bandingkan dua program, pilih yang sesuai kriteria + alasan | Pilihan sesuai kunci; alasan dipilih dari opsi |
| C6 | Ciptakan Gendingmu | Buat pola sendiri (ruang kreasi), beri judul + cerita inspirasi, simpan | Validasi minimal: tidak kosong, ≤ batas panjang |

**PENTING — integritas konten budaya:** pola tabuhan di prototype adalah **pola contoh/dummy** yang diberi label jelas "Contoh — belum divalidasi praktisi karawitan". Jangan mengarang atau mengklaim pola ini adalah gending/pola tradisi tertentu. Struktur data harus memungkinkan field `validatedBy` dan `sourceNote` (kosong dulu).

## 6. Blok koding
Gunakan blok bawaan Blockly yang relevan + blok kustom.

**Bawaan:** `ulangi n kali` (controls_repeat_ext), angka. Opsional untuk C4–C6: fungsi/prosedur ("Pola Saya": beri nama pola lalu panggil).
**Kustom (kategori "Gamelan", kunci bahasa Indonesia):**
- `tabuh [instrumen] nada [1|2|3|5|6]` — memukul satu bilah.
- `jeda [n] ketuk` — hening.
- `atur tempo [BPM]` — dibatasi rentang aman (mis. 40–140) **[ASUMSI]**.
- `gong` — pukulan gong (penanda akhir siklus; versi sederhana).
- Blok awal: `ketika ▶ ditekan` (hat block) sebagai titik mulai program.

Instrumen MVP: **Saron** (+ **Gong**). Demung/Peking boleh ditambahkan jika waktu cukup. Tangga nada MVP: **slendro**, notasi angka kepatihan (1 2 3 5 6; pada saron slendro bilah sering juga ada 1 oktaf atas — tampilkan sebagai 6-1-2-3-5-6-1 **[ASUMSI: bisa berbeda antar gamelan]**).

Warna blok: kelompokkan per kategori (Gamelan, Kontrol, Pola). Label blok harus bahasa anak-anak; hindari jargon.

## 7. Arsitektur teknis

### 7.1 Stack yang diminta
- Vite + TypeScript + React (atau vanilla TS jika lebih ringan), **Blockly** untuk editor, **Web Audio API** untuk suara, localStorage untuk progres. PWA opsional (nilai tambah, bukan syarat).
- Tanpa backend. Semua jalan di browser. Harus bisa di-deploy sebagai situs statis.

### 7.2 Model eksekusi (inti arsitektur)
Jangan memainkan suara langsung saat kode dijalankan. Pisahkan 3 tahap:
1. **Compile**: workspace Blockly → generator kustom → menjalankan program dalam sandbox dengan **jam virtual** yang mengumpulkan daftar event:
   `{ tMs, instrument, note, velocity, blockId }`
   (rekomendasi: jalankan kode hasil generator pada sandbox, mis. JS-Interpreter yang direkomendasikan dokumentasi Blockly untuk eksekusi terisolasi, atau fungsi terbatas tanpa akses global).
2. **Guard**: batas langkah dan batas jumlah event (mis. 2.000 event / 5.000 langkah **[ASUMSI]**) agar loop tak terbatas anak tidak membekukan browser; tampilkan pesan ramah jika terlampaui.
3. **Play**: `Scheduler` memutar daftar event lewat output yang dipilih, sambil meng-highlight `blockId` yang sedang berjalan.

### 7.3 Antarmuka output (agar hardware mudah disambung nanti)
```ts
interface GamelanOutput {
  play(events: GamelanEvent[]): Promise<void>;
  stop(): void;
}
// 1. DigitalSimOutput  — Web Audio + animasi bilah (aktif)
// 2. HardwareSimOutput — TIDAK ada hardware; hanya menulis log "pesan ke pengendali"
//    contoh baris: {"t":1200,"ch":3,"vel":90}  (ch = nomor aktuator/bilah)
//    lengkap dengan label "Simulasi — perangkat belum terhubung"
```
Ini yang dipakai untuk menjelaskan di esai: format event yang sama bisa dikirim ke mikrokontroler → driver solenoid → pemukul. Pemetaan ch→bilah dan lama pulsa solenoid adalah parameter perangkat keras yang **perlu diuji**; jangan ditampilkan sebagai angka final.

### 7.4 Suara
- Utamakan **sampel** rekaman bilah saron/gong bila tim punya rekaman sendiri atau berlisensi bebas (cek lisensi). Fallback: sintesis sederhana (beberapa osilator sinus + envelope peluruhan panjang) agar terdengar seperti logam.
- Gamelan tidak punya tala baku (tiap set unik), jadi frekuensi di simulasi hanyalah **pendekatan**; beri catatan di UI/Pengaturan: "Suara simulasi hanyalah pendekatan, bukan representasi penuh gamelan asli."
- Browser memblokir audio sebelum ada interaksi pengguna: aktifkan AudioContext saat tombol ▶ pertama ditekan.

### 7.5 Data
Misi, pola target, dan materi disimpan sebagai file JSON statis (`/src/content/*.json`) agar nanti mudah diganti oleh pengrawit tanpa menyentuh kode. Progres: `localStorage` (bungkus try/catch).

## 8. Kebutuhan non-fungsional
- Bahasa UI: Indonesia, kalimat pendek, ramah anak.
- Font besar, kontras baik, target sentuh ≥ 44 px; tombol selalu berikon + teks.
- Aksesibilitas dasar: visual bilah menyala mendampingi bunyi (tidak hanya mengandalkan suara).
- Performa: tetap lancar di tablet/HP menengah.
- Privasi: tidak mengirim data apa pun keluar perangkat; tidak ada analytics.
- Tidak ada fitur sosial/chat/iklan.

## 9. Kriteria penerimaan (Definition of Done prototype)
1. Siswa bisa menyusun `ketika ▶ ditekan → ulangi 4× [tabuh saron 1, tabuh saron 2, jeda 1]` lalu menekan ▶ dan **mendengar bunyi + melihat bilah menyala + blok ter-highlight** sesuai urutan.
2. Loop tak terbatas tidak membekukan aplikasi.
3. Enam misi contoh (C1–C6) bisa dibuka dan diselesaikan end-to-end; pemeriksaan otomatis bekerja.
4. Tab Output memiliki dua mode keluaran; mode Gamelan Akustik (Simulasi) menampilkan log pesan dengan label jelas bahwa perangkat belum terhubung.
5. Progres dan karya C6 tersimpan setelah refresh halaman.
6. Layout mengikuti sketsa: nav bawah 5 tab, tab aktif lebih besar, Editor dengan dua tab atas, Misi sebagai daftar kartu.
7. Label "contoh – belum divalidasi praktisi" muncul di semua pola.

## 10. Keputusan terbuka (harus diputuskan pemilik produk)
1. **Akses misi**: terkunci bertahap, dibuka semua tapi disarankan berurutan, atau campuran (editor bebas selalu terbuka; misi terbuka semua). *Default PRD: semua terbuka + urutan disarankan.* Esai harus diselaraskan dengan keputusan ini (naskah outline saat ini masih menulis level dibuka setelah kriteria penguasaan terpenuhi).
2. Fungsi tab Beranda/Belajar/Karyaku dan ikon kanan-atas (lihat 4).
3. Jenjang kelas target.
4. Sumber suara (sampel sendiri vs sintesis).
5. Siapa pengrawit/guru yang akan memvalidasi pola sebelum klaim budaya dipakai di esai.

## 11. Urutan pengerjaan (satu misi per prompt di Antigravity)
1. Scaffold proyek + routing + nav bawah 5 tab + tema (tanpa isi).
2. Editor Blockly + blok kustom + palet drawer + tombol Mainkan.
3. Compile → daftar event → guard + unit test sederhana untuk compiler.
4. `DigitalSimOutput` (suara + animasi bilah + highlight blok).
5. Layar Misi + JSON misi + pemeriksa hasil C1–C6.
6. Onboarding + Tantangan Gending Akhir.
7. `HardwareSimOutput` + panel log.
8. Poles: aksesibilitas, responsive tablet/laptop, PWA opsional.
