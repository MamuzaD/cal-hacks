import {
  CTASection,
  FeaturesSection,
  Footer,
  Header,
  HeroSection,
  UseCasesSection,
} from '~/components/landing'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with Spatial Background */}
      <div className="relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[#479ce6] opacity-20 blur-[150px] animate-float" />
          <div
            className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[#887be3] opacity-20 blur-[120px] animate-float"
            style={{ animationDelay: '1s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-[#7681a3] opacity-10 blur-[100px] animate-float"
            style={{ animationDelay: '2s' }}
          />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid-pattern"
                x="0"
                y="0"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="rgba(71, 156, 230, 0.3)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        {/* Light beam effect */}
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-[#479ce6] via-transparent to-transparent opacity-30" />
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-[#887be3] via-transparent to-transparent opacity-20" />
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-[#7681a3] via-transparent to-transparent opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
          <Header />
          <HeroSection />
        </div>
      </div>

      <FeaturesSection />
      <UseCasesSection />
      <CTASection />
      <Footer />
    </div>
  )
}
