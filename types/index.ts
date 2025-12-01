// Core data types for TechLibrary 3D Graph

export interface ResourceManifestEntry {
  id: string;
  title: string;
  category: string;
  domain: string;
  path: string;
  tags: string[];
  type: 'domain' | 'resource' | 'guide' | 'readme' | 'rule';
  description?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'domain' | 'resource' | 'tag' | 'concept';
  category: string;
  position: [number, number, number];
  color: string;
  size: number;
  metadata: {
    path?: string;
    tags?: string[];
    description?: string;
    domain?: string;
    categoryDescription?: string;
    originalLabel?: string;
    connectionCount?: number;
  };
}

export interface GraphEdge {
  source: string;
  target: string;
  type: 'hierarchy' | 'reference' | 'tag' | 'category';
  strength: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface CoverageData {
  domain: string;
  coverage: number;
  totalResources: number;
  completedResources: number;
}

export interface ViewState {
  mode: '3d' | '2d';
  selectedNode: string | null;
  highlightedNodes: string[];
  searchQuery: string;
  filterTags: string[];
  filterDomains: string[];
}

export interface MarkdownContent {
  content: string;
  title?: string;
  path?: string;
  metadata?: Record<string, any>;
  frontmatter?: {
    title: string;
    category: string;
    type: string;
  };
}
