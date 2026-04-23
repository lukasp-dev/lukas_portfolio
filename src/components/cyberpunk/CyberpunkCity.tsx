import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BuildingProps {
  position: [number, number, number];
  sections: Array<{
    width: number;
    height: number;
    depth: number;
    yOffset: number;
  }>;
  emissive: string;
  seed: number;
}

const Building = ({ position, sections, emissive, seed }: BuildingProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.MeshStandardMaterial;
          // Subtle pulsing effect with different timing per section
          material.emissiveIntensity =
            0.2 + Math.sin(state.clock.elapsedTime * 0.5 + seed + index) * 0.1;
        }
      });
    }
  });

  // Create window lights
  const createWindowLights = (
    width: number,
    height: number,
    depth: number,
    yOffset: number,
  ): JSX.Element[] => {
    const lights: JSX.Element[] = [];
    const windowSize = 0.2;
    const spacing = 1;

    // Only add windows to taller sections
    if (height < 5) return lights;

    for (let y = 1; y < height - 1; y += spacing) {
      for (let x = -width / 2 + 0.5; x < width / 2 - 0.5; x += spacing) {
        // Random window on/off
        if (Math.random() > 0.3) {
          lights.push(
            <mesh
              key={`w-${x}-${y}-f`}
              position={[x, yOffset - height / 2 + y, depth / 2 + 0.01]}
            >
              <planeGeometry args={[windowSize, windowSize]} />
              <meshStandardMaterial
                color="#ffff88"
                emissive="#ffff88"
                emissiveIntensity={0.8}
                transparent
                opacity={0.6}
              />
            </mesh>,
          );
        }
      }
    }
    return lights;
  };

  return (
    <group ref={groupRef} position={position}>
      {sections.map((section, index) => (
        <group key={index}>
          <mesh position={[0, section.yOffset, 0]} castShadow receiveShadow>
            <boxGeometry
              args={[section.width, section.height, section.depth]}
            />
            <meshStandardMaterial
              color="#0a0a15"
              emissive={emissive}
              emissiveIntensity={0.2}
              metalness={0.9}
              roughness={0.1}
            />
            <lineSegments>
              <edgesGeometry
                args={[
                  new THREE.BoxGeometry(
                    section.width,
                    section.height,
                    section.depth,
                  ),
                ]}
              />
              <lineBasicMaterial color={emissive} opacity={0.5} transparent />
            </lineSegments>
          </mesh>
          {createWindowLights(
            section.width,
            section.height,
            section.depth,
            section.yOffset,
          )}
        </group>
      ))}
    </group>
  );
};

const CyberpunkCity = () => {
  const buildings = useMemo(() => {
    const buildingData: Array<{
      position: [number, number, number];
      sections: Array<{
        width: number;
        height: number;
        depth: number;
        yOffset: number;
      }>;
      emissive: string;
      seed: number;
    }> = [];
    const gridSize = 20;
    const spacing = 8;
    const colors = ["#ff00ff", "#00ffff", "#ff0080", "#0080ff", "#ff00aa"];

    let seedCounter = 0;
    for (let x = -gridSize; x < gridSize; x += spacing) {
      for (let z = -gridSize; z < gridSize; z += spacing) {
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Create multi-section building (2-4 sections)
        const numSections = Math.floor(Math.random() * 3) + 2;
        const sections = [];
        let currentY = 0;

        for (let i = 0; i < numSections; i++) {
          const sectionHeight = Math.random() * 8 + 4;
          const widthFactor = 1 - i * 0.15; // Each section gets slightly narrower
          const baseWidth = Math.random() * 2 + 3;
          const baseDepth = Math.random() * 2 + 3;

          sections.push({
            width: baseWidth * widthFactor,
            height: sectionHeight,
            depth: baseDepth * widthFactor,
            yOffset: currentY + sectionHeight / 2,
          });

          currentY += sectionHeight;
        }

        buildingData.push({
          position: [x + Math.random() * 2, 0, z + Math.random() * 2] as [
            number,
            number,
            number,
          ],
          sections,
          emissive: color,
          seed: seedCounter++,
        });
      }
    }
    return buildingData;
  }, []);

  return (
    <group>
      {buildings.map((building, index) => (
        <Building key={index} {...building} />
      ))}

      {/* Ground plane with grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#0a0a0f"
          metalness={0.9}
          roughness={0.1}
          emissive="#ff00ff"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Grid lines */}
      <gridHelper
        args={[200, 50, "#ff00ff", "#00ffff"]}
        position={[0, 0.1, 0]}
      />
    </group>
  );
};

export default CyberpunkCity;
