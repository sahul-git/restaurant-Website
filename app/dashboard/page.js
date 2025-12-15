'use client'

import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { api } from '../../lib/api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await api.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </Layout>
    )
  }

  const statCards = [
    { label: 'Total Bookings', value: stats?.totalBookings || 0, color: 'bg-blue-500', icon: '📅' },
    { label: "Today's Bookings", value: stats?.todayBookings || 0, color: 'bg-green-500', icon: '📆' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, color: 'bg-purple-500', icon: '📋' },
    { label: "Today's Orders", value: stats?.todayOrders || 0, color: 'bg-yellow-500', icon: '🛒' },
    { label: 'Total Revenue', value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, color: 'bg-green-600', icon: '💰' },
    { label: "Today's Revenue", value: `$${stats?.todayRevenue?.toFixed(2) || '0.00'}`, color: 'bg-emerald-600', icon: '💵' },
    { label: 'Available Tables', value: `${stats?.availableTables || 0}/${stats?.totalTables || 0}`, color: 'bg-indigo-500', icon: '🪑' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, color: 'bg-orange-500', icon: '⏳' },
  ]

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} rounded-full p-3 text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Customers</span>
                <span className="font-semibold">{stats?.totalCustomers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Menu Items</span>
                <span className="font-semibold">{stats?.totalMenuItems || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Staff Members</span>
                <span className="font-semibold">{stats?.totalStaff || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">System</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tables</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {stats?.availableTables || 0} Available
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Orders</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  {stats?.pendingOrders || 0} Pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

