import { useQuery } from '@tanstack/react-query'
import type { GraphData } from '~/lib/mockData'
import { queryKeys } from '~/lib/queryKeys'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

async function fetchVisualData(id: string, type: string): Promise<GraphData> {
  const response = await fetch(`${API_BASE_URL}/graph?id=${id}&type=${type}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch graph data: ${response.statusText}`)
  }
  
  const data = await response.json()
  return {
    nodes: data.nodes,
    edges: data.edges,
  }
}

export function useVisualData(id: string, type: string) {
  return useQuery({
    queryKey: queryKeys.visual.byId(id, type),
    queryFn: () => fetchVisualData(id, type),
    enabled: !!id && !!type,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

