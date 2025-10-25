import { FileText, Users, Eye } from "lucide-react";
import { LANDING_PAGE } from "~/constants";

interface UseCaseCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
}

function UseCaseCard({
  title,
  description,
  icon,
  colorClass,
}: UseCaseCardProps) {
  return (
    <div className="bg-card border-3 border-foreground/80 rounded-2xl p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all hover:rotate-1 group">
      <div
        className={`w-16 h-16 ${colorClass} text-white flex items-center justify-center mb-6 border-3 border-foreground/80 -rotate-3 group-hover:rotate-0 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-3xl font-black mb-4 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-lg">
        {description}
      </p>
    </div>
  );
}

const iconMap = {
  FileText,
  Users,
  Eye,
};

export function UseCasesSection() {
  const { useCases } = LANDING_PAGE;

  return (
    <div className="bg-background py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black text-foreground mb-4">
            {useCases.title}
          </h2>
          <div className="w-32 h-2 bg-sky-accent-200 mx-auto -rotate-1" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.cards.map((card, index) => {
            const Icon = iconMap[card.icon as keyof typeof iconMap];
            const colors = ["bg-red-500", "bg-primary", "bg-secondary"];
            return (
              <UseCaseCard
                key={card.title}
                title={card.title}
                description={card.description}
                icon={<Icon className="w-12 h-12" />}
                colorClass={colors[index]}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
