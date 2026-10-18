# Gamelan Koding — Milestone 7 & 8: HardwareSimOutput, Visualisasi Solenoid, Responsivitas & PWA

**Tanggal:** 2026-10-18  
**Status:** Approved by User  
**Scope:** Milestone 7 dan 8 dari `PRD_Gamelan_Koding.md` (Bagian 4.2, 7.3, 8, dan 11)  

---

## 1. Latar Belakang & Tujuan

Aplikasi Gamelan Koding dirancang bukan hanya sebagai lingkungan belajar koding virtual, melainkan sebagai **jembatan konsep menuju aktuasi fisik gamelan akustik**. Sebagaimana diuraikan dalam Bagian 7.3 PRD:
> *"Format event yang sama dapat dikirim ke mikrokontroler (ESP32/Arduino) → driver solenoid → pemukul fisik pada bilah saron dan gong nyata."*

**Tujuan Milestone 7:**
1. Menyediakan engine `HardwareSimOutput` yang mengimplementasikan interface `GamelanOutput`.
2. Menerjemahkan urutan `GamelanEvent[]` hasil kompilasi visual Blockly menjadi paket serial pengendali mikrokontroler (JSON dan Hex Bytecode).
3. Menyediakan visualisasi solenoid aktuator interaktif di atas bilah saron dan gong pada tab **Output Gamelan**.
4. Menyediakan panel log serial real-time dengan tombol salin/ekspor payload untuk pengujian simulasi hardware (Wokwi / Arduino Serial Monitor).
5. Menyertakan label wajib PRD: *"Simulasi — Perangkat Belum Terhubung"* dan penjelasan bahwa durasi pulsa solenoid merupakan parameter mekanik yang perlu diuji.

**Tujuan Milestone 8:**
1. Menyempurnakan responsivitas lintas resolusi: ponsel portrait (sketsa dasar), tablet portrait/landscape, dan desktop.
2. Memastikan aksesibilitas ramah anak: ukuran sentuh minimal 44px, kontras tinggi, feedback visual bilah menyala menyertai bunyi.
3. Menambahkan konfigurasi Progressive Web App (PWA) dasar (`manifest.json` dan offline cache) agar aplikasi dapat didemokan tanpa hambatan koneksi internet saat presentasi lomba.

---

## 2. Arsitektur Teknis

### 2.1 Pemetaan Kanal Aktuator Solenoid (Hardware Channel Mapping)
Sistem memetakan nada slendro dan gong ke nomor kanal mikrokontroler (*Channel* / CH):

| Bilah / Instrumen | Notasi Kepatihan | Frekuensi Acuan (Hz) | Kanal Solenoid (CH) | Keterangan |
| :--- | :---: | :---: | :---: | :--- |
| Saron Slendro | 6 (nem rendah) | 275 | CH 1 | Solenoid pemukul bilah 1 |
| Saron Slendro | 1 (ji) | 300 | CH 2 | Solenoid pemukul bilah 2 |
| Saron Slendro | 2 (ro) | 337 | CH 3 | Solenoid pemukul bilah 3 |
| Saron Slendro | 3 (lu) | 375 | CH 4 | Solenoid pemukul bilah 4 |
| Saron Slendro | 5 (ma) | 425 | CH 5 | Solenoid pemukul bilah 5 |
| Saron Slendro | 6' (nem tinggi) | 480 | CH 6 | Solenoid pemukul bilah 6 |
| Saron Slendro | 1' (ji tinggi) | 535 | CH 7 | Solenoid pemukul bilah 7 |
| Gong Ageng | Gong | 55 (ombak) | CH 8 | Solenoid berujung karet peredam |

### 2.2 Format Paket Data Serial
Tersedia dua format data serial untuk menjelaskan arsitektur sistem pada lomba esai:

1. **Format JSON (Human-Readable & WebSockets / Web Serial / MQTT):**
   ```json
   {"t": 1200, "ch": 3, "vel": 90, "pulseMs": 35}
   ```
   - `t`: Waktu milidetik relatif sejak program dimulai.
   - `ch`: Nomor kanal aktuator (1–8).
   - `vel`: Nilai kecepatan/kekuatan tabuhan (0–127).
   - `pulseMs`: Durasi sinyal pulsa solenoid aktif (default: 35 ms, dapat diubah 20–60 ms).

2. **Format Bytecode Biner (Hemat Bandwidth UART 115200 bps):**
   ```text
   0xAA [Header] | 0x03 [Channel] | 0x5A [Velocity 90] | 0x23 [Pulse 35ms] | 0xFE [Footer]
   ```

### 2.3 Antarmuka `HardwareSimOutput`
Mengimplementasikan interface `GamelanOutput` dari `src/types/gamelan.ts`:
```typescript
export interface HardwareLogEntry {
  id: string;
  t: number;
  ch: number;
  noteLabel: string;
  vel: number;
  pulseMs: number;
  rawHex: string;
  timestamp: string;
}

export class HardwareSimOutput implements GamelanOutput {
  private isRunning: boolean = false;
  private currentTimeoutIds: number[] = [];
  private onLogListener?: (log: HardwareLogEntry) => void;
  private onActuatorTrigger?: (ch: number, pulseMs: number) => void;

  play(events: GamelanEvent[]): Promise<void>;
  stop(): void;
  setOnLog(cb: (log: HardwareLogEntry) => void): void;
  setOnActuatorTrigger(cb: (ch: number, pulseMs: number) => void): void;
}
```

---

## 3. Komponen Antarmuka (UI/UX)

### 3.1 Visualisasi Solenoid Aktuator (`HardwareVisualizer.tsx`)
- Ditempatkan di tab **Output Gamelan** saat mode **Gamelan Akustik** dipilih.
- Menampilkan ilustrasi 7 modul solenoid di atas masing-masing bilah saron + 1 modul solenoid di atas Gong.
- Setiap modul menampilkan:
  - Label pin kanal (misal: `PIN D1 / CH 3`).
  - Animasi fisik batang solenoid yang turun menyentuh bilah (*punch stroke*) selama `pulseMs` lalu kembali ke posisi istirahat (*retract*).
  - Indikator LED pulsa (menyala oranye terang saat pulsa HIGH).

### 3.2 Terminal Log Serial Pengendali (`HardwareSerialTerminal.tsx`)
- Tampilan dark-theme dengan tipografi monospace (`Consolas, monospace`).
- Header terminal:
  - Indikator Status: `Status: Simulasi Berjalan (115200 baud)` atau `Standby`.
  - Pilihan Format Log: Toggle `JSON` vs `Hex Bytecode`.
  - Tombol Salin Log (`Salin JSON`).
  - Tombol Bersihkan Log.
- Baris log ter-highlight secara real-time saat event dieksekusi.
- Banner peringatan standar PRD:
  > *"Simulasi — Perangkat Belum Terhubung: Log ini mendemonstrasikan protokol komunikasi mikrokontroler jika aplikasi disambungkan ke aktuator solenoid fisik."*

### 3.3 Pemolesan Responsivitas & PWA (Milestone 8)
- **Viewport & Padding Dynamic**: Menjamin tidak ada kartu atau tombol terpotong pada berbagai tinggi layar (600px s.d. 1080px).
- **Aksesibilitas Kontras & Sentuhan**: Semua tombol interaktif berukuran minimal `44px` dengan kontras WCAG AA.
- **PWA Manifest & Service Worker**:
  - `manifest.webmanifest`: Nama `Gamelan Koding`, warna tema hijau gamelan (`#059669`), ikon aplikasi.
  - Registrasi service worker dasar untuk caching asset bundle dan audio lokal.

---

## 4. Rencana Pengujian Otomatis

1. **Unit Test `hardwareSimOutput.test.ts`**:
   - Memvalidasi pemetaan `GamelanEvent` ke nomor kanal CH 1–8.
   - Memvalidasi pembentukan paket JSON dan string Hex Bytecode.
   - Menguji eksekusi `play()` dan `stop()` tanpa memory leak atau timer gantung.
2. **Integration Test Suite**:
   - Memverifikasi pergantian mode di `EditorPage` antara `DigitalSimOutput` dan `HardwareSimOutput`.
   - Menjalankan seluruh test suite (`npx vitest run`) dan build produksi (`npm run build`).

---

## 5. Kepatuhan Nilai Budaya & Pedoman
- Setiap pola tabuhan tetap menyertakan disclaimer: *"Contoh — belum divalidasi praktisi karawitan"*.
- Penjelasan solenoid menekankan bahwa aktuasi mekanik adalah alat bantu belajar dan pelestarian, bukan pengganti estetika rasa penabuh manusia.
- Nol penggunaan kata "gagal" pada umpan balik antarmuka.
