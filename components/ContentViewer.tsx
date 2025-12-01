'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, FileText, Tag, Folder } from 'lucide-react';
import { useGraphStore } from '@/store/useGraphStore';
import { loadMarkdownContent } from '@/lib/dataLoader';
import type { MarkdownContent } from '@/types';

export default function ContentViewer() {
  const { selectedNode, selectNode, graphData, currentContent, setCurrentContent } = useGraphStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedNode || !graphData) {
      setCurrentContent(null);
      return;
    }

    const node = graphData.nodes.find((n) => n.id === selectedNode);
    if (!node || !node.metadata.path) {
      // No path to load content from
      setCurrentContent({
        title: node?.label || 'No Content',
        content: `# ${node?.label}\n\nNo content available for this node.`,
        path: '',
      });
      return;
    }

    // Load content
    setLoading(true);
    loadMarkdownContent(node.metadata.path)
      .then((content) => {
        if (content) {
          setCurrentContent(content);
        }
      })
      .catch((err) => {
        console.error('Error loading content:', err);
        setCurrentContent({
          title: 'Error',
          content: `Failed to load content for ${node.label}`,
          path: node.metadata.path || '',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedNode, graphData, setCurrentContent]);

  if (!selectedNode || !currentContent) {
    return null;
  }

  const node = graphData?.nodes.find((n) => n.id === selectedNode);

  return (
    <div className="fixed top-0 right-0 w-full md:w-1/3 h-full bg-gray-900 border-l border-gray-700 overflow-hidden z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FileText className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <h2 className="text-lg font-semibold text-white truncate">
            {currentContent.title}
          </h2>
        </div>
        <button
          onClick={() => selectNode(null)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Metadata */}
      {node && (
        <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{node.metadata.domain || node.category}</span>
            </div>
            {node.metadata.tags && node.metadata.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-gray-400" />
                {node.metadata.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          <div className="prose prose-invert prose-cyan max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {currentContent.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
