import React, { useState } from 'react';
import { X, Plus, Music, Repeat, Sparkles } from 'lucide-react';
import { PALETTE_BLOCKS, PaletteBlockItem } from '../../blockly/toolbox';

interface BlockPaletteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlock: (blockType: string) => void;
}

export const BlockPaletteDrawer: React.FC<BlockPaletteDrawerProps> = ({
  isOpen,
  onClose,
  onAddBlock,
}) => {
  const [filter, setFilter] = useState<'all' | 'gamelan' | 'kontrol'>('all');

  if (!isOpen) return null;

  const filteredBlocks = PALETTE_BLOCKS.filter((block) => {
    if (filter === 'all') return true;
    return block.category === filter;
  });

  return (
    <div className="sheet-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="sheet-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" onClick={onClose} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-squircle)',
                background: 'var(--color-blue-tint)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.08rem',
                  fontWeight: 800,
                  margin: 0,
                  color: 'var(--text-primary)',
                }}
              >
                Pilih Blok Koding
              </h3>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Ketuk blok untuk memasukkan ke lembar kerja
              </div>
            </div>
          </div>

          {/* Dark Circular Close Button Sesuai Classly */}
          <button
            type="button"
            onClick={onClose}
            className="btn-back-circle"
            aria-label="Tutup Palet"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Filter Kategori (Segmented Full-Pill) */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            marginBottom: 14,
            background: 'var(--bg-app)',
            padding: 4,
            borderRadius: 'var(--radius-pill)',
            border: '1.5px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => setFilter('all')}
            style={{
              flex: 1,
              minHeight: 36,
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: filter === 'all' ? 'var(--color-pink)' : 'transparent',
              color: 'var(--text-primary)',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Semua ({PALETTE_BLOCKS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('gamelan')}
            style={{
              flex: 1,
              minHeight: 36,
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: filter === 'gamelan' ? 'var(--color-olive)' : 'transparent',
              color: 'var(--text-primary)',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Gamelan (5)
          </button>
          <button
            type="button"
            onClick={() => setFilter('kontrol')}
            style={{
              flex: 1,
              minHeight: 36,
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: filter === 'kontrol' ? 'var(--color-yellow)' : 'transparent',
              color: 'var(--text-primary)',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Kontrol (1)
          </button>
        </div>

        {/* Daftar Blok */}
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '50vh', paddingRight: 4 }}>
          {filteredBlocks.map((block) => (
            <div
              key={block.type}
              onClick={() => {
                onAddBlock(block.type);
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-card)',
                border: '1.5px solid var(--border-card)',
                background: 'var(--bg-app)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-card)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-squircle)',
                    backgroundColor: block.category === 'gamelan' ? 'var(--color-pink-tint)' : 'var(--color-yellow-tint)',
                    border: `1.5px solid ${block.category === 'gamelan' ? 'var(--color-pink)' : 'var(--color-yellow)'}`,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    flexShrink: 0,
                  }}
                >
                  {block.category === 'gamelan' ? <Music size={18} strokeWidth={2.5} /> : <Repeat size={18} strokeWidth={2.5} />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {block.label}
                    </span>
                    {block.badge && (
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                        }}
                      >
                        {block.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {block.description}
                  </div>
                </div>
              </div>

              <div
                style={{
                  minHeight: 34,
                  padding: '0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--color-pink-tint)',
                  border: '1.5px solid var(--color-pink)',
                  borderRadius: 'var(--radius-pill)',
                  color: 'var(--text-primary)',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  flexShrink: 0,
                }}
              >
                + Pakai
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
