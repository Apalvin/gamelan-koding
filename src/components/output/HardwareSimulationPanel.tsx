import React, { useState, useEffect } from 'react';
import { Cpu, Monitor, AlertCircle, Terminal } from 'lucide-react';
import { HardwareSimLog, GamelanEvent } from '../../types/gamelan';

export type OutputMode = 'digital' | 'hardware';

interface HardwareSimulationPanelProps {
  mode: OutputMode;
  onModeChange: (mode: OutputMode) => void;
  compiledEvents?: GamelanEvent[];
}

export const HardwareSimulationPanel: React.FC<HardwareSimulationPanelProps> = ({
  mode,
  onModeChange,
  compiledEvents,
}) => {
  const [logs, setLogs] = useState<HardwareSimLog[]>([
    { t: 0, ch: 1, vel: 90 },
    { t: 500, ch: 2, vel: 90 },
    { t: 1000, ch: 3, vel: 95 },
    { t: 1500, ch: 5, vel: 90 },
    { t: 2000, ch: 'GONG', vel: 110 },
  ]);

  useEffect(() => {
    if (compiledEvents && compiledEvents.length > 0) {
      const newLogs: HardwareSimLog[] = compiledEvents.map((ev) => ({
        t: ev.tMs,
        ch: ev.instrument === 'gong' ? 'GONG' : (ev.note ?? 1),
        vel: ev.velocity,
      }));
      setLogs(newLogs);
    }
  }, [compiledEvents]);

  const handleAddSampleLog = () => {
    const nextT = logs.length > 0 ? (typeof logs[logs.length - 1].t === 'number' ? logs[logs.length - 1].t + 500 : 0) : 0;
    const sampleCh = [1, 2, 3, 5, 6, 'GONG'][Math.floor(Math.random() * 6)];
    setLogs((prev) => [...prev.slice(-14), { t: nextT, ch: sampleCh, vel: 95 }]);
  };

  return (
    <div className="modern-card" style={{ background: 'white', borderRadius: 18, padding: 16, border: '2px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Selector Mode Keluaran */}
      <div>
        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.5px' }}>
          Mode Keluaran Tabuhan
        </div>

        <div style={{ display: 'flex', gap: 8, background: '#f8fafc', padding: 4, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={() => onModeChange('digital')}
            style={{
              flex: 1,
              minHeight: 40,
              borderRadius: 10,
              border: 'none',
              background: mode === 'digital' ? '#10b981' : 'transparent',
              color: mode === 'digital' ? 'white' : '#64748b',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: mode === 'digital' ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none',
              transition: 'all 0.15s ease',
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
              minHeight: 40,
              borderRadius: 10,
              border: 'none',
              background: mode === 'hardware' ? '#3b82f6' : 'transparent',
              color: mode === 'hardware' ? 'white' : '#64748b',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: mode === 'hardware' ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Cpu size={16} />
            <span>Gamelan Akustik</span>
          </button>
        </div>
      </div>

      {/* Konten Berdasarkan Mode */}
      {mode === 'digital' ? (
        <div style={{ background: '#ecfdf5', padding: '12px 14px', borderRadius: 14, fontSize: '0.84rem', color: '#065f46', lineHeight: 1.45, border: '1px solid #a7f3d0' }}>
          🟢 <strong>Mode Digital Aktif:</strong> Suara gamelan dan animasi bilah menyala disimulasikan langsung di peramban web ini.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Label Peringatan Simulasi PRD 7.3 */}
          <div style={{
            background: '#fffbeb',
            border: '1.5px solid #f59e0b',
            borderRadius: 14,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}>
            <AlertCircle size={20} color="#b45309" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#92400e' }}>
                Simulasi — Perangkat Belum Terhubung
              </div>
              <div style={{ fontSize: '0.76rem', color: '#78350f', marginTop: 2, lineHeight: 1.35 }}>
                Tidak ada hardware nyata yang tersambung. Di bawah ini adalah log pesan instruksi solenoid/aktuator yang dihasilkan compiler program balok.
              </div>
            </div>
          </div>

          {/* Terminal Log Perintah Mikrokontroler */}
          <div style={{
            background: '#0f172a',
            color: '#38bdf8',
            borderRadius: 14,
            padding: 14,
            fontFamily: 'Consolas, monospace',
            fontSize: '0.75rem',
            lineHeight: 1.5,
            border: '1px solid #334155'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: 8, marginBottom: 8, color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Terminal size={14} />
                <span>Log Serial Pengendali ({logs.length} Event)</span>
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
                  fontWeight: 600
                }}
              >
                + Tambah Ketuk
              </button>
            </div>

            <div style={{ maxHeight: 130, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {logs.map((log, idx) => (
                <div key={idx} style={{ color: log.ch === 'GONG' ? '#facc15' : '#a5f3fc' }}>
                  {`> {"t": ${String(log.t).padStart(5, ' ')}, "ch": "${log.ch}", "vel": ${log.vel}}`}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
