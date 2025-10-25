import { Button } from '~/components/ui/button'
import { Search } from 'lucide-react'
import { useState } from 'react'

interface SearchBarProps {
  placeholder?: string
  buttonText?: string
  variant?: 'hero' | 'compact'
  onSearch?: (query: string) => void
}

export function SearchBar({
  placeholder = 'Search...',
  buttonText = 'Explore',
  variant = 'hero',
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  if (variant === 'compact') {
    return (
      <div className="relative group w-full max-w-md">
        <div className="relative flex items-center glass rounded-xl px-4 py-2 border border-black/10 dark:borderhover:border-primary/30 transition-all">
          <Search className="w-4 h-4 text-primary mr-2" />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm font-light"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl w-full">
      <div className="relative group">
        <div className="relative flex items-center glass-strong rounded-2xl px-6 py-5 border border-primary/10  hover:border-primary/30 transition-all bg-gradient-to-r from-white/5 via-white/8 to-white/5">
          <Search className="w-6 h-6 text-primary mr-3" />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-lg font-light"
          />
          <Button
            onClick={handleSearch}
            className="ml-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-background font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}
