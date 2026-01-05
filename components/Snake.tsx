
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LANES, SWAY_INTENSITY, SWAY_SPEED, SNAKE_SEGMENTS_INITIAL, SNAKE_SPACING } from '../constants';
import { GameStatus } from '../types';

// Local component aliases to bypass JSX intrinsic element type checks
const Group = 'group' as any;
const Mesh = 'mesh' as any;
const SphereGeometry = 'sphereGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const MeshBasicMaterial = 'meshBasicMaterial' as any;

interface SnakeProps {
  targetLane: number;
  speed: number;
  status: GameStatus;
  onPositionChange: (pos: THREE.Vector3) => void;
}

const Snake: React.FC<SnakeProps> = ({ targetLane, speed, status, onPositionChange }) => {
  const segmentRefs = useRef<(THREE.Mesh | null)[]>([]);
  
  // Initialize segments in a stable memoized array
  const segmentPositions = useMemo(() => 
    Array.from({ length: SNAKE_SEGMENTS_INITIAL }, (_, i) => new THREE.Vector3(0, 0.2, i * SNAKE_SPACING)),
  []);

  useFrame((state, delta) => {
    if (status !== GameStatus.PLAYING) return;

    const time = state.clock.getElapsedTime();
    const targetX = LANES[targetLane];
    
    // Smooth lane following for head
    const headPos = segmentPositions[0];
    headPos.x = THREE.MathUtils.lerp(headPos.x, targetX, delta * 8);
    
    // S-curve slithering effect
    const sway = Math.sin(time * SWAY_SPEED) * SWAY_INTENSITY;
    headPos.x += sway * 0.2;

    // Segment following logic
    for (let i = segmentPositions.length - 1; i > 0; i--) {
      const target = segmentPositions[i - 1];
      const current = segmentPositions[i];
      
      // Update X to follow with a delay
      current.x = THREE.MathUtils.lerp(current.x, target.x, delta * 15);
      
      // Keep Z spacing consistent
      current.z = i * SNAKE_SPACING;
      
      // Add propagation sway
      const segmentSway = Math.sin(time * SWAY_SPEED - i * 0.5) * SWAY_INTENSITY;
      current.x += segmentSway * 0.1;
    }

    // Directly update mesh positions via refs for better performance and to ensure visibility
    segmentPositions.forEach((pos, i) => {
      if (segmentRefs.current[i]) {
        segmentRefs.current[i]!.position.set(pos.x, pos.y, pos.z);
      }
    });

    onPositionChange(segmentPositions[0]);
  });

  return (
    <Group>
      {segmentPositions.map((pos, i) => (
        <Mesh 
          key={i} 
          ref={(el: THREE.Mesh) => (segmentRefs.current[i] = el)}
          position={[pos.x, pos.y, pos.z]} 
          castShadow 
          receiveShadow
        >
          <SphereGeometry args={[i === 0 ? 0.45 : 0.4 - (i * 0.01), 16, 16]} />
          <MeshStandardMaterial 
            color={i === 0 ? "#2d5a27" : "#3e7b36"} 
            roughness={0.4}
            metalness={0.2}
          />
          {/* Eyes for the head */}
          {i === 0 && (
            <>
              <Mesh position={[0.2, 0.1, -0.3]}>
                <SphereGeometry args={[0.08, 8, 8]} />
                <MeshBasicMaterial color="black" />
              </Mesh>
              <Mesh position={[-0.2, 0.1, -0.3]}>
                <SphereGeometry args={[0.08, 8, 8]} />
                <MeshBasicMaterial color="black" />
              </Mesh>
            </>
          )}
        </Mesh>
      ))}
    </Group>
  );
};

export default Snake;
