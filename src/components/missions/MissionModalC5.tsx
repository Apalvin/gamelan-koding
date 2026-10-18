import React, { useState } from 'react';
import { CheckCircle2, X, Sparkles, HelpCircle } from 'lucide-react';
import { Mission, EvaluationResult } from '../../types/mission';
import { evaluateC5 } from '../../compiler/missionEvaluator';
import { missionProgressService } from '../../services/missionProgressService';
import { MissionSuccessModal } from './MissionSuccessModal';

interface MissionModalC5Props {
  mission: Mission;
  onClose: () => void;
  onComplete?: () => void;
}

export const MissionModalC5: React.FC<MissionModalC5Props> = ({
  mission,
  onClose,
  onComplete,
}) => {
  const task = mission.curatorTask;
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);

  const handleCheck = () => {
    if (!selectedOption || !selectedReason) return;
    const res = evaluateC5(selectedOption, selectedReason, mission);
    setEvalResult(res);
    if (res.isCorrect) {
      missionProgressService.saveProgress('C5', res.stars);
      onComplete?.();
    }
  };

  const isReady = !!selectedOption && !!selectedReason;

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

        {/* Horizontal Step Pills Sesuai Classly */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Langkah:
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: '1', label: '1. Pilih Program', isDone: !!selectedOption },
              { id: '2', label: '2. Tentukan Alasan', isDone: !!selectedReason },
            ].map((st) => (
              <div
                key={st.id}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  background: st.isDone ? 'var(--color-pink)' : 'var(--bg-surface)',
                  border: `1.5px solid ${st.isDone ? 'var(--text-primary)' : 'var(--border-card)'}`,
                  color: 'var(--text-primary)',
                  fontWeight: 800,
                  fontSize: '0.76rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.15s ease',
                }}
              >
                {st.label}
              </div>
            ))}
          </div>
        </div>

        {/* Soal Tantangan */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border-card)',
            borderRadius: 'var(--radius-card)',
            padding: '14px 16px',
            fontSize: '0.86rem',
            color: 'var(--text-primary)',
            lineHeight: 1.5,
          }}
        >
          <strong>Tantangan Kurasi:</strong> {task?.prompt}
        </div>

        {/* Pilihan Program A vs B */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            1. Pilih Program yang Paling Rapi & Efisien:
          </span>

          {task?.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedOption(opt.id)}
                style={{
                  background: isSelected ? 'var(--color-pink-tint)' : 'var(--bg-surface)',
                  border: isSelected ? '2px solid var(--text-primary)' : '1.5px solid var(--border-card)',
                  borderRadius: 'var(--radius-card)',
                  padding: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.94rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {opt.title}
                  </span>
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
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  {opt.codeDescription}
                </div>
              </button>
            );
          })}
        </div>

        {/* Pilihan Alasan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            2. Apa Alasan Logismu Memilih Program Tersebut?
          </span>

          {task?.reasons.map((r) => {
            const isSelected = selectedReason === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedReason(r.id)}
                style={{
                  background: isSelected ? 'var(--color-yellow-tint)' : 'var(--bg-surface)',
                  border: isSelected ? '2px solid var(--text-primary)' : '1.5px solid var(--border-card)',
                  borderRadius: 'var(--radius-card)',
                  padding: '12px 14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  fontWeight: isSelected ? 800 : 600,
                  color: 'var(--text-primary)',
                  lineHeight: 1.45,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{r.label}</span>
                {/* Radio Bullet Indicator */}
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: `1.5px solid ${isSelected ? 'var(--text-primary)' : 'rgba(45, 45, 43, 0.3)'}`,
                    background: isSelected ? 'var(--color-yellow)' : 'transparent',
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

        {/* Tombol Periksa Evaluasi Full-Pill CTA */}
        <button
          type="button"
          disabled={!isReady}
          onClick={handleCheck}
          style={{
            minHeight: 48,
            width: '100%',
            background: isReady ? 'var(--color-pink)' : 'var(--bg-surface)',
            color: isReady ? 'var(--text-primary)' : 'var(--text-muted)',
            border: isReady ? '1.5px solid var(--text-primary)' : '1.5px solid var(--border-subtle)',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 800,
            fontSize: '0.94rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: isReady ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s ease',
          }}
        >
          <CheckCircle2 size={18} strokeWidth={2.5} /> Periksa Hasil Evaluasi
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
