import React, { useState, useEffect, useRef } from 'react';
import { gamelanSynth } from '../audio/gamelanSynth';
import { digitalSimOutput } from '../audio/digitalSimOutput';
import {
  SARON_TUNING,
  DEMUNG_TUNING,
  PEKING_TUNING,
  KEMPUL_TUNING,
  KENONG_TUNING,
  GONG_SUWUKAN_TUNING,
  DEFAULT_GONG_AGENG_FREQ,
  KETHUK_FREQ,
  TUNING_METADATA,
} from '../audio/gamelanTuning';
import structuresData from '../content/structures.json';
import { GamelanEvent, SlendroNote } from '../types/gamelan';

export const DebugAudioPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [isPlayingGongan, setIsPlayingGongan] = useState(false);
  const [activeBeat, setActiveBeat] = useState<number | null>(null);
  const [lastPlayed, setLastPlayed] = useState<string>('Belum ada instrumen dibunyikan');

  const notes7: SlendroNote[] = ['6', '1', '2', '3', '5', "6'", "1'"];

  const playInstrument = (inst: string, note?: any) => {
    gamelanSynth.initAudio();
    gamelanSynth.playAnyInstrument(inst, note);
    setLastPlayed(`${inst.toUpperCase()} (nada ${note || '-'})`);
  };

  const handlePlayOneGongan = async () => {
    if (isPlayingGongan) {
      digitalSimOutput.stop();
      setIsPlayingGongan(false);
      setActiveBeat(null);
      return;
    }

    setIsPlayingGongan(true);
    setLastPlayed('Memainkan 1 Gongan Lancaran Contoh (16 Ketukan)...');

    // Pola contoh balungan lancaran: . 2 . 1 | . 2 . 6 | . 2 . 3 | . 2 . 5 (Gong)
    // Ditata menjadi 16 ketukan
    const balunganNotes: SlendroNote[] = [
      '2', '1', '2', '3',
      '2', '1', '2', "6'",
      '2', '1', '2', '3',
      '2', '1', '2', '5',
    ];

    const lancaran = structuresData.structures[0];
    const bpm = 60; // 1 ketuk = 1000ms
    const beatDurationMs = (60 / bpm) * 1000;

    const events: GamelanEvent[] = [];

    // 1. Masukkan lapisan balungan Saron
    balunganNotes.forEach((note, idx) => {
      events.push({
        tMs: idx * beatDurationMs,
        instrument: 'saron',
        note,
        velocity: 92,
      });
    });

    // 2. Masukkan lapisan kolotomik dari structures.json
    lancaran.beats.forEach((b) => {
      const beatTimeMs = (b.beat - 1) * beatDurationMs;
      b.instruments.forEach((inst) => {
        events.push({
          tMs: beatTimeMs,
          instrument: inst as any,
          note: inst === 'kenong' ? '1' : inst === 'kempul' ? '5' : undefined,
          velocity: inst === 'gong' ? 115 : inst === 'kenong' ? 95 : 85,
        });
      });
    });

    digitalSimOutput.setOnVisualEvent((ev) => {
      if (ev) {
        const beatNum = Math.floor(ev.tMs / beatDurationMs) + 1;
        setActiveBeat(beatNum);
      } else {
        setActiveBeat(null);
      }
    });

    digitalSimOutput.setOnFinish(() => {
      setIsPlayingGongan(false);
      setActiveBeat(null);
      setLastPlayed('Selesai 1 Gongan');
    });

    await digitalSimOutput.play(events);
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', padding: '24px 16px', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', color: '#78350f' }}>🛠️ Laboratorium & Debug Audio Gamelan</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
            Panel kalibrasi tala laras slendro, uji sintesis fisik Web Audio, dan demonstrasi gongan lancaran.
          </p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            ← Kembali
          </button>
        )}
      </div>

      {/* Status Bar */}
      <div style={{ background: '#fef3c7', padding: '12px 16px', borderRadius: 12, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>Status Pemutaran:</span>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#78350f' }}>{lastPlayed}</div>
        </div>
        <button
          onClick={() => {
            digitalSimOutput.stop();
            gamelanSynth.stopAll();
            setIsPlayingGongan(false);
            setActiveBeat(null);
            setLastPlayed('Audio Dimatikan (Stop All)');
          }}
          style={{ padding: '6px 12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
        >
          ■ Hentikan Suara
        </button>
      </div>

      {/* Tombol Demo Utama: Putar Satu Gongan Lancaran */}
      <div style={{ background: 'white', padding: 20, borderRadius: 16, border: '2px solid #e2e8f0', marginBottom: 24, boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: '#92400e' }}>🎵 Demonstrasi Satu Gongan Lancaran (16 Ketukan)</h2>
        <p style={{ margin: '0 0 14px 0', fontSize: '0.8rem', color: '#64748b' }}>
          Memainkan lapisan balungan saron bersamaan dengan instrumen struktur kolotomik (kethuk, kempul, kenong, dan gong ageng) secara sinkron.
        </p>

        <button
          onClick={handlePlayOneGongan}
          style={{
            padding: '12px 24px',
            background: isPlayingGongan ? '#dc2626' : '#059669',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {isPlayingGongan ? '⏹ Hentikan Gongan' : '▶ Putar Satu Gongan Lancaran Contoh'}
        </button>

        {/* Indikator Ketukan 1-16 */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 6, fontWeight: 600 }}>Indikator Ketukan (1 - 16):</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: 4 }}>
            {Array.from({ length: 16 }, (_, i) => i + 1).map((b) => {
              const isActive = activeBeat === b;
              const isKenong = b % 4 === 0;
              const isGong = b === 16;
              return (
                <div
                  key={b}
                  style={{
                    padding: '8px 2px',
                    textAlign: 'center',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: isActive ? '#facc15' : isGong ? '#fed7aa' : isKenong ? '#fef08a' : '#f1f5f9',
                    color: isActive ? '#78350f' : '#334155',
                    border: isActive ? '2px solid #ca8a04' : '1px solid #cbd5e1',
                    transform: isActive ? 'scale(1.1)' : 'none',
                    transition: 'all 0.1s ease',
                  }}
                >
                  {b}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid Uji Instrumen Tiap Ricikan */}
      <h2 style={{ fontSize: '1.05rem', color: '#78350f', marginBottom: 12 }}>🎹 Uji Suara Instrumen Gamelan</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
        {/* Saron */}
        <div style={{ background: 'white', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#78350f', marginBottom: 8 }}>
            Saron Slendro (7 Bilah: 496 .. 1139 Hz)
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {notes7.map((n) => (
              <button
                key={n}
                onClick={() => playInstrument('saron', n)}
                style={{ flex: 1, minWidth: 44, padding: '10px 4px', background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 8, fontWeight: 700, cursor: 'pointer', color: '#92400e' }}
              >
                {n} ({SARON_TUNING[String(n)]} Hz)
              </button>
            ))}
          </div>
        </div>

        {/* Demung */}
        <div style={{ background: 'white', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#78350f', marginBottom: 8 }}>
            Demung Slendro (1 Oktaf Bawah, Peluruhan Panjang & Gelap)
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {notes7.map((n) => (
              <button
                key={n}
                onClick={() => playInstrument('demung', n)}
                style={{ flex: 1, minWidth: 44, padding: '10px 4px', background: '#f3e8ff', border: '1px solid #c084fc', borderRadius: 8, fontWeight: 700, cursor: 'pointer', color: '#6b21a8' }}
              >
                {n} ({DEMUNG_TUNING[String(n)]} Hz)
              </button>
            ))}
          </div>
        </div>

        {/* Peking */}
        <div style={{ background: 'white', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#78350f', marginBottom: 8 }}>
            Peking Slendro (1 Oktaf Atas, Berdenting Cepat & Cerah)
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {notes7.map((n) => (
              <button
                key={n}
                onClick={() => playInstrument('peking', n)}
                style={{ flex: 1, minWidth: 44, padding: '10px 4px', background: '#ecfdf5', border: '1px solid #34d399', borderRadius: 8, fontWeight: 700, cursor: 'pointer', color: '#065f46' }}
              >
                {n} ({PEKING_TUNING[String(n)]} Hz)
              </button>
            ))}
          </div>
        </div>

        {/* Instrumen Kolotomik & Gong */}
        <div style={{ background: 'white', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#78350f', marginBottom: 8 }}>
            Ricikan Kolotomik & Pencon
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
            <button
              onClick={() => playInstrument('gong')}
              style={{ padding: '12px 6px', background: '#ea580c', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
            >
              Gong Ageng (62 Hz)
            </button>
            <button
              onClick={() => playInstrument('gong_suwukan', '1')}
              style={{ padding: '12px 6px', background: '#f97316', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
            >
              Suwukan (133 Hz)
            </button>
            <button
              onClick={() => playInstrument('kenong', '1')}
              style={{ padding: '12px 6px', background: '#eab308', color: '#713f12', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
            >
              Kenong (272 Hz)
            </button>
            <button
              onClick={() => playInstrument('kempul', '5')}
              style={{ padding: '12px 6px', background: '#ca8a04', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
            >
              Kempul (107 Hz)
            </button>
            <button
              onClick={() => playInstrument('kethuk')}
              style={{ padding: '12px 6px', background: '#78716c', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
            >
              Kethuk (480 Hz Kering)
            </button>
          </div>
        </div>
      </div>

      {/* Laporan Akustik & Catatan Validasi Budaya */}
      <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: 16, borderRadius: 14 }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: '#92400e' }}>📜 Catatan Etika & Integritas Budaya:</h3>
        <p style={{ margin: '0 0 6px 0', fontSize: '0.78rem', color: '#78350f', lineHeight: 1.5 }}>
          {TUNING_METADATA.sourceNote}
        </p>
        <p style={{ margin: 0, fontSize: '0.74rem', color: '#b45309' }}>
          Parameter yang masih merupakan pendekatan teoretis numerik: rasio overtone bilah 1:2.76:5.40, rasio 12-partial gong ageng, serta tala rata-rata ~240 cent/langkah.
        </p>
      </div>
    </div>
  );
};
