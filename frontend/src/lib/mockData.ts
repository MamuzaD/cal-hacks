export interface Node {
  id: number
  name: string
  type: 'company' | 'person'
  // Person fields
  position?: string
  state?: string
  party_affiliation?: string
  estimated_net_worth?: number
  last_trade_date?: string
  // Company fields
  ticker?: string
}

export interface Edge {
  source: number
  target: number
  type: string
  holding_value?: number
  label?: string
}

export interface GraphData {
  nodes: Node[]
  edges: Edge[]
}

export const mockData: Record<string, GraphData> = {
  pfizer: {
    nodes: [
      { id: 'pfizer', label: 'Pfizer Inc.', type: 'company', category: 'Pharmaceutical' },
      { id: 'sen-schumer', label: 'Sen. Charles Schumer', type: 'politician', category: 'U.S. Senate' },
      { id: 'rep-pelosi', label: 'Rep. Nancy Pelosi', type: 'politician', category: 'U.S. House of Representatives' },
      { id: 'sen-warren', label: 'Sen. Elizabeth Warren', type: 'politician', category: 'U.S. Senate' },
      { id: 'biden-joe', label: 'Joe Biden', type: 'politician', category: 'President' },
      { id: 'trump-don', label: 'Donald Trump', type: 'politician', category: 'Former President' },
      { id: 'blackrock', label: 'BlackRock Inc.', type: 'organization', category: 'Investment Management' },
      { id: 'vanguard', label: 'The Vanguard Group', type: 'organization', category: 'Investment Management' },
    ],
    edges: [
      { source: 'sen-schumer', target: 'pfizer', type: 'stock-holding', value: 15000 },
      { source: 'rep-pelosi', target: 'pfizer', type: 'stock-holding', value: 250000 },
      { source: 'sen-warren', target: 'pfizer', type: 'stock-holding', value: 5000 },
      { source: 'biden-joe', target: 'pfizer', type: 'campaign-contribution', value: 50000 },
      { source: 'trump-don', target: 'pfizer', type: 'campaign-contribution', value: 75000 },
      { source: 'blackrock', target: 'pfizer', type: 'stock-holding', value: 50000000 },
      { source: 'vanguard', target: 'pfizer', type: 'stock-holding', value: 45000000 },
      { source: 'pfizer', target: 'sen-schumer', type: 'lobbying', value: 500000 },
      { source: 'pfizer', target: 'biden-joe', type: 'lobbying', value: 1000000 },
    ],
  },
  apple: {
    nodes: [
      { id: 'apple', label: 'Apple Inc.', type: 'company', category: 'Technology' },
      { id: 'sen-schumer-2', label: 'Sen. Charles Schumer', type: 'politician', category: 'U.S. Senate' },
      { id: 'rep-pelosi-2', label: 'Rep. Nancy Pelosi', type: 'politician', category: 'U.S. House of Representatives' },
      { id: 'sen-feinstein', label: 'Sen. Dianne Feinstein', type: 'politician', category: 'U.S. Senate' },
      { id: 'rep-gaetz', label: 'Rep. Matt Gaetz', type: 'politician', category: 'U.S. House of Representatives' },
      { id: 'blackrock-2', label: 'BlackRock Inc.', type: 'organization', category: 'Investment Management' },
      { id: 'vanguard-2', label: 'The Vanguard Group', type: 'organization', category: 'Investment Management' },
      { id: 'berkshire', label: 'Berkshire Hathaway', type: 'organization', category: 'Investment Management' },
    ],
    edges: [
      { source: 'rep-pelosi-2', target: 'apple', type: 'stock-holding', value: 500000 },
      { source: 'sen-schumer-2', target: 'apple', type: 'stock-holding', value: 100000 },
      { source: 'sen-feinstein', target: 'apple', type: 'stock-holding', value: 75000 },
      { source: 'rep-gaetz', target: 'apple', type: 'stock-holding', value: 25000 },
      { source: 'blackrock-2', target: 'apple', type: 'stock-holding', value: 150000000 },
      { source: 'vanguard-2', target: 'apple', type: 'stock-holding', value: 120000000 },
      { source: 'berkshire', target: 'apple', type: 'stock-holding', value: 200000000 },
      { source: 'apple', target: 'sen-schumer-2', type: 'lobbying', value: 1000000 },
      { source: 'apple', target: 'rep-gaetz', type: 'lobbying', value: 500000 },
    ],
  },
  tesla: {
    nodes: [
      { id: 'tesla', label: 'Tesla Inc.', type: 'company', category: 'Automotive' },
      { id: 'musk-elon', label: 'Elon Musk', type: 'person', category: 'CEO & Founder' },
      { id: 'sen-cruz', label: 'Sen. Ted Cruz', type: 'politician', category: 'U.S. Senate' },
      { id: 'rep-massie', label: 'Rep. Thomas Massie', type: 'politician', category: 'U.S. House of Representatives' },
      { id: 'blackrock-3', label: 'BlackRock Inc.', type: 'organization', category: 'Investment Management' },
      { id: 'vanguard-3', label: 'The Vanguard Group', type: 'organization', category: 'Investment Management' },
      { id: 't-rowe', label: 'T. Rowe Price', type: 'organization', category: 'Investment Management' },
    ],
    edges: [
      { source: 'sen-cruz', target: 'tesla', type: 'stock-holding', value: 50000 },
      { source: 'rep-massie', target: 'tesla', type: 'stock-holding', value: 100000 },
      { source: 'blackrock-3', target: 'tesla', type: 'stock-holding', value: 75000000 },
      { source: 'vanguard-3', target: 'tesla', type: 'stock-holding', value: 60000000 },
      { source: 't-rowe', target: 'tesla', type: 'stock-holding', value: 40000000 },
      { source: 'musk-elon', target: 'sen-cruz', type: 'campaign-contribution', value: 5800 },
      { source: 'tesla', target: 'rep-massie', type: 'lobbying', value: 250000 },
    ],
  },
  openai: {
    nodes: [
      { id: 'openai', label: 'OpenAI', type: 'organization', category: 'Artificial Intelligence' },
      { id: 'gates-bill', label: 'Bill Gates', type: 'person', category: 'Philanthropist' },
      { id: 'sen-rubio', label: 'Sen. Marco Rubio', type: 'politician', category: 'U.S. Senate' },
      { id: 'rep-aitken', label: 'Rep. Sam Aitken', type: 'politician', category: 'U.S. House of Representatives' },
      { id: 'altman-sam', label: 'Sam Altman', type: 'person', category: 'CEO' },
    ],
    edges: [
      { source: 'gates-bill', target: 'openai', type: 'investment', value: 10000000 },
      { source: 'altman-sam', target: 'sen-rubio', type: 'campaign-contribution', value: 5000 },
      { source: 'openai', target: 'rep-aitken', type: 'lobbying', value: 200000 },
    ],
  },
  jpmorgan: {
    nodes: [
      { id: 'jpmorgan', label: 'JPMorgan Chase & Co.', type: 'company', category: 'Financial Services' },
      { id: 'dimon-jamie', label: 'Jamie Dimon', type: 'person', category: 'CEO' },
      { id: 'sen-manchin', label: 'Sen. Joe Manchin', type: 'politician', category: 'U.S. Senate' },
      { id: 'rep-cuomo', label: 'Rep. Andrew Cuomo', type: 'politician', category: 'U.S. House of Representatives' },
      { id: 'blackrock-4', label: 'BlackRock Inc.', type: 'organization', category: 'Investment Management' },
    ],
    edges: [
      { source: 'sen-manchin', target: 'jpmorgan', type: 'stock-holding', value: 200000 },
      { source: 'blackrock-4', target: 'jpmorgan', type: 'stock-holding', value: 80000000 },
      { source: 'jpmorgan', target: 'sen-manchin', type: 'lobbying', value: 1500000 },
      { source: 'jpmorgan', target: 'rep-cuomo', type: 'campaign-contribution', value: 10000 },
    ],
  },
  blackrock: {
    nodes: [
      { id: 'blackrock-main', label: 'BlackRock Inc.', type: 'organization', category: 'Investment Management' },
      { id: 'fink-larry', label: 'Larry Fink', type: 'person', category: 'CEO' },
      { id: 'sen-gillibrand', label: 'Sen. Kirsten Gillibrand', type: 'politician', category: 'U.S. Senate' },
      { id: 'rep-cortez', label: 'Rep. Alexandria Ocasio-Cortez', type: 'politician', category: 'U.S. House of Representatives' },
    ],
    edges: [
      { source: 'sen-gillibrand', target: 'blackrock-main', type: 'stock-holding', value: 50000 },
      { source: 'blackrock-main', target: 'sen-gillibrand', type: 'campaign-contribution', value: 5800 },
      { source: 'blackrock-main', target: 'rep-cortez', type: 'lobbying', value: 500000 },
    ],
  },
  nvidia: {
    nodes: [
      { id: 'nvidia', label: 'Nvidia Corporation', type: 'company', category: 'Technology' },
      { id: 'huang-jensen', label: 'Jensen Huang', type: 'person', category: 'CEO' },
      { id: 'sen-markey', label: 'Sen. Ed Markey', type: 'politician', category: 'U.S. Senate' },
      { id: 'blackrock-5', label: 'BlackRock Inc.', type: 'organization', category: 'Investment Management' },
      { id: 'vanguard-4', label: 'The Vanguard Group', type: 'organization', category: 'Investment Management' },
    ],
    edges: [
      { source: 'sen-markey', target: 'nvidia', type: 'stock-holding', value: 75000 },
      { source: 'blackrock-5', target: 'nvidia', type: 'stock-holding', value: 180000000 },
      { source: 'vanguard-4', target: 'nvidia', type: 'stock-holding', value: 120000000 },
      { source: 'nvidia', target: 'sen-markey', type: 'lobbying', value: 800000 },
    ],
  },
}

