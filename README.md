# Jewook Park Portfolio

A production-grade personal portfolio built with React, TypeScript, and Vite.  
The site presents projects, experience, and interactive 3D sections, and integrates Notion-based project content through a dedicated API layer.

## Overview

This repository contains the frontend application for [jewook.dev](https://jewook.dev).  
Key goals of the project:

- Present professional experience and project history in a clean, interactive format.
- Support rich, long-form project documentation powered by Notion blocks.
- Maintain a modern, high-performance frontend architecture using Vite and React.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Animation / 3D:** Framer Motion, Three.js, React Three Fiber, Drei, GSAP
- **Content Integration:** Notion API (via external `notion-server` endpoint)
- **Utilities:** Axios, React Router

## Project Structure

```text
src/
  components/      # Reusable UI and content components
  sections/        # Page-level sections (Hero, Projects, Contact, etc.)
  hooks/           # Custom hooks (e.g., Notion block fetching)
  constants/       # Portfolio/project metadata
  types/           # Shared TypeScript types
```

## Notion Content Integration

Project entries include `pageId` values in `src/constants/index.ts`.  
Detailed Notion blocks are fetched through:

- `src/hooks/useAxios.ts`
- API pattern: `GET /page/:pageId/blocks`

Current API base used by the hook:

- `https://notion-server.jewook-dev.workers.dev`

If you want environment-based configuration, move the base URL into `import.meta.env.VITE_NOTION_API_BASE` and read it from the hook.

## Getting Started

### Prerequisites

- Node.js `>= 18.18.0`
- npm (recommended: latest stable)

### Installation

```bash
git clone https://github.com/lukasp-dev/lukas_portfolio.git
cd lukas_portfolio
npm install
```

### Run in Development

```bash
npm run dev
```

Vite will start on `5173` by default, or automatically pick another port if needed.

### Production Build

```bash
npm run build
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Type-check and build production assets
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Troubleshooting

### Missing package errors during `npm run dev`

If you see errors like:

- `Failed to resolve import "axios"`
- `Failed to resolve import "@emailjs/browser"`
- `Failed to resolve import "react-type-animation"`

run a clean install:

```bash
rm -rf node_modules
npm ci
```

If `npm ci` fails due to lockfile drift:

```bash
npm install
```

### Notion content not loading

Verify:

1. The API endpoint is reachable.
2. The `pageId` exists and is valid.
3. The Notion integration has access to the target page.

## Deployment Notes

The frontend is designed for static hosting/CDN deployment.  
Notion content delivery depends on the external API service and its availability.

## License

This project is for portfolio and demonstration purposes.  
If you plan to reuse significant parts of the codebase, please request permission.
