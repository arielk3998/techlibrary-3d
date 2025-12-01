'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, FileText, Tag, Folder } from 'lucide-react';
import { useGraphStore } from '@/store/useGraphStore';
import { loadMarkdownContent } from '@/lib/dataLoader';
import type { MarkdownContent, GraphNode } from '@/types';

function generateNodeContent(node: GraphNode): MarkdownContent {
  const category = node.metadata?.categoryDescription || node.category || 'General';
  const connectionCount = node.metadata?.connectionCount || 0;
  const originalLabel = node.metadata?.originalLabel || node.label;
  
  let content = `# ${node.label}\n\n`;
  
  // Category badge
  content += `> **Category:** ${category}\n\n`;
  
  // Connection info
  if (connectionCount > 0) {
    content += `**Connected to ${connectionCount} other ${connectionCount === 1 ? 'entity' : 'entities'}**\n\n`;
  }
  
  // Category-specific content templates
  switch (category) {
    case 'Country':
      content += `## Overview\n\n`;
      content += `${node.label} is a nation state in the global political environment. `;
      content += `This country plays a significant role in international relations, regional politics, and global affairs.\n\n`;
      content += `### Key Areas\n\n`;
      content += `- **Political System**: Government structure and leadership\n`;
      content += `- **International Relations**: Diplomatic ties and alliances\n`;
      content += `- **Economic Position**: Trade relationships and economic influence\n`;
      content += `- **Regional Impact**: Role in regional stability and cooperation\n\n`;
      content += `### Connections\n\n`;
      content += `Explore the graph to discover this country's relationships with other nations, `;
      content += `leaders, international organizations, and global events.\n`;
      break;
      
    case 'Region':
      content += `## Geographic Region\n\n`;
      content += `${node.label} encompasses multiple countries and territories, forming a distinct `;
      content += `geopolitical and cultural area in the world.\n\n`;
      content += `### Characteristics\n\n`;
      content += `- **Geographic Scope**: Countries and territories included\n`;
      content += `- **Political Dynamics**: Regional cooperation and conflicts\n`;
      content += `- **Economic Integration**: Trade blocs and economic relationships\n`;
      content += `- **Cultural Ties**: Shared history and cultural connections\n\n`;
      break;
      
    case 'City':
      content += `## Major City\n\n`;
      content += `${node.label} is a significant urban center with political, economic, or cultural importance.\n\n`;
      content += `### Significance\n\n`;
      content += `- **Political Role**: Capital city or administrative center\n`;
      content += `- **Economic Hub**: Business and financial activities\n`;
      content += `- **International Presence**: Diplomatic missions and organizations\n`;
      content += `- **Strategic Location**: Geographic and geopolitical position\n\n`;
      break;
      
    case 'Leader':
    case 'NamedLeader':
      content += `## Political Leader\n\n`;
      content += `${node.label} holds a position of political authority and influence.\n\n`;
      content += `### Leadership Profile\n\n`;
      content += `- **Position**: Official role and responsibilities\n`;
      content += `- **Policy Agenda**: Key initiatives and priorities\n`;
      content += `- **International Relations**: Diplomatic engagements\n`;
      content += `- **Domestic Impact**: Effects on national politics\n\n`;
      content += `### Related Entities\n\n`;
      content += `Click on connected nodes to explore relationships with countries, `;
      content += `organizations, policies, and other leaders.\n`;
      break;
      
    case 'IntlOrganization':
      content += `## International Organization\n\n`;
      content += `${node.label} is a multinational entity that facilitates cooperation `;
      content += `between countries on global or regional issues.\n\n`;
      content += `### Organizational Details\n\n`;
      content += `- **Mission**: Primary objectives and goals\n`;
      content += `- **Membership**: Member countries and participants\n`;
      content += `- **Activities**: Key programs and initiatives\n`;
      content += `- **Global Impact**: Influence on international affairs\n\n`;
      break;
      
    case 'GovtOrganization':
      content += `## Government Organization\n\n`;
      content += `${node.label} is a governmental body or agency with specific responsibilities.\n\n`;
      content += `### Organizational Structure\n\n`;
      content += `- **Function**: Primary duties and authority\n`;
      content += `- **Jurisdiction**: Scope of operations\n`;
      content += `- **Leadership**: Key officials and structure\n`;
      content += `- **Related Policies**: Associated laws and regulations\n\n`;
      break;
      
    case 'PoliticalParty':
      content += `## Political Party or Movement\n\n`;
      content += `${node.label} represents a political ideology or movement within the governmental system.\n\n`;
      content += `### Party Information\n\n`;
      content += `- **Ideology**: Political philosophy and platform\n`;
      content += `- **Representation**: Electoral presence and support\n`;
      content += `- **Leadership**: Key figures and officials\n`;
      content += `- **Policy Positions**: Major policy stances\n\n`;
      break;
      
    case 'Event':
      content += `## Political Event\n\n`;
      content += `${node.label} is a significant occurrence in the political sphere.\n\n`;
      content += `### Event Details\n\n`;
      content += `- **Context**: Background and circumstances\n`;
      content += `- **Participants**: Key actors and stakeholders\n`;
      content += `- **Outcomes**: Results and consequences\n`;
      content += `- **Global Impact**: International significance\n\n`;
      break;
      
    case 'Policy':
      content += `## Policy or System\n\n`;
      content += `${node.label} represents a policy framework or systematic approach to governance.\n\n`;
      content += `### Policy Framework\n\n`;
      content += `- **Objectives**: Goals and intended outcomes\n`;
      content += `- **Implementation**: How the policy is executed\n`;
      content += `- **Stakeholders**: Affected parties and beneficiaries\n`;
      content += `- **Impact**: Effects on society and governance\n\n`;
      break;
      
    case 'Economic':
      content += `## Economic Concept\n\n`;
      content += `${node.label} relates to economic systems, trade, or financial matters.\n\n`;
      content += `### Economic Aspects\n\n`;
      content += `- **Definition**: Economic significance and meaning\n`;
      content += `- **Global Context**: International economic relationships\n`;
      content += `- **Key Players**: Countries and organizations involved\n`;
      content += `- **Trends**: Current developments and forecasts\n\n`;
      break;
      
    case 'Technology':
      content += `## Technology & Innovation\n\n`;
      content += `${node.label} represents technological advancement or innovation in the political sphere.\n\n`;
      content += `### Technology Overview\n\n`;
      content += `- **Innovation**: Technological developments\n`;
      content += `- **Political Implications**: Impact on governance\n`;
      content += `- **Global Competition**: International tech race\n`;
      content += `- **Regulation**: Policy and legal frameworks\n\n`;
      break;
      
    case 'SocialIssue':
      content += `## Social or Environmental Issue\n\n`;
      content += `${node.label} addresses important social, environmental, or humanitarian concerns.\n\n`;
      content += `### Issue Overview\n\n`;
      content += `- **Challenge**: Nature of the issue\n`;
      content += `- **Global Response**: International efforts and initiatives\n`;
      content += `- **Key Stakeholders**: Organizations and leaders involved\n`;
      content += `- **Solutions**: Proposed approaches and actions\n\n`;
      break;
      
    case 'Military':
      content += `## Military & Security\n\n`;
      content += `${node.label} pertains to military forces, defense systems, or security operations.\n\n`;
      content += `### Security Context\n\n`;
      content += `- **Purpose**: Military or security objectives\n`;
      content += `- **Capabilities**: Resources and capabilities\n`;
      content += `- **Strategic Role**: Defense and deterrence\n`;
      content += `- **International Relations**: Military alliances and conflicts\n\n`;
      break;
      
    case 'Media':
      content += `## Media & Communication\n\n`;
      content += `${node.label} involves media organizations, journalism, or information dissemination.\n\n`;
      content += `### Media Landscape\n\n`;
      content += `- **Platform**: Type of media or communication\n`;
      content += `- **Influence**: Impact on public opinion\n`;
      content += `- **Regulation**: Media laws and policies\n`;
      content += `- **Global Reach**: International presence\n\n`;
      break;
      
    case 'Ideology':
      content += `## Political Ideology\n\n`;
      content += `${node.label} represents a system of political beliefs and principles.\n\n`;
      content += `### Ideological Framework\n\n`;
      content += `- **Core Principles**: Fundamental beliefs\n`;
      content += `- **Historical Context**: Origins and development\n`;
      content += `- **Modern Application**: Current manifestations\n`;
      content += `- **Global Influence**: International adoption and impact\n\n`;
      break;
      
    default:
      content += `## About\n\n`;
      content += `${node.label} is part of the knowledge graph representing `;
      content += `concepts, entities, and relationships in the global context.\n\n`;
      content += `### Explore Further\n\n`;
      content += `Click on connected nodes to discover relationships and explore `;
      content += `how this element fits into the broader network of information.\n\n`;
  }
  
  // Add metadata section
  content += `---\n\n`;
  content += `### Metadata\n\n`;
  content += `- **Type**: ${node.type}\n`;
  if (node.metadata?.categoryDescription) {
    content += `- **Classification**: ${node.metadata.categoryDescription}\n`;
  }
  content += `- **Connections**: ${connectionCount} direct ${connectionCount === 1 ? 'link' : 'links'}\n`;
  
  return {
    content,
    frontmatter: {
      title: node.label,
      category: category,
      type: node.type,
    },
  };
}

export default function ContentViewer() {
  const { selectedNode, selectNode, graphData, currentContent, setCurrentContent } = useGraphStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedNode || !graphData) {
      setCurrentContent(null);
      return;
    }

    const node = graphData.nodes.find((n) => n.id === selectedNode);
    if (!node) {
      setCurrentContent(null);
      return;
    }

    if (!node.metadata.path) {
      // Generate informative content based on node data
      const content = generateNodeContent(node);
      setCurrentContent(content);
      return;
    }

    // Load content from API
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

  const node = graphData?.nodes.find((n) => n.id === selectedNode);

  if (!selectedNode || !currentContent) {
    return null;
  }

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
