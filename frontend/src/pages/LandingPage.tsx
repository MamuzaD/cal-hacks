import {
  Header,
  HeroSection,
  FeaturesSection,
  UseCasesSection,
  CTASection,
  Footer,
} from "~/components/landing";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-sky-accent-50 via-purple-accent-50 to-background">
        {/* Organic connecting lines pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="connection-pattern"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="50" cy="50" r="2" fill="currentColor" className="text-primary" />
                <line
                  x1="50"
                  y1="50"
                  x2="100"
                  y2="0"
                  stroke="currentColor"
                  className="text-primary"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <line
                  x1="50"
                  y1="50"
                  x2="0"
                  y2="100"
                  stroke="currentColor"
                  className="text-primary"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#connection-pattern)"
            />
          </svg>
        </div>

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
  );
}
