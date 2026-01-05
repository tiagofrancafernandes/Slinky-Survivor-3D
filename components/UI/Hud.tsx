
import React from 'react';

interface HudProps {
  score: number;
  highScore: number;
}

const Hud: React.FC<HudProps> = ({ score, highScore }) => {
  return (
    <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start pointer-events-none z-10">
      {/* Current Score */}
      <div className="flex flex-col">
        <span className="text-white/40 text-xs font-black tracking-widest uppercase mb-1 drop-shadow-md">
          Current Score
        </span>
        <span className="text-5xl font-black text-white tabular-nums drop-shadow-lg">
          {score.toLocaleString()}
        </span>
      </div>

      {/* High Score */}
      <div className="flex flex-col items-end">
        <span className="text-white/40 text-xs font-black tracking-widest uppercase mb-1 drop-shadow-md">
          High Score
        </span>
        <span className="text-2xl font-bold text-yellow-500 drop-shadow-lg tabular-nums">
          {highScore.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default Hud;
