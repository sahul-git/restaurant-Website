'use client'

import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { api } from '../../lib/api'

export default function Tables() {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTables()
  }, [])

  const loadTables = async () => {
    try {
      const data = await api.getTables()
      setTables(data)
    } catch (error) {
      console.error('Failed to load tables:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTableStatus = async (tableId, status) => {
    try {
      await api.updateTable(tableId, { status })
      loadTables()
    } catch (error) {
      alert('Failed to update table: ' + error.message)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-300'
      case 'reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'occupied': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
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

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Table Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`bg-white rounded-lg shadow-lg p-6 border-2 ${getStatusColor(table.status)}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Table {table.number}</h3>
                  <p className="text-sm text-gray-600 mt-1">{table.location}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(table.status)}`}>
                  {table.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">Capacity</p>
                <p className="text-lg font-semibold">{table.capacity} guests</p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => updateTableStatus(table.id, 'available')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg ${
                    table.status === 'available'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Available
                </button>
                <button
                  onClick={() => updateTableStatus(table.id, 'reserved')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg ${
                    table.status === 'reserved'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Reserved
                </button>
                <button
                  onClick={() => updateTableStatus(table.id, 'occupied')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg ${
                    table.status === 'occupied'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Occupied
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

