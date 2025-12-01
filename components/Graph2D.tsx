'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { GraphNode, GraphEdge } from '@/types';
import { useGraphStore } from '@/store/useGraphStore';

interface Graph2DProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export default function Graph2D({ nodes, edges }: Graph2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { selectedNode, selectNode, setHighlightedNodes } = useGraphStore();
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Apply camera transform
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(camera.zoom, camera.zoom);
      ctx.translate(-camera.x, -camera.y);

      // Draw edges with arrows
      edges.forEach((edge) => {
        const fromNode = nodes.find((n) => n.id === edge.source);
        const toNode = nodes.find((n) => n.id === edge.target);
        if (!fromNode || !toNode) return;

        const isHighlighted =
          selectedNode === edge.source || selectedNode === edge.target;

        const x1 = fromNode.position[0] * 10;
        const y1 = fromNode.position[1] * 10;
        const x2 = toNode.position[0] * 10;
        const y2 = toNode.position[1] * 10;

        // Calculate direction
        const dx = x2 - x1;
        const dy = y2 - y1;
        const angle = Math.atan2(dy, dx);
        const length = Math.sqrt(dx * dx + dy * dy);
        
        // Shorten line to not overlap with nodes
        const fromRadius = (fromNode.size || 1) * 6 / camera.zoom;
        const toRadius = (toNode.size || 1) * 6 / camera.zoom;
        const startX = x1 + (fromRadius * Math.cos(angle));
        const startY = y1 + (fromRadius * Math.sin(angle));
        const endX = x2 - (toRadius * Math.cos(angle));
        const endY = y2 - (toRadius * Math.sin(angle));

        // Draw line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = isHighlighted
          ? fromNode.color
          : 'rgba(150, 150, 150, 0.5)';
        ctx.lineWidth = isHighlighted ? 3 / camera.zoom : 2 / camera.zoom;
        ctx.stroke();

        // Draw arrow head
        const arrowSize = 12 / camera.zoom;
        const arrowAngle = Math.PI / 6;

        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowSize * Math.cos(angle - arrowAngle),
          endY - arrowSize * Math.sin(angle - arrowAngle)
        );
        ctx.lineTo(
          endX - arrowSize * Math.cos(angle + arrowAngle),
          endY - arrowSize * Math.sin(angle + arrowAngle)
        );
        ctx.closePath();
        ctx.fillStyle = isHighlighted ? fromNode.color : 'rgba(150, 150, 150, 0.7)';
        ctx.fill();
      });

      // Draw nodes
      nodes.forEach((node) => {
        const x = node.position[0] * 10;
        const y = node.position[1] * 10;
        const isSelected = selectedNode === node.id;
        const isHovered = hoveredNode === node.id;
        const radius = (node.size || 1) * (6 / camera.zoom);

        // Glow effect for selected/hovered
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(x, y, radius + 4 / camera.zoom, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(x, y, radius, x, y, radius + 4 / camera.zoom);
          gradient.addColorStop(0, node.color + '80');
          gradient.addColorStop(1, node.color + '00');
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Border
        ctx.strokeStyle = isSelected || isHovered ? '#00ffff' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = (isSelected || isHovered ? 3 : 1.5) / camera.zoom;
        ctx.stroke();

        // Label
        if (camera.zoom > 0.4) {
          ctx.fillStyle = 'white';
          ctx.font = `bold ${14 / camera.zoom}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.shadowColor = 'black';
          ctx.shadowBlur = 4 / camera.zoom;
          ctx.fillText(node.label, x, y + radius + 8 / camera.zoom);
          ctx.shadowBlur = 0;
        }
      });

      ctx.restore();
    };

    // Mouse events
    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left - canvas.width / 2) / camera.zoom + camera.x),
        y: ((e.clientY - rect.top - canvas.height / 2) / camera.zoom + camera.y),
      };
    };

    const handleMouseDown = (e: MouseEvent) => {
      const pos = getMousePos(e);
      
      // Check if clicking on a node
      const clickedNode = nodes.find((node) => {
        const dx = node.position[0] * 10 - pos.x;
        const dy = node.position[1] * 10 - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (node.size || 1) * 5;
      });

      if (clickedNode) {
        selectNode(clickedNode.id);
        const connectedEdges = edges.filter(
          (e) => e.source === clickedNode.id || e.target === clickedNode.id
        );
        const connectedNodeIds = new Set(
          connectedEdges.flatMap((e) => [e.source, e.target])
        );
        setHighlightedNodes(Array.from(connectedNodeIds));
      } else {
        setIsDragging(true);
        setDragStart({ x: e.clientX - camera.x * camera.zoom, y: e.clientY - camera.y * camera.zoom });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const pos = getMousePos(e);

      if (isDragging) {
        setCamera({
          ...camera,
          x: (e.clientX - dragStart.x) / camera.zoom,
          y: (e.clientY - dragStart.y) / camera.zoom,
        });
      } else {
        // Check hover
        const hovered = nodes.find((node) => {
          const dx = node.position[0] * 10 - pos.x;
          const dy = node.position[1] * 10 - pos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < (node.size || 1) * 5;
        });
        setHoveredNode(hovered?.id || null);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      setCamera({
        ...camera,
        zoom: Math.max(0.1, Math.min(5, camera.zoom * zoomFactor)),
      });
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);
    window.addEventListener('resize', resizeCanvas);

    resizeCanvas();
    
    // Continuous rendering
    const animate = () => {
      draw();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [nodes, edges, camera, selectedNode, hoveredNode, isDragging, dragStart]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-black cursor-move"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    />
  );
}
