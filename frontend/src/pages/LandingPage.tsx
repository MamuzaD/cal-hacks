import {
  CTASection,
  FeaturesSection,
  Footer,
  GraphOverlay,
  Header,
  HeroSection,
} from '~/components/landing'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative">
        {/* Subtle background gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-8 right-32 w-[600px] h-[600px] rounded-full bg-primary opacity-30 dark:opacity-19 blur-[110px] animate-float" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-accent opacity-12 blur-[100px] animate-float animation-delay-1s" />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-secondary opacity-12 blur-[80px] animate-float animation-delay-2s" />

          {/* Interactive Graph Overlay */}
          <GraphOverlay />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
          <Header />
          <HeroSection />
        </div>

        {/* Gradient transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      </div>

      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  )
}
