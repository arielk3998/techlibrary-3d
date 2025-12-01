import type { GraphNode, GraphEdge, GraphData, ResourceManifestEntry } from '@/types';

// Vibrant prismatic color palette for domains - Prism Writing theme
const DOMAIN_COLORS: Record<string, string> = {
  'Languages': '#a855f7',           // Purple
  'Algorithms': '#ec4899',          // Pink
  'OperatingSystems': '#06b6d4',    // Cyan
  'Standards': '#8b5cf6',           // Violet
  'Tools': '#d946ef',               // Fuchsia
  'SystemDesign': '#0ea5e9',        // Sky Blue
  'Databases': '#6366f1',           // Indigo
  'DevOps': '#14b8a6',              // Teal
  'Security': '#f43f5e',            // Rose
  'AI-ML': '#c026d3',               // Magenta
  'Desktop': '#2dd4bf',             // Light Teal
  'Networking': '#3b82f6',          // Blue
  'Cloud': '#22d3ee',               // Bright Cyan
  'Mobile': '#e879f9',              // Pink Purple
  'Web': '#a78bfa',                 // Light Purple
  'Testing': '#06b6d4',             // Cyan
  'Performance': '#f472b6',         // Hot Pink
  'Graphics': '#818cf8',            // Periwinkle
  'Data': '#38bdf8',                // Light Blue
  'DistributedSystems': '#c084fc',  // Lavender
  'ProjectTemplates': '#fb7185',    // Pink Red
  'SoftwareEngineering': '#4ade80', // Green
  'Mathematics': '#fbbf24',         // Amber
  'Environment': '#34d399',         // Emerald
};

function getColorForDomain(domain: string): string {
  // Normalize domain name
  const normalized = domain.replace(/^\d+_/, '').replace(/-/g, '');
  return DOMAIN_COLORS[normalized] || '#e879f9'; // Default to pink purple
}

function getNodeSize(type: string): number {
  switch (type) {
    case 'domain': return 2;
    case 'resource': return 1.2;
    case 'tag': return 0.8;
    default: return 1;
  }
}

/**
 * Generate 3D positions using force-directed layout simulation
 */
function generateNodePositions(nodes: GraphNode[], edges: GraphEdge[]): GraphNode[] {
  const positionedNodes = [...nodes];
  const iterations = 150;
  const repulsion = 100;
  const attraction = 0.015;
  const damping = 0.85;

  // Initialize velocities
  const velocities = nodes.map(() => ({ x: 0, y: 0, z: 0 }));

  // Build adjacency map
  const adjacency = new Map<string, Set<string>>();
  edges.forEach(edge => {
    if (!adjacency.has(edge.source)) adjacency.set(edge.source, new Set());
    if (!adjacency.has(edge.target)) adjacency.set(edge.target, new Set());
    adjacency.get(edge.source)!.add(edge.target);
    adjacency.get(edge.target)!.add(edge.source);
  });

  // Simulation iterations
  for (let iter = 0; iter < iterations; iter++) {
    // Reset forces
    const forces = nodes.map(() => ({ x: 0, y: 0, z: 0 }));

    // Repulsion between all nodes
    for (let i = 0; i < positionedNodes.length; i++) {
      for (let j = i + 1; j < positionedNodes.length; j++) {
        const dx = positionedNodes[j].position[0] - positionedNodes[i].position[0];
        const dy = positionedNodes[j].position[1] - positionedNodes[i].position[1];
        const dz = positionedNodes[j].position[2] - positionedNodes[i].position[2];
        const distSq = dx * dx + dy * dy + dz * dz + 0.01;
        const dist = Math.sqrt(distSq);
        const force = repulsion / distSq;

        forces[i].x -= (dx / dist) * force;
        forces[i].y -= (dy / dist) * force;
        forces[i].z -= (dz / dist) * force;
        forces[j].x += (dx / dist) * force;
        forces[j].y += (dy / dist) * force;
        forces[j].z += (dz / dist) * force;
      }
    }

    // Attraction along edges
    edges.forEach(edge => {
      const sourceIdx = positionedNodes.findIndex(n => n.id === edge.source);
      const targetIdx = positionedNodes.findIndex(n => n.id === edge.target);
      if (sourceIdx === -1 || targetIdx === -1) return;

      const dx = positionedNodes[targetIdx].position[0] - positionedNodes[sourceIdx].position[0];
      const dy = positionedNodes[targetIdx].position[1] - positionedNodes[sourceIdx].position[1];
      const dz = positionedNodes[targetIdx].position[2] - positionedNodes[sourceIdx].position[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;
      const force = attraction * dist * edge.strength;

      forces[sourceIdx].x += (dx / dist) * force;
      forces[sourceIdx].y += (dy / dist) * force;
      forces[sourceIdx].z += (dz / dist) * force;
      forces[targetIdx].x -= (dx / dist) * force;
      forces[targetIdx].y -= (dy / dist) * force;
      forces[targetIdx].z -= (dz / dist) * force;
    });

    // Update positions
    positionedNodes.forEach((node, i) => {
      velocities[i].x = (velocities[i].x + forces[i].x) * damping;
      velocities[i].y = (velocities[i].y + forces[i].y) * damping;
      velocities[i].z = (velocities[i].z + forces[i].z) * damping;

      node.position[0] += velocities[i].x;
      node.position[1] += velocities[i].y;
      node.position[2] += velocities[i].z;
    });
  }

  return positionedNodes;
}

/**
 * Parse RESOURCE_MANIFEST.json and generate graph structure
 */
export function parseManifestToGraph(manifestEntries: ResourceManifestEntry[]): GraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeIds = new Set<string>();
  const tagNodes = new Set<string>();

  // Create domain nodes (unique domains)
  const domains = new Set(manifestEntries.map(e => e.domain));
  domains.forEach(domain => {
    const domainId = `domain:${domain}`;
    nodeIds.add(domainId);
    nodes.push({
      id: domainId,
      label: domain,
      type: 'domain',
      category: domain,
      position: [Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 20],
      color: getColorForDomain(domain),
      size: getNodeSize('domain'),
      metadata: { domain },
    });
  });

  // Create resource nodes
  manifestEntries.forEach(entry => {
    const resourceId = `resource:${entry.id}`;
    if (!nodeIds.has(resourceId)) {
      nodeIds.add(resourceId);
      nodes.push({
        id: resourceId,
        label: entry.title || entry.id,
        type: 'resource',
        category: entry.category,
        position: [Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 20],
        color: getColorForDomain(entry.domain),
        size: getNodeSize('resource'),
        metadata: {
          path: entry.path,
          tags: entry.tags,
          description: entry.description,
          domain: entry.domain,
        },
      });

      // Create edge from domain to resource
      const domainId = `domain:${entry.domain}`;
      edges.push({
        source: domainId,
        target: resourceId,
        type: 'hierarchy',
        strength: 1.0,
      });
    }

    // Create tag nodes and connections
    entry.tags?.forEach(tag => {
      const tagId = `tag:${tag}`;
      if (!tagNodes.has(tagId)) {
        tagNodes.add(tagId);
        nodeIds.add(tagId);
        nodes.push({
          id: tagId,
          label: tag,
          type: 'tag',
          category: 'tag',
          position: [Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 20],
          color: '#00D9FF',
          size: getNodeSize('tag'),
          metadata: { tags: [tag] },
        });
      }

      // Connect resource to tag
      edges.push({
        source: resourceId,
        target: tagId,
        type: 'tag',
        strength: 0.5,
      });
    });
  });

  // Generate positions using force-directed layout
  const positionedNodes = generateNodePositions(nodes, edges);

  return { nodes: positionedNodes, edges };
}

/**
 * Filter graph nodes based on search and filters
 */
export function filterGraph(
  graphData: GraphData,
  searchQuery: string,
  filterTags: string[],
  filterDomains: string[]
): GraphData {
  if (!searchQuery && filterTags.length === 0 && filterDomains.length === 0) {
    return graphData;
  }

  const query = searchQuery.toLowerCase();
  const filteredNodes = graphData.nodes.filter(node => {
    // Search query filter
    if (query && !node.label.toLowerCase().includes(query) && 
        !node.metadata.description?.toLowerCase().includes(query)) {
      return false;
    }

    // Tag filter
    if (filterTags.length > 0) {
      const nodeTags = node.metadata.tags || [];
      if (!filterTags.some(tag => nodeTags.includes(tag))) {
        return false;
      }
    }

    // Domain filter
    if (filterDomains.length > 0 && node.type !== 'tag') {
      if (!filterDomains.includes(node.metadata.domain || '')) {
        return false;
      }
    }

    return true;
  });

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = graphData.edges.filter(
    edge => filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
  );

  return { nodes: filteredNodes, edges: filteredEdges };
}

/**
 * Get connected nodes for highlighting
 */
export function getConnectedNodes(nodeId: string, graphData: GraphData): string[] {
  const connected = new Set<string>([nodeId]);
  
  graphData.edges.forEach(edge => {
    if (edge.source === nodeId) connected.add(edge.target);
    if (edge.target === nodeId) connected.add(edge.source);
  });

  return Array.from(connected);
}
