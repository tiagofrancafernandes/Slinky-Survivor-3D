
import React, { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Sky, Stars, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { GameStatus, GameSettings, Entity } from '../types';
import Snake from './Snake';
import Ground from './Ground';
import Entities from './Entities';
import { BASE_SPEED, SPEED_INCREMENT, MAX_SPEED } from '../constants';

// Local component aliases to bypass JSX intrinsic element type checks
const AmbientLight = 'ambientLight' as any;
const DirectionalLight = 'directionalLight' as any;

interface GameContainerProps {
  status: GameStatus;
  onGameOver: () => void;
  onScoreUpdate: (score: number | ((prev: number) => number)) => void;
  settings: GameSettings;
}

const Scene: React.FC<GameContainerProps> = ({ status, onGameOver, onScoreUpdate, settings }) => {
  const [speed, setSpeed] = useState(BASE_SPEED);
  const [gameTime, setGameTime] = useState(0);
  const snakePosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const snakeRadius = 0.4;

  // Track lanes for movement
  const [targetLane, setTargetLane] = useState(1); // 0: left, 1: center, 2: right
  const [boost, setBoost] = useState(1);

  useEffect(() => {
    if (status !== GameStatus.PLAYING) {
      setSpeed(BASE_SPEED + (settings.difficulty - 1) * 0.1);
      setGameTime(0);
      setTargetLane(1);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setTargetLane(prev => Math.max(0, prev - 1));
      if (e.key === 'ArrowRight') setTargetLane(prev => Math.min(2, prev + 1));
      if (e.key === 'ArrowUp') setBoost(2.0);
      if (e.key === 'ArrowDown') setBoost(0.6);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') setBoost(1.0);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [status, settings.difficulty]);

  useFrame((state, delta) => {
    if (status !== GameStatus.PLAYING) return;

    // Gradual speed up
    const currentSpeed = Math.min(MAX_SPEED, speed + delta * SPEED_INCREMENT) * boost;
    setSpeed(speed + delta * SPEED_INCREMENT * 0.1);
    
    setGameTime(prev => prev + delta * currentSpeed);
    onScoreUpdate(prev => Math.floor(prev + delta * 10 * currentSpeed));
  });

  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <AmbientLight intensity={0.7} />
      <DirectionalLight 
        position={[10, 20, 10]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      
      <PerspectiveCamera makeDefault position={[0, 4, 8]} rotation={[-0.4, 0, 0]} />

      <Snake 
        targetLane={targetLane} 
        speed={speed * boost} 
        status={status}
        onPositionChange={(pos) => snakePosRef.current.copy(pos)}
      />

      <Ground speed={speed * boost} status={status} />
      
      <Entities 
        speed={speed * boost} 
        status={status} 
        snakePos={snakePosRef.current}
        snakeRadius={snakeRadius}
        onCollision={(type) => {
          if (type === 'obstacle') onGameOver();
          if (type === 'food') onScoreUpdate(prev => prev + 250);
        }}
      />

      <Environment preset="forest" />
      <ContactShadows opacity={0.4} scale={20} blur={2.4} far={4.5} />
    </>
  );
};

const GameContainer: React.FC<GameContainerProps> = (props) => {
  return (
    <div className="w-full h-full cursor-none">
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GameContainer;
