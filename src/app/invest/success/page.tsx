import { Suspense } from 'react'
import SuccessPage from '@/components/Investor/SuccessPage'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Investment Verification Page - TOBI",
  description: "This is the Investment Verification Page on TOBI",
  icons: "/images/tobi-favicon.png"
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Verifying investment...</div>}>
      <SuccessPage />
    </Suspense>
  )
}
