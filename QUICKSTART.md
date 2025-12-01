# 🚀 Quick Start Guide

## You're Already Running!

The development server is live at: **http://localhost:3000**

## First Time Viewing

1. **Open your browser** → http://localhost:3000

2. **You'll see:**
   - Black background with 3D space
   - Colored nodes floating in 3D
   - Search bar (top-left)
   - TechLibrary 3D header (top)

3. **Try these actions:**
   - **Drag** with mouse to rotate the graph
   - **Scroll** to zoom in/out
   - **Click** any node to view its content
   - **Hover** over nodes to highlight connections
   - **Search** using the search bar
   - **Filter** by clicking the filter icon
   - **View stats** by clicking the chart icon (bottom-right)

## Node Types

- **Octahedrons** (8-sided) = Domains (Languages, DevOps, etc.)
- **Spheres** = Resources (Guides, documentation)
- **Tetrahedrons** (4-sided) = Tags (concepts, keywords)

## Colors

Each domain has a unique color:
- Red shades → Security, Languages
- Blue shades → Cloud, Networking, Desktop
- Green shades → DevOps, Standards
- Cyan → AI-ML
- Purple → Data, Distributed Systems
- Orange → Web, Performance

## Making Changes

### Edit the Graph

1. Add more nodes → `app/page.tsx` → `generateMockGraph()`
2. Change colors → `lib/graphParser.ts` → `DOMAIN_COLORS`
3. Adjust layout → `lib/graphParser.ts` → `generateNodePositions()`

### Edit UI

1. Header → `app/page.tsx` (search for "TechLibrary 3D")
2. Search bar → `components/SearchBar.tsx`
3. Content viewer → `components/ContentViewer.tsx`
4. Dashboard → `components/CoverageDashboard.tsx`

### Add Real Data

```bash
# If you have TechLibrary locally
npm run setup ../TechLibrary

# Or manually copy
cp ../TechLibrary/RESOURCE_MANIFEST.json public/data/
```

## Stopping the Server

Press `Ctrl+C` in the terminal

## Restarting

```bash
npm run dev
```

## Building for Production

```bash
npm run build
npm run start
```

## Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# 2. Go to vercel.com
# 3. Click "Import Project"
# 4. Select your repo
# 5. Click "Deploy"
```

Done! See `DEPLOYMENT.md` for detailed steps.

## Need Help?

- **Build errors?** → Check `npm install` ran successfully
- **Graph not showing?** → Check browser console (F12)
- **Want real data?** → Run `npm run setup /path/to/TechLibrary`
- **Deploy questions?** → Read `DEPLOYMENT.md`

## What's Next?

1. ✅ **Explore the demo** with mock data
2. 📊 **Add real TechLibrary data** (optional)
3. 🎨 **Customize colors/layout** (optional)
4. 🚀 **Deploy to Vercel**
5. 🌐 **Point prismwriting.com** to your deployment

---

**Enjoy your 3D knowledge graph!** 🎉
