import { Network } from 'lucide-react'
import { brand } from '~/constants'

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-12 mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0 group cursor-pointer">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg rotate-12 group-hover:rotate-0 transition-transform duration-300" />
              <Network className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">
              {brand.name}
            </span>
          </div>
          <div className="text-muted-foreground text-sm font-light">
            {brand.copyright}
          </div>
        </div>
      </div>
    </footer>
  )
}
