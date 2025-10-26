import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, Users, Building2, DollarSign } from 'lucide-react';
import { queryKeys } from '~/lib/queryKeys';

// API is centralized in lib/api.ts

const Dashboard: React.FC = () => {
  // Use React Query for data fetching with auto-refresh
  const { data: stats, isLoading, error } = useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/dashboard/stats`)
      if (!res.ok) throw new Error('Failed to fetch stats')
      return res.json()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading dashboard data
      </div>
    );
  }

  // Mock data for now - replace with actual API data
  const mockStats = {
    totalPoliticians: 6,
    totalCompanies: 6,
    totalHoldingValue: 15850000,
    averageHolding: 1320833,
    topPolitician: 'David Morales',
    topCompany: 'Sunterra Infrastructure LLC'
  };

  const displayStats = stats || mockStats;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Political Holdings Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Politicians</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayStats.totalPoliticians}</div>
            <p className="text-xs text-muted-foreground">
              Active in database
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayStats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              With political holdings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Holdings Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(displayStats.totalHoldingValue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              Across all politicians
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Holding</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(displayStats.averageHolding / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">
              Per politician
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Politician by Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{displayStats.topPolitician}</div>
            <p className="text-sm text-gray-600">Speaker of the House - Texas</p>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              View Details
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Held Company</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{displayStats.topCompany}</div>
            <p className="text-sm text-gray-600">Ticker: SUNX</p>
            <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              View Network
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search politicians or companies..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Search
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
