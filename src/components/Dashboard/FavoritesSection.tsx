'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { useState } from 'react'

type Favorite = {
  id: number
  property: number
  property_title: string
  created_at: string
}

interface Props {
  favorites: Favorite[]
}

export default function FavoriteSection({ favorites }: Props) {
  const [page, setPage] = useState(1)
  const perPage = 3

  const totalPages = Math.ceil(favorites.length / perPage)
  const paginated = favorites.slice((page - 1) * perPage, page * perPage)

  if (!favorites || favorites.length === 0) {
    return (
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Favorites</h2>
        <p className="text-gray-500 text-sm">You haven’t favorited any properties yet.</p>
      </div>
    )
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Your Favorites</h2>
      <div className="space-y-4">
        {paginated.map((fav) => (
          <div
            key={fav.id}
            className="rounded border px-4 py-3 bg-white dark:bg-blacksection shadow-sm"
          >
            <Link href={`/properties/${fav.property}`}>
              <p className="text-primary font-medium hover:underline">{fav.property_title}</p>
            </Link>
            <p className="text-sm text-gray-500">
              Favorited on {format(new Date(fav.created_at), 'dd MMM yyyy')}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-4 space-x-2 text-sm">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}