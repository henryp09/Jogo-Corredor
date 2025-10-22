import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const characterRef = useRef();
  const obstacleRef = useRef();
  const [jumping, setJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Score loop
  useEffect(() => {
    let interval;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setScore((prev) => prev + 1);
      }, 200);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Collision detection
  useEffect(() => {
    const checkCollision = setInterval(() => {
      if (!characterRef.current || !obstacleRef.current) return;
  
      const character = characterRef.current.getBoundingClientRect();
      const obstacle = obstacleRef.current.getBoundingClientRect();
  
      // Checa o bottom (distância do chão) via style para saber se está pulando
      const characterBottom = parseInt(window.getComputedStyle(characterRef.current).bottom);
  
      const isHorizontallyOverlapping =
        character.right > obstacle.left && character.left < obstacle.right;
  
      // Se o personagem está próximo do chão (pulando o bottom será > 20, ajusta conforme sua animação)
      const isOnGround = characterBottom < 10;
  
      if (isHorizontallyOverlapping && isOnGround) {
        setGameOver(true);
        setGameStarted(false);
      }
    }, 10);
  
    return () => clearInterval(checkCollision);
  }, []);
  
  
  

  const handleJump = () => {
    if (!jumping && !gameOver) {
      setJumping(true);
      setTimeout(() => {
        setJumping(false);
      }, 600);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        if (!gameStarted) {
          startGame();
        } else {
          handleJump();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, jumping]);

  return (
    <div className="game-container">
      <h1>🐱 Corrida do Gatinho</h1>
      <p>Pontuação: {score}</p>

      {!gameStarted && !gameOver && (
        <p className="start-text">Pressione <strong>Espaço</strong> para começar</p>
      )}

      {gameOver && (
        <p className="game-over">💥 Game Over! Pressione <strong>espaço</strong> para reiniciar.</p>
      )}

      <div className="game">
        <div
          className={`character ${jumping ? 'jump' : ''}`}
          ref={characterRef}
        >
          🐱
        </div>
        <div
          className={`obstacle ${gameStarted && !gameOver ? 'obstacle-move' : ''}`}
          ref={obstacleRef}
        >
          🌵
        </div>
      </div>
    </div>
  );
}

export default App;
