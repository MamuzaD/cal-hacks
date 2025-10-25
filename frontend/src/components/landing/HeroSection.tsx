import { Search } from 'lucide-react'
import { NetworkPreview } from './NetworkPreview'
import { Button } from '~/components/ui/button'
import { brand, landingPage } from '~/constants'

export function HeroSection() {
  const { hero } = landingPage

  return (
    <div className="max-w-5xl mx-auto space-y-12 pt-16">
      <div className="space-y-8">
        <div className="inline-block">
          <div className="glass px-6 py-2 rounded-full text-sm font-medium text-muted-foreground border border-primary/20 glow-cyan">
            <span className="text-primary">●</span> {brand.tagline}
          </div>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.1]">
          <span className="block text-foreground">{hero.title.line1}</span>
          <span className="block text-foreground">{hero.title.line2}</span>
          <span
            className="block bg-gradient-to-r from-[#479ce6] via-[#887be3] to-[#479ce6] bg-clip-text text-transparent text-glow-cyan animate-shimmer"
            style={{ backgroundSize: '200% auto' }}
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
      <div className="max-w-2xl mt-16">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#479ce6] to-[#887be3] rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
          <div className="relative flex items-center glass-strong rounded-2xl px-6 py-5 border border-white/10 hover:border-primary/30 transition-all">
            <Search className="w-6 h-6 text-primary mr-3 animate-pulse-glow" />
            <input
              type="text"
              placeholder={hero.searchPlaceholder}
              className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-lg font-light"
            />
            <Button className="ml-4 bg-primary hover:bg-primary/90 text-background font-semibold glow-hover-cyan transition-all">
              {hero.searchButton}
            </Button>
          </div>

          {/* Example tags */}
          <div className="flex items-center justify-start gap-3 mt-6 flex-wrap">
            <span className="text-sm text-muted-foreground font-medium">
              {hero.quickStartLabel}
            </span>
            {hero.exampleSearches.map((example: string, index: number) => (
              <button
                key={example}
                className="px-4 py-2 glass rounded-xl text-sm font-medium text-foreground hover:text-primary border border-white/5 hover:border-primary/30 transition-all hover:scale-105 glow-hover-cyan"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Network Visualization Preview */}
      <NetworkPreview />
    </div>
  )
}
