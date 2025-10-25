import { Button } from "~/components/ui/button";
import { landingPage } from "~/constants";

export function CTASection() {
  const { cta } = landingPage;

  return (
    <div className="bg-stone-muted-50 py-24 border-t-4 border-foreground/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="bg-primary border-4 border-foreground/80 rounded-3xl p-12 md:p-16 text-center shadow-[16px_16px_0px_0px_rgba(0,0,0,0.8)] rotate-[-0.5deg] hover:rotate-0 transition-transform">
            {/* Pushpins decoration */}
            <div className="absolute -top-6 left-1/4 w-6 h-6 bg-red-500 rounded-full border-3 border-foreground/80 shadow-lg" />
            <div className="absolute -top-6 right-1/4 w-6 h-6 bg-yellow-400 rounded-full border-3 border-foreground/80 shadow-lg" />

            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              {cta.title.line1}
              <br />
              {cta.title.line2}
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
              {cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-xl px-10 py-7 font-bold border-3 border-foreground/80 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
              >
                {cta.primaryButton}
              </Button>
              <Button
                size="lg"
                className="bg-secondary text-white hover:bg-secondary/90 text-xl px-10 py-7 font-bold border-3 border-foreground/80 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
              >
                {cta.secondaryButton}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

