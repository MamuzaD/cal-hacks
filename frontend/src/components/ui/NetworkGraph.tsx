import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { Node as NodeType, Edge as EdgeType } from '~/lib/mockData'
import { useDark } from '~/lib/dark-mode'

interface NetworkGraphProps {
  nodes: NodeType[]
  edges: EdgeType[]
  onNodeSelect?: (node: NodeType) => void
  selectedNodeId?: number
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
  status?: 'active' | 'sold'
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
          holding_value: (edge.holding_value || 0) + (reverseEdge.holding_value || 0),
          status: edge.status === 'sold' || reverseEdge.status === 'sold' ? 'sold' : edge.status,
        })

        processedPairs.add(pairKey)
      } else {
        // Unidirectional edge
        processedEdges.push({ ...edge, status: edge.status })
      }
    })

    // Calculate dynamic force parameters based on node count
    const nodeCount = nodes.length
    
    // Scale link distance with node count (more nodes = more distance)
    const linkDistance = nodeCount > 50 ? 150 : 
                        nodeCount > 30 ? 120 : 
                        nodeCount > 15 ? 100 : 80
    
    // Scale charge strength with node count (more nodes = stronger repulsion)
    const chargeStrength = nodeCount > 50 ? -800 : 
                          nodeCount > 30 ? -600 : 
                          nodeCount > 15 ? -400 : -300
    
    // Scale collision radius with node count
    const collisionRadius = nodeCount > 50 ? 50 : 
                           nodeCount > 30 ? 45 : 
                           nodeCount > 15 ? 40 : 35

    // Create simulation with adaptive forces
    const simulation = d3
      .forceSimulation(nodes as SimulationNode[])
      .force(
        'link',
        d3
          .forceLink(processedEdges)
          .id((d: any) => d.id)
          .distance(linkDistance)
          .strength(0.5), // Slightly weaker links to allow more spreading
      )
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.05)) // Weaker center force
      .force('collision', d3.forceCollide().radius(collisionRadius))
      .force('x', d3.forceX(width / 2).strength(0.02)) // Very weak x-centering
      .force('y', d3.forceY(height / 2).strength(0.02)) // Very weak y-centering
      .alphaDecay(0.02) // Slower decay for better stabilization
      .velocityDecay(0.3) // More "friction" to slow down nodes

    // Helper function to get edge color based on type and status
    const getEdgeColor = (type: string, status?: string): string => {
      // For stock-holding, status determines color
      if (type === 'stock-holding' && status === 'sold') {
        return '#06b6d4' // cyan-500 for sold positions (profit/loss realized)
      }
      
      // Type-based colors (for active holdings and other types)
      if (type === 'stock-holding') return '#22c55e' // green-500 for active holdings
      if (type === 'campaign-contribution') return '#ef4444' // red-500
      if (type === 'lobbying') return '#eab308' // yellow-500
      if (type === 'investment') return '#3b82f6' // blue-500

      // Combined types - blend colors or use distinct colors
      if (type.includes(' + ')) {
        if (type.includes('stock-holding') && type.includes('lobbying'))
          return '#84cc16' // lime-500
        if (
          type.includes('stock-holding') &&
          type.includes('campaign-contribution')
        )
          return '#f59e0b' // amber-500
        if (type.includes('lobbying') && type.includes('campaign-contribution'))
          return '#fb923c' // orange-400
        if (type.includes('stock-holding') && type.includes('investment'))
          return '#14b8a6' // teal-500
        if (type.includes('lobbying') && type.includes('investment'))
          return '#a855f7' // purple-500
        if (
          type.includes('campaign-contribution') &&
          type.includes('investment')
        )
          return '#ec4899' // pink-500
        return '#8b5cf6' // violet-500 for other combinations
      }

      return '#6366f1' // indigo-500 default
    }

    // Calculate adaptive visual parameters early (needed for markers)
    const nodeRadius = nodeCount > 50 ? 12 : nodeCount > 30 ? 14 : 15
    const fontSize = nodeCount > 50 ? 10 : nodeCount > 30 ? 11 : 12
    const labelOffset = nodeRadius + 5
    
    // No arrows needed - just lines connecting nodes

    // Helper function to calculate edge width based on value
    const getEdgeWidth = (edge: ProcessedEdge): number => {
      if (!edge.holding_value) return 2 // default width
      
      const value = Math.abs(edge.holding_value)
      
      // Use logarithmic scale for better visual distribution
      // Maps values to width range [1, 10]
      if (value < 1000) return 1
      if (value < 10000) return 2
      if (value < 50000) return 3
      if (value < 100000) return 4
      if (value < 500000) return 5
      if (value < 1000000) return 6
      if (value < 5000000) return 7
      if (value < 10000000) return 8
      if (value < 50000000) return 9
      return 10
    }

    // Helper function to get edge opacity based on type
    const getEdgeOpacity = (edge: ProcessedEdge): number => {
      // Lobbying and contributions are "spending" - make them slightly more transparent
      if (edge.type === 'lobbying' || edge.type === 'campaign-contribution') {
        return 0.5
      }
      return 0.7 // holdings and investments are more solid
    }

    // Create links
    const link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(processedEdges)
      .enter()
      .append('line')
      .attr('stroke-width', (d: ProcessedEdge) => getEdgeWidth(d))
      .attr('stroke', (d: ProcessedEdge) => getEdgeColor(d.type, d.status))
      .attr('opacity', (d: ProcessedEdge) => {
        // Higher opacity for sold/special statuses
        if (d.status && d.status !== 'active') return 0.85
        return getEdgeOpacity(d)
      })
      .attr('stroke-dasharray', (d: ProcessedEdge) => {
        // Dashed line for sold positions (only for stock-holding)
        if (d.type === 'stock-holding' && d.status === 'sold') return '5,5'
        return null
      })

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
      .attr('r', (_d, i) => {
        // Make the first node (center entity) slightly larger
        return i === 0 ? nodeRadius + 3 : nodeRadius
      })
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
      .text((d) => d.name)
      .attr('font-size', fontSize)
      .attr('dx', labelOffset)
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
