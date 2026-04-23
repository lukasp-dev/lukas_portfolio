// Building model configuration
// Add your .glb model paths here once you've added them to public/models/buildings/

export interface BuildingModelConfig {
  path: string;
  scale?: number;
  rotation?: [number, number, number];
  type: "project" | "background";
}

// Project buildings - these will display your portfolio projects
// Replace with actual model paths once you add GLB files
export const projectBuildingModels: BuildingModelConfig[] = [
  // Example: { path: '/models/buildings/project_building_01.glb', scale: 1, rotation: [0, 0, 0], type: 'project' },
  // Add 8 models here for your 8 projects
];

// Background buildings - these fill out the city
// Replace with actual model paths once you add GLB files
export const backgroundBuildingModels: BuildingModelConfig[] = [
  // Example: { path: '/models/buildings/bg_building_01.glb', scale: 0.8, rotation: [0, Math.PI / 4, 0], type: 'background' },
  // Add 5-10 varied models here
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
