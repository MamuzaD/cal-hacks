export interface Node {
  id: number
  name: string
  type: 'company' | 'person'
  label?: string  // UI label (optional, can use name instead)
  category?: string  // Category/role (optional)
  // Person fields
  position?: string
  state?: string
  party_affiliation?: string
  estimated_net_worth?: number
  last_trade_date?: string
  // Company fields
  ticker?: string
}

export type EdgeStatus = 
  | 'active'      // Currently holding stock
  | 'sold'        // Previously held, now sold (profit/loss realized)

export interface Edge {
  source: number
  target: number
  type: string
  holding_value?: number
  label?: string
  status?: EdgeStatus  // Status of the relationship/holding
}

export interface GraphData {
  nodes: Node[]
  edges: Edge[]
}

