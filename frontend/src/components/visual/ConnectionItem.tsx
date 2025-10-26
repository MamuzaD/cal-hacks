import type { Edge, Node } from '~/lib/types'
import {
  formatCurrency,
  getEdgeTypeColor,
  getStatusLabel,
  getStatusTextColor,
} from '~/lib/node-dashboard-utils'

interface ConnectionItemProps {
  edge: Edge
  connectedNode?: Node
  direction: 'incoming' | 'outgoing'
  connectedNodeLabel: string
  onNodeSelect?: (node: Node) => void
}

export function ConnectionItem({
  edge,
  connectedNode,
  direction,
  connectedNodeLabel,
  onNodeSelect,
}: ConnectionItemProps) {
  const handleClick = () => {
    if (connectedNode && onNodeSelect) {
      onNodeSelect(connectedNode)
    }
  }

  return (
    <div
      onClick={handleClick}
      className="glass rounded-lg p-2.5 hover:border-primary/30 transition-all cursor-pointer"
    >
      <div className="flex items-start gap-2 mb-1.5">
        {direction === 'outgoing' ? (
          <>
            <span className="text-sm text-muted-foreground mt-0.5">→</span>
            <span className="font-medium text-sm wrap-break-word flex-1 line-clamp-2">
              {connectedNodeLabel}
            </span>
          </>
        ) : (
          <>
            <span className="font-medium text-sm wrap-break-word flex-1 line-clamp-2">
              {connectedNodeLabel}
            </span>
            <span className="text-sm text-muted-foreground mt-0.5">→</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`text-xs px-2 py-0.5 rounded border ${getEdgeTypeColor(edge.type, edge.status)} w-fit`}
        >
          {getStatusLabel(edge.status, edge.type)}
        </span>
        {edge.holding_value && (
          <span className={`text-xs ${getStatusTextColor(edge.status)}`}>
            {formatCurrency(edge.holding_value, edge.status === 'sold')}
          </span>
        )}
      </div>
    </div>
  )
}

