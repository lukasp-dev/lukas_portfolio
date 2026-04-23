import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { Project } from "../../constants";

interface DetailedBuildingProps {
  position: [number, number, number];
  project?: Project;
  onClick?: () => void;
  seed?: number;
}

const DetailedBuilding = ({
  position,
  project,
  onClick,
  seed = 0,
}: DetailedBuildingProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Generate consistent building structure based on seed
  const buildingData = useMemo(() => {
    const random = (min: number, max: number, offset: number) => {
      const x = Math.sin(seed + offset) * 10000;
      return min + (x - Math.floor(x)) * (max - min);
    };

    // Base dimensions
    const baseWidth = random(6, 10, 1);
    const baseDepth = random(6, 10, 2);

    // Create multiple setback sections (SimCity style)
    const sections = [];
    let currentHeight = 0;
    const numSections = Math.floor(random(3, 6, 3));

    for (let i = 0; i < numSections; i++) {
      const sectionHeight = random(4, 8, 4 + i);
      const shrinkFactor = 1 - i * random(0.1, 0.2, 5 + i);

      sections.push({
        width: baseWidth * shrinkFactor,
        depth: baseDepth * shrinkFactor,
        height: sectionHeight,
        yOffset: currentHeight + sectionHeight / 2,
        hasSetback: i > 0,
      });

      currentHeight += sectionHeight;
    }

    const totalHeight = currentHeight;
    const emissiveColor = random(0, 1, 10) > 0.5 ? "#ff00ff" : "#00ffff";
    const accentColor = random(0, 1, 11) > 0.5 ? "#ff0080" : "#00ff80";

    return {
      sections,
      totalHeight,
      emissiveColor,
      accentColor,
      baseWidth,
      baseDepth,
    };
  }, [seed]);

  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.children.forEach((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.emissiveIntensity =
            0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
        }
      });
    }
  });

  // Create detailed window grid
  const createWindows = (
    width: number,
    height: number,
    depth: number,
    yOffset: number,
    sectionIndex: number,
  ) => {
    const windows: JSX.Element[] = [];
    const windowWidth = 0.4;
    const windowHeight = 0.6;
    const spacingX = 1.2;
    const spacingY = 1.5;

    const floors = Math.floor(height / spacingY);
    const windowsPerRow = Math.floor(width / spacingX) - 1;

    // Front and back faces
    for (let floor = 0; floor < floors; floor++) {
      for (let col = 0; col < windowsPerRow; col++) {
        const x = (col - windowsPerRow / 2) * spacingX;
        const y = yOffset - height / 2 + (floor + 0.5) * spacingY;
        const isLit = Math.random() > 0.2;

        // Front windows
        windows.push(
          <mesh
            key={`win-f-${sectionIndex}-${floor}-${col}`}
            position={[x, y, depth / 2 + 0.01]}
          >
            <planeGeometry args={[windowWidth, windowHeight]} />
            <meshStandardMaterial
              color={isLit ? "#ffff88" : "#1a1a2e"}
              emissive={isLit ? "#ffff88" : "#000000"}
              emissiveIntensity={isLit ? (hovered ? 1.5 : 1) : 0}
              transparent
              opacity={0.9}
            />
          </mesh>,
        );

        // Back windows
        windows.push(
          <mesh
            key={`win-b-${sectionIndex}-${floor}-${col}`}
            position={[x, y, -depth / 2 - 0.01]}
            rotation={[0, Math.PI, 0]}
          >
            <planeGeometry args={[windowWidth, windowHeight]} />
            <meshStandardMaterial
              color={isLit ? "#ffff88" : "#1a1a2e"}
              emissive={isLit ? "#ffff88" : "#000000"}
              emissiveIntensity={isLit ? (hovered ? 1.5 : 1) : 0}
              transparent
              opacity={0.9}
            />
          </mesh>,
        );
      }
    }

    // Side faces
    const windowsPerDepth = Math.floor(depth / spacingX) - 1;
    for (let floor = 0; floor < floors; floor++) {
      for (let col = 0; col < windowsPerDepth; col++) {
        const z = (col - windowsPerDepth / 2) * spacingX;
        const y = yOffset - height / 2 + (floor + 0.5) * spacingY;
        const isLit = Math.random() > 0.2;

        // Left windows
        windows.push(
          <mesh
            key={`win-l-${sectionIndex}-${floor}-${col}`}
            position={[-width / 2 - 0.01, y, z]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            <planeGeometry args={[windowWidth, windowHeight]} />
            <meshStandardMaterial
              color={isLit ? "#ffff88" : "#1a1a2e"}
              emissive={isLit ? "#ffff88" : "#000000"}
              emissiveIntensity={isLit ? (hovered ? 1.5 : 1) : 0}
              transparent
              opacity={0.9}
            />
          </mesh>,
        );

        // Right windows
        windows.push(
          <mesh
            key={`win-r-${sectionIndex}-${floor}-${col}`}
            position={[width / 2 + 0.01, y, z]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <planeGeometry args={[windowWidth, windowHeight]} />
            <meshStandardMaterial
              color={isLit ? "#ffff88" : "#1a1a2e"}
              emissive={isLit ? "#ffff88" : "#000000"}
              emissiveIntensity={isLit ? (hovered ? 1.5 : 1) : 0}
              transparent
              opacity={0.9}
            />
          </mesh>,
        );
      }
    }

    return windows;
  };

  // Create rooftop details
  const createRooftopDetails = () => {
    const topSection = buildingData.sections[buildingData.sections.length - 1];
    const roofY = buildingData.totalHeight;

    return (
      <group>
        {/* Helipad */}
        <mesh position={[0, roofY + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[topSection.width * 0.2, topSection.width * 0.25, 32]}
          />
          <meshStandardMaterial
            color="#ffff00"
            emissive="#ffff00"
            emissiveIntensity={hovered ? 2 : 1}
          />
        </mesh>

        {/* Central antenna */}
        <mesh position={[0, roofY + 3, 0]}>
          <cylinderGeometry args={[0.1, 0.15, 6, 8]} />
          <meshStandardMaterial
            color="#333333"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Antenna light */}
        <mesh position={[0, roofY + 6.5, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color={buildingData.emissiveColor}
            emissive={buildingData.emissiveColor}
            emissiveIntensity={3}
          />
        </mesh>
        <pointLight
          position={[0, roofY + 6.5, 0]}
          color={buildingData.emissiveColor}
          intensity={5}
          distance={20}
        />

        {/* AC units */}
        {[...Array(3)].map((_, i) => {
          const angle = (i / 3) * Math.PI * 2;
          const radius = topSection.width * 0.3;
          return (
            <mesh
              key={`ac-${i}`}
              position={[
                Math.cos(angle) * radius,
                roofY + 0.5,
                Math.sin(angle) * radius,
              ]}
            >
              <boxGeometry args={[1, 1, 1.5]} />
              <meshStandardMaterial
                color="#444444"
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
          );
        })}
      </group>
    );
  };

  // Create neon signs and billboards
  const createCyberpunkElements = () => {
    if (!project) return null;

    const midSection =
      buildingData.sections[Math.floor(buildingData.sections.length / 2)];
    const signY = midSection.yOffset;

    return (
      <group>
        {/* Neon sign on front */}
        <mesh position={[0, signY, midSection.depth / 2 + 0.1]}>
          <planeGeometry args={[midSection.width * 0.8, 2]} />
          <meshStandardMaterial
            color={buildingData.accentColor}
            emissive={buildingData.accentColor}
            emissiveIntensity={hovered ? 3 : 2}
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Vertical neon strips on corners */}
        {[
          [-midSection.width / 2, midSection.depth / 2],
          [midSection.width / 2, midSection.depth / 2],
          [-midSection.width / 2, -midSection.depth / 2],
          [midSection.width / 2, -midSection.depth / 2],
        ].map(([x, z], i) => (
          <mesh key={`strip-${i}`} position={[x, signY, z]}>
            <boxGeometry args={[0.2, midSection.height, 0.2]} />
            <meshStandardMaterial
              color={buildingData.emissiveColor}
              emissive={buildingData.emissiveColor}
              emissiveIntensity={hovered ? 2 : 1}
            />
          </mesh>
        ))}
      </group>
    );
  };

  return (
    <group position={position}>
      <group
        ref={groupRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Building sections */}
        {buildingData.sections.map((section, index) => (
          <group key={`section-${index}`}>
            {/* Main structure */}
            <mesh position={[0, section.yOffset, 0]} castShadow receiveShadow>
              <boxGeometry
                args={[section.width, section.height, section.depth]}
              />
              <meshStandardMaterial
                color="#0a0a15"
                emissive={buildingData.emissiveColor}
                emissiveIntensity={hovered ? 0.5 : 0.3}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>

            {/* Edge highlights */}
            <lineSegments position={[0, section.yOffset, 0]}>
              <edgesGeometry
                args={[
                  new THREE.BoxGeometry(
                    section.width,
                    section.height,
                    section.depth,
                  ),
                ]}
              />
              <lineBasicMaterial
                color={buildingData.accentColor}
                opacity={0.8}
                transparent
              />
            </lineSegments>

            {/* Windows */}
            {createWindows(
              section.width,
              section.height,
              section.depth,
              section.yOffset,
              index,
            )}

            {/* Setback terrace */}
            {section.hasSetback && (
              <mesh
                position={[0, section.yOffset - section.height / 2 - 0.1, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <ringGeometry
                  args={[
                    section.width / 2,
                    buildingData.sections[index - 1].width / 2,
                    32,
                  ]}
                />
                <meshStandardMaterial
                  color="#1a1a2e"
                  metalness={0.5}
                  roughness={0.5}
                />
              </mesh>
            )}
          </group>
        ))}

        {/* Rooftop details */}
        {createRooftopDetails()}

        {/* Cyberpunk elements */}
        {createCyberpunkElements()}
      </group>

      {/* Project title */}
      {project && (
        <Text
          position={[0, buildingData.totalHeight + 8, 0]}
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

      {/* Base platform */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry
          args={[
            buildingData.baseWidth * 0.6,
            buildingData.baseWidth * 0.7,
            32,
          ]}
        />
        <meshStandardMaterial
          color={buildingData.emissiveColor}
          emissive={buildingData.emissiveColor}
          emissiveIntensity={hovered ? 1.5 : 0.8}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default DetailedBuilding;
