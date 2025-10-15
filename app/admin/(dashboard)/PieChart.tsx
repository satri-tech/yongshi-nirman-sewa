"use client"
import { Pie, PieChart } from "recharts"
import { useMemo } from "react"


import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/features/shared/components/chart"

export const description = "A donut chart"

const chartConfig = {
    Completed: {
        label: "Completed",
        color: "var(--chart-1)",
    },
    InProgress: {
        label: "In Progress",
        color: "var(--chart-2)",
    },
    OnHold: {
        label: "On Hold",
        color: "var(--chart-3)",
    },
    Pending: {
        label: "Pending",
        color: "var(--chart-4)",
    },
} satisfies ChartConfig

interface IPieChartData {
    name: string;
    data: number;
}

interface IChartPieDonutProps {
    data: IPieChartData[]
}

export function ChartPieDonut({ data }: IChartPieDonutProps) {
    // Transform the data to include fill colors
    const chartData = useMemo(() => {
        return data.map((item) => ({
            ...item,
            fill: `var(--color-${item.name.replace(/\s+/g, '')})`
        }))
    }, [data])


    return (
        <div className="flex flex-col">
            <div className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="data"
                            nameKey="name"
                            innerRadius={60}
                        />
                    </PieChart>
                </ChartContainer>
            </div>
            <div className="flex-col gap-2 text-sm">
                <ChartContainer config={chartConfig} className="w-full max-h-[20px] ">
                    <div className="flex gap-2 leading-none font-medium justify-around">
                        {chartData.map((item, index) => (
                            <div className="flex gap-2" key={item.name}>
                                <div
                                    key={index}
                                    className="h-3 w-3 rounded-xs"
                                    style={{ backgroundColor: item.fill }}
                                >
                                </div>
                                <div>
                                    {item.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </ChartContainer>
            </div>
        </div>
    )
}