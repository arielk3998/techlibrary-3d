/**
 * Obsidian to TechLibrary 3D Data Importer
 * Converts Obsidian vault markdown files and canvas files into graph data
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuration
const OBSIDIAN_VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH || 'C:\\Users\\YourUsername\\Documents\\Obsidian Vault';
const OUTPUT_DIR = path.join(__dirname, '../public/data');

/**
 * Parse Obsidian canvas file (.canvas)
 * Canvas files contain nodes and edges in JSON format
 */
function parseCanvasFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const canvasData = JSON.parse(content);
  
  const nodes = [];
  const edges = [];
  
  // Process canvas nodes
  canvasData.nodes?.forEach(node => {
    nodes.push({
      id: node.id,
      label: node.text || node.file || 'Untitled',
      type: node.type === 'file' ? 'resource' : node.type === 'text' ? 'concept' : 'domain',
      position: [
        (node.x - 500) / 50, // Normalize coordinates to 3D space
        (node.y - 500) / 50,
        Math.random() * 10 - 5
      ],
      category: node.color || 'default',
      color: getColorFromCanvasColor(node.color),
      size: node.width > 400 ? 2 : 1.2,
      metadata: {
        originalId: node.id,
        width: node.width,
        height: node.height,
        file: node.file,
        text: node.text
      }
    });
  });
  
  // Process canvas edges
  canvasData.edges?.forEach(edge => {
    edges.push({
      source: edge.fromNode,
      target: edge.toNode,
      type: edge.label ? 'labeled' : 'reference',
      strength: 1.0,
      label: edge.label
    });
  });
  
  return { nodes, edges };
}

/**
 * Parse markdown files from Obsidian vault
 */
function parseMarkdownFiles(vaultPath) {
  const resources = [];
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.')) {
        try {
          walkDir(filePath);
        } catch (err) {
          console.warn(`⚠️  Skipping directory ${file}: ${err.message}`);
        }
      } else if (file.endsWith('.md')) {
        try {
          const relativePath = path.relative(vaultPath, filePath);
          const content = fs.readFileSync(filePath, 'utf-8');
          const parsed = matter(content);
          
          // Extract frontmatter and content
          const title = parsed.data.title || file.replace('.md', '');
          const tags = parsed.data.tags || extractHashtags(parsed.content);
          const category = parsed.data.category || getCategoryFromPath(relativePath);
          
          resources.push({
            id: generateId(relativePath),
            title,
            category,
            domain: getDomainFromPath(relativePath),
            path: relativePath,
            tags,
            type: 'resource',
            description: parsed.data.description || extractFirstParagraph(parsed.content)
          });
        } catch (err) {
          console.warn(`⚠️  Skipping file ${file}: ${err.message}`);
        }
      }
    });
  }
  
  walkDir(vaultPath);
  return resources;
}

/**
 * Extract wikilinks and create connections
 */
function extractWikilinks(content) {
  const wikilinkRegex = /\[\[([^\]]+)\]\]/g;
  const matches = [];
  let match;
  
  while ((match = wikilinkRegex.exec(content)) !== null) {
    matches.push(match[1].split('|')[0]); // Handle aliased links
  }
  
  return matches;
}

/**
 * Extract hashtags from content
 */
function extractHashtags(content) {
  const hashtagRegex = /#([a-zA-Z0-9_-]+)/g;
  const tags = new Set();
  let match;
  
  while ((match = hashtagRegex.exec(content)) !== null) {
    tags.add(match[1]);
  }
  
  return Array.from(tags);
}

/**
 * Extract first paragraph for description
 */
function extractFirstParagraph(content) {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---')) {
      return trimmed.substring(0, 200);
    }
  }
  return '';
}

/**
 * Map Obsidian canvas colors to hex
 */
function getColorFromCanvasColor(color) {
  const colorMap = {
    '1': '#FF6B6B', // Red
    '2': '#4ECDC4', // Cyan
    '3': '#45B7D1', // Blue
    '4': '#96CEB4', // Green
    '5': '#FFEAA7', // Yellow
    '6': '#DDA15E', // Orange
  };
  return colorMap[color] || '#888888';
}

/**
 * Generate resource ID from path
 */
function generateId(filePath) {
  return filePath
    .replace(/\\/g, '/')
    .replace(/\.md$/, '')
    .replace(/[^a-zA-Z0-9/-]/g, '-')
    .toUpperCase();
}

/**
 * Get domain from folder structure
 */
function getDomainFromPath(filePath) {
  const parts = filePath.split(path.sep);
  return parts[0] || 'General';
}

/**
 * Get category from path
 */
function getCategoryFromPath(filePath) {
  const parts = filePath.split(path.sep);
  return parts[1] || parts[0] || 'general';
}

/**
 * Main import function
 */
async function importObsidianData(options = {}) {
  const vaultPath = options.vaultPath || OBSIDIAN_VAULT_PATH;
  const canvasFile = options.canvasFile;
  
  console.log('🔍 Importing from Obsidian vault:', vaultPath);
  
  let graphData = { nodes: [], edges: [] };
  
  // Import from canvas file if provided
  if (canvasFile) {
    const fullCanvasPath = path.isAbsolute(canvasFile) 
      ? canvasFile 
      : path.join(vaultPath, canvasFile);
      
    if (fs.existsSync(fullCanvasPath)) {
      console.log('📊 Parsing canvas file:', fullCanvasPath);
      try {
        graphData = parseCanvasFile(fullCanvasPath);
        console.log(`✅ Found ${graphData.nodes.length} nodes and ${graphData.edges.length} edges`);
      } catch (err) {
        console.error('❌ Error parsing canvas:', err.message);
      }
    } else {
      console.warn('⚠️  Canvas file not found:', fullCanvasPath);
    }
  }
  
  // Import markdown files
  if (fs.existsSync(vaultPath)) {
    console.log('📝 Scanning markdown files...');
    try {
      const resources = parseMarkdownFiles(vaultPath);
      console.log(`✅ Found ${resources.length} markdown files`);
      
      // Save resources as manifest
      if (resources.length > 0) {
        const manifestPath = path.join(OUTPUT_DIR, 'RESOURCE_MANIFEST.json');
        fs.writeFileSync(manifestPath, JSON.stringify(resources, null, 2));
        console.log('💾 Saved RESOURCE_MANIFEST.json');
      }
    } catch (err) {
      console.warn('⚠️  Error scanning markdown files:', err.message);
    }
  } else {
    console.warn('⚠️  Vault path not found:', vaultPath);
  }
  
  // Save graph data if from canvas
  if (graphData.nodes.length > 0) {
    const graphPath = path.join(OUTPUT_DIR, 'GRAPH_DATA.json');
    fs.writeFileSync(graphPath, JSON.stringify(graphData, null, 2));
    console.log('💾 Saved GRAPH_DATA.json');
  }
  
  console.log('✨ Import complete!');
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const vaultPath = args[0];
  const canvasFile = args[1];
  
  if (!vaultPath) {
    console.log(`
📖 Obsidian to TechLibrary 3D Importer

Usage:
  node scripts/import-obsidian.js <vault-path> [canvas-file]

Examples:
  node scripts/import-obsidian.js "C:\\Users\\You\\Documents\\Obsidian Vault"
  node scripts/import-obsidian.js "C:\\Users\\You\\Documents\\Obsidian Vault" "Public/Today's Global Political Environment.canvas"

Environment Variables:
  OBSIDIAN_VAULT_PATH - Default vault path

The script will:
  1. Parse canvas files (.canvas) for nodes and edges
  2. Scan markdown files (.md) for content
  3. Extract tags, links, and metadata
  4. Generate RESOURCE_MANIFEST.json
  5. Generate GRAPH_DATA.json (if canvas provided)
    `);
    process.exit(1);
  }
  
  importObsidianData({ vaultPath, canvasFile })
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Error:', err);
      process.exit(1);
    });
}

module.exports = { importObsidianData, parseCanvasFile, parseMarkdownFiles };
