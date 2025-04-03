'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { toast } from 'react-hot-toast'

type Props = {
  propertyId: number
}

export default function FavoriteButton({ propertyId }: Props) {
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return

    const fetchFavorites = async () => {
      try {
        const res = await api.get('/auth/favorites/my/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const favoriteIds: number[] = res.data.map((item: any) => item.property)
        setIsFavorited(favoriteIds.includes(propertyId))
      } catch (err) {
        console.warn('Could not fetch favorite status', err)
      }
    }

    fetchFavorites()
  }, [propertyId])

  const toggleFavorite = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      toast.error('Please log in to favorite this property.', {position : "top-center"})
      return
    }

    try {
      await api.post(
        '/auth/favorites/toggle/',
        { property: propertyId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setIsFavorited((prev) => !prev)
      toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites' , {position : "top-center"})
    } catch (err) {
      console.error('Failed to toggle favorite', err)
      toast.error('Something went wrong', {position : "top-center"})
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      title={isFavorited ? 'Unfavorite' : 'Favorite'}
      className="text-red-500 hover:text-red-600"
    >
      {isFavorited ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
    </button>
  )
}