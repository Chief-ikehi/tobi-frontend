'use client';

import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MESSAGES, MARK_MESSAGE_READ } from '@/lib/graphql/messages';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface User {
  id: string;
  fullName: string;
}

interface Property {
  id: string;
  title: string;
  images: string[];
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  isRead: boolean;
  createdAt: string;
  sender: User;
  recipient: User;
  property?: Property;
}

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const user = session?.user as SessionUser | undefined;

  const { data, loading, error} = useQuery(GET_MESSAGES, {
    skip: !user?.id,
  });

  const [markAsRead] = useMutation(MARK_MESSAGE_READ);

  useEffect(() => {
    if (data?.messages && user?.id) {
      data.messages
        .filter((msg: Message) => !msg.isRead)
        .forEach((msg: Message) => {
          markAsRead({ variables: { id: msg.id } });
        });
    }
  }, [data?.messages, markAsRead, user?.id]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">My Messages</h1>
        <p className="text-gray-600 mb-6">Please sign in to view your messages</p>
        <Link 
          href="/login" 
          className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Error loading messages. Please try again later.</p>
      </div>
    );
  }

  const messages = (data?.messages || []) as Message[];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Messages</h1>

      {messages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`bg-white rounded-lg shadow-md p-4 ${
                !message.isRead ? 'border-l-4 border-primary-500' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {message.property && (
                  <div className="relative h-16 w-16 flex-shrink-0">
                    <Image
                      src={message.property.images[0] || '/images/placeholder.jpg'}
                      alt={message.property.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">
                        {user.id === message.senderId
                          ? `To: ${message.recipient.fullName}`
                          : `From: ${message.sender.fullName}`}
                      </p>
                      {message.property && (
                        <Link
                          href={`/properties/${message.property.id}`}
                          className="text-sm text-primary-600 hover:underline"
                        >
                          Re: {message.property.title}
                        </Link>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-600">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 