'use client'

import Image from 'next/image'
import { useState } from 'react'

interface PropertyImageGalleryProps {
  images: string[]
  title: string
}

const PropertyImageGallery = ({ images, title }: PropertyImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(images?.[0])

  if (!images || images.length === 0) return null

  return (
    <div>
      {/* Main Image */}
      <div className="relative h-[400px] w-full mb-4 rounded-lg overflow-hidden">
        <Image src={selectedImage} alt={title} fill className="object-cover" />
      </div>

      {/* Thumbnail images */}
      <div className="grid grid-cols-5 gap-3">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={`relative h-20 rounded-md border-2 ${
              selectedImage === img ? 'border-primary' : 'border-transparent'
            }`}
          >
            <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default PropertyImageGallery