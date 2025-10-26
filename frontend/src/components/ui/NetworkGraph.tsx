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
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
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
    
    // Calculate total value for each node based on connected edges
    const nodeValues = new Map<number, number>()
    nodes.forEach((node) => {
      let totalValue = 0
      processedEdges.forEach((edge) => {
        const sourceId = typeof edge.source === 'number' ? edge.source : (edge.source as any).id
        const targetId = typeof edge.target === 'number' ? edge.target : (edge.target as any).id
        
        if (sourceId === node.id || targetId === node.id) {
          totalValue += edge.holding_value || 0
        }
      })
      nodeValues.set(node.id, totalValue)
    })
    
    // Find min and max values for scaling
    const values = Array.from(nodeValues.values()).filter(v => v > 0)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    
    // Scale node size based on value (logarithmic scale for better distribution)
    // Adjust size ranges based on node count for better visibility in large graphs
    const centerNodeId = nodes[0]?.id // First node is the center
    
    const getNodeRadius = (nodeId: number): number => {
      const value = nodeValues.get(nodeId) || 0
      
      // Adaptive size ranges based on graph size
      let minRadius: number
      let maxRadius: number
      let centerRadius: number
      
      if (nodeCount > 500) {
        // Very large graphs: smaller nodes
        minRadius = 3
        maxRadius = 12
        centerRadius = 18 // Center node larger
      } else if (nodeCount > 200) {
        // Large graphs: medium-small nodes
        minRadius = 5
        maxRadius = 18
        centerRadius = 25
      } else if (nodeCount > 100) {
        // Medium-large graphs
        minRadius = 6
        maxRadius = 25
        centerRadius = 35
      } else if (nodeCount > 50) {
        // Medium graphs
        minRadius = 8
        maxRadius = 30
        centerRadius = 42
      } else {
        // Small graphs: larger nodes for detail
        minRadius = 10
        maxRadius = 40
        centerRadius = 50
      }
      
      // Center node is always the largest
      if (nodeId === centerNodeId) {
        return centerRadius
      }
      
      if (value === 0) return minRadius - 2 // minimum size for nodes with no value
      if (minValue === maxValue) return (minRadius + maxRadius) / 2
      
      // Log scale: smaller differences at high values, larger at low values
      const logMin = Math.log(minValue)
      const logMax = Math.log(maxValue)
      const logValue = Math.log(value)
      
      const normalizedValue = (logValue - logMin) / (logMax - logMin)
      return minRadius + normalizedValue * (maxRadius - minRadius)
    }
    
    // Adaptive force parameters for different graph sizes
    let linkDistance: number
    let chargeStrength: number
    let linkStrength: number
    let centerStrength: number
    let collisionBuffer: number
    
    if (nodeCount > 500) {
      // Very large graphs (500-1000+ nodes) - optimize for speed
      linkDistance = 20
      chargeStrength = -30 // Reduced repulsion
      linkStrength = 0.1 // Weaker links
      centerStrength = 0.05 // Stronger center force
      collisionBuffer = 1
    } else if (nodeCount > 200) {
      // Large graphs (200-500 nodes)
      linkDistance = 50
      chargeStrength = -100
      linkStrength = 0.3
      centerStrength = 0.08 // Stronger center force
      collisionBuffer = 3
    } else if (nodeCount > 100) {
      // Medium-large graphs (100-200 nodes)
      linkDistance = 80
      chargeStrength = -200
      linkStrength = 0.4
      centerStrength = 0.1 // Stronger center force
      collisionBuffer = 5
    } else if (nodeCount > 50) {
      // Medium graphs (50-100 nodes)
      linkDistance = 120
      chargeStrength = -400
      linkStrength = 0.5
      centerStrength = 0.1
      collisionBuffer = 10
    } else if (nodeCount > 30) {
      // Small-medium graphs (30-50 nodes)
      linkDistance = 150
      chargeStrength = -600
      linkStrength = 0.5
      centerStrength = 0.1
      collisionBuffer = 12
    } else {
      // Small graphs (<30 nodes)
      linkDistance = 180
      chargeStrength = -800
      linkStrength = 0.5
      centerStrength = 0.1
      collisionBuffer = 15
    }
    
    // Scale collision radius based on node sizes
    const collisionRadius = (d: any) => {
      const radius = getNodeRadius(d.id)
      return radius + collisionBuffer
    }

    // Create simulation with adaptive forces optimized for graph size
    const simulation = d3
      .forceSimulation(nodes as SimulationNode[])
      .force(
        'link',
        d3
          .forceLink(processedEdges)
          .id((d: any) => d.id)
          .distance(linkDistance)
          .strength(linkStrength)
          .iterations(nodeCount > 500 ? 1 : 2), // Fewer iterations for large graphs
      )
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(centerStrength))
      .force('collision', d3.forceCollide().radius(collisionRadius).iterations(1)) // Single collision iteration
      .force('x', d3.forceX(width / 2).strength(centerStrength))
      .force('y', d3.forceY(height / 2).strength(centerStrength))
      // Much faster convergence for large graphs
      .alphaDecay(nodeCount > 500 ? 0.1 : nodeCount > 200 ? 0.05 : nodeCount > 100 ? 0.03 : 0.02)
      .velocityDecay(nodeCount > 500 ? 0.7 : nodeCount > 200 ? 0.5 : 0.3) // More friction for large graphs
      .alphaTarget(nodeCount > 500 ? 0 : 0) // Stop immediately when settled for large graphs

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

    // Calculate adaptive visual parameters based on graph size
    let fontSize: number
    let showLabels: boolean
    let strokeWidth: number
    
    if (nodeCount > 500) {
      fontSize = 6
      showLabels = false // Hide labels for very large graphs to reduce clutter
      strokeWidth = 1
    } else if (nodeCount > 200) {
      fontSize = 7
      showLabels = false // Hide labels for large graphs
      strokeWidth = 1
    } else if (nodeCount > 100) {
      fontSize = 8
      showLabels = true
      strokeWidth = 1.5
    } else if (nodeCount > 50) {
      fontSize = 10
      showLabels = true
      strokeWidth = 2
    } else {
      fontSize = 12
      showLabels = true
      strokeWidth = 2
    }
    
    // No arrows needed - just lines connecting nodes

    // Helper function to calculate edge width based on value (scaled for graph size)
    const getEdgeWidth = (edge: ProcessedEdge): number => {
      if (!edge.holding_value) {
        // Default width scales with graph size
        return nodeCount > 500 ? 0.5 : nodeCount > 200 ? 0.8 : nodeCount > 100 ? 1 : 2
      }
      
      const value = Math.abs(edge.holding_value)
      
      // Scale width ranges based on graph size
      let widthMultiplier: number
      if (nodeCount > 500) {
        widthMultiplier = 0.3 // Very thin edges for large graphs
      } else if (nodeCount > 200) {
        widthMultiplier = 0.5
      } else if (nodeCount > 100) {
        widthMultiplier = 0.7
      } else {
        widthMultiplier = 1.0
      }
      
      // Use logarithmic scale for better visual distribution
      let baseWidth: number
      if (value < 1000) baseWidth = 1
      else if (value < 10000) baseWidth = 2
      else if (value < 50000) baseWidth = 3
      else if (value < 100000) baseWidth = 4
      else if (value < 500000) baseWidth = 5
      else if (value < 1000000) baseWidth = 6
      else if (value < 5000000) baseWidth = 7
      else if (value < 10000000) baseWidth = 8
      else if (value < 50000000) baseWidth = 9
      else baseWidth = 10
      
      return Math.max(0.5, baseWidth * widthMultiplier)
    }

    // Helper function to get edge opacity based on type
    const getEdgeOpacity = (edge: ProcessedEdge): number => {
      // Lobbying and contributions are "spending" - make them slightly more transparent
      if (edge.type === 'lobbying' || edge.type === 'campaign-contribution') {
        return 0.5
      }
      return 0.7 // holdings and investments are more solid
    }

    // Create a group for zoom/pan (must be created first)
    const g = svg.append('g')
    
    // Add zoom behavior for large graphs
    if (nodeCount >= 100) {
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 10]) // Allow 10% to 1000% zoom
        .on('zoom', (event) => {
          g.attr('transform', event.transform)
        })
      
      svg.call(zoom)
      zoomBehaviorRef.current = zoom
      
      // Set initial zoom - no transformation needed, start at normal view
      // The force simulation will center the graph naturally
    } else {
      zoomBehaviorRef.current = null
    }
    
    // Create links inside the zoom group
    const link = g
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
      // Optimize rendering for large graphs
      .style('shape-rendering', nodeCount > 500 ? 'optimizeSpeed' : 'auto')
    
    // Create nodes inside the zoom group (conditionally enable dragging)
    const node = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
    
    // Only enable dragging for smaller graphs
    if (nodeCount < 100) {
      node.call(drag(simulation))
    }

    // Add selection ring for selected nodes (rendered first, behind the main circle)
    node
      .append('circle')
      .attr('class', 'selection-ring')
      .attr('r', (d) => getNodeRadius(d.id) + 6)
      .attr('fill', 'none')
      .attr('stroke', '#fbbf24') // amber-400
      .attr('stroke-width', 3)
      .attr('opacity', 0) // Start with 0, will be updated by useEffect
      .style('pointer-events', 'none')
      .style('filter', 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))')

    // Add main circles for nodes with size based on total value
    node
      .append('circle')
      .attr('class', 'node-circle')
      .attr('r', (d) => getNodeRadius(d.id))
      .attr('fill', (d) => {
        if (d.type === 'company') return '#60a5fa'
        if (d.type === 'person') return '#4ade80'
        if (d.type === 'politician') return '#a855f7'
        return '#94a3b8'
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', strokeWidth)
      .style('cursor', 'pointer')
      // Optimize rendering for large graphs
      .style('shape-rendering', nodeCount > 500 ? 'optimizeSpeed' : 'auto')

    // Add labels with offset based on node size (conditionally for large graphs)
    if (showLabels) {
    node
      .append('text')
      .text((d) => d.name)
      .attr('font-size', fontSize)
        .attr('dx', (d) => getNodeRadius(d.id) + 3)
        .attr('dy', 4)
      .attr('fill', isDarkMode ? '#fff' : '#000')
      .attr('pointer-events', 'none')
    }

    // Add click handler to nodes
    node.on('click', (event, d) => {
      event.stopPropagation()
      if (onNodeSelect) {
        onNodeSelect(d as NodeType)
      }
    })

    // Update positions on simulation tick with throttling for large graphs
    let lastUpdate = 0
    const throttleDelay = nodeCount > 500 ? 50 : nodeCount > 200 ? 30 : 0 // ms between updates
    
    simulation.on('tick', () => {
      const now = Date.now()
      
      // Throttle updates for large graphs
      if (throttleDelay > 0 && now - lastUpdate < throttleDelay) {
        return
      }
      lastUpdate = now
      
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
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

    // Stop simulation early for large graphs to improve performance
    if (nodeCount > 500) {
      // Let it run for fewer iterations
      setTimeout(() => {
        simulation.stop()
      }, 2000) // Stop after 2 seconds for very large graphs
    } else if (nodeCount > 200) {
      setTimeout(() => {
        simulation.stop()
      }, 5000) // Stop after 5 seconds for large graphs
    }

    // Cleanup on unmount
    return () => {
      simulation.stop()
      d3.select(svgRef.current).selectAll('*').remove()
    }
  }, [nodes, edges, onNodeSelect]) // Removed selectedNodeId to prevent resetting on selection

  // Update label colors when theme changes
  useEffect(() => {
    if (!svgRef.current) return

    d3.select(svgRef.current)
      .selectAll('text')
      .attr('fill', isDarkMode ? '#fff' : '#000')
  }, [isDarkMode])

  // Update selection ring when selectedNodeId changes
  useEffect(() => {
    if (!svgRef.current) return

    d3.select(svgRef.current)
      .selectAll('.selection-ring')
      .attr('opacity', function(d: any) {
        return d.id === selectedNodeId ? 1 : 0
      })
  }, [selectedNodeId])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-lg overflow-hidden border border-primary/20"
    >
      {/* Gradient background - centered behind the SVG graph */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[875px] h-[700px] rounded-full bg-primary opacity-30 dark:opacity-19 blur-[110px] pointer-events-none" />

      {/* Glow effect removed - now using SVG-based selection ring */}

      {/* Zoom controls for large graphs */}
      {nodes.length >= 100 && (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <button
            onClick={() => {
              if (svgRef.current && zoomBehaviorRef.current) {
                const svg = d3.select(svgRef.current)
                svg.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.3)
              }
            }}
            className="bg-background/90 backdrop-blur-sm border border-primary/20 rounded-lg p-2 hover:bg-primary/10 transition-colors"
            title="Zoom In"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (svgRef.current && zoomBehaviorRef.current) {
                const svg = d3.select(svgRef.current)
                svg.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.7)
              }
            }}
            className="bg-background/90 backdrop-blur-sm border border-primary/20 rounded-lg p-2 hover:bg-primary/10 transition-colors"
            title="Zoom Out"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="8" y1="11" x2="14" y2="11" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (svgRef.current && zoomBehaviorRef.current) {
                const svg = d3.select(svgRef.current)
                // Reset to identity (no zoom, no pan)
                svg.transition().duration(500).call(zoomBehaviorRef.current.transform, d3.zoomIdentity)
              }
            }}
            className="bg-background/90 backdrop-blur-sm border border-primary/20 rounded-lg p-2 hover:bg-primary/10 transition-colors"
            title="Reset View"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
          </button>
        </div>
      )}

      {/* Navigation hint for large graphs */}
      {nodes.length >= 100 && (
        <div className="absolute bottom-4 left-4 z-20 bg-background/90 backdrop-blur-sm border border-primary/20 rounded-lg px-3 py-2 text-xs text-muted-foreground">
          <span className="font-medium">💡 Tip:</span> Scroll to zoom, drag to pan
        </div>
      )}

      {/* SVG Graph */}
      <svg
        ref={svgRef}
        className="relative z-10 w-full h-full transition-opacity duration-1000 opacity-100"
      />
    </div>
  )
}
