import { useMemo } from 'react'
import type { Node, Edge } from '~/lib/types'

// Helper to get ID from edge source/target (handles both number and D3 object format)
export const getEdgeId = (value: any): number => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) return value.id
  return Number(value)
}

interface UseNodeEdgesParams {
  node: Node
  allNodes: Node[]
  allEdges: Edge[]
}

export function useNodeEdges({ node, allNodes, allEdges }: UseNodeEdgesParams) {
  const connectedEdges = useMemo(() => {
    return allEdges.filter((edge) => {
      const sourceId = getEdgeId(edge.source)
      const targetId = getEdgeId(edge.target)
      return sourceId === node.id || targetId === node.id
    })
  }, [node.id, allEdges])

  const incomingEdges = useMemo(() => {
    return connectedEdges.filter((edge) => getEdgeId(edge.target) === node.id)
  }, [connectedEdges, node.id])

  const outgoingEdges = useMemo(() => {
    return connectedEdges.filter((edge) => getEdgeId(edge.source) === node.id)
  }, [connectedEdges, node.id])

  const getNodeLabel = (nodeId: number) => {
    const foundNode = allNodes.find((n) => n.id === nodeId)
    return foundNode?.name || String(nodeId)
  }

  return {
    connectedEdges,
    incomingEdges,
    outgoingEdges,
    getNodeLabel,
  }
}

