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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                Pilih Blok Koding
              </h3>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Ketuk blok untuk memasukkan ke lembar kerja</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              minWidth: 44,
              minHeight: 44,
              borderRadius: '50%',
              border: 'none',
              background: '#f1f5f9',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Tutup Palet"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Kategori */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => setFilter('all')}
            style={{
              flex: 1,
              minHeight: 38,
              borderRadius: 10,
              border: 'none',
              background: filter === 'all' ? '#0f172a' : '#f1f5f9',
              color: filter === 'all' ? 'white' : '#475569',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            Semua ({PALETTE_BLOCKS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('gamelan')}
            style={{
              flex: 1,
              minHeight: 38,
              borderRadius: 10,
              border: 'none',
              background: filter === 'gamelan' ? '#0d9488' : '#f1f5f9',
              color: filter === 'gamelan' ? 'white' : '#475569',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            Gamelan (5)
          </button>
          <button
            type="button"
            onClick={() => setFilter('kontrol')}
            style={{
              flex: 1,
              minHeight: 38,
              borderRadius: 10,
              border: 'none',
              background: filter === 'kontrol' ? '#f59e0b' : '#f1f5f9',
              color: filter === 'kontrol' ? 'white' : '#475569',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            Kontrol (1)
          </button>
        </div>

        {/* Daftar Blok */}
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '50vh', paddingRight: 4 }}>
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
                borderRadius: 14,
                border: '2px solid #e2e8f0',
                background: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = block.color)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: block.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    flexShrink: 0,
                  }}
                >
                  {block.category === 'gamelan' ? <Music size={18} /> : <Repeat size={18} />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b' }}>
                      {block.label}
                    </span>
                    {block.badge && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '2px 6px',
                          borderRadius: 6,
                        }}
                      >
                        {block.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                    {block.description}
                  </div>
                </div>
              </div>

              <div
                style={{
                  minWidth: 44,
                  minHeight: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f8fafc',
                  borderRadius: 10,
                  color: '#2563eb',
                  fontWeight: 700,
                  fontSize: '0.8rem',
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
