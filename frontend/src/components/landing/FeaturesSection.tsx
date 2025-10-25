import { Eye, Search, Zap } from 'lucide-react'
import { landingPage } from '~/constants'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  colorClass: string
}

function FeatureCard({
  icon,
  title,
  description,
  colorClass,
}: FeatureCardProps) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
      <div className="relative glass-strong rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300 group-hover:scale-[1.02]">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${colorClass === 'bg-primary' ? 'bg-primary/20 border border-primary/30 glow-cyan' : colorClass === 'bg-secondary' ? 'bg-secondary/20 border border-secondary/30 glow-magenta' : 'bg-white/5 border border-white/10'}`}
        >
          <div
            className={
              colorClass === 'bg-primary'
                ? 'text-primary'
                : colorClass === 'bg-secondary'
                  ? 'text-secondary'
                  : 'text-muted-foreground'
            }
          >
            {icon}
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed font-light">
          {description}
        </p>
      </div>
    </div>
  )
}

const iconMap = {
  Eye,
  Zap,
  Search,
}

export function FeaturesSection() {
  const { features } = landingPage

  return (
    <div className="relative py-64 overflow-hidden">

      {/* Subtle animated orbs for continuity */}
      <div className="absolute top-1/2 right-1/4 w-[250px] h-[250px] rounded-full bg-accent/50 blur-[120px] animate-float" />
      <div
        className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-secondary/6 blur-[100px] animate-float"
        style={{ animationDelay: '1.5s' }}
      />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            {features.title}{' '}
            <span className="text-primary text-glow-cyan">
              {features.titleAccent}
            </span>{' '}
            {features.titleSuffix}
          </h2>
          <p className="text-xl text-muted-foreground font-light">
            {features.subtitle}{' '}
            <span className="font-semibold text-primary">
              {features.subtitleHighlight}
            </span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.cards.map((card, index) => {
            const Icon = iconMap[card.icon]
            const colors = ['bg-primary', 'bg-secondary', 'bg-accent']
            return (
              <FeatureCard
                key={card.title}
                icon={<Icon className="w-8 h-8" />}
                title={card.title}
                description={card.description}
                colorClass={colors[index]}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
