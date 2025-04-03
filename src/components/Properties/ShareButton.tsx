'use client'

import { useState } from 'react'
import {
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaEnvelope,
  FaLink,
} from 'react-icons/fa'
import { toast } from 'react-hot-toast'

const ShareButton = () => {
  const [showOptions, setShowOptions] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const encodedUrl = encodeURIComponent(url)

  const toggleShare = () => setShowOptions((prev) => !prev)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied!')
      setShowOptions(false)
    } catch (err) {
      toast.error('Failed to copy link.')
    }
  }

  return (
    <div className="relative">
      <button
        onClick={toggleShare}
        className="rounded-full bg-primary p-2 text-white shadow hover:bg-primary/90"
        title="Share"
      >
        <FaLink size={16} />
      </button>

      {showOptions && (
        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 w-44 rounded-md bg-white p-3 shadow-md space-y-2 z-50 dark:bg-dark-2">
          <button
            onClick={() =>
              window.open(`https://wa.me/?text=${encodedUrl}`, '_blank')
            }
            className="flex w-full items-center gap-2 text-sm hover:text-primary"
          >
            <FaWhatsapp /> WhatsApp
          </button>
          <button
            onClick={() =>
              window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}`, '_blank')
            }
            className="flex w-full items-center gap-2 text-sm hover:text-primary"
          >
            <FaTwitter /> Twitter/X
          </button>
          <button
            onClick={() =>
              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')
            }
            className="flex w-full items-center gap-2 text-sm hover:text-primary"
          >
            <FaFacebookF /> Facebook
          </button>
          <button
            onClick={() =>
              window.open(`mailto:?subject=Check this out&body=${encodedUrl}`)
            }
            className="flex w-full items-center gap-2 text-sm hover:text-primary"
          >
            <FaEnvelope /> Email
          </button>
          <button
            onClick={copyLink}
            className="flex w-full items-center gap-2 text-sm hover:text-primary"
          >
            <FaLink /> Copy Link
          </button>
        </div>
      )}
    </div>
  )
}

export default ShareButton