'use client';

import React, { useState, useEffect } from 'react';
import { useGraphStore } from '@/store/useGraphStore';
import { X } from 'lucide-react';

export default function PositionEditor() {
  const { editingNode, setEditingNode, updateNodePosition, graphData } = useGraphStore();
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);

  const node = editingNode && graphData 
    ? graphData.nodes.find(n => n.id === editingNode) 
    : null;

  useEffect(() => {
    if (node) {
      setPosition(node.position);
    }
  }, [node]);

  if (!editingNode || !node) return null;

  const handleSave = () => {
    updateNodePosition(editingNode, position);
    setEditingNode(null);
  };

  const handleCancel = () => {
    setEditingNode(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="bg-gradient-to-br from-purple-900/90 via-pink-900/90 to-cyan-900/90 backdrop-blur-xl border border-purple-500/50 rounded-2xl p-6 shadow-2xl shadow-purple-500/30 max-w-md w-full mx-4" style={{ backgroundColor: 'rgba(88, 28, 135, 0.9)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
            Edit Position: {node.label}
          </h2>
          <button
            onClick={handleCancel}
            className="text-purple-300 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-1">
              X Coordinate
            </label>
            <input
              type="number"
              value={position[0]}
              onChange={(e) => setPosition([parseFloat(e.target.value) || 0, position[1], position[2]])}
              step="0.1"
              className="w-full px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-200 mb-1">
              Y Coordinate
            </label>
            <input
              type="number"
              value={position[1]}
              onChange={(e) => setPosition([position[0], parseFloat(e.target.value) || 0, position[2]])}
              step="0.1"
              className="w-full px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-200 mb-1">
              Z Coordinate
            </label>
            <input
              type="number"
              value={position[2]}
              onChange={(e) => setPosition([position[0], position[1], parseFloat(e.target.value) || 0])}
              step="0.1"
              className="w-full px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500/50 transition-colors"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-purple-200 hover:bg-black/60 hover:border-purple-400/50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white rounded-lg transition-all shadow-lg hover:shadow-purple-500/50"
            >
              Save Position
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
