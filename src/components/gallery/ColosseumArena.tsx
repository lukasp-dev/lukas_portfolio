import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Instances, type Item } from "./MilanDecor";

// Roman amphitheatre treatment for the experience scene: a sand arena floor,
// three tiers of massive travertine arches (Tuscan / Ionic / Corinthian) with
// an attic, a ruined corner with fallen drums and rubble, monumental arches
// over the path, bronze braziers and heavy stone plinths. Instanced throughout.

const STONE = "#d3c3a0";
const STONE_DARK = "#b9a882";
const VOID = "#16110b";
const BRONZE = "#6a4a22";
const GRANITE = "#4b433a";

type V3 = [number, number, number];

const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ── Textures ─────────────────────────────────────────────────────────────────
export const makeTravertine = () => {
  const w = 512;
  const h = 512;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#d6c6a3";
  ctx.fillRect(0, 0, w, h);
  // mottled pitted stone
  for (let i = 0; i < 9000; i++) {
    const v = Math.random();
    ctx.fillStyle =
      v > 0.7
        ? "rgba(255,246,226,0.12)"
        : v > 0.35
          ? "rgba(110,90,60,0.1)"
          : "rgba(70,55,35,0.12)";
    const s = 1 + Math.random() * 5;
    ctx.fillRect(Math.random() * w, Math.random() * h, s, s * 0.7);
  }
  // ashlar courses with staggered joints
  const courses = 10;
  const ch = h / courses;
  ctx.strokeStyle = "rgba(60,45,28,0.55)";
  ctx.lineWidth = 2.2;
  for (let r = 0; r < courses; r++) {
    const y = r * ch;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
    const blocks = 3;
    const bw = w / blocks;
    const off = (r % 2) * (bw / 2);
    for (let b = 0; b <= blocks; b++) {
      const x = b * bw + off - (r % 2 ? bw : 0);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + ch);
      ctx.stroke();
    }
    // slight tone variance per block row
    ctx.fillStyle =
      r % 2 ? "rgba(120,100,70,0.05)" : "rgba(255,240,210,0.05)";
    ctx.fillRect(0, y, w, ch);
  }
  // weathering streaks + moss patches
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * w;
    const g = ctx.createLinearGradient(x, 0, x, h);
    g.addColorStop(0, "rgba(60,48,30,0)");
    g.addColorStop(0.5, "rgba(60,48,30,0.1)");
    g.addColorStop(1, "rgba(60,48,30,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x, 0, 3 + Math.random() * 7, h);
  }
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = "rgba(70,90,50,0.09)";
    ctx.beginPath();
    ctx.arc(
      Math.random() * w,
      Math.random() * h,
      4 + Math.random() * 12,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
};

const makeSand = () => {
  const s = 1024;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#c2a477";
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 16000; i++) {
    const v = Math.random();
    ctx.fillStyle =
      v > 0.6
        ? "rgba(255,240,205,0.28)"
        : v > 0.3
          ? "rgba(120,92,56,0.25)"
          : "rgba(90,66,38,0.22)";
    const r = 0.5 + Math.random() * 1.8;
    ctx.beginPath();
    ctx.arc(Math.random() * s, Math.random() * s, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // raked furrows
  ctx.strokeStyle = "rgba(110,84,50,0.14)";
  ctx.lineWidth = 1.5;
  for (let y = 6; y < s; y += 11) {
    ctx.beginPath();
    ctx.moveTo(0, y + Math.random() * 3);
    for (let x = 0; x <= s; x += 64)
      ctx.lineTo(x, y + Math.sin(x * 0.02 + y) * 2 + Math.random() * 1.2);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  t.repeat.set(10, 10);
  return t;
};

const makePaving = () => {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#cdbb96";
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 1500; i++) {
    ctx.fillStyle =
      Math.random() > 0.5 ? "rgba(255,244,220,0.1)" : "rgba(90,70,45,0.12)";
    ctx.fillRect(Math.random() * s, Math.random() * s, 4, 3);
  }
  ctx.strokeStyle = "rgba(50,38,24,0.7)";
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, s, s);
  ctx.beginPath();
  ctx.moveTo(s / 2, 0);
  ctx.lineTo(s / 2, s);
  ctx.moveTo(0, s / 2);
  ctx.lineTo(s, s / 2);
  ctx.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  t.repeat.set(7, 7);
  return t;
};

// ── Arcade wall builder ──────────────────────────────────────────────────────
const BAY = 4.4;
const OPEN_W = 2.8;
const R = OPEN_W / 2;
const THICK = 2.2;
const TIERS = [
  { y: 0, h: 7.4, open: 5.6 },
  { y: 7.4, h: 7.0, open: 4.6 },
  { y: 14.4, h: 6.6, open: 4.4 },
];
const ATTIC = { y: 21, h: 4.6 };

interface WallSets {
  blocks: Item[];
  voids: Item[];
  caps: Item[];
  rings: Item[];
  jambs: Item[];
  keys: Item[];
  parapets: Item[];
  bases: Item[];
  shafts: Item[];
  capsT1: Item[];
  capsT2: Item[];
  volutes: Item[];
  capsT3: Item[];
  bands: Item[];
  cornices: Item[];
  atticWin: Item[];
  corbels: Item[];
  topRubble: Item[];
}

const buildWall = (bays: number, tiersAt: (k: number) => number): WallSets => {
  const S: WallSets = {
    blocks: [],
    voids: [],
    caps: [],
    rings: [],
    jambs: [],
    keys: [],
    parapets: [],
    bases: [],
    shafts: [],
    capsT1: [],
    capsT2: [],
    volutes: [],
    capsT3: [],
    bands: [],
    cornices: [],
    atticWin: [],
    corbels: [],
    topRubble: [],
  };
  const xs = (k: number) => (k - (bays - 1) / 2) * BAY;
  const colSets: Set<number>[] = [new Set(), new Set(), new Set()];
  const corbelSet = new Set<number>();
  const zf = THICK / 2;

  for (let k = 0; k < bays; k++) {
    const x = xs(k);
    const lv = tiersAt(k);
    const archTiers = Math.min(lv, 3);
    for (let t = 0; t < archTiers; t++) {
      const T = TIERS[t];
      S.blocks.push({ p: [x, T.y + T.h / 2, 0], s: [BAY, T.h, THICK] });
      const openBottom = T.y + (t === 0 ? 0 : 0.9);
      const apex = openBottom + T.open;
      const rectTop = apex - R;
      const rectH = rectTop - openBottom;
      S.voids.push({
        p: [x, openBottom + rectH / 2, zf + 0.02],
        s: [OPEN_W, rectH, 0.12],
      });
      S.caps.push({
        p: [x, rectTop, zf + 0.02],
        r: [Math.PI / 2, 0, 0],
        s: [R, 0.12, R],
      });
      S.rings.push({
        p: [x, rectTop, zf + 0.07],
        s: [R + 0.2, R + 0.2, 1],
      });
      for (const sx of [-1, 1])
        S.jambs.push({
          p: [x + sx * (R + 0.1), openBottom + rectH / 2, zf + 0.07],
          s: [0.2, rectH, 0.16],
        });
      S.keys.push({ p: [x, apex + 0.1, zf + 0.12], s: [0.5, 0.85, 0.3] });
      if (t > 0)
        S.parapets.push({
          p: [x, T.y + 0.45, zf + 0.06],
          s: [OPEN_W + 0.5, 0.9, 0.18],
        });
      colSets[t].add(Math.round((x - BAY / 2) * 100));
      colSets[t].add(Math.round((x + BAY / 2) * 100));
      S.bands.push({
        p: [x, T.y + T.h - 0.15, 0.15],
        s: [BAY, 0.3, THICK + 0.6],
      });
      S.cornices.push({
        p: [x, T.y + T.h + 0.04, 0.3],
        s: [BAY + 0.05, 0.14, THICK + 0.9],
      });
    }
    if (lv >= 4) {
      S.blocks.push({
        p: [x, ATTIC.y + ATTIC.h / 2, 0],
        s: [BAY, ATTIC.h, THICK],
      });
      S.atticWin.push({
        p: [x, ATTIC.y + ATTIC.h / 2 - 0.3, zf + 0.02],
        s: [0.85, 1.7, 0.12],
      });
      S.cornices.push({
        p: [x, ATTIC.y + ATTIC.h, 0.1],
        s: [BAY + 0.05, 0.55, THICK + 1.1],
      });
      corbelSet.add(Math.round((x - BAY / 2) * 100));
      corbelSet.add(Math.round((x + BAY / 2) * 100));
    } else {
      // broken top: rough rubble blocks on the truncated bay
      const topY =
        lv === 1
          ? TIERS[0].y + TIERS[0].h
          : lv === 2
            ? TIERS[1].y + TIERS[1].h
            : TIERS[2].y + TIERS[2].h;
      for (let j = 0; j < 4; j++) {
        const n = k * 17 + j * 5 + lv;
        S.topRubble.push({
          p: [x + (rand(n) - 0.5) * (BAY - 0.8), topY + 0.2 + rand(n + 1) * 0.35, (rand(n + 2) - 0.5) * 1.2],
          r: [0, rand(n + 3) * 0.6, (rand(n + 4) - 0.5) * 0.3],
          s: [0.8 + rand(n + 5) * 1.1, 0.5 + rand(n + 6) * 0.7, 0.8 + rand(n + 7) * 0.9],
        });
      }
    }
  }

  colSets.forEach((set, t) => {
    const T = TIERS[t];
    const shaftH = T.h - 1.15;
    set.forEach((key) => {
      const x = key / 100;
      const zc = zf + 0.05;
      S.bases.push({ p: [x, T.y + 0.225, zc], s: [1.3, 0.45, 0.95] });
      S.shafts.push({
        p: [x, T.y + 0.45 + shaftH / 2, zc],
        s: [0.5, shaftH, 0.5],
      });
      const capY = T.y + 0.45 + shaftH + 0.15;
      if (t === 0) S.capsT1.push({ p: [x, capY, zc], s: [1.3, 0.3, 1.0] });
      if (t === 1) {
        S.capsT2.push({ p: [x, capY, zc], s: [1.45, 0.28, 1.0] });
        for (const sx of [-1, 1])
          S.volutes.push({
            p: [x + sx * 0.56, capY - 0.1, zc + 0.4],
            r: [0, 0, 0],
          });
      }
      if (t === 2) S.capsT3.push({ p: [x, capY + 0.02, zc], s: [1, 1, 1] });
    });
  });
  corbelSet.forEach((key) => {
    const x = key / 100;
    S.corbels.push({
      p: [x, ATTIC.y + ATTIC.h - 0.95, zf + 0.28],
      s: [0.5, 1.3, 0.6],
    });
  });
  return S;
};

const Stone = ({ map }: { map: THREE.Texture | null }) => (
  <meshStandardMaterial
    map={map ?? undefined}
    color="#ffffff"
    roughness={0.97}
    metalness={0}
  />
);
const StoneFlat = ({ dark = false }: { dark?: boolean }) => (
  <meshStandardMaterial
    color={dark ? STONE_DARK : STONE}
    roughness={0.97}
    metalness={0}
  />
);

const ArcadeWall = ({
  position,
  rotation,
  bays,
  tiersAt,
  stone,
}: {
  position: V3;
  rotation: V3;
  bays: number;
  tiersAt: (k: number) => number;
  stone: THREE.Texture | null;
}) => {
  const S = useMemo(() => buildWall(bays, tiersAt), [bays, tiersAt]);
  return (
    <group position={position} rotation={rotation}>
      <Instances items={S.blocks}>
        <boxGeometry args={[1, 1, 1]} />
        <Stone map={stone} />
      </Instances>
      <Instances items={S.voids}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={VOID} roughness={1} />
      </Instances>
      <Instances items={S.caps}>
        <cylinderGeometry args={[1, 1, 1, 28, 1, false, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color={VOID} roughness={1} />
      </Instances>
      <Instances items={S.rings}>
        <torusGeometry args={[1, 0.1, 8, 32, Math.PI]} />
        <StoneFlat dark />
      </Instances>
      <Instances items={S.jambs}>
        <boxGeometry args={[1, 1, 1]} />
        <StoneFlat dark />
      </Instances>
      <Instances items={S.keys}>
        <boxGeometry args={[1, 1, 1]} />
        <StoneFlat />
      </Instances>
      <Instances items={S.parapets}>
        <boxGeometry args={[1, 1, 1]} />
        <StoneFlat dark />
      </Instances>
      <Instances items={S.bases}>
        <boxGeometry args={[1, 1, 1]} />
        <StoneFlat dark />
      </Instances>
      <Instances items={S.shafts}>
        <cylinderGeometry args={[1, 1, 1, 18]} />
        <StoneFlat />
      </Instances>
      <Instances items={S.capsT1}>
        <boxGeometry args={[1, 1, 1]} />
        <StoneFlat dark />
      </Instances>
      <Instances items={S.capsT2}>
        <boxGeometry args={[1, 1, 1]} />
        <StoneFlat dark />
      </Instances>
      <Instances items={S.volutes}>
        <torusGeometry args={[0.15, 0.06, 8, 16]} />
        <StoneFlat dark />
      </Instances>
      <Instances items={S.capsT3}>
        <cylinderGeometry args={[0.72, 0.52, 0.55, 16]} />
        <StoneFlat dark />
      </Instances>
      <Instances items={S.bands}>
        <boxGeometry args={[1, 1, 1]} />
        <StoneFlat dark />
      </Instances>
      <Instances items={S.cornices}>
        <boxGeometry args={[1, 1, 1]} />
        <StoneFlat />
      </Instances>
      <Instances items={S.atticWin}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={VOID} roughness={1} />
      </Instances>
      <Instances items={S.corbels}>
        <boxGeometry args={[1, 1, 1]} />
        <StoneFlat dark />
      </Instances>
      <Instances items={S.topRubble}>
        <boxGeometry args={[1, 1, 1]} />
        <StoneFlat dark />
      </Instances>
    </group>
  );
};

const Obelisk = ({ x, z }: { x: number; z: number }) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, 0.3, 0]}>
      <boxGeometry args={[1.2, 0.6, 1.2]} />
      <StoneFlat dark />
    </mesh>
    <mesh position={[0, 0.75, 0]}>
      <boxGeometry args={[0.9, 0.3, 0.9]} />
      <StoneFlat />
    </mesh>
    <mesh position={[0, 3.2, 0]} rotation={[0, Math.PI / 4, 0]}>
      <cylinderGeometry args={[0.24, 0.4, 4.6, 4]} />
      <meshStandardMaterial color={GRANITE} roughness={0.75} metalness={0.05} />
    </mesh>
    <mesh position={[0, 5.78, 0]} rotation={[0, Math.PI / 4, 0]}>
      <coneGeometry args={[0.24, 0.55, 4]} />
      <meshStandardMaterial color={BRONZE} roughness={0.4} metalness={0.7} />
    </mesh>
  </group>
);

// Monumental triumphal arch over the path
const TriumphArch = ({ z }: { z: number }) => {
  const vault = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-4.3, 0);
    s.absarc(0, 0, 4.3, Math.PI, 0, true);
    s.lineTo(3.3, 0);
    s.absarc(0, 0, 3.3, 0, Math.PI, false);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 2.2, bevelEnabled: false });
  }, []);
  const PIER_H = 4.2;
  return (
    <group position={[0, 0, z]}>
      {([-1, 1] as number[]).map((s) => (
        <group key={s} position={[s * 3.85, 0, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[1.9, 0.6, 2.5]} />
            <StoneFlat dark />
          </mesh>
          <mesh position={[0, PIER_H / 2 + 0.3, 0]}>
            <boxGeometry args={[1.5, PIER_H, 2.2]} />
            <StoneFlat />
          </mesh>
          {([-1, 1] as number[]).map((f) => (
            <mesh key={f} position={[s * -0.62 + s * 0.0, PIER_H / 2 + 0.3, f * 1.2]}>
              <cylinderGeometry args={[0.32, 0.36, PIER_H, 16]} />
              <StoneFlat dark />
            </mesh>
          ))}
          <mesh position={[0, PIER_H + 0.45, 0]}>
            <boxGeometry args={[1.9, 0.3, 2.5]} />
            <StoneFlat dark />
          </mesh>
        </group>
      ))}
      <mesh geometry={vault} position={[0, PIER_H + 0.6, -1.1]}>
        <StoneFlat />
      </mesh>
      {/* entablature and attic block */}
      <mesh position={[0, PIER_H + 0.6 + 4.3 + 0.28, 0]}>
        <boxGeometry args={[9.6, 0.56, 2.8]} />
        <StoneFlat dark />
      </mesh>
      <mesh position={[0, PIER_H + 0.6 + 4.3 + 1.2, 0]}>
        <boxGeometry args={[8.8, 1.3, 2.3]} />
        <StoneFlat />
      </mesh>
      <mesh position={[0, PIER_H + 0.6 + 4.3 + 1.95, 0]}>
        <boxGeometry args={[9.4, 0.3, 2.7]} />
        <StoneFlat dark />
      </mesh>
      {/* keystone */}
      <mesh position={[0, PIER_H + 0.6 + 4.3 + 0.0, 1.2]}>
        <boxGeometry args={[0.9, 1.1, 0.4]} />
        <StoneFlat dark />
      </mesh>
    </group>
  );
};

const ColosseumArena = ({ stations }: { stations: { x: number; z: number }[] }) => {
  const root = useRef<THREE.Group>(null);
  const stone = useMemo(() => makeTravertine(), []);
  const sand = useMemo(() => makeSand(), []);
  const paving = useMemo(() => makePaving(), []);

  // Decoration must never swallow pointer events meant for stations/doors.
  useEffect(() => {
    root.current?.traverse((o) => {
      o.raycast = () => null;
    });
  }, []);

  const backTiers = useMemo(
    () => (k: number) => (k === 9 ? 2 : k === 8 ? 3 : 4),
    []
  );
  const leftTiers = useMemo(() => () => 4, []);
  const rightTiers = useMemo(
    () => (k: number) => [1, 1, 2, 2, 3, 3][k] ?? 4,
    []
  );

  // Plaza rim blocks
  const rim = useMemo<Item[]>(() => {
    const out: Item[] = [];
    const N = 44;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      out.push({
        p: [Math.cos(a) * 8.6, 0.18, -17 + Math.sin(a) * 8.6],
        r: [0, -a + Math.PI / 2, 0],
        s: [1.25, 0.36, 0.8],
      });
    }
    return out;
  }, []);

  // Station plinths: stone disc + bronze ring + 6 bollards
  const discs = useMemo<Item[]>(
    () => stations.map((s) => ({ p: [s.x, 0.04, s.z] })),
    [stations]
  );
  const discRings = useMemo<Item[]>(
    () =>
      stations.map((s) => ({
        p: [s.x, 0.075, s.z],
        r: [-Math.PI / 2, 0, 0],
      })),
    [stations]
  );
  const bollards = useMemo<Item[]>(() => {
    const out: Item[] = [];
    stations.forEach((s) =>
      [0, 1, 2, 3, 4, 5].forEach((k) => {
        const a = (k / 6) * Math.PI * 2 + Math.PI / 6;
        out.push({ p: [s.x + Math.cos(a) * 2.1, 0.38, s.z + Math.sin(a) * 2.1] });
      })
    );
    return out;
  }, [stations]);

  // Braziers
  const brazierPos = useMemo<V3[]>(
    () => [
      [-6.4, 0, 14],
      [6.4, 0, 14],
      [-6.4, 0, 6],
      [6.4, 0, 6],
      [-6.4, 0, -2],
      [6.4, 0, -2],
      [-4.4, 0, -9.6],
      [4.4, 0, -9.6],
    ],
    []
  );
  const brazierBowls = useMemo<Item[]>(
    () => brazierPos.map(([x, , z]) => ({ p: [x, 1.2, z] })),
    [brazierPos]
  );
  const brazierFlames = useMemo<Item[]>(
    () => brazierPos.map(([x, , z]) => ({ p: [x, 1.7, z] })),
    [brazierPos]
  );
  const brazierLegs = useMemo<Item[]>(() => {
    const out: Item[] = [];
    brazierPos.forEach(([x, , z]) =>
      [0, 1, 2].forEach((k) => {
        const a = (k / 3) * Math.PI * 2;
        out.push({
          p: [x + Math.cos(a) * 0.2, 0.55, z + Math.sin(a) * 0.2],
          r: [0.18 * Math.sin(a), 0, -0.18 * Math.cos(a)],
        });
      })
    );
    return out;
  }, [brazierPos]);

  // Ruin debris near the broken corner (right/back)
  const rubble = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (let i = 0; i < 46; i++) {
      out.push({
        p: [
          14 + rand(i) * 5.6,
          0.2 + rand(i + 1) * 0.3,
          -36 + rand(i + 2) * 13,
        ],
        r: [rand(i + 3) * 0.5, rand(i + 4) * 3, rand(i + 5) * 0.5],
        s: [0.4 + rand(i + 6) * 1.3, 0.35 + rand(i + 7) * 0.7, 0.4 + rand(i + 8) * 1.1],
      });
    }
    return out;
  }, []);
  const drums = useMemo<Item[]>(
    () => [
      { p: [16.2, 0.5, -29.5], r: [0, 0.3, Math.PI / 2] },
      { p: [17.6, 0.5, -26.3], r: [0, 1.2, Math.PI / 2] },
      { p: [14.4, 0.5, -33.2], r: [0, 2.2, Math.PI / 2] },
      { p: [12.6, 0.5, -30.4], r: [0, 0.9, Math.PI / 2] },
    ],
    []
  );

  return (
    <group ref={root}>
      {/* SAND ARENA GROUND */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial
          map={sand ?? undefined}
          color="#ffffff"
          roughness={1}
        />
      </mesh>

      {/* STONE PAVED PLAZA around the fountain with rim blocks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -17]}>
        <circleGeometry args={[8.4, 72]} />
        <meshStandardMaterial
          map={paving ?? undefined}
          color="#ffffff"
          roughness={0.95}
        />
      </mesh>
      <Instances items={rim}>
        <boxGeometry args={[1, 1, 1]} />
        <StoneFlat dark />
      </Instances>
      {[
        [-7.2, -12.5],
        [7.2, -12.5],
        [-7.2, -21.5],
        [7.2, -21.5],
      ].map(([x, z], i) => (
        <Obelisk key={i} x={x} z={z} />
      ))}

      {/* THE AMPHITHEATRE WALLS */}
      <ArcadeWall
        position={[0, 0, -37]}
        rotation={[0, 0, 0]}
        bays={10}
        tiersAt={backTiers}
        stone={stone}
      />
      <ArcadeWall
        position={[-21, 0, -8.1]}
        rotation={[0, Math.PI / 2, 0]}
        bays={13}
        tiersAt={leftTiers}
        stone={stone}
      />
      <ArcadeWall
        position={[21, 0, -8.1]}
        rotation={[0, -Math.PI / 2, 0]}
        bays={13}
        tiersAt={rightTiers}
        stone={stone}
      />

      {/* MONUMENTAL ARCHES over the path */}
      {[11, 1].map((z) => (
        <TriumphArch key={z} z={z} />
      ))}

      {/* STATION plinths */}
      <Instances items={discs}>
        <cylinderGeometry args={[1.8, 1.9, 0.08, 10]} />
        <StoneFlat dark />
      </Instances>
      <Instances items={discRings}>
        <ringGeometry args={[1.45, 1.55, 10]} />
        <meshStandardMaterial color={BRONZE} roughness={0.4} metalness={0.7} />
      </Instances>
      <Instances items={bollards}>
        <cylinderGeometry args={[0.22, 0.26, 0.76, 10]} />
        <StoneFlat />
      </Instances>

      {/* BRONZE BRAZIERS */}
      <Instances items={brazierLegs}>
        <cylinderGeometry args={[0.04, 0.05, 1.15, 6]} />
        <meshStandardMaterial color={BRONZE} roughness={0.45} metalness={0.7} />
      </Instances>
      <Instances items={brazierBowls}>
        <cylinderGeometry args={[0.5, 0.26, 0.4, 16]} />
        <meshStandardMaterial color={BRONZE} roughness={0.4} metalness={0.75} />
      </Instances>
      <Instances items={brazierFlames}>
        <coneGeometry args={[0.3, 0.8, 10]} />
        <meshStandardMaterial
          color="#ffb347"
          emissive="#ff7a1a"
          emissiveIntensity={2.2}
          transparent
          opacity={0.92}
        />
      </Instances>

      {/* FALLEN DRUMS and RUBBLE at the ruined corner */}
      <Instances items={drums}>
        <cylinderGeometry args={[0.5, 0.5, 1.8, 16]} />
        <StoneFlat />
      </Instances>
      <Instances items={rubble}>
        <boxGeometry args={[1, 1, 1]} />
        <StoneFlat dark />
      </Instances>
    </group>
  );
};

export default ColosseumArena;
