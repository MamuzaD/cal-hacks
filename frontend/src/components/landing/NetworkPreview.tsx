import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { landingPage } from "~/constants";

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: "center" | "connection";
  icon: string;
  color: string;
  description: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  value: number;
}

export function NetworkPreview() {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const { hero } = landingPage;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Define nodes with descriptions
    const nodes: Node[] = [
      { 
        id: "center", 
        label: "Pfizer", 
        type: "center", 
        icon: "🏢", 
        color: "#479ce6",
        description: "Pharmaceutical company"
      },
      { 
        id: "lawmakers", 
        label: "15 Lawmakers", 
        type: "connection", 
        icon: "👥", 
        color: "#f43f5e",
        description: "Congressional representatives"
      },
      { 
        id: "bills", 
        label: "28 Bills", 
        type: "connection", 
        icon: "📄", 
        color: "#887be3",
        description: "Healthcare legislation"
      },
      { 
        id: "lobbyists", 
        label: "8 Lobbyists", 
        type: "connection", 
        icon: "🏛️", 
        color: "#479ce6",
        description: "Registered lobbyists"
      },
      { 
        id: "universities", 
        label: "12 Universities", 
        type: "connection", 
        icon: "📈", 
        color: "#10b981",
        description: "Research institutions"
      },
    ];

    // Define links with weights
    const links: Link[] = [
      { source: "center", target: "lawmakers", value: 3 },
      { source: "center", target: "bills", value: 2 },
      { source: "center", target: "lobbyists", value: 3 },
      { source: "center", target: "universities", value: 2 },
      { source: "lawmakers", target: "bills", value: 2 },
      { source: "lobbyists", target: "bills", value: 2 },
    ];

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink<Node, Link>(links)
          .id((d) => d.id)
          .distance(140)
          .strength(0.9)
      )
      .force("charge", d3.forceManyBody().strength(-600))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60));

    // Create container group
    const g = svg.append("g");

    // Add animated particles on links
    const linkGroup = g.append("g").attr("class", "links");

    // Create link paths
    const link = linkGroup
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#7681a3")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", (d) => Math.sqrt(d.value) * 2)
      .attr("stroke-dasharray", "5,5")
      .style("transition", "all 0.3s ease");

    // Add animated circles on links
    const particles = linkGroup
      .selectAll("circle.particle")
      .data(links)
      .join("circle")
      .attr("class", "particle")
      .attr("r", 3)
      .attr("fill", "#479ce6")
      .style("opacity", 0.6);

    // Create node groups
    const nodeGroup = g.append("g").attr("class", "nodes");

    const dragBehavior = d3
      .drag<SVGGElement, Node>()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    const node = nodeGroup
      .selectAll<SVGGElement, Node>("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .attr("class", "node-group")
      .call(dragBehavior);

    // Add outer glow circle for hover effect
    node
      .append("circle")
      .attr("class", "node-glow")
      .attr("r", (d) => (d.type === "center" ? 42 : 35))
      .attr("fill", (d) => d.color)
      .attr("opacity", 0)
      .style("transition", "all 0.3s ease");

    // Add pulse animation circle
    node
      .append("circle")
      .attr("class", "node-pulse")
      .attr("r", (d) => (d.type === "center" ? 35 : 28))
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 2)
      .attr("opacity", 0.6)
      .style("animation", "pulse 2s ease-in-out infinite");

    // Add main circle to nodes
    node
      .append("circle")
      .attr("class", "node-main")
      .attr("r", (d) => (d.type === "center" ? 35 : 28))
      .attr("fill", (d) => d.color)
      .attr("stroke", "#1c1917")
      .attr("stroke-width", 3)
      .style("filter", "drop-shadow(4px 4px 0px rgba(0,0,0,0.8))")
      .style("transition", "all 0.3s ease");

    // Add emoji icons
    node
      .append("text")
      .attr("class", "node-icon")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", (d) => (d.type === "center" ? "24px" : "18px"))
      .attr("pointer-events", "none")
      .text((d) => d.icon);

    // Add labels
    node
      .append("text")
      .attr("class", "node-label")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => (d.type === "center" ? "50px" : "42px"))
      .attr("font-size", (d) => (d.type === "center" ? "14px" : "12px"))
      .attr("font-weight", "700")
      .attr("fill", "#1c1917")
      .attr("pointer-events", "none")
      .text((d) => d.label);

    // Add interaction handlers
    node
      .on("mouseenter", function (_event, d) {
        // Highlight node
        d3.select(this)
          .select(".node-glow")
          .transition()
          .duration(200)
          .attr("opacity", 0.3);

        d3.select(this)
          .select(".node-main")
          .transition()
          .duration(200)
          .attr("r", (d.type === "center" ? 40 : 32));

        // Show tooltip
        tooltip
          .style("opacity", "1")
          .style("visibility", "visible")
          .html(`
            <div class="font-bold text-sm mb-1">${d.label}</div>
            <div class="text-xs text-muted-foreground">${d.description}</div>
          `);

        // Highlight connected links
        link
          .style("stroke-opacity", (l) =>
            (l.source as Node).id === d.id || (l.target as Node).id === d.id
              ? 0.8
              : 0.2
          )
          .style("stroke-width", (l) =>
            (l.source as Node).id === d.id || (l.target as Node).id === d.id
              ? Math.sqrt(l.value) * 3
              : Math.sqrt(l.value) * 2
          );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.offsetX + 15}px`)
          .style("top", `${event.offsetY + 15}px`);
      })
      .on("mouseleave", function (_event, d) {
        // Reset node
        d3.select(this)
          .select(".node-glow")
          .transition()
          .duration(200)
          .attr("opacity", 0);

        d3.select(this)
          .select(".node-main")
          .transition()
          .duration(200)
          .attr("r", d.type === "center" ? 35 : 28);

        // Hide tooltip
        tooltip.style("opacity", "0").style("visibility", "hidden");

        // Reset links
        link
          .style("stroke-opacity", 0.4)
          .style("stroke-width", (l) => Math.sqrt(l.value) * 2);
      })
      .on("click", function (event, d) {
        event.stopPropagation();
        setSelectedNode(d.id === selectedNode ? null : d.id);
      });

    // Animate particles along links
    let particleProgress = 0;
    const animateParticles = () => {
      particleProgress = (particleProgress + 0.01) % 1;
      particles.attr("cx", (d) => {
        const source = d.source as Node;
        const target = d.target as Node;
        return source.x! + (target.x! - source.x!) * particleProgress;
      })
      .attr("cy", (d) => {
        const source = d.source as Node;
        const target = d.target as Node;
        return source.y! + (target.y! - source.y!) * particleProgress;
      });
    };

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as Node).x!)
        .attr("y1", (d) => (d.source as Node).y!)
        .attr("x2", (d) => (d.target as Node).x!)
        .attr("y2", (d) => (d.target as Node).y!);

      animateParticles();

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2.5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Handle window resize
    const handleResize = () => {
      const newWidth = svgRef.current?.clientWidth || width;
      const newHeight = svgRef.current?.clientHeight || height;
      simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2));
      simulation.alpha(0.3).restart();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      simulation.stop();
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedNode]);

  return (
    <div className="mt-20 relative">
      <style>{`
        @keyframes pulse {
          0%, 100% {
            r: 35;
            opacity: 0.6;
          }
          50% {
            r: 45;
            opacity: 0.2;
          }
        }
      `}</style>
      <div className="bg-card border-3 border-foreground/80 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.8)] rounded-2xl p-6 rotate-[0.5deg] overflow-hidden hover:rotate-0 transition-transform duration-300">
        <div className="absolute top-4 left-10 bg-sky-accent text-white px-4 py-1 -rotate-2 shadow-md border-2 border-foreground/80 font-bold text-sm z-10">
          {hero.previewLabel}
        </div>
        <div className="relative">
          <svg
            ref={svgRef}
            className="w-full h-[400px]"
            preserveAspectRatio="xMidYMid meet"
          />
          <div
            ref={tooltipRef}
            className="absolute pointer-events-none bg-foreground text-white px-3 py-2 rounded-lg text-sm shadow-lg border-2 border-foreground/80 transition-opacity duration-200 z-20 opacity-0 invisible"
          />
        </div>
        <div className="mt-4 pt-4 border-t-2 border-border text-center">
          <div className="text-muted-foreground text-sm font-medium">
            {hero.previewDescription}
          </div>
          <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground/70">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
              Drag nodes
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-secondary rounded-full animate-pulse" />
              Hover for details
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Scroll to zoom
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

