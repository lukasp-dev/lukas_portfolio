import * as THREE from "three";

// One shared, matte, richly textured stone shader. Colour stays simple; the
// richness comes from world-space procedural detail: grain, pitting, hairline
// cracks, vertical weathering streaks, ground grime and a fine bump normal.
// It works on plain and instanced meshes (uses world position, no UVs).

const NOISE = /* glsl */ `
varying vec3 vWPos;
float hash31(vec3 p){
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float vnoise(vec3 x){
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash31(i + vec3(0,0,0)), hash31(i + vec3(1,0,0)), f.x),
        mix(hash31(i + vec3(0,1,0)), hash31(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash31(i + vec3(0,0,1)), hash31(i + vec3(1,0,1)), f.x),
        mix(hash31(i + vec3(0,1,1)), hash31(i + vec3(1,1,1)), f.x), f.y),
    f.z);
}
float fbm(vec3 p){
  float a = 0.5; float s = 0.0;
  for (int i = 0; i < 4; i++){ s += a * vnoise(p); p *= 2.03; a *= 0.5; }
  return s;
}
float stoneHeight(vec3 p){
  float h = fbm(p * 2.5) * 0.45 + fbm(p * 11.0) * 0.35 + vnoise(p * 46.0) * 0.20;
  float pits = smoothstep(0.72, 0.9, vnoise(p * 19.0));
  h -= pits * 0.35;
  float crack = 1.0 - abs(vnoise(p * 5.0) * 2.0 - 1.0);
  crack = smoothstep(0.94, 1.0, crack);
  h -= crack * 0.5;
  return h;
}
float stoneTone(vec3 p){
  float t = 0.86 + 0.22 * fbm(p * 1.7);
  float streak = fbm(vec3(p.x * 6.0, p.y * 0.5, p.z * 6.0));
  t *= mix(1.0, 0.8, smoothstep(0.55, 0.8, streak));
  t *= mix(0.76, 1.0, smoothstep(0.0, 1.3, p.y));
  float pit = smoothstep(0.72, 0.9, vnoise(p * 19.0));
  t *= 1.0 - pit * 0.18;
  return t;
}
vec3 stoneBump(vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection){
  vec3 vSigmaX = normalize(dFdx(surf_pos));
  vec3 vSigmaY = normalize(dFdy(surf_pos));
  vec3 R1 = cross(vSigmaY, surf_norm);
  vec3 R2 = cross(surf_norm, vSigmaX);
  float fDet = dot(vSigmaX, R1) * faceDirection;
  vec3 vGrad = sign(fDet) * (dHdxy.x * R1 + dHdxy.y * R2);
  return normalize(abs(fDet) * surf_norm - vGrad);
}
`;

export interface StoneOpts {
  color: string;
  roughness?: number;
  metalness?: number;
  bump?: number;
  map?: THREE.Texture | null;
  doubleSide?: boolean;
}

export const makeStone = ({
  color,
  roughness = 0.95,
  metalness = 0,
  bump = 10,
  map = null,
  doubleSide = false,
}: StoneOpts) => {
  const m = new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    map: map ?? undefined,
    side: doubleSide ? THREE.DoubleSide : THREE.FrontSide,
  });
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWPos;")
      .replace(
        "#include <project_vertex>",
        `#include <project_vertex>
        vec4 wp4 = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          wp4 = instanceMatrix * wp4;
        #endif
        vWPos = (modelMatrix * wp4).xyz;`
      );
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${NOISE}`)
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        diffuseColor.rgb *= stoneTone(vWPos);`
      )
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
        {
          float sh = stoneHeight(vWPos);
          normal = stoneBump(-vViewPosition, normal, vec2(dFdx(sh), dFdy(sh)) * ${bump.toFixed(1)}, faceDirection);
        }`
      );
  };
  m.customProgramCacheKey = () => `stone-v1-${bump}-${map ? "map" : "nomap"}`;
  return m;
};

// Shared palette: limestone, dark stone, satin gold.
export const stoneMat = makeStone({ color: "#cdc4b0" });
export const stoneDarkMat = makeStone({ color: "#a69d89" });
export const basaltMat = makeStone({ color: "#3b352e", bump: 12 });
// Satin (non-mirror) gold used for the lining and ornaments.
export const goldMat = makeStone({
  color: "#c9a24a",
  roughness: 0.55,
  metalness: 0.5,
  bump: 5,
});
export const bronzeMat = makeStone({
  color: "#b8923f",
  roughness: 0.6,
  metalness: 0.45,
  bump: 6,
});
