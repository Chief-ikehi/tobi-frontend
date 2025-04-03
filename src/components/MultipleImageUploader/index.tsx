'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface MultiImageUploaderProps {
  onUploaded: (urls: string[]) => void
  initialUrls?: string[]
}

export default function MultipleImageUploader({ onUploaded, initialUrls = [] }: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>(initialUrls)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    const uploadedUrls: string[] = []

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        const res = await fetch('/api/cloudinary/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()

        if (res.ok) {
          uploadedUrls.push(data.secure_url)
        } else {
          toast.error(data.error || 'Upload failed')
        }
      } catch {
        toast.error('Upload failed')
      }
    }

    const allUrls = [...imageUrls, ...uploadedUrls]
    setImageUrls(allUrls)
    onUploaded(allUrls)
    setUploading(false)
  }

  const handleRemove = (url: string) => {
    const filtered = imageUrls.filter((u) => u !== url)
    setImageUrls(filtered)
    onUploaded(filtered)
  }

  return (
    <div>
      <label className="block mb-1 font-medium">Property Images</label>
      <input type="file" multiple accept="image/*" onChange={handleUpload} disabled={uploading} />
      {uploading && <p className="text-sm text-gray-500 mt-1">Uploading images...</p>}

      <div className="flex flex-wrap gap-3 mt-3">
        {imageUrls.map((url, i) => (
          <div key={i} className="relative w-24 h-24">
            <img src={url} alt={`Image ${i + 1}`} className="rounded object-cover w-full h-full" />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              className="absolute top-1 right-1 text-xs bg-red-600 text-white rounded-full px-1"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}