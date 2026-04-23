# Building Models for SimCity-Style Scene

## Overview

This directory contains 3D building models (.glb format) used in the cyberpunk portfolio scene.

## How to Add Building Models

### 1. **Find or Create Models**

#### Option A: Download Free Models

- **Sketchfab**: https://sketchfab.com/search?q=building&type=models
  - Search for "cyberpunk building", "skyscraper", "office building"
  - Filter by "Downloadable" and look for CC licenses
  - Download as GLB format

- **Poly Pizza**: https://poly.pizza/
  - Search for building models
  - Free, no attribution required

- **Quaternius**: http://quaternius.com/
  - Free low-poly models perfect for web

#### Option B: Generate with AI

- **Meshy.ai**: https://www.meshy.ai/
  - Text-to-3D generation
  - Example prompts:
    - "Cyberpunk skyscraper with neon lights"
    - "Art deco office building"
    - "Futuristic residential tower"

- **Spline AI**: https://spline.design/ai
  - Generate 3D models from text

#### Option C: Create in Blender

- Use Blender to model buildings
- Export as GLB with these settings:
  - Format: glTF Binary (.glb)
  - Include: Selected Objects
  - Transform: +Y Up
  - Geometry: Apply Modifiers, UVs, Normals
  - Compression: Enabled

### 2. **Naming Convention**

Use descriptive names:

- `skyscraper_01.glb`
- `office_building_modern.glb`
- `residential_tower_cyberpunk.glb`
- `commercial_building_neon.glb`

### 3. **Model Requirements**

- **Format**: GLB (binary glTF)
- **Size**: Keep under 5MB per model for performance
- **Scale**: Model should be roughly 1 unit = 1 meter
- **Origin**: Center bottom of building at (0, 0, 0)
- **Textures**: Embedded in GLB file
- **Polygons**: Aim for 10k-50k triangles per building

### 4. **Optimization Tips**

- Use texture atlases to reduce draw calls
- Bake lighting when possible
- Use LOD (Level of Detail) for distant buildings
- Compress textures (1024x1024 or 2048x2048 max)
- Remove unnecessary geometry (interior details not visible)

## Current Building Models

### Project Buildings (Main)

Place 8 detailed models here for your portfolio projects:

- `project_building_01.glb` - First project
- `project_building_02.glb` - Second project
- etc.

### Background Buildings (Filler)

Place 5-10 varied models for background city:

- `bg_building_01.glb`
- `bg_building_02.glb`
- etc.

## Usage in Code

Once you add models to this directory, update the scene configuration:

```typescript
// In CyberpunkScene.tsx or a config file
const buildingModels = {
  projects: [
    "/models/buildings/project_building_01.glb",
    "/models/buildings/project_building_02.glb",
    // ... more project buildings
  ],
  background: [
    "/models/buildings/bg_building_01.glb",
    "/models/buildings/bg_building_02.glb",
    // ... more background buildings
  ],
};
```

## Recommended Free Models to Start

1. **Kenney's City Kit**
   - https://kenney.nl/assets/city-kit-commercial
   - Free, no attribution required
   - Perfect for SimCity-style scenes

2. **Quaternius Ultimate Modular City**
   - http://quaternius.com/packs/ultimatemodularcity.html
   - Free low-poly buildings
   - Great for background filler

3. **Poly by Google (Archive)**
   - https://poly.pizza/
   - Thousands of free models

## Testing Your Models

After adding models:

1. Refresh the dev server
2. Check browser console for loading errors
3. Adjust scale/rotation in BuildingModel component if needed
4. Verify performance (should maintain 60fps)

## Need Help?

If models aren't loading:

- Check file path is correct
- Verify GLB format (not GLTF + bin)
- Check browser console for errors
- Ensure file size isn't too large
- Try opening GLB in https://gltf-viewer.donmccurdy.com/
