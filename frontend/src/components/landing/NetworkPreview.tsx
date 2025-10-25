import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { landingPage } from '~/constants'

interface Node extends d3.SimulationNodeDatum {
  id: string
  label: string
  type: 'center' | 'connection'
  icon: string
  color: string
  description: string
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node
  target: string | Node
  value: number
}

export function NetworkPreview() {
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const { hero } = landingPage

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    const tooltip = d3.select(tooltipRef.current)
    svg.selectAll('*').remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Define nodes with descriptions
    const nodes: Array<Node> = [
      {
        id: 'center',
        label: 'Pfizer',
        type: 'center',
        icon: '🏢',
        color: '#479ce6',
        description: 'Pharmaceutical company',
      },
      {
        id: 'lawmakers',
        label: '15 Lawmakers',
        type: 'connection',
        icon: '👥',
        color: '#887be3',
        description: 'Congressional representatives',
      },
      {
        id: 'bills',
        label: '28 Bills',
        type: 'connection',
        icon: '📄',
        color: '#479ce6',
        description: 'Healthcare legislation',
      },
      {
        id: 'lobbyists',
        label: '8 Lobbyists',
        type: 'connection',
        icon: '🏛️',
        color: '#7681a3',
        description: 'Registered lobbyists',
      },
      {
        id: 'universities',
        label: '12 Universities',
        type: 'connection',
        icon: '📈',
        color: '#887be3',
        description: 'Research institutions',
      },
    ]

    // Define links with weights
    const links: Array<Link> = [
      { source: 'center', target: 'lawmakers', value: 3 },
      { source: 'center', target: 'bills', value: 2 },
      { source: 'center', target: 'lobbyists', value: 3 },
      { source: 'center', target: 'universities', value: 2 },
      { source: 'lawmakers', target: 'bills', value: 2 },
      { source: 'lobbyists', target: 'bills', value: 2 },
    ]

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink<Node, Link>(links)
          .id((d) => d.id)
          .distance(140)
          .strength(0.9),
      )
      .force('charge', d3.forceManyBody().strength(-600))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60))

    // Create container group
    const g = svg.append('g')

    // Add gradient definition for links
    const defs = svg.append('defs')
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'line-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#479ce6')
      .attr('stop-opacity', 0.8)

    gradient
      .append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#887be3')
      .attr('stop-opacity', 0.6)

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#479ce6')
      .attr('stop-opacity', 0.8)

    // Add animated particles on links
    const linkGroup = g.append('g').attr('class', 'links')

    // Create link paths
    const link = linkGroup
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'url(#line-gradient)')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', (d) => Math.sqrt(d.value) * 1.5)
      .style('filter', 'drop-shadow(0 0 3px rgba(71, 156, 230, 0.5))')
      .style('transition', 'all 0.3s ease')

    // Add animated circles on links
    const particles = linkGroup
      .selectAll('circle.particle')
      .data(links)
      .join('circle')
      .attr('class', 'particle')
      .attr('r', 2.5)
      .attr('fill', '#479ce6')
      .style('opacity', 0.8)
      .style('filter', 'drop-shadow(0 0 4px rgba(71, 156, 230, 0.8))')

    // Create node groups
    const nodeGroup = g.append('g').attr('class', 'nodes')

    const dragBehavior = d3
      .drag<SVGGElement, Node>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)

    const node = nodeGroup
      .selectAll<SVGGElement, Node>('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .attr('class', 'node-group')
      .call(dragBehavior)

    // Add outer glow circle for hover effect
    node
      .append('circle')
      .attr('class', 'node-glow')
      .attr('r', (d) => (d.type === 'center' ? 45 : 35))
      .attr('fill', (d) => d.color)
      .attr('opacity', 0)
      .style('filter', (d) => `blur(15px) drop-shadow(0 0 20px ${d.color})`)
      .style('transition', 'all 0.3s ease')

    // Add pulse animation circle
    node
      .append('circle')
      .attr('class', 'node-pulse')
      .attr('r', (d) => (d.type === 'center' ? 38 : 30))
      .attr('fill', 'none')
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.4)
      .style('filter', (d) => `drop-shadow(0 0 6px ${d.color})`)
      .style('animation', 'pulse 2s ease-in-out infinite')

    // Add main circle to nodes
    node
      .append('circle')
      .attr('class', 'node-main')
      .attr('r', (d) => (d.type === 'center' ? 38 : 30))
      .attr(
        'fill',
        (d) =>
          `rgba(${d.color === '#479ce6' ? '71, 156, 230' : d.color === '#887be3' ? '136, 123, 227' : '118, 129, 163'}, 0.15)`,
      )
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 2)
      .style('filter', (d) => `drop-shadow(0 0 10px ${d.color})`)
      .style('backdrop-filter', 'blur(10px)')
      .style('transition', 'all 0.3s ease')

    // Add emoji icons
    node
      .append('text')
      .attr('class', 'node-icon')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', (d) => (d.type === 'center' ? '24px' : '18px'))
      .attr('pointer-events', 'none')
      .text((d) => d.icon)

    // Add labels
    node
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => (d.type === 'center' ? '55px' : '47px'))
      .attr('font-size', (d) => (d.type === 'center' ? '13px' : '11px'))
      .attr('font-weight', '600')
      .attr('fill', '#E8EAED')
      .attr('pointer-events', 'none')
      .style('filter', 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.8))')
      .text((d) => d.label)

    // Add interaction handlers
    node
      .on('mouseenter', function (_event, d) {
        // Highlight node
        d3.select(this)
          .select('.node-glow')
          .transition()
          .duration(200)
          .attr('opacity', 0.5)

        d3.select(this)
          .select('.node-main')
          .transition()
          .duration(200)
          .attr('r', d.type === 'center' ? 42 : 34)
          .attr('stroke-width', 3)

        // Show tooltip
        tooltip.style('opacity', '1').style('visibility', 'visible').html(`
            <div class="font-bold text-sm mb-1">${d.label}</div>
            <div class="text-xs text-muted-foreground">${d.description}</div>
          `)

        // Highlight connected links
        link
          .style('stroke-opacity', (l) =>
            (l.source as Node).id === d.id || (l.target as Node).id === d.id
              ? 0.8
              : 0.15,
          )
          .style('stroke-width', (l) =>
            (l.source as Node).id === d.id || (l.target as Node).id === d.id
              ? Math.sqrt(l.value) * 2.5
              : Math.sqrt(l.value) * 1.5,
          )
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', `${event.offsetX + 15}px`)
          .style('top', `${event.offsetY + 15}px`)
      })
      .on('mouseleave', function (_event, d) {
        // Reset node
        d3.select(this)
          .select('.node-glow')
          .transition()
          .duration(200)
          .attr('opacity', 0)

        d3.select(this)
          .select('.node-main')
          .transition()
          .duration(200)
          .attr('r', d.type === 'center' ? 38 : 30)
          .attr('stroke-width', 2)

        // Hide tooltip
        tooltip.style('opacity', '0').style('visibility', 'hidden')

        // Reset links
        link
          .style('stroke-opacity', 0.3)
          .style('stroke-width', (l) => Math.sqrt(l.value) * 1.5)
      })
      .on('click', function (event, d) {
        event.stopPropagation()
        setSelectedNode(d.id === selectedNode ? null : d.id)
      })

    // Animate particles along links
    let particleProgress = 0
    const animateParticles = () => {
      particleProgress = (particleProgress + 0.01) % 1
      particles
        .attr('cx', (d) => {
          const source = d.source as Node
          const target = d.target as Node
          return source.x! + (target.x! - source.x!) * particleProgress
        })
        .attr('cy', (d) => {
          const source = d.source as Node
          const target = d.target as Node
          return source.y! + (target.y! - source.y!) * particleProgress
        })
    }

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as Node).x!)
        .attr('y1', (d) => (d.source as Node).y!)
        .attr('x2', (d) => (d.target as Node).x!)
        .attr('y2', (d) => (d.target as Node).y!)

      animateParticles()

      node.attr('transform', (d) => `translate(${d.x},${d.y})`)
    })

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Handle window resize
    const handleResize = () => {
      const newWidth = svgRef.current?.clientWidth || width
      const newHeight = svgRef.current?.clientHeight || height
      simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2))
      simulation.alpha(0.3).restart()
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      simulation.stop()
      window.removeEventListener('resize', handleResize)
    }
  }, [selectedNode])

  return (
    <div className="mt-20 relative">
      <style>{`
        @keyframes pulse {
          0%, 100% {
            r: 38;
            opacity: 0.4;
          }
          50% {
            r: 48;
            opacity: 0.1;
          }
        }
      `}</style>
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl opacity-50 blur-xl group-hover:opacity-70 transition-opacity" />
        <div className="relative glass-strong border border-white/10 rounded-3xl p-6 overflow-hidden">
          <div className="absolute top-6 left-6 glass px-4 py-2 rounded-lg text-xs font-semibold text-primary border border-primary/30 z-10 glow-cyan">
            <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2 animate-pulse-glow" />
            {hero.previewLabel}
          </div>
          <div className="relative">
            <svg
              ref={svgRef}
              className="w-full h-[450px]"
              preserveAspectRatio="xMidYMid meet"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(71, 156, 230, 0.03), transparent)',
              }}
            />
            <div
              ref={tooltipRef}
              className="absolute pointer-events-none glass-strong px-4 py-3 rounded-xl text-sm border border-white/20 transition-opacity duration-200 z-20 opacity-0 invisible"
              style={{ backdropFilter: 'blur(20px)' }}
            />
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <div className="text-muted-foreground text-sm font-light">
              {hero.previewDescription}
            </div>
            <div className="mt-3 flex items-center justify-center gap-6 text-xs text-muted-foreground/70">
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
                Drag nodes
              </span>
              <span className="opacity-50">•</span>
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-secondary rounded-full animate-pulse-glow" />
                Hover for details
              </span>
              <span className="opacity-50">•</span>
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-[#7681a3] rounded-full animate-pulse-glow" />
                Scroll to zoom
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
