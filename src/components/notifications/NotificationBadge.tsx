'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

export default function NotificationBadge() {
  const { unreadCount } = useNotifications();

  return (
    <Link
      href="/messages"
      className="relative inline-flex items-center p-2 text-sm font-medium text-center text-gray-700 hover:text-gray-900 focus:outline-none"
    >
      <MessageSquare className="h-6 w-6" />
      {unreadCount > 0 && (
        <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -right-1">
          {unreadCount}
        </div>
      )}
    </Link>
  );
} 