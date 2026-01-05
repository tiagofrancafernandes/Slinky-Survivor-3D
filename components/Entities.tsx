
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Entity, GameStatus } from '../types';
import { LANES, SPAWN_DISTANCE, DESPAWN_DISTANCE } from '../constants';

// Local component aliases to bypass JSX intrinsic element type checks
const Group = 'group' as any;
const Mesh = 'mesh' as any;
const BoxGeometry = 'boxGeometry' as any;
const SphereGeometry = 'sphereGeometry' as any;
const DodecahedronGeometry = 'dodecahedronGeometry' as any;
const CylinderGeometry = 'cylinderGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;

interface EntitiesProps {
  speed: number;
  status: GameStatus;
  snakePos: THREE.Vector3;
  snakeRadius: number;
  onCollision: (type: 'obstacle' | 'food') => void;
}

const Entities: React.FC<EntitiesProps> = ({ speed, status, snakePos, snakeRadius, onCollision }) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const lastSpawnZ = useRef(0);
  const entitiesRef = useRef<Entity[]>([]);

  useEffect(() => {
    if (status === GameStatus.START || status === GameStatus.SETTINGS) {
      setEntities([]);
      entitiesRef.current = [];
      lastSpawnZ.current = 0;
    }
  }, [status]);

  useFrame((state, delta) => {
    if (status !== GameStatus.PLAYING) return;

    const moveAmount = speed * delta * 50;
    
    // Move existing entities
    const updated = entitiesRef.current.map(e => ({
      ...e,
      position: [e.position[0], e.position[1], e.position[2] + moveAmount] as [number, number, number]
    })).filter(e => e.position[2] < 20); // Keep buffer

    // Check collisions
    updated.forEach(e => {
      const dx = snakePos.x - e.position[0];
      const dz = snakePos.z - e.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      
      const collisionThreshold = e.size + snakeRadius;
      
      if (dist < collisionThreshold) {
        // Trigger collision
        onCollision(e.type);
        // Remove item if it's food
        if (e.type === 'food') {
          e.position[2] = 100; // teleport away
        }
      }
    });

    // Spawn new entities
    lastSpawnZ.current += moveAmount;
    if (lastSpawnZ.current > 15) {
      const laneIndex = Math.floor(Math.random() * 3);
      const isFood = Math.random() > 0.6;
      
      const newEntity: Entity = {
        id: Math.random().toString(),
        type: isFood ? 'food' : 'obstacle',
        kind: isFood ? 
          (Math.random() > 0.5 ? 'insect' : 'mouse') : 
          (Math.random() > 0.5 ? 'rock' : 'log'),
        position: [LANES[laneIndex], 0.3, -SPAWN_DISTANCE],
        size: isFood ? 0.3 : 0.8
      };
      
      updated.push(newEntity);
      lastSpawnZ.current = 0;
    }

    entitiesRef.current = updated;
    setEntities(updated);
  });

  return (
    <Group>
      {entities.map(e => (
        <EntityItem key={e.id} entity={e} />
      ))}
    </Group>
  );
};

const EntityItem: React.FC<{ entity: Entity }> = ({ entity }) => {
  const { type, kind, position, size } = entity;

  if (type === 'obstacle') {
    return (
      <Group position={position}>
        {kind === 'rock' ? (
          <Mesh castShadow>
            <DodecahedronGeometry args={[size, 0]} />
            <MeshStandardMaterial color="#5c5c5c" roughness={0.9} />
          </Mesh>
        ) : (
          <Mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <CylinderGeometry args={[size * 0.4, size * 0.4, size * 2, 8]} />
            <MeshStandardMaterial color="#4a3728" roughness={1} />
          </Mesh>
        )}
      </Group>
    );
  }

  return (
    <Group position={position}>
      {kind === 'insect' ? (
        <Mesh castShadow>
          <SphereGeometry args={[0.2, 8, 8]} />
          <MeshStandardMaterial color="#e67e22" />
        </Mesh>
      ) : (
        <Mesh castShadow>
          <BoxGeometry args={[0.4, 0.2, 0.6]} />
          <MeshStandardMaterial color="#95a5a6" />
        </Mesh>
      )}
    </Group>
  );
};

export default Entities;
