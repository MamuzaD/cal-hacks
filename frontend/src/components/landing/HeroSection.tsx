import { NetworkPreview } from './NetworkPreview'
import { landingPage } from '~/constants'
import { SearchBar } from '~/components/ui/SearchBar'
import { Button } from '~/components/ui/button'

export function HeroSection() {
  const { hero } = landingPage

  return (
    <div className="max-w-5xl mx-auto space-y-12 pt-16">
      <div className="space-y-8">
       
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.1]">
          <span className="block text-foreground">{hero.title.line1}</span>
          <span className="block text-foreground">{hero.title.line2}</span>
          <span
            className="block bg-gradient-to-r from-primary via-secondary via-accent to-primary bg-clip-text text-transparent text-glow-cyan animate-shimmer"
            style={{ 
              backgroundSize: '200% auto',
              backgroundImage: 'linear-gradient(to right, var(--primary) 0%, var(--secondary) 30%, var(--accent) 60%, var(--primary) 100%)'
            }}
          >
            {hero.title.line3}
          </span>
        </h1>
      </div>

      <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light leading-relaxed">
        {hero.subtitle}{' '}
        <span className="font-semibold text-primary">
          {hero.subtitleHighlight}
        </span>
        .
      </p>

      {/* Search Demo */}
      <div className="flex flex-col items-center mt-16 w-full">
        <SearchBar
          placeholder={hero.searchPlaceholder}
          buttonText={hero.searchButton}
          variant="hero"
        />

        {/* Example tags */}
        <div className="flex items-center justify-start gap-3 mt-6 flex-wrap max-w-2xl">
          <span className="text-sm text-muted-foreground font-medium">
            {hero.quickStartLabel}
          </span>
          {hero.exampleSearches.map((example: string, index: number) => (
            <Button
              key={example}
              variant="outline"
              size="sm"
              className="glass rounded-xl text-sm font-medium text-foreground hover:text-primary border border-white/5 hover:border-primary/30 transition-all hover:scale-105 glow-hover-cyan"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {example}
            </Button>
          ))}
        </div>
      </div>

      {/* Network Visualization Preview */}
      <NetworkPreview />
    </div>
  )
}
