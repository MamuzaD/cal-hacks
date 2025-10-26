import { useNavigate } from '@tanstack/react-router'
import { Button } from './button'
import type { Node, Edge } from '~/lib/mockData'
import { usePerson, useCompany } from '~/lib/queries'

interface NodeDashboardProps {
  node: Node
  allNodes: Node[]
  allEdges: Edge[]
  onNodeSelect?: (node: Node) => void
}

export function NodeDashboard({
  node,
  allNodes,
  allEdges,
  onNodeSelect,
}: NodeDashboardProps) {
  const navigate = useNavigate()

  // Fetch enriched details for the selected node
  const personQuery = usePerson(node.type === 'person' ? node.id : undefined)
  const companyQuery = useCompany(node.type === 'company' ? node.id : undefined)

  const isLoadingDetails = personQuery.isLoading || companyQuery.isLoading
  const person =
    node.type === 'person'
      ? (personQuery.data as Partial<Node> | undefined)
      : undefined
  const company =
    node.type === 'company'
      ? (companyQuery.data as Partial<Node> | undefined)
      : undefined

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

  const formatCurrency = (value?: number, isSold: boolean = false) => {
    if (!value) return 'N/A'
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

    // Add profit indicator for sold positions
    if (isSold) {
      return `${formatted} profit`
    }
    return formatted
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

  const getEdgeTypeColor = (type: string, status?: string) => {
    // For stock-holding, status determines color
    if (type === 'stock-holding' && status === 'sold') {
      return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' // Cyan for sold
    }

    // Type-based colors (for active holdings and other types)
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
        return 'bg-lime-500/20 text-lime-400 border-lime-500/30'
      if (
        type.includes('stock-holding') &&
        type.includes('campaign-contribution')
      )
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      if (type.includes('lobbying') && type.includes('campaign-contribution'))
        return 'bg-orange-400/20 text-orange-300 border-orange-400/30'
      if (type.includes('stock-holding') && type.includes('investment'))
        return 'bg-teal-500/20 text-teal-400 border-teal-500/30'
      if (type.includes('lobbying') && type.includes('investment'))
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      if (type.includes('campaign-contribution') && type.includes('investment'))
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30'
      return 'bg-violet-500/20 text-violet-400 border-violet-500/30'
    }

    return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
  }

  const getStatusLabel = (status?: string, type?: string) => {
    // Only show special label for sold stock holdings
    if (type === 'stock-holding' && status === 'sold') return 'Sold Position'
    return type
  }

  const getStatusTextColor = (status?: string, type?: string) => {
    // Only special color for sold stock holdings
    if (type === 'stock-holding' && status === 'sold') {
      return 'text-cyan-400 font-semibold' // Cyan for sold
    }
    return 'text-muted-foreground'
  }

  // Prefer API details for sidebar, fallback to graph node
  const displayName = person?.name ?? company?.name ?? node.name
  const displayPosition =
    node.type === 'person' ? (person?.position ?? node.position) : undefined
  const displayState =
    node.type === 'person' ? (person?.state ?? node.state) : undefined
  const displayParty =
    node.type === 'person'
      ? (person?.party_affiliation ?? node.party_affiliation)
      : undefined
  const displayNetWorth =
    node.type === 'person'
      ? (person?.estimated_net_worth ?? node.estimated_net_worth)
      : undefined
  const displayLastTrade =
    node.type === 'person'
      ? (person?.last_trade_date ?? node.last_trade_date)
      : undefined
  const displayTicker =
    node.type === 'company' ? (company?.ticker ?? node.ticker) : undefined

  return (
    <div className="h-full flex flex-col p-4 bg-background border-l border-primary/20 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 mb-3">
        <h2 className="text-xl font-bold mb-2 wrap-word-break line-clamp-2">
          {displayName}
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
              {isLoadingDetails && (
                <div className="text-xs text-muted-foreground">
                  Loading details…
                </div>
              )}
              {displayPosition && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-medium">
                    Position:
                  </span>
                  <span>{displayPosition}</span>
                </div>
              )}
              {displayState && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-medium">
                    State:
                  </span>
                  <span>{displayState}</span>
                </div>
              )}
              {displayParty && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-medium">
                    Party:
                  </span>
                  <span>{displayParty}</span>
                </div>
              )}
              {typeof displayNetWorth === 'number' && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-medium">
                    Net Worth:
                  </span>
                  <span>{formatCurrency(displayNetWorth)}</span>
                </div>
              )}
              {displayLastTrade && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-medium">
                    Last Trade:
                  </span>
                  <span>{formatDate(displayLastTrade)}</span>
                </div>
              )}
            </div>
          )}

          {/* Company-specific fields */}
          {node.type === 'company' && (
            <div className="space-y-1 text-sm mt-2">
              {isLoadingDetails && (
                <div className="text-xs text-muted-foreground">
                  Loading details…
                </div>
              )}
              {displayTicker && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-medium">
                    Ticker:
                  </span>
                  <span className="font-mono font-semibold">
                    {displayTicker}
                  </span>
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
              {outgoingEdges.map((edge, idx) => {
                const targetNode = allNodes.find(
                  (n) => n.id === getEdgeId(edge.target),
                )
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (targetNode && onNodeSelect) {
                        onNodeSelect(targetNode)
                      }
                    }}
                    className="glass rounded-lg p-2.5 hover:border-primary/30 transition-all cursor-pointer"
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
                        className={`text-xs px-2 py-0.5 rounded border ${getEdgeTypeColor(edge.type, edge.status)} w-fit`}
                      >
                        {getStatusLabel(edge.status, edge.type)}
                      </span>
                      {edge.holding_value && (
                        <span
                          className={`text-xs ${getStatusTextColor(edge.status)}`}
                        >
                          {formatCurrency(
                            edge.holding_value,
                            edge.status === 'sold',
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
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
              {incomingEdges.map((edge, idx) => {
                const sourceNode = allNodes.find(
                  (n) => n.id === getEdgeId(edge.source),
                )
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (sourceNode && onNodeSelect) {
                        onNodeSelect(sourceNode)
                      }
                    }}
                    className="glass rounded-lg p-2.5 hover:border-primary/30 transition-all cursor-pointer"
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
                        className={`text-xs px-2 py-0.5 rounded border ${getEdgeTypeColor(edge.type, edge.status)} w-fit`}
                      >
                        {getStatusLabel(edge.status, edge.type)}
                      </span>
                      {edge.holding_value && (
                        <span
                          className={`text-xs ${getStatusTextColor(edge.status)}`}
                        >
                          {formatCurrency(
                            edge.holding_value,
                            edge.status === 'sold',
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
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
