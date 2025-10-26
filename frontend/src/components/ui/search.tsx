import { Search } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export function SearchBar({
  placeholder = 'Search...',
  buttonText = 'Explore',
  variant = 'hero',
  onSearch,
}: SearchBarProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  const [uiError, setUiError] = useState<string | null>(null)

  const { data, error, isFetching } = useQuery<SearchResponse>({
    queryKey: searchTerm
      ? queryKeys.search.byQuery(searchTerm)
      : ['search', 'disabled'],
    queryFn: async () => {
      if (!searchTerm) {
        throw new Error('Missing search term')
      }
      const url = `${API_BASE_URL}/api/search?q=${encodeURIComponent(searchTerm)}`
      const res = await fetch(url)
      if (!res.ok) {
        const err = new Error(
          `Search failed with status ${res.status}`,
        ) as Error & {
          status?: number
        }
        err.status = res.status
        throw err
      }
      const json = (await res.json()) as SearchResponse
      return json
    },
    enabled: !!searchTerm,
    retry: false,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  })

  // isPending should only be true when we actually have a searchTerm and the query is fetching
  const isPending = searchTerm ? isFetching : false

  // Derive UI error from query error
  useEffect(() => {
    if (!searchTerm) return
    if (error) {
      const status = (error as any)?.status as number | undefined
      if (status === 404) {
        setQuery('')
        setUiError(`No results found for "${searchTerm}"`)
      } else {
        setUiError('Search failed. Please try again.')
      }
    } else {
      setUiError(null)
    }
  }, [error, searchTerm])

  // Navigate on success and reset after a delay
  useEffect(() => {
    if (data && searchTerm) {
      navigate({
        to: '/visual/$type/$id',
        params: { type: data.type, id: data.id },
      })
      // Reset searchTerm after navigation to allow fresh searches
      const timer = setTimeout(() => {
        setSearchTerm(null)
        setQuery('')
        setUiError(null)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [data, searchTerm, navigate])

  const triggerSearch = useCallback(
    (term: string) => {
      const trimmed = term.trim()
      if (!trimmed) return
      setUiError(null)
      onSearch?.(trimmed)
      setSearchTerm(trimmed)
    },
    [onSearch],
  )

  const handleSearch = () => triggerSearch(query)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      triggerSearch(query)
    }
  }

  const handleQuickStartClick = (example: string) => {
    setQuery(example)
    setUiError(null)
    onSearch?.(example)
    setSearchTerm(example.trim())
  }

  if (variant === 'compact') {
    return (
      <div className="relative group w-full max-w-md">
        <div
          className={`relative flex items-center glass rounded-xl px-4 py-2 border  dark:hover:border-primary/30 transition-all ${uiError ? 'border-red-500' : 'border-black/10'}`}
        >
          <Search className="w-4 h-4 text-primary mr-2" />
          <input
            type="text"
            placeholder={uiError ? "Couldn't find" : placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 bg-transparent text-foreground  outline-none text-sm font-light ${uiError ? 'placeholder-red-500' : 'placeholder-muted-foreground'}`}
          />
          <Button
            onClick={handleSearch}
            disabled={isPending}
            variant="ghost"
            size="sm"
            className="ml-2"
          >
            {isPending ? '...' : 'Go'}
          </Button>
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
            className={`relative flex items-center glass-strong rounded-2xl px-6 py-5 border transition-all duration-500 bg-linear-to-r from-white/5 via-white/8 to-white/5 ${
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
              className={`cursor-pointer ml-4 bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-background font-semibold transition-all ${
                isPending ? 'shadow-xl scale-105' : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {isPending ? 'Searching...' : buttonText}
            </Button>
          </div>
        </div>
      </div>

      {uiError && (
        <div className="mt-4 max-w-2xl w-full px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-500">{uiError}</p>
        </div>
      )}

      <div className="flex items-center justify-start gap-3 mt-6 flex-wrap max-w-2xl">
        <span className="text-md text-muted-foreground font-medium">
          {hero.quickStartLabel}
        </span>
        {hero.exampleSearches.map((example: { label: string; value: string }, index: number) => (
          <Button
            key={example.value}
            variant="outline"
            size="default"
            className="glass cursor-pointer hover:scale-110 scale-100 hover:shadow-lg hover:shadow-primary/25 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background transition-transform"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handleQuickStartClick(example.value)}
          >
            {example.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
