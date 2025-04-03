export type PropertyType = 'shortlet' | 'investment' | 'hybrid' | 'all'
export interface Property {
  id: number
  title: string
  location: string
  property_type: string
  price_per_night: number
  images: string[]
  amenities?: string
  description?: string
  investment_cost?: number
  virtual_tour_url?: string
  agent?: number
}
