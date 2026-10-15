import React, { useState } from 'react';
import { SlendroNote } from '../../types/gamelan';
import { gamelanSynth } from '../../audio/gamelanSynth';

interface GamelanVisualizerProps {
  activeNote?: SlendroNote | null;
  isGongActive?: boolean;
}

const SARON_NOTES: { note: SlendroNote; label: string; name: string; height: number }[] = [
  { note: 1, label: '1', name: 'Ji', height: 160 },
  { note: 2, label: '2', name: 'Ro', height: 152 },
  { note: 3, label: '3', name: 'Lu', height: 144 },
  { note: 5, label: '5', name: 'Ma', height: 136 },
  { note: 6, label: '6', name: 'Nem', height: 128 },
];

export const GamelanVisualizer: React.FC<GamelanVisualizerProps> = ({
  activeNote = null,
  isGongActive = false,
}) => {
  const [manualNote, setManualNote] = useState<SlendroNote | null>(null);
  const [manualGong, setManualGong] = useState(false);

  const handleTapKey = (note: SlendroNote) => {
    // Aktifkan dan bunyikan sintesis saron slendro
    gamelanSynth.initAudio();
    gamelanSynth.playSaronNote(note);
    setManualNote(note);
    setTimeout(() => setManualNote(null), 300);
  };

  const handleTapGong = () => {
    // Aktifkan dan bunyikan gong ageng dengan ombak
    gamelanSynth.initAudio();
    gamelanSynth.playGong();
    setManualGong(true);
    setTimeout(() => setManualGong(false), 450);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '16px 12px' }}>
      {/* Saron Instrument Chassis */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '0 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#78350f' }}>Instrumen Saron</span>
            <span style={{ fontSize: '0.72rem', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
              Laras Slendro
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Ketuk bilah untuk uji visual</span>
        </div>

        <div className="saron-chassis">
          <div className="saron-keys-grid">
            {SARON_NOTES.map((item) => {
              const isHit = activeNote === item.note || manualNote === item.note;
              return (
                <div
                  key={item.note}
                  className={`saron-key ${isHit ? 'active' : ''}`}
                  style={{
                    height: item.height,
                    boxShadow: isHit
                      ? '0 0 20px #facc15, 0 4px 10px rgba(0,0,0,0.3)'
                      : '0 4px 6px rgba(0,0,0,0.25)',
                    transform: isHit ? 'translateY(4px) scale(0.98)' : 'none',
                    filter: isHit ? 'brightness(1.3)' : 'none',
                  }}
                  onClick={() => handleTapKey(item.note)}
                  role="button"
                  aria-label={`Bilah Saron nada ${item.note} (${item.name})`}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#78350f', opacity: 0.7 }} />
                  <div>
                    <div className="saron-key-label">{item.label}</div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#854d0e', textAlign: 'center' }}>
                      {item.name}
                    </div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#78350f', opacity: 0.7 }} />
                </div>
              );
            })}
          </div>
          {/* Label Ukiran Rancakan Kayu */}
          <div style={{ textAlign: 'center', marginTop: 10, fontSize: '0.72rem', color: '#fef3c7', fontWeight: 600, letterSpacing: '1px' }}>
            ✦ GAMELAN SLENDRO ✦
          </div>
        </div>
      </div>

      {/* Gong Ageng Instrument */}
      <div style={{ textAlign: 'center', background: 'white', padding: 16, borderRadius: 18, border: '2px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#92400e' }}>Gong Penutup Siklus</span>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Ketuk gong</span>
        </div>

        <div
          className={`gong-instrument ${isGongActive || manualGong ? 'active' : ''}`}
          onClick={handleTapGong}
          role="button"
          aria-label="Instrumen Gong"
        >
          <div className="gong-boss" />
        </div>
        <div style={{ marginTop: 10, fontSize: '0.78rem', color: '#78350f', fontWeight: 700 }}>
          {isGongActive || manualGong ? '💥 GOOONG!' : 'Gong Ageng'}
        </div>
      </div>

      {/* Catatan Akurasi Suara Sesuai PRD Bagian 7.4 */}
      <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic', marginTop: -8 }}>
        💡 Catatan: Suara simulasi sintesis Web Audio adalah pendekatan digital, bukan representasi penuh gamelan asli.
      </div>
    </div>
  );
};
