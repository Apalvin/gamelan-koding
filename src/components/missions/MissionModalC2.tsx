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
        backgroundColor: 'rgba(45, 45, 43, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: 'var(--bg-app)',
          borderRadius: 24,
          padding: '22px 18px',
          width: '100%',
          maxWidth: 480,
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1.5px solid var(--border-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          position: 'relative',
        }}
      >
        {/* Dark Circular Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn-back-circle"
          style={{ position: 'absolute', top: 16, right: 16 }}
          aria-label="Tutup"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* Header Misi */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--color-yellow)',
              color: 'var(--text-primary)',
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(45, 45, 43, 0.15)',
              marginBottom: 8,
            }}
          >
            <Sparkles size={13} /> {mission.code} • {mission.bloomLevel}
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              fontWeight: 800,
              margin: '0 0 4px',
              color: 'var(--text-primary)',
              paddingRight: 40,
            }}
          >
            {mission.name}
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
            {mission.activity}
          </p>
        </div>

        {/* Kotak Dengarkan Target */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border-card)',
            borderRadius: 'var(--radius-card)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Target Tabuhan
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.94rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginTop: 2,
              }}
            >
              {puzzle?.targetDescription}
            </div>
          </div>
          <button
            type="button"
            onClick={handlePlayFullTarget}
            style={{
              minHeight: 38,
              padding: '0 14px',
              background: 'var(--color-yellow-tint)',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--color-yellow)',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.8rem',
              fontWeight: 800,
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
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Susun Urutan Potongan:
            </span>
            <button
              type="button"
              onClick={handleSwap}
              style={{
                background: 'var(--color-blue-tint)',
                border: '1.5px solid var(--color-periwinkle)',
                borderRadius: 'var(--radius-pill)',
                color: 'var(--text-primary)',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '4px 12px',
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
                background: 'var(--bg-surface)',
                border: '1.5px solid var(--border-card)',
                borderRadius: 'var(--radius-card)',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-squircle)',
                    background: 'var(--bg-app)',
                    border: '1.5px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {idx + 1}
                </span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {piece.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Nada: {piece.notesText}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handlePlayPiece(piece.events)}
                style={{
                  minHeight: 34,
                  padding: '0 12px',
                  background: 'var(--color-yellow-tint)',
                  color: 'var(--text-primary)',
                  border: '1.5px solid var(--color-yellow)',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.76rem',
                  fontWeight: 800,
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

        {/* Tombol Periksa Susunan Full-Pill CTA */}
        <button
          type="button"
          onClick={handleCheck}
          style={{
            minHeight: 48,
            width: '100%',
            background: 'var(--color-pink)',
            color: 'var(--text-primary)',
            border: '1.5px solid var(--text-primary)',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 800,
            fontSize: '0.94rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <CheckCircle2 size={18} strokeWidth={2.5} /> Periksa Susunan Pola
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
