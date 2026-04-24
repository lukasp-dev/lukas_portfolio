import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Sky } from "@react-three/drei";
import React, {
  Suspense,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as THREE from "three";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { Vector3 } from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { motion, AnimatePresence } from "framer-motion";
import MobileJoystick, { joystick } from "../components/MobileJoystick";
import GalleryNavbar from "../components/gallery/GalleryNavbar";
import { experiences } from "../constants";

// Oldest → newest chronological order for path progression
const chronoExps = [...experiences].reverse();

// ─── Constants ─────────────────────────────────────────────────────────────────
// Path: player enters south (z≈18), walks north (z→-18), fountain at north end
// Numbered 01(oldest)→09(newest). 01–04 on left, 05–09 on right.
// Station 09 (Microsoft, newest) is at z=16 — closest to the door.
const STATIONS: { x: number; z: number }[] = [
  { x: -9.5, z: -8 }, // 01 WPI         (oldest, farthest from door)
  { x: -9.5, z: -1 }, // 02 MoD
  { x: -9.5, z: 6 }, // 03 Gallery SOMA
  { x: -9.5, z: 12 }, // 04 Stride Labs
  { x: 9.5, z: -5 }, // 05 VIP
  { x: 9.5, z: 3 }, // 06 GPC
  { x: 9.5, z: 10 }, // 07 Itential
  { x: 9.5, z: 16 }, // 08 Microsoft   (newest, closest to door)
];

// All gold tones — modern, elegant, unified palette
const EXP_COLORS = [
  "#d4a820",
  "#e8c030",
  "#b89018",
  "#d0a828",
  "#e4b824",
  "#c8a020",
  "#dab030",
  "#c09018",
];

const TREE_DEFS: { x: number; z: number; h: number; s: number }[] = [
  { x: -12, z: 17, h: 7.0, s: 2.4 },
  { x: 13, z: 15, h: 5.8, s: 1.9 },
  { x: -13, z: 11, h: 8.0, s: 2.8 },
  { x: 13, z: 7, h: 6.2, s: 2.1 },
  { x: -12, z: 2, h: 7.5, s: 2.5 },
  { x: 12, z: -3, h: 5.5, s: 1.8 },
  { x: -13, z: -8, h: 8.5, s: 3.0 },
  { x: 12, z: -13, h: 6.0, s: 2.0 },
  { x: -14, z: 6, h: 9.0, s: 3.2 },
  { x: 14, z: 11, h: 6.5, s: 2.2 },
  { x: -5, z: 21, h: 6.0, s: 2.0 },
  { x: 5, z: 21, h: 5.5, s: 1.8 },
  { x: -13, z: -18, h: 7.0, s: 2.3 },
  { x: 11, z: -19, h: 6.0, s: 2.0 },
];

const LANTERN_Z = [15, 10, 5, 0, -5, -10, -15];

// ─── Animated water droplets arcing from upper basin to outer basin ───────────
const WaterDrops = () => {
  const COUNT = 14;
  const phases = useRef(Array.from({ length: COUNT }, (_, i) => i / COUNT));
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_, dt) => {
    phases.current.forEach((p, i) => {
      phases.current[i] = (p + dt * 0.42) % 1;
      const mesh = meshRefs.current[i];
      if (!mesh) return;
      const t = phases.current[i];
      const angle = (i / COUNT) * Math.PI * 2;
      const r = 1.42 + (3.05 - 1.42) * t;
      // parabolic arc: starts high at upper basin rim, falls to outer water surface
      const y = 5.92 + (1.38 - 5.92) * t - t * (1 - t) * 1.8;
      mesh.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.75 - t * 0.35;
    });
  });

  return (
    <>
      {Array.from({ length: COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.055, 5, 5]} />
          <meshStandardMaterial
            color="#b0d8ff"
            emissive="#2060d0"
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
            roughness={0.04}
            metalness={0.9}
          />
        </mesh>
      ))}
    </>
  );
};

// ─── Roman Gothic Fountain ─────────────────────────────────────────────────────
const RomanFountain = () => {
  const outerWaterRef = useRef<THREE.Mesh>(null);
  const innerWaterRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outerWaterRef.current)
      (
        outerWaterRef.current.material as THREE.MeshStandardMaterial
      ).emissiveIntensity = 0.38 + Math.sin(t * 1.1) * 0.12;
    if (innerWaterRef.current)
      (
        innerWaterRef.current.material as THREE.MeshStandardMaterial
      ).emissiveIntensity = 0.45 + Math.sin(t * 1.4 + 1) * 0.14;
  });

  // Gypsum: warm off-white, very rough matte plaster — no shine at all
  const G = { color: "#ede8e0", roughness: 0.94, metalness: 0.0 };
  // Brass hardware for rims and finials
  const B = { color: "#c09828", roughness: 0.28, metalness: 0.82 };

  return (
    <group position={[0, 0, -17]}>
      {/* Three-step circular base */}
      {[5.4, 4.5, 3.6].map((r, i) => (
        <mesh key={r} position={[0, i * 0.22, 0]} receiveShadow>
          <cylinderGeometry args={[r - 0.1, r + 0.3, 0.22, 48]} />
          <meshStandardMaterial
            {...G}
            color={["#d8d4cc", "#e0dcd4", "#e8e4dc"][i]}
          />
        </mesh>
      ))}

      {/* Outer basin walls */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[3.2, 3.4, 1.0, 48]} />
        <meshStandardMaterial {...G} />
      </mesh>
      {/* Outer basin rim — brass torus */}
      <mesh position={[0, 1.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.3, 0.16, 12, 64]} />
        <meshStandardMaterial {...B} />
      </mesh>
      {/* Outer basin inner wall (slightly darker) */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[3.18, 3.18, 0.64, 48, 1, true]} />
        <meshStandardMaterial
          color="#ccc8c0"
          roughness={0.7}
          metalness={0}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Water — outer basin */}
      <mesh
        ref={outerWaterRef}
        position={[0, 1.36, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[3.1, 56]} />
        <meshStandardMaterial
          color="#1a3868"
          emissive="#2860c8"
          emissiveIntensity={0.38}
          roughness={0.02}
          metalness={0.95}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Central Gothic column — octagonal, gypsum */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.46, 3.8, 8]} />
        <meshStandardMaterial {...G} roughness={0.94} />
      </mesh>
      {/* Column base plinth */}
      <mesh position={[0, 1.54, 0]}>
        <cylinderGeometry args={[0.64, 0.58, 0.3, 8]} />
        <meshStandardMaterial {...G} color="#dedad2" />
      </mesh>
      {/* Brass collar at base */}
      <mesh position={[0, 1.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.52, 0.04, 8, 32]} />
        <meshStandardMaterial {...B} />
      </mesh>

      {/* Four Gothic ribbed arches around the column */}
      {([0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2] as number[]).map(
        (angle, i) => (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh position={[0.74, 2.5, 0]} castShadow>
              <boxGeometry args={[0.09, 2.8, 0.09]} />
              <meshStandardMaterial {...G} color="#dedad4" roughness={0.94} />
            </mesh>
            <mesh position={[-0.74, 2.5, 0]} castShadow>
              <boxGeometry args={[0.09, 2.8, 0.09]} />
              <meshStandardMaterial {...G} color="#dedad4" roughness={0.94} />
            </mesh>
            {/* Pointed arch halves — gypsum with brass tip */}
            <mesh position={[0.37, 4.05, 0]} rotation={[0, 0, -0.57]}>
              <boxGeometry args={[0.07, 0.72, 0.07]} />
              <meshStandardMaterial {...G} color="#e4e0d8" />
            </mesh>
            <mesh position={[-0.37, 4.05, 0]} rotation={[0, 0, 0.57]}>
              <boxGeometry args={[0.07, 0.72, 0.07]} />
              <meshStandardMaterial {...G} color="#e4e0d8" />
            </mesh>
            {/* Brass arch boss at keystone */}
            <mesh position={[0, 4.42, 0]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial {...B} />
            </mesh>
          </group>
        ),
      )}

      {/* Column capital — flared, gypsum */}
      <mesh position={[0, 5.22, 0]}>
        <cylinderGeometry args={[0.68, 0.37, 0.46, 8]} />
        <meshStandardMaterial {...G} color="#e8e4dc" roughness={0.94} />
      </mesh>
      {/* Brass capital band */}
      <mesh position={[0, 5.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.038, 8, 32]} />
        <meshStandardMaterial {...B} />
      </mesh>

      {/* Upper basin */}
      <mesh position={[0, 5.6, 0]}>
        <cylinderGeometry args={[1.52, 1.64, 0.62, 32]} />
        <meshStandardMaterial {...G} />
      </mesh>
      {/* Upper basin rim — brass */}
      <mesh position={[0, 5.94, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.57, 0.11, 10, 48]} />
        <meshStandardMaterial {...B} />
      </mesh>
      {/* Inner wall of upper basin */}
      <mesh position={[0, 5.72, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.44, 32, 1, true]} />
        <meshStandardMaterial
          color="#ccc8c0"
          roughness={0.7}
          metalness={0}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Water — upper basin */}
      <mesh
        ref={innerWaterRef}
        position={[0, 5.9, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[1.46, 40]} />
        <meshStandardMaterial
          color="#1a3868"
          emissive="#2860c8"
          emissiveIntensity={0.45}
          roughness={0.02}
          metalness={0.95}
          transparent
          opacity={0.88}
        />
      </mesh>
      {/* Water jet */}
      <mesh position={[0, 6.72, 0]}>
        <cylinderGeometry args={[0.035, 0.075, 1.55, 8]} />
        <meshStandardMaterial
          color="#4888e8"
          emissive="#2060c0"
          emissiveIntensity={0.7}
          transparent
          opacity={0.52}
          roughness={0.06}
        />
      </mesh>

      {/* Gothic spire — gypsum with brass finial */}
      <mesh position={[0, 6.72, 0]}>
        <cylinderGeometry args={[0.1, 0.32, 1.14, 8]} />
        <meshStandardMaterial {...G} color="#e0dcd4" roughness={0.94} />
      </mesh>
      {/* Brass finial cone */}
      <mesh position={[0, 7.46, 0]}>
        <coneGeometry args={[0.22, 0.78, 8]} />
        <meshStandardMaterial
          {...B}
          emissive="#c8a820"
          emissiveIntensity={0.35}
        />
      </mesh>
      {/* Brass ball below finial */}
      <mesh position={[0, 7.08, 0]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial {...B} />
      </mesh>

      {/* Four corner finials — brass */}
      {([0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2] as number[]).map(
        (angle, i) => (
          <group key={i} rotation={[0, angle + Math.PI / 4, 0]}>
            <mesh position={[0.82, 5.56, 0]}>
              <coneGeometry args={[0.09, 0.38, 6]} />
              <meshStandardMaterial
                {...B}
                emissive="#c8a820"
                emissiveIntensity={0.25}
              />
            </mesh>
            <mesh position={[0.82, 5.37, 0]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial {...B} />
            </mesh>
          </group>
        ),
      )}

      {/* Lights — uplight to show the gypsum surface */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={8}
        color="#fffaf0"
        distance={16}
        decay={2}
      />
      <pointLight
        position={[0, 1.8, 0]}
        intensity={6}
        color="#4090f0"
        distance={14}
        decay={2}
      />
      <pointLight
        position={[0, 6.0, 0]}
        intensity={6}
        color="#fffaf0"
        distance={14}
        decay={2}
      />
      <pointLight
        position={[0, 8.0, 0]}
        intensity={4}
        color="#c8a820"
        distance={20}
        decay={1.8}
      />

      <WaterDrops />
    </group>
  );
};

// ─── Garden Tree ──────────────────────────────────────────────────────────────
const GardenTree = ({
  x,
  z,
  h,
  s,
}: {
  x: number;
  z: number;
  h: number;
  s: number;
}) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, h * 0.3, 0]} castShadow>
      <cylinderGeometry args={[s * 0.07, s * 0.11, h * 0.6, 6]} />
      <meshStandardMaterial color="#100d08" roughness={0.92} />
    </mesh>
    <mesh position={[0, h * 0.7, 0]} castShadow>
      <sphereGeometry args={[s * 0.74, 7, 7]} />
      <meshStandardMaterial
        color="#0a1a0a"
        roughness={0.92}
        emissive="#0c260c"
        emissiveIntensity={0.1}
      />
    </mesh>
    <mesh position={[s * 0.32, h * 0.62, s * 0.22]} castShadow>
      <sphereGeometry args={[s * 0.52, 6, 6]} />
      <meshStandardMaterial
        color="#0c1e0a"
        roughness={0.92}
        emissive="#0d240a"
        emissiveIntensity={0.08}
      />
    </mesh>
    <mesh position={[-s * 0.26, h * 0.65, -s * 0.18]}>
      <sphereGeometry args={[s * 0.48, 6, 6]} />
      <meshStandardMaterial
        color="#0a1c08"
        roughness={0.92}
        emissive="#0c220a"
        emissiveIntensity={0.07}
      />
    </mesh>
  </group>
);

// ─── Path Lantern ─────────────────────────────────────────────────────────────
const PathLantern = ({ x, z }: { x: number; z: number }) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, 0.08, 0]}>
      <cylinderGeometry args={[0.13, 0.16, 0.16, 8]} />
      <meshStandardMaterial color="#1e1810" roughness={0.72} metalness={0.42} />
    </mesh>
    <mesh position={[0, 1.3, 0]}>
      <cylinderGeometry args={[0.038, 0.048, 2.4, 6]} />
      <meshStandardMaterial color="#1e1810" roughness={0.7} metalness={0.45} />
    </mesh>
    <mesh position={[0, 2.6, 0]}>
      <boxGeometry args={[0.28, 0.34, 0.28]} />
      <meshStandardMaterial color="#1e1810" roughness={0.62} metalness={0.5} />
    </mesh>
    <mesh position={[0, 2.6, 0]}>
      <boxGeometry args={[0.18, 0.24, 0.18]} />
      <meshStandardMaterial
        color="#ffe8a0"
        emissive="#ffe8a0"
        emissiveIntensity={1.6}
        roughness={0.1}
      />
    </mesh>
    <mesh position={[0, 2.8, 0]}>
      <coneGeometry args={[0.19, 0.22, 4]} />
      <meshStandardMaterial color="#1e1810" roughness={0.65} metalness={0.45} />
    </mesh>
    <pointLight
      position={[0, 2.6, 0]}
      intensity={3.5}
      color="#ffe4a0"
      distance={12}
      decay={2}
    />
  </group>
);

// ─── Stone Pathway ─────────────────────────────────────────────────────────────
const StonePathway = () => {
  const slabs: { z: number; v: number }[] = [];
  let i = 0;
  for (let z = 18; z >= -20; z -= 2.6, i++) slabs.push({ z, v: i % 3 });

  const colors = ["#4a4438", "#423e34", "#504a3e"];
  return (
    <>
      {slabs.map(({ z, v }) => (
        <React.Fragment key={z}>
          <mesh position={[0, 0.015, z]} receiveShadow>
            <boxGeometry args={[3.8, 0.055, 2.2]} />
            <meshStandardMaterial
              color={colors[v]}
              roughness={0.88}
              metalness={0.04}
            />
          </mesh>
          {/* Edge kerb stones */}
          <mesh position={[2.15, 0.018, z]}>
            <boxGeometry args={[0.3, 0.04, 2.1]} />
            <meshStandardMaterial color="#201e18" roughness={0.9} />
          </mesh>
          <mesh position={[-2.15, 0.018, z]}>
            <boxGeometry args={[0.3, 0.04, 2.1]} />
            <meshStandardMaterial color="#201e18" roughness={0.9} />
          </mesh>
        </React.Fragment>
      ))}
    </>
  );
};

// ─── Experience Station ────────────────────────────────────────────────────────
const ExperienceStation = ({
  exp,
  x,
  z,
  color,
  index,
}: {
  exp: (typeof experiences)[0];
  x: number;
  z: number;
  color: string;
  index: number;
}) => {
  const { camera } = useThree();
  const [visible, setVisible] = useState(false);
  const prev = useRef(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const dx = camera.position.x - x;
    const dz = camera.position.z - z;
    const d = Math.sqrt(dx * dx + dz * dz);
    const now = d < 8;
    if (now !== prev.current) {
      prev.current = now;
      setVisible(now);
    }
  });

  const ach = exp.achievements[0];
  const details: string[] = Array.isArray(ach?.details)
    ? (ach.details as string[]).slice(0, 3)
    : typeof ach?.details === "string"
      ? [ach.details]
      : [];

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      {/* Stone pedestal base */}
      <mesh position={[0, 0.14, 0]} receiveShadow>
        <cylinderGeometry args={[0.8, 1.0, 0.28, 8]} />
        <meshStandardMaterial
          color="#1c1810"
          roughness={0.84}
          metalness={0.12}
        />
      </mesh>
      {/* Pedestal shaft */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[0.7, 1.2, 0.52]} />
        <meshStandardMaterial
          color="#181410"
          roughness={0.82}
          metalness={0.1}
          emissive={color}
          emissiveIntensity={visible ? 0.07 : 0.02}
        />
      </mesh>
      {/* Color accent top */}
      <mesh position={[0, 1.48, 0]}>
        <boxGeometry args={[0.72, 0.065, 0.54]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={visible ? 1.2 : 0.45}
          roughness={0.28}
        />
      </mesh>
      {/* Number marker */}
      <Html position={[0, 0.85, 0.3]} center>
        <div
          style={{
            color,
            fontFamily: "Georgia, serif",
            fontSize: "12px",
            letterSpacing: "0.18em",
            pointerEvents: "none",
            fontWeight: 700,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
      </Html>

      {/* Accent light from pedestal */}
      <pointLight
        position={[0, 2.2, 0]}
        intensity={visible ? 6 : 2.5}
        color={color}
        distance={14}
        decay={2}
      />

      {/* Card panel — appears on approach, opens outward toward the trees */}
      <Html position={[x > 0 ? 7.0 : -7.0, 4.0, 0]} center>
        <div
          style={{
            width: "600px",
            opacity: visible ? 1 : 0,
            transform: visible
              ? "translateX(0) scale(1)"
              : `translateX(${x > 0 ? "30px" : "-30px"}) scale(0.93)`,
            transition: "opacity 0.55s ease, transform 0.55s ease",
            pointerEvents: visible ? "auto" : "none",
            fontFamily: "Georgia, serif",
          }}
        >
          <div
            style={{
              background: "rgba(6,4,1,0.97)",
              border: `1px solid ${color}66`,
              borderTop: `3px solid ${color}`,
              borderRadius: "10px",
              padding: "24px 30px",
              boxShadow: `0 8px 60px ${color}28, 0 0 0 1px rgba(0,0,0,0.4)`,
            }}
          >
            {/* Index + type */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  letterSpacing: "0.4em",
                  color: `${color}bb`,
                  fontWeight: 700,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  border: `1px solid ${color}55`,
                  color,
                }}
              >
                {exp.type}
              </span>
            </div>

            {/* Company + logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "8px",
              }}
            >
              {exp.icon && (
                <img
                  src={exp.icon}
                  alt={exp.name}
                  style={{
                    width: "52px",
                    height: "52px",
                    objectFit: "contain",
                    flexShrink: 0,
                    borderRadius: "8px",
                    background: "#fff",
                    padding: "5px",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <div>
                <div
                  style={{
                    color,
                    fontSize: "22px",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    lineHeight: 1.15,
                  }}
                >
                  {exp.name}
                </div>
                <div
                  style={{
                    color: "#7a6a48",
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginTop: "4px",
                  }}
                >
                  {exp.duration}
                </div>
              </div>
            </div>

            <div
              style={{
                height: "1px",
                background: `${color}28`,
                marginBottom: "14px",
              }}
            />

            {/* Role */}
            <div
              style={{
                color: "#d0c090",
                fontSize: "15px",
                letterSpacing: "0.03em",
                marginBottom: "14px",
                lineHeight: 1.4,
              }}
            >
              {exp.pos}
            </div>

            {/* Achievement description */}
            {ach?.description && (
              <div
                style={{
                  color: "#9a8e70",
                  fontSize: "13px",
                  lineHeight: 1.65,
                  marginBottom: "10px",
                  fontStyle: "italic",
                }}
              >
                {ach.description}
              </div>
            )}

            {/* Detail bullets */}
            {details.length > 0 && (
              <div
                style={{
                  marginBottom: "16px",
                  paddingLeft: "14px",
                  borderLeft: `2px solid ${color}44`,
                }}
              >
                {details.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      color: "#7a7060",
                      fontSize: "12px",
                      lineHeight: 1.7,
                      marginBottom: i < details.length - 1 ? "6px" : 0,
                    }}
                  >
                    · {d}
                  </div>
                ))}
              </div>
            )}

            {/* Tech tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {exp.techStack.map((t) => (
                <span
                  key={t}
                  style={{
                    background: "#181208",
                    border: `1px solid ${color}33`,
                    color: "#a09060",
                    fontSize: "11px",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};

// ─── Warp Portal — proximity-triggered, visuals only (panel rendered outside Canvas) ──
const WarpPortal = ({
  onNearChange,
}: {
  onNearChange: (v: boolean) => void;
}) => {
  const { camera } = useThree();
  const prev = useRef(false);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const orbMesh = useRef<THREE.Mesh>(null);
  const discMesh = useRef<THREE.Mesh>(null);
  const tc = useRef(0);

  useFrame((_, dt) => {
    const dx = camera.position.x;
    const dz = camera.position.z - -13;
    const d = Math.sqrt(dx * dx + dz * dz);
    const now = d < 10;
    if (now !== prev.current) {
      prev.current = now;
      onNearChange(now);
    }

    tc.current += dt;
    const t = tc.current;

    if (ring1.current) ring1.current.rotation.y = t * 0.55;
    if (ring2.current) {
      ring2.current.rotation.x = t * 0.85;
      ring2.current.rotation.z = t * 0.28;
    }
    if (ring3.current) {
      ring3.current.rotation.x = -t * 0.48;
      ring3.current.rotation.y = t * 1.05;
    }
    if (orbMesh.current) {
      orbMesh.current.position.y = 1.5 + Math.sin(t * 1.4) * 0.35;
      (
        orbMesh.current.material as THREE.MeshStandardMaterial
      ).emissiveIntensity = 2.8 + Math.sin(t * 2.1) * 1.0;
    }
    if (discMesh.current) {
      discMesh.current.rotation.z = t * 0.38;
      (
        discMesh.current.material as THREE.MeshStandardMaterial
      ).emissiveIntensity = 0.55 + Math.sin(t * 1.7) * 0.3;
    }
  });

  return (
    <group position={[0, 0, -13]}>
      {/* Pulsing ground disc */}
      <mesh
        ref={discMesh}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.015, 0]}
      >
        <circleGeometry args={[2.6, 64]} />
        <meshStandardMaterial
          color="#100a02"
          emissive="#c89808"
          emissiveIntensity={0.6}
          transparent
          opacity={0.88}
        />
      </mesh>
      {/* Outer halo ring on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[2.5, 3.1, 64]} />
        <meshStandardMaterial
          color="#1a1002"
          emissive="#d4a010"
          emissiveIntensity={1.0}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Spinning torus rings */}
      <mesh ref={ring1} position={[0, 1.5, 0]}>
        <torusGeometry args={[1.55, 0.036, 8, 80]} />
        <meshStandardMaterial
          color="#c8a820"
          emissive="#c8a820"
          emissiveIntensity={2.6}
          metalness={0.9}
          roughness={0.08}
        />
      </mesh>
      <mesh ref={ring2} position={[0, 1.5, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.25, 0.026, 8, 64]} />
        <meshStandardMaterial
          color="#e8d060"
          emissive="#e0c040"
          emissiveIntensity={2.1}
          metalness={0.85}
          roughness={0.12}
        />
      </mesh>
      <mesh
        ref={ring3}
        position={[0, 1.5, 0]}
        rotation={[-Math.PI / 4, Math.PI / 4, 0]}
      >
        <torusGeometry args={[0.95, 0.02, 8, 48]} />
        <meshStandardMaterial
          color="#fff8e8"
          emissive="#fffaec"
          emissiveIntensity={2.4}
          metalness={0.6}
          roughness={0.18}
        />
      </mesh>

      {/* Central floating orb */}
      <mesh ref={orbMesh} position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.2, 18, 18]} />
        <meshStandardMaterial
          color="#fff8e0"
          emissive="#c8a820"
          emissiveIntensity={3.2}
          roughness={0.04}
          metalness={0.96}
        />
      </mesh>

      {/* Lights */}
      <pointLight
        position={[0, 1.5, 0]}
        intensity={10}
        color="#c8a820"
        distance={16}
        decay={2}
      />
      <pointLight
        position={[0, 0.1, 0]}
        intensity={5}
        color="#d4b030"
        distance={9}
        decay={2}
      />
    </group>
  );
};

// ─── Return Door (south) ───────────────────────────────────────────────────────
const ReturnDoor = ({ onEnter }: { onEnter: () => void }) => {
  const [hovered, setHovered] = useState(false);
  const DW = 2.6;
  const DH = 3.8;

  return (
    <group>
      {/* Door frame */}
      <mesh position={[0, DH / 2, 19.8]} castShadow>
        <boxGeometry args={[DW + 0.5, DH + 0.4, 0.36]} />
        <meshStandardMaterial
          color={hovered ? "#3a2810" : "#201408"}
          roughness={0.8}
          metalness={0.08}
          emissive={hovered ? "#1a0e00" : "#050300"}
          emissiveIntensity={hovered ? 0.4 : 0.08}
        />
      </mesh>
      {/* Door panel */}
      <mesh
        position={[0, DH / 2, 19.55]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onEnter();
        }}
      >
        <boxGeometry args={[DW - 0.1, DH - 0.1, 0.12]} />
        <meshStandardMaterial
          color={hovered ? "#3d2810" : "#1c1005"}
          roughness={0.7}
          metalness={0.06}
          emissive={hovered ? "#5a3818" : "#0e0800"}
          emissiveIntensity={hovered ? 0.5 : 0.06}
        />
      </mesh>
      {/* Handle */}
      <mesh position={[DW / 2 - 0.3, DH / 2, 19.47]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial
          color={hovered ? "#daa830" : "#a08018"}
          metalness={0.95}
          roughness={0.04}
          emissive={hovered ? "#7a5500" : "#201200"}
          emissiveIntensity={hovered ? 0.7 : 0.1}
        />
      </mesh>
      {/* Lantern above door */}
      <pointLight
        position={[0, DH + 1.2, 19]}
        intensity={hovered ? 6 : 4}
        color="#ffe4b0"
        distance={14}
        decay={2}
      />
      {/* Plaque */}
      <Html position={[0, DH + 1.0, 19.5]} center>
        <div
          style={{
            background: "#1a1208",
            border: "1px solid #7a6030",
            borderRadius: "3px",
            padding: "4px 14px",
            color: hovered ? "#e0b840" : "#a07820",
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontFamily: "Georgia, serif",
            whiteSpace: "nowrap",
            transition: "color 0.2s",
            pointerEvents: "none",
          }}
        >
          ← Garden
        </div>
      </Html>
    </group>
  );
};

// ─── Full Garden Scene ────────────────────────────────────────────────────────
const GardenScene = ({
  onDoorClick,
  onNearPortal,
}: {
  onDoorClick: () => void;
  onNearPortal: (v: boolean) => void;
}) => (
  <group>
    {/* Ground */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#1e1c16" roughness={0.88} metalness={0.06} />
    </mesh>
    {/* Grass border strip */}
    {([-18, 18] as number[]).map((x) => (
      <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.005, 0]}>
        <planeGeometry args={[8, 60]} />
        <meshStandardMaterial color="#141e14" roughness={0.92} />
      </mesh>
    ))}

    {/* Daytime sky */}
    <Sky
      distance={450000}
      sunPosition={[1, 0.55, 0.2]}
      turbidity={3}
      rayleigh={0.4}
      mieCoefficient={0.004}
      mieDirectionalG={0.88}
    />

    {/* Daylight — bright ambient + strong sun */}
    <ambientLight intensity={1.6} color="#e8f4ff" />
    <directionalLight
      position={[8, 24, 10]}
      intensity={2.8}
      color="#fff8f0"
      castShadow
    />

    <StonePathway />

    {/* Path lanterns (both sides) */}
    {LANTERN_Z.map((z) => (
      <React.Fragment key={z}>
        <PathLantern x={2.4} z={z} />
        <PathLantern x={-2.4} z={z} />
      </React.Fragment>
    ))}

    {/* Trees */}
    {TREE_DEFS.map((t, i) => (
      <GardenTree key={i} {...t} />
    ))}

    <RomanFountain />

    {/* Experience stations — 01(oldest)→09(newest), station 09 closest to door */}
    {chronoExps.slice(0, STATIONS.length).map((exp, i) => (
      <ExperienceStation
        key={exp.id}
        exp={exp}
        x={STATIONS[i].x}
        z={STATIONS[i].z}
        color={EXP_COLORS[i % EXP_COLORS.length]}
        index={i}
      />
    ))}

    <WarpPortal onNearChange={onNearPortal} />

    <ReturnDoor onEnter={onDoorClick} />
  </group>
);

// ─── Path proximity hint ──────────────────────────────────────────────────────
const PathHintDetector = ({
  onHintChange,
}: {
  onHintChange: (v: boolean) => void;
}) => {
  const { camera } = useThree();
  const prev = useRef(false);

  useFrame(() => {
    const onPath =
      Math.abs(camera.position.x) < 4.5 &&
      camera.position.z < 14 &&
      camera.position.z > -14;
    const nearAny = STATIONS.some(({ x, z }) => {
      const dx = camera.position.x - x;
      const dz = camera.position.z - z;
      return Math.sqrt(dx * dx + dz * dz) < 8;
    });
    const now = onPath && !nearAny;
    if (now !== prev.current) {
      prev.current = now;
      onHintChange(now);
    }
  });

  return null;
};

// ─── WASD Controls ────────────────────────────────────────────────────────────
const WASDControls = ({
  orbitRef,
}: {
  orbitRef: React.RefObject<{ target: Vector3 }>;
}) => {
  const { camera } = useThree();
  const keys = useRef({ w: false, s: false, a: false, d: false });

  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") keys.current.w = true;
      if (e.code === "KeyS" || e.code === "ArrowDown") keys.current.s = true;
      if (e.code === "KeyA" || e.code === "ArrowLeft") keys.current.a = true;
      if (e.code === "KeyD" || e.code === "ArrowRight") keys.current.d = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") keys.current.w = false;
      if (e.code === "KeyS" || e.code === "ArrowDown") keys.current.s = false;
      if (e.code === "KeyA" || e.code === "ArrowLeft") keys.current.a = false;
      if (e.code === "KeyD" || e.code === "ArrowRight") keys.current.d = false;
    };
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", dn);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, dt) => {
    const dir = new Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();

    const vel = new Vector3();
    if (keys.current.w || joystick.dy < -0.2) vel.add(dir);
    if (keys.current.s || joystick.dy > 0.2) vel.sub(dir);
    if (keys.current.a || joystick.dx < -0.2)
      vel.add(new Vector3().crossVectors(new Vector3(0, 1, 0), dir));
    if (keys.current.d || joystick.dx > 0.2)
      vel.add(new Vector3().crossVectors(dir, new Vector3(0, 1, 0)));

    if (vel.length() > 0) {
      camera.position.addScaledVector(vel.normalize(), 8 * dt);
      camera.position.y = 1.8;
      if (orbitRef.current) {
        orbitRef.current.target.copy(camera.position).addScaledVector(dir, 4);
        orbitRef.current.target.y = 1.8;
      }
    }
  });

  return null;
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const AboutRoom = () => {
  const [transitioning, setTransitioning] = useState(false);
  const [showPathHint, setShowPathHint] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const dismissedRef = useRef(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleNearPortal = useCallback((near: boolean) => {
    if (!near) {
      dismissedRef.current = false;
      setShowExperience(false);
    } else if (!dismissedRef.current) {
      setShowExperience(true);
    }
  }, []);

  const dismissExperience = useCallback(() => {
    dismissedRef.current = true;
    setShowExperience(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissExperience();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismissExperience]);
  const orbitRef = useRef<OrbitControlsImpl>(null);
  const navigate = useNavigate();

  const handleDoorClick = () => {
    setTransitioning(true);
    setTimeout(() => navigate("/"), 650);
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#87ceeb" }}
    >
      <GalleryNavbar />

      {/* Overlay hint */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none px-4">
        <p
          className="text-[10px] tracking-[0.4em] uppercase mb-1"
          style={{ color: "#6a5830", fontFamily: "Georgia, serif" }}
        >
          Jewook Park
        </p>
        <h1
          className="text-2xl font-light tracking-[0.3em] uppercase"
          style={{ color: "#b8b0a0", fontFamily: "Georgia, serif" }}
        >
          The Experience Garden
        </h1>
        <div
          className="mt-2 mx-auto"
          style={{
            width: "24px",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, #8a7040, transparent)",
          }}
        />
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div
          className="px-6 py-2 rounded-full"
          style={{
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(160,130,40,0.22)",
          }}
        >
          <p
            className="text-[11px] tracking-wider"
            style={{ color: "#4a4030" }}
          >
            {isMobile
              ? "Drag to look · Pinch to zoom"
              : "WASD · walk north to explore experiences chronologically"}
          </p>
        </div>
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 1.8, 17], fov: 70, near: 0.1, far: 500 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 2.2;
        }}
      >
        <Suspense fallback={null}>
          <GardenScene
            onDoorClick={handleDoorClick}
            onNearPortal={handleNearPortal}
          />
          <PathHintDetector onHintChange={setShowPathHint} />
          <WASDControls
            orbitRef={orbitRef as React.RefObject<{ target: Vector3 }>}
          />
          <OrbitControls
            ref={orbitRef}
            enablePan={false}
            enableZoom
            enableRotate
            minDistance={0.5}
            maxDistance={30}
            maxPolarAngle={Math.PI / 1.78}
            minPolarAngle={Math.PI / 3.5}
            target={[0, 1.8, 12]}
            enableDamping
            dampingFactor={0.06}
          />
        </Suspense>
      </Canvas>

      {isMobile && <MobileJoystick />}

      {/* Path hint — shown when on path but not near any pillar */}
      <AnimatePresence>
        {showPathHint && !transitioning && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.55, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-16 left-0 right-0 z-20 pointer-events-none text-center"
          >
            <p
              style={{
                color: "#c8b880",
                fontFamily: "Georgia, serif",
                fontSize: "12px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Walk closer to a pillar to explore · For the full timeline, visit
              the portal in front of the fountain
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Experience overlay — rendered outside Canvas so scroll never conflicts with OrbitControls */}
      <AnimatePresence>
        {showExperience && !transitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-30 flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              cursor: "pointer",
            }}
            onClick={dismissExperience}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.38, delay: 0.05 }}
              style={{
                width: "min(680px, 92vw)",
                maxHeight: "78vh",
                background: "rgba(5,3,1,0.97)",
                border: "1px solid rgba(200,168,32,0.25)",
                borderTop: "2px solid #c8a820",
                borderRadius: "8px",
                boxShadow: "0 24px 120px rgba(200,168,32,0.15)",
                display: "flex",
                flexDirection: "column",
                fontFamily: "Georgia, serif",
                cursor: "default",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  padding: "22px 28px 16px",
                  borderBottom: "1px solid rgba(200,168,32,0.10)",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    color: "#c8a820",
                    fontSize: "9px",
                    letterSpacing: "0.5em",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Full Timeline
                </div>
                <div
                  style={{
                    color: "#e8e0d0",
                    fontSize: "22px",
                    fontWeight: 300,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                  }}
                >
                  Experience
                </div>
              </div>

              {/* Scrollable entries — natural DOM scroll, no canvas interference */}
              <div
                style={{
                  overflowY: "auto",
                  padding: "16px 28px 24px",
                  flex: 1,
                }}
              >
                {[...chronoExps].reverse().map((exp, i, arr) => {
                  const color = "#c8a820";
                  const ach = exp.achievements[0];
                  const details: string[] = Array.isArray(ach?.details)
                    ? (ach.details as string[]).slice(0, 2)
                    : [];
                  return (
                    <div
                      key={exp.id}
                      style={{
                        marginBottom: "22px",
                        paddingBottom: "22px",
                        borderBottom:
                          i < arr.length - 1
                            ? "1px solid rgba(255,255,255,0.05)"
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "6px",
                        }}
                      >
                        {exp.icon && (
                          <img
                            src={exp.icon}
                            alt={exp.name}
                            style={{
                              width: "34px",
                              height: "34px",
                              objectFit: "contain",
                              borderRadius: "5px",
                              background: "#fff",
                              padding: "3px",
                              flexShrink: 0,
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span
                            style={{ color, fontSize: "15px", fontWeight: 700 }}
                          >
                            {exp.name}
                          </span>
                          <span
                            style={{
                              color: "#5a4a28",
                              fontSize: "9px",
                              letterSpacing: "0.2em",
                              textTransform: "uppercase",
                              marginLeft: "10px",
                            }}
                          >
                            {exp.duration}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: "8px",
                            color,
                            border: `1px solid ${color}44`,
                            borderRadius: "10px",
                            padding: "2px 9px",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            flexShrink: 0,
                          }}
                        >
                          {exp.type}
                        </span>
                      </div>
                      <div
                        style={{
                          color: "#b0a070",
                          fontSize: "13px",
                          marginBottom: "6px",
                          paddingLeft: "44px",
                        }}
                      >
                        {exp.pos}
                      </div>
                      {details.map((d, di) => (
                        <div
                          key={di}
                          style={{
                            color: "#6a6050",
                            fontSize: "11px",
                            lineHeight: 1.65,
                            paddingLeft: "44px",
                            marginBottom: "3px",
                          }}
                        >
                          · {d}
                        </div>
                      ))}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "5px",
                          marginTop: "8px",
                          paddingLeft: "44px",
                        }}
                      >
                        {exp.techStack.slice(0, 6).map((tk) => (
                          <span
                            key={tk}
                            style={{
                              background: "#1a1408",
                              border: `1px solid ${color}30`,
                              color: "#9a8860",
                              fontSize: "10px",
                              padding: "3px 9px",
                              borderRadius: "3px",
                            }}
                          >
                            {tk}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55 }}
            className="fixed inset-0 z-[100] pointer-events-none"
            style={{ background: "#0a0804" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutRoom;
