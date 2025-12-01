'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, Box } from 'lucide-react';
import { useGraphStore } from '@/store/useGraphStore';
import SearchBar from '@/components/SearchBar';
import ContentViewer from '@/components/ContentViewer';
import CoverageDashboard from '@/components/CoverageDashboard';
import { loadResourceManifest } from '@/lib/dataLoader';
import { parseManifestToGraph, filterGraph } from '@/lib/graphParser';
import type { ResourceManifestEntry } from '@/types';

// Dynamically import Graph3D to avoid SSR issues with Three.js
const Graph3D = dynamic(() => import('@/components/Graph3D'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
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
  } = useGraphStore();

  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    setLoading(true);
    loadResourceManifest()
      .then((manifest: ResourceManifestEntry[]) => {
        if (manifest && manifest.length > 0) {
          const graph = parseManifestToGraph(manifest);
          setGraphData(graph);
        } else {
          // Use mock data if manifest is not available
          const mockGraph = generateMockGraph();
          setGraphData(mockGraph);
        }
      })
      .catch((err) => {
        console.error('Error loading manifest:', err);
        setError('Failed to load data. Using mock data.');
        const mockGraph = generateMockGraph();
        setGraphData(mockGraph);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setGraphData, setLoading]);

  // Filter graph based on search and filters
  const filteredGraph = useMemo(() => {
    if (!graphData) return null;
    return filterGraph(graphData, searchQuery, filterTags, filterDomains);
  }, [graphData, searchQuery, filterTags, filterDomains]);

  if (error && !graphData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
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
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Box className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white">TechLibrary 3D</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMode(mode === '3d' ? '2d' : '3d')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
            >
              {mode === '3d' ? '2D View' : '3D View'}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar />

      {/* Main Graph Visualization */}
      <div className="w-full h-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
              <p className="text-white text-lg">Loading TechLibrary Graph...</p>
            </div>
          </div>
        ) : filteredGraph && filteredGraph.nodes.length > 0 ? (
          <Graph3D nodes={filteredGraph.nodes} edges={filteredGraph.edges} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-white text-lg">No nodes match your filters</p>
          </div>
        )}
      </div>

      {/* Content Viewer */}
      <ContentViewer />

      {/* Coverage Dashboard */}
      <CoverageDashboard />

      {/* Instructions Overlay */}
      {!isLoading && graphData && (
        <div className="absolute bottom-4 left-4 z-10 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3 max-w-xs text-sm text-gray-300">
          <p className="font-semibold mb-1">Controls:</p>
          <ul className="space-y-1 text-xs">
            <li>• Click and drag to rotate</li>
            <li>• Scroll to zoom</li>
            <li>• Click nodes to view content</li>
            <li>• Hover to highlight connections</li>
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
