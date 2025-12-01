# TechLibrary 3D - Interactive Knowledge Graph

A modern, interactive 3D knowledge graph visualization that displays the complete TechLibrary repository as an explorable 3D graph with 23 technical domains and 300+ resources.

![TechLibrary 3D](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![React Three Fiber](https://img.shields.io/badge/React%20Three%20Fiber-3D-orange?style=flat)

## Features

- **🎨 Interactive 3D Visualization**: Explore knowledge as an immersive 3D graph
- **🔍 Advanced Search & Filtering**: Find nodes by domain, tags, or keywords
- **📖 Markdown Content Viewer**: Read guides and documentation in-context
- **📊 Coverage Dashboard**: Track 100% completion across all 23 domains
- **🎯 Smart Highlighting**: Hover to see connections and relationships
- **⚡ High Performance**: Lazy loading and optimized rendering

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **3D Graphics**: React Three Fiber + Drei
- **UI Components**: Tailwind CSS + Framer Motion
- **State Management**: Zustand
- **Markdown**: react-markdown + remark/rehype
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd techlibrary-3d
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
techlibrary-3d/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   └── content/         # Content loading endpoint
│   ├── page.tsx             # Main page component
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── Graph3D.tsx          # 3D graph visualization
│   ├── ContentViewer.tsx    # Markdown content panel
│   ├── SearchBar.tsx        # Search and filter UI
│   └── CoverageDashboard.tsx # Coverage metrics
├── lib/                     # Utilities
│   ├── graphParser.ts       # Graph data processing
│   └── dataLoader.ts        # Data loading utilities
├── store/                   # State management
│   └── useGraphStore.ts     # Zustand store
├── types/                   # TypeScript definitions
│   └── index.ts             # Type definitions
└── public/                  # Static assets
    └── data/                # Data files
        ├── RESOURCE_MANIFEST.json
        └── COVERAGE_STATUS.json
```

## Data Integration

### Using Real TechLibrary Data

To integrate your actual TechLibrary repository:

1. **Copy data files** to `public/data/`:
   - `RESOURCE_MANIFEST.json`
   - `COVERAGE_STATUS.json`

2. **Copy markdown content** to `public/techlibrary/` (maintaining folder structure)

3. **Alternative: GitHub API Integration**
   
   Update `lib/dataLoader.ts` to fetch from GitHub:
   ```typescript
   const response = await fetch(
     `https://api.github.com/repos/arielk3998/TechLibrary-Complete/contents/${path}`
   );
   ```

4. **Build-time Integration**
   
   Use Next.js build scripts to clone and process TechLibrary at build time

## Controls

- **Rotate**: Click and drag
- **Zoom**: Scroll wheel
- **Select Node**: Click on any node
- **Highlight Connections**: Hover over nodes
- **Search**: Use the search bar (top-left)
- **Filter**: Click filter icon to filter by domain/tags
- **View Content**: Click nodes to open content panel
- **Coverage**: Click chart icon (bottom-right)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import the project in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Configure:
     - Framework: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. Deploy!

### Custom Domain

To replace prismwriting.com:

1. In Vercel project settings, go to "Domains"
2. Add `prismwriting.com`
3. Update DNS records as instructed
4. Wait for DNS propagation

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

---

**Created for TechLibrary** - A comprehensive technical knowledge repository with 23 domains at 100% coverage.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
