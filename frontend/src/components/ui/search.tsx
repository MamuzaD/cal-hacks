import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Button } from '~/components/ui/button'
import { landingPage } from '~/constants'
import { queryKeys } from '~/lib/queryKeys'

interface SearchBarProps {
  placeholder?: string
  buttonText?: string
  variant?: 'hero' | 'compact'
  onSearch?: (query: string) => void
}

interface SearchResponse {
  id: string
  type: 'person' | 'company'
  confidence: number
  reasoning: string
}

export function SearchBar({
  placeholder = 'Search...',
  buttonText = 'Explore',
  variant = 'hero',
  onSearch,
}: SearchBarProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const { isPending, data } = useQuery({
    queryKey: queryKeys.search.byQuery(searchTerm!),
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/search?q=${encodeURIComponent(searchTerm!)}`
      )
      if (!res.ok) {
        if (res.status === 404) {
          setError(`No results found for "${searchTerm}"`)
        } else {
          setError('Search failed. Please try again.')
        }
        throw new Error('Search failed')
      }
      setError(null)
      return res.json() as Promise<SearchResponse>
    },
    enabled: !!searchTerm,
    retry: false,
  })

  // Handle navigation when search completes
  useEffect(() => {
    if (data) {
      // Navigate to visual based on result
      navigate({ to: '/visual/$id', params: { id: data.id } })
      setSearchTerm(null) // Clear search term after navigation
    }
  }, [data, navigate])
  
  const handleSearch = async () => {
    if (!query.trim()) return
    
    setError(null) // Clear any previous errors
    if (onSearch) {
      onSearch(query)
    }
    
    setSearchTerm(query.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleQuickStartClick = (example: string) => {
    setQuery(example)
    setError(null) // Clear any previous errors
    if (onSearch) {
      onSearch(example)
    }
    setSearchTerm(example)
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

  const { hero } = landingPage
  return (
    <div className="flex flex-col items-center mt-16 w-full">
      <div className="max-w-2xl w-full">
        <div className="relative group">
          <div
            className={`relative flex items-center glass-strong rounded-2xl px-6 py-5 border transition-all duration-500 bg-gradient-to-r from-white/5 via-white/8 to-white/5 ${
              isPending
                ? 'border-primary scale-[1.02] animate-pulse-border shadow-lg'
                : 'border-primary/10 hover:border-primary/30'
            }`}
          >
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
              disabled={isPending}
              className={`cursor-pointer ml-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-background font-semibold transition-all ${
                isPending ? 'shadow-xl scale-105' : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {isPending ? 'Searching...' : buttonText}
            </Button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 max-w-2xl w-full px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-start gap-3 mt-6 flex-wrap max-w-2xl">
        <span className="text-sm text-muted-foreground font-medium">
          {hero.quickStartLabel}
        </span>
        {hero.exampleSearches.map((example: string, index: number) => (
          <Button
            key={example}
            variant="outline"
            size="sm"
            className="glass cursor-pointer hover:scale-110 scale-100 hover:shadow-lg hover:shadow-primary/25 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background transition-transform"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handleQuickStartClick(example)}
          >
            {example}
          </Button>
        ))}
      </div>
    </div>
  )
}
