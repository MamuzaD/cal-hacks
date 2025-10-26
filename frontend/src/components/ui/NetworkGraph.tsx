import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { Node as NodeType, Edge as EdgeType } from '~/lib/mockData'

interface NetworkGraphProps {
  nodes: NodeType[]
  edges: EdgeType[]
}

interface SimulationNode extends NodeType {
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

export function NetworkGraph({ nodes, edges }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const width = 800
    const height = 600
    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height)

    // Create simulation
    const simulation = d3
      .forceSimulation(nodes as SimulationNode[])
      .force('link', d3.forceLink(edges).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40))

    // Create markers for arrowheads
    svg
      .append('defs')
      .selectAll('marker')
      .data(['stock-holding', 'campaign-contribution', 'lobbying', 'investment'])
      .enter()
      .append('marker')
      .attr('id', (d) => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', (d) => {
        if (d === 'stock-holding') return '#4ade80'
        if (d === 'campaign-contribution') return '#f87171'
        if (d === 'lobbying') return '#facc15'
        return '#60a5fa'
      })

    // Create links
    const link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .attr('stroke-width', 2)
      .attr('stroke', (d) => {
        if (d.type === 'stock-holding') return '#4ade80'
        if (d.type === 'campaign-contribution') return '#f87171'
        if (d.type === 'lobbying') return '#facc15'
        return '#60a5fa'
      })
      .attr('opacity', 0.6)
      .attr('marker-end', (d) => `url(#arrow-${d.type})`)

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

    // Add labels
    node
      .append('text')
      .text((d) => d.label)
      .attr('font-size', 12)
      .attr('dx', 20)
      .attr('dy', 5)
      .attr('fill', '#fff')
      .style('pointer-events', 'none')

    // Update positions on simulation tick
    simulation.on('tick', () => {
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

    // Cleanup on unmount
    return () => {
      simulation.stop()
      d3.select(svgRef.current).selectAll('*').remove()
    }
  }, [nodes, edges])

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border border-primary/20 bg-black/5">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  )
}

