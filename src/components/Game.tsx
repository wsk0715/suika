import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { PhysicsEngine } from '../utils/physics';
import { FruitGenerator } from '../utils/fruitGenerator';
import { GameStateManager } from '../utils/gameState';
import { GAME_CONFIG, FRUITS } from '../constants/fruits';

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

  const mergeFruits = (fruit1: Matter.Body, fruit2: Matter.Body, nextFruitId: number) => {
    // 두 과일의 중간 위치 계산
    const x = (fruit1.position.x + fruit2.position.x) / 2;
    const y = (fruit1.position.y + fruit2.position.y) / 2;
    
    // 기존 과일들 제거
    Matter.World.remove(physicsEngineRef.current!.getWorld(), [fruit1, fruit2]);
    
    // 새로운 과일 생성
    const newFruit = fruitGeneratorRef.current!.createFruit(x, y, nextFruitId);
    
    // 점수 업데이트
    const newFruitData = FRUITS.find(f => f.id === nextFruitId);
    if (newFruitData) {
      handleScoreUpdate(newFruitData.points);
    }
    
    console.log('과일 합치기 완료!', nextFruitId);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // 물리 엔진 초기화
    const physicsEngine = new PhysicsEngine(canvasRef.current);
    physicsEngineRef.current = physicsEngine;

    // 과일 생성기 초기화
    const fruitGenerator = new FruitGenerator(physicsEngine.getWorld());
    fruitGeneratorRef.current = fruitGenerator;

    // 충돌 이벤트 직접 등록
    Matter.Events.on(physicsEngine.getEngine(), 'collisionStart', (event) => {
      const pairs = event.pairs;
      
      for (let i = 0; i < pairs.length; i++) {
        const bodyA = pairs[i].bodyA;
        const bodyB = pairs[i].bodyB;
        
        // 둘 다 과일인지 확인
        if ((bodyA as any).fruitId !== undefined && (bodyB as any).fruitId !== undefined) {
          const fruit1Id = (bodyA as any).fruitId;
          const fruit2Id = (bodyB as any).fruitId;
          
          // 같은 종류의 과일인지 확인
          if (fruit1Id === fruit2Id) {
            console.log('같은 과일 충돌!', fruit1Id);
            // 다음 단계 과일로 합치기
            const currentFruit = FRUITS.find(f => f.id === fruit1Id);
            if (currentFruit && currentFruit.nextFruit !== undefined) {
              mergeFruits(bodyA, bodyB, currentFruit.nextFruit);
            }
          }
        }
      }
    });

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
