import React, { useState } from 'react';
import { Volume2, CheckCircle2, X, Sparkles } from 'lucide-react';
import { Mission, EvaluationResult } from '../../types/mission';
import { gamelanSynth } from '../../audio/gamelanSynth';
import { evaluateC1 } from '../../compiler/missionEvaluator';
import { missionProgressService } from '../../services/missionProgressService';
import { MissionSuccessModal } from './MissionSuccessModal';

interface MissionModalC1Props {
  mission: Mission;
  onClose: () => void;
  onComplete?: () => void;
}

export const MissionModalC1: React.FC<MissionModalC1Props> = ({
  mission,
  onClose,
  onComplete,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const questions = mission.quiz?.questions || [];

  const handlePlaySound = (instrument?: string, note?: string | number) => {
    gamelanSynth.initAudio();
    if (instrument === 'gong') {
      gamelanSynth.playGong();
    } else {
      gamelanSynth.playSaronNote((note ? String(note) : '1') as any);
    }
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleCheck = () => {
    const res = evaluateC1(answers, mission);
    setEvalResult(res);
    if (res.isCorrect) {
      missionProgressService.saveProgress('C1', res.stars);
      onComplete?.();
    }
  };

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id]);

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
        {/* Dark Circular Back/Close Button */}
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

        {/* Horizontal Step Pills Sesuai Moodboard Classly */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Langkah:
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {questions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              return (
                <div
                  key={q.id}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 'var(--radius-pill)',
                    background: isAnswered ? 'var(--color-pink)' : 'var(--bg-surface)',
                    border: `1.5px solid ${isAnswered ? 'var(--text-primary)' : 'var(--border-card)'}`,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* Konteks Budaya */}
        <div
          style={{
            background: 'var(--bg-surface)',
            borderLeft: '4px solid var(--color-yellow)',
            padding: '10px 12px',
            borderRadius: '0 12px 12px 0',
            fontSize: '0.8rem',
            color: 'var(--text-primary)',
            lineHeight: 1.45,
            border: '1.5px solid var(--border-subtle)',
            borderLeftWidth: 4,
          }}
        >
          <strong>Konteks Karawitan:</strong> {mission.cultureContext}
        </div>

        {/* Daftar Pertanyaan Kuis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {questions.map((q, idx) => (
            <div
              key={q.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1.5px solid var(--border-card)',
                borderRadius: 'var(--radius-card)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {idx + 1}. {q.prompt}
                </div>
                <button
                  type="button"
                  onClick={() => handlePlaySound(q.soundInstrument, q.soundNote)}
                  style={{
                    minHeight: 36,
                    padding: '0 12px',
                    background: 'var(--color-yellow-tint)',
                    color: 'var(--text-primary)',
                    border: '1.5px solid var(--color-yellow)',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <Volume2 size={15} /> Dengarkan
                </button>
              </div>

              {/* Opsi Jawaban Radio Pills Sesuai Classly */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      style={{
                        minHeight: 48,
                        padding: '8px 12px',
                        background: isSelected ? 'var(--color-pink-tint)' : 'var(--bg-app)',
                        border: isSelected ? '2px solid var(--text-primary)' : '1.5px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.12s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <span style={{ fontSize: '1.15rem' }}>{opt.imageEmoji || '🎵'}</span>
                        <span
                          style={{
                            fontSize: '0.84rem',
                            fontWeight: isSelected ? 800 : 700,
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {opt.label}
                        </span>
                      </div>

                      {/* Radio Bullet Indicator */}
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          border: `1.5px solid ${isSelected ? 'var(--text-primary)' : 'rgba(45, 45, 43, 0.3)'}`,
                          background: isSelected ? 'var(--color-pink)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && (
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-primary)' }} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Periksa Jawaban Full-Pill CTA */}
        <button
          type="button"
          disabled={!allAnswered}
          onClick={handleCheck}
          style={{
            minHeight: 48,
            width: '100%',
            background: allAnswered ? 'var(--color-pink)' : 'var(--bg-surface)',
            color: allAnswered ? 'var(--text-primary)' : 'var(--text-muted)',
            border: allAnswered ? '1.5px solid var(--text-primary)' : '1.5px solid var(--border-subtle)',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 800,
            fontSize: '0.94rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: allAnswered ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s ease',
          }}
        >
          <CheckCircle2 size={18} strokeWidth={2.5} /> Periksa Jawaban
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
