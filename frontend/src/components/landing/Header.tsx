import { Button } from "~/components/ui/button";
import { Network } from "lucide-react";
import { BRAND, LANDING_PAGE } from "~/constants";

export function Header() {
  return (
    <nav className="flex items-center justify-between mb-20">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-primary rotate-45 rounded-sm" />
          <Network className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white" />
        </div>
        <span className="text-3xl font-bold text-stone-muted tracking-tight">
          {BRAND.name}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground hover:bg-stone-muted-50"
        >
          {LANDING_PAGE.nav.about}
        </Button>
        <Button className="shadow-md border-2 border-primary/20">
          {LANDING_PAGE.nav.signIn}
        </Button>
      </div>
    </nav>
  );
}

