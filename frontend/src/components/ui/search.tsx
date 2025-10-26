import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { landingPage } from '~/constants'

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
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [isQuickStartUsed, setIsQuickStartUsed] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (isQuickStartUsed) {
      const timer = setTimeout(() => {
        setIsQuickStartUsed(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isQuickStartUsed])

  const searchBackend = async (searchTerm: string) => {
    try {
      setIsSearching(true)
      
      // Call the real API
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Handle the search result based on detected type
      const resultId = data.detected_type === 'company' 
        ? data.result.company.toLowerCase()
        : data.result.politician_name.toLowerCase().replace(/\s+/g, '-')
      
      // Navigate to visual page
      navigate({ to: '/visual/$id', params: { id: resultId } })
    } catch (error) {
      console.error('Search error:', error)
      // On error, navigate to showcase
      navigate({ to: '/showcase' })
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = async () => {
    if (!query.trim()) return
    
    if (onSearch) {
      onSearch(query)
    }
    
    await searchBackend(query)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleQuickStartClick = async (example: string) => {
    setQuery(example)
    setIsQuickStartUsed(true)
    // Auto-trigger search after a brief delay
    setTimeout(async () => {
      if (onSearch) {
        onSearch(example)
      }
      await searchBackend(example)
    }, 300)
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
              isQuickStartUsed
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
              disabled={isSearching}
              className={`cursor-pointer ml-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-background font-semibold transition-all ${
                isQuickStartUsed ? 'shadow-xl scale-105' : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {isSearching ? 'Searching...' : buttonText}
            </Button>
          </div>
        </div>
      </div>

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
