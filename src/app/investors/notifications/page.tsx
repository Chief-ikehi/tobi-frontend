'use client';

import React, { useState } from 'react';
import { format, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'investment' | 'property' | 'account' | 'document';
  status: 'unread' | 'read';
  date: string;
  action?: {
    label: string;
    href: string;
  };
  image?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Investment Opportunity',
    message: 'A new property matching your investment preferences is now available.',
    type: 'investment',
    status: 'unread',
    date: '2024-03-15T10:00:00Z',
    action: {
      label: 'View Property',
      href: '/investors/opportunities/1'
    }
  },
  {
    id: '2',
    title: 'Monthly Statement Available',
    message: 'Your investment statement for February 2024 is now ready to view.',
    type: 'document',
    status: 'unread',
    date: '2024-03-01T09:00:00Z',
    action: {
      label: 'View Statement',
      href: '/investors/documents'
    }
  },
  {
    id: '3',
    title: 'Property Update',
    message: 'Maintenance work has been completed on your invested property at Victoria Island.',
    type: 'property',
    status: 'read',
    date: '2024-02-28T15:30:00Z'
  },
  {
    id: '4',
    title: 'Account Security',
    message: 'A new device was used to access your account. Please verify if this was you.',
    type: 'account',
    status: 'read',
    date: '2024-02-25T08:15:00Z',
    action: {
      label: 'Review Activity',
      href: '/investors/settings'
    }
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const notificationTypes = [
    { id: 'all', label: 'All Notifications' },
    { id: 'investment', label: 'Investments' },
    { id: 'property', label: 'Properties' },
    { id: 'document', label: 'Documents' },
    { id: 'account', label: 'Account' }
  ];

  const filteredNotifications = selectedType === 'all'
    ? notifications
    : notifications.filter(notification => notification.type === selectedType);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, status: 'read' } : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {
      today: [],
      yesterday: [],
      thisWeek: [],
      earlier: [],
    };

    notifications.forEach(notification => {
      const date = parseISO(notification.date);
      if (isToday(date)) {
        groups.today.push(notification);
      } else if (isYesterday(date)) {
        groups.yesterday.push(notification);
      } else if (isThisWeek(date)) {
        groups.thisWeek.push(notification);
      } else {
        groups.earlier.push(notification);
      }
    });

    return groups;
  };

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'investment':
        return (
          <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'property':
        return (
          <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'document':
        return (
          <svg className="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'account':
        return (
          <svg className="h-6 w-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount} unread notifications
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => setNotifications(notifications.map(notification => ({
                ...notification,
                status: 'read'
              })))}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-1 sm:p-2">
            <nav className="flex gap-2 overflow-x-auto pb-2">
              {notificationTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                    selectedType === type.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([group, notifications]) => 
            notifications.length > 0 ? (
              <div key={group} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <h2 className="text-sm font-medium text-gray-600 uppercase">
                    {group === 'today' ? 'Today' :
                     group === 'yesterday' ? 'Yesterday' :
                     group === 'thisWeek' ? 'This Week' : 'Earlier'}
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`group relative p-4 transition-colors ${
                        notification.status === 'unread' ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-sm font-medium text-gray-900 pr-8">
                                {notification.title}
                              </h3>
                              <p className={`mt-1 text-sm text-gray-600 ${
                                expandedIds.has(notification.id) ? '' : 'line-clamp-2'
                              }`}>
                                {notification.message}
                              </p>
                              {notification.message.length > 120 && (
                                <button
                                  onClick={() => toggleExpanded(notification.id)}
                                  className="mt-1 text-xs text-primary-600 hover:text-primary-700"
                                >
                                  {expandedIds.has(notification.id) ? 'Show less' : 'Read more'}
                                </button>
                              )}
                            </div>
                            <p className="ml-4 text-xs text-gray-500 whitespace-nowrap">
                              {format(parseISO(notification.date), 'h:mm a')}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center gap-4">
                            {notification.action && (
                              <a
                                href={notification.action.href}
                                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                              >
                                {notification.action.label}
                                <svg
                                  className="ml-1.5 h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {notification.status === 'unread' && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Mark as read"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete notification"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
} 