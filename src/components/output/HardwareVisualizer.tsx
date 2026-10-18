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
        background: 'var(--text-primary)',
        borderRadius: 'var(--radius-card)',
        padding: '16px',
        color: '#f8fafc',
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
              borderRadius: 'var(--radius-squircle)',
              background: 'var(--color-pink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Cpu size={18} color="var(--text-primary)" />
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
          <span>{activeChannel !== null ? `CH ${activeChannel} AKTIF` : 'STANDBY'}</span>
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
