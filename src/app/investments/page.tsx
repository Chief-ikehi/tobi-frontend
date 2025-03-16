"use client";
import { Metadata } from "next";
import InvestmentProperties from "@/components/Investments/InvestmentProperties";


import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
 
function Search() {
  const searchParams = useSearchParams()
 
  return <input placeholder="Search..." />
}

export default function InvestmentPropertiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvestmentProperties />
    </Suspense>
  );
} 