
import React from 'react';
import { GameSettings } from '../../types';
import { RotateCcw, Home, Skull } from 'lucide-react';

interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onMenu: () => void;
  settings: GameSettings;
}

const GameOver: React.FC<GameOverProps> = ({ score, highScore, onRestart, onMenu, settings }) => {
  const isPt = settings.language === 'pt-BR';
  const isNewRecord = score >= highScore && score > 0;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/20 backdrop-blur-md z-20 animate-in zoom-in-95 duration-300">
      <div className="bg-zinc-900/90 p-12 rounded-3xl border-4 border-white/10 shadow-2xl flex flex-col items-center max-w-md w-full">
        <div className="bg-red-600 p-4 rounded-full mb-6">
          <Skull size={48} className="text-white" />
        </div>
        
        <h2 className="text-5xl font-black text-white mb-2 uppercase italic tracking-tight">
          {isPt ? 'FIM DE JOGO' : 'GAME OVER'}
        </h2>
        
        <div className="flex flex-col items-center gap-1 mb-10">
          <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">
            {isPt ? 'PONTUAÇÃO FINAL' : 'FINAL SCORE'}
          </p>
          <p className="text-6xl font-black text-white">{score.toLocaleString()}</p>
          
          {isNewRecord && (
            <div className="mt-2 bg-yellow-500 text-black px-4 py-1 rounded-full text-xs font-black animate-bounce">
              {isPt ? 'NOVO RECORD!' : 'NEW RECORD!'}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <button 
            onClick={onRestart}
            className="flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <RotateCcw size={20} />
            {isPt ? 'REINICIAR' : 'RETRY'}
          </button>
          
          <button 
            onClick={onMenu}
            className="flex items-center justify-center gap-2 bg-zinc-800 text-white py-4 rounded-2xl font-bold transition-all hover:bg-zinc-700"
          >
            <Home size={20} />
            {isPt ? 'INÍCIO' : 'MENU'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
