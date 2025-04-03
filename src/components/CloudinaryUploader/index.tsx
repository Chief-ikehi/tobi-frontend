'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

type Props = {
  onUploaded: (url: string) => void
}

export default function CloudinaryUploader({ onUploaded }: Props) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      setUploading(true)
      const res = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        toast.success('Upload successful', {position: 'top-center'})
        onUploaded(data.secure_url)
      } else {
        toast.error(data.error || 'Upload failed', {position: 'top-center'})
      }
    } catch {
      toast.error('Upload failed', {position: 'top-center'})
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block mb-1 font-medium">Proof of Listing</label>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
    </div>
  )
}