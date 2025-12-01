'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { GraphNode, GraphEdge } from '@/types';
import { useGraphStore } from '@/store/useGraphStore';
import { getConnectedNodes } from '@/lib/graphParser';

interface NodeProps {
  node: GraphNode;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: (nodeId: string) => void;
  onHover: (nodeId: string | null) => void;
}

function Node({ node, isSelected, isHighlighted, onClick, onHover }: NodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    if (meshRef.current && (isSelected || hovered)) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const scale = useMemo(() => {
    if (isSelected) return node.size * 1.5;
    if (isHighlighted) return node.size * 1.2;
    if (hovered) return node.size * 1.3;
    return node.size;
  }, [node.size, isSelected, isHighlighted, hovered]);

  const opacity = useMemo(() => {
    if (isSelected || isHighlighted || hovered) return 1;
    return 0.7;
  }, [isSelected, isHighlighted, hovered]);

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(node.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(node.id);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
        scale={scale}
      >
        {node.type === 'domain' ? (
          <octahedronGeometry args={[1, 0]} />
        ) : node.type === 'tag' ? (
          <tetrahedronGeometry args={[1, 0]} />
        ) : (
          <sphereGeometry args={[1, 32, 32]} />
        )}
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={isSelected || hovered ? 0.5 : 0.2}
          transparent
          opacity={opacity}
        />
      </mesh>
      {(isSelected || hovered || node.type === 'domain') && (
        <Text
          position={[0, node.size + 0.5, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {node.label}
        </Text>
      )}
    </group>
  );
}

interface EdgeProps {
  edge: GraphEdge;
  nodes: GraphNode[];
  isHighlighted: boolean;
}

function Edge({ edge, nodes, isHighlighted }: EdgeProps) {
  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);

  if (!sourceNode || !targetNode) return null;

  const points = [
    new THREE.Vector3(...sourceNode.position),
    new THREE.Vector3(...targetNode.position),
  ];

  const color = isHighlighted ? '#00D9FF' : '#444444';
  const opacity = isHighlighted ? 0.8 : 0.2;

  return (
    <Line
      points={points}
      color={color}
      lineWidth={isHighlighted ? 2 : 1}
      transparent
      opacity={opacity}
    />
  );
}

interface Graph3DSceneProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

function Graph3DScene({ nodes, edges }: Graph3DSceneProps) {
  const { selectedNode, setHighlightedNodes, selectNode, graphData } = useGraphStore();
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);

  const highlightedNodeIds = useMemo(() => {
    const nodeToHighlight = selectedNode || hoveredNode;
    if (nodeToHighlight && graphData) {
      return getConnectedNodes(nodeToHighlight, graphData);
    }
    return [];
  }, [selectedNode, hoveredNode, graphData]);

  const handleNodeClick = (nodeId: string) => {
    selectNode(nodeId === selectedNode ? null : nodeId);
  };

  const handleNodeHover = (nodeId: string | null) => {
    setHoveredNode(nodeId);
    if (nodeId && graphData) {
      setHighlightedNodes(getConnectedNodes(nodeId, graphData));
    } else {
      setHighlightedNodes([]);
    }
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 50]} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        minDistance={10}
        maxDistance={200}
      />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Render edges first (behind nodes) */}
      {edges.map((edge, idx) => (
        <Edge
          key={`edge-${idx}`}
          edge={edge}
          nodes={nodes}
          isHighlighted={
            highlightedNodeIds.includes(edge.source) &&
            highlightedNodeIds.includes(edge.target)
          }
        />
      ))}

      {/* Render nodes */}
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          isSelected={selectedNode === node.id}
          isHighlighted={highlightedNodeIds.includes(node.id)}
          onClick={handleNodeClick}
          onHover={handleNodeHover}
        />
      ))}
    </>
  );
}

interface Graph3DProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export default function Graph3D({ nodes, edges }: Graph3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas>
        <Graph3DScene nodes={nodes} edges={edges} />
      </Canvas>
    </div>
  );
}
