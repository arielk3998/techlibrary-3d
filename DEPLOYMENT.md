# TechLibrary 3D Deployment Guide

## Prerequisites

1. GitHub account
2. Vercel account (sign up at vercel.com)
3. TechLibrary repository access

## Step 1: Prepare Your Repository

### 1.1 Create GitHub Repository

```bash
cd techlibrary-3d
git init
git add .
git commit -m "Initial commit: TechLibrary 3D knowledge graph"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/techlibrary-3d.git
git push -u origin main
```

### 1.2 Add TechLibrary Data

**Option A: Copy Local Files**

```bash
# Copy RESOURCE_MANIFEST.json
cp ../TechLibrary/RESOURCE_MANIFEST.json public/data/

# Copy COVERAGE_STATUS.json
cp ../TechLibrary/COVERAGE_STATUS.json public/data/

# Optional: Copy markdown content
mkdir -p public/techlibrary
cp -r ../TechLibrary/* public/techlibrary/
```

**Option B: Use GitHub Submodule**

```bash
git submodule add https://github.com/arielk3998/TechLibrary-Complete.git techlibrary
# Then create symlinks or build scripts to move data to public/
```

**Option C: Fetch at Runtime (Recommended for Demo)**

The app already has mock data fallback, so you can deploy without data files initially.

## Step 2: Deploy to Vercel

### 2.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### 2.2 Configure Build Settings

Vercel should auto-configure, but verify:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x or higher

### 2.3 Environment Variables (Optional)

If using GitHub API to fetch TechLibrary content:

```
GITHUB_TOKEN=your_personal_access_token
GITHUB_REPO=arielk3998/TechLibrary-Complete
NEXT_PUBLIC_API_BASE_URL=https://api.github.com
```

### 2.4 Deploy

Click "Deploy" and wait for build to complete (~2-3 minutes)

## Step 3: Configure Custom Domain

### 3.1 Add Domain in Vercel

1. Go to project Settings > Domains
2. Click "Add Domain"
3. Enter `prismwriting.com`
4. Click "Add"

### 3.2 Update DNS Records

Vercel will provide DNS instructions. Typically:

**For Apex Domain (prismwriting.com)**
- Type: A
- Name: @
- Value: 76.76.21.21 (Vercel's IP)

**For WWW Subdomain**
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

### 3.3 Verify and Wait

- Click "Verify" in Vercel
- DNS propagation takes 24-48 hours (usually faster)
- Vercel will auto-provision SSL certificate

## Step 4: Replace Existing Site

### 4.1 Update Previous Deployment

If you have an existing site on Vercel:

1. Archive old project or delete it
2. Ensure domain is released
3. Add domain to new project

### 4.2 Redirect Old Repository (Optional)

In your old `prism-writing-saas` repo, add redirect:

```javascript
// vercel.json
{
  "redirects": [
    {
      "source": "/:path*",
      "destination": "https://prismwriting.com/:path*",
      "permanent": true
    }
  ]
}
```

## Step 5: Continuous Deployment

Vercel automatically deploys on every push to `main`:

```bash
# Make changes
git add .
git commit -m "Update feature X"
git push

# Vercel will auto-deploy
```

### Preview Deployments

Every branch/PR gets a preview URL:
- Create a branch: `git checkout -b feature/new-feature`
- Push: `git push -u origin feature/new-feature`
- Open PR on GitHub
- Vercel comments with preview URL

## Step 6: Post-Deployment Verification

### 6.1 Test Functionality

- ✅ 3D graph renders correctly
- ✅ Search and filters work
- ✅ Node selection opens content panel
- ✅ Coverage dashboard displays
- ✅ Hover highlighting works
- ✅ Mobile responsive (or shows 2D fallback)

### 6.2 Performance Check

Use Vercel Analytics or Lighthouse:
- Initial load < 3s
- Interactive < 5s
- No console errors

### 6.3 SEO Check

- Title and meta tags correct
- Open Graph tags (add if needed)
- Sitemap generated (optional)

## Troubleshooting

### Build Fails

**Error: Module not found**
- Run `npm install` locally
- Commit `package-lock.json`
- Push again

**TypeScript errors**
- Run `npm run build` locally to catch errors
- Fix type issues before pushing

### 3D Graph Not Rendering

**SSR Issue**
- Verify Graph3D uses `dynamic` import with `ssr: false`
- Check browser console for WebGL errors

**Performance Issues**
- Reduce number of nodes (filter in mock data)
- Adjust force-directed layout iterations
- Enable production build optimizations

### Domain Not Working

**DNS Not Propagating**
- Wait 24-48 hours
- Check DNS with `nslookup prismwriting.com`
- Verify records in domain registrar

**SSL Certificate Issues**
- Vercel auto-provisions after DNS verification
- Can take a few hours
- Check Vercel project settings > Domains

## Optimization Tips

### 1. Add Static Data at Build Time

Create `scripts/import-techlibrary.js`:

```javascript
const fs = require('fs');
const path = require('path');

// Copy TechLibrary data
const source = '../TechLibrary/RESOURCE_MANIFEST.json';
const dest = 'public/data/RESOURCE_MANIFEST.json';
fs.copyFileSync(source, dest);
```

Add to `package.json`:
```json
{
  "scripts": {
    "prebuild": "node scripts/import-techlibrary.js",
    "build": "next build"
  }
}
```

### 2. Enable Vercel Analytics

In `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. Add Error Monitoring

Install Sentry or similar:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## Maintenance

### Regular Updates

```bash
# Update dependencies monthly
npm update
npm audit fix

# Test locally
npm run build
npm run start

# Deploy
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Monitor Performance

- Check Vercel Analytics dashboard weekly
- Monitor error rates
- Review user feedback

### Update TechLibrary Content

When TechLibrary updates:
```bash
# Pull latest
cd techlibrary
git pull origin main

# Rebuild
cd ..
npm run build

# Or let Vercel rebuild via webhook
curl -X POST https://api.vercel.com/v1/integrations/deploy/...
```

## Success Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] Site loads at Vercel URL (*.vercel.app)
- [ ] Custom domain configured
- [ ] DNS records updated
- [ ] SSL certificate active
- [ ] Site loads at prismwriting.com
- [ ] All features working
- [ ] Performance optimized
- [ ] Analytics enabled
- [ ] Documentation updated

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Support**: https://vercel.com/support
- **Community**: Vercel Discord

---

**Deployment complete!** Your TechLibrary 3D knowledge graph is now live at prismwriting.com 🚀
