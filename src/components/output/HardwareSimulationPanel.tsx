import React, { useState, useEffect } from 'react';
import { Cpu, Monitor } from 'lucide-react';
import { GamelanEvent } from '../../types/gamelan';
import { HardwareVisualizer } from './HardwareVisualizer';
import { HardwareSerialTerminal } from './HardwareSerialTerminal';
import { HardwarePacket, hardwareSimOutput } from '../../audio/hardwareSimOutput';

export type OutputMode = 'digital' | 'hardware';

interface HardwareSimulationPanelProps {
  mode: OutputMode;
  onModeChange: (mode: OutputMode) => void;
  compiledEvents?: GamelanEvent[];
  activeChannel?: number | null;
  streamedPackets?: HardwarePacket[];
  latestPacket?: HardwarePacket | null;
  onClearLogs?: () => void;
}

export const HardwareSimulationPanel: React.FC<HardwareSimulationPanelProps> = ({
  mode,
  onModeChange,
  compiledEvents,
  activeChannel = null,
  streamedPackets,
  latestPacket = null,
  onClearLogs,
}) => {
  const [pulseDuration, setPulseDuration] = useState<number>(hardwareSimOutput.getPulseDuration());
  const [localPackets, setLocalPackets] = useState<HardwarePacket[]>([]);

  // Jika compiledEvents berubah dan belum ada stream, konversi secara awal
  useEffect(() => {
    if (compiledEvents && compiledEvents.length > 0) {
      const generated = hardwareSimOutput.convertToPackets(compiledEvents, pulseDuration);
      setLocalPackets(generated);
    } else {
      setLocalPackets([]);
    }
  }, [compiledEvents, pulseDuration]);

  const handlePulseDurationChange = (ms: number) => {
    setPulseDuration(ms);
    hardwareSimOutput.setPulseDuration(ms);
    if (compiledEvents && compiledEvents.length > 0) {
      setLocalPackets(hardwareSimOutput.convertToPackets(compiledEvents, ms));
    }
  };

  const handleClearLogs = () => {
    setLocalPackets([]);
    onClearLogs?.();
  };

  // Gunakan streamedPackets jika tersedia (dari playback real-time) atau localPackets dari kompilasi
  const packetsToShow = streamedPackets && streamedPackets.length > 0 ? streamedPackets : localPackets;

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-card)',
        padding: 16,
        border: '1.5px solid var(--border-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Selector Mode Keluaran */}
      <div>
        <div
          style={{
            fontSize: '0.74rem',
            fontWeight: 800,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            marginBottom: 8,
            letterSpacing: '0.5px',
          }}
        >
          Mode Keluaran Tabuhan (PRD Bagian 7.3)
        </div>

        <div
          style={{
            display: 'flex',
            gap: 6,
            background: 'var(--bg-app)',
            padding: 4,
            borderRadius: 'var(--radius-pill)',
            border: '1.5px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => onModeChange('digital')}
            style={{
              flex: 1,
              minHeight: 40,
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: mode === 'digital' ? 'var(--color-pink)' : 'transparent',
              color: 'var(--text-primary)',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Monitor size={17} />
            <span>Simulasi Digital</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('hardware')}
            style={{
              flex: 1,
              minHeight: 40,
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: mode === 'hardware' ? 'var(--color-yellow)' : 'transparent',
              color: 'var(--text-primary)',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Cpu size={17} />
            <span>Gamelan Akustik</span>
          </button>
        </div>
      </div>

      {/* Konten Berdasarkan Mode Keluaran */}
      {mode === 'digital' ? (
        <div
          style={{
            background: 'var(--color-olive-tint)',
            padding: '14px 16px',
            borderRadius: 'var(--radius-card)',
            fontSize: '0.84rem',
            color: 'var(--text-primary)',
            lineHeight: 1.5,
            border: '1.5px solid var(--color-olive)',
            fontWeight: 600,
          }}
        >
          🟢 <strong>Mode Digital Aktif:</strong> Suara gamelan Web Audio API dan animasi bilah menyala disimulasikan secara interaktif di layar ini.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Visualisasi Fisik Solenoid Aktuator */}
          <HardwareVisualizer
            activeChannel={activeChannel}
            pulseDurationMs={pulseDuration}
          />

          {/* Terminal Serial Monitor Mikrokontroler */}
          <HardwareSerialTerminal
            packets={packetsToShow}
            latestPacket={latestPacket}
            pulseDurationMs={pulseDuration}
            onPulseDurationChange={handlePulseDurationChange}
            onClearLogs={handleClearLogs}
          />
        </div>
      )}
    </div>
  );
};
