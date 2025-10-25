import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface GraphNode extends d3.SimulationNodeDatum {
  id: string
  label: string
  type: 'primary' | 'secondary' | 'tertiary'
  size: number
  color: string
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode
  target: string | GraphNode
  strength: number
}

export function GraphOverlay() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 600
    const height = 600
    const centerX = width / 2
    const centerY = height / 2

    // Define graph nodes with initial circular positions
    const nodes: Array<GraphNode> = [
      {
        id: 'center',
        label: 'Network',
        type: 'primary',
        size: 12,
        color: '#479ce6',
        x: centerX,
        y: centerY,
        // Remove fx and fy to allow dragging
      },
      {
        id: 'node1',
        label: 'Politicians',
        type: 'secondary',
        size: 10,
        color: '#887be3',
        x: centerX + Math.cos(0) * 120,
        y: centerY + Math.sin(0) * 120,
      },
      {
        id: 'node2',
        label: 'Companies',
        type: 'secondary',
        size: 10,
        color: '#887be3',
        x: centerX + Math.cos((2 * Math.PI) / 3) * 120,
        y: centerY + Math.sin((2 * Math.PI) / 3) * 120,
      },
      {
        id: 'node3',
        label: 'PACs',
        type: 'secondary',
        size: 10,
        color: '#887be3',
        x: centerX + Math.cos((4 * Math.PI) / 3) * 120,
        y: centerY + Math.sin((4 * Math.PI) / 3) * 120,
      },
      {
        id: 'node4',
        label: 'Campaign Finance',
        type: 'tertiary',
        size: 8,
        color: '#7681a3',
        x: centerX + Math.cos(Math.PI / 4) * 200,
        y: centerY + Math.sin(Math.PI / 4) * 200,
      },
      {
        id: 'node5',
        label: 'Lobbying',
        type: 'tertiary',
        size: 8,
        color: '#7681a3',
        x: centerX + Math.cos((3 * Math.PI) / 4) * 200,
        y: centerY + Math.sin((3 * Math.PI) / 4) * 200,
      },
      {
        id: 'node6',
        label: 'Stock Holdings',
        type: 'tertiary',
        size: 8,
        color: '#7681a3',
        x: centerX + Math.cos((5 * Math.PI) / 4) * 200,
        y: centerY + Math.sin((5 * Math.PI) / 4) * 200,
      },
      {
        id: 'node7',
        label: 'Bills & Votes',
        type: 'tertiary',
        size: 8,
        color: '#7681a3',
        x: centerX + Math.cos((7 * Math.PI) / 4) * 200,
        y: centerY + Math.sin((7 * Math.PI) / 4) * 200,
      },
    ]

    // Define links
    const links: Array<GraphLink> = [
      { source: 'center', target: 'node1', strength: 0.8 }, // Network -> Politicians
      { source: 'center', target: 'node2', strength: 0.8 }, // Network -> Companies
      { source: 'center', target: 'node3', strength: 0.8 }, // Network -> PACs
      { source: 'node1', target: 'node4', strength: 0.7 }, // Politicians -> Campaign Finance
      { source: 'node1', target: 'node6', strength: 0.6 }, // Politicians -> Stock Holdings
      { source: 'node1', target: 'node7', strength: 0.7 }, // Politicians -> Bills & Votes
      { source: 'node2', target: 'node5', strength: 0.7 }, // Companies -> Lobbying
      { source: 'node2', target: 'node6', strength: 0.6 }, // Companies -> Stock Holdings
      { source: 'node3', target: 'node4', strength: 0.6 }, // PACs -> Campaign Finance
      { source: 'node3', target: 'node5', strength: 0.5 }, // PACs -> Lobbying
    ]

    // Create force simulation with radial force for circular layout
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(100)
          .strength(0.2),
      )
      .force('charge', d3.forceManyBody().strength(-150))
      .force(
        'radial',
        d3
          .forceRadial<GraphNode>(
            (d) =>
              d.type === 'secondary' ? 120 : d.type === 'tertiary' ? 200 : 0,
            centerX,
            centerY,
          )
          .strength(0.8),
      )
      .force('collision', d3.forceCollide().radius(50))
      .alphaDecay(0.02)

    // Create container group
    const g = svg.append('g')

    // Add gradient definitions
    const defs = svg.append('defs')

    // Link gradient
    const linkGradient = defs
      .append('linearGradient')
      .attr('id', 'link-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')

    linkGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#479ce6')
      .attr('stop-opacity', 0.6)

    linkGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#887be3')
      .attr('stop-opacity', 0.4)

    // Create links
    const linkGroup = g.append('g').attr('class', 'links')

    const link = linkGroup
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'url(#link-gradient)')
      .attr('stroke-width', (d) => d.strength * 2)
      .attr('stroke-opacity', 0.4)
      .style('filter', 'drop-shadow(0 0 2px rgba(71, 156, 230, 0.3))')

    // Add animated particles on links
    const particles = linkGroup
      .selectAll('circle.particle')
      .data(links)
      .join('circle')
      .attr('class', 'particle')
      .attr('r', 1.5)
      .attr('fill', '#479ce6')
      .style('opacity', 0.7)
      .style('filter', 'drop-shadow(0 0 3px rgba(71, 156, 230, 0.6))')

    // Create nodes
    const nodeGroup = g.append('g').attr('class', 'nodes')

    const node = nodeGroup
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node-group')
      .attr('cursor', 'grab')
      .style('pointer-events', 'all')

    // Add glow effect
    node
      .append('circle')
      .attr('class', 'node-glow')
      .attr('r', (d) => d.size + 4)
      .attr('fill', (d) => d.color)
      .attr('opacity', 0)
      .style('filter', (d) => `blur(8px) drop-shadow(0 0 12px ${d.color})`)
      .style('transition', 'all 0.3s ease')

    // Add main node circle
    node
      .append('circle')
      .attr('class', 'node-main')
      .attr('r', (d) => d.size)
      .attr('fill', (d) => {
        const colors = {
          '#479ce6': 'rgba(71, 156, 230, 0.2)', // Network - Blue
          '#887be3': 'rgba(136, 123, 227, 0.2)', // Main entities - Purple
          '#7681a3': 'rgba(118, 129, 163, 0.2)', // Data types - Gray
        }
        return (
          colors[d.color as keyof typeof colors] || 'rgba(71, 156, 230, 0.2)'
        )
      })
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 1.5)
      .style('filter', (d) => `drop-shadow(0 0 6px ${d.color})`)
      .style('backdrop-filter', 'blur(8px)')
      .style('transition', 'all 0.3s ease')

    // Add labels
    node
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => d.size + 15)
      .attr('font-size', '10px')
      .attr('font-weight', '500')
      .attr('fill', '#E8EAED')
      .attr('pointer-events', 'none')
      .style('filter', 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.8))')
      .text((d) => d.label)

    // Add drag behavior
    const dragBehavior = d3
      .drag<SVGGElement, GraphNode>()
      .on('start', function (event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
        d3.select(this).style('cursor', 'grabbing')
        // Add visual feedback during drag
        d3.select(this).select('.node-glow').attr('opacity', 0.6)
        d3.select(this).select('.node-main').attr('stroke-width', 3)
      })
      .on('drag', function (event, d) {
        d.fx = event.x
        d.fy = event.y
      })
      .on('end', function (event, d) {
        if (!event.active) simulation.alphaTarget(0)
        // Allow node to float freely after dragging
        d.fx = null
        d.fy = null
        d3.select(this).style('cursor', 'grab')
        // Remove visual feedback
        d3.select(this).select('.node-glow').attr('opacity', 0)
        d3.select(this).select('.node-main').attr('stroke-width', 1.5)
      })

    node.call(dragBehavior)

    // Add interaction handlers
    node
      .on('mouseenter', function (_event, d) {
        d3.select(this)
          .select('.node-glow')
          .transition()
          .duration(200)
          .attr('opacity', 0.4)

        d3.select(this)
          .select('.node-main')
          .transition()
          .duration(200)
          .attr('r', d.size + 2)
          .attr('stroke-width', 2.5)

        link
          .style('stroke-opacity', (l) =>
            (l.source as GraphNode).id === d.id ||
            (l.target as GraphNode).id === d.id
              ? 0.8
              : 0.2,
          )
          .style('stroke-width', (l) =>
            (l.source as GraphNode).id === d.id ||
            (l.target as GraphNode).id === d.id
              ? l.strength * 3
              : l.strength * 2,
          )
      })
      .on('mouseleave', function (_event, d) {
        d3.select(this)
          .select('.node-glow')
          .transition()
          .duration(200)
          .attr('opacity', 0)

        d3.select(this)
          .select('.node-main')
          .transition()
          .duration(200)
          .attr('r', d.size)
          .attr('stroke-width', 1.5)

        link
          .style('stroke-opacity', 0.4)
          .style('stroke-width', (l) => l.strength * 2)
      })

    // Animate particles using requestAnimationFrame (better performance)
    let particleProgress = 0
    let animationFrameId: number

    const animateParticles = () => {
      particleProgress = (particleProgress + 0.008) % 1
      particles
        .attr('cx', (d) => {
          const source = d.source as GraphNode
          const target = d.target as GraphNode
          if (!source.x || !target.x) return 0
          return source.x + (target.x - source.x) * particleProgress
        })
        .attr('cy', (d) => {
          const source = d.source as GraphNode
          const target = d.target as GraphNode
          if (!source.y || !target.y) return 0
          return source.y + (target.y - source.y) * particleProgress
        })

      animationFrameId = requestAnimationFrame(animateParticles)
    }

    // Start particle animation independently
    animateParticles()

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as GraphNode).x!)
        .attr('y1', (d) => (d.source as GraphNode).y!)
        .attr('x2', (d) => (d.target as GraphNode).x!)
        .attr('y2', (d) => (d.target as GraphNode).y!)

      node.attr('transform', (d) => `translate(${d.x},${d.y})`)
    })

    // Show graph after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    // Cleanup
    return () => {
      simulation.stop()
      clearTimeout(timer)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div
      className="absolute top-24 right-32 w-[600px] h-[600px] z-10 pointer-events-auto"
      onWheel={(e) => e.preventDefault()}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% {
            r: 8;
            opacity: 0.3;
          }
          50% {
            r: 12;
            opacity: 0.1;
          }
        }
      `}</style>
      <svg
        ref={svgRef}
        className={`w-full h-full transition-opacity duration-1000 pointer-events-auto ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  )
}
