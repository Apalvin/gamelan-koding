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
                padding: '3px 8px',
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
                padding: '3px 8px',
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
              minHeight: 32,
              background: copied ? '#059669' : '#1e293b',
              color: 'white',
              border: '1px solid #475569',
              borderRadius: 8,
              padding: '0 10px',
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
              width: 32,
              height: 32,
              background: '#1e293b',
              color: '#94a3b8',
              border: '1px solid #475569',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: packets.length === 0 ? 'not-allowed' : 'pointer',
              opacity: packets.length === 0 ? 0.5 : 1,
            }}
            aria-label="Bersihkan log"
          >
            <Trash2 size={14} />
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
