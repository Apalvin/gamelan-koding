import React, { useState } from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { gamelanSynth } from '../../audio/gamelanSynth';
import { SlendroNote, InstrumentType } from '../../types/gamelan';

interface KeyConfig {
  note: SlendroNote;
  javaneseName: string;
  number: string;
  color: string;
  bgTint: string;
}

/**
 * Pemetaan warna 7 bilah laras Slendro berdasarkan palet moodboard Classly:
 * 6: Olive (#9AAB65), 1: Yellow (#F7D66E), 2: Periwinkle (#B6CAEB),
 * 3: Pink (#FFB2DD), 5: Yellow (#F7D66E), 6': Olive (#9AAB65), 1': Periwinkle (#B6CAEB)
 */
const KEYS_CONFIG: KeyConfig[] = [
  { note: '6', javaneseName: 'Nem', number: '6', color: '#9AAB65', bgTint: '#E1E6D1' },
  { note: '1', javaneseName: 'Ji', number: '1', color: '#F7D66E', bgTint: '#FEEFBF' },
  { note: '2', javaneseName: 'Ro', number: '2', color: '#B6CAEB', bgTint: '#EAF0F9' },
  { note: '3', javaneseName: 'Lu', number: '3', color: '#FFB2DD', bgTint: '#FAE0E4' },
  { note: '5', javaneseName: 'Ma', number: '5', color: '#F7D66E', bgTint: '#FEEFBF' },
  { note: "6'", javaneseName: 'Nem Cilik', number: "6'", color: '#9AAB65', bgTint: '#E1E6D1' },
  { note: "1'", javaneseName: 'Ji Cilik', number: "1'", color: '#B6CAEB', bgTint: '#EAF0F9' },
];

export const BelajarSoundboard: React.FC = () => {
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType>('saron');
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [isGongActive, setIsGongActive] = useState<boolean>(false);

  const handlePlayKey = (note: SlendroNote) => {
    setActiveNote(String(note));
    gamelanSynth.playNote(selectedInstrument, note);
    setTimeout(() => {
      setActiveNote((curr) => (curr === String(note) ? null : curr));
    }, 280);
  };

  const handlePlayGong = () => {
    setIsGongActive(true);
    gamelanSynth.playGong();
    setTimeout(() => {
      setIsGongActive(false);
    }, 800);
  };

  return (
    <div
      style={{
        background: '#F8F3E7',
        borderRadius: 22,
        padding: '16px',
        border: '1.5px solid rgba(45, 45, 43, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Header Soundboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              background: '#FFB2DD',
              color: '#2D2D2B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Volume2 size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#2D2D2B' }}>
              Tuts Gamelan Interaktif
            </h4>
            <div style={{ fontSize: '0.72rem', color: '#6C6B66' }}>
              Sentuh bilah atau gong untuk mendengar tala nada Slendro
            </div>
          </div>
        </div>

        {/* Pemilihan Instrumen Balungan (Segmented Pill) */}
        <div
          style={{
            display: 'flex',
            background: '#FFFCF5',
            borderRadius: 9999,
            padding: 3,
            border: '1.5px solid rgba(45, 45, 43, 0.08)',
          }}
        >
          {(
            [
              { id: 'demung', label: 'Demung' },
              { id: 'saron', label: 'Saron' },
              { id: 'peking', label: 'Peking' },
            ] as const
          ).map((item) => {
            const isSelected = selectedInstrument === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedInstrument(item.id)}
                style={{
                  border: 'none',
                  background: isSelected ? '#FFB2DD' : 'transparent',
                  color: '#2D2D2B',
                  padding: '4px 10px',
                  borderRadius: 9999,
                  fontSize: '0.74rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Bilah Saron Slendro (Classly Color-Coded Keys) */}
      <div
        style={{
          background: '#FFFCF5',
          padding: '14px 10px',
          borderRadius: 18,
          border: '1.5px solid rgba(45, 45, 43, 0.08)',
          display: 'flex',
          gap: 6,
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        {KEYS_CONFIG.map((k) => {
          const isActive = activeNote === String(k.note);
          return (
            <button
              key={k.note}
              type="button"
              onClick={() => handlePlayKey(k.note)}
              style={{
                flex: 1,
                minHeight: 84,
                borderRadius: 12,
                border: isActive
                  ? '2px solid #2D2D2B'
                  : '1.5px solid rgba(45, 45, 43, 0.15)',
                background: isActive ? k.color : k.bgTint,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '8px 3px',
                alignItems: 'center',
                cursor: 'pointer',
                transform: isActive ? 'scale(0.95)' : 'none',
                transition: 'all 0.12s ease',
              }}
              aria-label={`Tabuh nada ${k.note} (${k.javaneseName})`}
            >
              <span
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  color: '#2D2D2B',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {k.number}
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: '#2D2D2B',
                  textAlign: 'center',
                  lineHeight: 1.1,
                }}
              >
                {k.javaneseName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tombol Tabuh Gong Ageng */}
      <button
        type="button"
        onClick={handlePlayGong}
        style={{
          minHeight: 46,
          background: isGongActive ? '#FFB2DD' : '#FEEFBF',
          color: '#2D2D2B',
          border: '1.5px solid rgba(45, 45, 43, 0.12)',
          borderRadius: 9999,
          fontWeight: 800,
          fontSize: '0.86rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: 'pointer',
          transform: isGongActive ? 'scale(0.98)' : 'none',
          transition: 'all 0.15s ease',
        }}
      >
        <Sparkles size={16} />
        <span>Tabuh Gong Ageng (Penutup Gongan)</span>
      </button>

    </div>
  );
};
