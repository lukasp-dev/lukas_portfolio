import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Instances, type Item } from "./MilanDecor";
import { basaltMat, goldMat, makeStone, stoneDarkMat, stoneMat } from "./StoneMaterials";

// Modern Milan garden: large-format pale stone paving with LED edge lines,
// clipped hedge walls, a minimal monolithic gateway, abstract sculptures,
// slim light bollards and a distant skyline of "vertical forest" towers.
// Palette: pale stone, charcoal, dark green and thin brass lines only.

type V3 = [number, number, number];
type V2 = [number, number];

const hedgeMat = makeStone({ color: "#27402e", roughness: 1, bump: 16 });
const glassMat = makeStone({ color: "#2b323d", roughness: 0.6, metalness: 0.2, bump: 2 });
const foliageMat = makeStone({ color: "#2f5236", roughness: 1, bump: 14 });

const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const makePaving = () => {
  const s = 512;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#e6e1d5";
  ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = "rgba(60,58,54,0.7)";
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, s, s);
  ctx.beginPath();
  // two courses of large slabs, staggered
  ctx.moveTo(0, s / 2);
  ctx.lineTo(s, s / 2);
  ctx.moveTo(s / 2, 0);
  ctx.lineTo(s / 2, s / 2);
  ctx.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
};

const makeGravel = () => {
  const s = 512;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#3b3b3e";
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 9000; i++) {
    const v = Math.random();
    ctx.fillStyle =
      v > 0.66
        ? "rgba(220,220,225,0.14)"
        : v > 0.33
          ? "rgba(0,0,0,0.28)"
          : "rgba(120,120,125,0.2)";
    ctx.beginPath();
    ctx.arc(Math.random() * s, Math.random() * s, 0.6 + Math.random() * 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  t.repeat.set(16, 18);
  return t;
};

const stone = () => <primitive object={stoneMat} attach="material" />;
const stoneDark = () => <primitive object={stoneDarkMat} attach="material" />;
const charcoal = () => <primitive object={basaltMat} attach="material" />;
const brass = () => <primitive object={goldMat} attach="material" />;

// ── Minimal monolithic gateway ──────────────────────────────────────────────
const Gateway = ({ z }: { z: number }) => (
  <group position={[0, 0, z]}>
    {([-1, 1] as number[]).map((s) => (
      <group key={s} position={[s * 5.9, 0, 0]}>
        <mesh position={[0, 3.6, 0]}>
          <boxGeometry args={[1.3, 7.2, 2.4]} />
          {stone()}
        </mesh>
        {/* charcoal reveal and thin brass line on the inner face */}
        <mesh position={[-s * 0.64, 3.6, 0]}>
          <boxGeometry args={[0.04, 7.0, 2.1]} />
          {charcoal()}
        </mesh>
        <mesh position={[-s * 0.67, 3.6, 0]}>
          <boxGeometry args={[0.025, 7.0, 0.05]} />
          {brass()}
        </mesh>
      </group>
    ))}
    {/* lintel */}
    <mesh position={[0, 7.8, 0]}>
      <boxGeometry args={[13.2, 1.2, 2.4]} />
      {stone()}
    </mesh>
    <mesh position={[0, 7.18, 0]}>
      <boxGeometry args={[11.0, 0.05, 2.0]} />
      {charcoal()}
    </mesh>
    {/* single brass line across the lintel, and a warm light slot beneath it */}
    <mesh position={[0, 7.8, 1.21]}>
      <boxGeometry args={[13.2, 0.04, 0.02]} />
      {brass()}
    </mesh>
    <mesh position={[0, 7.8, -1.21]}>
      <boxGeometry args={[13.2, 0.04, 0.02]} />
      {brass()}
    </mesh>
    <mesh position={[0, 7.1, 0]}>
      <boxGeometry args={[10.6, 0.04, 0.06]} />
      <meshBasicMaterial color="#ffe3ac" toneMapped={false} />
    </mesh>
  </group>
);

// ── Abstract sculptures ─────────────────────────────────────────────────────
const Sculpture = ({
  kind,
  position,
  rotationY = 0,
}: {
  kind: number;
  position: V3;
  rotationY?: number;
}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    <mesh position={[0, 0.18, 0]}>
      <boxGeometry args={[1.5, 0.36, 1.5]} />
      {charcoal()}
    </mesh>
    {kind % 6 === 0 && (
      <>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 0.65 + i * 0.5, 0]} rotation={[0, i * 0.32, 0]}>
            <boxGeometry args={[1.0 - i * 0.18, 0.5, 1.0 - i * 0.18]} />
            {stone()}
          </mesh>
        ))}
        <mesh position={[0, 1.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.32, 0.025, 8, 28]} />
          {brass()}
        </mesh>
      </>
    )}
    {kind % 6 === 1 && (
      <>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.95, 0.95, 0.95]} />
          {stone()}
        </mesh>
        <mesh position={[0, 1.8, 0]}>
          <sphereGeometry args={[0.55, 28, 24]} />
          {brass()}
        </mesh>
      </>
    )}
    {kind % 6 === 2 && (
      <>
        <mesh position={[0, 1.75, 0]}>
          <boxGeometry args={[0.5, 2.8, 0.95]} />
          {stone()}
        </mesh>
        <mesh position={[0, 2.1, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.62, 0.07, 12, 36]} />
          {brass()}
        </mesh>
      </>
    )}
    {kind % 6 === 3 && (
      <>
        {Array.from({ length: 10 }, (_, i) => (
          <mesh key={i} position={[0, 0.5 + i * 0.2, 0]} rotation={[0, i * 0.3, 0]}>
            <boxGeometry args={[0.95, 0.2, 0.95]} />
            {i % 2 ? stone() : stoneDark()}
          </mesh>
        ))}
      </>
    )}
    {kind % 6 === 4 && (
      <>
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.95, 24]} />
          {stone()}
        </mesh>
        <mesh position={[0, 1.65, 0]} rotation={[0, 0, 0.38]}>
          <cylinderGeometry args={[0.95, 0.95, 0.09, 40]} />
          {brass()}
        </mesh>
      </>
    )}
    {kind % 6 === 5 && (
      <>
        <mesh position={[-0.28, 0.95, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 1.2, 28]} />
          {stone()}
        </mesh>
        <mesh position={[0.3, 1.35, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 2.0, 28]} />
          {stoneDark()}
        </mesh>
        <mesh position={[0.3, 2.4, 0]}>
          <cylinderGeometry args={[0.245, 0.245, 0.05, 28]} />
          {brass()}
        </mesh>
      </>
    )}
  </group>
);

// ── Distant skyline of vertical-forest towers ───────────────────────────────
interface TowerDef {
  x: number;
  z: number;
  w: number;
  d: number;
  floors: number;
}

export const ModernSkyline = () => {
  const root = useRef<THREE.Group>(null);
  useEffect(() => {
    root.current?.traverse((o) => {
      o.raycast = () => null;
    });
  }, []);

  const FH = 3.2;
  const towers = useMemo<TowerDef[]>(
    () => [
      { x: -22, z: 96, w: 11, d: 11, floors: 22 },
      { x: 18, z: 102, w: 12, d: 12, floors: 17 },
      { x: -2, z: 118, w: 15, d: 15, floors: 28 },
    ],
    []
  );

  const sets = useMemo(() => {
    const slabs: Item[] = [];
    const leaves: Item[] = [];
    const wins: Item[] = [];
    let n = 7;
    towers.forEach((t) => {
      const fz = t.z - t.d / 2;
      for (let f = 1; f <= t.floors; f++) {
        const y = f * FH;
        slabs.push({ p: [t.x, y, fz - 0.9], s: [t.w + 1.6, 0.3, 2.0] });
        for (let k = 0; k < 7; k++) {
          const px = t.x - t.w / 2 - 0.4 + rand(n++) * (t.w + 0.8);
          const r = 0.5 + rand(n++) * 0.5;
          leaves.push({
            p: [px, y + 0.5 + r * 0.5, fz - 0.9 - 0.4 + rand(n++) * 0.8],
            s: [r, r, r],
          });
        }
        for (let c = 0; c < 6; c++) {
          if (rand(n++) < 0.55)
            wins.push({
              p: [t.x - t.w / 2 + 1 + c * ((t.w - 2) / 5), y - FH / 2 + 1.1, fz - 0.02],
              s: [1.1, 1.8, 0.1],
            });
        }
      }
    });
    return { slabs, leaves, wins };
  }, [towers]);

  return (
    <group ref={root}>
      {towers.map((t, i) => (
        <mesh key={i} position={[t.x, (t.floors * FH) / 2 + 1.6, t.z]}>
          <boxGeometry args={[t.w, t.floors * FH + 3.2, t.d]} />
          <primitive object={glassMat} attach="material" />
        </mesh>
      ))}
      {/* the tall central tower: slim crown and needle */}
      <mesh position={[-2, 28 * FH + 6, 118]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[10.6, 9, 4]} />
        <primitive object={glassMat} attach="material" />
      </mesh>
      <mesh position={[-2, 28 * FH + 22, 118]}>
        <cylinderGeometry args={[0.15, 0.4, 26, 8]} />
        <primitive object={goldMat} attach="material" />
      </mesh>
      <Instances items={sets.slabs}>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={stoneMat} attach="material" />
      </Instances>
      <Instances items={sets.leaves}>
        <sphereGeometry args={[1, 8, 8]} />
        <primitive object={foliageMat} attach="material" />
      </Instances>
      <Instances items={sets.wins}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ffd994" toneMapped={false} />
      </Instances>
    </group>
  );
};

// ── Main garden layer ───────────────────────────────────────────────────────
interface Seg {
  from: V2;
  to: V2;
  t0: number;
  t1: number;
}

const ModernGarden = ({
  start,
  junction,
  doors,
}: {
  start: V2;
  junction: V2;
  doors: { pos: V3; yaw: number }[];
}) => {
  const root = useRef<THREE.Group>(null);
  const paving = useMemo(() => makePaving(), []);
  const gravel = useMemo(() => makeGravel(), []);

  useEffect(() => {
    root.current?.traverse((o) => {
      o.raycast = () => null;
    });
  }, []);

  const centerlines = useMemo(
    () => [
      { from: start, to: junction },
      ...doors.map((d) => ({ from: junction, to: [d.pos[0], d.pos[2]] as V2 })),
    ],
    [start, junction, doors]
  );
  const distToSeg = (px: number, pz: number, c: { from: V2; to: V2 }) => {
    const dx = c.to[0] - c.from[0];
    const dz = c.to[1] - c.from[1];
    const t = Math.max(
      0,
      Math.min(1, ((px - c.from[0]) * dx + (pz - c.from[1]) * dz) / (dx * dx + dz * dz))
    );
    return Math.hypot(px - (c.from[0] + t * dx), pz - (c.from[1] + t * dz));
  };

  const segs = useMemo<Seg[]>(
    () => [
      { from: start, to: junction, t0: 3.2, t1: 6.8 },
      ...doors.map((d) => {
        const len = Math.hypot(d.pos[0] - junction[0], d.pos[2] - junction[1]);
        return { from: junction, to: [d.pos[0], d.pos[2]] as V2, t0: 6.0, t1: len - 7.0 };
      }),
    ],
    [start, junction, doors]
  );

  // clipped hedge walls with regular openings + cypress rows
  const lines = useMemo(() => {
    const hedges: Item[] = [];
    const cypress: Item[] = [];
    const OFF = 3.5;
    segs.forEach((seg, si) => {
      const dx = seg.to[0] - seg.from[0];
      const dz = seg.to[1] - seg.from[1];
      const L = Math.hypot(dx, dz);
      const nx = dx / L;
      const nz = dz / L;
      const px = -nz;
      const pz = nx;
      const yaw = -Math.atan2(nz, nx);
      for (const side of [-1, 1]) {
        for (let t = seg.t0; t + 5.2 <= seg.t1 + 0.01; t += 6.0) {
          const mid = t + 2.6;
          hedges.push({
            p: [
              seg.from[0] + nx * mid + px * side * OFF,
              0.45,
              seg.from[1] + nz * mid + pz * side * OFF,
            ],
            r: [0, yaw, 0],
            s: [5.2, 0.9, 0.8],
          });
        }
        let n = si * 31 + (side > 0 ? 7 : 0);
        for (let t = seg.t0 + 1; t <= seg.t1 + 3; t += 5.4) {
          const h = 6 + rand(n++) * 2;
          const cx = seg.from[0] + nx * t + px * side * 7.6;
          const cz = seg.from[1] + nz * t + pz * side * 7.6;
          const clear = centerlines.every((c) => distToSeg(cx, cz, c) > 6.4);
          const far = Math.hypot(cx - junction[0], cz - junction[1]) > 10;
          if (clear && far) cypress.push({ p: [cx, h / 2, cz], s: [1, h, 1] });
        }
      }
    });
    return { hedges, cypress };
  }, [segs, centerlines, junction]);

  const strips = useMemo(
    () =>
      [
        { from: start, to: junction, w: 5.6 },
        ...doors.map((d) => ({ from: junction, to: [d.pos[0], d.pos[2]] as V2, w: 5.4 })),
      ].map((s) => {
        const dx = s.to[0] - s.from[0];
        const dz = s.to[1] - s.from[1];
        const len = Math.hypot(dx, dz);
        const tex = paving ? paving.clone() : null;
        if (tex) {
          tex.repeat.set(s.w / 5, len / 5);
          tex.needsUpdate = true;
        }
        const mat = makeStone({ color: "#ffffff", map: tex, bump: 8 });
        return { ...s, len, angle: Math.atan2(dx, dz), mat };
      }),
    [start, junction, doors, paving]
  );

  const sculptures = useMemo(() => {
    const out: { kind: number; pos: V3; rot: number }[] = [];
    let k = 0;
    doors.forEach((d) => {
      const c = Math.cos(d.yaw);
      const s = Math.sin(d.yaw);
      [
        [-5.6, -1.6],
        [5.6, -1.6],
      ].forEach(([lx, lz]) =>
        out.push({
          kind: k++,
          pos: [d.pos[0] + lx * c + lz * s, 0, d.pos[2] - lx * s + lz * c],
          rot: d.yaw + (lx > 0 ? 0.4 : -0.4),
        })
      );
    });
    [3 * Math.PI / 8, 5 * Math.PI / 8].forEach((a) => {
      out.push({
        kind: k++,
        pos: [junction[0] + Math.cos(a) * 13.5, 0, junction[1] + Math.sin(a) * 13.5],
        rot: 0,
      });
    });
    return out;
  }, [doors, junction]);

  // slim light bollards flanking each door
  const bollards = useMemo(() => {
    const body: Item[] = [];
    const cap: Item[] = [];
    doors.forEach((d) => {
      const c = Math.cos(d.yaw);
      const s = Math.sin(d.yaw);
      [
        [-3.9, -3.4],
        [3.9, -3.4],
      ].forEach(([lx, lz]) => {
        const x = d.pos[0] + lx * c + lz * s;
        const z = d.pos[2] - lx * s + lz * c;
        body.push({ p: [x, 0.55, z] });
        cap.push({ p: [x, 1.12, z] });
      });
    });
    return { body, cap };
  }, [doors]);

  return (
    <group ref={root}>
      {/* dark gravel court */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 8]}>
        <planeGeometry args={[64, 74]} />
        <meshStandardMaterial map={gravel ?? undefined} color="#ffffff" roughness={1} />
      </mesh>

      {/* large-format paving, charcoal edge, warm LED line */}
      {strips.map((s, i) => {
        const cx = (s.from[0] + s.to[0]) / 2;
        const cz = (s.from[1] + s.to[1]) / 2;
        return (
          <group key={i} position={[cx, 0.022, cz]} rotation={[0, s.angle, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[s.w, s.len]} />
              <primitive object={s.mat} attach="material" />
            </mesh>
            {([-1, 1] as number[]).map((side) => (
              <group key={side}>
                <mesh position={[side * (s.w / 2 + 0.1), 0.02, 0]}>
                  <boxGeometry args={[0.2, 0.06, s.len]} />
                  {charcoal()}
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[side * (s.w / 2 - 0.12), 0.006, 0]}>
                  <planeGeometry args={[0.05, s.len]} />
                  <meshBasicMaterial color="#ffe3ac" toneMapped={false} />
                </mesh>
              </group>
            ))}
          </group>
        );
      })}

      {/* junction: flush stone disc with one brass ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[junction[0], 0.026, junction[1]]}>
        <circleGeometry args={[5.2, 72]} />
        {stone()}
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[junction[0], 0.03, junction[1]]}>
        <ringGeometry args={[5.0, 5.05, 72]} />
        {brass()}
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[junction[0], 0.03, junction[1]]}>
        <ringGeometry args={[4.0, 4.04, 72]} />
        {charcoal()}
      </mesh>

      {/* hedge walls and cypress rows */}
      <Instances items={lines.hedges}>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={hedgeMat} attach="material" />
      </Instances>
      <Instances items={lines.cypress}>
        <coneGeometry args={[0.9, 1, 12]} />
        <meshStandardMaterial color="#173321" roughness={0.97} />
      </Instances>

      {/* minimal gateway on the entrance path */}
      <Gateway z={start[1] + 6} />

      {/* abstract sculptures */}
      {sculptures.map((s, i) => (
        <Sculpture key={i} kind={s.kind} position={s.pos} rotationY={s.rot} />
      ))}

      {/* light bollards */}
      <Instances items={bollards.body}>
        <cylinderGeometry args={[0.13, 0.13, 1.1, 20]} />
        {charcoal()}
      </Instances>
      <Instances items={bollards.cap}>
        <cylinderGeometry args={[0.135, 0.135, 0.06, 20]} />
        <meshBasicMaterial color="#ffe3ac" toneMapped={false} />
      </Instances>
    </group>
  );
};

export default ModernGarden;
