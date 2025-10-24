import Matter from 'matter-js';
import { FRUITS } from '../constants/fruits';

export class CollisionHandler {
  private world: Matter.World;
  private onFruitMerge: (fruit1: Matter.Body, fruit2: Matter.Body, newFruit: Matter.Body) => void;
  private onScoreUpdate: (points: number) => void;

  constructor(
    world: Matter.World,
    onFruitMerge: (fruit1: Matter.Body, fruit2: Matter.Body, newFruit: Matter.Body) => void,
    onScoreUpdate: (points: number) => void
  ) {
    this.world = world;
    this.onFruitMerge = onFruitMerge;
    this.onScoreUpdate = onScoreUpdate;
    this.setupCollisionDetection();
  }

  private setupCollisionDetection() {
    Matter.Events.on(this.world, 'collisionStart', (event) => {
      const pairs = event.pairs;
      
      for (let i = 0; i < pairs.length; i++) {
        const bodyA = pairs[i].bodyA;
        const bodyB = pairs[i].bodyB;
        
        // 둘 다 과일인지 확인
        if (this.isFruit(bodyA) && this.isFruit(bodyB)) {
          this.handleFruitCollision(bodyA, bodyB);
        }
      }
    });
  }

  private isFruit(body: Matter.Body): boolean {
    return (body as any).fruitId !== undefined;
  }

  private handleFruitCollision(fruit1: Matter.Body, fruit2: Matter.Body) {
    const fruit1Id = (fruit1 as any).fruitId;
    const fruit2Id = (fruit2 as any).fruitId;
    
    // 같은 종류의 과일인지 확인
    if (fruit1Id === fruit2Id) {
      // 다음 단계 과일로 합치기
      const currentFruit = FRUITS.find(f => f.id === fruit1Id);
      if (currentFruit && currentFruit.nextFruit !== undefined) {
        this.mergeFruits(fruit1, fruit2, currentFruit.nextFruit);
      }
    }
  }

  private mergeFruits(fruit1: Matter.Body, fruit2: Matter.Body, nextFruitId: number) {
    // 두 과일의 중간 위치 계산
    const x = (fruit1.position.x + fruit2.position.x) / 2;
    const y = (fruit1.position.y + fruit2.position.y) / 2;
    
    // 기존 과일들 제거
    Matter.World.remove(this.world, [fruit1, fruit2]);
    
    // 새로운 과일 생성
    const newFruit = this.createMergedFruit(x, y, nextFruitId);
    Matter.World.add(this.world, newFruit);
    
    // 점수 업데이트
    const newFruitData = FRUITS.find(f => f.id === nextFruitId);
    if (newFruitData) {
      this.onScoreUpdate(newFruitData.points);
    }
    
    // 합치기 이벤트 발생
    this.onFruitMerge(fruit1, fruit2, newFruit);
  }

  private createMergedFruit(x: number, y: number, fruitId: number): Matter.Body {
    const fruit = FRUITS.find(f => f.id === fruitId);
    if (!fruit) {
      throw new Error(`Invalid fruit ID: ${fruitId}`);
    }

    const body = Matter.Bodies.circle(x, y, fruit.radius, {
      render: {
        fillStyle: fruit.color,
        strokeStyle: '#000',
        lineWidth: 2
      },
      friction: 0.01,
      restitution: 0.3,
      density: 0.001
    });

    (body as any).fruitId = fruitId;
    (body as any).fruitData = fruit;

    return body;
  }
}
