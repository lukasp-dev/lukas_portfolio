import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import { Project } from "../../constants";
import type { BuildingModelConfig } from "../../constants/buildingModels";

interface BuildingModelProps {
  position: [number, number, number];
  modelPath: string;
  project?: Project;
  onClick?: () => void;
  scale?: number;
  rotation?: [number, number, number];
  lod?: BuildingModelConfig["lod"];
  materialVariant?: BuildingModelConfig["materialVariant"];
}

const BuildingModel = ({
  position,
  modelPath,
  project,
  onClick,
  scale = 1,
  rotation = [0, 0, 0],
  lod,
  materialVariant,
}: BuildingModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [selectedLod, setSelectedLod] = useState<0 | 1 | 2>(0);
  const lodRef = useRef<0 | 1 | 2>(0);

  const nearPath = lod?.near || modelPath;
  const midPath = lod?.mid || modelPath;
  const farPath = lod?.far || modelPath;
  const lodSwitchDistance = lod?.switchDistance || [45, 95];
  const hoverBoostMax = materialVariant?.emissiveBoost ?? 0.15;
  const worldPosition = useMemo(
    () => new THREE.Vector3(position[0], position[1], position[2]),
    [position],
  );

  const { scene: nearScene } = useGLTF(nearPath);
  const { scene: midScene } = useGLTF(midPath);
  const { scene: farScene } = useGLTF(farPath);

  const sourceScene =
    selectedLod === 0 ? nearScene : selectedLod === 1 ? midScene : farScene;

  // Clone once so each building instance can manage its own material state.
  const clonedScene = useMemo(() => sourceScene.clone(true), [sourceScene]);

  const emissiveMaterials = useMemo(() => {
    const targets: Array<{
      material: THREE.MeshStandardMaterial;
      baseIntensity: number;
    }> = [];
    const seenMaterials = new Set<THREE.Material>();

    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach((material) => {
        if (!(material instanceof THREE.MeshStandardMaterial)) return;
        if (seenMaterials.has(material)) return;
        seenMaterials.add(material);

        const hasEmissiveMap = Boolean(material.emissiveMap);
        const hasEmissiveColor =
          material.emissive &&
          !material.emissive.equals(new THREE.Color(0x000000));

        // Only animate materials that are already emissive.
        if (hasEmissiveMap || hasEmissiveColor) {
          targets.push({
            material,
            baseIntensity: material.emissiveIntensity ?? 0,
          });
        }
      });
    });

    return targets;
  }, [clonedScene]);

  useFrame((state) => {
    if (!groupRef.current || emissiveMaterials.length === 0) return;

    const distance = state.camera.position.distanceTo(worldPosition);
    const [nearToMid, midToFar] = lodSwitchDistance;
    const nextLod: 0 | 1 | 2 =
      distance > midToFar ? 2 : distance > nearToMid ? 1 : 0;

    if (nextLod !== lodRef.current) {
      lodRef.current = nextLod;
      setSelectedLod(nextLod);
    }

    const pulse = 0.05 + Math.sin(state.clock.elapsedTime * 3) * 0.03;
    const boost = hovered ? Math.min(hoverBoostMax, Math.max(0.03, pulse)) : 0;

    emissiveMaterials.forEach(({ material, baseIntensity }) => {
      material.emissiveIntensity = baseIntensity + boost;
    });
  }, -1);

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
