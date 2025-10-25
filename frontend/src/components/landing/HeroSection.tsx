import { Button } from "~/components/ui/button";
import { Search } from "lucide-react";
import { BRAND, LANDING_PAGE } from "~/constants";
import { NetworkPreview } from "./NetworkPreview";

export function HeroSection() {
  const { hero } = LANDING_PAGE;

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="space-y-6">
        <div className="inline-block">
          <div className="bg-purple-accent-100 text-secondary px-4 py-2 -rotate-1 shadow-sm border-l-4 border-secondary font-medium">
            {BRAND.tagline}
          </div>
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground leading-[0.95]">
          {hero.title.line1}
          <br />
          <span className="relative inline-block">
            <span className="relative z-10">{hero.title.line2}</span>
            <div className="absolute bottom-2 left-0 w-full h-4 bg-sky-accent-200 -rotate-1 z-0" />
          </span>
          <br />
          <span className="text-primary">{hero.title.line3}</span>
        </h1>
      </div>

      <p className="text-2xl md:text-3xl text-muted-foreground max-w-3xl font-light leading-relaxed">
        {hero.subtitle}{" "}
        <span className="font-semibold text-primary border-b-2 border-sky-accent-200">
          {hero.subtitleHighlight}
        </span>
        .
      </p>

      {/* Search Demo */}
      <div className="max-w-2xl mt-16">
        <div className="relative transform hover:scale-[1.02] transition-transform">
          <div className="absolute -inset-1 bg-linear-to-r from-primary/30 to-secondary/30 rounded-2xl opacity-20 blur" />
          <div className="relative flex items-center bg-card border-3 border-foreground/80 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] rounded-xl px-6 py-5">
            <Search className="w-6 h-6 text-primary mr-3" />
            <input
              type="text"
              placeholder={hero.searchPlaceholder}
              className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-lg font-medium"
            />
            <Button className="ml-4 border-2 border-foreground/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              {hero.searchButton}
            </Button>
          </div>

          {/* Example tags */}
          <div className="flex items-center justify-start gap-3 mt-6 flex-wrap">
            <span className="text-sm text-muted-foreground font-semibold">
              {hero.quickStartLabel}
            </span>
            {hero.exampleSearches.map((example) => (
              <Button
                key={example}
                className="px-4 py-2 bg-card hover:bg-stone-muted-50 border-2 border-foreground/80 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] text-sm font-semibold text-foreground transition-all"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Network Visualization Preview */}
      <NetworkPreview />
    </div>
  );
}
