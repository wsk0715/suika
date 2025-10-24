import React, { useEffect, useRef, useState } from 'react';
import { PhysicsEngine } from '../utils/physics';
import { FruitGenerator } from '../utils/fruitGenerator';
import { CollisionHandler } from '../utils/collisionHandler';
import { GameStateManager } from '../utils/gameState';
import { GAME_CONFIG } from '../constants/fruits';

interface GameProps {
  onScoreUpdate: (score: number) => void;
  onGameOver: () => void;
}

export const Game: React.FC<GameProps> = ({ onScoreUpdate, onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const physicsEngineRef = useRef<PhysicsEngine | null>(null);
  const fruitGeneratorRef = useRef<FruitGenerator | null>(null);
  const collisionHandlerRef = useRef<CollisionHandler | null>(null);
  const gameStateRef = useRef<GameStateManager>(new GameStateManager());
  const [isInitialized, setIsInitialized] = useState(false);

  const handleFruitMerge = (fruit1: any, fruit2: any, newFruit: any) => {
    // 과일 합치기 로직은 CollisionHandler에서 처리됨
    console.log('Fruits merged!');
  };

  const handleScoreUpdate = (points: number) => {
    gameStateRef.current.dispatch({ type: 'UPDATE_SCORE', payload: points });
    const currentScore = gameStateRef.current.getScore();
    onScoreUpdate(currentScore);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // 물리 엔진 초기화
    const physicsEngine = new PhysicsEngine(canvasRef.current);
    physicsEngineRef.current = physicsEngine;

    // 과일 생성기 초기화
    const fruitGenerator = new FruitGenerator(physicsEngine.getWorld());
    fruitGeneratorRef.current = fruitGenerator;

    // 충돌 핸들러 초기화
    const collisionHandler = new CollisionHandler(
      physicsEngine.getWorld(),
      handleFruitMerge,
      handleScoreUpdate
    );
    collisionHandlerRef.current = collisionHandler;

    // 게임 시작
    gameStateRef.current.dispatch({ type: 'START_GAME' });
    physicsEngine.start();
    setIsInitialized(true);

    return () => {
      physicsEngine.cleanup();
    };
  }, []);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isInitialized || !fruitGeneratorRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = 50; // 상단에서 과일 드롭

    // 게임 상태 확인
    const gameState = gameStateRef.current.getState();
    if (!gameState.isPlaying || gameState.isGameOver) return;

    // 과일 개수 제한 확인
    if (!gameStateRef.current.canAddFruit()) {
      onGameOver();
      return;
    }

    // 과일 생성
    const nextFruitId = gameStateRef.current.getNextFruitId();
    fruitGeneratorRef.current.createFruit(x, y, nextFruitId);
    
    // 상태 업데이트
    gameStateRef.current.dispatch({ type: 'INCREMENT_FRUIT_COUNT' });
    
    // 다음 과일 설정 (랜덤)
    const randomFruitId = Math.floor(Math.random() * 3); // 체리, 딸기, 포도 중 하나
    gameStateRef.current.dispatch({ type: 'SET_NEXT_FRUIT', payload: randomFruitId });
  };

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.CANVAS_WIDTH}
        height={GAME_CONFIG.CANVAS_HEIGHT}
        onClick={handleCanvasClick}
        style={{
          border: '2px solid #333',
          cursor: 'pointer',
          display: 'block',
          margin: '0 auto'
        }}
      />
    </div>
  );
};
