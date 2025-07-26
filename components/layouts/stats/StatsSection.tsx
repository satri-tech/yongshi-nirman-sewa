import { statsData } from './constants'

export const StatsSection = () => {
  return (
    <div className="flex justify-between gap-16 font-Poppins ">
      {statsData.map((data) => {
        return (
          <div className="flex flex-col sm:gap-4" key={data.label}>
            <div className={`sm:text-5xl font-medium `}>{data.value}</div>
            <div className="text-[#656565] sm:text-base text-sm ">{data.label}</div>
          </div>
        )
      })}
    </div>
  )
}
