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
  const { setEditingNode } = useGraphStore();

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

  const handleDoubleClick = (e: any) => {
    e.stopPropagation();
    setEditingNode(node.id);
  };

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(node.id);
        }}
        onDoubleClick={handleDoubleClick}
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
          emissiveIntensity={isSelected || hovered ? 0.8 : 0.4}
          transparent
          opacity={opacity}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      {(isSelected || hovered || node.type === 'domain') && (
        <Text
          position={[0, node.size + 0.8, 0]}
          fontSize={node.type === 'domain' ? 0.8 : 0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="#000000"
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

  // Use source node color for the edge
  const color = isHighlighted ? '#00D9FF' : sourceNode.color;
  const opacity = isHighlighted ? 0.9 : 0.5;
  const lineWidth = isHighlighted ? 2.5 : 1.2;

  // Calculate arrow direction and position
  const start = new THREE.Vector3(...sourceNode.position);
  const end = new THREE.Vector3(...targetNode.position);
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  direction.normalize();
  
  // Position arrow 85% along the line
  const arrowPos = start.clone().add(direction.clone().multiplyScalar(length * 0.85));
  
  // Calculate rotation to point arrow towards target
  const axis = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction);

  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={lineWidth}
        transparent
        opacity={opacity}
      />
      {/* Sleek arrow head */}
      <mesh position={arrowPos.toArray()} quaternion={quaternion}>
        <coneGeometry args={[0.25, 0.8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHighlighted ? 0.8 : 0.4}
          transparent
          opacity={opacity}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
    </group>
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
      <PerspectiveCamera makeDefault position={[0, 0, 80]} fov={60} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        minDistance={20}
        maxDistance={300}
      />

      {/* Enhanced lighting for better visibility */}
      <ambientLight intensity={0.8} />
      <pointLight position={[50, 50, 50]} intensity={2} />
      <pointLight position={[-50, -50, -50]} intensity={1} />
      <pointLight position={[0, 50, 0]} intensity={1.5} color="#00D9FF" />
      
      {/* Grid helper for depth perception */}
      <gridHelper args={[100, 20, '#333333', '#1a1a1a']} position={[0, -30, 0]} />

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
    <div className="w-full h-full bg-black">
      <Canvas
        style={{ background: '#000000' }}
        gl={{ alpha: false, antialias: true }}
      >
        <color attach="background" args={['#000000']} />
        <Graph3DScene nodes={nodes} edges={edges} />
      </Canvas>
    </div>
  );
}
