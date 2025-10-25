import { Button } from '~/components/ui/button'
import { landingPage } from '~/constants'

export function CTASection() {
  const { cta } = landingPage

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">

      {/* Animated radial gradient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="relative">
          {/* Primary gradient */}
          <div className="w-[90vw] h-[60vw] max-w-[1200px] max-h-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-secondary/10 to-transparent opacity-80 blur-2xl animate-pulse-glow" />
          {/* Secondary accent gradient */}
          <div className="absolute inset-0 w-[70vw] h-[45vw] max-w-[900px] max-h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/15 via-primary/5 to-transparent opacity-60 blur-3xl animate-float animation-delay-1s" />
        </div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-100 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group">
          {/* Enhanced outer glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500" />

          {/* Main CTA card with enhanced styling */}
          <div className="relative glass-strong rounded-[2rem] p-8 md:p-12 lg:p-16 text-center border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/10">
            {/* Enhanced title with better typography */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-shimmer inline-block shimmer-bg-200">
                {cta.title.line1}
              </span>
              <br />
              <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent animate-shimmer inline-block shimmer-bg-200 animation-delay-1s">
                {cta.title.line2}
              </span>
            </h2>

            {/* Enhanced subtitle */}
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              {cta.subtitle}
            </p>

            {/* Enhanced button container */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
              {/* Primary button with enhanced effects */}
              <div className="relative group/btn">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-xl blur-lg opacity-60 group-hover/btn:opacity-100 transition-all duration-500 animate-pulse-glow" />
                <Button
                  size="lg"
                  className="relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-background text-lg px-8 md:px-10 py-6 md:py-7 font-semibold rounded-xl border border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
                >
                  <span className="relative z-10">{cta.primaryButton}</span>
                </Button>
              </div>

              {/* Secondary button with enhanced effects */}
              <div className="relative group/btn">
                <div className="absolute -inset-1 bg-gradient-to-r from-secondary via-accent to-secondary rounded-xl blur-lg opacity-40 group-hover/btn:opacity-80 transition-all duration-500" />
                <Button
                  size="lg"
                  variant="outline"
                  className="relative glass border border-white/20 hover:border-secondary/50 text-foreground text-lg px-8 md:px-10 py-6 md:py-7 font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-secondary/25 focus:ring-2 focus:ring-secondary/50 focus:ring-offset-2 focus:ring-offset-background backdrop-blur-md"
                >
                  <span className="relative z-10">{cta.secondaryButton}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
