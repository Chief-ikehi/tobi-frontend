import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import NotificationBadge from '@/components/notifications/NotificationBadge';

export default function Header() {
  const { data: session } = useSession();
  const { unreadCount } = useNotifications();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <nav className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between">
          {/* ... existing navigation items ... */}
          
          <div className="flex items-center space-x-4">
            {session?.user && (
              <>
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
                <NotificationBadge />
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 