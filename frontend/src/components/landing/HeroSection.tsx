import { landingPage } from '~/constants'
import { SearchBar } from '~/components/ui/search'

export function HeroSection() {
  const { hero } = landingPage

  return (
    <div className="max-w-5xl mx-auto space-y-12 pt-16">
      <div className="space-y-8">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.1]">
          <span className="block text-foreground">{hero.title.line1}</span>
          <span className="block text-foreground">{hero.title.line2}</span>
          <span
            className="block bg-clip-text text-transparent text-glow-cyan animate-shimmer"
            style={{
              backgroundSize: '200% auto',
              backgroundImage:
                'linear-gradient(to right, var(--primary) 0%, var(--secondary) 30%, var(--accent) 60%, var(--primary) 100%)',
            }}
          >
            {hero.title.line3}
          </span>
        </h1>
      </div>

      <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light leading-relaxed">
        {hero.subtitle}{' '}
        <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary/80 via-secondary/80 to-accent/80 animate-shimmer">
          {hero.subtitleHighlight}
        </span>
        .
      </p>

      {/* Search Demo */}
      <SearchBar
        placeholder={hero.searchPlaceholder}
        buttonText={hero.searchButton}
        variant="hero"
      />

      {/* Network Visualization Preview */}
      {/* <NetworkPreview /> */}
    </div>
  )
}
