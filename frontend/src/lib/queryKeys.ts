// Centralized query keys ensure stable identities across the app
export const queryKeys = {
  dashboard: {
    stats: () => ['dashboard', 'stats'] as const,
  },
  visual: {
    byId: (id: string, type: string) => ['visual', type, id] as const,
  },
  search: {
    byQuery: (q: string) => ['search', q] as const,
  },
}

export type QueryKey = ReturnType<
  (typeof queryKeys)[keyof typeof queryKeys][keyof (typeof queryKeys)[keyof typeof queryKeys]]
>


