import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly';
import { compileWorkspace } from '../../src/compiler/compileWorkspace';
import { registerGamelanBlocks } from '../../src/blockly/blocks/gamelanBlocks';

describe('compileWorkspace', () => {
  let workspace: Blockly.Workspace;

  beforeEach(() => {
    registerGamelanBlocks();
    workspace = new Blockly.Workspace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it('harus mengembalikan EMPTY_PROGRAM jika lembar kerja kosong', () => {
    const result = compileWorkspace(workspace);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe('EMPTY_PROGRAM');
    }
  });

  it('harus mengembalikan EMPTY_PROGRAM jika blok ketika_mulai belum memiliki sambungan', () => {
    workspace.newBlock('ketika_mulai');
    const result = compileWorkspace(workspace);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe('EMPTY_PROGRAM');
    }
  });

  it('harus mengompilasi program sederhana: ketika_mulai -> tabuh_saron 1 (ji)', () => {
    const hatBlock = workspace.newBlock('ketika_mulai');
    const saronBlock = workspace.newBlock('tabuh_saron');
    saronBlock.setFieldValue('saron', 'INSTRUMENT');
    saronBlock.setFieldValue('1', 'NOTE');

    // Sambungkan hat block ke saron block
    hatBlock.nextConnection.connect(saronBlock.previousConnection);

    const result = compileWorkspace(workspace);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.events).toHaveLength(1);
      expect(result.events[0]).toMatchObject({
        tMs: 0,
        instrument: 'saron',
        note: '1',
        velocity: 90,
      });
      expect(result.totalDurationMs).toBe(1000);
    }
  });

  it('harus menghitung jeda dan tempo dengan tepat', () => {
    const hat = workspace.newBlock('ketika_mulai');
    const tempo = workspace.newBlock('atur_tempo');
    tempo.setFieldValue('120', 'BPM'); // 120 BPM = 500ms per beat

    const hit1 = workspace.newBlock('tabuh_saron');
    hit1.setFieldValue('1', 'NOTE');

    const jeda = workspace.newBlock('jeda_ketuk');
    jeda.setFieldValue('2', 'BEATS'); // jeda 2 ketuk = 1000ms

    const gong = workspace.newBlock('tabuh_gong');

    // Hubungkan rantai blok
    hat.nextConnection.connect(tempo.previousConnection);
    tempo.nextConnection.connect(hit1.previousConnection);
    hit1.nextConnection.connect(jeda.previousConnection);
    jeda.nextConnection.connect(gong.previousConnection);

    const result = compileWorkspace(workspace);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.events).toHaveLength(2); // hit1 dan gong
      // hit1 pada t = 0
      expect(result.events[0].tMs).toBe(0);
      expect(result.events[0].note).toBe('1');
      // hit1 (500ms) + jeda 2 ketuk (1000ms) -> gong pada t = 1500ms
      expect(result.events[1].tMs).toBe(1500);
      expect(result.events[1].instrument).toBe('gong');
    }
  });

  it('harus mengompilasi blok pengulangan controls_repeat_ext', () => {
    const hat = workspace.newBlock('ketika_mulai');
    const loop = workspace.newBlock('controls_repeat_ext');

    // Angka 4 kali
    const numBlock = workspace.newBlock('math_number');
    numBlock.setFieldValue('4', 'NUM');
    loop.getInput('TIMES')!.connection!.connect(numBlock.outputConnection!);

    const hit = workspace.newBlock('tabuh_saron');
    hit.setFieldValue('3', 'NOTE');
    loop.getInput('DO')!.connection!.connect(hit.previousConnection);

    hat.nextConnection.connect(loop.previousConnection);

    const result = compileWorkspace(workspace);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.events).toHaveLength(4);
      expect(result.events.map((e) => e.tMs)).toEqual([0, 1000, 2000, 3000]);
      expect(result.events.every((e) => e.note === '3')).toBe(true);
    }
  });

  it('harus menangkap infinite loop dengan guard dan mengembalikan error ramah anak', () => {
    const hat = workspace.newBlock('ketika_mulai');
    const loop = workspace.newBlock('controls_repeat_ext');

    // Ulangi 200 kali dengan batas maxSteps = 50
    const numBlock = workspace.newBlock('math_number');
    numBlock.setFieldValue('200', 'NUM');
    loop.getInput('TIMES')!.connection!.connect(numBlock.outputConnection!);

    const hit = workspace.newBlock('tabuh_saron');
    loop.getInput('DO')!.connection!.connect(hit.previousConnection);

    hat.nextConnection.connect(loop.previousConnection);

    const result = compileWorkspace(workspace, { maxSteps: 50, maxEvents: 2000 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe('INFINITE_LOOP');
      expect(result.error).toContain('Loop terlalu panjang atau tak terbatas');
    }
  });

  it('harus menangkap event overflow jika jumlah tabuhan melebihi maxEvents', () => {
    const hat = workspace.newBlock('ketika_mulai');
    const loop = workspace.newBlock('controls_repeat_ext');

    // Ulangi 20 kali dengan batas maxEvents = 5
    const numBlock = workspace.newBlock('math_number');
    numBlock.setFieldValue('20', 'NUM');
    loop.getInput('TIMES')!.connection!.connect(numBlock.outputConnection!);

    const hit = workspace.newBlock('tabuh_saron');
    loop.getInput('DO')!.connection!.connect(hit.previousConnection);

    hat.nextConnection.connect(loop.previousConnection);

    const result = compileWorkspace(workspace, { maxSteps: 5000, maxEvents: 5 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe('EVENT_OVERFLOW');
      expect(result.error).toContain('Jumlah tabuhan melebihi batas aman');
    }
  });
});
