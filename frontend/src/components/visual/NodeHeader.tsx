import { Button } from '~/components/ui/button'
import { getTypeColor } from '~/lib/node-dashboard-utils'

interface NodeHeaderProps {
  name: string
  type: string
  onSearch: () => void
}

export function NodeHeader({ name, type, onSearch }: NodeHeaderProps) {
  return (
    <div className="shrink-0 mb-3">
      <h2 className="text-xl font-bold mb-2 wrap-word-break line-clamp-2">
        {name}
      </h2>
      <div className="flex flex-col gap-1.5 mb-3">
        <span
          className={`text-xs px-2.5 py-1 rounded-full border ${getTypeColor(type)} w-fit`}
        >
          {type}
        </span>
      </div>
      <Button onClick={onSearch} className="w-full text-sm" size="sm">
        Search for this entity
      </Button>
    </div>
  )
}

