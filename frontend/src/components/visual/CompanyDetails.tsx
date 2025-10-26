import type { Node } from '~/lib/types'

interface CompanyDetailsProps {
  company?: Partial<Node>
  isLoading: boolean
}

export function CompanyDetails({ company, isLoading }: CompanyDetailsProps) {
  if (!company) return null

  const { ticker } = company

  return (
    <div className="space-y-1 text-sm mt-2">
      {isLoading && (
        <div className="text-xs text-muted-foreground">Loading details…</div>
      )}
      {ticker && (
        <div className="flex gap-2">
          <span className="text-muted-foreground font-medium">Ticker:</span>
          <span className="font-mono font-semibold">{ticker}</span>
        </div>
      )}
    </div>
  )
}

