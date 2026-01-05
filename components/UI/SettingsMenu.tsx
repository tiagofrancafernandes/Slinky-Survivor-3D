
import React from 'react';
import { GameSettings, Language } from '../../types';
import { X, Globe, Volume2, FastForward, Power } from 'lucide-react';

interface SettingsMenuProps {
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ settings, setSettings, onClose }) => {
  const isPt = settings.language === 'pt-BR';

  const update = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-30 p-4">
      <div className="bg-zinc-900 border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 bg-white/5 border-b border-white/5">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Settings size={24} className="text-green-500" />
            {isPt ? 'Ajustes' : 'Settings'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Language */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-500 flex items-center gap-2 uppercase tracking-widest">
              <Globe size={16} />
              {isPt ? 'Idioma' : 'Language'}
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl">
              {(['en', 'pt-BR'] as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => update('language', lang)}
                  className={`py-2 rounded-lg font-bold transition-all ${
                    settings.language === lang ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'English' : 'Português'}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-500 flex items-center gap-2 uppercase tracking-widest">
              <FastForward size={16} />
              {isPt ? 'Dificuldade de Velocidade' : 'Speed Difficulty'} (1-5)
            </label>
            <input 
              type="range" min="1" max="5" 
              value={settings.difficulty}
              onChange={(e) => update('difficulty', parseInt(e.target.value))}
              className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <div className="flex justify-between text-xs font-mono text-gray-600">
              <span>MIN</span>
              <span>MAX</span>
            </div>
          </div>

          {/* Audio */}
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${settings.sound ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                <Volume2 size={24} />
              </div>
              <div>
                <p className="font-bold">{isPt ? 'Sons' : 'Sound Effects'}</p>
                <p className="text-xs text-gray-500">{isPt ? 'Ativar efeitos sonoros' : 'Toggle game audio'}</p>
              </div>
            </div>
            <button 
              onClick={() => update('sound', !settings.sound)}
              className={`w-14 h-8 rounded-full transition-colors relative ${settings.sound ? 'bg-green-600' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.sound ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          {/* Auto Restart */}
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${settings.autoRestart ? 'bg-blue-500/20 text-blue-500' : 'bg-zinc-500/20 text-zinc-500'}`}>
                <RotateCcw size={24} />
              </div>
              <div>
                <p className="font-bold">{isPt ? 'Reinício Automático' : 'Auto Restart'}</p>
                <p className="text-xs text-gray-500">{isPt ? 'Reiniciar após colisão' : 'Restart automatically after crash'}</p>
              </div>
            </div>
            <button 
              onClick={() => update('autoRestart', !settings.autoRestart)}
              className={`w-14 h-8 rounded-full transition-colors relative ${settings.autoRestart ? 'bg-blue-600' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.autoRestart ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="p-6 bg-white/5 border-t border-white/5">
          <button 
            onClick={onClose}
            className="w-full bg-green-600 py-3 rounded-xl font-bold hover:bg-green-500 transition-colors"
          >
            {isPt ? 'SALVAR E SAIR' : 'SAVE & CLOSE'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Internal icon import fix
import { Settings } from 'lucide-react';
import { RotateCcw } from 'lucide-react';

export default SettingsMenu;
