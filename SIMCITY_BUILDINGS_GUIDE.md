# SimCity-Style Building Setup Guide

## 🏗️ Overview

Your cyberpunk portfolio now supports **3D building models** in GLB format! The system automatically uses models when available, otherwise falls back to procedural buildings.

## 📁 Current Status

✅ **Isometric camera** - SimCity-style 45° view
✅ **Grid-based city layout** - Organized blocks with roads
✅ **Road system** - Streets, sidewalks, markings, street lights
✅ **Model loading system** - Ready to use GLB files
✅ **Fallback system** - Procedural buildings work until you add models

## 🎯 Quick Start: Adding Building Models

### Step 1: Get Building Models

Choose one of these options:

#### Option A: Download Free Models (Easiest)

1. Visit **Sketchfab**: https://sketchfab.com/
   - Search: "cyberpunk building" or "skyscraper"
   - Filter: Downloadable, Free
   - Download as GLB format

2. Visit **Poly Pizza**: https://poly.pizza/
   - Search: "building"
   - Download directly as GLB

3. Visit **Kenney Assets**: https://kenney.nl/assets/city-kit-commercial
   - Free city building pack
   - Convert to GLB if needed

#### Option B: Generate with AI

1. **Meshy.ai** (https://www.meshy.ai/)

   ```
   Prompts to try:
   - "Cyberpunk skyscraper with neon lights and holographic billboards"
   - "Futuristic art deco office building with glass facade"
   - "Neon-lit residential tower in blade runner style"
   ```

2. **Spline AI** (https://spline.design/ai)
   - Generate and export as GLB

#### Option C: Use Existing Models

Check if you have any building models in:

- `public/models/` directory
- Other projects
- Asset libraries

### Step 2: Add Models to Project

1. Place GLB files in: `public/models/buildings/`

   ```
   public/models/buildings/
   ├── project_building_01.glb
   ├── project_building_02.glb
   ├── ...
   ├── bg_building_01.glb
   └── bg_building_02.glb
   ```

2. Name them descriptively:
   - `project_building_XX.glb` - For your 8 portfolio projects
   - `bg_building_XX.glb` - For background city buildings

### Step 3: Configure Models

Edit `src/constants/buildingModels.ts`:

```typescript
export const projectBuildingModels: BuildingModelConfig[] = [
  {
    path: "/models/buildings/project_building_01.glb",
    scale: 1,
    rotation: [0, 0, 0],
    type: "project",
  },
  {
    path: "/models/buildings/project_building_02.glb",
    scale: 1.2,
    rotation: [0, Math.PI / 4, 0],
    type: "project",
  },
  // Add 8 total (one for each project)
];

export const backgroundBuildingModels: BuildingModelConfig[] = [
  {
    path: "/models/buildings/bg_building_01.glb",
    scale: 0.8,
    rotation: [0, 0, 0],
    type: "background",
  },
  {
    path: "/models/buildings/bg_building_02.glb",
    scale: 0.9,
    rotation: [0, Math.PI / 2, 0],
    type: "background",
  },
  // Add 5-10 varied models
];
```

### Step 4: Test

1. Refresh your browser
2. Buildings should now use your models!
3. Check console for any loading errors

## 🎨 Model Requirements

### Technical Specs

- **Format**: GLB (binary glTF)
- **Size**: Under 5MB per model
- **Polygons**: 10k-50k triangles recommended
- **Textures**: Embedded in GLB, max 2048x2048
- **Scale**: 1 unit = 1 meter (adjust with `scale` parameter)
- **Origin**: Center bottom at (0, 0, 0)

### Visual Style

For best SimCity-style results:

- **Detailed facades** with window patterns
- **Architectural features** (setbacks, terraces, decorative elements)
- **Rooftop details** (helipads, antennas, AC units)
- **Cyberpunk elements** (neon signs, LED strips, holographic ads)

## 🔧 Adjusting Models

If models don't look right:

### Scale Issues

```typescript
// Model too small
{ path: '/models/buildings/building.glb', scale: 2 }

// Model too large
{ path: '/models/buildings/building.glb', scale: 0.5 }
```

### Rotation Issues

```typescript
// Rotate 90 degrees
{ path: '/models/buildings/building.glb', rotation: [0, Math.PI / 2, 0] }

// Rotate 180 degrees
{ path: '/models/buildings/building.glb', rotation: [0, Math.PI, 0] }
```

### Position Issues

Models should have origin at ground level. If floating/buried:

- Re-export from Blender with correct origin
- Or adjust in BuildingModel component

## 📊 Performance Tips

### Optimization

1. **Use texture atlases** - Combine textures into one
2. **Compress textures** - Use tools like Squoosh.app
3. **Reduce polygons** - Decimate in Blender if needed
4. **Remove hidden geometry** - Delete interior details
5. **Use LOD** - Lower detail for distant buildings

### Testing Performance

- Open browser DevTools
- Check FPS (should be 60fps)
- Monitor memory usage
- Test on mobile devices

## 🎮 Current Features

### Interactive

- ✅ Click buildings to view projects
- ✅ Hover for glow effects
- ✅ Holographic UI overlays
- ✅ Smooth camera controls

### Visual Effects

- ✅ Neon lighting
- ✅ Rain particles
- ✅ Street lights
- ✅ Cyberpunk materials
- ✅ Shadows and reflections

### Layout

- ✅ 3x3 grid of project buildings
- ✅ 20 background filler buildings
- ✅ Road network with markings
- ✅ Sidewalks and street lights

## 🚀 Next Steps

### Immediate

1. Add 8 project building models
2. Add 5-10 background building models
3. Test and adjust scales/rotations
4. Optimize if needed

### Future Enhancements

- Add animated elements (rotating signs, moving lights)
- Add more building variety
- Implement building LOD system
- Add weather effects (fog, different lighting)
- Add traffic/vehicles on roads

## 🆘 Troubleshooting

### Models Not Loading

- Check file path is correct
- Verify GLB format (not GLTF + bin)
- Check browser console for errors
- Test GLB at https://gltf-viewer.donmccurdy.com/

### Performance Issues

- Reduce model polygon count
- Compress textures
- Use fewer background buildings
- Reduce rain particle count

### Visual Issues

- Adjust scale parameter
- Check model origin point
- Verify textures are embedded
- Test lighting in scene

## 📚 Resources

### Free 3D Models

- Sketchfab: https://sketchfab.com/
- Poly Pizza: https://poly.pizza/
- Kenney: https://kenney.nl/
- Quaternius: http://quaternius.com/

### AI Generation

- Meshy.ai: https://www.meshy.ai/
- Spline AI: https://spline.design/ai

### Tools

- Blender: https://www.blender.org/ (3D modeling)
- glTF Viewer: https://gltf-viewer.donmccurdy.com/ (test models)
- Squoosh: https://squoosh.app/ (compress textures)

## 💡 Tips for Best Results

1. **Start with 2-3 models** to test the system
2. **Use varied building heights** for interesting skyline
3. **Mix architectural styles** for visual diversity
4. **Add cyberpunk details** (neon, holograms, LED strips)
5. **Test on mobile** to ensure performance
6. **Iterate and refine** based on visual results

---

**Current Mode**: Procedural buildings (will switch to models once you add GLB files)

**Ready to use models?** Just add GLB files and update the config!
