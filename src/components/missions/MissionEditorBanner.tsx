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
        background: 'linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%)',
        borderBottom: '2px solid #fde047',
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <div
            style={{
              background: '#f59e0b',
              color: 'white',
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 8,
              flexShrink: 0,
            }}
          >
            {mission.code} • {mission.bloomLevel}
          </div>
          <span
            style={{
              fontSize: '0.92rem',
              fontWeight: 800,
              color: '#78350f',
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
            background: 'none',
            border: 'none',
            color: '#92400e',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 6,
          }}
          title="Keluar dari mode misi ke editor bebas"
        >
          <X size={15} /> Keluar Misi
        </button>
      </div>

      <div style={{ fontSize: '0.8rem', color: '#92400e', lineHeight: 1.4 }}>
        <strong>Target: </strong>
        {isC6 ? mission.creativeCriteria?.prompt : mission.editorTarget?.targetDescription}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        {!isC6 && mission.editorTarget?.targetEvents && (
          <button
            type="button"
            onClick={handlePlayTarget}
            style={{
              minHeight: 36,
              padding: '0 12px',
              background: '#fde047',
              color: '#713f12',
              border: '1.5px solid #eab308',
              borderRadius: 10,
              fontSize: '0.78rem',
              fontWeight: 700,
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
              minHeight: 36,
              padding: '0 14px',
              background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              marginLeft: 'auto',
              boxShadow: '0 2px 6px rgba(219, 39, 119, 0.25)',
            }}
          >
            <BookmarkCheck size={16} /> Simpan ke Karyaku
          </button>
        ) : (
          <button
            type="button"
            onClick={onCheck}
            style={{
              minHeight: 36,
              padding: '0 14px',
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              marginLeft: 'auto',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
            }}
          >
            <CheckCircle2 size={16} /> Periksa Hasil
          </button>
        )}
      </div>
    </div>
  );
};
