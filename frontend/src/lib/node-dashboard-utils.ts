// Formatting utilities for NodeDashboard

export const formatCurrency = (value?: number, isSold: boolean = false) => {
  if (!value) return 'N/A'
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

  // Add profit indicator for sold positions
  if (isSold) {
    return `${formatted} profit`
  }
  return formatted
}

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Styling utilities for NodeDashboard

export const getTypeColor = (type: string) => {
  switch (type) {
    case 'company':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'person':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

export const getEdgeTypeColor = (type: string, status?: string) => {
  // For stock-holding, status determines color
  if (type === 'stock-holding' && status === 'sold') {
    return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' // Cyan for sold
  }

  // Type-based colors (for active holdings and other types)
  if (type === 'stock-holding')
    return 'bg-green-500/20 text-green-400 border-green-500/30'
  if (type === 'campaign-contribution')
    return 'bg-red-500/20 text-red-400 border-red-500/30'
  if (type === 'lobbying')
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  if (type === 'investment')
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30'

  // Combined types (bidirectional relationships)
  if (type.includes(' + ')) {
    if (type.includes('stock-holding') && type.includes('lobbying'))
      return 'bg-lime-500/20 text-lime-400 border-lime-500/30'
    if (
      type.includes('stock-holding') &&
      type.includes('campaign-contribution')
    )
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    if (type.includes('lobbying') && type.includes('campaign-contribution'))
      return 'bg-orange-400/20 text-orange-300 border-orange-400/30'
    if (type.includes('stock-holding') && type.includes('investment'))
      return 'bg-teal-500/20 text-teal-400 border-teal-500/30'
    if (type.includes('lobbying') && type.includes('investment'))
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    if (type.includes('campaign-contribution') && type.includes('investment'))
      return 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    return 'bg-violet-500/20 text-violet-400 border-violet-500/30'
  }

  return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
}

export const getStatusLabel = (status?: string, type?: string) => {
  // Only show special label for sold stock holdings
  if (type === 'stock-holding' && status === 'sold') return 'Sold Position'
  return type
}

export const getStatusTextColor = (status?: string, type?: string) => {
  // Only special color for sold stock holdings
  if (type === 'stock-holding' && status === 'sold') {
    return 'text-cyan-400 font-semibold' // Cyan for sold
  }
  return 'text-muted-foreground'
}

