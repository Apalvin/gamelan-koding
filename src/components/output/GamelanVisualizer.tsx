import React, { useState } from 'react';
import { SlendroNote } from '../../types/gamelan';
import { gamelanSynth } from '../../audio/gamelanSynth';

interface GamelanVisualizerProps {
  activeNote?: SlendroNote | string | null;
  isGongActive?: boolean;
}

/**
 * 7 Bilah Saron Slendro Berurutan Nada Rendah ke Tinggi:
 * 6 (nem rendah/ngisor), 1 (ji), 2 (ro), 3 (lu), 5 (ma), 6' (nem tinggi/cilik), 1' (ji tinggi/cilik)
 */
const SARON_NOTES: { note: SlendroNote; label: string; name: string; height: number }[] = [
  { note: '6', label: '6', name: 'Nem (b)', height: 168 },
  { note: '1', label: '1', name: 'Ji', height: 158 },
  { note: '2', label: '2', name: 'Ro', height: 148 },
  { note: '3', label: '3', name: 'Lu', height: 140 },
  { note: '5', label: '5', name: 'Ma', height: 132 },
  { note: "6'", label: "6'", name: 'Nem (t)', height: 124 },
  { note: "1'", label: "1'", name: 'Ji (t)', height: 116 },
];

export const GamelanVisualizer: React.FC<GamelanVisualizerProps> = ({
  activeNote = null,
  isGongActive = false,
}) => {
  const [manualNote, setManualNote] = useState<SlendroNote | string | null>(null);
  const [manualGong, setManualGong] = useState(false);
  const [activeColotomic, setActiveColotomic] = useState<string | null>(null);

  const handleTapKey = (note: SlendroNote) => {
    gamelanSynth.initAudio();
    gamelanSynth.playSaronNote(note);
    setManualNote(note);
    setTimeout(() => setManualNote(null), 300);
  };

  const handleTapGong = () => {
    gamelanSynth.initAudio();
    gamelanSynth.playGong();
    setManualGong(true);
    setTimeout(() => setManualGong(false), 2800); // Durasi riak getaran gong
  };

  const handleTapColotomic = (inst: 'kenong' | 'kempul' | 'kethuk') => {
    gamelanSynth.initAudio();
    gamelanSynth.playAnyInstrument(inst);
    setActiveColotomic(inst);
    setTimeout(() => setActiveColotomic(null), 350);
  };

  const isGongRippling = isGongActive || manualGong;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '16px 12px' }}>
      {/* 1. Saron Instrument Chassis (7 Bilah Berurutan) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '0 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#78350f' }}>Instrumen Saron</span>
            <span style={{ fontSize: '0.72rem', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
              7 Bilah Slendro (6 .. 1')
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Ketuk bilah untuk uji bunyi</span>
        </div>

        <div className="saron-chassis">
          <div className="saron-keys-grid">
            {SARON_NOTES.map((item) => {
              const isHit =
                String(activeNote) === String(item.note) ||
                String(manualNote) === String(item.note);

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
                    <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#854d0e', textAlign: 'center' }}>
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
            ✦ LARAS SLENDRO JAWA ✦
          </div>
        </div>
      </div>

      {/* 2. Gong Ageng Instrument Gantung dengan Gayor & Pencon Riak */}
      <div style={{ textAlign: 'center', background: 'white', padding: '18px 14px', borderRadius: 18, border: '2px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#92400e' }}>Gong Ageng</span>
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>Penanda penutup siklus gongan</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', background: '#f8fafc', padding: '3px 8px', borderRadius: 6 }}>Ketuk gong</span>
        </div>

        <div className="gong-stand-container">
          {/* Balok Gayor Kayu Penyangga Gong */}
          <div className="gong-gayor-beam">
            <div style={{ position: 'absolute', top: -3, left: 10, width: 8, height: 18, background: '#451a03', borderRadius: 2 }} />
            <div style={{ position: 'absolute', top: -3, right: 10, width: 8, height: 18, background: '#451a03', borderRadius: 2 }} />
          </div>
          {/* Tali Gantungan Pluntur */}
          <div className="gong-ropes">
            <div className="gong-rope" />
            <div className="gong-rope" />
          </div>

          {/* Gong Bundar Berpencon dengan Riak Getaran */}
          <div className="gong-instrument-wrapper">
            {isGongRippling && (
              <>
                <div className="gong-ripple" />
                <div className="gong-ripple gong-ripple-2" />
                <div className="gong-ripple gong-ripple-3" />
              </>
            )}
            <div
              className={`gong-instrument ${isGongRippling ? 'active' : ''}`}
              onClick={handleTapGong}
              role="button"
              aria-label="Instrumen Gong Ageng"
            >
              <div className="gong-boss" />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12, fontSize: '0.76rem', color: '#78350f', fontWeight: 600 }}>
          {isGongRippling ? 'Getaran ombak berwibawa (~62 Hz)' : 'Gong Ageng Slendro'}
        </div>
      </div>

      {/* 3. Instrumen Kolotomik Pendukung (Kenong, Kempul, Kethuk) */}
      <div style={{ background: '#fafaf9', padding: '12px 14px', borderRadius: 14, border: '1px solid #e7e5e4' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#44403c', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span>Instrumen Struktural (Kolotomik)</span>
          <span style={{ fontSize: '0.7rem', color: '#78716c' }}>Ketuk untuk dengar</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <button
            type="button"
            onClick={() => handleTapColotomic('kenong')}
            style={{
              padding: '8px 4px',
              borderRadius: 8,
              border: '1.5px solid #d6d3d1',
              background: activeColotomic === 'kenong' ? '#fde047' : 'white',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#44403c',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Kenong
          </button>
          <button
            type="button"
            onClick={() => handleTapColotomic('kempul')}
            style={{
              padding: '8px 4px',
              borderRadius: 8,
              border: '1.5px solid #d6d3d1',
              background: activeColotomic === 'kempul' ? '#fde047' : 'white',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#44403c',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Kempul
          </button>
          <button
            type="button"
            onClick={() => handleTapColotomic('kethuk')}
            style={{
              padding: '8px 4px',
              borderRadius: 8,
              border: '1.5px solid #d6d3d1',
              background: activeColotomic === 'kethuk' ? '#fde047' : 'white',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#44403c',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Kethuk
          </button>
        </div>
      </div>

      {/* Catatan Akurasi Suara Sesuai PRD Bagian 7.4 */}
      <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic', marginTop: -4 }}>
        💡 Catatan: Suara simulasi sintesis Web Audio adalah pendekatan digital teoretis, bukan representasi penuh gamelan asli.
      </div>
    </div>
  );
};
