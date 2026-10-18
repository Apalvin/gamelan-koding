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

  const handlePlaySound = (instrument?: string, note?: string) => {
    gamelanSynth.initAudio();
    if (instrument === 'gong') {
      gamelanSynth.playGong();
    } else {
      gamelanSynth.playSaronNote((note as any) || '1');
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

        {/* Konteks Budaya */}
        <div
          style={{
            background: '#f8fafc',
            borderLeft: '4px solid #f59e0b',
            padding: '10px 12px',
            borderRadius: '0 12px 12px 0',
            fontSize: '0.8rem',
            color: '#475569',
            lineHeight: 1.45,
          }}
        >
          <strong>Konteks Karawitan:</strong> {mission.cultureContext}
        </div>

        {/* Daftar Pertanyaan Kuis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {questions.map((q, idx) => (
            <div
              key={q.id}
              style={{
                background: '#fafaf9',
                border: '1.5px solid #e7e5e4',
                borderRadius: 18,
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1c1917', lineHeight: 1.4 }}>
                  {idx + 1}. {q.prompt}
                </div>
                <button
                  type="button"
                  onClick={() => handlePlaySound(q.soundInstrument, q.soundNote)}
                  style={{
                    minHeight: 40,
                    padding: '0 12px',
                    background: '#fef08a',
                    color: '#713f12',
                    border: '1.5px solid #eab308',
                    borderRadius: 12,
                    fontSize: '0.78rem',
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

              {/* Opsi Jawaban */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      style={{
                        minHeight: 46,
                        padding: '8px 12px',
                        background: isSelected ? '#dcfce7' : 'white',
                        border: isSelected ? '2px solid #16a34a' : '1.5px solid #d6d3d1',
                        borderRadius: 14,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{opt.imageEmoji || '🎵'}</span>
                      <span
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: isSelected ? 700 : 600,
                          color: isSelected ? '#166534' : '#292524',
                        }}
                      >
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Periksa Jawaban */}
        <button
          type="button"
          disabled={!allAnswered}
          onClick={handleCheck}
          style={{
            minHeight: 48,
            width: '100%',
            background: allAnswered
              ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
              : '#cbd5e1',
            color: 'white',
            border: 'none',
            borderRadius: 16,
            fontWeight: 700,
            fontSize: '0.95rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: allAnswered ? 'pointer' : 'not-allowed',
            boxShadow: allAnswered ? '0 4px 14px rgba(16, 185, 129, 0.3)' : 'none',
          }}
        >
          <CheckCircle2 size={18} /> Periksa Jawaban
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
