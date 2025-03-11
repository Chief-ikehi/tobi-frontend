'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { SEND_MESSAGE } from '@/lib/graphql/messages';

interface ContactAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  agentId: string;
  propertyTitle: string;
}

export const ContactAgentModal: React.FC<ContactAgentModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  agentId,
  propertyTitle,
}) => {
  const [message, setMessage] = useState('');
  const { data: session } = useSession();

  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error('Please sign in to send messages', {
        position: "top-center", // Position of the toast
        duration: 4000,
        style: {
        zIndex: 99999,
        }
      });
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a message', {
        position: "top-center", // Position of the toast
        duration: 4000,
        style: {
        zIndex: 99999,
        }
      });
      return;
    }

    
      await sendMessage({
        variables: {
          input: {
            recipientId: agentId,
            content: message,
            propertyId,
          },
        },
      });

      toast.success('Message sent successfully', {
        position: "top-center", // Position of the toast
        duration: 4000,
        style: {
        zIndex: 99999,
        }
      });
      setMessage('');
      onClose();
     
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Contact Agent</h2>
        <p className="text-gray-600 mb-4">
          Send a message about: {propertyTitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-4">
            
            <button
              type="submit"
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 