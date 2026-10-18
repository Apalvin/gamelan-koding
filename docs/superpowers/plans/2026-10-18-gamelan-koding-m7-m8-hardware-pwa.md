# Gamelan Koding (Milestone 7 & 8) Implementation Plan: HardwareSimOutput, Visualisasi Solenoid, Responsivitas & PWA

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun engine `HardwareSimOutput` yang mengimplementasikan `GamelanOutput`, visualisasi aktuator solenoid di atas bilah saron dan gong, terminal log serial mikrokontroler (JSON & Hex Bytecode), integrasi mode keluaran di Editor, serta pemolesan responsivitas, aksesibilitas, dan PWA offline.

**Architecture:** Menerapkan model keluaran terpisah PRD Bagian 7.3. `HardwareSimOutput` mengonversi `GamelanEvent[]` hasil kompilasi blok menjadi paket instruksi aktuator solenoid (CH 1–8, velocity, pulseMs). Tab Output menampilkan visualisasi fisik modul solenoid yang memukul bilah saron dan gong secara real-time tersinkronisasi dengan terminal log serial dark-mode. Di Milestone 8, layout dioptimasi untuk tablet/desktop/mobile, aksesibilitas WCAG AA, dan manifest PWA offline.

**Tech Stack:** React, TypeScript, Vite, Vitest, Lucide React, Web Audio API.

## Global Constraints

- Zero instances of the word "gagal" in child-facing copy.
- Cultural disclaimer on all patterns: `"Contoh — belum divalidasi praktisi karawitan"`.
- Hardware simulation disclaimer: `"Simulasi — Perangkat Belum Terhubung"`.
- Minimum touch target >= 44px on all interactive buttons.
- On Windows PowerShell, use `cmd /c "..."` for terminal executions.

---

### Task 1: Engine `HardwareSimOutput` & Unit Test

**Files:**
- Create: `src/audio/hardwareSimOutput.ts`
- Create: `tests/audio/hardwareSimOutput.test.ts`
- Modify: `src/types/gamelan.ts`

**Interfaces:**
- Produces:
  ```typescript
  export interface HardwarePacket {
    t: number;
    ch: number; // 1-7 (saron notes 6,1,2,3,5,6',1'), 8 (gong)
    noteLabel: string;
    vel: number;
    pulseMs: number;
    rawHex: string;
  }
  export class HardwareSimOutput implements GamelanOutput {
    play(events: GamelanEvent[]): Promise<void>;
    stop(): void;
    setPulseDuration(ms: number): void;
    getPulseDuration(): number;
    setOnPacketEmit(cb: ((packet: HardwarePacket) => void) | null): void;
    setOnStop(cb: (() => void) | null): void;
    convertToPackets(events: GamelanEvent[], pulseMs?: number): HardwarePacket[];
  }
  export const hardwareSimOutput: HardwareSimOutput;
  ```

- [ ] **Step 1: Tulis unit test yang memvalidasi mapping kanal solenoid dan konversi paket serial**

Buat file `tests/audio/hardwareSimOutput.test.ts`:
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HardwareSimOutput } from '../../src/audio/hardwareSimOutput';
import { GamelanEvent } from '../../src/types/gamelan';

describe('HardwareSimOutput', () => {
  let hw: HardwareSimOutput;

  beforeEach(() => {
    hw = new HardwareSimOutput();
  });

  it('harus memetakan nada slendro saron ke nomor kanal solenoid CH 1 s.d. CH 7 dengan benar', () => {
    const events: GamelanEvent[] = [
      { tMs: 0, instrument: 'saron', note: '6', velocity: 90 },
      { tMs: 500, instrument: 'saron', note: '1', velocity: 95 },
      { tMs: 1000, instrument: 'saron', note: '2', velocity: 90 },
      { tMs: 1500, instrument: 'saron', note: '3', velocity: 90 },
      { tMs: 2000, instrument: 'saron', note: '5', velocity: 90 },
      { tMs: 2500, instrument: 'saron', note: "6'", velocity: 90 },
      { tMs: 3000, instrument: 'saron', note: "1'", velocity: 90 },
    ];

    const packets = hw.convertToPackets(events, 35);
    expect(packets).toHaveLength(7);
    expect(packets[0].ch).toBe(1);
    expect(packets[1].ch).toBe(2);
    expect(packets[2].ch).toBe(3);
    expect(packets[3].ch).toBe(4);
    expect(packets[4].ch).toBe(5);
    expect(packets[5].ch).toBe(6);
    expect(packets[6].ch).toBe(7);
  });

  it('harus memetakan instrumen gong ke kanal solenoid CH 8', () => {
    const events: GamelanEvent[] = [
      { tMs: 1000, instrument: 'gong', velocity: 110 },
    ];

    const packets = hw.convertToPackets(events, 45);
    expect(packets).toHaveLength(1);
    expect(packets[0].ch).toBe(8);
    expect(packets[0].noteLabel).toBe('GONG');
    expect(packets[0].pulseMs).toBe(45);
    expect(packets[0].rawHex).toBe('0xAA 0x08 0x6E 0x2D 0xFE');
  });

  it('harus menghentikan semua timer penjadwalan saat stop() dipanggil', () => {
    vi.useFakeTimers();
    const emitSpy = vi.fn();
    hw.setOnPacketEmit(emitSpy);

    const events: GamelanEvent[] = [
      { tMs: 100, instrument: 'saron', note: '1', velocity: 90 },
      { tMs: 500, instrument: 'saron', note: '2', velocity: 90 },
    ];

    hw.play(events);
    vi.advanceTimersByTime(150);
    expect(emitSpy).toHaveBeenCalledTimes(1);

    hw.stop();
    vi.advanceTimersByTime(600);
    expect(emitSpy).toHaveBeenCalledTimes(1); // tidak bertambah karena sudah stop
    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Jalankan test dan pastikan gagal karena file `hardwareSimOutput.ts` belum ada**

Run: `cmd /c "npx vitest run tests/audio/hardwareSimOutput.test.ts"`  
Expected: FAIL dengan `Cannot find module '../../src/audio/hardwareSimOutput'`

- [ ] **Step 3: Implementasikan `src/audio/hardwareSimOutput.ts`**

Buat file `src/audio/hardwareSimOutput.ts`:
```typescript
import { GamelanEvent, GamelanOutput, SlendroNote } from '../types/gamelan';

export interface HardwarePacket {
  t: number;
  ch: number; // 1-7 (saron), 8 (gong)
  noteLabel: string;
  vel: number;
  pulseMs: number;
  rawHex: string;
}

export const SLENDRO_NOTE_TO_CHANNEL: Record<string, number> = {
  '6': 1,
  '1': 2,
  '2': 3,
  '3': 4,
  '5': 5,
  "6'": 6,
  "1'": 7,
};

export class HardwareSimOutput implements GamelanOutput {
  private isRunning: boolean = false;
  private timerIds: number[] = [];
  private pulseDurationMs: number = 35;
  private onPacketEmitCallback: ((packet: HardwarePacket) => void) | null = null;
  private onStopCallback: (() => void) | null = null;

  public setPulseDuration(ms: number): void {
    this.pulseDurationMs = Math.max(10, Math.min(100, ms));
  }

  public getPulseDuration(): number {
    return this.pulseDurationMs;
  }

  public setOnPacketEmit(cb: ((packet: HardwarePacket) => void) | null): void {
    this.onPacketEmitCallback = cb;
  }

  public setOnStop(cb: (() => void) | null): void {
    this.onStopCallback = cb;
  }

  public mapEventToChannel(event: GamelanEvent): { ch: number; label: string } {
    if (event.instrument === 'gong') {
      return { ch: 8, label: 'GONG' };
    }
    const noteKey = String(event.note ?? '1');
    const ch = SLENDRO_NOTE_TO_CHANNEL[noteKey] ?? 2;
    return { ch, label: noteKey };
  }

  public formatHexPacket(ch: number, vel: number, pulseMs: number): string {
    const toHex = (n: number) => '0x' + n.toString(16).toUpperCase().padStart(2, '0');
    return `${toHex(0xAA)} ${toHex(ch)} ${toHex(vel)} ${toHex(pulseMs)} ${toHex(0xFE)}`;
  }

  public convertToPackets(events: GamelanEvent[], customPulseMs?: number): HardwarePacket[] {
    const pulse = customPulseMs ?? this.pulseDurationMs;
    return events.map((ev) => {
      const { ch, label } = this.mapEventToChannel(ev);
      const vel = Math.max(0, Math.min(127, Math.round(ev.velocity || 90)));
      return {
        t: ev.tMs,
        ch,
        noteLabel: label,
        vel,
        pulseMs: pulse,
        rawHex: this.formatHexPacket(ch, vel, pulse),
      };
    });
  }

  public async play(events: GamelanEvent[]): Promise<void> {
    this.stop();
    if (!events || events.length === 0) return;

    this.isRunning = true;
    const packets = this.convertToPackets(events);
    const maxT = Math.max(...packets.map((p) => p.t)) + this.pulseDurationMs + 200;

    packets.forEach((packet) => {
      const tid = window.setTimeout(() => {
        if (!this.isRunning) return;
        this.onPacketEmitCallback?.(packet);
      }, packet.t);
      this.timerIds.push(tid);
    });

    // Timer akhir simulasi
    const endTid = window.setTimeout(() => {
      this.stop();
    }, maxT);
    this.timerIds.push(endTid);
  }

  public stop(): void {
    this.isRunning = false;
    this.timerIds.forEach((id) => clearTimeout(id));
    this.timerIds = [];
    this.onStopCallback?.();
  }
}

export const hardwareSimOutput = new HardwareSimOutput();
```

- [ ] **Step 4: Jalankan test dan pastikan semua test di `hardwareSimOutput.test.ts` lulus**

Run: `cmd /c "npx vitest run tests/audio/hardwareSimOutput.test.ts"`  
Expected: PASS (3 tests passed)

- [ ] **Step 5: Commit hasil Task 1 ke git**

Run:
```bash
git add src/audio/hardwareSimOutput.ts tests/audio/hardwareSimOutput.test.ts
git commit -m "feat(hardware): implement HardwareSimOutput engine and channel mapping"
```

---

### Task 2: Komponen Visual Solenoid Aktuator (`HardwareVisualizer.tsx`)

**Files:**
- Create: `src/components/output/HardwareVisualizer.tsx`

**Interfaces:**
- Produces:
  ```typescript
  interface HardwareVisualizerProps {
    activeChannel: number | null; // 1-8
    pulseDurationMs?: number;
  }
  export const HardwareVisualizer: React.FC<HardwareVisualizerProps>;
  ```

- [ ] **Step 1: Buat komponen `HardwareVisualizer.tsx` dengan representasi modul fisik solenoid, pin mikrokontroler, dan animasi pukulan**

Isi file `src/components/output/HardwareVisualizer.tsx`:
```tsx
import React from 'react';
import { Cpu, Zap } from 'lucide-react';

interface HardwareVisualizerProps {
  activeChannel: number | null; // 1-8
  pulseDurationMs?: number;
}

interface SolenoidModule {
  ch: number;
  pin: string;
  noteLabel: string;
  name: string;
  freq: string;
}

const SOLENOID_MODULES: SolenoidModule[] = [
  { ch: 1, pin: 'D1', noteLabel: '6', name: 'Nem Low', freq: '275Hz' },
  { ch: 2, pin: 'D2', noteLabel: '1', name: 'Ji', freq: '300Hz' },
  { ch: 3, pin: 'D3', noteLabel: '2', name: 'Ro', freq: '337Hz' },
  { ch: 4, pin: 'D4', noteLabel: '3', name: 'Lu', freq: '375Hz' },
  { ch: 5, pin: 'D5', noteLabel: '5', name: 'Ma', freq: '425Hz' },
  { ch: 6, pin: 'D6', noteLabel: "6'", name: 'Nem High', freq: '480Hz' },
  { ch: 7, pin: 'D7', noteLabel: "1'", name: 'Ji High', freq: '535Hz' },
  { ch: 8, pin: 'D8', noteLabel: 'GONG', name: 'Gong Ageng', freq: '55Hz' },
];

export const HardwareVisualizer: React.FC<HardwareVisualizerProps> = ({
  activeChannel,
  pulseDurationMs = 35,
}) => {
  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: 20,
        padding: '16px',
        color: '#f8fafc',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Header Visualizer Solenoid */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Cpu size={18} color="white" />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800 }}>
              Simulasi Aktuator Solenoid Fisik
            </h4>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              8 Kanal Driver Relay / MOSFET • Durasi Pulsa: {pulseDurationMs} ms
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 8px',
            borderRadius: 999,
            background: activeChannel !== null ? '#f59e0b' : '#334155',
            color: activeChannel !== null ? '#78350f' : '#94a3b8',
            fontSize: '0.72rem',
            fontWeight: 800,
            transition: 'all 0.15s ease',
          }}
        >
          <Zap size={12} fill="currentColor" />
          <span>{activeChannel !== null ? `CH ${activeChannel} ACTIVE` : 'IDLE'}</span>
        </div>
      </div>

      {/* Grid Aktuator Solenoid 7 Bilah Saron + 1 Gong */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
        }}
      >
        {SOLENOID_MODULES.map((mod) => {
          const isActive = activeChannel === mod.ch;
          return (
            <div
              key={mod.ch}
              style={{
                background: isActive ? '#fef3c7' : '#1e293b',
                border: isActive ? '2px solid #f59e0b' : '1.5px solid #334155',
                borderRadius: 12,
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                position: 'relative',
                transform: isActive ? 'scale(1.02)' : 'none',
                transition: 'all 0.12s ease',
              }}
            >
              {/* Header Modul (PIN & Channel) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    color: isActive ? '#b45309' : '#38bdf8',
                    fontFamily: 'Consolas, monospace',
                  }}
                >
                  {mod.pin}
                </span>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: isActive ? '#ef4444' : '#475569',
                    boxShadow: isActive ? '0 0 8px #ef4444' : 'none',
                  }}
                />
              </div>

              {/* Batang Solenoid Fisik (Animasi Naik-Turun) */}
              <div
                style={{
                  height: 36,
                  background: isActive ? '#fde68a' : '#0f172a',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #475569',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Plunger / Batang Solenoid */}
                <div
                  style={{
                    width: 14,
                    height: isActive ? 32 : 18,
                    background: isActive ? '#ea580c' : '#94a3b8',
                    borderRadius: '2px 2px 4px 4px',
                    transition: 'height 0.08s ease',
                    boxShadow: isActive ? '0 2px 8px rgba(234, 88, 12, 0.5)' : 'none',
                  }}
                />
              </div>

              {/* Keterangan Nada Bilah */}
              <div style={{ textAlign: 'center', marginTop: 2 }}>
                <div
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    color: isActive ? '#78350f' : '#f8fafc',
                  }}
                >
                  {mod.noteLabel}
                </div>
                <div style={{ fontSize: '0.64rem', color: isActive ? '#92400e' : '#64748b' }}>
                  {mod.freq}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', fontStyle: 'italic' }}>
        *Animasi batang solenoid turun memukul bilah saron/gong berdasarkan sinyal pulsa digital TTL (5V/12V).
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Jalankan build untuk verifikasi sintaksis React**

Run: `cmd /c "npm run build"`  
Expected: PASS

- [ ] **Step 3: Commit Task 2 ke git**

Run:
```bash
git add src/components/output/HardwareVisualizer.tsx
git commit -m "feat(hardware): create HardwareVisualizer solenoid animation component"
```

---

### Task 3: Komponen Terminal Serial Mikrokontroler (`HardwareSerialTerminal.tsx`)

**Files:**
- Create: `src/components/output/HardwareSerialTerminal.tsx`
- Modify: `src/components/output/HardwareSimulationPanel.tsx`

**Interfaces:**
- Produces:
  ```typescript
  interface HardwareSerialTerminalProps {
    packets: HardwarePacket[];
    latestPacket: HardwarePacket | null;
    pulseDurationMs: number;
    onPulseDurationChange: (ms: number) => void;
    onClearLogs: () => void;
  }
  export const HardwareSerialTerminal: React.FC<HardwareSerialTerminalProps>;
  ```

- [ ] **Step 1: Buat `HardwareSerialTerminal.tsx` lengkap dengan toggle JSON/Bytecode dan tombol Salin Log**

Isi file `src/components/output/HardwareSerialTerminal.tsx`:
```tsx
import React, { useState } from 'react';
import { Terminal, Copy, Check, Trash2, Sliders, AlertCircle } from 'lucide-react';
import { HardwarePacket } from '../../audio/hardwareSimOutput';

interface HardwareSerialTerminalProps {
  packets: HardwarePacket[];
  latestPacket: HardwarePacket | null;
  pulseDurationMs: number;
  onPulseDurationChange: (ms: number) => void;
  onClearLogs: () => void;
}

export const HardwareSerialTerminal: React.FC<HardwareSerialTerminalProps> = ({
  packets,
  latestPacket,
  pulseDurationMs,
  onPulseDurationChange,
  onClearLogs,
}) => {
  const [format, setFormat] = useState<'json' | 'hex'>('json');
  const [copied, setCopied] = useState(false);

  const handleCopyLogs = () => {
    let text = '';
    if (format === 'json') {
      text = JSON.stringify(
        packets.map((p) => ({
          t: p.t,
          ch: p.ch,
          note: p.noteLabel,
          vel: p.vel,
          pulseMs: p.pulseMs,
        })),
        null,
        2
      );
    } else {
      text = packets.map((p) => p.rawHex).join('\n');
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: '#0f172a',
        borderRadius: 16,
        padding: '14px',
        border: '1.5px solid #334155',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontFamily: 'Consolas, monospace',
      }}
    >
      {/* Top Bar Terminal: Judul, Format Toggle & Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
          borderBottom: '1px solid #1e293b',
          paddingBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Terminal size={16} color="#38bdf8" />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8' }}>
            Serial Monitor UART • 115200 Baud
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Toggle JSON / Hex */}
          <div style={{ display: 'flex', background: '#1e293b', borderRadius: 8, padding: 2 }}>
            <button
              type="button"
              onClick={() => setFormat('json')}
              style={{
                background: format === 'json' ? '#0284c7' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '2px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              JSON
            </button>
            <button
              type="button"
              onClick={() => setFormat('hex')}
              style={{
                background: format === 'hex' ? '#0284c7' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '2px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Bytecode Hex
            </button>
          </div>

          {/* Tombol Salin Log */}
          <button
            type="button"
            onClick={handleCopyLogs}
            disabled={packets.length === 0}
            style={{
              background: copied ? '#059669' : '#1e293b',
              color: 'white',
              border: '1px solid #475569',
              borderRadius: 8,
              padding: '4px 10px',
              fontSize: '0.72rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              cursor: packets.length === 0 ? 'not-allowed' : 'pointer',
              opacity: packets.length === 0 ? 0.5 : 1,
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span>{copied ? 'Tersalin!' : 'Salin Log'}</span>
          </button>

          {/* Tombol Hapus Log */}
          <button
            type="button"
            onClick={onClearLogs}
            disabled={packets.length === 0}
            style={{
              background: '#1e293b',
              color: '#94a3b8',
              border: '1px solid #475569',
              borderRadius: 8,
              padding: '4px 8px',
              cursor: packets.length === 0 ? 'not-allowed' : 'pointer',
              opacity: packets.length === 0 ? 0.5 : 1,
            }}
            aria-label="Bersihkan log"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Pengatur Durasi Pulsa Solenoid */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#1e293b',
          padding: '8px 12px',
          borderRadius: 10,
          fontSize: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1' }}>
          <Sliders size={14} color="#f59e0b" />
          <span>Kalibrasi Pulsa Solenoid:</span>
          <strong style={{ color: '#f59e0b' }}>{pulseDurationMs} ms</strong>
        </div>
        <input
          type="range"
          min="15"
          max="80"
          step="5"
          value={pulseDurationMs}
          onChange={(e) => onPulseDurationChange(Number(e.target.value))}
          style={{ width: 110, accentColor: '#f59e0b', cursor: 'pointer' }}
        />
      </div>

      {/* Kotak Teks Log Aliran Serial */}
      <div
        style={{
          height: 140,
          overflowY: 'auto',
          background: '#020617',
          padding: '8px 10px',
          borderRadius: 10,
          border: '1px solid #1e293b',
          fontSize: '0.74rem',
          lineHeight: 1.6,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {packets.length === 0 ? (
          <div style={{ color: '#475569', fontStyle: 'italic', padding: 8 }}>
            // Belum ada data serial. Tekan tombol ▶ Mainkan di Editor untuk mengirim instruksi.
          </div>
        ) : (
          packets.map((pkt, idx) => {
            const isLatest = latestPacket?.t === pkt.t && latestPacket?.ch === pkt.ch;
            return (
              <div
                key={idx}
                style={{
                  color: isLatest
                    ? '#38bdf8'
                    : pkt.ch === 8
                    ? '#facc15'
                    : '#94a3b8',
                  fontWeight: isLatest ? 800 : 500,
                  background: isLatest ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  padding: '1px 4px',
                  borderRadius: 4,
                }}
              >
                {format === 'json' ? (
                  <span>
                    &gt; {JSON.stringify({ t: pkt.t, ch: pkt.ch, vel: pkt.vel, pulseMs: pkt.pulseMs })}
                  </span>
                ) : (
                  <span>&gt; {pkt.rawHex}</span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Label Peringatan Baku PRD 7.3 */}
      <div
        style={{
          background: '#fffbeb',
          border: '1.5px solid #f59e0b',
          borderRadius: 10,
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: '#92400e',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <AlertCircle size={16} color="#d97706" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.72rem', lineHeight: 1.35 }}>
          <strong>Simulasi — Perangkat Belum Terhubung:</strong> Format serial ini disiapkan agar mikrokontroler (ESP32/Arduino) dapat menggerakkan aktuator pemukul solenoid fisik pada gamelan nyata.
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Modifikasi `HardwareSimulationPanel.tsx` untuk mengintegrasikan `HardwareVisualizer` dan `HardwareSerialTerminal`**

Update `src/components/output/HardwareSimulationPanel.tsx` untuk menampilkan kedua komponen baru saat mode `hardware` dipilih.

- [ ] **Step 3: Jalankan `npm run build` untuk memverifikasi tidak ada error tipe TypeScript**

Run: `cmd /c "npm run build"`  
Expected: PASS

- [ ] **Step 4: Commit Task 3 ke git**

Run:
```bash
git add src/components/output/HardwareSerialTerminal.tsx src/components/output/HardwareSimulationPanel.tsx
git commit -m "feat(hardware): integrate HardwareSerialTerminal and interactive solenoid controls"
```

---

### Task 4: Integrasi Mode Output di `EditorPage.tsx`

**Files:**
- Modify: `src/pages/EditorPage.tsx`

**Interfaces:**
- Consumes:
  - `hardwareSimOutput` from `src/audio/hardwareSimOutput.ts`
  - `digitalSimOutput` from `src/audio/digitalSimOutput.ts`
- Produces:
  - Saat `outputMode === 'digital'`, tombol Play menjalankan audio Web Audio & visual saron.
  - Saat `outputMode === 'hardware'`, tombol Play menjalankan `hardwareSimOutput` (memancarkan paket serial real-time dan mengaktifkan solenoid visualizer).

- [ ] **Step 1: Sambungkan `hardwareSimOutput` ke handler `handleTogglePlay` dan `stopPlayback` di `EditorPage.tsx`**

Perbarui `EditorPage.tsx`:
1. Tambahkan state `activeHardwareChannel: number | null` dan `streamedPackets: HardwarePacket[]`.
2. Pada `handleTogglePlay`, jika `outputMode === 'hardware'`, panggil `hardwareSimOutput.play(result.events)` dan tangkap paket yang di-emit untuk menggerakkan visualizer solenoid.
3. Pada `stopPlayback`, panggil `hardwareSimOutput.stop()` dan `digitalSimOutput.stop()`.
4. Berikan props ke `HardwareSimulationPanel`.

- [ ] **Step 2: Jalankan unit test komprehensif**

Run: `cmd /c "npx vitest run"`  
Expected: All tests pass.

- [ ] **Step 3: Commit Task 4 ke git**

Run:
```bash
git add src/pages/EditorPage.tsx
git commit -m "feat(editor): connect hardware output mode to play and stop playback lifecycle"
```

---

### Task 5: Milestone 8 — Pemolesan Responsivitas & Aksesibilitas

**Files:**
- Modify: `src/index.css`
- Modify: `src/components/layout/BottomNavigation.tsx`
- Modify: `src/components/layout/AppHeader.tsx`
- Modify: `src/components/output/GamelanVisualizer.tsx`

- [ ] **Step 1: Periksa ukuran target sentuh (touch target >= 44px) dan kontras warna**

Pastikan semua tombol navigasi bawah, tombol toolbar editor, dan tombol modal memiliki `minHeight: 44` / `minWidth: 44` dan atribut `aria-label` yang lengkap.

- [ ] **Step 2: Pastikan tidak ada tombol atau kartu yang terpotong pada resolusi tablet/laptop dan portrait mobile**

Tambahkan aturan responsive CSS di `src/index.css` untuk menangani layar sempit (<360px) dan layar lebar (>768px).

- [ ] **Step 3: Verifikasi build dan test**

Run: `cmd /c "npm run build"`  
Expected: PASS

- [ ] **Step 4: Commit Task 5 ke git**

Run:
```bash
git add src/index.css src/components/layout/BottomNavigation.tsx src/components/layout/AppHeader.tsx
git commit -m "style(a11y): optimize responsiveness and touch target compliance for multi-device"
```

---

### Task 6: Milestone 8 — Progressive Web App (PWA) Offline Manifest

**Files:**
- Create: `public/manifest.webmanifest`
- Modify: `index.html`

- [ ] **Step 1: Buat file `public/manifest.webmanifest`**

```json
{
  "name": "Gamelan Koding",
  "short_name": "GamelanKoding",
  "description": "Aplikasi belajar koding berbasis blok dengan tabuhan karawitan Jawa laras slendro untuk siswa SD.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#059669",
  "icons": [
    {
      "src": "/favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ]
}
```

- [ ] **Step 2: Sambungkan manifest di `index.html`**

Tambahkan `<link rel="manifest" href="/manifest.webmanifest" />` dan meta tag `theme-color` di `index.html`.

- [ ] **Step 3: Jalankan build produksi dan seluruh unit test suite**

Run: `cmd /c "npm run build"`  
Run: `cmd /c "npx vitest run"`  
Expected: 100% build & test pass tanpa error.

- [ ] **Step 4: Commit Task 6 ke git dan push ke remote**

Run:
```bash
git add public/manifest.webmanifest index.html
git commit -m "feat(pwa): add PWA webmanifest and offline-ready metadata"
git push origin main
```
