import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface CyberpunkCameraProps {
  targetPosition?: [number, number, number];
  targetLookAt?: [number, number, number];
}

const CyberpunkCamera = ({
  targetPosition = [0, 15, 40],
  targetLookAt = [0, 10, 0],
}: CyberpunkCameraProps) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const currentPosition = useRef(new THREE.Vector3(...targetPosition));
  const currentLookAt = useRef(new THREE.Vector3(...targetLookAt));
  const targetPos = useRef(new THREE.Vector3(...targetPosition));
  const targetLook = useRef(new THREE.Vector3(...targetLookAt));

  useEffect(() => {
    targetPos.current.set(...targetPosition);
    targetLook.current.set(...targetLookAt);
  }, [targetPosition, targetLookAt]);

  useFrame((state, delta) => {
    if (!cameraRef.current) return;

    const time = state.clock.elapsedTime;

    // Smooth camera movement
    currentPosition.current.lerp(targetPos.current, delta * 0.5);
    currentLookAt.current.lerp(targetLook.current, delta * 0.5);

    // Add subtle floating motion
    const floatY = Math.sin(time * 0.5) * 0.5;
    const floatX = Math.cos(time * 0.3) * 0.3;

    cameraRef.current.position.set(
      currentPosition.current.x + floatX,
      currentPosition.current.y + floatY,
      currentPosition.current.z,
    );

    cameraRef.current.lookAt(currentLookAt.current);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={targetPosition}
      fov={75}
      near={0.1}
      far={1000}
    />
  );
};

export default CyberpunkCamera;
