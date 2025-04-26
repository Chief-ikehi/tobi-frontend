'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import ServiceRequestCard from './ServiceRequestCard'

export default function RequestsManagement() {
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState<any[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/auth/service-requests/')
        setRequests(response.data)
      } catch (error) {
        console.error('Failed to fetch service requests:', error)
        toast.error('Failed to load service requests')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(request => request.status === filter)

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Service Requests</h1>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: 'All Requests' },
          { id: 'pending', label: 'Pending' },
          { id: 'accepted', label: 'Accepted' },
          { id: 'completed', label: 'Completed' },
          { id: 'rejected', label: 'Rejected' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === tab.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-blacksection dark:text-gray-300 dark:hover:bg-blacksection/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10">Loading requests...</div>
      ) : filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((request) => (
            <ServiceRequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-blacksection p-10 rounded-lg text-center">
          <p className="text-gray-500 dark:text-gray-400">No {filter !== 'all' ? filter : ''} service requests found.</p>
        </div>
      )}
    </div>
  )
}
