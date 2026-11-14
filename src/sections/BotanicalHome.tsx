import type React from "react";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, PerspectiveCamera, Sky } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import MobileJoystick, { joystick } from "../components/MobileJoystick";
import RomanGarden from "../components/gallery/RomanGarden";
import { goldMat, stoneMat } from "../components/gallery/StoneMaterials";
import {
  PlayerAvatar,
  ViewToggleButton,
  createPlayer,
  getViewMode,
  toggleView,
} from "../components/gallery/PlayerAvatar";

// ── Door definitions ──────────────────────────────────────────────────────────
interface DoorDef {
  id: string;
  label: string;
  sub: string;
  navPath: string;
  pos: [number, number, number];
  yaw: number;  // Y-axis rotation so door faces player along its path
  doorScale: number;
  gold: string;
  goldDark: string;
  glowColor: string;
  pillarColor: string;
  stoneColor: string;
}

const GARDEN_DOORS: DoorDef[] = [
  {
    id: "experience",
    label: "Experience",
    sub: "Career · Internships",
    navPath: "/about",
    pos: [-14, 0, 10],
    yaw: -Math.PI / 4,
    doorScale: 0.82,
    gold: "#c9a24a",
    goldDark: "#6b5420",
    glowColor: "#d9b25a",
    pillarColor: "#cfc6b2",
    stoneColor: "#bdb4a0",
  },
  {
    id: "projects",
    label: "Projects",
    sub: "Engineering Work",
    navPath: "/projects",
    pos: [0, 0, 26],
    yaw: 0,
    doorScale: 1.0,
    gold: "#c9a24a",
    goldDark: "#6b5420",
    glowColor: "#d9b25a",
    pillarColor: "#cfc6b2",
    stoneColor: "#bdb4a0",
  },
  {
    id: "gallery",
    label: "Sketchbook",
    sub: "Art · Photography",
    navPath: "/gallery",
    pos: [14, 0, 10],
    yaw: Math.PI / 4,
    doorScale: 0.82,
    gold: "#c9a24a",
    goldDark: "#6b5420",
    glowColor: "#d9b25a",
    pillarColor: "#cfc6b2",
    stoneColor: "#bdb4a0",
  },
];

const START_Z = -18;

// ── Player (shared first/third-person view lives in PlayerAvatar.tsx) ───────
const PLAYER = createPlayer(0, 1.75, START_Z + 2); // eye position

// ── Path strip (diagonal) ─────────────────────────────────────────────────────
const PathStrip = ({
  fromXZ, toXZ, width = 5.4,
}: {
  fromXZ: [number, number]; toXZ: [number, number]; width?: number;
}) => {
  const dx = toXZ[0] - fromXZ[0];
  const dz = toXZ[1] - fromXZ[1];
  const len = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  const cx = (fromXZ[0] + toXZ[0]) / 2;
  const cz = (fromXZ[1] + toXZ[1]) / 2;
  return (
    <mesh rotation={[-Math.PI / 2, 0, angle]} position={[cx, 0.014, cz]}>
      <planeGeometry args={[width, len]} />
      <meshStandardMaterial color="#c2b8a8" roughness={0.58} metalness={0.04} />
    </mesh>
  );
};

// ── Lamp post (classical, gold-lined) ────────────────────────────────────────
const Lantern = ({ position }: { position: [number, number, number] }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (!lightRef.current) return;
    lightRef.current.intensity = 2.0 + Math.sin(clock.getElapsedTime() * 2.8 + position[2]) * 0.28;
  });
  return (
    <group position={position}>
      {/* stepped plinth */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.52, 0.2, 0.52]} />
        <primitive object={stoneMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.56, 0.04, 0.56]} />
        <primitive object={goldMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.3, 0.66, 0.3]} />
        <primitive object={stoneMat} attach="material" />
      </mesh>
      {/* slender column with gold bands */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.065, 0.085, 1.9, 14]} />
        <primitive object={stoneMat} attach="material" />
      </mesh>
      {[0.9, 1.55, 2.2].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.1, 0.022, 8, 18]} />
          <primitive object={goldMat} attach="material" />
        </mesh>
      ))}
      {/* capital */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.19, 0.08, 0.16, 14]} />
        <primitive object={goldMat} attach="material" />
      </mesh>
      {/* glass globe in a gold cage */}
      <mesh position={[0, 2.75, 0]}>
        <sphereGeometry args={[0.18, 18, 16]} />
        <meshStandardMaterial color="#fde68a" emissive="#f5b84a" emissiveIntensity={1.3} transparent opacity={0.7} roughness={0.5} />
      </mesh>
      {[0, Math.PI / 2].map((r) => (
        <mesh key={r} position={[0, 2.75, 0]} rotation={[0, r, 0]}>
          <torusGeometry args={[0.19, 0.012, 6, 24]} />
          <primitive object={goldMat} attach="material" />
        </mesh>
      ))}
      <mesh position={[0, 2.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.19, 0.012, 6, 24]} />
        <primitive object={goldMat} attach="material" />
      </mesh>
      {/* finial */}
      <mesh position={[0, 3.0, 0]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <primitive object={goldMat} attach="material" />
      </mesh>
      <pointLight ref={lightRef} position={[0, 2.75, 0]} color="#f5b84a" intensity={2.0} distance={6} decay={2} />
    </group>
  );
};

// Place lanterns flanking a path segment
const PathLanterns = ({
  fromXZ, toXZ, spacing = 6.5, sideOffset = 2.5,
}: {
  fromXZ: [number, number]; toXZ: [number, number]; spacing?: number; sideOffset?: number;
}) => {
  const positions = useMemo<[number, number, number][]>(() => {
    const dx = toXZ[0] - fromXZ[0];
    const dz = toXZ[1] - fromXZ[1];
    const len = Math.sqrt(dx * dx + dz * dz);
    const nx = dx / len, nz = dz / len;
    const px = -nz, pz = nx; // perpendicular
    const count = Math.floor(len / spacing);
    const arr: [number, number, number][] = [];
    for (let i = 1; i <= count; i++) {
      const t = i * spacing;
      const bx = fromXZ[0] + nx * t;
      const bz = fromXZ[1] + nz * t;
      arr.push([bx + px * sideOffset, 0, bz + pz * sideOffset]);
      arr.push([bx - px * sideOffset, 0, bz - pz * sideOffset]);
    }
    return arr.filter(([x, , z]) => clearOfPaths(x, z, 3.5));
  }, [fromXZ, toXZ, spacing, sideOffset]);

  return <group>{positions.map((p, i) => <Lantern key={i} position={p} />)}</group>;
};

// ── Rose bush ─────────────────────────────────────────────────────────────────
const RoseBush = ({ position }: { position: [number, number, number] }) => {
  const blooms = useMemo(() =>
    Array.from({ length: 7 }, () => ({
      dx: (Math.random() - 0.5) * 0.85,
      dz: (Math.random() - 0.5) * 0.85,
      s: Math.random() * 0.2 + 0.14,
    })), []);
  return (
    <group position={position}>
      <mesh position={[0, 0.34, 0]}>
        <sphereGeometry args={[0.65, 6, 6]} />
        <meshStandardMaterial color="#102018" roughness={1} />
      </mesh>
      {blooms.map((r, i) => (
        <mesh key={i} position={[r.dx, 0.7 + r.s, r.dz]}>
          <sphereGeometry args={[r.s, 5, 5]} />
          <meshStandardMaterial color="#ede8e0" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

// Place rose bushes flanking a path
const PathRoses = ({
  fromXZ, toXZ, spacing = 4, sideOffset = 3,
}: {
  fromXZ: [number, number]; toXZ: [number, number]; spacing?: number; sideOffset?: number;
}) => {
  const positions = useMemo<[number, number, number][]>(() => {
    const dx = toXZ[0] - fromXZ[0];
    const dz = toXZ[1] - fromXZ[1];
    const len = Math.sqrt(dx * dx + dz * dz);
    const nx = dx / len, nz = dz / len;
    const px = -nz, pz = nx;
    const count = Math.floor(len / spacing);
    const arr: [number, number, number][] = [];
    for (let i = 1; i < count; i++) {
      const t = i * spacing + (Math.random() - 0.5) * 0.8;
      const bx = fromXZ[0] + nx * t;
      const bz = fromXZ[1] + nz * t;
      arr.push([bx + px * (sideOffset + Math.random() * 0.6), 0, bz + pz * (sideOffset + Math.random() * 0.6)]);
      arr.push([bx - px * (sideOffset + Math.random() * 0.6), 0, bz - pz * (sideOffset + Math.random() * 0.6)]);
    }
    return arr.filter(([x, , z]) => clearOfPaths(x, z, 3.5));
  }, [fromXZ, toXZ, spacing, sideOffset]);

  return <group>{positions.map((p, i) => <RoseBush key={i} position={p} />)}</group>;
};

// ── Trees ─────────────────────────────────────────────────────────────────────
// Italian cypress: tall, slender, dark.
const DarkTree = ({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 1.2, 0]}>
      <cylinderGeometry args={[0.3, 0.45, 2.4, 8]} />
      <meshStandardMaterial color="#1a120a" roughness={1} />
    </mesh>
    <mesh position={[0, 9.2, 0]}>
      <coneGeometry args={[1.9, 16, 14]} />
      <meshStandardMaterial color="#12281a" roughness={0.97} />
    </mesh>
    <mesh position={[0, 7.2, 0]}>
      <coneGeometry args={[1.5, 11, 12]} />
      <meshStandardMaterial color="#0f2416" roughness={0.97} />
    </mesh>
  </group>
);

// Italian stone pine (umbrella pine): bare trunk, broad flat canopy.
const StonePine = ({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 4.6, 0]} rotation={[0, 0, 0.04]}>
      <cylinderGeometry args={[0.38, 0.6, 9.2, 8]} />
      <meshStandardMaterial color="#2a1c10" roughness={1} />
    </mesh>
    {[
      [0, 10.4, 0, 5.2],
      [2.6, 9.6, 1.2, 3.6],
      [-2.4, 9.9, -1.0, 3.8],
      [0.6, 11.4, -0.4, 3.2],
    ].map(([x, y, z, r], i) => (
      <mesh key={i} position={[x, y, z]} scale={[1, 0.34, 1]}>
        <sphereGeometry args={[r, 14, 10]} />
        <meshStandardMaterial color={i % 2 ? "#14301c" : "#112a18"} roughness={0.97} />
      </mesh>
    ))}
  </group>
);

// ── Mountains ─────────────────────────────────────────────────────────────────
const Mountain = ({ pos, rx, h }: { pos: [number,number,number]; rx: number; h: number }) => (
  <mesh position={pos}>
    <coneGeometry args={[rx, h, 7]} />
    <meshStandardMaterial color="#232830" roughness={1} metalness={0} />
  </mesh>
);

const Mountains = () => (
  <group>
    {/* Far back row */}
    <Mountain pos={[-80, 28, -80]} rx={32} h={68} />
    <Mountain pos={[-44, 22, -85]} rx={26} h={52} />
    <Mountain pos={[-10, 26, -92]} rx={30} h={60} />
    <Mountain pos={[28, 20, -88]} rx={27} h={50} />
    <Mountain pos={[66, 24, -78]} rx={31} h={58} />
    <Mountain pos={[100, 18, -65]} rx={24} h={44} />
    {/* Mid row */}
    <Mountain pos={[-65, 16, -55]} rx={20} h={38} />
    <Mountain pos={[-32, 14, -62]} rx={18} h={32} />
    <Mountain pos={[16, 12, -66]} rx={17} h={30} />
    <Mountain pos={[52, 15, -58]} rx={21} h={36} />
    {/* Side mountains */}
    <Mountain pos={[-90, 14, -10]} rx={22} h={35} />
    <Mountain pos={[-85, 10, 20]} rx={17} h={26} />
    <Mountain pos={[88, 13, -5]} rx={20} h={32} />
    <Mountain pos={[82, 9, 22]} rx={16} h={24} />
    {/* Behind the doors */}
    <Mountain pos={[-30, 12, 50]} rx={18} h={28} />
    <Mountain pos={[30, 11, 52]} rx={17} h={26} />
  </group>
);

const Forest = () => {
  const trees = useMemo(() => [
    // Left side — two rows deep
    { p: [-22, 0, -18] as [number, number, number], t: "e", s: 1.8 },
    { p: [-30, 0, -14] as [number, number, number], t: "e", s: 2.0 },
    { p: [-18, 0, -8]  as [number, number, number], t: "c", s: 1.6 },
    { p: [-28, 0, -4]  as [number, number, number], t: "c", s: 1.9 },
    { p: [-24, 0,  4]  as [number, number, number], t: "e", s: 2.1 },
    { p: [-32, 0,  8]  as [number, number, number], t: "e", s: 1.8 },
    { p: [-20, 0, 14]  as [number, number, number], t: "c", s: 1.7 },
    { p: [-30, 0, 18]  as [number, number, number], t: "c", s: 2.0 },
    { p: [-22, 0, 22]  as [number, number, number], t: "e", s: 1.9 },
    { p: [-28, 0, 28]  as [number, number, number], t: "e", s: 1.7 },
    { p: [-18, 0, 32]  as [number, number, number], t: "c", s: 1.6 },
    // Right side — two rows deep
    { p: [22,  0, -18] as [number, number, number], t: "c", s: 1.7 },
    { p: [30,  0, -14] as [number, number, number], t: "e", s: 2.0 },
    { p: [18,  0, -8]  as [number, number, number], t: "e", s: 1.8 },
    { p: [28,  0, -4]  as [number, number, number], t: "c", s: 1.9 },
    { p: [24,  0,  4]  as [number, number, number], t: "c", s: 2.1 },
    { p: [32,  0,  8]  as [number, number, number], t: "e", s: 1.7 },
    { p: [20,  0, 14]  as [number, number, number], t: "e", s: 1.9 },
    { p: [30,  0, 18]  as [number, number, number], t: "c", s: 1.8 },
    { p: [22,  0, 22]  as [number, number, number], t: "c", s: 2.0 },
    { p: [28,  0, 28]  as [number, number, number], t: "e", s: 1.8 },
    { p: [18,  0, 32]  as [number, number, number], t: "e", s: 1.6 },
    // Back row
    { p: [-12, 0, -30] as [number, number, number], t: "e", s: 2.2 },
    { p: [-6,  0, -32] as [number, number, number], t: "c", s: 1.9 },
    { p: [0,   0, -34] as [number, number, number], t: "e", s: 2.0 },
    { p: [6,   0, -32] as [number, number, number], t: "c", s: 1.8 },
    { p: [12,  0, -30] as [number, number, number], t: "e", s: 2.1 },
    // Behind the side doors
    { p: [-16, 0,  18] as [number, number, number], t: "c", s: 1.6 },
    { p: [16,  0,  18] as [number, number, number], t: "c", s: 1.7 },
    { p: [-12, 0,  34] as [number, number, number], t: "e", s: 1.8 },
    { p: [12,  0,  34] as [number, number, number], t: "e", s: 1.9 },
    { p: [0,   0,  40] as [number, number, number], t: "c", s: 2.0 },
  ], []);

  return (
    <group>
      {trees.map((t, i) =>
        t.t === "e"
          ? <DarkTree key={i} position={t.p} scale={t.s} />
          : <StonePine key={i} position={t.p} scale={t.s * 0.8} />
      )}
    </group>
  );
};

// ── Firefly ───────────────────────────────────────────────────────────────────
const Firefly = ({ ox, oz }: { ox: number; oz: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  const t0 = useRef(Math.random() * 100);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() + t0.current;
    ref.current.position.set(
      ox + Math.sin(t * 0.8) * 2.2,
      Math.sin(t * 1.2) * 0.5 + 1.2,
      oz + Math.cos(t * 0.6) * 2.2
    );
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.4 + Math.abs(Math.sin(t * 2.8)) * 1.8;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.034, 5, 5]} />
      <meshStandardMaterial color="#fde68a" emissive="#fbbf24" emissiveIntensity={1} />
    </mesh>
  );
};

// ── Grand garden door ─────────────────────────────────────────────────────────
const GardenDoor = ({
  door, onEnter,
}: {
  door: DoorDef;
  onEnter: (path: string) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const [near, setNear] = useState(false);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (glowRef.current)
      glowRef.current.intensity = 2.5 + Math.sin(clock.getElapsedTime() * 1.4 + door.pos[0]) * 0.7;
    const dist = PLAYER.pos.distanceTo(new THREE.Vector3(...door.pos));
    setNear(dist < 6.5);
  });

  const { gold, goldDark, glowColor, pillarColor, stoneColor } = door;

  return (
    <group position={door.pos} scale={door.doorScale} rotation={[0, door.yaw, 0]}>
      <pointLight ref={glowRef} color={glowColor} intensity={2.5} distance={16} decay={2} />

      {/* Steps */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * 0.2, i * -0.25]}>
          <boxGeometry args={[5.5 - i * 0.4, 0.2, 0.55]} />
          <meshStandardMaterial color={stoneColor} roughness={0.8} metalness={0.1} />
        </mesh>
      ))}

      {/* Base */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[7, 0.1, 1.6]} />
        <meshStandardMaterial color="#807870" roughness={0.82} />
      </mesh>

      {/* Left column */}
      <mesh position={[-2.6, 4.2, 0]}>
        <cylinderGeometry args={[0.3, 0.36, 8.4, 10]} />
        <meshStandardMaterial color={pillarColor} roughness={0.75} metalness={0.1} />
      </mesh>
      <mesh position={[-2.6, 8.6, 0]}>
        <boxGeometry args={[0.84, 0.34, 0.84]} />
        <meshStandardMaterial color={stoneColor} roughness={0.7} />
      </mesh>

      {/* Right column */}
      <mesh position={[2.6, 4.2, 0]}>
        <cylinderGeometry args={[0.3, 0.36, 8.4, 10]} />
        <meshStandardMaterial color={pillarColor} roughness={0.75} metalness={0.1} />
      </mesh>
      <mesh position={[2.6, 8.6, 0]}>
        <boxGeometry args={[0.84, 0.34, 0.84]} />
        <meshStandardMaterial color={stoneColor} roughness={0.7} />
      </mesh>

      {/* Entablature */}
      <mesh position={[0, 8.88, 0]}>
        <boxGeometry args={[6.5, 0.56, 0.65]} />
        <meshStandardMaterial color={stoneColor} roughness={0.7} metalness={0.08} />
      </mesh>

      {/* Pediment */}
      <mesh position={[0, 9.55, 0]}>
        <cylinderGeometry args={[0, 2.6, 1.3, 3]} />
        <meshStandardMaterial color="#9a9288" roughness={0.72} />
      </mesh>

      {/* Gold lining: entablature, pediment edges, column bands, step edges */}
      {[8.62, 9.16].map((y) => (
        <mesh key={y} position={[0, y, 0.02]}>
          <boxGeometry args={[6.6, 0.06, 0.7]} />
          <primitive object={goldMat} attach="material" />
        </mesh>
      ))}
      {[-1, 1].map((sd) => (
        <mesh key={sd} position={[sd * 1.3, 9.55, 0.34]} rotation={[0, 0, sd * -0.4636]}>
          <boxGeometry args={[2.95, 0.07, 0.06]} />
          <primitive object={goldMat} attach="material" />
        </mesh>
      ))}
      {[-2.6, 2.6].flatMap((x) =>
        [0.7, 4.2, 7.9].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.36, 0.04, 8, 20]} />
            <primitive object={goldMat} attach="material" />
          </mesh>
        ))
      )}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * 0.2 + 0.11, i * -0.25 - 0.28]}>
          <boxGeometry args={[5.5 - i * 0.4, 0.03, 0.04]} />
          <primitive object={goldMat} attach="material" />
        </mesh>
      ))}

      {/* Gold arch */}
      <mesh position={[0, 5.8, 0.08]}>
        <torusGeometry args={[1.85, 0.16, 10, 28, Math.PI]} />
        <meshStandardMaterial color={gold} metalness={0.3} roughness={0.78} emissive={goldDark} emissiveIntensity={0.2} />
      </mesh>

      {/* Door panels */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.86, 3.2, 0.04]}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={() => onEnter(door.navPath)}
        >
          <boxGeometry args={[1.72, 6.4, 0.13]} />
          <meshStandardMaterial
            color={hovered ? "#2c2c32" : "#1a1a1e"}
            roughness={0.6}
            metalness={0.12}
            emissive={hovered ? "#5a4416" : "#0a0906"}
            emissiveIntensity={hovered ? 0.38 : 0.06}
          />
        </mesh>
      ))}

      {/* Gold door frame */}
      {[
        [0, 0.05, 0.11, 3.6, 0.11] as [number,number,number,number,number],
        [0, 6.38, 0.11, 3.6, 0.11],
        [-1.82, 3.2, 0.11, 0.11, 6.44],
        [1.82, 3.2, 0.11, 0.11, 6.44],
      ].map(([x, y, z, w, h], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[w, h, 0.1]} />
          <meshStandardMaterial color={gold} metalness={0.3} roughness={0.78} emissive={goldDark} emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* Gold cross bars */}
      {[-1, 1].map((side) =>
        [1.7, 3.2, 4.7].map((y) => (
          <mesh key={`${side}-${y}`} position={[side * 0.86, y, 0.12]}>
            <boxGeometry args={[1.58, 0.055, 0.055]} />
            <meshStandardMaterial color={gold} metalness={0.3} roughness={0.78} />
          </mesh>
        ))
      )}

      {/* Door knobs */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.12, 3.2, 0.19]}>
          <sphereGeometry args={[0.092, 9, 9]} />
          <meshStandardMaterial color="#c8a438" metalness={0.3} roughness={0.75} />
        </mesh>
      ))}

      {/* Inner glow plane */}
      <mesh position={[0, 3.3, -0.08]}>
        <planeGeometry args={[3.3, 6.7]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={hovered ? 0.45 : 0.18}
          transparent opacity={0.09}
        />
      </mesh>

      {/* Label */}
      <Html position={[0, 10.6, 0]} center>
        <div style={{ pointerEvents: "none", textAlign: "center" }}>
          <p style={{
            color: gold,
            fontSize: "10px",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            fontFamily: "Georgia, serif",
            textShadow: `0 0 14px ${glowColor}`,
            whiteSpace: "nowrap",
            marginBottom: "3px",
          }}>
            {door.label}
          </p>
          <p style={{
            color: "rgba(180,170,155,0.45)",
            fontSize: "8px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontFamily: "Georgia, serif",
            whiteSpace: "nowrap",
          }}>
            {door.sub}
          </p>
        </div>
      </Html>

      {near && (
        <Html position={[0, -1.2, 0.3]} center>
          <div style={{
            pointerEvents: "none",
            padding: "5px 16px",
            background: "rgba(0,0,0,0.6)",
            border: `1px solid ${gold}66`,
            borderRadius: "2px",
          }}>
            <p style={{
              color: gold,
              fontSize: "9px",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontFamily: "Georgia, serif",
              whiteSpace: "nowrap",
            }}>
              Press E or Click
            </p>
          </div>
        </Html>
      )}
    </group>
  );
};

// ── WASD controls ─────────────────────────────────────────────────────────────
const WASDControls = ({
  onEnter,
  onNearDoor,
}: {
  onEnter: (path: string) => void;
  onNearDoor: (door: DoorDef | null) => void;
}) => {
  const { camera } = useThree();
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const yaw = useRef(Math.PI);
  const pitch = useRef(0);
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const lookTouchId = useRef<number | null>(null);
  const _euler = useMemo(() => new THREE.Euler(0, 0, 0, "YXZ"), []);
  const nearDoorRef = useRef<DoorDef | null>(null);

  // start every visit at the entrance, facing the garden
  useEffect(() => {
    PLAYER.pos.set(0, 1.75, START_Z + 2);
    PLAYER.charYaw = 0;
    PLAYER.moving = false;
  }, []);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w" || k === "arrowup") keys.current.w = true;
      if (k === "s" || k === "arrowdown") keys.current.s = true;
      if (k === "a" || k === "arrowleft") keys.current.a = true;
      if (k === "d" || k === "arrowright") keys.current.d = true;
      if (k === "v") toggleView();
      if (k === "e") {
        const camPos = PLAYER.pos;
        for (const door of GARDEN_DOORS) {
          if (camPos.distanceTo(new THREE.Vector3(...door.pos)) < 6.5) {
            onEnter(door.navPath);
            break;
          }
        }
      }
    };
    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w" || k === "arrowup") keys.current.w = false;
      if (k === "s" || k === "arrowdown") keys.current.s = false;
      if (k === "a" || k === "arrowleft") keys.current.a = false;
      if (k === "d" || k === "arrowright") keys.current.d = false;
    };

    // Mouse look
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging.current = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      yaw.current -= dx * 0.003;
      pitch.current = Math.max(-0.55, Math.min(0.5, pitch.current - dy * 0.003));
    };

    // Touch look — only tracks touches on the right half of the screen
    const onTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (lookTouchId.current === null && t.clientX > window.innerWidth * 0.42) {
          lookTouchId.current = t.identifier;
          lastPointer.current = { x: t.clientX, y: t.clientY };
        }
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === lookTouchId.current) {
          const dx = t.clientX - lastPointer.current.x;
          const dy = t.clientY - lastPointer.current.y;
          lastPointer.current = { x: t.clientX, y: t.clientY };
          yaw.current -= dx * 0.004;
          pitch.current = Math.max(-0.55, Math.min(0.5, pitch.current - dy * 0.004));
        }
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === lookTouchId.current) {
          lookTouchId.current = null;
        }
      }
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [camera, onEnter]);

  useFrame((_, dt) => {
    // movement is relative to the look direction (yaw), in both view modes
    const dir = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));

    const vel = new THREE.Vector3();
    const jx = joystick.dx;
    const jy = joystick.dy;
    if (keys.current.w || jy < -0.2) vel.add(dir);
    if (keys.current.s || jy > 0.2) vel.sub(dir);
    if (keys.current.a || jx < -0.2) vel.add(new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), dir));
    if (keys.current.d || jx > 0.2) vel.add(new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)));

    const moving = vel.length() > 0;
    PLAYER.moving = moving;
    if (moving) {
      vel.normalize();
      PLAYER.pos.addScaledVector(vel, 7 * dt);
      // turn the character smoothly toward its movement direction
      const target = Math.atan2(vel.x, vel.z);
      let diff = target - PLAYER.charYaw;
      diff = ((diff + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
      PLAYER.charYaw += diff * Math.min(1, dt * 12);
    }
    PLAYER.pos.x = Math.max(-22, Math.min(22, PLAYER.pos.x));
    PLAYER.pos.z = Math.max(START_Z - 1, Math.min(32, PLAYER.pos.z));
    PLAYER.pos.y = 1.75;

    if (getViewMode() === "first") {
      _euler.set(pitch.current, yaw.current, 0);
      camera.quaternion.setFromEuler(_euler);
      camera.position.copy(PLAYER.pos);
    } else {
      // third person: orbit behind the character; dragging up/down tilts the view
      const e = THREE.MathUtils.clamp(0.28 - pitch.current * 0.9, 0.03, 1.1);
      const D = 5.4;
      const tx = PLAYER.pos.x;
      const ty = 1.3;
      const tz = PLAYER.pos.z;
      camera.position.set(
        tx - dir.x * D * Math.cos(e),
        Math.max(0.6, ty + D * Math.sin(e)),
        tz - dir.z * D * Math.cos(e)
      );
      camera.lookAt(tx, ty + 0.2, tz);
    }

    // Near-door detection for mobile enter button
    let closest: DoorDef | null = null;
    for (const door of GARDEN_DOORS) {
      if (PLAYER.pos.distanceTo(new THREE.Vector3(...door.pos)) < 6.5) {
        closest = door;
        break;
      }
    }
    if (closest !== nearDoorRef.current) {
      nearDoorRef.current = closest;
      onNearDoor(closest);
    }
  });

  return null;
};

// ── Garden scene ──────────────────────────────────────────────────────────────
const JUNCTION: [number, number] = [0, -4]; // where paths diverge
const DOOR_POSES = GARDEN_DOORS.map((d) => ({ pos: d.pos, yaw: d.yaw }));

// Every path centreline, used to keep props off the (widened) paths.
const PATH_SEGS: { a: [number, number]; b: [number, number] }[] = [
  { a: [0, START_Z + 2], b: JUNCTION },
  ...GARDEN_DOORS.map((d) => ({ a: JUNCTION, b: [d.pos[0], d.pos[2]] as [number, number] })),
];
function clearOfPaths(x: number, z: number, minDist: number) {
  return PATH_SEGS.every(({ a, b }) => {
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / (dx * dx + dz * dz)));
    return Math.hypot(x - (a[0] + t * dx), z - (a[1] + t * dz)) >= minDist;
  });
}

const GardenScene = ({
  onEnter,
  onNearDoor,
}: {
  onEnter: (path: string) => void;
  onNearDoor: (door: DoorDef | null) => void;
}) => {
  const fireflyData = useMemo(() =>
    Array.from({ length: 20 }, () => ({
      ox: (Math.random() - 0.5) * 32,
      oz: Math.random() * 44 - 10,
    })), []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.75, START_Z + 2]} fov={68} near={0.1} far={300} />
      <WASDControls onEnter={onEnter} onNearDoor={onNearDoor} />
      <PlayerAvatar player={PLAYER} />

      <Sky
        distance={450000}
        sunPosition={[0.2, 0.1, -1]}
        turbidity={6}
        rayleigh={1.6}
        mieCoefficient={0.007}
        mieDirectionalG={0.78}
      />
      <fog attach="fog" args={["#2e2c33", 60, 145]} />

      {/* Twilight lighting: warm low sun from behind, cool fill from sky */}
      <ambientLight intensity={0.38} color="#f0c878" />
      <hemisphereLight args={["#6a4a28", "#141018", 0.42]} />
      <directionalLight position={[5, 4, -22]} intensity={0.75} color="#ff8c38" castShadow={false} />
      <directionalLight position={[-12, 18, 8]} intensity={0.22} color="#9080c8" />
      <pointLight position={[0, 40, -20]} color="#ff7020" intensity={3} distance={160} decay={2} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 6]}>
        <planeGeometry args={[240, 240]} />
        <meshStandardMaterial color="#1a2410" roughness={1} />
      </mesh>

      {/* 4 path strips: entrance + 3 branches */}
      <PathStrip fromXZ={[0, START_Z + 2]} toXZ={JUNCTION} width={5.6} />
      <PathStrip fromXZ={JUNCTION} toXZ={[-14, 10]} />
      <PathStrip fromXZ={JUNCTION} toXZ={[0, 26]} />
      <PathStrip fromXZ={JUNCTION} toXZ={[14, 10]} />

      {/* Junction circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.013, JUNCTION[1]]}>
        <circleGeometry args={[4, 20]} />
        <meshStandardMaterial color="#c2b8a8" roughness={0.55} metalness={0.04} />
      </mesh>

      {/* Lanterns along each path */}
      <PathLanterns fromXZ={[0, START_Z + 2]} toXZ={JUNCTION} spacing={6} sideOffset={3.8} />
      <PathLanterns fromXZ={JUNCTION} toXZ={[-14, 10]} spacing={5.5} sideOffset={3.8} />
      <PathLanterns fromXZ={JUNCTION} toXZ={[0, 26]} spacing={6} sideOffset={3.8} />
      <PathLanterns fromXZ={JUNCTION} toXZ={[14, 10]} spacing={5.5} sideOffset={3.8} />

      {/* Rose bushes flanking paths */}
      <PathRoses fromXZ={[0, START_Z + 2]} toXZ={JUNCTION} spacing={5} sideOffset={4.6} />
      <PathRoses fromXZ={JUNCTION} toXZ={[-14, 10]} spacing={4.5} sideOffset={4.6} />
      <PathRoses fromXZ={JUNCTION} toXZ={[0, 26]} spacing={5} sideOffset={4.6} />
      <PathRoses fromXZ={JUNCTION} toXZ={[14, 10]} spacing={4.5} sideOffset={4.6} />

      {/* Luxurious Roman garden layer: paving, balustrades, arch, forecourts */}
      <RomanGarden
        start={[0, START_Z + 2]}
        junction={JUNCTION}
        doors={DOOR_POSES}
      />

      {/* Background mountains */}
      <Mountains />

      {/* Background forest */}
      <Forest />

      {/* 3 grand doors */}
      {GARDEN_DOORS.map((door) => (
        <GardenDoor key={door.id} door={door} onEnter={onEnter} />
      ))}

      {/* Fireflies */}
      {fireflyData.map((d, i) => <Firefly key={i} ox={d.ox} oz={d.oz} />)}
    </>
  );
};

// ── HUD ───────────────────────────────────────────────────────────────────────
const KEY_STYLE: React.CSSProperties = {
  width: "24px", height: "24px",
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.13)",
  borderRadius: "3px",
  color: "rgba(200,190,175,0.65)",
  fontSize: "10px", fontFamily: "monospace",
};

const HUD = ({ isMobile }: { isMobile: boolean }) => (
  <div style={{
    position: "fixed", bottom: "28px", left: "50%", transform: "translateX(-50%)",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
    pointerEvents: "none", zIndex: 10,
  }}>
    {!isMobile && (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
        <div style={KEY_STYLE}>W</div>
        <div style={{ display: "flex", gap: "3px" }}>
          {["A", "S", "D"].map((k) => <div key={k} style={KEY_STYLE}>{k}</div>)}
        </div>
      </div>
    )}
    <p style={{
      color: "rgba(160,150,135,0.5)",
      fontSize: "9px", letterSpacing: "0.36em",
      textTransform: "uppercase", fontFamily: "Georgia, serif",
    }}>
      {isMobile ? "Joystick · Swipe right to look · Walk to a door" : "Move · Drag to look · V switch view · Walk to a door"}
    </p>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const BotanicalHome = () => {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);
  const [nearDoor, setNearDoor] = useState<DoorDef | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const handleEnter = useCallback((path: string) => {
    setTransitioning(true);
    setTimeout(() => navigate(path), 650);
  }, [navigate]);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#1a0c2e", position: "relative" }}>
      <Canvas
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        style={{ display: "block" }}
      >
        <GardenScene onEnter={handleEnter} onNearDoor={setNearDoor} />
      </Canvas>

      {isMobile && <MobileJoystick />}

      {/* Back to Portfolio */}
      <button
        onClick={() => { window.close(); setTimeout(() => { window.location.href = "https://jewook.com"; }, 300); }}
        style={{
          position: "fixed", top: "16px", left: "16px", zIndex: 30,
          display: "flex", alignItems: "center", gap: "6px",
          padding: "8px 14px",
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "8px",
          color: "rgba(255,255,255,0.8)",
          fontSize: "13px",
          fontFamily: "Georgia, serif",
          letterSpacing: "0.04em",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.65)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.45)")}
      >
        ← Portfolio
      </button>

      {/* Mobile enter button — appears when standing near a door */}
      {isMobile && nearDoor && (
        <div style={{
          position: "fixed", bottom: "44px", right: "44px",
          zIndex: 20,
        }}>
          <button
            onTouchStart={(e) => { e.preventDefault(); handleEnter(nearDoor.navPath); }}
            onClick={() => handleEnter(nearDoor.navPath)}
            style={{
              padding: "14px 28px",
              background: nearDoor.gold,
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontFamily: "Georgia, serif",
              letterSpacing: "0.06em",
              boxShadow: `0 0 18px ${nearDoor.glowColor}88`,
              cursor: "pointer",
            }}
          >
            Enter {nearDoor.label} →
          </button>
        </div>
      )}

      {/* View switch: first person <-> third person */}
      <ViewToggleButton isMobile={isMobile} />

      <HUD isMobile={isMobile} />

      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ position: "fixed", inset: 0, background: "#1a0c2e", zIndex: 100, pointerEvents: "none" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BotanicalHome;
