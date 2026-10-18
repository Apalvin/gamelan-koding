import React, { useState } from 'react';
import { SlendroNote } from '../../types/gamelan';
import { gamelanSynth } from '../../audio/gamelanSynth';

interface GamelanVisualizerProps {
  activeNote?: SlendroNote | string | null;
  isGongActive?: boolean;
}

interface SaronNoteConfig {
  note: SlendroNote;
  label: string;
  name: string;
  height: number;
  bg: string;
  tint: string;
}

/**
 * 7 Bilah Saron Slendro Berurutan Nada Rendah ke Tinggi
 * Menggunakan palet Classly:
 * 6 (Nem): Olive green #9AAB65
 * 1 (Ji): Warm yellow #F7D66E
 * 2 (Ro): Periwinkle blue #B6CAEB
 * 3 (Lu): Brand pink #FFB2DD
 * 5 (Ma): Warm yellow #F7D66E
 * 6' (Nem t): Olive green #9AAB65
 * 1' (Ji t): Periwinkle blue #B6CAEB
 */
const SARON_NOTES: SaronNoteConfig[] = [
  { note: '6', label: '6', name: 'Nem (b)', height: 168, bg: '#9AAB65', tint: '#E1E6D1' },
  { note: '1', label: '1', name: 'Ji', height: 158, bg: '#F7D66E', tint: '#FEEFBF' },
  { note: '2', label: '2', name: 'Ro', height: 148, bg: '#B6CAEB', tint: '#EAF0F9' },
  { note: '3', label: '3', name: 'Lu', height: 140, bg: '#FFB2DD', tint: '#FAE0E4' },
  { note: '5', label: '5', name: 'Ma', height: 132, bg: '#F7D66E', tint: '#FEEFBF' },
  { note: "6'", label: "6'", name: 'Nem (t)', height: 124, bg: '#9AAB65', tint: '#E1E6D1' },
  { note: "1'", label: "1'", name: 'Ji (t)', height: 116, bg: '#B6CAEB', tint: '#EAF0F9' },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '16px 12px' }}>
      {/* 1. Saron Instrument Chassis (7 Bilah Berurutan) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '0 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
              Instrumen Saron
            </span>
            <span style={{ fontSize: '0.72rem', background: 'var(--color-yellow-tint)', color: 'var(--text-primary)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontWeight: 800 }}>
              7 Bilah Slendro (6 .. 1')
            </span>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Ketuk bilah untuk uji</span>
        </div>

        <div
          className="saron-chassis"
          style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-card)',
            padding: '16px 10px 14px',
            border: '1.5px solid var(--border-card)',
          }}
        >
          <div className="saron-keys-grid" style={{ display: 'flex', gap: 6, justifyContent: 'space-between', alignItems: 'flex-end' }}>
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
                    backgroundColor: isHit ? item.tint : item.bg,
                    borderColor: isHit ? 'var(--text-primary)' : 'rgba(45, 45, 43, 0.15)',
                    borderWidth: isHit ? 2.5 : 1.5,
                    borderStyle: 'solid',
                    borderRadius: 'var(--radius-squircle)',
                    transform: isHit ? 'translateY(4px) scale(0.97)' : 'none',
                    transition: 'all 0.1s ease',
                  }}
                  onClick={() => handleTapKey(item.note)}
                  role="button"
                  aria-label={`Bilah Saron nada ${item.note} (${item.name})`}
                >
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text-primary)', opacity: 0.35 }} />
                  <div>
                    <div className="saron-key-label" style={{ color: 'var(--text-primary)' }}>{item.label}</div>
                    <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', opacity: 0.85 }}>
                      {item.name}
                    </div>
                  </div>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text-primary)', opacity: 0.35 }} />
                </div>
              );
            })}
          </div>

          {/* Label Ukiran Rancakan Kayu Flat Playful */}
          <div style={{ textAlign: 'center', marginTop: 12, fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px' }}>
            ✦ LARAS SLENDRO JAWA ✦
          </div>
        </div>
      </div>

      {/* 2. Gong Ageng Instrument Gantung dengan Gayor & Pencon Riak */}
      <div
        style={{
          textAlign: 'center',
          background: 'var(--bg-surface)',
          padding: '18px 14px',
          borderRadius: 'var(--radius-card)',
          border: '1.5px solid var(--border-card)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
              Gong Ageng
            </span>
            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Penanda penutup siklus gongan
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-primary)', background: 'var(--color-pink-tint)', padding: '3px 10px', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
            Ketuk gong
          </span>
        </div>

        <div className="gong-stand-container">
          {/* Balok Gayor Kayu Penyangga Gong */}
          <div className="gong-gayor-beam">
            <div style={{ position: 'absolute', top: -3, left: 10, width: 8, height: 18, background: 'var(--text-primary)', borderRadius: 2 }} />
            <div style={{ position: 'absolute', top: -3, right: 10, width: 8, height: 18, background: 'var(--text-primary)', borderRadius: 2 }} />
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

        <div style={{ marginTop: 12, fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 700 }}>
          {isGongRippling ? 'Getaran ombak berwibawa (~62 Hz)' : 'Gong Ageng Slendro'}
        </div>
      </div>

      {/* 3. Instrumen Kolotomik Pendukung (Kenong, Kempul, Kethuk) */}
      <div
        style={{
          background: 'var(--bg-surface)',
          padding: '14px 14px',
          borderRadius: 'var(--radius-card)',
          border: '1.5px solid var(--border-card)',
        }}
      >
        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Instrumen Struktural (Kolotomik)</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Ketuk untuk dengar</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {(['kenong', 'kempul', 'kethuk'] as const).map((inst) => {
            const isActive = activeColotomic === inst;
            return (
              <button
                key={inst}
                type="button"
                onClick={() => handleTapColotomic(inst)}
                style={{
                  minHeight: 42,
                  padding: '8px 4px',
                  borderRadius: 'var(--radius-pill)',
                  border: `1.5px solid ${isActive ? 'var(--text-primary)' : 'rgba(45, 45, 43, 0.12)'}`,
                  background: isActive ? 'var(--color-yellow)' : 'var(--bg-app)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.12s ease',
                  transform: isActive ? 'scale(0.96)' : 'none',
                }}
              >
                {inst}
              </button>
            );
          })}
        </div>
      </div>

      {/* Catatan Akurasi Suara Sesuai PRD Bagian 7.4 */}
      <div className="culture-disclaimer">
        💡 Catatan: Suara simulasi sintesis Web Audio adalah pendekatan digital teoretis, bukan representasi penuh gamelan asli.
      </div>
    </div>
  );
};
