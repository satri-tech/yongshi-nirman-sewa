"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/features/shared/components/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/features/shared/components/chart"

interface ChartDataItem {
    name: string;
    value: number;
    fill: string;
    label?: string; // Optional display label
}

interface BarChartProps {
    title: string;
    description: string;
    data: ChartDataItem[];
    footerText?: string;
    trendingText?: string;
    showFooter?: boolean;
    activeIndex?: number;
}

export function BarChartComponent({
    title,
    description,
    data,
    footerText = "Showing total value for the last 6 months",
    trendingText = "Trending up by 5.2% this month",
    showFooter = true,
    activeIndex = 2,
}: BarChartProps) {
    // Dynamically generate chartConfig from data
    const chartConfig: ChartConfig = data.reduce((config, item) => {
        config[item.name] = {
            label: item.label || item.name,
            color: item.fill,
        };
        return config;
    }, {} as ChartConfig);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                                chartConfig[value as keyof typeof chartConfig]?.label || value
                            }
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Bar
                            dataKey="value"
                            strokeWidth={2}
                            radius={8}
                            activeIndex={activeIndex}
                            activeBar={({ ...props }) => {
                                return (
                                    <Rectangle
                                        {...props}
                                        fillOpacity={0.8}
                                        stroke={props.payload.fill}
                                        strokeDasharray={4}
                                        strokeDashoffset={4}
                                    />
                                )
                            }}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            {showFooter && (
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    {trendingText && (
                        <div className="flex gap-2 leading-none font-medium">
                            {trendingText} <TrendingUp className="h-4 w-4" />
                        </div>
                    )}
                    {footerText && (
                        <div className="text-muted-foreground leading-none">
                            {footerText}
                        </div>
                    )}
                </CardFooter>
            )}
        </Card>
    )
}