import { Card } from '@/components/ui/card'

const statsData = [
  { value: '', label: '' },
  { value: '', label: '' },
  { value: '', label: '' },
  { value: '', label: '' },
]

export default function StatsSection() {
  return (
    <section className="py-12 md:py-20 bg-gray-100">
      <div className="mx-auto max-w-7xl px-6">
        <Card className="grid gap-0.5 divide-y divide-gray-300 bg-white rounded-lg shadow-sm overflow-hidden md:grid-cols-4 md:divide-x md:divide-y-0">
          {statsData.map((_, index) => (
            <div key={index} className="py-8 text-center space-y-3">
              {/* Value Placeholder */}
              <div className="h-10 w-24 mx-auto bg-gray-300 rounded"></div>

              {/* Label Placeholder */}
              <div className="h-4 w-32 mx-auto bg-gray-200 rounded"></div>
            </div>
          ))}
        </Card>
      </div>
    </section>
  )
}
