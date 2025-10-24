import type { GameState, GameEvent } from '../types/game';
import { GAME_CONFIG } from '../constants/fruits';

export class GameStateManager {
  private state: GameState;
  private config: { maxFruits: number; gameOverLine: number };

  constructor() {
    this.config = {
      maxFruits: GAME_CONFIG.MAX_FRUITS,
      gameOverLine: GAME_CONFIG.GAME_OVER_LINE
    };
    
    this.state = {
      isPlaying: false,
      isGameOver: false,
      score: 0,
      nextFruitId: 0, // 체리부터 시작
      fruitCount: 0
    };
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public dispatch(event: GameEvent): GameState {
    switch (event.type) {
      case 'START_GAME':
        this.state = {
          ...this.state,
          isPlaying: true,
          isGameOver: false,
          score: 0,
          nextFruitId: 0,
          fruitCount: 0
        };
        break;

      case 'GAME_OVER':
        this.state = {
          ...this.state,
          isPlaying: false,
          isGameOver: true
        };
        break;

      case 'UPDATE_SCORE':
        this.state = {
          ...this.state,
          score: this.state.score + event.payload
        };
        break;

      case 'RESET_GAME':
        this.state = {
          isPlaying: false,
          isGameOver: false,
          score: 0,
          nextFruitId: 0,
          fruitCount: 0
        };
        break;

      case 'SET_NEXT_FRUIT':
        this.state = {
          ...this.state,
          nextFruitId: event.payload
        };
        break;

      case 'INCREMENT_FRUIT_COUNT':
        this.state = {
          ...this.state,
          fruitCount: this.state.fruitCount + 1
        };
        break;

      case 'RESET_FRUIT_COUNT':
        this.state = {
          ...this.state,
          fruitCount: 0
        };
        break;
    }

    return this.getState();
  }

  public isGameOver(): boolean {
    return this.state.isGameOver;
  }

  public isPlaying(): boolean {
    return this.state.isPlaying;
  }

  public getScore(): number {
    return this.state.score;
  }

  public getNextFruitId(): number {
    return this.state.nextFruitId;
  }

  public getFruitCount(): number {
    return this.state.fruitCount;
  }

  public canAddFruit(): boolean {
    return this.state.fruitCount < this.config.maxFruits;
  }
}
