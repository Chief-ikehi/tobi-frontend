'use client';

import { useRef } from 'react'

import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Property } from '@/types/property'
import { FaGift, FaHandHoldingUsd, FaHeart, FaShareAlt, FaCalendarCheck } from 'react-icons/fa'
import ShareButton from './ShareButton'
import FavoriteButton from './FavoriteButton'
import { toast } from 'react-hot-toast'
//import Draggable from 'react-draggable'

interface QuickActionsProps {
  property: Property
  onOpenGift: () => void
  onOpenBook: () => void
  onOpenInvest: () => void
}

const QuickActions = ({ property, onOpenGift, onOpenBook, onOpenInvest }: QuickActionsProps) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

  const showBooking = ['shortlet', 'hybrid'].includes(property.property_type)
  const showInvest = ['investment', 'hybrid'].includes(property.property_type)

  const ActionButton = ({
  icon,
  label,
  onClick,
  component,
}: {
  icon?: React.ReactNode
  label: string
  onClick?: () => void
  component?: React.ReactNode
}) => {
  if (component) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 p-2 text-sm text-gray-700 dark:text-black">
        {component}
        <span className="text-xs">{label}</span>
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      title={label}
      className="flex flex-col items-center justify-center gap-1 p-2 text-sm hover:text-primary dark:text-black dark:hover:text-primary"
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  )
}

  const containerClass = isMobile
    ? 'fixed bottom-4 left-1/2 z-50 -translate-x-1/2 flex w-fit gap-6 rounded-full bg-white px-6 py-3 shadow-md dark:bg-dark-2'
    : 'fixed top-1/3 right-4 z-50 flex flex-col gap-4 rounded-md bg-white p-4 shadow-lg dark:bg-dark-2'


  //const nodeRef = useRef(null)

  return (

    <div className="fixed top-[40%] right-4 z-40 flex flex-col gap-2 rounded-lg bg-white p-3 shadow-md dark:bg-dark-2">
      <ActionButton
        label="Favorite"
        component={<FavoriteButton propertyId={property.id} />}
      />
      <ActionButton
        label="Share"
        component={<ShareButton />}
      />
      <ActionButton
        label="Gift"
        icon={<FaGift size={18} />}
        onClick={onOpenGift}
      />
      {showBooking && (
        <ActionButton
          label="Book"
          icon={<FaCalendarCheck size={18} />}
          onClick={onOpenBook}
        />
      )}
      {showInvest && (
        <ActionButton
          label="Invest"
          icon={<FaHandHoldingUsd size={18} />}
          onClick={onOpenInvest}
        />
      )}
    </div>

  )
}

export default QuickActions