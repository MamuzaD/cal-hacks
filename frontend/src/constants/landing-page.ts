export const LANDING_PAGE = {
  hero: {
    title: {
      line1: "Connect",
      line2: "the Dots",
      line3: "Instantly",
    },
    subtitle:
      "An AI map of connections between people, organizations, and actions — so you can see",
    subtitleHighlight: "who's connected to what",
    searchPlaceholder: "Type 'Pfizer', 'Tesla', or any organization...",
    searchButton: "Explore",
    quickStartLabel: "Quick start →",
    exampleSearches: ["Pfizer", "Tesla", "OpenAI", "JPMorgan"],
    previewLabel: "LIVE PREVIEW",
    previewDescription: "Real-time connections from verified data sources",
    connectionNodes: [
      { label: "15 Lawmakers", icon: "Users" },
      { label: "28 Bills", icon: "FileText" },
      { label: "8 Lobbyists", icon: "Building2" },
      { label: "12 Universities", icon: "TrendingUp" },
    ],
  },
  features: {
    title: "Wikipedia",
    titleAccent: "+",
    titleSuffix: "Conspiracy Map",
    subtitle: "But with",
    subtitleHighlight: "Real Data",
    cards: [
      {
        title: "Visual Clarity",
        description:
          "Turn complex relationships into interactive, intuitive graphs. See the full picture at a glance.",
        icon: "Eye",
      },
      {
        title: "AI-Powered",
        description:
          "Our AI automatically discovers and maps connections you'd never find manually. Instant insights.",
        icon: "Zap",
      },
      {
        title: "Deep Discovery",
        description:
          "Explore connections between people, organizations, bills, and actions. Perfect for journalists and researchers.",
        icon: "Search",
      },
    ],
  },
  useCases: {
    title: "Who It's For",
    cards: [
      {
        title: "Journalists",
        description:
          "Uncover hidden connections for investigative reporting. Follow the money, track influence.",
        icon: "FileText",
      },
      {
        title: "Students",
        description:
          "Research complex topics visually. Understand how organizations and people interrelate.",
        icon: "Users",
      },
      {
        title: "Curious Minds",
        description:
          "Satisfy your curiosity about how the world really works. Discover surprising connections.",
        icon: "Eye",
      },
    ],
  },
  cta: {
    title: {
      line1: "Start Connecting",
      line2: "the Dots",
    },
    subtitle:
      "Join thousands discovering hidden connections and gaining insights into how the world works.",
    primaryButton: "Get Started Free",
    secondaryButton: "Watch Demo",
  },
  nav: {
    about: "About",
    signIn: "Sign In",
  },
} as const;

