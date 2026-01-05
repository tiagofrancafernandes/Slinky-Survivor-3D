
import React from 'react';
import { GameSettings } from '../../types';
import { Play, Settings, Trophy } from 'lucide-react';

interface MainMenuProps {
  onStart: () => void;
  onSettings: () => void;
  settings: GameSettings;
  highScore: number;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onSettings, settings, highScore }) => {
  const isPt = settings.language === 'pt-BR';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10 transition-all duration-700 animate-in fade-in">
      <h1 className="text-7xl font-black mb-2 text-white drop-shadow-lg tracking-tighter">
        SLINKY <span className="text-green-500">SURVIVOR</span>
      </h1>
      <p className="text-xl text-green-200 mb-12 uppercase tracking-widest font-bold opacity-80">
        {isPt ? 'Sobreviva à Floresta' : 'Survive the Forest'}
      </p>

      <div className="flex flex-col gap-4 w-64">
        <button 
          onClick={onStart}
          className="group relative flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-2xl font-bold text-2xl transition-all hover:scale-105 active:scale-95 shadow-xl"
        >
          <Play fill="white" size={24} />
          {isPt ? 'JOGAR' : 'PLAY'}
        </button>

        <button 
          onClick={onSettings}
          className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white py-4 px-8 rounded-2xl font-bold text-xl transition-all border border-white/10"
        >
          <Settings size={20} />
          {isPt ? 'AJUSTES' : 'SETTINGS'}
        </button>
      </div>

      <div className="mt-16 flex items-center gap-3 bg-black/60 py-3 px-6 rounded-full border border-green-900/50">
        <Trophy className="text-yellow-500" size={24} />
        <span className="text-gray-400 font-medium">{isPt ? 'MELHOR PONTUAÇÃO' : 'HIGH SCORE'}:</span>
        <span className="text-2xl font-bold text-white">{highScore.toLocaleString()}</span>
      </div>

      <div className="mt-auto pb-8 text-white/40 text-sm flex gap-6">
        <div className="flex flex-col items-center">
          <kbd className="bg-white/10 px-2 py-1 rounded mb-1">← →</kbd>
          <span>{isPt ? 'Mover' : 'Move'}</span>
        </div>
        <div className="flex flex-col items-center">
          <kbd className="bg-white/10 px-2 py-1 rounded mb-1">↑</kbd>
          <span>{isPt ? 'Impulso' : 'Boost'}</span>
        </div>
        <div className="flex flex-col items-center">
          <kbd className="bg-white/10 px-2 py-1 rounded mb-1">↓</kbd>
          <span>{isPt ? 'Devagar' : 'Slow'}</span>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
