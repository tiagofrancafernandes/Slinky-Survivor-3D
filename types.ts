
export enum GameStatus {
  START = 'START',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER',
  SETTINGS = 'SETTINGS'
}

export type Language = 'en' | 'pt-BR';

export interface GameSettings {
  language: Language;
  sound: boolean;
  volume: number;
  difficulty: number;
  autoRestart: boolean;
}

export interface Entity {
  id: string;
  type: 'obstacle' | 'food';
  kind: 'rock' | 'log' | 'root' | 'insect' | 'mouse' | 'frog';
  position: [number, number, number];
  size: number;
}
