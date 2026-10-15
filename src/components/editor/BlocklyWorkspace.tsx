import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { registerGamelanBlocks } from '../../blockly/blocks/gamelanBlocks';
import { gamelanTheme } from '../../blockly/theme/gamelanTheme';

interface BlocklyWorkspaceProps {
  onWorkspaceReady?: (workspace: Blockly.WorkspaceSvg) => void;
}

// Inisialisasi blok kustom gamelan sekali saat modul dimuat
registerGamelanBlocks();

export const BlocklyWorkspace: React.FC<BlocklyWorkspaceProps> = ({
  onWorkspaceReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Bersihkan workspace lama jika ada
    if (workspaceRef.current) {
      workspaceRef.current.dispose();
      workspaceRef.current = null;
    }

    // Konfigurasi Blockly sesuai PRD (portrait-friendly, ramah anak)
    const ws = Blockly.inject(containerRef.current, {
      theme: gamelanTheme,
      renderer: 'zelos', // Renderer modern dengan gaya blok Scratch yang bulat ramah anak
      trashcan: true,
      scrollbars: true,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.95,
        maxScale: 1.8,
        minScale: 0.5,
        scaleSpeed: 1.1,
      },
      grid: {
        spacing: 24,
        length: 3,
        colour: '#e2e8f0',
        snap: true,
      },
      sounds: false,
    });

    workspaceRef.current = ws;

    // Tambahkan blok awal "ketika ▶ ditekan" secara default agar siswa tidak bingung
    if (ws.getAllBlocks(false).length === 0) {
      const startBlock = ws.newBlock('ketika_mulai');
      startBlock.initSvg();
      startBlock.render();
      startBlock.moveBy(36, 40);
    }

    if (onWorkspaceReady) {
      onWorkspaceReady(ws);
    }

    // Penyesuaian ukuran otomatis (responsive)
    const handleResize = () => {
      if (ws) {
        Blockly.svgResize(ws);
      }
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f8fafc',
      }}
      aria-label="Kanvas Koding Blockly"
    />
  );
};

/**
 * Helper untuk menambahkan blok dari bottom sheet palet ke dalam workspace
 */
export function addBlockToWorkspace(workspace: Blockly.WorkspaceSvg, blockType: string) {
  if (!workspace) return;

  const newBlock = workspace.newBlock(blockType);

  // Jika blok bawaan pengulangan (controls_repeat_ext), buatkan juga angka bayangan (shadow) 4 kali
  if (blockType === 'controls_repeat_ext') {
    const numBlock = workspace.newBlock('math_number');
    numBlock.setFieldValue('4', 'NUM');
    numBlock.setShadow(true);
    numBlock.initSvg();
    numBlock.render();

    const timesInput = newBlock.getInput('TIMES');
    if (timesInput && timesInput.connection && numBlock.outputConnection) {
      timesInput.connection.connect(numBlock.outputConnection);
    }
  }

  newBlock.initSvg();
  newBlock.render();

  // Cari blok paling bawah di tumpukan utama untuk menyambungkan secara otomatis
  const topBlocks = workspace.getTopBlocks(true);
  let connected = false;

  if (topBlocks.length > 0 && newBlock.previousConnection) {
    let currentBlock: Blockly.Block | null = topBlocks[0];
    while (currentBlock && currentBlock.getNextBlock()) {
      currentBlock = currentBlock.getNextBlock();
    }

    if (currentBlock && currentBlock.nextConnection && !currentBlock.nextConnection.isConnected()) {
      currentBlock.nextConnection.connect(newBlock.previousConnection);
      connected = true;
    }
  }

  // Jika tidak dapat disambung otomatis, tempatkan di dekat blok sebelumnya atau tengah
  if (!connected) {
    if (topBlocks.length > 0) {
      const lastBlock = topBlocks[topBlocks.length - 1];
      const pos = lastBlock.getRelativeToSurfaceXY();
      newBlock.moveBy(pos.x, pos.y + 70);
    } else {
      newBlock.moveBy(40, 50);
    }
  }

  newBlock.select();
}
