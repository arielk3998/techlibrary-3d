# Prism Writing Debug Guide

## Overview
This guide explains the comprehensive debugging and monitoring system built into Prism Writing's knowledge graph application.

## Loading Tracker

### Visual Feedback System
The application includes a full-screen loading tracker inspired by prismwriting.com that displays:
- **Real-time progress**: Step-by-step loading status with checkmarks
- **Elapsed time**: Live timer showing time since initialization
- **Error detection**: Red alerts for any loading failures
- **Auto-dismissal**: Tracker hides 2 seconds after successful load

### Loading Steps Tracked
1. **Initializing application** - React app mount and setup
2. **Loading theme system** - Theme detection and application
3. **Setting up state management** - Zustand store initialization
4. **Loading graph data** - Fetching GRAPH_DATA.json from public folder
5. **Parsing node categories** - Applying color rules and categorization
6. **Calculating graph layout** - Force-directed positioning
7. **Rendering visualization** - Canvas/Three.js rendering

### Visual States
- 🔵 **Pending** - Gray circle, step not started
- 🔄 **Loading** - Cyan spinner, step in progress
- ✅ **Success** - Green checkmark, step completed
- ❌ **Error** - Red alert icon, step failed

## Console Logging System

### PrismLogger Utility
Located in `lib/logger.ts`, provides color-coded console output:

```typescript
import { logger } from '@/lib/logger';

// Usage examples
logger.info('Loading data...');        // Cyan text
logger.success('Data loaded');         // Green text
logger.warn('Fallback to mock data');  // Yellow text
logger.error('Failed to load');        // Red text
logger.debug('Debug information');     // Purple text
```

### Log Format
All logs follow this pattern:
```
[PRISM +1.234s] ✓ Message content
```
- `PRISM` - Application identifier
- `+1.234s` - Elapsed time since app start
- Symbol - Status indicator (✓ ✗ ⚠ 🔍)
- Color-coded text based on log level

### Access Logs Programmatically
```javascript
// In browser console
window.prismLogger.getLogs()  // Get all logs
window.prismLogger.summary()  // View summary
window.prismLogger.clear()    // Clear logs
```

## Debugging White Screen Issues

### Check Loading Tracker
1. Refresh the page
2. Watch the loading tracker - which step fails?
3. Common failures:
   - **Theme**: Check `document.documentElement.getAttribute('data-theme')`
   - **Data**: Verify `/data/GRAPH_DATA.json` exists and is valid JSON
   - **Render**: Look for Three.js errors in console

### Console Investigation
Open browser DevTools (F12) and look for:

```javascript
// Expected successful log sequence
[PRISM +0.123s] Starting data load...
[PRISM +0.245s] Fetching graph data...
[PRISM +0.389s] ✓ Graph data fetched successfully
[PRISM +0.412s] Loaded real Obsidian data: 61 nodes, 60 edges
[PRISM +0.445s] Enhancing nodes with color rules...
[PRISM +0.789s] ✓ Setting enhanced graph data
[PRISM +0.802s] ✓ Data load complete
[PRISM +2.850s] ✓ Graph data loaded, hiding tracker in 2s
```

### Common Error Patterns

#### Error: Graph data not found
```
[PRISM +0.234s] ⚠ No graph data found, trying manifest...
```
**Fix**: Run `node scripts/import-obsidian.js` to regenerate data

#### Error: Theme not applied
```
[PRISM +0.156s] ✗ Theme not applied
```
**Fix**: Check `app/globals.css` has `[data-theme="dark"]` and `[data-theme="light"]`

#### Error: Canvas not rendering
```
[PRISM +1.234s] Rendering visualization...
(hangs - no success message)
```
**Fix**: Check browser console for Three.js errors, verify WebGL support

### Enable Verbose Logging
To see even more detailed logs:

```javascript
// Add to app/page.tsx at top
if (typeof window !== 'undefined') {
  window.localStorage.setItem('prism-debug', 'true');
}
```

Then check for additional debug messages in purple.

## Performance Monitoring

### Loading Time Analysis
```javascript
// View loading summary
window.prismLogger.summary()

// Output:
// [PRISM] Loading Summary
// Total logs: 15
// Errors: 0
// Warnings: 0
// Success: 7
// Total time: 2.45s
```

### Benchmark Targets
- **Initial load**: < 3 seconds
- **Data fetch**: < 500ms
- **Theme apply**: < 100ms
- **First render**: < 1 second

### Slow Loading Checklist
1. Check network tab - is GRAPH_DATA.json large?
2. Count nodes - performance degrades above 200 nodes
3. Check for console errors slowing React
4. Verify no infinite re-render loops

## Testing the Debug System

### Manual Test
1. Open `http://localhost:3000`
2. Open DevTools Console (F12)
3. Refresh page
4. You should see:
   - Loading tracker with animated progress
   - Color-coded console logs
   - Auto-dismissal after 2 seconds
   - Green checkmarks for all steps

### Simulate Errors
```typescript
// In app/page.tsx, add intentional error
const loadData = async () => {
  throw new Error('Test error');  // Force error
  ...
}
```

You should see:
- Red error in console
- Loading tracker shows error state
- Reload button appears

## Integration with Monitoring Tools

### Sentry Integration (Future)
```typescript
// lib/logger.ts
import * as Sentry from '@sentry/nextjs';

error(message: string, ...data: any[]) {
  Sentry.captureMessage(message, {
    level: 'error',
    extra: { data }
  });
  // ... existing code
}
```

### Analytics Integration (Future)
```typescript
// Track loading performance
useEffect(() => {
  if (!isLoading && graphData) {
    analytics.track('Graph Loaded', {
      nodeCount: graphData.nodes.length,
      loadTime: Date.now() - startTime
    });
  }
}, [isLoading, graphData]);
```

## Troubleshooting Guide

### Problem: White screen, no loading tracker
**Cause**: JavaScript error before React renders
**Fix**: Check browser console for syntax errors

### Problem: Loading tracker stuck on one step
**Cause**: Step failed silently
**Fix**: Check console logs for that specific step

### Problem: Tracker shows success but white screen
**Cause**: Rendering issue after data loads
**Fix**: Check theme CSS, verify canvas element exists

### Problem: Too many console logs
**Cause**: Hot reload in dev mode
**Fix**: Normal behavior, logs reset on full refresh

### Problem: Logger not accessible in console
**Cause**: Production build or SSR
**Fix**: Use in browser only, after client-side hydration

## Best Practices

1. **Always check console first** - Color-coded logs tell the story
2. **Watch the loading tracker** - Visual feedback is faster than logs
3. **Use logger.summary()** - Quick overview of entire load sequence
4. **Test with DevTools open** - Catch errors immediately
5. **Monitor network tab** - Verify data files load correctly

## Next Steps

For production deployment:
1. Consider integrating Sentry for error tracking
2. Add performance monitoring (Web Vitals)
3. Implement user analytics
4. Add logging levels (development vs production)
5. Create automated health checks

---

**Need Help?**
- Check console logs with `window.prismLogger.getLogs()`
- View summary with `window.prismLogger.summary()`
- Look for red errors in loading tracker
- Search Discord/GitHub issues for similar problems
