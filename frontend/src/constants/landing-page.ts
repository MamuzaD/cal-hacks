export const landingPage = {
  hero: {
    title: {
      line1: 'Connect',
      line2: 'the Dots',
      line3: 'Instantly',
    },
    quickStartLabel: 'Quick start →',
    previewLabel: 'DEMO PREVIEW',
    subtitle:
      'Uncover hidden connections between corporations and politicians through AI-powered analysis of',
    subtitleHighlight:
      'campaign finance, lobbying activities, and stock holdings',
    searchPlaceholder:
      "Search for a company or politician…",
    searchButton: 'Explore',
    exampleSearches: [
      { label: 'Pfizer', value: 'PFE' },
      { label: 'Nvidia', value: 'NVDA' },
      { label: 'Google', value: 'GOOGL' },
      { label: 'JPMorgan', value: 'JPM' },
    ],
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
    titleAccent: '+',

    titleSuffix: 'Conspiracy Map',
    subtitleHighlight: 'verifiable public records and disclosures',
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
  cta: {
    title: {
      line1: 'Follow the Money,',
      line2: 'See the Influence',
    },
    subtitle:
      'Discover the intricate web of influence between corporations and politicians through comprehensive analysis of campaign finance, lobbying activities, and stock holdings.',
    primaryButton: 'Get Started Free',
    secondaryButton: 'Watch Demo',
  },
  nav: {
    about: 'About',
    signIn: 'Sign In',
  },
} as const
