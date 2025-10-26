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

// Node size constants
const PRIMARY_SIZE = 36
const SECONDARY_SIZE = 25
const TERTIARY_SIZE = 20

export function HeroGraph() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  // Check if we should render based on screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setShouldRender(window.innerWidth >= 768) // md breakpoint is 768px
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    if (!svgRef.current || !shouldRender) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 500
    const height = 400
    const centerX = width / 2
    const centerY = height / 2

    // Define graph nodes with initial circular positions
    const nodes: Array<GraphNode> = [
      {
        id: 'center',
        label: 'Network',
        type: 'primary',
        size: PRIMARY_SIZE,
        color: '#479ce6',
        x: centerX,
        y: centerY,
      },
      {
        id: 'node1',
        label: 'Politicians',
        type: 'secondary',
        size: SECONDARY_SIZE,
        color: '#887be3',
        x: centerX + Math.cos(0) * 100,
        y: centerY + Math.sin(0) * 100,
      },
      {
        id: 'node2',
        label: 'Companies',
        type: 'secondary',
        size: SECONDARY_SIZE,
        color: '#887be3',
        x: centerX + Math.cos((2 * Math.PI) / 3) * 100,
        y: centerY + Math.sin((2 * Math.PI) / 3) * 100,
      },
      {
        id: 'node3',
        label: 'PACs',
        type: 'secondary',
        size: SECONDARY_SIZE,
        color: '#887be3',
        x: centerX + Math.cos((4 * Math.PI) / 3) * 100,
        y: centerY + Math.sin((4 * Math.PI) / 3) * 100,
      },
      {
        id: 'node4',
        label: 'Campaign Finance',
        type: 'tertiary',
        size: TERTIARY_SIZE,
        color: '#7681a3',
        x: centerX + Math.cos(Math.PI / 4) * 160,
        y: centerY + Math.sin(Math.PI / 4) * 160,
      },
      {
        id: 'node5',
        label: 'Lobbying',
        type: 'tertiary',
        size: TERTIARY_SIZE,
        color: '#7681a3',
        x: centerX + Math.cos((3 * Math.PI) / 4) * 160,
        y: centerY + Math.sin((3 * Math.PI) / 4) * 160,
      },
      {
        id: 'node6',
        label: 'Stock Holdings',
        type: 'tertiary',
        size: TERTIARY_SIZE,
        color: '#7681a3',
        x: centerX + Math.cos((5 * Math.PI) / 4) * 160,
        y: centerY + Math.sin((5 * Math.PI) / 4) * 160,
      },
      {
        id: 'node7',
        label: 'Bills & Votes',
        type: 'tertiary',
        size: TERTIARY_SIZE,
        color: '#7681a3',
        x: centerX + Math.cos((7 * Math.PI) / 4) * 160,
        y: centerY + Math.sin((7 * Math.PI) / 4) * 160,
      },
    ]

    // Define links
    const links: Array<GraphLink> = [
      { source: 'center', target: 'node1', strength: 0.8 },
      { source: 'center', target: 'node2', strength: 0.8 },
      { source: 'center', target: 'node3', strength: 0.8 },
      { source: 'node1', target: 'node4', strength: 0.7 },
      { source: 'node1', target: 'node6', strength: 0.6 },
      { source: 'node1', target: 'node7', strength: 0.7 },
      { source: 'node2', target: 'node5', strength: 0.7 },
      { source: 'node2', target: 'node6', strength: 0.6 },
      { source: 'node3', target: 'node4', strength: 0.6 },
      { source: 'node3', target: 'node5', strength: 0.5 },
    ]

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(200)
          .strength(0.3),
      )
      .force('charge', d3.forceManyBody().strength(-120))
      .force(
        'radial',
        d3
          .forceRadial<GraphNode>(
            (d) =>
              d.type === 'secondary' ? 100 : d.type === 'tertiary' ? 160 : 0,
            centerX,
            centerY,
          )
          .strength(0.8),
      )
      .force('collision', d3.forceCollide().radius(40))
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
      .attr('r', (d) => d.size + 3)
      .attr('fill', (d) => d.color)
      .attr('opacity', 0)
      .style('filter', (d) => `blur(8px) drop-shadow(0 0 12px ${d.color})`)

    // Add main node circle
    node
      .append('circle')
      .attr('class', 'node-main')
      .attr('r', (d) => d.size)
      .attr('fill', (d) => {
        const colors = {
          '#479ce6': 'rgba(71, 156, 230, 0.8)',
          '#887be3': 'rgba(136, 123, 227, 0.8)',
          '#7681a3': 'rgba(118, 129, 163, 0.8)',
        }
        return (
          colors[d.color as keyof typeof colors] || 'rgba(71, 156, 230, 0.2)'
        )
      })
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 1.5)
      .style('filter', (d) => `drop-shadow(0 0 6px ${d.color})`)

    // Add labels with smaller font
    node
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => d.size + 12)
      .attr('font-size', '8px')
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
        d3.select(this).select('.node-glow').attr('opacity', 0.6)
        d3.select(this).select('.node-main').attr('stroke-width', 3)
      })
      .on('drag', function (event, d) {
        const nodeRadius = d.size + 10
        d.fx = Math.max(nodeRadius, Math.min(width - nodeRadius, event.x))
        d.fy = Math.max(nodeRadius, Math.min(height - nodeRadius, event.y))
      })
      .on('end', function (event, d) {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
        d3.select(this).style('cursor', 'grab')
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

    // Animate particles using requestAnimationFrame
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
  }, [shouldRender])

  if (!shouldRender) return null

  return (
    <div className="relative w-full h-[400px] overflow-visible flex items-center justify-center">
      {/* Gradient background - centered behind the SVG graph */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full bg-primary opacity-30 dark:opacity-19 blur-[110px] animate-float pointer-events-none" />

      {/* SVG Graph */}
      <div className="relative z-10 w-full h-full">
        <svg
          ref={svgRef}
          className={`w-full h-full transition-opacity duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
    </div>
  )
}
