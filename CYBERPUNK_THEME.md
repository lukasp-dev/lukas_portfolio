# 🌃 Cyberpunk City Portfolio Theme

## Overview

A stunning cyberpunk-themed 3D portfolio built with React Three Fiber, featuring a neon-lit cityscape where buildings represent your projects.

## Features

### 🎨 Visual Design

- **Neon Aesthetics**: Vibrant cyan, magenta, and purple color scheme
- **3D City Skyline**: Procedurally generated buildings with glowing edges
- **Dynamic Lighting**: Animated neon point lights and spotlights
- **Particle Effects**: Rain particles for atmospheric depth
- **Post-Processing**: Bloom, chromatic aberration, and vignette effects
- **Starfield Background**: Animated stars for depth

### 🏗️ Interactive Elements

- **Project Buildings**: Each building represents a project
- **Hover Effects**: Buildings glow and pulse when hovered
- **Click to Explore**: Click buildings to view project details
- **Holographic UI**: Futuristic modal with project information
- **Smooth Camera**: Animated camera transitions between views

### 📱 Responsive Design

- **Mobile Optimized**: Reduced particle count and adjusted distances
- **Touch Controls**: Mobile-friendly navigation buttons
- **Adaptive Layout**: Responsive text and spacing
- **Performance**: Optimized for both desktop and mobile

### 🎮 Controls

**Desktop:**

- Click and drag to rotate the camera
- Scroll to zoom in/out
- Click buildings to view details

**Mobile:**

- Tap buildings to view details
- Use on-screen buttons for rotation and zoom
- Touch and drag to rotate

## Tech Stack

### Core

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool

### 3D Graphics

- **Three.js** - 3D rendering engine
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **@react-three/postprocessing** - Post-processing effects

### Styling & Animation

- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **GSAP** - Advanced animations

### Utilities

- **react-responsive** - Media queries in React
- **react-router-dom** - Routing

## File Structure

```
src/
├── components/
│   └── cyberpunk/
│       ├── CyberpunkCity.tsx          # Main city with buildings
│       ├── CyberpunkCamera.tsx        # Animated camera system
│       ├── NeonLights.tsx             # Dynamic lighting setup
│       ├── RainEffect.tsx             # Particle rain system
│       ├── PostProcessing.tsx         # Visual effects
│       ├── ProjectBuilding.tsx        # Interactive project buildings
│       ├── HolographicUI.tsx          # Project detail modal
│       ├── CyberpunkNavbar.tsx        # Navigation bar
│       └── MobileControls.tsx         # Mobile control buttons
├── sections/
│   └── CyberpunkScene.tsx             # Main scene component
└── index.css                          # Custom animations & styles
```

## Components

### CyberpunkCity

Generates a procedural city with randomized building heights and positions. Each building has:

- Neon-colored emissive materials
- Glowing edges using line segments
- Metallic/reflective surfaces

### NeonLights

Dynamic lighting system with:

- Animated point lights (cyan, magenta, pink)
- Directional lights for shadows
- Spotlights for dramatic effect
- Pulsing intensity for atmosphere

### ProjectBuilding

Interactive buildings that represent projects:

- Hover effects with pulsing glow
- Floating project title text
- Holographic base platform
- Click handlers for details

### HolographicUI

Futuristic modal overlay featuring:

- Glassmorphism design
- Scanline animation effect
- Gradient borders with glow
- Project images and tech stack
- Links to GitHub and live demos

### CyberpunkCamera

Smooth camera system with:

- Lerp-based movement
- Subtle floating animation
- Target-based positioning
- Smooth transitions

## Customization

### Colors

Edit the color scheme in components:

```typescript
const colors = ["#ff00ff", "#00ffff", "#ff0080", "#0080ff", "#ff00aa"];
```

### Building Density

Adjust in `CyberpunkCity.tsx`:

```typescript
const gridSize = 20; // Area size
const spacing = 8; // Distance between buildings
```

### Particle Count

Modify in `CyberpunkScene.tsx`:

```typescript
<RainEffect count={isMobile ? 1000 : 3000} />
```

### Camera Settings

Adjust in `CyberpunkScene.tsx`:

```typescript
<OrbitControls
  minDistance={20}
  maxDistance={100}
  maxPolarAngle={Math.PI / 2}
/>
```

## Performance Tips

1. **Reduce Particle Count**: Lower rain particle count for better performance
2. **Adjust Building Count**: Reduce grid size in CyberpunkCity
3. **Disable Post-Processing**: Comment out `<PostProcessing />` for mobile
4. **Lower DPR**: Change `dpr={[1, 1]}` for lower resolution rendering

## Browser Support

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari (iOS 15+)
- ⚠️ Older browsers may have limited WebGL support

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Routes

- `/` - Cyberpunk city scene (new default)
- `/old` - Classic portfolio view
- `/gallery` - Gallery section
- `/project/:projectId` - Project details

## Credits

Created by Jewook Park

- Portfolio: https://jewook.dev
- Theme: Cyberpunk City

## License

This theme is part of the portfolio project.
