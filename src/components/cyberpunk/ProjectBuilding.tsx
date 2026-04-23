import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { Project } from "../../constants";

interface ProjectBuildingProps {
  position: [number, number, number];
  project: Project;
  onClick: () => void;
}

const ProjectBuilding = ({
  position,
  project,
  onClick,
}: ProjectBuildingProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Generate random but consistent building structure
  const buildingStructure = useMemo(() => {
    const seed = project.title.length;
    const random = (min: number, max: number, offset: number) => {
      const x = Math.sin(seed + offset) * 10000;
      return min + (x - Math.floor(x)) * (max - min);
    };

    const baseWidth = random(5, 7, 1);
    const baseDepth = random(5, 7, 2);
    const baseHeight = random(12, 18, 3);

    const midWidth = baseWidth * random(0.7, 0.9, 4);
    const midDepth = baseDepth * random(0.7, 0.9, 5);
    const midHeight = random(8, 12, 6);

    const topWidth = midWidth * random(0.6, 0.8, 7);
    const topDepth = midDepth * random(0.6, 0.8, 8);
    const topHeight = random(6, 10, 9);

    const totalHeight = baseHeight + midHeight + topHeight;

    return {
      base: {
        width: baseWidth,
        depth: baseDepth,
        height: baseHeight,
        y: baseHeight / 2,
      },
      mid: {
        width: midWidth,
        depth: midDepth,
        height: midHeight,
        y: baseHeight + midHeight / 2,
      },
      top: {
        width: topWidth,
        depth: topDepth,
        height: topHeight,
        y: baseHeight + midHeight + topHeight / 2,
      },
      totalHeight,
      emissiveColor: random(0, 1, 10) > 0.5 ? "#ff00ff" : "#00ffff",
    };
  }, [project.title]);

  useFrame((state) => {
    if (groupRef.current && hovered) {
      // Pulse effect when hovered
      groupRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.MeshStandardMaterial;
          material.emissiveIntensity =
            0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
        }
      });
    }

    if (textRef.current) {
      textRef.current.lookAt(state.camera.position);
    }
  });

  // Create window pattern
  const createWindows = (
    width: number,
    height: number,
    depth: number,
    yOffset: number,
  ) => {
    const windows = [];
    const windowSize = 0.3;
    const windowSpacing = 1.2;

    // Front and back faces
    for (let y = 1; y < height - 1; y += windowSpacing) {
      for (let x = -width / 2 + 1; x < width / 2 - 1; x += windowSpacing) {
        // Front windows
        windows.push(
          <mesh
            key={`front-${x}-${y}`}
            position={[x, yOffset - height / 2 + y, depth / 2 + 0.01]}
          >
            <planeGeometry args={[windowSize, windowSize]} />
            <meshStandardMaterial
              color="#ffff00"
              emissive="#ffff00"
              emissiveIntensity={hovered ? 2 : 1}
              transparent
              opacity={0.8}
            />
          </mesh>,
        );
        // Back windows
        windows.push(
          <mesh
            key={`back-${x}-${y}`}
            position={[x, yOffset - height / 2 + y, -depth / 2 - 0.01]}
            rotation={[0, Math.PI, 0]}
          >
            <planeGeometry args={[windowSize, windowSize]} />
            <meshStandardMaterial
              color="#ffff00"
              emissive="#ffff00"
              emissiveIntensity={hovered ? 2 : 1}
              transparent
              opacity={0.8}
            />
          </mesh>,
        );
      }
    }

    // Side faces
    for (let y = 1; y < height - 1; y += windowSpacing) {
      for (let z = -depth / 2 + 1; z < depth / 2 - 1; z += windowSpacing) {
        // Left windows
        windows.push(
          <mesh
            key={`left-${z}-${y}`}
            position={[-width / 2 - 0.01, yOffset - height / 2 + y, z]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            <planeGeometry args={[windowSize, windowSize]} />
            <meshStandardMaterial
              color="#ffff00"
              emissive="#ffff00"
              emissiveIntensity={hovered ? 2 : 1}
              transparent
              opacity={0.8}
            />
          </mesh>,
        );
        // Right windows
        windows.push(
          <mesh
            key={`right-${z}-${y}`}
            position={[width / 2 + 0.01, yOffset - height / 2 + y, z]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <planeGeometry args={[windowSize, windowSize]} />
            <meshStandardMaterial
              color="#ffff00"
              emissive="#ffff00"
              emissiveIntensity={hovered ? 2 : 1}
              transparent
              opacity={0.8}
            />
          </mesh>,
        );
      }
    }

    return windows;
  };

  return (
    <group position={position}>
      <group
        ref={groupRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Base section */}
        <mesh position={[0, buildingStructure.base.y, 0]} castShadow>
          <boxGeometry
            args={[
              buildingStructure.base.width,
              buildingStructure.base.height,
              buildingStructure.base.depth,
            ]}
          />
          <meshStandardMaterial
            color="#1a1a2e"
            emissive={buildingStructure.emissiveColor}
            emissiveIntensity={hovered ? 0.8 : 0.4}
            metalness={0.9}
            roughness={0.1}
          />
          <lineSegments>
            <edgesGeometry
              args={[
                new THREE.BoxGeometry(
                  buildingStructure.base.width,
                  buildingStructure.base.height,
                  buildingStructure.base.depth,
                ),
              ]}
            />
            <lineBasicMaterial color="#00ffff" linewidth={2} />
          </lineSegments>
        </mesh>
        {createWindows(
          buildingStructure.base.width,
          buildingStructure.base.height,
          buildingStructure.base.depth,
          buildingStructure.base.y,
        )}

        {/* Middle section */}
        <mesh position={[0, buildingStructure.mid.y, 0]} castShadow>
          <boxGeometry
            args={[
              buildingStructure.mid.width,
              buildingStructure.mid.height,
              buildingStructure.mid.depth,
            ]}
          />
          <meshStandardMaterial
            color="#1a1a2e"
            emissive={buildingStructure.emissiveColor}
            emissiveIntensity={hovered ? 0.8 : 0.4}
            metalness={0.9}
            roughness={0.1}
          />
          <lineSegments>
            <edgesGeometry
              args={[
                new THREE.BoxGeometry(
                  buildingStructure.mid.width,
                  buildingStructure.mid.height,
                  buildingStructure.mid.depth,
                ),
              ]}
            />
            <lineBasicMaterial color="#00ffff" linewidth={2} />
          </lineSegments>
        </mesh>
        {createWindows(
          buildingStructure.mid.width,
          buildingStructure.mid.height,
          buildingStructure.mid.depth,
          buildingStructure.mid.y,
        )}

        {/* Top section */}
        <mesh position={[0, buildingStructure.top.y, 0]} castShadow>
          <boxGeometry
            args={[
              buildingStructure.top.width,
              buildingStructure.top.height,
              buildingStructure.top.depth,
            ]}
          />
          <meshStandardMaterial
            color="#1a1a2e"
            emissive={buildingStructure.emissiveColor}
            emissiveIntensity={hovered ? 0.8 : 0.4}
            metalness={0.9}
            roughness={0.1}
          />
          <lineSegments>
            <edgesGeometry
              args={[
                new THREE.BoxGeometry(
                  buildingStructure.top.width,
                  buildingStructure.top.height,
                  buildingStructure.top.depth,
                ),
              ]}
            />
            <lineBasicMaterial color="#00ffff" linewidth={2} />
          </lineSegments>
        </mesh>
        {createWindows(
          buildingStructure.top.width,
          buildingStructure.top.height,
          buildingStructure.top.depth,
          buildingStructure.top.y,
        )}

        {/* Antenna on top */}
        <mesh position={[0, buildingStructure.totalHeight + 1.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={2}
          />
        </mesh>
        <mesh position={[0, buildingStructure.totalHeight + 3.2, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={3}
          />
        </mesh>
      </group>

      {/* Project title floating above */}
      <Text
        ref={textRef}
        position={[0, buildingStructure.totalHeight + 5, 0]}
        fontSize={1}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#ff00ff"
      >
        {project.title}
      </Text>

      {/* Holographic base platform */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry
          args={[
            buildingStructure.base.width * 0.6,
            buildingStructure.base.width * 0.8,
            32,
          ]}
        />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={hovered ? 1.5 : 0.8}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default ProjectBuilding;
