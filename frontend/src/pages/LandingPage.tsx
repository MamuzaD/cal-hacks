import { FeaturesSection, HeroSection } from '~/components/landing'

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative">
        {/* Subtle background gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* <div className="absolute top-4 right-4 sm:top-8 sm:right-48 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full bg-primary opacity-30 dark:opacity-19 blur-[110px] animate-float" /> */}
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] rounded-full bg-accent opacity-12 blur-[100px] animate-float animation-delay-1s" />
          <div className="absolute top-1/2 left-1/2 w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] rounded-full bg-secondary opacity-12 blur-[80px] animate-float animation-delay-2s" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-16 sm:pb-24">
          <HeroSection />
        </div>

        {/* Gradient transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      </div>

      <FeaturesSection />
      {/* <CTASection /> */}
    </div>
  )
}
