import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface Node {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

interface Connection {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}

const GeometricBackground: React.FC = () => {
  const { nodes, connections } = useMemo(() => {
    const colors = ["#ec6c25", "#f5924d", "#71a241", "#8fc05a", "#ffffff"];
    
    // Generate nodes in a grid-like pattern with some randomness
    const generatedNodes: Node[] = [];
    const gridSize = 6;
    const spacing = 100 / (gridSize - 1);
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const offsetX = (Math.random() - 0.5) * 15;
        const offsetY = (Math.random() - 0.5) * 15;
        generatedNodes.push({
          id: i * gridSize + j,
          x: i * spacing + offsetX,
          y: j * spacing + offsetY,
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 2,
        });
      }
    }

    // Generate connections between nearby nodes
    const generatedConnections: Connection[] = [];
    const maxDistance = 35;

    for (let i = 0; i < generatedNodes.length; i++) {
      for (let j = i + 1; j < generatedNodes.length; j++) {
        const dx = generatedNodes[i].x - generatedNodes[j].x;
        const dy = generatedNodes[i].y - generatedNodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance && Math.random() > 0.3) {
          generatedConnections.push({
            id: `${i}-${j}`,
            x1: generatedNodes[i].x,
            y1: generatedNodes[i].y,
            x2: generatedNodes[j].x,
            y2: generatedNodes[j].y,
            delay: Math.random() * 3,
          });
        }
      }
    }

    return { nodes: generatedNodes, connections: generatedConnections };
  }, []);

  return (
    <div className="geometric-background">
      {/* Base gradient */}
      <div className="geometric-base" />

      {/* SVG for lines */}
      <svg className="geometric-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradientOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec6c25" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f5924d" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="lineGradientGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#71a241" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8fc05a" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Animated connection lines */}
        {connections.map((conn, index) => (
          <motion.line
            key={conn.id}
            x1={conn.x1}
            y1={conn.y1}
            x2={conn.x2}
            y2={conn.y2}
            stroke={index % 2 === 0 ? "url(#lineGradientOrange)" : "url(#lineGradientGreen)"}
            strokeWidth="0.15"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: 8,
              delay: conn.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* Animated nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="geometric-node"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: node.size,
            height: node.size,
            backgroundColor: node.color,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 4,
            delay: node.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating hexagons */}
      <motion.div
        className="hex-shape hex-1"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 60, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <motion.div
        className="hex-shape hex-2"
        animate={{
          rotate: [360, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          rotate: { duration: 50, repeat: Infinity, ease: "linear" },
          scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Vignette */}
      <div className="geometric-vignette" />
    </div>
  );
};

export default GeometricBackground;

