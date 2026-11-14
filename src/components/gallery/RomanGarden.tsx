import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Instances, type Item } from "./MilanDecor";
import {
  basaltMat,
  bronzeMat,
  goldMat as goldLiningMat,
  makeStone,
  stoneDarkMat,
  stoneMat,
} from "./StoneMaterials";
import {
  Gorgoneion,
  MeanderBand,
  Statue,
  makeMeander,
  type GodKind,
} from "./GreekStatues";

// Luxurious Roman treatment for the entrance garden: marble paving with gold
// inlay, a grand tiered fountain basin, gilded balustrades and cypress rows
// along the paths, a triumphal arch on the entrance path, obelisks, braziers,
// and a marble forecourt in front of each of the three doors.

type V3 = [number, number, number];
type V2 = [number, number];

// One simple palette: limestone, dark stone and muted bronze. The richness is
// in the surface (see StoneMaterials) and in the carved detail.
const goldMat = (_r = 0.78) => <primitive object={bronzeMat} attach="material" />;
const marbleMat = (_r = 0.95) => <primitive object={stoneMat} attach="material" />;
const blackMat = () => <primitive object={basaltMat} attach="material" />;
const darkStoneMat = () => <primitive object={stoneDarkMat} attach="material" />;

// Matte floor medallion: stone disc, bronze rings, 16-point basalt star.
const Medallion = ({
  x = 0,
  z,
  radius,
}: {
  x?: number;
  z: number;
  radius: number;
}) => {
  const star = useMemo(() => {
    const shape = new THREE.Shape();
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? radius * 0.78 : radius * 0.34;
      if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: false });
  }, [radius]);
  return (
    <group position={[x, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <circleGeometry args={[radius, 64]} />
        {marbleMat()}
      </mesh>
      {/* raised concentric rings in the same stone */}
      {[0.97, 0.86, 0.5].map((f, i) => (
        <mesh key={i} position={[0, 0, 0.005 + i * 0.004]}>
          <ringGeometry args={[radius * (f - (i === 1 ? 0.025 : 0.05)), radius * f, 64]} />
          {i === 1 ? darkStoneMat() : <primitive object={goldLiningMat} attach="material" />}
        </mesh>
      ))}
      <mesh geometry={star} position={[0, 0, 0.006]}>
        {blackMat()}
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <circleGeometry args={[radius * 0.16, 36]} />
        {darkStoneMat()}
      </mesh>
    </group>
  );
};

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
  ctx.fillStyle = "#cdc4b0";
  ctx.fillRect(0, 0, s, s);
  // simple dressed-slab joints, staggered
  ctx.strokeStyle = "rgba(60,52,42,0.75)";
  ctx.lineWidth = 3;
  const h = s / 2;
  ctx.strokeRect(0, 0, s, s);
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(s, h);
  ctx.moveTo(h / 2, 0);
  ctx.lineTo(h / 2, h);
  ctx.moveTo(h + h / 2, h);
  ctx.lineTo(h + h / 2, s);
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
  ctx.fillStyle = "#4a4235";
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 9000; i++) {
    const v = Math.random();
    ctx.fillStyle =
      v > 0.66
        ? "rgba(230,205,160,0.18)"
        : v > 0.33
          ? "rgba(20,15,8,0.3)"
          : "rgba(120,98,62,0.25)";
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

// ── Triumphal arch (black marble, gold-banded) ──────────────────────────────
const LuxArch = ({
  z,
  meander,
}: {
  z: number;
  meander: THREE.Texture | null;
}) => {
  const vault = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-6.3, 0);
    s.absarc(0, 0, 6.3, Math.PI, 0, true);
    s.lineTo(4.9, 0);
    s.absarc(0, 0, 4.9, 0, Math.PI, false);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 2.4, bevelEnabled: false });
  }, []);
  const PIER_H = 5.0;
  const SQ = 0.62;
  const FRZ = PIER_H + 1.2 + 6.3 * SQ + 0.9;
  const triglyphs = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (let x = -6; x <= 6.01; x += 1.0)
      for (const f of [-1, 1]) out.push({ p: [x, FRZ, f * 1.52] });
    return out;
  }, [FRZ]);
  const metopes = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (let x = -5.5; x <= 5.51; x += 1.0)
      for (const f of [-1, 1])
        out.push({ p: [x, FRZ, f * 1.52], r: [Math.PI / 2, 0, 0] });
    return out;
  }, [FRZ]);
  const rustic = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (const sx of [-1, 1])
      for (const f of [-1, 1])
        for (let y = 1.0; y < PIER_H + 0.5; y += 0.5)
          out.push({ p: [sx * 5.6, y, f * 1.21] });
    return out;
  }, []);
  const archFlutes = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (const sx of [-1, 1])
      for (const f of [-1, 1])
        for (let k = 0; k < 16; k++) {
          const a = (k / 16) * Math.PI * 2;
          out.push({
            p: [sx * 5.6 + Math.cos(a) * 0.385, 0.7 + PIER_H / 2, f * 1.35 + Math.sin(a) * 0.385],
            r: [0, Math.PI / 2 - a, 0],
          });
        }
    return out;
  }, []);
  return (
    <group position={[0, 0, z]}>
      {([-1, 1] as number[]).map((s) => (
        <group key={s} position={[s * 5.6, 0, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[2.3, 0.6, 2.9]} />
            {marbleMat(0.4)}
          </mesh>
          <mesh position={[0, 0.66, 0]}>
            <boxGeometry args={[2.1, 0.12, 2.7]} />
            {goldMat()}
          </mesh>
          <mesh position={[0, PIER_H / 2 + 0.7, 0]}>
            <boxGeometry args={[1.8, PIER_H, 2.4]} />
            {blackMat()}
          </mesh>
          {([-1, 1] as number[]).map((f) => (
            <group key={f} position={[0, 0, f * 1.35]}>
              <mesh position={[0, PIER_H / 2 + 0.7, 0]}>
                <cylinderGeometry args={[0.36, 0.4, PIER_H, 20]} />
                {marbleMat(0.25)}
              </mesh>
              <mesh position={[0, 1.0, 0]}>
                <torusGeometry args={[0.42, 0.07, 8, 20]} />
                {goldMat()}
              </mesh>
              <mesh position={[0, PIER_H + 0.55, 0]}>
                <cylinderGeometry args={[0.6, 0.4, 0.5, 20]} />
                {goldMat(0.32)}
              </mesh>
            </group>
          ))}
          <mesh position={[0, PIER_H + 0.95, 0]}>
            <boxGeometry args={[2.2, 0.26, 2.8]} />
            {marbleMat(0.4)}
          </mesh>
          <mesh position={[0, PIER_H + 1.12, 0]}>
            <boxGeometry args={[2.3, 0.08, 2.9]} />
            {goldMat()}
          </mesh>
        </group>
      ))}
      <group position={[0, PIER_H + 1.2, 0]} scale={[1, SQ, 1]}>
        <mesh geometry={vault} position={[0, 0, -1.2]}>
          {marbleMat(0.35)}
        </mesh>
        <mesh position={[0, 0, 1.22]}>
          <torusGeometry args={[4.95, 0.1, 8, 48, Math.PI]} />
          {goldMat()}
        </mesh>
        <mesh position={[0, 0, 1.22]}>
          <torusGeometry args={[6.25, 0.1, 8, 48, Math.PI]} />
          {goldMat()}
        </mesh>
      </group>
      <Gorgoneion
        position={[0, PIER_H + 1.2 + 6.3 * SQ + 0.15, 1.45]}
        scale={1.15}
      />
      {/* Greek-key frieze on both faces of the attic */}
      <MeanderBand
        width={11.2}
        height={0.9}
        texture={meander}
        position={[0, PIER_H + 1.2 + 6.3 * SQ + 2.1, 1.27]}
      />
      <MeanderBand
        width={11.2}
        height={0.9}
        texture={meander}
        position={[0, PIER_H + 1.2 + 6.3 * SQ + 2.1, -1.27]}
        rotation={[0, Math.PI, 0]}
      />
      {/* Doric frieze: triglyphs and carved rosette metopes */}
      <Instances items={triglyphs}>
        <boxGeometry args={[0.3, 0.6, 0.07]} />
        <primitive object={basaltMat} attach="material" />
      </Instances>
      <Instances items={metopes}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 14]} />
        <primitive object={stoneDarkMat} attach="material" />
      </Instances>
      {/* rusticated pier courses */}
      <Instances items={rustic}>
        <boxGeometry args={[1.8, 0.035, 0.03]} />
        <primitive object={basaltMat} attach="material" />
      </Instances>
      {/* fluted Doric shafts */}
      <Instances items={archFlutes}>
        <boxGeometry args={[0.06, PIER_H - 0.4, 0.05]} />
        <primitive object={stoneDarkMat} attach="material" />
      </Instances>
      {/* winged Victories at the attic corners */}
      {([-1, 1] as number[]).map((sx) => (
        <Statue
          key={sx}
          kind="nike"
          position={[sx * 5.4, PIER_H + 1.2 + 6.3 * SQ + 3.2, 0]}
          rotationY={0}
          scale={0.72}
        />
      ))}
      {/* entablature + attic */}
      <mesh position={[0, PIER_H + 1.2 + 6.3 * SQ + 0.9, 0]}>
        <boxGeometry args={[13.0, 0.7, 3.0]} />
        {marbleMat(0.4)}
      </mesh>
      <mesh position={[0, PIER_H + 1.2 + 6.3 * SQ + 1.3, 0]}>
        <boxGeometry args={[13.3, 0.12, 3.2]} />
        {goldMat()}
      </mesh>
      <mesh position={[0, PIER_H + 1.2 + 6.3 * SQ + 2.1, 0]}>
        <boxGeometry args={[11.6, 1.5, 2.5]} />
        {blackMat()}
      </mesh>
      <mesh position={[0, PIER_H + 1.2 + 6.3 * SQ + 2.95, 0]}>
        <boxGeometry args={[12.6, 0.3, 3.0]} />
        {marbleMat(0.4)}
      </mesh>
      <mesh position={[0, PIER_H + 1.2 + 6.3 * SQ + 3.15, 0]}>
        <boxGeometry args={[12.8, 0.08, 3.1]} />
        {goldMat()}
      </mesh>
    </group>
  );
};

const Obelisk = ({ pos }: { pos: V3 }) => (
  <group position={pos}>
    <mesh position={[0, 0.3, 0]}>
      <boxGeometry args={[1.3, 0.6, 1.3]} />
      {marbleMat(0.4)}
    </mesh>
    <mesh position={[0, 0.7, 0]}>
      <boxGeometry args={[1.0, 0.25, 1.0]} />
      {goldMat()}
    </mesh>
    <mesh position={[0, 3.45, 0]} rotation={[0, Math.PI / 4, 0]}>
      <cylinderGeometry args={[0.26, 0.44, 5.1, 4]} />
      {blackMat()}
    </mesh>
    <mesh position={[0, 6.3, 0]} rotation={[0, Math.PI / 4, 0]}>
      <coneGeometry args={[0.26, 0.6, 4]} />
      {goldMat(0.2)}
    </mesh>
  </group>
);

interface Seg {
  from: V2;
  to: V2;
  t0: number;
  t1: number;
}

const RomanGarden = ({
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
  const meander = useMemo(() => makeMeander(), []);

  useEffect(() => {
    root.current?.traverse((o) => {
      o.raycast = () => null;
    });
  }, []);

  const baluster = useMemo(() => {
    const pts = [
      [0.001, 0],
      [0.15, 0.02],
      [0.1, 0.12],
      [0.07, 0.2],
      [0.15, 0.4],
      [0.17, 0.5],
      [0.09, 0.64],
      [0.12, 0.7],
      [0.001, 0.72],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 10);
  }, []);

  // ── Paths ──────────────────────────────────────────────────────────────────
  const segs = useMemo<Seg[]>(
    () => [
      { from: [start[0], start[1]], to: junction, t0: 3.2, t1: 12 - 5.2 },
      ...doors.map((d) => {
        const len = Math.hypot(d.pos[0] - junction[0], d.pos[2] - junction[1]);
        return {
          from: junction,
          to: [d.pos[0], d.pos[2]] as V2,
          t0: 5.4,
          t1: len - 6.6,
        };
      }),
    ],
    [start, junction, doors]
  );

  const frame = (s: Seg) => {
    const dx = s.to[0] - s.from[0];
    const dz = s.to[1] - s.from[1];
    const len = Math.hypot(dx, dz);
    return { len, nx: dx / len, nz: dz / len, px: -dz / len, pz: dx / len };
  };

  const allCenterlines = useMemo(
    () => [
      { from: start, to: junction },
      ...doors.map((d) => ({ from: junction, to: [d.pos[0], d.pos[2]] as V2 })),
    ],
    [start, junction, doors]
  );
  const distToSeg = (
    px: number,
    pz: number,
    c: { from: V2; to: V2 }
  ) => {
    const dx = c.to[0] - c.from[0];
    const dz = c.to[1] - c.from[1];
    const t = Math.max(
      0,
      Math.min(1, ((px - c.from[0]) * dx + (pz - c.from[1]) * dz) / (dx * dx + dz * dz))
    );
    return Math.hypot(px - (c.from[0] + t * dx), pz - (c.from[1] + t * dz));
  };

  const bal = useMemo(() => {
    const balusters: Item[] = [];
    const posts: Item[] = [];
    const rails: Item[] = [];
    const cypress: Item[] = [];
    const OFF = 3.2;
    segs.forEach((seg, si) => {
      const f = frame(seg);
      const yaw = -Math.atan2(f.nz, f.nx);
      for (const side of [-1, 1]) {
        const len = seg.t1 - seg.t0;
        if (len <= 0) continue;
        const mid = (seg.t0 + seg.t1) / 2;
        rails.push({
          p: [
            seg.from[0] + f.nx * mid + f.px * side * OFF,
            1.07,
            seg.from[1] + f.nz * mid + f.pz * side * OFF,
          ],
          r: [0, yaw, 0],
          s: [len, 1, 1],
        });
        for (let t = seg.t0 + 0.3; t <= seg.t1 - 0.2; t += 0.55)
          balusters.push({
            p: [
              seg.from[0] + f.nx * t + f.px * side * OFF,
              0.2,
              seg.from[1] + f.nz * t + f.pz * side * OFF,
            ],
            s: [1, 1.1, 1],
          });
        for (let t = seg.t0; t <= seg.t1 + 0.01; t += len / Math.max(1, Math.round(len / 4.6)))
          posts.push({
            p: [
              seg.from[0] + f.nx * t + f.px * side * OFF,
              0,
              seg.from[1] + f.nz * t + f.pz * side * OFF,
            ],
            r: [0, yaw, 0],
          });
        // cypress rows further out, never on or beside any path
        let n = si * 31 + (side > 0 ? 7 : 0);
        for (let t = seg.t0 + 1; t <= seg.t1 + 3; t += 4.6) {
          const h = 6 + rand(n++) * 2.2;
          const cx = seg.from[0] + f.nx * t + f.px * side * 7.4;
          const cz = seg.from[1] + f.nz * t + f.pz * side * 7.4;
          const clear = allCenterlines.every((c) => distToSeg(cx, cz, c) > 6.2);
          const farFromJunction =
            Math.hypot(cx - junction[0], cz - junction[1]) > 10;
          if (clear && farFromJunction)
            cypress.push({ p: [cx, h / 2, cz], s: [1, h, 1] });
        }
      }
    });
    return { balusters, posts, rails, cypress };
  }, [segs, allCenterlines, junction]);

  // ── Paving strips with gold edges ──────────────────────────────────────────
  const strips = useMemo(
    () =>
      [
        { from: [start[0], start[1]] as V2, to: junction, w: 5.6 },
        ...doors.map((d) => ({
          from: junction,
          to: [d.pos[0], d.pos[2]] as V2,
          w: 5.4,
        })),
      ].map((s, idx) => {
        const dx = s.to[0] - s.from[0];
        const dz = s.to[1] - s.from[1];
        const len = Math.hypot(dx, dz);
        const tex = paving ? paving.clone() : null;
        if (tex) {
          tex.repeat.set(s.w / 6, len / 6);
          tex.needsUpdate = true;
        }
        const mat = makeStone({ color: "#ffffff", map: tex, bump: 9 });
        // Edge lines/curbs stop short of the junction so the four paths don't
        // draw their linings across each other where they merge.
        const trim = idx === 0 ? 6.5 : 7.2;
        const decorLen = Math.max(0.1, len - trim);
        const shift = idx === 0 ? -trim / 2 : trim / 2; // junction end differs
        return { ...s, len, angle: Math.atan2(dx, dz), tex, mat, decorLen, shift, idx };
      }),
    [start, junction, doors, paving]
  );

  // ── Braziers ───────────────────────────────────────────────────────────────
  const braziers = useMemo(() => {
    const legs: Item[] = [];
    const bowls: Item[] = [];
    const flames: Item[] = [];
    const add = (x: number, z: number) => {
      bowls.push({ p: [x, 1.15, z] });
      flames.push({ p: [x, 1.62, z] });
      [0, 1, 2].forEach((k) => {
        const a = (k / 3) * Math.PI * 2;
        legs.push({
          p: [x + Math.cos(a) * 0.2, 0.52, z + Math.sin(a) * 0.2],
          r: [0.18 * Math.sin(a), 0, -0.18 * Math.cos(a)],
        });
      });
    };
    doors.forEach((d) => {
      const c = Math.cos(d.yaw);
      const s = Math.sin(d.yaw);
      // local (x, z) -> world offset for rotation about Y by yaw
      [
        [-3.6, -3.4],
        [3.6, -3.4],
      ].forEach(([lx, lz]) => add(d.pos[0] + lx * c + lz * s, d.pos[2] - lx * s + lz * c));
    });
    return { legs, bowls, flames };
  }, [doors]);

  const obeliskSpots = useMemo<V3[]>(
    () => [
      [junction[0] - 6.4, 0, junction[1]],
      [junction[0] + 6.4, 0, junction[1]],
      [junction[0] - 5.6, 0, junction[1] - 5.6],
      [junction[0] + 5.6, 0, junction[1] - 5.6],
    ],
    [junction]
  );

  const DOOR_GODS: [GodKind, GodKind][] = [
    ["hermes", "poseidon"],
    ["athena", "zeus"],
    ["apollo", "artemis"],
  ];
  const statues = useMemo(() => {
    const out: { kind: GodKind; pos: V3; rot: number }[] = [];
    doors.forEach((d, i) => {
      const c = Math.cos(d.yaw);
      const s = Math.sin(d.yaw);
      const gods = DOOR_GODS[i % DOOR_GODS.length];
      [
        [-5.4, -1.4, gods[0]],
        [5.4, -1.4, gods[1]],
      ].forEach(([lx, lz, kind]) =>
        out.push({
          kind: kind as GodKind,
          pos: [
            d.pos[0] + (lx as number) * c + (lz as number) * s,
            0,
            d.pos[2] - (lx as number) * s + (lz as number) * c,
          ],
          rot: d.yaw + Math.PI,
        })
      );
    });
    // two gods facing the fountain between the south paths
    [
      [3 * Math.PI / 8, "hera"],
      [5 * Math.PI / 8, "ares"],
    ].forEach(([ang, kind]) => {
      const a = ang as number;
      const px = junction[0] + Math.cos(a) * 13.5;
      const pz = junction[1] + Math.sin(a) * 13.5;
      out.push({
        kind: kind as GodKind,
        pos: [px, 0, pz],
        rot: Math.atan2(junction[0] - px, junction[1] - pz),
      });
    });
    return out;
  }, [doors, junction]);

  return (
    <group ref={root}>
      {/* dark gravel court under the formal garden */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 8]}>
        <planeGeometry args={[64, 74]} />
        <meshStandardMaterial map={gravel ?? undefined} color="#ffffff" roughness={1} />
      </mesh>

      {/* marble paving with gold edge lines */}
      {strips.map((s, i) => {
        const cx = (s.from[0] + s.to[0]) / 2;
        const cz = (s.from[1] + s.to[1]) / 2;
        return (
          <group key={i} position={[cx, 0.022 + i * 0.0008, cz]} rotation={[0, s.angle, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[s.w, s.len]} />
              <primitive object={s.mat} attach="material" />
            </mesh>
            {([-1, 1] as number[]).flatMap((side) => [
              <mesh key={`${side}g1`} rotation={[-Math.PI / 2, 0, 0]} position={[side * (s.w / 2 - 0.16), 0.006, s.shift]}>
                <planeGeometry args={[0.07, s.decorLen]} />
                <primitive object={goldLiningMat} attach="material" />
              </mesh>,
              <mesh key={`${side}g2`} rotation={[-Math.PI / 2, 0, 0]} position={[side * (s.w / 2 - 0.34), 0.006, s.shift]}>
                <planeGeometry args={[0.03, s.decorLen]} />
                <primitive object={goldLiningMat} attach="material" />
              </mesh>,
            ])}
            {([-1, 1] as number[]).map((side) => (
              <mesh key={side} position={[side * (s.w / 2 + 0.06), 0.03, s.shift]}>
                <boxGeometry args={[0.16, 0.1, s.decorLen]} />
                {blackMat()}
              </mesh>
            ))}
          </group>
        );
      })}

      {/* entrance medallion under the starting position */}
      <Medallion x={start[0]} z={start[1] + 1.8} radius={3.4} />

      {/* path balustrades */}
      <Instances items={bal.rails}>
        <boxGeometry args={[1, 0.12, 0.4]} />
        {marbleMat(0.35)}
      </Instances>
      <Instances items={bal.rails.map((r) => ({ ...r, p: [r.p[0], 1.15, r.p[2]] as V3, s: r.s }))}>
        <boxGeometry args={[1, 0.04, 0.26]} />
        {goldMat()}
      </Instances>
      <Instances items={bal.rails.map((r) => ({ ...r, p: [r.p[0], 0.1, r.p[2]] as V3 }))}>
        <boxGeometry args={[1, 0.18, 0.34]} />
        {marbleMat(0.35)}
      </Instances>
      <Instances items={bal.balusters}>
        <primitive object={baluster} attach="geometry" />
        {marbleMat(0.35)}
      </Instances>
      <Instances items={bal.posts.map((p) => ({ ...p, p: [p.p[0], 0.62, p.p[2]] as V3 }))}>
        <boxGeometry args={[0.55, 1.24, 0.55]} />
        {marbleMat(0.35)}
      </Instances>
      <Instances items={bal.posts.map((p) => ({ ...p, p: [p.p[0], 1.28, p.p[2]] as V3 }))}>
        <boxGeometry args={[0.7, 0.1, 0.7]} />
        {goldMat()}
      </Instances>
      <Instances items={bal.posts.map((p) => ({ p: [p.p[0], 1.55, p.p[2]] as V3 }))}>
        <sphereGeometry args={[0.19, 12, 12]} />
        {goldMat(0.2)}
      </Instances>

      {/* cypress rows */}
      <Instances items={bal.cypress}>
        <coneGeometry args={[0.9, 1, 12]} />
        <meshStandardMaterial color="#173321" roughness={0.95} />
      </Instances>

      {/* triumphal arch on the entrance path */}
      <LuxArch z={start[1] + 6} meander={meander} />

      {/* obelisks around the junction */}
      {obeliskSpots.map((p, i) => (
        <Obelisk key={i} pos={p} />
      ))}

      {/* forecourts at the three doors */}
      {doors.map((d, i) => {
        const c = Math.cos(d.yaw);
        const s = Math.sin(d.yaw);
        const fx = d.pos[0] + 0 * c + -5.2 * s;
        const fz = d.pos[2] - 0 * s + -5.2 * c;
        return <Medallion key={i} x={fx} z={fz} radius={3.2} />;
      })}
      {/* Olympians: two gods flank each door, two face the fountain */}
      {statues.map((st, i) => (
        <Statue key={i} kind={st.kind} position={st.pos} rotationY={st.rot} scale={1.15} />
      ))}

      {/* braziers flanking each door */}
      <Instances items={braziers.legs}>
        <cylinderGeometry args={[0.04, 0.05, 1.1, 6]} />
        {goldMat(0.35)}
      </Instances>
      <Instances items={braziers.bowls}>
        <cylinderGeometry args={[0.48, 0.25, 0.4, 16]} />
        {goldMat(0.3)}
      </Instances>
      <Instances items={braziers.flames}>
        <coneGeometry args={[0.3, 0.8, 10]} />
        <meshStandardMaterial
          color="#ffb347"
          emissive="#ff7a1a"
          emissiveIntensity={2.2}
          transparent
          opacity={0.92}
        />
      </Instances>
    </group>
  );
};

export default RomanGarden;
