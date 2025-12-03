import { useEffect, useState, useRef, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { Card } from '../ui/Card';
import { Maximize2, Minimize2, Share2, Download } from 'lucide-react';
import { Button } from '../ui/Button';

export default function KnowledgeGraphTab({ analysis }) {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const graphRef = useRef();

  useEffect(() => {
    if (analysis) {
      const data = generateGraphData(analysis);
      setGraphData(data);
    }
  }, [analysis]);

  const generateGraphData = (data) => {
    // If we have a structured knowledge graph from API, use it
    if (data.knowledgeGraph && data.knowledgeGraph.nodes && data.knowledgeGraph.nodes.length > 0) {
      return {
        nodes: data.knowledgeGraph.nodes.map(n => ({ ...n, val: n.val || 5 })),
        links: data.knowledgeGraph.links
      };
    }

    // Fallback: Generate graph from key findings and summary
    const nodes = [];
    const links = [];
    
    // Central node
    nodes.push({ id: 'paper', label: 'Research Paper', group: 'core', val: 20 });

    // Add key findings as nodes
    if (data.keyFindings) {
      data.keyFindings.forEach((finding, i) => {
        const id = `finding-${i}`;
        const label = typeof finding === 'string' ? finding.substring(0, 30) + '...' : finding.finding.substring(0, 30) + '...';
        nodes.push({ id, label, group: 'finding', val: 10 });
        links.push({ source: 'paper', target: id });
      });
    }

    // Add methodology
    if (data.methodology) {
      nodes.push({ id: 'method', label: 'Methodology', group: 'method', val: 15 });
      links.push({ source: 'paper', target: 'method' });
    }

    // Add concepts from summary (simple extraction)
    if (data.summary) {
      const words = data.summary.split(' ').filter(w => w.length > 6).slice(0, 5);
      words.forEach((word, i) => {
        const id = `concept-${i}`;
        nodes.push({ id, label: word, group: 'concept', val: 5 });
        links.push({ source: 'paper', target: id });
      });
    }

    return { nodes, links };
  };

  const handleNodeClick = (node) => {
    // Aim at node from outside it
    const distance = 40;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

    graphRef.current.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
      node, // lookAt ({ x, y, z })
      3000  // ms transition duration
    );
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[600px]'}`}>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button 
          size="sm" 
          variant="secondary"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="bg-white/90 backdrop-blur"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      </div>

      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
          <h3 className="font-bold text-slate-800">Knowledge Graph</h3>
          <p className="text-xs text-slate-500">{graphData.nodes.length} nodes • {graphData.links.length} connections</p>
        </div>
      </div>

      <ForceGraph3D
        ref={graphRef}
        graphData={graphData}
        nodeLabel="label"
        nodeColor={node => {
          switch(node.group) {
            case 'core': return '#ff0055';
            case 'finding': return '#00cc88';
            case 'method': return '#22ccff';
            default: return '#aa00ff';
          }
        }}
        nodeVal="val"
        linkColor={() => '#ffffff50'}
        linkWidth={1}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={d => 0.005}
        backgroundColor="#0f172a"
        onNodeClick={handleNodeClick}
        controlPointerSelection={true}
      />
    </Card>
  );
}
