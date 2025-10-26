import { Network } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { brand } from '~/constants'
import { SearchBar } from '~/components/ui/search'
import { ThemeToggle } from '~/components/ui/theme-toggle'

export function Header() {
  return (
    <nav className="flex items-center justify-between py-4 gap-4">
      <Link
        to="/"
        className="flex items-center space-x-3 group cursor-pointer flex-shrink-0"
      >
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-accent rounded-xl rotate-200 group-hover:rotate-0 transition-transform duration-300 glow-cyan" />
          <Network className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-bold text-foreground tracking-tight">
          {brand.name}
        </span>
      </Link>

      <div className="flex items-center gap-4 flex-shrink-0">
        <ThemeToggle />
        <div className="hidden sm:block">
          <SearchBar placeholder="Search" variant="compact" />
        </div>
      </div>
    </nav>
  )
}
