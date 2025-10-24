import Matter from 'matter-js';
import { GAME_CONFIG } from '../constants/fruits';

export class PhysicsEngine {
  private engine: Matter.Engine;
  private render: Matter.Render;
  private world: Matter.World;
  private canvas: HTMLCanvasElement;
  private runner: Matter.Runner;
  private collisionHandler: any = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    
    // 엔진 생성
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    
    // 렌더러 설정
    this.render = Matter.Render.create({
      canvas: this.canvas,
      engine: this.engine,
      options: {
        width: GAME_CONFIG.CANVAS_WIDTH,
        height: GAME_CONFIG.CANVAS_HEIGHT,
        wireframes: false,
        background: '#f8f9fa',
        showAngleIndicator: false,
        showVelocity: false,
        showCollisions: false,
        showSeparations: false,
        showBroadphase: false,
        showBounds: false,
        showAxes: false,
        showPositions: false,
        showVelocity: false,
        showCollisions: false,
        showSeparations: false,
        showBroadphase: false,
        showBounds: false,
        showAxes: false,
        showPositions: false
      }
    });

    // 물리 설정
    this.engine.world.gravity.y = GAME_CONFIG.GRAVITY;
    
    // 러너 생성
    this.runner = Matter.Runner.create();
    
    // 경계 생성
    this.createBoundaries();
  }

  private createBoundaries() {
    const { CANVAS_WIDTH, CANVAS_HEIGHT, WALL_THICKNESS, GROUND_HEIGHT } = GAME_CONFIG;
    
    // 바닥
    const ground = Matter.Bodies.rectangle(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - GROUND_HEIGHT / 2,
      CANVAS_WIDTH,
      GROUND_HEIGHT,
      { isStatic: true, render: { fillStyle: '#8b4513' } }
    );

    // 왼쪽 벽
    const leftWall = Matter.Bodies.rectangle(
      -WALL_THICKNESS / 2,
      CANVAS_HEIGHT / 2,
      WALL_THICKNESS,
      CANVAS_HEIGHT,
      { isStatic: true, render: { fillStyle: '#8b4513' } }
    );

    // 오른쪽 벽
    const rightWall = Matter.Bodies.rectangle(
      CANVAS_WIDTH + WALL_THICKNESS / 2,
      CANVAS_HEIGHT / 2,
      WALL_THICKNESS,
      CANVAS_HEIGHT,
      { isStatic: true, render: { fillStyle: '#8b4513' } }
    );

    Matter.World.add(this.world, [ground, leftWall, rightWall]);
  }

  public start() {
    Matter.Render.run(this.render);
    Matter.Runner.run(this.runner, this.engine);
  }

  public stop() {
    Matter.Render.stop(this.render);
    Matter.Runner.stop(this.runner);
  }

  public addBody(body: Matter.Body) {
    Matter.World.add(this.world, body);
  }

  public removeBody(body: Matter.Body) {
    Matter.World.remove(this.world, body);
  }

  public getWorld() {
    return this.world;
  }

  public getEngine() {
    return this.engine;
  }

  public setCollisionHandler(handler: any) {
    this.collisionHandler = handler;
  }

  public cleanup() {
    this.stop();
    Matter.Render.stop(this.render);
    Matter.Engine.clear(this.engine);
  }
}
