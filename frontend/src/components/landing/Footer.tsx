import { Network } from "lucide-react";
import { BRAND } from "~/constants";

export function Footer() {
  return (
    <footer className="bg-foreground border-t-4 border-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="relative">
              <div className="w-8 h-8 bg-primary rotate-45 rounded-sm" />
              <Network className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">{BRAND.name}</span>
          </div>
          <div className="text-stone-400 text-sm font-medium">
            {BRAND.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
}

