import { Eye, FileText, Users } from 'lucide-react'
import { landingPage } from '~/constants'

interface UseCaseCardProps {
  title: string
  description: string
  icon: React.ReactNode
  colorClass: string
}

function UseCaseCard({
  title,
  description,
  icon,
  colorClass,
}: UseCaseCardProps) {
  const glowClass = colorClass.includes('red')
    ? 'glow-hover-magenta'
    : colorClass.includes('primary')
      ? 'glow-hover-cyan'
      : 'glow-hover-cyan'

  return (
    <div className={`relative group ${glowClass}`}>
      <div
        className={`absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 ${colorClass.includes('red') ? 'bg-red-500/20' : colorClass.includes('primary') ? 'bg-primary/20' : 'bg-secondary/20'}`}
      />
      <div className="relative glass-strong rounded-3xl p-10 border border-white/5 hover:border-white/10 transition-all duration-300 group-hover:scale-[1.02]">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${colorClass.includes('red') ? 'bg-red-500/20 border border-red-500/30' : colorClass.includes('primary') ? 'bg-primary/20 border border-primary/30' : 'bg-secondary/20 border border-secondary/30'}`}
        >
          <div
            className={
              colorClass.includes('red')
                ? 'text-red-400'
                : colorClass.includes('primary')
                  ? 'text-primary'
                  : 'text-secondary'
            }
          >
            {icon}
          </div>
        </div>
        <h3 className="text-3xl font-bold mb-4 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-lg font-light">
          {description}
        </p>
      </div>
    </div>
  )
}

const iconMap = {
  FileText,
  Users,
  Eye,
}

export function UseCasesSection() {
  const { useCases } = landingPage

  return (
    <div className="relative py-32 overflow-hidden">
      {/* Gradient background for seamless flow */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/98 to-background" />
      
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[120px] animate-float" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/6 blur-[140px] animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            {useCases.title}
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full opacity-50" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.cards.map((card, index) => {
            const Icon = iconMap[card.icon]
            const colors = ['bg-red-500', 'bg-primary', 'bg-secondary']
            return (
              <UseCaseCard
                key={card.title}
                title={card.title}
                description={card.description}
                icon={<Icon className="w-10 h-10" />}
                colorClass={colors[index]}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
