import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches

    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)

    // Apply theme to both html and body
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)

    // Apply theme to both html and body
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="icon"
      className="relative w-14 h-7 hover:bg-transparent cursor-pointer glass rounded-full border border-white/10 hover:border-primary/30 transition-all group overflow-hidden"
      aria-label="Toggle theme"
    >
      {/* Track glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Slider */}
      <div
        className={`absolute top-0.25 w-6 h-6 rounded-full bg-gradient-to-br  transition-all duration-300 ease-in-out ${
          theme === 'light'
            ? 'left-0.5 from-accent to-primary'
            : 'left-7 from-primary to-accent'
        }`}
      >
        <div className="w-full h-full flex items-center justify-center">
          {theme === 'light' ? (
            <Sun className="w-3.5 h-3.5 text-white" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-white" />
          )}
        </div>
      </div>

      {/* Icons in track */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun
          className={`w-3 h-3 transition-opacity ${theme === 'light' ? 'opacity-0 text-primary' : 'opacity-40 text-muted-foreground'}`}
        />
        <Moon
          className={`w-3 h-3 transition-opacity ${theme === 'dark' ? 'opacity-0 text-primary' : 'opacity-40 text-muted-foreground'}`}
        />
      </div>
    </Button>
  )
}
