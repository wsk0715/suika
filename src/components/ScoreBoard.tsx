import React from 'react';

interface ScoreBoardProps {
  score: number;
  isGameOver: boolean;
  onRestart: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  score, 
  isGameOver, 
  onRestart 
}) => {
  return (
    <div className="score-board">
      <div className="score-display">
        <h2>점수: {score}</h2>
      </div>
      
      {isGameOver && (
        <div className="game-over">
          <h3>게임 오버!</h3>
          <p>최종 점수: {score}</p>
          <button onClick={onRestart} className="restart-button">
            다시 시작
          </button>
        </div>
      )}
      
      <div className="instructions">
        <p>캔버스를 클릭하여 과일을 떨어뜨리세요!</p>
        <p>같은 과일끼리 합쳐서 수박을 만들어보세요!</p>
      </div>
    </div>
  );
};
