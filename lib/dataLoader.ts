import matter from 'gray-matter';
import type { MarkdownContent } from '@/types';

/**
 * Load markdown content from a file path
 * In production, this would read from the TechLibrary repo
 */
export async function loadMarkdownContent(path: string): Promise<MarkdownContent | null> {
  try {
    // In a real implementation, this would fetch from the TechLibrary repo
    // For now, we'll create a placeholder system
    
    // You can either:
    // 1. Copy TechLibrary files to public/techlibrary/
    // 2. Fetch from GitHub API
    // 3. Use a build-time script to import all files
    
    const response = await fetch(`/api/content?path=${encodeURIComponent(path)}`);
    if (!response.ok) {
      throw new Error('Failed to load content');
    }

    const text = await response.text();
    const { data, content } = matter(text);

    return {
      content,
      title: data.title || path.split('/').pop() || 'Untitled',
      path,
      metadata: data,
    };
  } catch (error) {
    console.error('Error loading markdown:', error);
    return null;
  }
}

/**
 * Load and parse RESOURCE_MANIFEST.json
 */
export async function loadResourceManifest() {
  try {
    const response = await fetch('/data/RESOURCE_MANIFEST.json');
    if (!response.ok) {
      throw new Error('Failed to load resource manifest');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading manifest:', error);
    return [];
  }
}

/**
 * Load coverage status data
 */
export async function loadCoverageStatus() {
  try {
    const response = await fetch('/data/COVERAGE_STATUS.json');
    if (!response.ok) {
      throw new Error('Failed to load coverage status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading coverage status:', error);
    return null;
  }
}
