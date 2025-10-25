import { Button } from '~/components/ui/button'
import { landingPage } from '~/constants'

export function CTASection() {
  const { cta } = landingPage

  return (
    <div className="relative py-32 overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-[150px]" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group">
          {/* Outer glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-[2rem] opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-500" />

          {/* Main CTA card */}
          <div className="relative glass-strong rounded-[2rem] p-12 md:p-16 text-center border border-white/10">
            {/* Decorative light beams */}
            <div className="absolute top-0 left-1/4 w-[2px] h-full bg-gradient-to-b from-primary/50 via-transparent to-transparent" />
            <div className="absolute top-0 right-1/4 w-[2px] h-full bg-gradient-to-b from-secondary/50 via-transparent to-transparent" />

            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              <span
                className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-shimmer"
                style={{ backgroundSize: '200% auto' }}
              >
                {cta.title.line1}
              </span>
              <br />
              <span
                className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent animate-shimmer"
                style={{ backgroundSize: '200% auto', animationDelay: '0.5s' }}
              >
                {cta.title.line2}
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light">
              {cta.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <div className="relative group/btn">
                <div className="absolute -inset-0.5 bg-primary rounded-xl blur-lg opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                <Button
                  size="lg"
                  className="relative bg-primary hover:bg-primary/90 text-background text-lg px-10 py-7 font-semibold rounded-xl border border-primary/50 transition-all"
                >
                  {cta.primaryButton}
                </Button>
              </div>

              <div className="relative group/btn">
                <div className="absolute -inset-0.5 bg-secondary rounded-xl blur-lg opacity-30 group-hover/btn:opacity-70 transition-opacity" />
                <Button
                  size="lg"
                  className="relative glass border border-white/20 hover:border-secondary/50 text-foreground text-lg px-10 py-7 font-semibold rounded-xl transition-all"
                >
                  {cta.secondaryButton}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
