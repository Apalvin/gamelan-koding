import React from 'react';
import { Volume2, CheckCircle2, BookmarkCheck, X, Sparkles, HelpCircle } from 'lucide-react';
import { Mission } from '../../types/mission';
import { digitalSimOutput } from '../../audio/digitalSimOutput';

interface MissionEditorBannerProps {
  mission: Mission;
  onCheck: () => void;
  onExit: () => void;
  onSaveCreative?: () => void;
}

export const MissionEditorBanner: React.FC<MissionEditorBannerProps> = ({
  mission,
  onCheck,
  onExit,
  onSaveCreative,
}) => {
  const isC6 = mission.code === 'C6';

  const handlePlayTarget = () => {
    if (mission.editorTarget?.targetEvents) {
      digitalSimOutput.play(mission.editorTarget.targetEvents);
    }
  };

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1.5px solid var(--border-card)',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <div
            style={{
              background: 'var(--color-yellow)',
              color: 'var(--text-primary)',
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 'var(--radius-squircle)',
              border: '1px solid rgba(45, 45, 43, 0.15)',
              flexShrink: 0,
            }}
          >
            {mission.code} • {mission.bloomLevel}
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.94rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {mission.name}
          </span>
        </div>

        <button
          type="button"
          onClick={onExit}
          style={{
            background: 'var(--bg-app)',
            border: '1.5px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.74rem',
            fontWeight: 800,
            cursor: 'pointer',
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
          }}
          title="Keluar dari mode misi ke editor bebas"
        >
          <X size={14} /> Keluar
        </button>
      </div>

      <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
        <strong style={{ color: 'var(--text-primary)' }}>Target: </strong>
        {isC6 ? mission.creativeCriteria?.prompt : mission.editorTarget?.targetDescription}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        {!isC6 && mission.editorTarget?.targetEvents && (
          <button
            type="button"
            onClick={handlePlayTarget}
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
            }}
          >
            <Volume2 size={15} /> Dengar Pola Target
          </button>
        )}

        {isC6 ? (
          <button
            type="button"
            onClick={onSaveCreative}
            style={{
              minHeight: 38,
              padding: '0 16px',
              background: 'var(--color-pink)',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--text-primary)',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            <BookmarkCheck size={16} /> Simpan ke Karyaku
          </button>
        ) : (
          <button
            type="button"
            onClick={onCheck}
            style={{
              minHeight: 38,
              padding: '0 16px',
              background: 'var(--color-pink)',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--text-primary)',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            <CheckCircle2 size={16} /> Periksa Hasil
          </button>
        )}
      </div>
    </div>
  );
};
