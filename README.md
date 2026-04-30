# ModernPortfolio

## Overview
ModernPortfolio is a **React + TypeScript** web application built with **Vite**. It showcases a modern, responsive portfolio website with a clean UI powered by **Tailwind CSS**, **Radix UI** components, and **Framer Motion** animations. The project demonstrates best‑practice patterns for component composition, form handling, state management, and theming.

## Features
- Responsive layout with a sidebar navigation
- Dark / light mode support via `next-themes`
- Interactive UI components: accordion, dialog, tooltip, carousel, and more (Radix UI)
- Form handling with `react-hook-form` and schema validation using `zod`
- Charting via `recharts`
- Toast notifications with `sonner`
- Smooth animations with `framer-motion`
- Mobile‑first utilities (custom `use-mobile` hook)

## Tech Stack
- **Framework**: React 19, TypeScript 5.9
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS, Tailwind Animate, Tailwind Merge
- **UI Library**: Radix UI primitives
- **State & Forms**: React Hook Form, Zod, @hookform/resolvers
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Notifications**: Sonner
- **Utilities**: clsx, date‑fns, lucide‑react, embla‑carousel‑react

## Getting Started
### Prerequisites
- Node.js >= 20 (recommended LTS)
- npm (comes with Node) or Yarn/PNPM if you prefer

### Installation
```bash
# Clone the repository (if not already)
git clone <repo‑url>
cd ModernPortfolio

# Install dependencies
npm install
```

## Development
The following npm scripts are defined in `package.json`:
```json
{
  "scripts": {
    "dev": "vite",          // Start dev server with HMR
    "build": "tsc -b && vite build", // Type‑check and build for production
    "lint": "eslint .",    // Run ESLint across the codebase
    "preview": "vite preview" // Preview the production build locally
  }
}
```
### Running locally
```bash
npm run dev
```
Open `http://localhost:5173` (or the URL shown in the terminal) to see the app.

## Project Structure
```
ModernPortfolio/
├─ src/                     # Source code
│  ├─ App.tsx              # Root component with theme provider
│  ├─ main.tsx             # React entry point
│  ├─ components/ui/       # Re‑exported Radix UI primitives (accordion, dialog, …)
│  ├─ hooks/               # Custom React hooks (e.g., use-mobile)
│  ├─ lib/                 # Utility functions (utils.ts)
│  └─ index.css            # Tailwind base styles
├─ public/ (optional)      # Static assets
├─ vite.config.ts          # Vite configuration with path alias @ → src
├─ tsconfig.json           # Base TypeScript configuration
├─ tsconfig.app.json       # App‑specific TS options
├─ tsconfig.node.json      # Node‑specific TS options
├─ package.json            # Project metadata & scripts
└─ README.md               # This file
```

## Building for Production
```bash
npm run build
```
The output is generated in the `dist/` folder. You can serve it with any static‑file host (Netlify, Vercel, GitHub Pages, etc.) or preview locally using:
```bash
npm run preview
```

## Deployment Tips
- Ensure the `base` option in `vite.config.ts` matches the hosting path (default `./`).
- For GitHub Pages, set `base: '/<repo-name>/'` and push the `dist/` folder to the `gh-pages` branch.
- Use environment variables for any API keys (Vite supports `import.meta.env.VITE_...`).

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feat/awesome-feature`)
3. Make your changes, ensure lint passes (`npm run lint`)
4. Run tests / verify UI manually
5. Open a pull request with a clear description

## License
This project is licensed under the MIT License – see the `LICENSE` file for details.
# ModernPortfolio
