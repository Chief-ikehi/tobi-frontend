'use client'

import { useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import { FaCalendar, FaClock, FaUser, FaTools } from 'react-icons/fa'

interface ServiceRequestCardProps {
  request: any
}

export default function ServiceRequestCard({ request }: ServiceRequestCardProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(request.status)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'accepted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    try {
      await axios.patch(`/auth/service-requests/${request.id}/`, {
        status: newStatus,
      })
      setStatus(newStatus)
      toast.success(`Request ${newStatus} successfully`)
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Failed to update request status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-blacksection rounded-lg shadow-sm p-4 border border-stroke dark:border-strokedark">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg">{request.service_name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <FaUser className="mr-2 text-gray-400" />
          <span>{request.customer_name}</span>
        </div>
        <div className="flex items-center text-sm">
          <FaCalendar className="mr-2 text-gray-400" />
          <span>{formatDate(request.requested_date)}</span>
        </div>
        <div className="flex items-center text-sm">
          <FaClock className="mr-2 text-gray-400" />
          <span>{formatTime(request.requested_time)}</span>
        </div>
        <div className="flex items-center text-sm">
          <FaTools className="mr-2 text-gray-400" />
          <span>{request.estimated_hours} hour{request.estimated_hours !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
        {request.description}
      </p>

      {status === 'pending' && (
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusChange('accepted')}
            disabled={loading}
            className="flex-1 bg-primary text-white py-1.5 rounded-md hover:bg-primary/80 text-sm"
          >
            Accept
          </button>
          <button
            onClick={() => handleStatusChange('rejected')}
            disabled={loading}
            className="flex-1 bg-red-500 text-white py-1.5 rounded-md hover:bg-red-600 text-sm"
          >
            Decline
          </button>
        </div>
      )}

      {status === 'accepted' && (
        <button
          onClick={() => handleStatusChange('completed')}
          disabled={loading}
          className="w-full bg-green-500 text-white py-1.5 rounded-md hover:bg-green-600 text-sm"
        >
          Mark Completed
        </button>
      )}
    </div>
  )
}
