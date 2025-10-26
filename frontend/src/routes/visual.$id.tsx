import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { NetworkGraph } from '~/components/ui/NetworkGraph'
import { NodeDashboard } from '~/components/ui/NodeDashboard'
import { useVisualData } from '~/lib/queries'
import type { Node } from '~/lib/mockData'

export const Route = createFileRoute('/visual/$id')({
  component: VisualPage,
})

function VisualPage() {
  const { id } = Route.useParams()
  const { data, isLoading, isError } = useVisualData(id)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  // Set the default selected node to the first node (the main entity)
  useEffect(() => {
    if (data && data.nodes.length > 0 && !selectedNode) {
      setSelectedNode(data.nodes[0])
    }
  }, [data])

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
          <p className="text-muted-foreground">No data found for {id}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-background text-foreground flex overflow-hidden">
      {/* Split screen layout - 70/30 split */}
      <div className="w-[70%] p-6 flex items-center justify-center">
        <div className="w-full h-full">
          <NetworkGraph
            nodes={data.nodes}
            edges={data.edges}
            onNodeSelect={setSelectedNode}
            selectedNodeId={selectedNode?.id}
          />
        </div>
      </div>

      {/* Right 30% - Node Dashboard */}
      <div className="w-[30%] h-full">
        {selectedNode ? (
          <NodeDashboard
            node={selectedNode}
            allNodes={data.nodes}
            allEdges={data.edges}
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
