'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Layers, X } from 'lucide-react';
import { loadCoverageStatus } from '@/lib/dataLoader';
import type { CoverageData } from '@/types';

export default function CoverageDashboard() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [coverageData, setCoverageData] = useState<CoverageData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showDashboard && coverageData.length === 0) {
      setLoading(true);
      loadCoverageStatus()
        .then((data) => {
          if (data && Array.isArray(data)) {
            setCoverageData(data);
          } else {
            // Mock data if coverage file doesn't exist
            setCoverageData(generateMockCoverageData());
          }
        })
        .catch(() => {
          setCoverageData(generateMockCoverageData());
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [showDashboard, coverageData.length]);

  const totalCoverage = coverageData.length > 0
    ? coverageData.reduce((acc, d) => acc + d.coverage, 0) / coverageData.length
    : 100;

  const totalResources = coverageData.reduce((acc, d) => acc + d.totalResources, 0);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setShowDashboard(!showDashboard)}
        className="fixed bottom-4 right-4 z-40 bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full shadow-lg transition-colors"
        aria-label="Toggle coverage dashboard"
      >
        <BarChart3 className="w-6 h-6" />
      </button>

      {/* Dashboard Panel */}
      {showDashboard && (
        <div className="fixed bottom-20 right-4 z-40 w-96 max-w-[calc(100vw-2rem)] bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Coverage Dashboard</h2>
            </div>
            <button
              onClick={() => setShowDashboard(false)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close dashboard"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
              </div>
            ) : (
              <>
                {/* Overall Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-2xl font-bold text-cyan-400">{totalCoverage.toFixed(0)}%</div>
                    <div className="text-sm text-gray-400">Total Coverage</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-2xl font-bold text-cyan-400">{totalResources}</div>
                    <div className="text-sm text-gray-400">Total Resources</div>
                  </div>
                </div>

                {/* Domain Coverage List */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-300">Domain Coverage</h3>
                  </div>
                  {coverageData.map((domain) => (
                    <div key={domain.domain} className="bg-gray-800 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-white">{domain.domain}</span>
                        <span className="text-sm font-bold text-cyan-400">{domain.coverage}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${domain.coverage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {domain.completedResources} / {domain.totalResources} resources
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Generate mock coverage data based on the 23 domains
function generateMockCoverageData(): CoverageData[] {
  const domains = [
    { name: 'Languages', resources: 15 },
    { name: 'Algorithms', resources: 15 },
    { name: 'OperatingSystems', resources: 10 },
    { name: 'Standards', resources: 13 },
    { name: 'Tools', resources: 12 },
    { name: 'SystemDesign', resources: 22 },
    { name: 'Databases', resources: 14 },
    { name: 'DevOps', resources: 18 },
    { name: 'Security', resources: 16 },
    { name: 'AI-ML', resources: 38 },
    { name: 'Desktop', resources: 12 },
    { name: 'Networking', resources: 17 },
    { name: 'Cloud', resources: 15 },
    { name: 'Mobile', resources: 13 },
    { name: 'Web', resources: 14 },
    { name: 'Testing', resources: 12 },
    { name: 'Performance', resources: 11 },
    { name: 'Graphics', resources: 10 },
    { name: 'Data', resources: 16 },
    { name: 'DistributedSystems', resources: 13 },
    { name: 'ProjectTemplates', resources: 12 },
    { name: 'SoftwareEngineering', resources: 30 },
    { name: 'Mathematics', resources: 14 },
  ];

  return domains.map((domain) => ({
    domain: domain.name,
    coverage: 100,
    totalResources: domain.resources,
    completedResources: domain.resources,
  }));
}
