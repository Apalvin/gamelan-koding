import { GamelanEvent, SlendroNote } from './gamelan';

export type BloomLevel =
  | 'Mengingat'
  | 'Memahami'
  | 'Menerapkan'
  | 'Menganalisis'
  | 'Mengevaluasi'
  | 'Mencipta';

export type MissionCode = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';

export type MissionStatus = 'belum' | 'sedang' | 'selesai';

export interface EvaluationResult {
  isCorrect: boolean;
  stars: number; // 0..3
  title: string;
  message: string;
  detail?: string;
  hint?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  soundInstrument?: string;
  soundNote?: SlendroNote | string;
  options: { id: string; label: string; imageEmoji?: string }[];
  correctAnswerId: string;
  explanation: string;
}

export interface PatternPiece {
  id: string;
  label: string;
  notesText: string;
  events: GamelanEvent[];
}

export interface PatternPuzzle {
  targetDescription: string;
  targetEvents: GamelanEvent[];
  pieces: PatternPiece[];
  correctSequence: string[];
}

export interface EditorTarget {
  targetDescription: string;
  targetNotation: string;
  targetEvents: GamelanEvent[];
  initialBuggyXml?: string;
  hint?: string;
}

export interface CuratorOption {
  id: string;
  title: string;
  codeDescription: string;
  explanation: string;
}

export interface CuratorReason {
  id: string;
  label: string;
}

export interface CuratorTask {
  prompt: string;
  options: CuratorOption[];
  correctOptionId: string;
  reasons: CuratorReason[];
  correctReasonId: string;
}

export interface CreativeCriteria {
  minEvents: number;
  maxEvents: number;
  prompt: string;
  examples: string[];
}

export interface Mission {
  id: string;
  code: MissionCode;
  bloomLevel: BloomLevel;
  name: string;
  activity: string;
  cultureContext: string;
  validatedBy: string | null;
  sourceNote: string;
  isRecommended?: boolean;
  quiz?: {
    questions: QuizQuestion[];
  };
  patternPuzzle?: PatternPuzzle;
  editorTarget?: EditorTarget;
  curatorTask?: CuratorTask;
  creativeCriteria?: CreativeCriteria;
}

export interface MissionProgressRecord {
  status: MissionStatus;
  stars: number;
  completedAt?: string;
}

export type MissionProgressMap = Record<string, MissionProgressRecord>;
