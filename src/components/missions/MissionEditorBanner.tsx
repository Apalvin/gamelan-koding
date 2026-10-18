import React, { useState } from 'react';
import { Volume2, CheckCircle2, BookmarkCheck, X, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isCollapsed, setIsCollapsed] = useState(false);
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
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: isCollapsed ? 0 : 8,
        position: 'relative',
        zIndex: 10,
        transition: 'all 0.2s ease',
      }}
    >
      {/* Baris 1: Badge Misi, Nama Misi, & Tombol Kontrol Lipat/Keluar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
          <div
            style={{
              background: 'var(--color-yellow)',
              color: 'var(--text-primary)',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px',
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
              fontSize: '0.84rem',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-pill)',
              padding: '3px 8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
            }}
            aria-label={isCollapsed ? 'Buka detail misi' : 'Ciutkan petunjuk'}
          >
            {isCollapsed ? (
              <>
                <span>Detail</span>
                <ChevronDown size={13} />
              </>
            ) : (
              <>
                <span>Tutup</span>
                <ChevronUp size={13} />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onExit}
            style={{
              background: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '3px 8px',
              borderRadius: 'var(--radius-pill)',
            }}
            title="Keluar dari mode misi ke editor bebas"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Konten detail & aksi (disembunyikan saat dicutkan) */}
      {!isCollapsed && (
        <>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.35, paddingTop: 2 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Target: </strong>
            {isC6 ? mission.creativeCriteria?.prompt : mission.editorTarget?.targetDescription}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 2 }}>
            {!isC6 && mission.editorTarget?.targetEvents ? (
              <button
                type="button"
                onClick={handlePlayTarget}
                style={{
                  minHeight: 34,
                  padding: '0 12px',
                  background: 'var(--color-yellow-tint)',
                  color: 'var(--text-primary)',
                  border: '1.5px solid var(--color-yellow)',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <Volume2 size={13} /> Dengar Target
              </button>
            ) : <div />}

            {isC6 ? (
              <button
                type="button"
                onClick={onSaveCreative}
                style={{
                  minHeight: 34,
                  padding: '0 14px',
                  background: 'var(--color-pink)',
                  color: 'var(--text-primary)',
                  border: '1.5px solid var(--text-primary)',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  marginLeft: 'auto',
                }}
              >
                <BookmarkCheck size={14} /> Simpan ke Karyaku
              </button>
            ) : (
              <button
                type="button"
                onClick={onCheck}
                style={{
                  minHeight: 34,
                  padding: '0 14px',
                  background: 'var(--color-pink)',
                  color: 'var(--text-primary)',
                  border: '1.5px solid var(--text-primary)',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  marginLeft: 'auto',
                }}
              >
                <CheckCircle2 size={14} /> Periksa Hasil
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
