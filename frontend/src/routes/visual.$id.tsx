import { createFileRoute } from '@tanstack/react-router'
import { NetworkGraph } from '~/components/ui/NetworkGraph'
import { useVisualData } from '~/lib/queries'
import type { Node } from '~/lib/mockData'

export const Route = createFileRoute('/visual/$id')({
  component: VisualPage,
})

function VisualPage() {
  const { id } = Route.useParams()
  const { data, isLoading, isError } = useVisualData(id)

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
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 capitalize">{id} Network</h1>
          <p className="text-muted-foreground">
            {data.nodes.length} nodes · {data.edges.length} connections
          </p>
        </div>

        {/* Graph visualization */}
        <div className="glass rounded-2xl p-8 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4">Network Graph</h2>
            <NetworkGraph nodes={data.nodes} edges={data.edges} />
          </div>
        </div>

        {/* Nodes */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Nodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.nodes.map((node: Node) => (
              <div
                key={node.id}
                className="glass rounded-lg p-4 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{node.label}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      node.type === 'company'
                        ? 'bg-blue-500/20 text-blue-400'
                        : node.type === 'person'
                          ? 'bg-green-500/20 text-green-400'
                          : node.type === 'politician'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {node.type}
                  </span>
                </div>
                {node.category && (
                  <p className="text-sm text-muted-foreground">
                    {node.category}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Edges */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Connections</h2>
          <div className="space-y-2">
            {data.edges.map((edge, idx: number) => {
              const sourceNode = data.nodes.find(
                (n: Node) => n.id === edge.source,
              )
              const targetNode = data.nodes.find(
                (n: Node) => n.id === edge.target,
              )
              return (
                <div
                  key={idx}
                  className="glass rounded-lg p-4 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {sourceNode?.label || edge.source}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-semibold">
                      {targetNode?.label || edge.target}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ml-auto ${
                        edge.type === 'stock-holding'
                          ? 'bg-green-500/20 text-green-400'
                          : edge.type === 'campaign-contribution'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {edge.type}
                    </span>
                  </div>
                  {edge.value && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Value: ${edge.value.toLocaleString()}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
