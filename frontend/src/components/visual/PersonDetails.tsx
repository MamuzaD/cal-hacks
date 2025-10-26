import { formatCurrency, formatDate } from '~/lib/node-dashboard-utils'
import type { Node } from '~/lib/mockData'

interface PersonDetailsProps {
  person?: Partial<Node>
  isLoading: boolean
}

export function PersonDetails({ person, isLoading }: PersonDetailsProps) {
  if (!person) return null

  const {
    position,
    state,
    party_affiliation,
    estimated_net_worth,
    last_trade_date,
  } = person

  return (
    <div className="space-y-1 text-sm mt-2">
      {isLoading && (
        <div className="text-xs text-muted-foreground">Loading details…</div>
      )}
      {position && (
        <div className="flex gap-2">
          <span className="text-muted-foreground font-medium">Position:</span>
          <span>{position}</span>
        </div>
      )}
      {state && (
        <div className="flex gap-2">
          <span className="text-muted-foreground font-medium">State:</span>
          <span>{state}</span>
        </div>
      )}
      {party_affiliation && (
        <div className="flex gap-2">
          <span className="text-muted-foreground font-medium">Party:</span>
          <span>{party_affiliation}</span>
        </div>
      )}
      {typeof estimated_net_worth === 'number' && (
        <div className="flex gap-2">
          <span className="text-muted-foreground font-medium">Net Worth:</span>
          <span>{formatCurrency(estimated_net_worth)}</span>
        </div>
      )}
      {last_trade_date && (
        <div className="flex gap-2">
          <span className="text-muted-foreground font-medium">Last Trade:</span>
          <span>{formatDate(last_trade_date)}</span>
        </div>
      )}
    </div>
  )
}

