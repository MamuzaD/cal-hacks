import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnMount: false,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        retry: 2,
      },
      mutations: {
        retry: 1,
      },
    },
  })
  return {
    queryClient,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  // Log all React Query calls in dev mode
  if (!import.meta.env.PROD) {
    const originalFetch = window.fetch
    let currentGroup: string | null = null

    window.fetch = async (...args) => {
      const [input, init] = args
      const urlString = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      const method = init?.method || 'GET'
      const endpoint = new URL(urlString).pathname
      const groupTitle = `[${method}] ${endpoint}`

      if (currentGroup !== groupTitle) {
        if (currentGroup) console.groupEnd()
        console.groupCollapsed(groupTitle)
        currentGroup = groupTitle
      }

      try {
        const response = await originalFetch(...args)
        const clone = response.clone()
        let body = null
        try {
          const contentType = response.headers.get('content-type')
          if (contentType?.includes('application/json')) {
            body = await clone.json()
          }
        } catch {}
        console.log('Response:', { ok: response.ok, status: response.status, body })
        console.groupEnd()
        currentGroup = null
        return response
      } catch (error) {
        console.error('Fetch error:', error)
        console.groupEnd()
        currentGroup = null
        throw error
      }
    }
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
