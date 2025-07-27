'use client'

import { useEffect, useRef, useState } from 'react'

interface MapProps {
  className?: string
}

export default function Map({ className = '' }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return

    const loadLeaflet = async () => {
      const L = (await import('leaflet')).default

      // Fix for default markers in Leaflet with Next.js
      delete (L.Icon.Default.prototype as unknown as { [key: string]: unknown })._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })

      if (mapRef.current && !mapInstanceRef.current) {
        // Coordinates for Yongshi Construction, Pokhara, Nepal
        const yongshiCoords: [number, number] = [28.210692, 83.984134]

        // Initialize the map
        mapInstanceRef.current = L.map(mapRef.current).setView(yongshiCoords, 13)

        // Add OpenStreetMap tiles (no API key required)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstanceRef.current)

        // Add a marker for Yongshi Construction, Sabhagriha Pokhara, Nepal
        const marker = L.marker(yongshiCoords).addTo(mapInstanceRef.current)

        // Add popup to the marker
        marker.bindPopup(`
          <div class="text-center">
            <h3 class="font-semibold text-lg mb-1">Yongshi Nirman Sewa</h3>
            <p class="text-sm text-gray-600">Sabhagriha Chowk, Pokhara</p>
            <p class="text-sm text-gray-600">Nepal</p>
          </div>
        `).openPopup()

        // Add custom styling to the map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.getContainer().style.borderRadius = '8px'
        }
      }
    }

    loadLeaflet()

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isClient])

  if (!isClient) {
    return (
      <div className={`w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  return (
    <div className={`w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg ${className}`}>
      <div ref={mapRef} className="w-full h-full z-40" />
    </div>
  )
}
