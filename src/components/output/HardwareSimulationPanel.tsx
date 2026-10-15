import React, { useState } from 'react';
import { Cpu, Monitor, AlertCircle, Terminal, Play } from 'lucide-react';
import { HardwareSimLog } from '../../types/gamelan';

export type OutputMode = 'digital' | 'hardware';

interface HardwareSimulationPanelProps {
  mode: OutputMode;
  onModeChange: (mode: OutputMode) => void;
}

export const HardwareSimulationPanel: React.FC<HardwareSimulationPanelProps> = ({
  mode,
  onModeChange,
}) => {
  const [logs, setLogs] = useState<HardwareSimLog[]>([
    { t: 0, ch: 1, vel: 90 },
    { t: 500, ch: 2, vel: 90 },
    { t: 1000, ch: 3, vel: 95 },
    { t: 1500, ch: 5, vel: 90 },
    { t: 2000, ch: 99, vel: 120 }, // 99 = gong
  ]);

  const handleAddSampleLog = () => {
    const nextT = logs.length > 0 ? logs[logs.length - 1].t + 500 : 0;
    const randomCh = [1, 2, 3, 5, 6, 99][Math.floor(Math.random() * 6)];
    setLogs((prev) => [...prev.slice(-9), { t: nextT, ch: randomCh, vel: 95 }]);
  };

  return (
    <div style={{ background: 'white', borderRadius: 18, padding: 16, border: '2px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Selector Mode Keluaran */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>
          Mode Keluaran Tabuhan
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => onModeChange('digital')}
            style={{
              flex: 1,
              minHeight: 44,
              borderRadius: 12,
              border: mode === 'digital' ? '2px solid #10b981' : '2px solid #e2e8f0',
              background: mode === 'digital' ? '#ecfdf5' : '#f8fafc',
              color: mode === 'digital' ? '#065f46' : '#64748b',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <Monitor size={16} />
            <span>Simulasi Digital</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('hardware')}
            style={{
              flex: 1,
              minHeight: 44,
              borderRadius: 12,
              border: mode === 'hardware' ? '2px solid #3b82f6' : '2px solid #e2e8f0',
              background: mode === 'hardware' ? '#eff6ff' : '#f8fafc',
              color: mode === 'hardware' ? '#1e40af' : '#64748b',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <Cpu size={16} />
            <span>Gamelan Akustik</span>
          </button>
        </div>
      </div>

      {/* Konten Berdasarkan Mode */}
      {mode === 'digital' ? (
        <div style={{ background: '#f8fafc', padding: 12, borderRadius: 12, fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
          🟢 <strong>Mode Digital Aktif:</strong> Suara gamelan dan animasi bilah menyala disimulasikan langsung di peramban web ini.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Label Peringatan Simulasi PRD 7.3 */}
          <div style={{
            background: '#fffbeb',
            border: '1.5px solid #f59e0b',
            borderRadius: 12,
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
          }}>
            <AlertCircle size={20} color="#b45309" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#92400e' }}>
                Simulasi — Perangkat Belum Terhubung
              </div>
              <div style={{ fontSize: '0.74rem', color: '#78350f', marginTop: 2, lineHeight: 1.3 }}>
                Tidak ada hardware nyata yang tersambung. Di bawah ini adalah contoh pesan serial instruksi solenoid yang akan dikirim ke mikrokontroler.
              </div>
            </div>
          </div>

          {/* Terminal Log Perintah Mikrokontroler */}
          <div style={{
            background: '#0f172a',
            color: '#38bdf8',
            borderRadius: 12,
            padding: 12,
            fontFamily: 'Consolas, monospace',
            fontSize: '0.75rem',
            lineHeight: 1.5,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: 6, marginBottom: 6, color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Terminal size={14} />
                <span>Log Serial Pengendali (Aktuator)</span>
              </div>
              <button
                type="button"
                onClick={handleAddSampleLog}
                style={{
                  background: '#1e293b',
                  color: '#f8fafc',
                  border: '1px solid #475569',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                }}
              >
                + Simulasi Ketukan
              </button>
            </div>

            <div style={{ maxHeight: 110, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {logs.map((log, idx) => (
                <div key={idx} style={{ color: log.ch === 99 ? '#facc15' : '#a5f3fc' }}>
                  {`> {"t": ${log.t.toString().padStart(4, ' ')}, "ch": ${log.ch === 99 ? 'GONG' : log.ch}, "vel": ${log.vel}}`}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
