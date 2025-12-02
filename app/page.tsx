'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, Box, Sun, Moon } from 'lucide-react';
import { useGraphStore } from '@/store/useGraphStore';
import SearchBar from '@/components/SearchBar';
import ContentViewer from '@/components/ContentViewer';
import CoverageDashboard from '@/components/CoverageDashboard';
import PositionEditor from '@/components/PositionEditor';
import LoadingTracker from '@/components/LoadingTracker';
import { loadResourceManifest } from '@/lib/dataLoader';
import { parseManifestToGraph, filterGraph } from '@/lib/graphParser';
import { categorizeNode, formatNodeLabel, calculateNodeSize } from '@/lib/nodeColoringRules';
import { logger } from '@/lib/logger';
import type { ResourceManifestEntry, GraphData } from '@/types';

// Dynamically import Graph3D to avoid SSR issues with Three.js
const Graph3D = dynamic(() => import('@/components/Graph3D'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-black">
      <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
    </div>
  ),
});

const Graph2D = dynamic(() => import('@/components/Graph2D'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-black">
      <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
    </div>
  ),
});

export default function Home() {
  const {
    graphData,
    setGraphData,
    searchQuery,
    filterTags,
    filterDomains,
    mode,
    setMode,
    isLoading,
    setLoading,
    theme,
    setTheme,
  } = useGraphStore();

  const [error, setError] = useState<string | null>(null);
  const [showLoadingTracker, setShowLoadingTracker] = useState(false);

  // Apply theme to document
  useEffect(() => {
    logger.info('Setting theme:', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Control loading tracker visibility
  useEffect(() => {
    if (isLoading) {
      setShowLoadingTracker(true);
    } else if (graphData) {
      logger.success('Graph data loaded, hiding tracker immediately');
      setShowLoadingTracker(false);
      logger.summary();
    }
  }, [isLoading, graphData]);

  // Safety timeout - hide tracker after 10 seconds no matter what
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (showLoadingTracker) {
        logger.warn('Loading tracker auto-hidden after 10s timeout');
        setShowLoadingTracker(false);
      }
    }, 10000);
    return () => clearTimeout(timeout);
  }, [showLoadingTracker]);

  // Load data on mount
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (!mounted) return;
      logger.info('Starting data load...');
      setLoading(true);
      
      try {
        // Try to load real Obsidian graph data first
        logger.info('Fetching graph data...');
        const response = await fetch('/data/GRAPH_DATA.json');
        if (response.ok) {
          logger.success('Graph data fetched successfully');
          const realGraphData: GraphData = await response.json();
          logger.info('Loaded real Obsidian data:', realGraphData.nodes.length, 'nodes,', realGraphData.edges.length, 'edges');
          
          // Apply coloring rules to all nodes
          const enhancedNodes = realGraphData.nodes.map(node => {
            const { color, category, description } = categorizeNode(node.label, node.category);
            const formattedLabel = formatNodeLabel(node.label);
            const edgeCount = realGraphData.edges.filter(e => e.source === node.id || e.target === node.id).length;
            const isImportant = node.size ? node.size > 1.5 : false;
            const size = calculateNodeSize(edgeCount, isImportant);
            
            return {
              ...node,
              label: formattedLabel,
              color,
              category,
              size,
              metadata: {
                ...node.metadata,
                categoryDescription: description,
                originalLabel: node.label,
                connectionCount: edgeCount,
              }
            };
          });
          
          if (mounted) {
            logger.success('Setting enhanced graph data');
            setGraphData({ ...realGraphData, nodes: enhancedNodes });
            logger.success('Data load complete');
            setLoading(false);
          }
          return;
        }
      } catch (err) {
        logger.warn('No graph data found, trying manifest...', err);
      }
      
      // Fallback to manifest or mock data
      try {
        logger.info('Loading resource manifest...');
        const manifest = await loadResourceManifest();
        if (manifest && manifest.length > 0 && mounted) {
          logger.success('Manifest loaded:', manifest.length, 'resources');
          const graph = parseManifestToGraph(manifest);
          setGraphData(graph);
        } else if (mounted) {
          logger.warn('Falling back to mock data');
          const mockGraph = generateMockGraph();
          setGraphData(mockGraph);
        }
      } catch (err) {
        logger.error('Error loading manifest:', err);
        if (mounted) {
          logger.warn('Using mock data as final fallback');
          setError('Failed to load data. Using mock data.');
          const mockGraph = generateMockGraph();
          setGraphData(mockGraph);
        }
      } finally {
        if (mounted) {
          logger.info('Stopping loading state');
          setLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, [setGraphData, setLoading]);

  // Filter graph based on search and filters
  const filteredGraph = useMemo(() => {
    if (!graphData) return null;
    return filterGraph(graphData, searchQuery, filterTags, filterDomains);
  }, [graphData, searchQuery, filterTags, filterDomains]);

  if (error && !graphData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white" style={{ backgroundColor: '#000000' }}>
        <div className="text-center">
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden" style={{ backgroundColor: '#000000' }}>
      {/* Main Graph Visualization - Always render to prevent white screen */}
      <div className="absolute inset-0 w-full h-full bg-black" style={{ backgroundColor: '#000000' }}>
        {filteredGraph && filteredGraph.nodes.length > 0 ? (
          <div className="w-full h-full bg-black" style={{ backgroundColor: '#000000' }} key="graph-container">
            {mode === '3d' ? (
              <Graph3D key="graph-3d" nodes={filteredGraph.nodes} edges={filteredGraph.edges} />
            ) : (
              <Graph2D key="graph-2d" nodes={filteredGraph.nodes} edges={filteredGraph.edges} />
            )}
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-full bg-black" style={{ backgroundColor: '#000000' }}>
            <div className="text-center">
              <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-white text-sm sm:text-base lg:text-lg px-4">Loading Knowledge Graph...</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-black" style={{ backgroundColor: '#000000' }}>
            <p className="text-white text-sm sm:text-base lg:text-lg px-4">No nodes match your filters</p>
          </div>
        )}
      </div>

      {/* Header - Professional Design */}
      <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 pointer-events-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-3 shadow-2xl">
            <Box className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-purple-400" />
            <div>
              <h1 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent tracking-tight leading-none">Prism Writing</h1>
              <p className="text-[10px] sm:text-xs text-purple-300/60 mt-0.5">Knowledge Graph</p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 sm:p-2.5 bg-black/80 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              )}
            </button>
            
            {/* View Mode Toggle */}
            <button
              onClick={() => setMode(mode === '3d' ? '2d' : '3d')}
              className="px-3 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white rounded-lg sm:rounded-xl transition-all duration-200 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-purple-500/50"
            >
              <span className="hidden sm:inline">{mode === '3d' ? '2D View' : '3D View'}</span>
              <span className="sm:hidden">{mode === '3d' ? '2D' : '3D'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <SearchBar />

      {/* Content Viewer */}
      <ContentViewer />

      {/* Coverage Dashboard */}
      <CoverageDashboard />

      {/* Position Editor Modal */}
      <PositionEditor />

      {/* Loading Tracker */}
      <LoadingTracker 
        isVisible={showLoadingTracker} 
        onClose={() => {
          setShowLoadingTracker(false);
          logger.warn('Loading tracker manually closed by user');
        }}
      />

      {/* Instructions Overlay */}
      {!isLoading && graphData && (
        <div className="absolute bottom-6 left-6 z-10 bg-black/40 backdrop-blur-xl border border-purple-900/50 rounded-2xl p-4 max-w-xs pointer-events-none shadow-2xl shadow-purple-500/10">
          <p className="font-semibold mb-2 text-purple-400 text-sm">Controls</p>
          <ul className="space-y-2 text-xs text-gray-300">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></span>
              <span>{mode === '3d' ? 'Click and drag to rotate' : 'Drag to pan'}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full"></span>
              <span>Scroll to zoom</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></span>
              <span>Click nodes to view content</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></span>
              <span>Hover to highlight connections</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full"></span>
              <span>Double-click nodes to edit position</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

// Generate mock graph data for demonstration
function generateMockGraph() {
  const mockManifest: ResourceManifestEntry[] = [
    // Languages domain
    { id: 'LANG-001', title: 'Python Guide', category: 'programming', domain: 'Languages', path: '/01_Languages/python.md', tags: ['python', 'programming', 'scripting'], type: 'resource' },
    { id: 'LANG-002', title: 'JavaScript Guide', category: 'programming', domain: 'Languages', path: '/01_Languages/javascript.md', tags: ['javascript', 'web', 'frontend'], type: 'resource' },
    { id: 'LANG-003', title: 'TypeScript Guide', category: 'programming', domain: 'Languages', path: '/01_Languages/typescript.md', tags: ['typescript', 'javascript', 'types'], type: 'resource' },
    
    // Algorithms domain
    { id: 'ALG-001', title: 'Sorting Algorithms', category: 'algorithms', domain: 'Algorithms', path: '/02_Algorithms/sorting.md', tags: ['sorting', 'algorithms', 'performance'], type: 'resource' },
    { id: 'ALG-002', title: 'Search Algorithms', category: 'algorithms', domain: 'Algorithms', path: '/02_Algorithms/search.md', tags: ['search', 'algorithms', 'binary-search'], type: 'resource' },
    
    // System Design domain
    { id: 'SYS-001', title: 'Microservices Architecture', category: 'architecture', domain: 'SystemDesign', path: '/06_SystemDesign/microservices.md', tags: ['microservices', 'architecture', 'distributed'], type: 'resource' },
    { id: 'SYS-002', title: 'Load Balancing', category: 'architecture', domain: 'SystemDesign', path: '/06_SystemDesign/load-balancing.md', tags: ['load-balancing', 'scalability', 'performance'], type: 'resource' },
    
    // DevOps domain
    { id: 'DEV-001', title: 'Docker Guide', category: 'devops', domain: 'DevOps', path: '/08_DevOps/docker.md', tags: ['docker', 'containers', 'deployment'], type: 'resource' },
    { id: 'DEV-002', title: 'Kubernetes Guide', category: 'devops', domain: 'DevOps', path: '/08_DevOps/kubernetes.md', tags: ['kubernetes', 'orchestration', 'containers'], type: 'resource' },
    { id: 'DEV-003', title: 'CI/CD Pipelines', category: 'devops', domain: 'DevOps', path: '/08_DevOps/cicd.md', tags: ['ci-cd', 'automation', 'testing'], type: 'resource' },
    
    // Security domain
    { id: 'SEC-001', title: 'Authentication Best Practices', category: 'security', domain: 'Security', path: '/09_Security/auth.md', tags: ['authentication', 'security', 'oauth'], type: 'resource' },
    { id: 'SEC-002', title: 'Encryption Guide', category: 'security', domain: 'Security', path: '/09_Security/encryption.md', tags: ['encryption', 'security', 'cryptography'], type: 'resource' },
    
    // AI/ML domain
    { id: 'AI-001', title: 'Neural Networks', category: 'ai-ml', domain: 'AI-ML', path: '/10_AI-ML/neural-networks.md', tags: ['neural-networks', 'deep-learning', 'ai'], type: 'resource' },
    { id: 'AI-002', title: 'Machine Learning Basics', category: 'ai-ml', domain: 'AI-ML', path: '/10_AI-ML/ml-basics.md', tags: ['machine-learning', 'ai', 'data-science'], type: 'resource' },
    { id: 'AI-003', title: 'LLM Integration', category: 'ai-ml', domain: 'AI-ML', path: '/10_AI-ML/llm.md', tags: ['llm', 'ai', 'gpt', 'nlp'], type: 'resource' },
    
    // Databases domain
    { id: 'DB-001', title: 'SQL Fundamentals', category: 'databases', domain: 'Databases', path: '/07_Databases/sql.md', tags: ['sql', 'databases', 'query'], type: 'resource' },
    { id: 'DB-002', title: 'NoSQL Databases', category: 'databases', domain: 'Databases', path: '/07_Databases/nosql.md', tags: ['nosql', 'mongodb', 'databases'], type: 'resource' },
    
    // Web domain
    { id: 'WEB-001', title: 'React Guide', category: 'web', domain: 'Web', path: '/15_Web/react.md', tags: ['react', 'frontend', 'javascript'], type: 'resource' },
    { id: 'WEB-002', title: 'Next.js Guide', category: 'web', domain: 'Web', path: '/15_Web/nextjs.md', tags: ['nextjs', 'react', 'ssr'], type: 'resource' },
    
    // Testing domain
    { id: 'TEST-001', title: 'Unit Testing', category: 'testing', domain: 'Testing', path: '/16_Testing/unit-testing.md', tags: ['testing', 'unit-tests', 'quality'], type: 'resource' },
    { id: 'TEST-002', title: 'Integration Testing', category: 'testing', domain: 'Testing', path: '/16_Testing/integration-testing.md', tags: ['testing', 'integration', 'quality'], type: 'resource' },
    
    // Cloud domain
    { id: 'CLOUD-001', title: 'AWS Fundamentals', category: 'cloud', domain: 'Cloud', path: '/13_Cloud/aws.md', tags: ['aws', 'cloud', 'infrastructure'], type: 'resource' },
    { id: 'CLOUD-002', title: 'Azure Guide', category: 'cloud', domain: 'Cloud', path: '/13_Cloud/azure.md', tags: ['azure', 'cloud', 'microsoft'], type: 'resource' },
  ];

  return parseManifestToGraph(mockManifest);
}
