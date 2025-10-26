import { useQuery } from '@tanstack/react-query'
import type { GraphData, Node } from '~/lib/types'
import { queryKeys } from '~/lib/queryKeys'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

async function fetchVisualData(id: string, type: string): Promise<GraphData> {
  const response = await fetch(`${API_BASE_URL}/api/graph?id=${id}&type=${type}`)
  
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

async function fetchPerson(id: number) {
  const res = await fetch(`${API_BASE_URL}/api/person/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch person: ${res.statusText}`)
  return res.json() as Promise<Pick<Node, 'id' | 'name' | 'type' | 'position' | 'state' | 'party_affiliation' | 'estimated_net_worth' | 'last_trade_date'>>
}

export function usePerson(id?: number) {
  return useQuery({
    queryKey: ['person', id],
    queryFn: () => fetchPerson(id as number),
    enabled: typeof id === 'number',
    staleTime: 5 * 60 * 1000,
  })
}

async function fetchCompany(id: number) {
  const res = await fetch(`${API_BASE_URL}/api/company/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch company: ${res.statusText}`)
  return res.json() as Promise<Pick<Node, 'id' | 'name' | 'type' | 'ticker'>>
}

export function useCompany(id?: number) {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => fetchCompany(id as number),
    enabled: typeof id === 'number',
    staleTime: 5 * 60 * 1000,
  })
}

