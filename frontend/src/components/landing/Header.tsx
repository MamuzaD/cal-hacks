import { Network } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { brand, landingPage } from '~/constants'

export function Header() {
  return (
    <nav className="flex items-center justify-between mb-20">
      <div className="flex items-center space-x-3 group cursor-pointer">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl rotate-12 group-hover:rotate-0 transition-transform duration-300 glow-cyan" />
          <Network className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-bold text-foreground tracking-tight">
          {brand.name}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
        >
          {landingPage.nav.about}
        </Button>
        <div className="relative group/btn">
          <div className="absolute -inset-0.5 bg-primary rounded-xl blur opacity-30 group-hover/btn:opacity-60 transition-opacity" />
          <Button className="relative glass border border-primary/30 hover:border-primary/50 text-primary font-semibold">
            {landingPage.nav.signIn}
          </Button>
        </div>
      </div>
    </nav>
  )
}
