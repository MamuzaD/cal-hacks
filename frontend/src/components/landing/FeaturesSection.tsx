import { Eye, Zap, Search } from "lucide-react";
import { LANDING_PAGE } from "~/constants";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
}

function FeatureCard({
  icon,
  title,
  description,
  colorClass,
}: FeatureCardProps) {
  return (
    <div className="bg-card border-3 border-foreground/80 rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all group">
      <div
        className={`w-20 h-20 ${colorClass} border-3 border-foreground/80 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform text-white shadow-md`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}

const iconMap = {
  Eye,
  Zap,
  Search,
};

export function FeaturesSection() {
  const { features } = LANDING_PAGE;

  return (
    <div className="bg-stone-muted-50 py-24 border-y-4 border-foreground/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-block bg-card border-2 border-foreground/80 px-6 py-3 rotate-[-0.5deg] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] mb-8">
            <h2 className="text-5xl md:text-6xl font-black text-foreground">
              {features.title}{" "}
              <span className="text-primary">{features.titleAccent}</span>{" "}
              {features.titleSuffix}
            </h2>
          </div>
          <p className="text-2xl text-muted-foreground font-light">
            {features.subtitle}{" "}
            <span className="font-bold text-primary underline decoration-4 decoration-sky-accent-200 underline-offset-4">
              {features.subtitleHighlight}
            </span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.cards.map((card, index) => {
            const Icon = iconMap[card.icon as keyof typeof iconMap];
            const colors = ["bg-primary", "bg-secondary", "bg-stone-muted"];
            return (
              <FeatureCard
                key={card.title}
                icon={<Icon className="w-8 h-8" />}
                title={card.title}
                description={card.description}
                colorClass={colors[index]}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

