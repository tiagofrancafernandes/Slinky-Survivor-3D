
import React, { useState, useEffect, useCallback } from 'react';
import { GameStatus, GameSettings, Language } from './types';
import GameContainer from './components/GameContainer';
import MainMenu from './components/UI/MainMenu';
import GameOver from './components/UI/GameOver';
import SettingsMenu from './components/UI/SettingsMenu';
import Hud from './components/UI/Hud';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.START);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('snakeRunner_highScore')) || 0;
  });
  
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem('snakeRunner_settings');
    return saved ? JSON.parse(saved) : {
      language: 'en',
      sound: true,
      volume: 3,
      difficulty: 2,
      autoRestart: false
    };
  });

  useEffect(() => {
    localStorage.setItem('snakeRunner_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeRunner_highScore', score.toString());
    }
  }, [score, highScore]);

  const startGame = useCallback(() => {
    setScore(0);
    setStatus(GameStatus.PLAYING);
  }, []);

  const handleGameOver = useCallback(() => {
    setStatus(GameStatus.GAMEOVER);
    if (settings.autoRestart) {
      setTimeout(startGame, 2000);
    }
  }, [settings.autoRestart, startGame]);

  const toggleSettings = () => {
    setStatus(prev => prev === GameStatus.SETTINGS ? GameStatus.START : GameStatus.SETTINGS);
  };

  return (
    <div className="w-full h-screen relative bg-black font-sans text-white overflow-hidden">
      {/* 3D Scene */}
      <GameContainer 
        status={status} 
        onGameOver={handleGameOver} 
        onScoreUpdate={setScore} 
        settings={settings}
      />

      {/* UI Overlays */}
      {status === GameStatus.START && (
        <MainMenu 
          onStart={startGame} 
          onSettings={toggleSettings} 
          settings={settings}
          highScore={highScore}
        />
      )}

      {status === GameStatus.PLAYING && (
        <Hud score={score} highScore={highScore} />
      )}

      {status === GameStatus.GAMEOVER && (
        <GameOver 
          score={score} 
          highScore={highScore} 
          onRestart={startGame} 
          onMenu={() => setStatus(GameStatus.START)}
          settings={settings}
        />
      )}

      {status === GameStatus.SETTINGS && (
        <SettingsMenu 
          settings={settings} 
          setSettings={setSettings} 
          onClose={toggleSettings}
        />
      )}
    </div>
  );
};

export default App;
