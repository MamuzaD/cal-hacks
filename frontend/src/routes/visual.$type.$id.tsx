import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { NetworkGraph } from '~/components/ui/NetworkGraph'
import { NodeDashboard } from '~/components/visual/NodeDashboard'
import { useVisualData } from '~/lib/queries'
import type { Node } from '~/lib/types'

export const Route = createFileRoute('/visual/$type/$id')({
  component: VisualPage,
})

function VisualPage() {
  const { type, id } = Route.useParams()
  const { data, isLoading, isError } = useVisualData(id, type)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [showAll, setShowAll] = useState(false)

  // Reset state when route params change (navigate to different entity)
  useEffect(() => {
    setSelectedNode(null)
    setShowAll(false)
  }, [type, id])

  // Filter to top holdings by default (top 25 by value)
  const filteredData = data
    ? (() => {
        if (showAll || data.edges.length <= 50) {
          return data
        }

        // Sort edges by holding_value (descending) and take top 25
        const sortedEdges = [...data.edges]
          .sort((a, b) => {
            const valA = a.holding_value || 0
            const valB = b.holding_value || 0
            return valB - valA
          })
          .slice(0, 25)

        // Get node IDs that are connected by these edges
        const connectedNodeIds = new Set<number>()
        connectedNodeIds.add(data.nodes[0].id) // Always include center node

        sortedEdges.forEach((edge) => {
          connectedNodeIds.add(edge.source)
          connectedNodeIds.add(edge.target)
        })

        // Filter nodes to only those connected
        const filteredNodes = data.nodes.filter((node) =>
          connectedNodeIds.has(node.id),
        )

        return {
          ...data,
          nodes: filteredNodes,
          edges: sortedEdges,
        }
      })()
    : null

  // Set the default selected node to the first node (the main entity)
  useEffect(() => {
    if (filteredData && filteredData.nodes.length > 0 && !selectedNode) {
      setSelectedNode(filteredData.nodes[0])
    }
  }, [filteredData])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading visualization...</p>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            No data found for {type}/{id}
          </p>
        </div>
      </div>
    )
  }

  const totalEdges = data?.edges.length || 0
  const displayedEdges = filteredData?.edges.length || 0
  const filterKey = showAll ? 'all' : 'filtered'

  return (
    <div className="h-[calc(100vh-4rem)] bg-background text-foreground flex overflow-hidden">
      {/* Split screen layout - 70/30 split */}
      <div className="w-[70%] p-6 flex items-center justify-center relative">
        {/* Filter toggle button */}
        {totalEdges > 50 && (
          <div className="absolute top-4 left-4 z-30 flex items-center gap-3 bg-background/90 backdrop-blur-sm border border-primary/20 rounded-lg px-4 py-2">
            <div className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="font-semibold text-foreground">
                {displayedEdges}
              </span>{' '}
              of {totalEdges} holdings
            </div>
            <button
              onClick={() => setShowAll(!showAll)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                showAll
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              {showAll ? 'Show Top 25' : 'Show All'}
            </button>
          </div>
        )}

        <div className="w-full h-full">
          <NetworkGraph
            key={filterKey}
            nodes={filteredData?.nodes || []}
            edges={filteredData?.edges || []}
            onNodeSelect={setSelectedNode}
            selectedNodeId={selectedNode?.id}
          />
        </div>
      </div>

      {/* Right 30% - Node Dashboard */}
      <div className="w-[30%] h-full">
        {selectedNode && filteredData ? (
          <NodeDashboard
            node={selectedNode}
            allNodes={filteredData.nodes}
            allEdges={filteredData.edges}
            onNodeSelect={setSelectedNode}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a node to view details
          </div>
        )}
      </div>
    </div>
  )
}
