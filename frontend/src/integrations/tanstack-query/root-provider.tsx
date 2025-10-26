import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function getContext() {
  const queryClient = new QueryClient()
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

    window.fetch = async (...args) => {
      const [input, init] = args
      const urlString = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      const method = init?.method || 'GET'
      const endpoint = new URL(urlString).pathname
      const groupTitle = `[${method}] ${endpoint}`

      console.groupCollapsed(groupTitle)

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
        return response
      } catch (error) {
        console.error('Fetch error:', error)
        console.groupEnd()
        throw error
      }
    }
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
