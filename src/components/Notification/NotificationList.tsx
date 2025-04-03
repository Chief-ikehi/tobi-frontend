'use client'

import { FaTimes } from 'react-icons/fa'
import { formatDistanceToNow } from 'date-fns'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'

interface NotificationListProps {
  notifications: any[]
  onClose: () => void
  refresh: () => void
}

export default function NotificationList({ notifications, onClose, refresh }: NotificationListProps) {
  const markAsRead = async (id: number) => {
    try {
      await axios.post(`/auth/notifications/${id}/read/`)
      refresh()
    } catch (err) {
      toast.error('Failed to mark notification as read.')
    }
  }

  return (
    <div className="fixed bottom-20 left-6 z-50 w-80 max-h-[400px] overflow-y-auto rounded-lg border bg-white p-4 shadow-lg dark:bg-blacksection dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">Notifications</h3>
        <button onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`rounded px-3 py-2 text-sm cursor-pointer ${
                n.is_read ? 'bg-gray-100 dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900'
              }`}
              onClick={() => markAsRead(n.id)}
            >
              <p className="font-medium">{n.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(n.created_at))} ago
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
