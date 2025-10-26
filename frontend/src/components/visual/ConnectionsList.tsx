import type { Edge, Node } from '~/lib/types'
import { ConnectionItem } from './ConnectionItem'
import { getEdgeId } from '~/lib/node-dashboard-hooks'

interface ConnectionsListProps {
  edges: Edge[]
  allNodes: Node[]
  direction: 'incoming' | 'outgoing'
  getNodeLabel: (nodeId: number) => string
  onNodeSelect?: (node: Node) => void
}

export function ConnectionsList({
  edges,
  allNodes,
  direction,
  getNodeLabel,
  onNodeSelect,
}: ConnectionsListProps) {
  if (edges.length === 0) return null

  return (
    <div className="shrink-0">
      <h3 className="text-base font-semibold mb-2 text-foreground">
        {direction === 'incoming' ? 'Incoming' : 'Outgoing'} ({edges.length})
      </h3>
      <div className="space-y-2">
        {edges.map((edge, idx) => {
          const connectedNodeId =
            direction === 'outgoing'
              ? getEdgeId(edge.target)
              : getEdgeId(edge.source)
          const connectedNode = allNodes.find((n) => n.id === connectedNodeId)

          return (
            <ConnectionItem
              key={idx}
              edge={edge}
              connectedNode={connectedNode}
              direction={direction}
              connectedNodeLabel={getNodeLabel(connectedNodeId)}
              onNodeSelect={onNodeSelect}
            />
          )
        })}
      </div>
    </div>
  )
}

