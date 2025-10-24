export interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  nextFruitId: number;
  fruitCount: number;
}

export interface GameConfig {
  maxFruits: number;
  gameOverLine: number;
}

export type GameEvent = 
  | { type: 'START_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'RESET_GAME' }
  | { type: 'SET_NEXT_FRUIT'; payload: number }
  | { type: 'INCREMENT_FRUIT_COUNT' }
  | { type: 'RESET_FRUIT_COUNT' };
