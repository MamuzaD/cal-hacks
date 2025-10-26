import { landingPage } from '~/constants'
import { SearchBar } from '~/components/ui/search'
import { HeroGraph } from '~/components/landing/hero-graph'

export function HeroSection() {
  const { hero } = landingPage

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Title and Graph side by side */}
      <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
        <div className="flex-1 space-y-6 md:space-y-8">
          <TitleElement />
        </div>
        <div className="hidden md:block flex-1 max-w-[500px]">
          <HeroGraph />
        </div>
      </div>

      <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl font-light leading-relaxed">
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
    </div>
  )
}

const TitleElement = () => {
  const { title } = landingPage.hero
  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
      <span className="block text-foreground">{title.line1}</span>
      <span className="block text-foreground">{title.line2}</span>
      <span
        className="block bg-clip-text text-transparent text-glow-cyan animate-shimmer"
        style={{
          backgroundSize: '200% auto',
          backgroundImage:
            'linear-gradient(to right, var(--primary) 0%, var(--secondary) 30%, var(--accent) 60%, var(--primary) 100%)',
        }}
      >
        {title.line3}
      </span>
    </h1>
  )
}
