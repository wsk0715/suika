import Matter from 'matter-js';
import { FRUITS, type Fruit } from '../constants/fruits';

export class FruitGenerator {
  private world: Matter.World;

  constructor(world: Matter.World) {
    this.world = world;
  }

  /**
   * 지정된 위치에 과일을 생성합니다
   */
  public createFruit(x: number, y: number, fruitId: number): Matter.Body {
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

    // 과일 정보를 body에 저장
    (body as any).fruitId = fruitId;
    (body as any).fruitData = fruit;

    console.log('과일 생성:', { fruitId, name: fruit.name, position: { x, y } });
    Matter.World.add(this.world, body);
    return body;
  }

  /**
   * 랜덤한 초기 과일을 생성합니다 (체리, 딸기, 포도 중 하나)
   */
  public createRandomInitialFruit(x: number, y: number): Matter.Body {
    const initialFruits = [0, 1, 2]; // 체리, 딸기, 포도
    const randomFruitId = initialFruits[Math.floor(Math.random() * initialFruits.length)];
    return this.createFruit(x, y, randomFruitId);
  }

  /**
   * 다음 단계 과일을 생성합니다
   */
  public createNextFruit(currentFruitId: number, x: number, y: number): Matter.Body | null {
    const currentFruit = FRUITS.find(f => f.id === currentFruitId);
    if (!currentFruit || !currentFruit.nextFruit) {
      return null;
    }
    return this.createFruit(x, y, currentFruit.nextFruit);
  }
}
