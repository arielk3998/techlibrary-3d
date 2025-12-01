import { create } from 'zustand';
import type { GraphData, ViewState, MarkdownContent } from '@/types';

interface GraphStore extends ViewState {
  graphData: GraphData | null;
  currentContent: MarkdownContent | null;
  isLoading: boolean;
  
  // Actions
  setGraphData: (data: GraphData) => void;
  setMode: (mode: '3d' | '2d') => void;
  selectNode: (nodeId: string | null) => void;
  setHighlightedNodes: (nodeIds: string[]) => void;
  setSearchQuery: (query: string) => void;
  setFilterTags: (tags: string[]) => void;
  setFilterDomains: (domains: string[]) => void;
  setCurrentContent: (content: MarkdownContent | null) => void;
  setLoading: (loading: boolean) => void;
  resetFilters: () => void;
}

export const useGraphStore = create<GraphStore>((set) => ({
  // Initial state
  mode: '3d',
  selectedNode: null,
  highlightedNodes: [],
  searchQuery: '',
  filterTags: [],
  filterDomains: [],
  graphData: null,
  currentContent: null,
  isLoading: false,

  // Actions
  setGraphData: (data) => set({ graphData: data }),
  setMode: (mode) => set({ mode }),
  selectNode: (nodeId) => set({ selectedNode: nodeId }),
  setHighlightedNodes: (nodeIds) => set({ highlightedNodes: nodeIds }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterTags: (tags) => set({ filterTags: tags }),
  setFilterDomains: (domains) => set({ filterDomains: domains }),
  setCurrentContent: (content) => set({ currentContent: content }),
  setLoading: (loading) => set({ isLoading: loading }),
  resetFilters: () => set({ 
    searchQuery: '', 
    filterTags: [], 
    filterDomains: [],
    highlightedNodes: []
  }),
}));
