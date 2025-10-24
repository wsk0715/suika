import React, { useState } from 'react';
import { Game } from './components/Game';
import { ScoreBoard } from './components/ScoreBoard';
import './App.css';

function App() {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
  };

  const handleGameOver = () => {
    setIsGameOver(true);
  };

  const handleRestart = () => {
    setScore(0);
    setIsGameOver(false);
    // 게임 재시작을 위해 페이지 새로고침
    window.location.reload();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍉 수박 게임</h1>
      </header>
      
      <main className="app-main">
        <ScoreBoard 
          score={score}
          isGameOver={isGameOver}
          onRestart={handleRestart}
        />
        
        <Game 
          onScoreUpdate={handleScoreUpdate}
          onGameOver={handleGameOver}
        />
      </main>
    </div>
  );
}

export default App;