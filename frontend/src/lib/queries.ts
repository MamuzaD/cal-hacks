import { useQuery } from '@tanstack/react-query'
import type { GraphData } from '~/lib/mockData'
import { mockData } from '~/lib/mockData'

async function fetchVisualData(id: string): Promise<GraphData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Get mock data based on ID
  const visualData = mockData[id.toLowerCase()]
  
  if (!visualData) {
    throw new Error(`No data found for ${id}`)
  }
  
  return visualData
}

export function useVisualData(id: string) {
  return useQuery({
    queryKey: ['visual', id],
    queryFn: () => fetchVisualData(id),
    enabled: !!id,
    staleTime: Infinity, // Mock data never goes stale
  })
}

