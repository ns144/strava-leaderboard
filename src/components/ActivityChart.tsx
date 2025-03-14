"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format } from "date-fns"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Define props for flexibility
interface ActivityChartProps {
  activities: { date: number; value: number }[] // `value` can represent distance, pace, etc.
  title: string // Chart title
  unit: string // e.g., "Km", "min/km"
  dataKey: string // e.g., "distance", "pace"
  color?: string // Custom color for bars
}

export default function ActivityChart({
  activities,
  title,
  unit,
  dataKey,
  color = "hsl(var(--chart-1))",
}: ActivityChartProps) {
  const chartConfig: ChartConfig = {
    [dataKey]: {
      label: title,
      color: color,
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Latest Data</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={activities}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              scale="time"
              type="number"
              domain={["dataMin - 2592000000", "dataMax + 2592000000"]}
              tickFormatter={(date) => {
                const parsedDate = new Date(date);
                return isNaN(parsedDate.getTime()) ? "" : format(parsedDate, "MMM dd");
              }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              label={{ value: unit, angle: -90, position: "insideLeft" }}
              tickLine={false}
              axisLine={false}
              domain={[0, "auto"]}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill={color} radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing recent {title.toLowerCase()} data
        </div>
      </CardFooter>
    </Card>
  )
}
