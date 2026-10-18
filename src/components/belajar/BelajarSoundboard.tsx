import React, { useState } from 'react';
import { Volume2, Music, Sparkles } from 'lucide-react';
import { gamelanSynth } from '../../audio/gamelanSynth';
import { SlendroNote, InstrumentType } from '../../types/gamelan';

interface KeyConfig {
  note: SlendroNote;
  javaneseName: string;
  number: string;
  widthPercent: number;
}

const KEYS_CONFIG: KeyConfig[] = [
  { note: '6', javaneseName: 'Nem', number: '6', widthPercent: 15 },
  { note: '1', javaneseName: 'Ji', number: '1', widthPercent: 14.5 },
  { note: '2', javaneseName: 'Ro', number: '2', widthPercent: 14 },
  { note: '3', javaneseName: 'Lu', number: '3', widthPercent: 13.5 },
  { note: '5', javaneseName: 'Ma', number: '5', widthPercent: 13 },
  { note: "6'", javaneseName: 'Nem Cilik', number: "6'", widthPercent: 12.5 },
  { note: "1'", javaneseName: 'Ji Cilik', number: "1'", widthPercent: 12 },
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
    }, 300);
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
        background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
        borderRadius: 20,
        padding: '16px',
        border: '2px solid #fde68a',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: '0 8px 20px rgba(245, 158, 11, 0.1)',
      }}
    >
      {/* Header Soundboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#f59e0b',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Volume2 size={18} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#78350f' }}>
              Tuts Gamelan Interaktif
            </h4>
            <div style={{ fontSize: '0.72rem', color: '#92400e' }}>
              Sentuh bilah atau gong untuk mendengar tala nada Slendro
            </div>
          </div>
        </div>

        {/* Pemilihan Instrumen Balungan */}
        <div style={{ display: 'flex', background: 'white', borderRadius: 10, padding: 2, border: '1px solid #cbd5e1' }}>
          {(
            [
              { id: 'demung', label: 'Demung' },
              { id: 'saron', label: 'Saron' },
              { id: 'peking', label: 'Peking' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedInstrument(item.id)}
              style={{
                border: 'none',
                background: selectedInstrument === item.id ? '#f59e0b' : 'transparent',
                color: selectedInstrument === item.id ? 'white' : '#64748b',
                padding: '3px 8px',
                borderRadius: 8,
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Bilah Saron Slendro */}
      <div
        style={{
          background: '#78350f',
          padding: '12px 10px',
          borderRadius: 14,
          boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          gap: 6,
          justifyContent: 'center',
          alignItems: 'center',
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
                height: 82,
                borderRadius: 8,
                border: isActive ? '2px solid #ffffff' : '1.5px solid #ca8a04',
                background: isActive
                  ? 'linear-gradient(180deg, #fef08a 0%, #facc15 100%)'
                  : 'linear-gradient(180deg, #fde047 0%, #eab308 100%)',
                boxShadow: isActive
                  ? '0 0 16px rgba(250, 204, 21, 0.9), inset 0 2px 4px rgba(255, 255, 255, 0.6)'
                  : '0 4px 6px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '8px 4px',
                alignItems: 'center',
                cursor: 'pointer',
                transform: isActive ? 'scale(0.97)' : 'none',
                transition: 'all 0.1s ease',
              }}
              aria-label={`Tabuh nada ${k.note} (${k.javaneseName})`}
            >
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#713f12' }}>
                {k.number}
              </span>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#854d0e', textAlign: 'center', lineHeight: 1.1 }}>
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
          background: isGongActive
            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
            : 'white',
          color: isGongActive ? 'white' : '#78350f',
          border: '2px solid #f59e0b',
          borderRadius: 12,
          fontWeight: 800,
          fontSize: '0.86rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: 'pointer',
          boxShadow: isGongActive ? '0 0 14px rgba(245, 158, 11, 0.5)' : 'none',
          transition: 'all 0.15s ease',
        }}
      >
        <Sparkles size={16} />
        <span>Tabuh Gong Ageng (Penutup Gongan)</span>
      </button>

      <div style={{ fontSize: '0.7rem', color: '#92400e', textAlign: 'center', fontStyle: 'italic' }}>
        Contoh — belum divalidasi praktisi karawitan
      </div>
    </div>
  );
};
