'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { useState } from 'react'

interface Gift {
  id: number
  sender_email: string
  recipient_email: string
  recipient_user_email: string
  message: string
  check_in: string
  check_out: string
  status: string
  created_at: string
  accepted_at?: string
  declined_at?: string
  gift_code: string
  gifted_property: number
}

interface Props {
  sent: Gift[]
  received: Gift[]
}

export default function GiftHistorySection({ sent, received }: Props) {
  const [sentPage, setSentPage] = useState(1)
  const [receivedPage, setReceivedPage] = useState(1)
  const perPage = 3

  const totalSentPages = Math.ceil(sent.length / perPage)
  const totalReceivedPages = Math.ceil(received.length / perPage)

  const paginatedSent = sent.slice((sentPage - 1) * perPage, sentPage * perPage)
  const paginatedReceived = received.slice((receivedPage - 1) * perPage, receivedPage * perPage)

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Gift History</h2>

      {/* Sent Gifts */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Gifts You Sent</h3>
        {sent.length === 0 ? (
          <p className="text-sm text-gray-500">You haven't sent any gifts.</p>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedSent.map((gift) => (
                <div
                  key={gift.id}
                  className="rounded border px-4 py-3 bg-white dark:bg-blacksection shadow-sm"
                >
                  <p className="text-sm">
                    To: <span className="font-medium">{gift.recipient_email}</span>
                  </p>
                  <p className="text-sm">
                    Property:{' '}
                    <Link
                      href={`/properties/${gift.gifted_property}`}
                      className="text-primary underline"
                    >
                      #{gift.gifted_property}
                    </Link>
                  </p>
                  <p className="text-sm">
                    Stay: {format(new Date(gift.check_in), 'dd MMM yyyy')} -{' '}
                    {format(new Date(gift.check_out), 'dd MMM yyyy')}
                  </p>
                  <p className="text-sm">Message: {gift.message}</p>
                  <p className="text-sm">
                    Status:{' '}
                    <span
                      className={`font-semibold ${
                        gift.status === 'accepted'
                          ? 'text-green-600'
                          : gift.status === 'declined'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {gift.status.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Sent on: {format(new Date(gift.created_at), 'dd MMM yyyy')}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalSentPages > 1 && (
              <div className="flex justify-end items-center mt-4 space-x-2 text-sm">
                <button
                  onClick={() => setSentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={sentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span>
                  Page {sentPage} of {totalSentPages}
                </span>
                <button
                  onClick={() => setSentPage((prev) => Math.min(prev + 1, totalSentPages))}
                  disabled={sentPage === totalSentPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Received Gifts */}
      <div>
        <h3 className="text-lg font-medium mb-2">Gifts You Received</h3>
        {received.length === 0 ? (
          <p className="text-sm text-gray-500">You haven't received any gifts.</p>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedReceived.map((gift) => (
                <div
                  key={gift.id}
                  className="rounded border px-4 py-3 bg-white dark:bg-blacksection shadow-sm"
                >
                  <p className="text-sm">
                    From: <span className="font-medium">{gift.sender_email}</span>
                  </p>
                  <p className="text-sm">
                    Property:{' '}
                    <Link
                      href={`/properties/${gift.gifted_property}`}
                      className="text-primary underline"
                    >
                      #{gift.gifted_property}
                    </Link>
                  </p>
                  <p className="text-sm">
                    Stay: {format(new Date(gift.check_in), 'dd MMM yyyy')} -{' '}
                    {format(new Date(gift.check_out), 'dd MMM yyyy')}
                  </p>
                  <p className="text-sm">Message: {gift.message || 'No message'}</p>
                  <p className="text-sm">
                    Status:{' '}
                    <span
                      className={`font-semibold ${
                        gift.status === 'accepted'
                          ? 'text-green-600'
                          : gift.status === 'declined'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {gift.status.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Received on: {format(new Date(gift.created_at), 'dd MMM yyyy')}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalReceivedPages > 1 && (
              <div className="flex justify-end items-center mt-4 space-x-2 text-sm">
                <button
                  onClick={() => setReceivedPage((prev) => Math.max(prev - 1, 1))}
                  disabled={receivedPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span>
                  Page {receivedPage} of {totalReceivedPages}
                </span>
                <button
                  onClick={() => setReceivedPage((prev) => Math.min(prev + 1, totalReceivedPages))}
                  disabled={receivedPage === totalReceivedPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}