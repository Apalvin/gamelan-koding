import React, { useState } from 'react';
import { Volume2, CheckCircle2, ArrowUpDown, X, Sparkles, Music } from 'lucide-react';
import { Mission, EvaluationResult } from '../../types/mission';
import { digitalSimOutput } from '../../audio/digitalSimOutput';
import { evaluateC2 } from '../../compiler/missionEvaluator';
import { missionProgressService } from '../../services/missionProgressService';
import { MissionSuccessModal } from './MissionSuccessModal';

interface MissionModalC2Props {
  mission: Mission;
  onClose: () => void;
  onComplete?: () => void;
}

export const MissionModalC2: React.FC<MissionModalC2Props> = ({
  mission,
  onClose,
  onComplete,
}) => {
  const puzzle = mission.patternPuzzle;
  const initialPieces = puzzle?.pieces || [];
  // Acak urutan awal agar menjadi tantangan puzzle
  const [pieces, setPieces] = useState(() => [...initialPieces].reverse());
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);

  const handlePlayFullTarget = () => {
    if (puzzle?.targetEvents) {
      digitalSimOutput.play(puzzle.targetEvents);
    }
  };

  const handlePlayPiece = (events: any[]) => {
    digitalSimOutput.play(events);
  };

  const handleSwap = () => {
    setPieces((prev) => [...prev].reverse());
  };

  const handleCheck = () => {
    const currentSequence = pieces.map((p) => p.id);
    const res = evaluateC2(currentSequence, mission);
    setEvalResult(res);
    if (res.isCorrect) {
      missionProgressService.saveProgress('C2', res.stars);
      onComplete?.();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 24,
          padding: '24px 20px',
          width: '100%',
          maxWidth: 480,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          position: 'relative',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: '#f1f5f9',
            border: 'none',
            borderRadius: 999,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer',
          }}
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        {/* Header Misi */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#fef3c7',
              color: '#b45309',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 999,
              marginBottom: 6,
            }}
          >
            <Sparkles size={13} /> {mission.code} • {mission.bloomLevel}
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>
            {mission.name}
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
            {mission.activity}
          </p>
        </div>

        {/* Kotak Dengarkan Target */}
        <div
          style={{
            background: '#f0fdf4',
            border: '1.5px solid #bbf7d0',
            borderRadius: 18,
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
              Target Tabuhan
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#14532d', marginTop: 2 }}>
              {puzzle?.targetDescription}
            </div>
          </div>
          <button
            type="button"
            onClick={handlePlayFullTarget}
            style={{
              minHeight: 42,
              padding: '0 14px',
              background: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Volume2 size={16} /> Dengarkan
          </button>
        </div>

        {/* Area Puzzle Susun Potongan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
              Susun Urutan Potongan:
            </span>
            <button
              type="button"
              onClick={handleSwap}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer',
              }}
            >
              <ArrowUpDown size={14} /> Tukar Urutan
            </button>
          </div>

          {pieces.map((piece, idx) => (
            <div
              key={piece.id}
              style={{
                background: '#fafaf9',
                border: '1.5px solid #d6d3d1',
                borderRadius: 16,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: '#e7e5e4',
                    color: '#44403c',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {idx + 1}
                </span>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1c1917' }}>
                    {piece.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#78716c', fontWeight: 600 }}>
                    Nada: {piece.notesText}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handlePlayPiece(piece.events)}
                style={{
                  minHeight: 36,
                  padding: '0 10px',
                  background: '#fef9c3',
                  color: '#854d0e',
                  border: '1px solid #fde047',
                  borderRadius: 10,
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer',
                }}
              >
                <Music size={14} /> Bunyikan
              </button>
            </div>
          ))}
        </div>

        {/* Tombol Periksa Susunan */}
        <button
          type="button"
          onClick={handleCheck}
          style={{
            minHeight: 48,
            width: '100%',
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 16,
            fontWeight: 700,
            fontSize: '0.95rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
          }}
        >
          <CheckCircle2 size={18} /> Periksa Susunan Pola
        </button>

        {/* Modal Hasil */}
        {evalResult && (
          <MissionSuccessModal
            result={evalResult}
            onClose={() => setEvalResult(null)}
            onNextMission={() => {
              setEvalResult(null);
              onClose();
            }}
            onRetry={() => setEvalResult(null)}
          />
        )}
      </div>
    </div>
  );
};
