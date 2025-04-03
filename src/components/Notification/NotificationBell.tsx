'use client'

import { useEffect, useState } from 'react'
import { FaBell } from 'react-icons/fa'
import axios from '@/lib/axios'
import NotificationList from './NotificationList'

const NotificationBell = () => {
  const [showList, setShowList] = useState(false)
  const [unread, setUnread] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  const toggleList = () => setShowList(prev => !prev)

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/auth/notifications/')
      setNotifications(res.data)
      const hasUnread = res.data.some((n: any) => !n.is_read)
      setUnread(hasUnread)
    } catch (err) {
      console.error('Error fetching notifications:', err)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <>
      <button
        onClick={toggleList}
        className="fixed bottom-6 left-6 z-50 rounded-full bg-primary text-white p-3 shadow-lg hover:bg-primaryho transition-all"
      >
        <div className="relative">
          <FaBell size={20} />
          {unread && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border border-white"></span>
          )}
        </div>
      </button>

      {showList && (
        <NotificationList
          notifications={notifications}
          onClose={() => setShowList(false)}
          refresh={fetchNotifications}
        />
      )}
    </>
  )
}

export default NotificationBell
