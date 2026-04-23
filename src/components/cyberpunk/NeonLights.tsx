import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NeonLights = () => {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const light3Ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (light1Ref.current) {
      light1Ref.current.intensity = 50 + Math.sin(time * 2) * 20;
      light1Ref.current.position.x = Math.sin(time * 0.5) * 30;
    }

    if (light2Ref.current) {
      light2Ref.current.intensity = 50 + Math.cos(time * 1.5) * 20;
      light2Ref.current.position.z = Math.cos(time * 0.3) * 30;
    }

    if (light3Ref.current) {
      light3Ref.current.intensity = 50 + Math.sin(time * 1.8) * 20;
    }
  });

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} color="#4a0e4e" />

      {/* Main directional light */}
      <directionalLight
        position={[10, 50, 10]}
        intensity={0.5}
        color="#00ffff"
        castShadow
      />

      {/* Neon point lights */}
      <pointLight
        ref={light1Ref}
        position={[20, 30, 0]}
        color="#ff00ff"
        intensity={50}
        distance={100}
        decay={2}
      />

      <pointLight
        ref={light2Ref}
        position={[-20, 30, 0]}
        color="#00ffff"
        intensity={50}
        distance={100}
        decay={2}
      />

      <pointLight
        ref={light3Ref}
        position={[0, 40, -20]}
        color="#ff0080"
        intensity={50}
        distance={100}
        decay={2}
      />

      {/* Rim lights */}
      <spotLight
        position={[0, 50, 50]}
        angle={0.5}
        penumbra={1}
        intensity={30}
        color="#0080ff"
        castShadow
      />

      <spotLight
        position={[0, 50, -50]}
        angle={0.5}
        penumbra={1}
        intensity={30}
        color="#ff00aa"
        castShadow
      />
    </>
  );
};

export default NeonLights;
