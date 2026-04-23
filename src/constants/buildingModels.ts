// Building model configuration
// Add your .glb model paths here once you've added them to public/models/buildings/

export interface BuildingModelConfig {
  path: string;
  scale?: number;
  rotation?: [number, number, number];
  type: "project" | "background";
  lod?: {
    near?: string;
    mid?: string;
    far?: string;
    switchDistance?: [number, number];
  };
  materialVariant?: {
    emissiveBoost?: number;
    hueShift?: number;
    saturation?: number;
  };
}

// Project buildings - these will display your portfolio projects
// Replace with actual model paths once you add GLB files
export const projectBuildingModels: BuildingModelConfig[] = [
  // Example:
  // {
  //   path: "/models/buildings/project_hq_tower.glb",
  //   scale: 1.05,
  //   rotation: [0, 0, 0],
  //   type: "project",
  //   lod: {
  //     near: "/models/buildings/lod/project_hq_tower_lod0.glb",
  //     mid: "/models/buildings/lod/project_hq_tower_lod1.glb",
  //     far: "/models/buildings/lod/project_hq_tower_lod2.glb",
  //     switchDistance: [45, 95],
  //   },
  //   materialVariant: {
  //     emissiveBoost: 0.2,
  //     hueShift: 0.01,
  //     saturation: 1.0,
  //   },
  // },
  // Add 8 models here for your 8 projects
];

// Background buildings - these fill out the city
// Replace with actual model paths once you add GLB files
export const backgroundBuildingModels: BuildingModelConfig[] = [
  // Example:
  // {
  //   path: "/models/buildings/bg_midrise_01.glb",
  //   scale: 0.9,
  //   rotation: [0, Math.PI / 4, 0],
  //   type: "background",
  //   lod: { switchDistance: [35, 80] },
  //   materialVariant: { hueShift: -0.02, saturation: 0.9 },
  // },
  // Add 5-10 varied models here
];

// Optional reference presets for quick setup.
// Keep these separate from active arrays so the app can stay in procedural mode
// until GLB files are actually present in public/models/buildings.
export const simcityProjectModelPresets: BuildingModelConfig[] = [
  {
    path: "/models/buildings/project_hq_tower.glb",
    scale: 1.05,
    rotation: [0, 0, 0],
    type: "project",
    lod: { switchDistance: [45, 95] },
    materialVariant: { emissiveBoost: 0.25, hueShift: 0, saturation: 1.0 },
  },
  {
    path: "/models/buildings/project_terrace_office.glb",
    scale: 0.95,
    rotation: [0, Math.PI / 2, 0],
    type: "project",
    lod: { switchDistance: [40, 90] },
    materialVariant: { emissiveBoost: 0.2, hueShift: 0.02, saturation: 0.95 },
  },
  {
    path: "/models/buildings/project_datacenter.glb",
    scale: 1.1,
    rotation: [0, Math.PI, 0],
    type: "project",
    lod: { switchDistance: [45, 100] },
    materialVariant: { emissiveBoost: 0.15, hueShift: -0.02, saturation: 0.9 },
  },
];

export const simcityBackgroundModelPresets: BuildingModelConfig[] = [
  {
    path: "/models/buildings/bg_lowrise_01.glb",
    scale: 0.8,
    rotation: [0, 0, 0],
    type: "background",
    lod: { switchDistance: [30, 70] },
  },
  {
    path: "/models/buildings/bg_midrise_01.glb",
    scale: 0.95,
    rotation: [0, Math.PI / 2, 0],
    type: "background",
    lod: { switchDistance: [35, 80] },
  },
  {
    path: "/models/buildings/bg_highrise_01.glb",
    scale: 1.1,
    rotation: [0, Math.PI, 0],
    type: "background",
    lod: { switchDistance: [40, 90] },
  },
];

// Fallback to procedural buildings if no models are configured
export const useProceduralBuildings =
  projectBuildingModels.length === 0 && backgroundBuildingModels.length === 0;

// Helper to get a random background building model
export const getRandomBackgroundModel = (): BuildingModelConfig | null => {
  if (backgroundBuildingModels.length === 0) return null;
  return backgroundBuildingModels[
    Math.floor(Math.random() * backgroundBuildingModels.length)
  ];
};

// Helper to get project building model by index
export const getProjectBuildingModel = (
  index: number,
): BuildingModelConfig | null => {
  if (index >= projectBuildingModels.length) return null;
  return projectBuildingModels[index];
};
