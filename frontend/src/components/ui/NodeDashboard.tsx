import { useNavigate } from '@tanstack/react-router'
import { Button } from './button'
import type { Node, Edge } from '~/lib/mockData'

interface NodeDashboardProps {
  node: Node
  allNodes: Node[]
  allEdges: Edge[]
}

export function NodeDashboard({
  node,
  allNodes,
  allEdges,
}: NodeDashboardProps) {
  const navigate = useNavigate()

  // Helper to get ID from edge source/target (handles both number and D3 object format)
  const getEdgeId = (value: any): number => {
    if (typeof value === 'number') return value
    if (value && typeof value === 'object' && 'id' in value) return value.id
    return Number(value)
  }

  // Find all edges connected to this node
  const connectedEdges = allEdges.filter((edge) => {
    const sourceId = getEdgeId(edge.source)
    const targetId = getEdgeId(edge.target)
    return sourceId === node.id || targetId === node.id
  })

  // Get incoming and outgoing edges
  const incomingEdges = connectedEdges.filter(
    (edge) => getEdgeId(edge.target) === node.id,
  )
  const outgoingEdges = connectedEdges.filter(
    (edge) => getEdgeId(edge.source) === node.id,
  )

  const handleSearch = () => {
    // Navigate to the visual page for this node
    const type = node.type === 'person' ? 'person' : 'company'
    navigate({ to: '/visual/$type/$id', params: { type, id: String(node.id) } })
  }

  const getNodeLabel = (nodeId: number) => {
    const foundNode = allNodes.find((n) => n.id === nodeId)
    return foundNode?.name || String(nodeId)
  }

  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'company':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'person':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getEdgeTypeColor = (type: string) => {
    // Single types
    if (type === 'stock-holding')
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    if (type === 'campaign-contribution')
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    if (type === 'lobbying')
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    if (type === 'investment')
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30'

    // Combined types (bidirectional relationships)
    if (type.includes(' + ')) {
      if (type.includes('stock-holding') && type.includes('lobbying'))
        return 'bg-green-400/20 text-green-300 border-green-400/30'
      if (
        type.includes('stock-holding') &&
        type.includes('campaign-contribution')
      )
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      if (type.includes('lobbying') && type.includes('campaign-contribution'))
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      if (type.includes('stock-holding') && type.includes('investment'))
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30'
      if (type.includes('lobbying') && type.includes('investment'))
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      if (type.includes('campaign-contribution') && type.includes('investment'))
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30'
      return 'bg-violet-500/20 text-violet-400 border-violet-500/30'
    }

    return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  return (
    <div className="h-full flex flex-col p-4 bg-background border-l border-primary/20 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 mb-3">
        <h2 className="text-xl font-bold mb-2 wrap-word-break line-clamp-2">
          {node.name}
        </h2>
        <div className="flex flex-col gap-1.5 mb-3">
          <span
            className={`text-xs px-2.5 py-1 rounded-full border ${getTypeColor(node.type)} w-fit`}
          >
            {node.type}
          </span>
          
          {/* Person-specific fields */}
          {node.type === 'person' && (
            <div className="space-y-1 text-sm mt-2">
              {node.position && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-medium">Position:</span>
                  <span>{node.position}</span>
                </div>
              )}
              {node.state && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-medium">State:</span>
                  <span>{node.state}</span>
                </div>
              )}
              {node.party_affiliation && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-medium">Party:</span>
                  <span>{node.party_affiliation}</span>
                </div>
              )}
              {node.estimated_net_worth && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-medium">Net Worth:</span>
                  <span>{formatCurrency(node.estimated_net_worth)}</span>
                </div>
              )}
              {node.last_trade_date && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-medium">Last Trade:</span>
                  <span>{formatDate(node.last_trade_date)}</span>
                </div>
              )}
            </div>
          )}

          {/* Company-specific fields */}
          {node.type === 'company' && (
            <div className="space-y-1 text-sm mt-2">
              {node.ticker && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-medium">Ticker:</span>
                  <span className="font-mono font-semibold">{node.ticker}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <Button onClick={handleSearch} className="w-full text-sm" size="sm">
          Search for this entity
        </Button>
      </div>

      {/* Connections Section */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 scrollbar-hide">
        {/* Outgoing Connections */}
        {outgoingEdges.length > 0 && (
          <div className="shrink-0">
            <h3 className="text-base font-semibold mb-2 text-foreground">
              Outgoing ({outgoingEdges.length})
            </h3>
            <div className="space-y-2">
              {outgoingEdges.map((edge, idx) => (
                <div
                  key={idx}
                  className="glass rounded-lg p-2.5 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-2 mb-1.5">
                    <span className="text-sm text-muted-foreground mt-0.5">
                      →
                    </span>
                    <span className="font-medium text-sm wrap-break-word flex-1 line-clamp-2">
                      {getNodeLabel(getEdgeId(edge.target))}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs px-2 py-0.5 rounded border ${getEdgeTypeColor(edge.type)} w-fit`}
                    >
                      {edge.type}
                    </span>
                    {edge.holding_value && (
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(edge.holding_value)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Incoming Connections */}
        {incomingEdges.length > 0 && (
          <div className="shrink-0">
            <h3 className="text-base font-semibold mb-2 text-foreground">
              Incoming ({incomingEdges.length})
            </h3>
            <div className="space-y-2">
              {incomingEdges.map((edge, idx) => (
                <div
                  key={idx}
                  className="glass rounded-lg p-2.5 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-2 mb-1.5">
                    <span className="font-medium text-sm wrap-break-word flex-1 line-clamp-2">
                      {getNodeLabel(getEdgeId(edge.source))}
                    </span>
                    <span className="text-sm text-muted-foreground mt-0.5">
                      →
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs px-2 py-0.5 rounded border ${getEdgeTypeColor(edge.type)} w-fit`}
                    >
                      {edge.type}
                    </span>
                    {edge.holding_value && (
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(edge.holding_value)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No connections */}
        {connectedEdges.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No connections found for this node
          </div>
        )}
      </div>
    </div>
  )
}
