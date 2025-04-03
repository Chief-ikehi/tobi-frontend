'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

type Gift = {
  id: number
  sender_email: string
  recipient_email: string
  gifted_property: number
  check_in: string
  check_out: string
  message: string
  status: 'pending' | 'accepted' | 'declined'
  gift_code: string
  created_at: string
  accepted_at?: string
  declined_at?: string
}

type PropertyPreview = {
  title: string
  images: string[]
}

export default function UserGiftsSection() {
  const [sent, setSent] = useState<Gift[]>([])
  const [received, setReceived] = useState<Gift[]>([])
  const [propertyMap, setPropertyMap] = useState<{ [id: number]: PropertyPreview }>({})
  const [loading, setLoading] = useState(true)

  const fetchGifts = async () => {
    try {
      const res = await axios.get('/auth/dashboard/')
      setSent(res.data.gifts.sent)
      setReceived(res.data.gifts.received)

      const allGiftedPropertyIds = [
        ...res.data.gifts.sent,
        ...res.data.gifts.received,
      ].map((gift: Gift) => gift.gifted_property)

      const uniqueIds = [...new Set(allGiftedPropertyIds)]

      const propertyData: { [id: number]: PropertyPreview } = {}

      await Promise.all(
        uniqueIds.map(async (id) => {
          try {
            const res = await axios.get(`/api/properties/${id}/`)
            propertyData[id] = {
              title: res.data.title,
              images: res.data.images || [],
            }
          } catch {
            propertyData[id] = {
              title: 'Unavailable Property',
              images: [],
            }
          }
        })
      )

      setPropertyMap(propertyData)
    } catch {
      toast.error('Failed to load gifts or properties', {position : 'top-center'})
    } finally {
      setLoading(false)
    }
  }

  const handleGiftResponse = async (giftId: number, response: 'accept' | 'decline') => {
    try {
      await axios.post('/auth/gift/respond/', {
        gift_id: giftId,
        response,
      })
      toast.success(`Gift ${response}ed successfully`, {position : 'top-center'})
      fetchGifts()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Gift action failed', {position : 'top-center'})
    }
  }

  useEffect(() => {
    fetchGifts()
  }, [])

  if (loading) return <div className="py-10 text-center">Loading gifts...</div>

  const renderGiftCard = (gift: Gift, type: 'sent' | 'received') => {
    const property = propertyMap[gift.gifted_property]
    const propertyTitle = property?.title || 'Loading...'
    const imageUrl = property?.images?.[0]

    return (
      <div key={gift.id} className="p-4 bg-white dark:bg-blacksection shadow rounded border">
        <div className="flex items-start gap-4">
          {imageUrl ? (
            <img src={imageUrl} alt="Property" className="w-28 h-20 rounded object-cover" />
          ) : (
            <div className="w-28 h-20 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}

          <div className="flex-1 space-y-1">
            <p><strong>{type === 'sent' ? 'To' : 'From'}:</strong> {type === 'sent' ? gift.recipient_email : gift.sender_email}</p>
            <p><strong>Property:</strong> {propertyTitle}</p>
            <p><strong>Dates:</strong> {format(new Date(gift.check_in), 'MMM d')} → {format(new Date(gift.check_out), 'MMM d, yyyy')}</p>
            <p><strong>Message:</strong> {gift.message || <span className="italic text-gray-400">No message</span>}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={`capitalize font-medium ${
                  gift.status === 'accepted'
                    ? 'text-green-600'
                    : gift.status === 'declined'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {gift.status}
              </span>
            </p>

            {/* Buttons only for received + pending */}
            {type === 'received' && gift.status === 'pending' && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleGiftResponse(gift.id, 'accept')}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleGiftResponse(gift.id, 'decline')}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Sent Gifts */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Gifts You've Sent</h2>
        {sent.length === 0 ? (
          <p className="text-gray-500">You haven’t sent any gifts yet.</p>
        ) : (
          <div className="space-y-4">{sent.map((gift) => renderGiftCard(gift, 'sent'))}</div>
        )}
      </section>

      {/* Received Gifts */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Gifts You've Received</h2>
        {received.length === 0 ? (
          <p className="text-gray-500">No one has gifted you yet.</p>
        ) : (
          <div className="space-y-4">{received.map((gift) => renderGiftCard(gift, 'received'))}</div>
        )}
      </section>
    </div>
  )
}
