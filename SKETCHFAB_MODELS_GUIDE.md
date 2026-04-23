# Finding High-Quality Cyberpunk Buildings on Sketchfab

## 🎯 Best Search Queries

### For Cyberpunk Buildings:

1. **"cyberpunk building"** - https://sketchfab.com/search?q=cyberpunk+building&type=models
2. **"sci-fi building"** - https://sketchfab.com/search?q=sci-fi+building&type=models
3. **"futuristic skyscraper"** - https://sketchfab.com/search?q=futuristic+skyscraper&type=models
4. **"neon building"** - https://sketchfab.com/search?q=neon+building&type=models
5. **"blade runner building"** - https://sketchfab.com/search?q=blade+runner+building&type=models
6. **"cyberpunk city"** - https://sketchfab.com/search?q=cyberpunk+city&type=models

### For Specific Styles:

- **"tokyo cyberpunk"** - Asian cyberpunk aesthetic
- **"dystopian building"** - Dark, gritty buildings
- **"holographic building"** - Buildings with holograms
- **"neon city"** - Neon-lit structures

## 🔍 How to Filter for Quality Models

### Step 1: Apply Filters

On Sketchfab search results, use these filters:

1. **Downloadable**: ✅ Check this box
2. **Animated**: Optional (can add life to buildings)
3. **Rigged**: Not needed for buildings
4. **PBR**: ✅ Check for better materials
5. **Face Count**: 10k - 100k (good balance)

### Step 2: Check License

Look for these licenses (in order of preference):

1. **CC Attribution** - Free, just credit the artist
2. **CC Attribution-ShareAlike** - Free, credit + share modifications
3. **CC Attribution-NoDerivs** - Free, credit, no modifications
4. **CC0 (Public Domain)** - Completely free, no attribution needed

❌ Avoid: "Standard" license (requires payment)

### Step 3: Quality Indicators

Look for models with:

- ✅ High view count (10k+)
- ✅ Many likes (100+)
- ✅ Detailed preview images
- ✅ PBR materials
- ✅ Proper textures visible
- ✅ Professional presentation

## 📥 How to Download

### Step 1: Click on Model

1. Click the model you want
2. Check the license (bottom right)
3. Look at the stats (polygon count, textures)

### Step 2: Download

1. Click **"Download 3D Model"** button
2. Select **"Autoconverted format (glTF)"**
3. Choose **"glTF Binary (.glb)"** format
4. Click Download

### Step 3: Save to Project

1. Save to: `public/models/buildings/`
2. Rename descriptively: `cyberpunk_tower_01.glb`

## 🏆 Recommended High-Quality Models

### Free Cyberpunk Buildings (Search these titles):

1. **"Cyberpunk Building"** by various artists
   - Search and filter by downloads/likes
   - Look for detailed neon signs

2. **"Sci-Fi Building"** collections
   - Often have multiple variations
   - Good for background buildings

3. **"Futuristic City Block"**
   - Complete building sets
   - Consistent style

4. **"Neon Shop"** or **"Cyberpunk Store"**
   - Great for street-level detail
   - Often have animated neon

### Artists to Follow:

- Search for artists with multiple cyberpunk models
- Check their portfolios for consistent quality
- Many offer free downloads

## 🎨 What to Look For

### Essential Features:

- ✅ **Detailed textures** (windows, signs, panels)
- ✅ **Neon elements** (signs, lights, strips)
- ✅ **Architectural detail** (not just boxes)
- ✅ **Proper scale** (check dimensions)
- ✅ **Clean geometry** (no errors)

### Bonus Features:

- 🌟 **Animated elements** (rotating signs, blinking lights)
- 🌟 **Emissive materials** (glowing neon)
- 🌟 **Multiple LODs** (performance optimization)
- 🌟 **Modular pieces** (can combine)

## 📊 Model Specifications

### Ideal Stats:

- **Vertices**: 10k - 50k per building
- **Faces**: 10k - 50k triangles
- **Textures**: 1-4 textures, 1024x1024 or 2048x2048
- **File Size**: 2-10 MB
- **Format**: GLB (binary glTF)

### Performance Considerations:

- **Project Buildings** (8 total): Can be higher detail (50k-100k polys)
- **Background Buildings** (20 total): Should be lower detail (10k-30k polys)

## 🔧 After Downloading

### Step 1: Test the Model

1. Visit: https://gltf-viewer.donmccurdy.com/
2. Drag your GLB file
3. Check:
   - Model loads correctly
   - Textures are visible
   - Scale looks reasonable
   - No missing parts

### Step 2: Add to Project

1. Place in `public/models/buildings/`
2. Update `src/constants/buildingModels.ts`:

```typescript
export const projectBuildingModels: BuildingModelConfig[] = [
  {
    path: "/models/buildings/cyberpunk_tower_01.glb",
    scale: 1,
    rotation: [0, 0, 0],
    type: "project",
  },
  // Add more...
];
```

### Step 3: Adjust in Scene

If model needs adjustment:

- **Too small**: Increase `scale` (try 2, 3, 5)
- **Too large**: Decrease `scale` (try 0.5, 0.3, 0.1)
- **Wrong orientation**: Adjust `rotation` [x, y, z]
  - Rotate 90°: `[0, Math.PI / 2, 0]`
  - Rotate 180°: `[0, Math.PI, 0]`

## 💡 Pro Tips

### Finding Hidden Gems:

1. **Sort by "Recent"** - Find new quality models
2. **Check "Staff Picks"** - Curated quality
3. **Browse by tag**: #cyberpunk #scifi #building
4. **Follow artists** - Get notified of new models

### Optimization:

1. **Use Blender** to reduce poly count if needed
2. **Compress textures** with Squoosh.app
3. **Remove unnecessary details** (interior, hidden faces)
4. **Bake lighting** for better performance

### Variety:

- Mix different styles (tall, short, wide, narrow)
- Vary colors (blue neon, pink neon, green neon)
- Different eras (retro-futuristic, ultra-modern)
- Different functions (residential, commercial, industrial)

## 🎯 Quick Start Checklist

- [ ] Search "cyberpunk building" on Sketchfab
- [ ] Filter: Downloadable + PBR
- [ ] Check license (CC Attribution preferred)
- [ ] Download 8 models for projects
- [ ] Download 5-10 models for background
- [ ] Save to `public/models/buildings/`
- [ ] Test in glTF viewer
- [ ] Update `buildingModels.ts`
- [ ] Refresh browser
- [ ] Adjust scale/rotation as needed

## 📝 Attribution

Remember to credit artists! Add to your project:

```markdown
## 3D Model Credits

Buildings by:

- [Model Name] by [Artist Name] (https://sketchfab.com/...)
- Licensed under CC Attribution
```

## 🔗 Direct Links

### Start Here:

1. **Cyberpunk Buildings**: https://sketchfab.com/search?features=downloadable&q=cyberpunk+building&type=models
2. **Sci-Fi Buildings**: https://sketchfab.com/search?features=downloadable&q=sci-fi+building&type=models
3. **Futuristic City**: https://sketchfab.com/search?features=downloadable&q=futuristic+city&type=models

### Alternative Sources:

- **Poly Pizza**: https://poly.pizza/ (Google Poly archive)
- **Kenney Assets**: https://kenney.nl/ (Free game assets)
- **Quaternius**: http://quaternius.com/ (Low-poly free models)

## 🚀 Expected Results

With high-quality Sketchfab models, your scene will have:

- ✨ Professional-looking buildings
- 🎨 Detailed textures and materials
- 💡 Proper lighting and neon effects
- 🏙️ Realistic cyberpunk atmosphere
- 🎮 SimCity-quality visuals

Good luck finding amazing models! 🎉
