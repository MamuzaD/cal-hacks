import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { Node as NodeType, Edge as EdgeType } from '~/lib/mockData'
import { useDark } from '~/lib/dark-mode'

interface NetworkGraphProps {
  nodes: NodeType[]
  edges: EdgeType[]
  onNodeSelect?: (node: NodeType) => void
  selectedNodeId?: string
}

interface SimulationNode extends NodeType {
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

interface ProcessedEdge extends EdgeType {
  isBidirectional?: boolean
  originalTypes?: string[]
}

export function NetworkGraph({
  nodes,
  edges,
  onNodeSelect,
  selectedNodeId,
}: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const isDarkMode = useDark()

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    // Process edges to detect and merge bidirectional relationships
    const processedEdges: ProcessedEdge[] = []
    const processedPairs = new Set<string>()

    edges.forEach((edge) => {
      const pairKey = [edge.source, edge.target].sort().join('-')

      if (processedPairs.has(pairKey)) return

      // Check if there's a reverse edge
      const reverseEdge = edges.find(
        (e) => e.source === edge.target && e.target === edge.source,
      )

      if (reverseEdge) {
        // Bidirectional edge found - combine types
        const types = [edge.type, reverseEdge.type].sort()
        const combinedType = types.join(' + ')

        processedEdges.push({
          ...edge,
          type: combinedType,
          isBidirectional: true,
          originalTypes: types,
          value: (edge.value || 0) + (reverseEdge.value || 0),
        })

        processedPairs.add(pairKey)
      } else {
        // Unidirectional edge
        processedEdges.push({ ...edge })
      }
    })

    // Create simulation
    const simulation = d3
      .forceSimulation(nodes as SimulationNode[])
      .force(
        'link',
        d3
          .forceLink(processedEdges)
          .id((d: any) => d.id)
          .distance(100),
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40))

    // Helper function to get edge color
    const getEdgeColor = (type: string): string => {
      if (type === 'stock-holding') return '#4ade80' // green
      if (type === 'campaign-contribution') return '#f87171' // red
      if (type === 'lobbying') return '#facc15' // yellow
      if (type === 'investment') return '#60a5fa' // blue

      // Combined types - blend colors or use distinct colors
      if (type.includes(' + ')) {
        if (type.includes('stock-holding') && type.includes('lobbying'))
          return '#86efac' // light green
        if (
          type.includes('stock-holding') &&
          type.includes('campaign-contribution')
        )
          return '#fb923c' // orange
        if (type.includes('lobbying') && type.includes('campaign-contribution'))
          return '#fcd34d' // gold
        if (type.includes('stock-holding') && type.includes('investment'))
          return '#7dd3fc' // sky blue
        if (type.includes('lobbying') && type.includes('investment'))
          return '#a78bfa' // purple
        if (
          type.includes('campaign-contribution') &&
          type.includes('investment')
        )
          return '#f472b6' // pink
        return '#c084fc' // default purple for other combinations
      }

      return '#60a5fa' // default blue
    }

    // Create defs for markers
    const defs = svg.append('defs')

    // Get all unique edge types including combined ones
    const allEdgeTypes = Array.from(new Set(processedEdges.map((e) => e.type)))

    // Create markers for arrowheads (both start and end)
    allEdgeTypes.forEach((edgeType) => {
      const color = getEdgeColor(edgeType)

      // End marker (normal arrow)
      defs
        .append('marker')
        .attr('id', `arrow-end-${edgeType.replace(/\s+/g, '-')}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 25)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', color)

      // Start marker (reverse arrow for bidirectional)
      defs
        .append('marker')
        .attr('id', `arrow-start-${edgeType.replace(/\s+/g, '-')}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', -15)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M10,-5L0,0L10,5')
        .attr('fill', color)
    })

    // Create links
    const link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(processedEdges)
      .enter()
      .append('line')
      .attr('stroke-width', 2)
      .attr('stroke', (d: ProcessedEdge) => getEdgeColor(d.type))
      .attr('opacity', 0.6)
      .attr(
        'marker-end',
        (d: ProcessedEdge) => `url(#arrow-end-${d.type.replace(/\s+/g, '-')})`,
      )
      .attr('marker-start', (d: ProcessedEdge) =>
        d.isBidirectional
          ? `url(#arrow-start-${d.type.replace(/\s+/g, '-')})`
          : null,
      )

    // Create nodes
    const node = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .call(drag(simulation))

    // Add circles for nodes
    node
      .append('circle')
      .attr('r', 15)
      .attr('fill', (d) => {
        if (d.type === 'company') return '#60a5fa'
        if (d.type === 'person') return '#4ade80'
        if (d.type === 'politician') return '#a855f7'
        return '#94a3b8'
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')

    // Add labels
    node
      .append('text')
      .text((d) => d.label)
      .attr('font-size', 12)
      .attr('dx', 20)
      .attr('dy', 5)
      .attr('fill', isDarkMode ? '#fff' : '#000')
      .attr('pointer-events', 'none')

    // Add click handler to nodes
    node.on('click', (event, d) => {
      event.stopPropagation()
      if (onNodeSelect) {
        onNodeSelect(d as NodeType)
      }
    })

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)

      // Update glow position for selected node
      if (glowRef.current && selectedNodeId) {
        const selectedNodeData = nodes.find(
          (n) => n.id === selectedNodeId,
        ) as SimulationNode
        if (
          selectedNodeData &&
          selectedNodeData.x !== undefined &&
          selectedNodeData.y !== undefined
        ) {
          glowRef.current.style.left = `${selectedNodeData.x}px`
          glowRef.current.style.top = `${selectedNodeData.y}px`
          glowRef.current.style.opacity = '1'
        }
      } else if (glowRef.current) {
        glowRef.current.style.opacity = '0'
      }
    })

    function drag(simulation: any) {
      function dragstarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }

      function dragged(event: any, d: any) {
        d.fx = event.x
        d.fy = event.y
      }

      function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }

      return d3
        .drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    }

    // Cleanup on unmount
    return () => {
      simulation.stop()
      d3.select(svgRef.current).selectAll('*').remove()
    }
  }, [nodes, edges, onNodeSelect, selectedNodeId])

  // Update label colors when theme changes
  useEffect(() => {
    if (!svgRef.current) return

    d3.select(svgRef.current)
      .selectAll('text')
      .attr('fill', isDarkMode ? '#fff' : '#000')
  }, [isDarkMode])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-lg overflow-hidden border border-primary/20"
    >
      {/* Gradient background - centered behind the SVG graph */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[875px] h-[700px] rounded-full bg-primary opacity-30 dark:opacity-19 blur-[110px] pointer-events-none" />

      {/* Glow effect for selected node */}
      <div
        ref={glowRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-full bg-amber-400 opacity-0 blur-[10px] pointer-events-none transition-opacity duration-300 z-0"
      />

      {/* SVG Graph */}
      <svg
        ref={svgRef}
        className="relative z-10 w-full h-full transition-opacity duration-1000 opacity-100"
      />
    </div>
  )
}
