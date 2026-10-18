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
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
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
          maxWidth: 420,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
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

        {/* Bintang Apresiasi */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, marginTop: 4 }}>
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: starIdx <= result.stars ? '#fef3c7' : '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: starIdx <= result.stars ? '#f59e0b' : '#cbd5e1',
                transform: starIdx <= result.stars ? 'scale(1.05)' : 'scale(0.95)',
                transition: 'all 0.3s ease',
              }}
            >
              <Star
                size={26}
                fill={starIdx <= result.stars ? '#f59e0b' : 'transparent'}
              />
            </div>
          ))}
        </div>

        {/* Badge status */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: result.isCorrect ? '#dcfce7' : '#fef3c7',
            color: result.isCorrect ? '#166534' : '#92400e',
            fontSize: '0.8rem',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: 999,
            marginBottom: 8,
          }}
        >
          <Sparkles size={14} />
          {result.isCorrect ? 'Misi Berhasil!' : 'Terus Semangat!'}
        </div>

        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 8px',
          }}
        >
          {result.title}
        </h3>

        <p
          style={{
            fontSize: '0.9rem',
            color: '#334155',
            lineHeight: 1.5,
            margin: '0 0 16px',
          }}
        >
          {result.message}
        </p>

        {result.hint && (
          <div
            style={{
              background: '#eff6ff',
              border: '1.5px solid #bfdbfe',
              color: '#1e40af',
              padding: '10px 14px',
              borderRadius: 14,
              fontSize: '0.82rem',
              textAlign: 'left',
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: 16,
              lineHeight: 1.4,
            }}
          >
            <strong>💡 Petunjuk:</strong> {result.hint}
          </div>
        )}

        {/* Tombol Aksi */}
        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          {onRetry && !result.isCorrect && (
            <button
              type="button"
              onClick={onRetry}
              style={{
                flex: 1,
                minHeight: 46,
                background: '#f1f5f9',
                color: '#334155',
                border: 'none',
                borderRadius: 14,
                fontWeight: 700,
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
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 14,
                fontWeight: 700,
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
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
                background: result.isCorrect ? '#10b981' : '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: 14,
                fontWeight: 700,
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
