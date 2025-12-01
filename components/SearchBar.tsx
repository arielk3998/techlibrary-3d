'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Tag, Folder } from 'lucide-react';
import { useGraphStore } from '@/store/useGraphStore';

export default function SearchBar() {
  const {
    searchQuery,
    setSearchQuery,
    filterTags,
    setFilterTags,
    filterDomains,
    setFilterDomains,
    resetFilters,
    graphData,
  } = useGraphStore();

  const [showFilters, setShowFilters] = useState(false);

  // Extract unique tags and domains from graph data
  const { allTags, allDomains } = useMemo(() => {
    if (!graphData) return { allTags: [], allDomains: [] };

    const tags = new Set<string>();
    const domains = new Set<string>();

    graphData.nodes.forEach((node) => {
      if (node.type === 'tag') {
        tags.add(node.label);
      }
      if (node.metadata.domain) {
        domains.add(node.metadata.domain);
      }
    });

    return {
      allTags: Array.from(tags).sort(),
      allDomains: Array.from(domains).sort(),
    };
  }, [graphData]);

  const toggleTag = (tag: string) => {
    if (filterTags.includes(tag)) {
      setFilterTags(filterTags.filter((t) => t !== tag));
    } else {
      setFilterTags([...filterTags, tag]);
    }
  };

  const toggleDomain = (domain: string) => {
    if (filterDomains.includes(domain)) {
      setFilterDomains(filterDomains.filter((d) => d !== domain));
    } else {
      setFilterDomains([...filterDomains, domain]);
    }
  };

  const hasActiveFilters = searchQuery || filterTags.length > 0 || filterDomains.length > 0;

  return (
    <div className="absolute top-4 left-4 z-10 w-96 max-w-[calc(100vw-2rem)]">
      {/* Search Input */}
      <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg">
        <div className="flex items-center gap-2 p-3">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              showFilters ? 'bg-gray-700' : ''
            }`}
            aria-label="Toggle filters"
          >
            <Filter className="w-4 h-4 text-gray-400" />
          </button>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="p-2 rounded hover:bg-gray-700 transition-colors"
              aria-label="Clear filters"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t border-gray-700 p-3 space-y-4 max-h-96 overflow-y-auto">
            {/* Domain Filters */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Folder className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-300">Domains</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {allDomains.map((domain) => (
                  <button
                    key={domain}
                    onClick={() => toggleDomain(domain)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      filterDomains.includes(domain)
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag Filters */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-300">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {allTags.slice(0, 50).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      filterTags.includes(tag)
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-2 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-3">
          <div className="flex flex-wrap gap-2">
            {filterDomains.map((domain) => (
              <span
                key={domain}
                className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs flex items-center gap-1"
              >
                <Folder className="w-3 h-3" />
                {domain}
                <button
                  onClick={() => toggleDomain(domain)}
                  className="hover:text-cyan-100"
                  aria-label={`Remove ${domain} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filterTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="hover:text-purple-100"
                  aria-label={`Remove ${tag} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
