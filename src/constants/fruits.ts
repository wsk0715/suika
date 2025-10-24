export interface Fruit {
  id: number;
  name: string;
  radius: number;
  color: string;
  points: number;
  nextFruit?: number;
}

export const FRUITS: Fruit[] = [
  { id: 0, name: '체리', radius: 15, color: '#ff6b6b', points: 1 },
  { id: 1, name: '딸기', radius: 20, color: '#ff8e8e', points: 3 },
  { id: 2, name: '포도', radius: 25, color: '#9b59b6', points: 6 },
  { id: 3, name: '귤', radius: 30, color: '#f39c12', points: 10 },
  { id: 4, name: '감', radius: 35, color: '#e67e22', points: 15 },
  { id: 5, name: '사과', radius: 40, color: '#e74c3c', points: 21 },
  { id: 6, name: '배', radius: 45, color: '#f1c40f', points: 28 },
  { id: 7, name: '복숭아', radius: 50, color: '#ff9ff3', points: 36 },
  { id: 8, name: '파인애플', radius: 55, color: '#f39c12', points: 45 },
  { id: 9, name: '멜론', radius: 60, color: '#2ecc71', points: 55 },
  { id: 10, name: '수박', radius: 65, color: '#27ae60', points: 66 }
];

// 다음 과일 매핑 설정
FRUITS.forEach((fruit, index) => {
  if (index < FRUITS.length - 1) {
    fruit.nextFruit = index + 1;
  }
});

export const GAME_CONFIG = {
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 600,
  GROUND_HEIGHT: 20,
  WALL_THICKNESS: 20,
  GRAVITY: 0.8,
  FRICTION: 0.01,
  RESTITUTION: 0.3,
  GAME_OVER_LINE: 100, // 상단에서 이 거리만큼 떨어진 곳에 과일이 오면 게임오버
  MAX_FRUITS: 50 // 최대 과일 개수 제한
};
