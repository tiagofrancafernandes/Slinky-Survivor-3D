
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GameStatus } from '../types';
import { LANE_WIDTH } from '../constants';

// Local component aliases to bypass JSX intrinsic element type checks
const Group = 'group' as any;
const Mesh = 'mesh' as any;
const PlaneGeometry = 'planeGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const MeshBasicMaterial = 'meshBasicMaterial' as any;

interface GroundProps {
  speed: number;
  status: GameStatus;
}

const Ground: React.FC<GroundProps> = ({ speed, status }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const plane1 = useRef<THREE.Mesh>(null!);
  const plane2 = useRef<THREE.Mesh>(null!);

  const PLANE_SIZE = 100;

  useFrame((state, delta) => {
    if (status !== GameStatus.PLAYING) return;

    const moveAmount = speed * delta * 50;
    plane1.current.position.z += moveAmount;
    plane2.current.position.z += moveAmount;

    if (plane1.current.position.z > PLANE_SIZE) {
      plane1.current.position.z = plane2.current.position.z - PLANE_SIZE;
    }
    if (plane2.current.position.z > PLANE_SIZE) {
      plane2.current.position.z = plane1.current.position.z - PLANE_SIZE;
    }
  });

  return (
    <Group ref={groupRef}>
      <Mesh ref={plane1} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <PlaneGeometry args={[20, PLANE_SIZE]} />
        <MeshStandardMaterial color="#3a4d39" roughness={1} />
      </Mesh>
      <Mesh ref={plane2} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -PLANE_SIZE]} receiveShadow>
        <PlaneGeometry args={[20, PLANE_SIZE]} />
        <MeshStandardMaterial color="#3a4d39" roughness={1} />
      </Mesh>

      {/* Lane Markers (Subtle) */}
      <Mesh rotation={[-Math.PI / 2, 0, 0]} position={[-LANE_WIDTH / 2, 0.01, 0]}>
        <PlaneGeometry args={[0.05, 1000]} />
        <MeshBasicMaterial color="#1a2e19" transparent opacity={0.3} />
      </Mesh>
      <Mesh rotation={[-Math.PI / 2, 0, 0]} position={[LANE_WIDTH / 2, 0.01, 0]}>
        <PlaneGeometry args={[0.05, 1000]} />
        <MeshBasicMaterial color="#1a2e19" transparent opacity={0.3} />
      </Mesh>
    </Group>
  );
};

export default Ground;
