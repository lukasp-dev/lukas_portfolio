import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import { Project } from "../../constants";

interface BuildingModelProps {
  position: [number, number, number];
  modelPath: string;
  project?: Project;
  onClick?: () => void;
  scale?: number;
  rotation?: [number, number, number];
}

const BuildingModel = ({
  position,
  modelPath,
  project,
  onClick,
  scale = 1,
  rotation = [0, 0, 0],
}: BuildingModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { scene } = useGLTF(modelPath);

  // Clone the scene to allow multiple instances
  const clonedScene = scene.clone();

  useFrame((state) => {
    if (groupRef.current && hovered) {
      // Add pulsing glow effect when hovered
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.MeshStandardMaterial;
          if (material.emissive) {
            material.emissiveIntensity =
              0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
          }
        }
      });
    }
  });

  // Apply cyberpunk materials to the model
  clonedScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const material = child.material as THREE.MeshStandardMaterial;

      // Enhance materials with cyberpunk aesthetic
      if (material) {
        material.metalness = Math.max(material.metalness || 0, 0.7);
        material.roughness = Math.min(material.roughness || 1, 0.3);

        // Add emissive glow
        if (!material.emissive) {
          material.emissive = new THREE.Color(hovered ? "#00ffff" : "#ff00ff");
          material.emissiveIntensity = hovered ? 0.5 : 0.2;
        }
      }

      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <group position={position}>
      <group
        ref={groupRef}
        scale={scale}
        rotation={rotation}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <primitive object={clonedScene} />
      </group>

      {/* Project title */}
      {project && (
        <Text
          position={[0, scale * 15, 0]}
          fontSize={1.2}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.15}
          outlineColor="#ff00ff"
        >
          {project.title}
        </Text>
      )}

      {/* Holographic base platform */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[scale * 3, scale * 3.5, 32]} />
        <meshStandardMaterial
          color={hovered ? "#00ffff" : "#ff00ff"}
          emissive={hovered ? "#00ffff" : "#ff00ff"}
          emissiveIntensity={hovered ? 1.5 : 0.8}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Neon light beam */}
      {hovered && (
        <pointLight
          position={[0, scale * 10, 0]}
          color="#00ffff"
          intensity={10}
          distance={30}
        />
      )}
    </group>
  );
};

// Preload models
export const preloadBuildingModels = (modelPaths: string[]) => {
  modelPaths.forEach((path) => {
    useGLTF.preload(path);
  });
};

export default BuildingModel;
