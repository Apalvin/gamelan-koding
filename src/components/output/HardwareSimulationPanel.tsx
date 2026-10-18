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
      className="modern-card"
      style={{
        background: 'white',
        borderRadius: 20,
        padding: 16,
        border: '2px solid #e2e8f0',
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
            color: '#64748b',
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
            gap: 8,
            background: '#f8fafc',
            padding: 4,
            borderRadius: 14,
            border: '1.5px solid #e2e8f0',
          }}
        >
          <button
            type="button"
            onClick={() => onModeChange('digital')}
            style={{
              flex: 1,
              minHeight: 44,
              borderRadius: 12,
              border: 'none',
              background: mode === 'digital' ? '#10b981' : 'transparent',
              color: mode === 'digital' ? 'white' : '#64748b',
              fontWeight: 800,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: mode === 'digital' ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Monitor size={18} />
            <span>Simulasi Digital</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('hardware')}
            style={{
              flex: 1,
              minHeight: 44,
              borderRadius: 12,
              border: 'none',
              background: mode === 'hardware' ? '#3b82f6' : 'transparent',
              color: mode === 'hardware' ? 'white' : '#64748b',
              fontWeight: 800,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: mode === 'hardware' ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Cpu size={18} />
            <span>Gamelan Akustik</span>
          </button>
        </div>
      </div>

      {/* Konten Berdasarkan Mode Keluaran */}
      {mode === 'digital' ? (
        <div
          style={{
            background: '#ecfdf5',
            padding: '14px 16px',
            borderRadius: 14,
            fontSize: '0.85rem',
            color: '#065f46',
            lineHeight: 1.5,
            border: '1.5px solid #a7f3d0',
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
