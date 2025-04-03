'use client'

import { useEffect, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { DateRange } from 'react-day-picker'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import { addDays, eachDayOfInterval, parseISO, isSameDay } from 'date-fns'

interface AvailabilityCalendarProps {
  propertyId: number
  dateRange: DateRange | undefined
  setDateRange: (range: DateRange | undefined) => void
}

const AvailabilityCalendar = ({
  propertyId,
  dateRange,
  setDateRange,
}: AvailabilityCalendarProps) => {
  const [disabledDates, setDisabledDates] = useState<Date[]>([])

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await axios.get(`/auth/calendar/${propertyId}/`)
        const bookings = res.data.booked_ranges

        const datesToDisable: Date[] = []

        bookings.forEach((booking: { check_in: string; check_out: string }) => {
          const start = parseISO(booking.check_in)
          const end = parseISO(booking.check_out)

          const daysInRange = eachDayOfInterval({
            start,
            end: addDays(end, -1), // exclude check-out
          })

          datesToDisable.push(...daysInRange)
        })

        setDisabledDates(datesToDisable)
      } catch (err) {
        console.error('Failed to fetch availability', err)
        toast.error('Error fetching availability', { position: 'top-center' })
      }
    }

    fetchAvailability()
  }, [propertyId])

  const isDateDisabled = (date: Date) => {
    return disabledDates.some(disabled => isSameDay(disabled, date))
  }

  return (
    <Calendar
      mode="range"
      selected={dateRange}
      onSelect={(range) => {
        if (!range?.from || !range?.to) {
          setDateRange(range)
          return
        }

        const selectedDays = eachDayOfInterval({ start: range.from, end: range.to })

        const hasConflict = selectedDays.some((day) =>
          disabledDates.some(disabled => isSameDay(disabled, day))
        )

        if (hasConflict) {
          toast.error("Selected range overlaps with unavailable dates", { position: "top-center" })
          setDateRange(undefined)
        } else {
          setDateRange(range)
        }
      }}
      numberOfMonths={2}
      disabled={disabledDates}
      fromDate={new Date()}
      modifiers={{ booked: disabledDates }}
      modifiersClassNames={{
        booked: 'bg-red-200 text-red-800 cursor-not-allowed'
      }}
    />
  )
}

export default AvailabilityCalendar