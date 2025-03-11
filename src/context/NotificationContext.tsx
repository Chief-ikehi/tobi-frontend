'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@apollo/client';
import { GET_MESSAGES } from '@/lib/graphql/messages';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { gql } from '@apollo/client';

interface NotificationContextType {
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  isRead: boolean;
  recipientId: string;
  senderId: string;
  sender: {
    fullName: string;
  };
  property?: {
    id: string;
    title: string;
  };
}

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
});

export const useNotifications = () => useContext(NotificationContext);

const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription OnNewMessage($userId: String!) {
    newMessage(userId: $userId) {
      id
      content
      senderId
      sender {
        fullName
      }
      property {
        id
        title
      }
    }
  }
`;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const user = session?.user as User | undefined;

  const { data, subscribeToMore } = useQuery(GET_MESSAGES, {
    skip: !user?.id,
  });

  useEffect(() => {
    if (data?.messages && user?.id) {
      const count = data.messages.filter(
        (msg: Message) => !msg.isRead && msg.recipientId === user.id
      ).length;
      setUnreadCount(count);
    }
  }, [data?.messages, user?.id]);

  useEffect(() => {
    if (user?.id) {
      const unsubscribe = subscribeToMore({
        document: NEW_MESSAGE_SUBSCRIPTION,
        variables: { userId: user.id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const newMessage = subscriptionData.data.newMessage;

          toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      New message from {newMessage.sender.fullName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {newMessage.property ? `Re: ${newMessage.property.title}` : ''}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <Link
                  href="/messages"
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  View
                </Link>
              </div>
            </div>
          ), {
            duration: 5000,
          });

          return {
            ...prev,
            messages: [newMessage, ...prev.messages],
          };
        },
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user?.id, subscribeToMore]);

  return (
    <NotificationContext.Provider value={{ unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
} 