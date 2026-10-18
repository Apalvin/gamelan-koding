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

        {/* Soal Tantangan */}
        <div
          style={{
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: 16,
            padding: '12px 14px',
            fontSize: '0.86rem',
            color: '#1e293b',
            lineHeight: 1.5,
          }}
        >
          <strong>Tantangan Kurasi:</strong> {task?.prompt}
        </div>

        {/* Pilihan Program A vs B */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
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
                  background: isSelected ? '#f0fdf4' : 'white',
                  border: isSelected ? '2px solid #16a34a' : '1.5px solid #cbd5e1',
                  borderRadius: 16,
                  padding: '12px 14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      color: isSelected ? '#15803d' : '#0f172a',
                    }}
                  >
                    {opt.title}
                  </span>
                  {isSelected && <CheckCircle2 size={18} color="#16a34a" />}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                  {opt.codeDescription}
                </div>
              </button>
            );
          })}
        </div>

        {/* Pilihan Alasan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
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
                  background: isSelected ? '#eff6ff' : 'white',
                  border: isSelected ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                  borderRadius: 14,
                  padding: '10px 12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? '#1e40af' : '#334155',
                  lineHeight: 1.4,
                  transition: 'all 0.15s ease',
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Tombol Periksa Evaluasi */}
        <button
          type="button"
          disabled={!isReady}
          onClick={handleCheck}
          style={{
            minHeight: 48,
            width: '100%',
            background: isReady
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
            cursor: isReady ? 'pointer' : 'not-allowed',
            boxShadow: isReady ? '0 4px 14px rgba(16, 185, 129, 0.3)' : 'none',
          }}
        >
          <CheckCircle2 size={18} /> Periksa Hasil Evaluasi
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
