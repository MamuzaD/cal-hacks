import { createFileRoute, Link } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/showcase')({
  component: ShowcasePage,
})

function ShowcasePage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            No Results Found
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We couldn't find any matching records in our database. Try searching
            with a different term or explore our example searches.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-background font-semibold"
              >
                Back to Search
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="glass">
              Browse Examples
            </Button>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-2">Campaign Finance</h3>
              <p className="text-sm text-muted-foreground">
                Search through FEC campaign finance records
              </p>
            </div>
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-2">Lobbying Reports</h3>
              <p className="text-sm text-muted-foreground">
                Explore lobbying disclosure filings and registrations
              </p>
            </div>
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-2">Stock Holdings</h3>
              <p className="text-sm text-muted-foreground">
                View financial disclosures and stock transactions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
