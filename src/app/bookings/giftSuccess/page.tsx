import { Suspense } from 'react'
import GiftSuccessPage from '@/components/Bookings/GiftSuccessPage'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gift Verification Page - TOBI",
  description: "This is the Gift Verification page for TOBI",
  icons: "/images/tobi-favicon.png"
}

export default function AgentGiftVerificationPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Verifying gift payment...</div>}>
      <GiftSuccessPage />
    </Suspense>
  )
}
