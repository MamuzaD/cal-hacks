export const landingPage = {
  hero: {
    title: {
      line1: 'Connect',
      line2: 'the Dots',
      line3: 'Instantly',
    },
    quickStartLabel: 'Quick start →',
    previewLabel: "DEMO PREVIEW",
    subtitle:
      'An AI map of connections between companies and politicians—follow the money, see who lobbies whom, and where stock holdings may align with policy.',
    subtitleHighlight: 'funding, lobbying, and holdings',
    searchPlaceholder:
      "Try 'Pfizer', 'Tesla', 'BlackRock', or a politician's name…",
    searchButton: 'Explore',
    exampleSearches: ['Pfizer', 'Tesla', 'OpenAI', 'JPMorgan'],
    connectionNodes: [
      { label: 'Lawmakers', icon: 'Users' },
      { label: 'Bills & Votes', icon: 'FileText' },
      { label: 'Lobbying Filings', icon: 'Building2' },
      { label: 'Stock Holdings', icon: 'TrendingUp' },
    ],
  },
  features: {
    title: 'See the Network',
    subtitle: 'Built on',
    subtitleHighlight: 'verifiable filings and disclosures',
    cards: [
      {
        title: 'Visual Clarity',
        description:
          'Turn campaign finance, lobbying reports, bill sponsorships, and trades into an intuitive graph.',
        icon: 'Eye',
      },
      {
        title: 'AI-Powered',
        description:
          'Entity resolution links companies, PACs, politicians, committees, and bills to surface non-obvious ties.',
        icon: 'Zap',
      },
      {
        title: 'Source-Backed',
        description:
          'Every edge links back to verified sources like FEC reports, LDA filings, and financial disclosures.',
        icon: 'Search',
      },
    ],
  },
  useCases: {
    title: 'Who It’s For',
    cards: [
      {
        title: 'Journalists',
        description:
          'Trace influence: connect donors, lobbyists, votes, and personal holdings in minutes.',
        icon: 'FileText',
      },
      {
        title: 'Researchers & Students',
        description:
          'Study corporate–government relationships with transparent, cited data.',
        icon: 'Users',
      },
      {
        title: 'Civic Watchdogs',
        description:
          'Monitor potential conflicts of interest and spotlight patterns as they emerge.',
        icon: 'Eye',
      },
    ],
  },
  cta: {
    title: {
      line1: 'Follow the Money,',
      line2: 'See the Influence',
    },
    subtitle:
      'Explore the connections between companies and politicians—funding, lobbying, and stock holdings—in one interactive map.',
    primaryButton: 'Get Started Free',
    secondaryButton: 'Watch Demo',
  },
  nav: {
    about: 'About',
    signIn: 'Sign In',
  },
} as const
