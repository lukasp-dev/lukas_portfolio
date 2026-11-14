import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getViewMode, type PlayerState } from "./PlayerAvatar";

// Leads the visitor to the portal at (0, -13): a travelling wave of golden
// chevrons up the path, drifting light orbs, a beam and pulsing rings at the
// portal, plus an auto-walk that stops on any input.

export const PORTAL = { x: 0, z: -13 };
export const WALK_EVENT = "walk-to-portal";

const CHEVRON_ZS = Array.from({ length: 12 }, (_, i) => 14 - i * 2.2);
const ORB_COUNT = 5;
const ORB_Z0 = 15;
const ORB_Z1 = -10.5;

const GOLD = new THREE.Color("#ffc94a");

const PortalGuide = ({
  orbitRef,
  player,
}: {
  orbitRef: React.RefObject<{ target: THREE.Vector3; update?: () => boolean }>;
  player: PlayerState;
}) => {
  const { camera } = useThree();
  const root = useRef<THREE.Group>(null);
  const chevrons = useRef<THREE.InstancedMesh>(null);
  const orbs = useRef<THREE.InstancedMesh>(null);
  const beam = useRef<THREE.Mesh>(null);
  const beamCore = useRef<THREE.Mesh>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const walking = useRef(false);
  const walkSpeed = useRef(0);
  const startTimer = useRef(0.9);
  const t = useRef(0);

  const chevronGeo = useMemo(() => {
    const s = new THREE.Shape();
    const pts: [number, number][] = [
      [-0.95, -0.42],
      [0, 0.34],
      [0.95, -0.42],
      [0.95, -0.1],
      [0, 0.66],
      [-0.95, -0.1],
    ];
    pts.forEach(([x, y], i) => (i === 0 ? s.moveTo(x, y) : s.lineTo(x, y)));
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, []);

  // Place chevrons once (flat on the ground, apex pointing north / -z).
  useEffect(() => {
    const m = chevrons.current;
    if (!m) return;
    const d = new THREE.Object3D();
    CHEVRON_ZS.forEach((z, i) => {
      d.position.set(0, 0.07, z);
      d.rotation.set(-Math.PI / 2, 0, 0);
      d.updateMatrix();
      m.setMatrixAt(i, d.matrix);
      m.setColorAt(i, GOLD.clone().multiplyScalar(0.2));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    // never block pointer events meant for the portal / door
    root.current?.traverse((o) => {
      o.raycast = () => null;
    });
  }, []);

  // Auto-walk control: starts shortly after load, stops on any input.
  useEffect(() => {
    const cancel = () => {
      walking.current = false;
      startTimer.current = Infinity;
    };
    const start = () => {
      walking.current = true;
      walkSpeed.current = 0;
      startTimer.current = Infinity;
    };
    const opts = { passive: true } as AddEventListenerOptions;
    window.addEventListener("keydown", cancel);
    window.addEventListener("wheel", cancel, opts);
    window.addEventListener("touchstart", cancel, opts);
    window.addEventListener("pointerdown", cancel, opts);
    window.addEventListener(WALK_EVENT, start);
    return () => {
      window.removeEventListener("keydown", cancel);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("pointerdown", cancel);
      window.removeEventListener(WALK_EVENT, start);
    };
  }, []);

  const tmp = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    t.current += dt;
    const time = t.current;

    // auto-start once
    if (startTimer.current !== Infinity) {
      startTimer.current -= dt;
      if (startTimer.current <= 0) {
        walking.current = true;
        walkSpeed.current = 0;
        startTimer.current = Infinity;
      }
    }

    // ── auto-walk toward the portal (moves the player in either view) ──────
    if (walking.current) {
      const third = getViewMode() === "third";
      const cur = third ? player.pos : camera.position;
      const stopZ = PORTAL.z + 9.2; // just inside the portal's trigger radius
      const dz = cur.z - stopZ;
      if (dz <= 0.05) {
        walking.current = false;
      } else {
        walkSpeed.current = Math.min(walkSpeed.current + dt * 4, 5.2);
        const slow = Math.min(1, dz / 4); // ease out near the end
        const step = Math.min(dz, walkSpeed.current * Math.max(0.25, slow) * dt);
        const dx = (PORTAL.x - cur.x) * Math.min(1, dt * 2);
        cur.z -= step;
        cur.x += dx;
        cur.y = 1.8;
        const ctrl = orbitRef.current;
        if (third) {
          // the camera keeps its offset behind the character
          camera.position.z -= step;
          camera.position.x += dx;
          player.moving = true;
          let diff = Math.PI - player.charYaw; // face north (-z)
          diff = ((((diff + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;
          player.charYaw += diff * Math.min(1, dt * 8);
        } else if (ctrl) {
          ctrl.target.x += (PORTAL.x - ctrl.target.x) * Math.min(1, dt * 3);
          ctrl.target.y = 1.8;
          ctrl.target.z += (PORTAL.z - ctrl.target.z) * Math.min(1, dt * 3);
        }
      }
    }

    // ── chevron wave toward the portal ─────────────────────────────────────
    const cm = chevrons.current;
    if (cm) {
      CHEVRON_ZS.forEach((_, i) => {
        const phase = time * 0.85 - i * 0.14;
        const w = Math.pow(0.5 + 0.5 * Math.sin(phase * Math.PI * 2), 5);
        tmpColor.copy(GOLD).multiplyScalar(0.12 + 0.88 * w);
        cm.setColorAt(i, tmpColor);
      });
      if (cm.instanceColor) cm.instanceColor.needsUpdate = true;
    }

    // ── orbs drifting along the path ───────────────────────────────────────
    const om = orbs.current;
    if (om) {
      for (let i = 0; i < ORB_COUNT; i++) {
        const f = (time * 0.12 + i / ORB_COUNT) % 1;
        const z = ORB_Z0 + (ORB_Z1 - ORB_Z0) * f;
        const bob = Math.sin(time * 2.4 + i * 1.7) * 0.12;
        const fade = Math.sin(f * Math.PI); // dim at both ends
        const sc = 0.6 + 0.7 * fade;
        tmp.position.set(Math.sin(time * 0.9 + i * 2.1) * 0.35, 0.55 + bob, z);
        tmp.scale.setScalar(sc);
        tmp.rotation.set(0, 0, 0);
        tmp.updateMatrix();
        om.setMatrixAt(i, tmp.matrix);
      }
      om.instanceMatrix.needsUpdate = true;
    }

    // ── beam pulse ─────────────────────────────────────────────────────────
    const pulse = 0.5 + 0.5 * Math.sin(time * 1.8);
    if (beam.current)
      (beam.current.material as THREE.MeshBasicMaterial).opacity =
        0.1 + pulse * 0.07;
    if (beamCore.current)
      (beamCore.current.material as THREE.MeshBasicMaterial).opacity =
        0.2 + pulse * 0.15;

    // ── expanding rings on the ground ──────────────────────────────────────
    rings.current.forEach((r, i) => {
      if (!r) return;
      const f = (time * 0.45 + i / 3) % 1;
      const s = 0.8 + f * 5.2;
      r.scale.set(s, s, 1);
      (r.material as THREE.MeshBasicMaterial).opacity = (1 - f) * 0.5;
    });
  });

  return (
    <group ref={root}>
      <instancedMesh
        ref={chevrons}
        args={[chevronGeo, undefined as never, CHEVRON_ZS.length]}
        frustumCulled={false}
      >
        <meshBasicMaterial
          color="#ffffff"
          toneMapped={false}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </instancedMesh>

      <instancedMesh
        ref={orbs}
        args={[undefined as never, undefined as never, ORB_COUNT]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.16, 14, 14]} />
        <meshBasicMaterial color="#ffd978" toneMapped={false} />
      </instancedMesh>

      {/* beam of light above the portal */}
      <group position={[PORTAL.x, 0, PORTAL.z]}>
        <mesh ref={beam} position={[0, 21, 0]}>
          <cylinderGeometry args={[0.6, 2.4, 42, 28, 1, true]} />
          <meshBasicMaterial
            color="#ffcf60"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
        <mesh ref={beamCore} position={[0, 21, 0]}>
          <cylinderGeometry args={[0.12, 0.5, 42, 16, 1, true]} />
          <meshBasicMaterial
            color="#fff1c8"
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            ref={(el) => {
              rings.current[i] = el;
            }}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.05, 0]}
          >
            <ringGeometry args={[0.92, 1.0, 64]} />
            <meshBasicMaterial
              color="#ffd36a"
              transparent
              opacity={0.4}
              depthWrite={false}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default PortalGuide;
