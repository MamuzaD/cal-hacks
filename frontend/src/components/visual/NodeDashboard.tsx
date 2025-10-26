import { useNavigate } from '@tanstack/react-router'
import type { Node, Edge } from '~/lib/mockData'
import { usePerson, useCompany } from '~/lib/queries'
import { useNodeEdges } from '~/lib/node-dashboard-hooks'
import { NodeHeader } from './NodeHeader'
import { PersonDetails } from './PersonDetails'
import { CompanyDetails } from './CompanyDetails'
import { ConnectionsList } from './ConnectionsList'

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

  // Use custom hook for edge processing
  const { connectedEdges, incomingEdges, outgoingEdges, getNodeLabel } =
    useNodeEdges({
      node,
      allNodes,
      allEdges,
    })

  const handleSearch = () => {
    // Navigate to the visual page for this node
    const type = node.type === 'person' ? 'person' : 'company'
    navigate({ to: '/visual/$type/$id', params: { type, id: String(node.id) } })
  }

  // Prefer API details for sidebar, fallback to graph node
  const displayName = person?.name ?? company?.name ?? node.name
  const displayPerson =
    node.type === 'person'
      ? {
          position: person?.position ?? node.position,
          state: person?.state ?? node.state,
          party_affiliation:
            person?.party_affiliation ?? node.party_affiliation,
          estimated_net_worth:
            person?.estimated_net_worth ?? node.estimated_net_worth,
          last_trade_date: person?.last_trade_date ?? node.last_trade_date,
        }
      : undefined
  const displayCompany =
    node.type === 'company'
      ? {
          ticker: company?.ticker ?? node.ticker,
        }
      : undefined

  return (
    <div className="h-full flex flex-col p-4 bg-background border-l border-primary/20 overflow-hidden">
      {/* Header */}
      <NodeHeader name={displayName} type={node.type} onSearch={handleSearch} />

      {/* Node Type Specific Details */}
      <div className="shrink-0 mb-3">
        {node.type === 'person' && (
          <PersonDetails person={displayPerson} isLoading={isLoadingDetails} />
        )}
        {node.type === 'company' && (
          <CompanyDetails company={displayCompany} isLoading={isLoadingDetails} />
        )}
      </div>

      {/* Connections Section */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 scrollbar-hide">
        {/* Outgoing Connections */}
        <ConnectionsList
          edges={outgoingEdges}
          allNodes={allNodes}
          direction="outgoing"
          getNodeLabel={getNodeLabel}
          onNodeSelect={onNodeSelect}
        />

        {/* Incoming Connections */}
        <ConnectionsList
          edges={incomingEdges}
          allNodes={allNodes}
          direction="incoming"
          getNodeLabel={getNodeLabel}
          onNodeSelect={onNodeSelect}
        />

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

