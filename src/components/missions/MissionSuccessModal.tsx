import React from 'react';
import { Star, Sparkles, ArrowRight, RotateCcw, X } from 'lucide-react';
import { EvaluationResult } from '../../types/mission';

interface MissionSuccessModalProps {
  result: EvaluationResult;
  onClose: () => void;
  onNextMission?: () => void;
  onRetry?: () => void;
}

export const MissionSuccessModal: React.FC<MissionSuccessModalProps> = ({
  result,
  onClose,
  onNextMission,
  onRetry,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(45, 45, 43, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
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
          padding: '24px 20px',
          width: '100%',
          maxWidth: 420,
          border: '1.5px solid var(--border-card)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          animation: 'fadeSlideUp 0.25s ease-out',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="btn-back-circle"
          style={{ position: 'absolute', top: 16, right: 16 }}
          aria-label="Tutup"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* Bintang Apresiasi */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, marginTop: 6 }}>
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= result.stars;
            return (
              <div
                key={starIdx}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 'var(--radius-squircle)',
                  background: isEarned ? 'var(--color-yellow-tint)' : 'var(--bg-surface)',
                  border: `1.5px solid ${isEarned ? 'var(--color-yellow)' : 'var(--border-subtle)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isEarned ? 'var(--color-yellow)' : 'rgba(45, 45, 43, 0.25)',
                  transform: isEarned ? 'scale(1.05)' : 'scale(0.95)',
                  transition: 'all 0.3s ease',
                }}
              >
                <Star
                  size={26}
                  fill={isEarned ? 'var(--color-yellow)' : 'transparent'}
                />
              </div>
            );
          })}
        </div>

        {/* Badge status */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: result.isCorrect ? 'var(--color-olive-tint)' : 'var(--color-yellow-tint)',
            border: `1.5px solid ${result.isCorrect ? 'var(--color-olive)' : 'var(--color-yellow)'}`,
            color: 'var(--text-primary)',
            fontSize: '0.8rem',
            fontWeight: 800,
            padding: '4px 14px',
            borderRadius: 'var(--radius-pill)',
            marginBottom: 10,
          }}
        >
          <Sparkles size={14} />
          {result.isCorrect ? 'Misi Berhasil!' : 'Terus Semangat!'}
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '0 0 8px',
          }}
        >
          {result.title}
        </h3>

        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-primary)',
            lineHeight: 1.5,
            margin: '0 0 16px',
            opacity: 0.9,
          }}
        >
          {result.message}
        </p>

        {result.hint && (
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1.5px solid var(--color-yellow)',
              color: 'var(--text-primary)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-card)',
              fontSize: '0.82rem',
              textAlign: 'left',
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: 16,
              lineHeight: 1.45,
            }}
          >
            <strong>💡 Petunjuk:</strong> {result.hint}
          </div>
        )}

        {/* Tombol Aksi Full-Pill */}
        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          {onRetry && !result.isCorrect && (
            <button
              type="button"
              onClick={onRetry}
              style={{
                flex: 1,
                minHeight: 46,
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                border: '1.5px solid var(--border-subtle)',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 800,
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={18} /> Coba Lagi
            </button>
          )}

          {result.isCorrect && onNextMission ? (
            <button
              type="button"
              onClick={onNextMission}
              style={{
                flex: 1,
                minHeight: 46,
                background: 'var(--color-pink)',
                color: 'var(--text-primary)',
                border: '1.5px solid var(--text-primary)',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 800,
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              Lanjut Misi <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                minHeight: 46,
                background: result.isCorrect ? 'var(--color-pink)' : 'var(--color-yellow)',
                color: 'var(--text-primary)',
                border: '1.5px solid var(--text-primary)',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 800,
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {result.isCorrect ? 'Selesai' : 'Perbaiki Blok'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
