import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface UserBarChartProps {
  data: { username: string; profilePicture: string; value: number }[];
  title: string;
  unit: string;
  dataKey: string;
  color?: string;
}



const CustomYAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const user = props.data[payload.index]; // Get the corresponding user

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-150} y={-15} width="40" height="40">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="h-8 w-8 rounded-full"
        />
      </foreignObject>
      <text
        x={-110}
        y={0}
        dy={4}
        textAnchor="start"
        fill="#333"
        className="font-bold"
      >
        {user.username}
      </text>
    </g>
  );
};

export default function UserBarChart({
  data,
  title,
  unit,
  dataKey,
  color = "hsl(var(--chart-1))",
}: UserBarChartProps) {
  const chartConfig: ChartConfig = {
    [dataKey]: {
      label: title,
      color: color,
    },
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent> 
        <ChartContainer config={chartConfig} style={{ maxHeight: `${data.length * 100}px`, minHeight: "100px" }} className="w-full">
        <BarChart
          layout="vertical"
          data={data}
          accessibilityLayer
          margin={{ left: 100 }}
        >
          <CartesianGrid horizontal={false} />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            label={{ value: unit, position: "insideBottomRight", offset: 0 }}
          />
          <YAxis
            dataKey="username"
            type="category"
            tickLine={false}
            axisLine={false}
            tick={<CustomYAxisTick data={data} />}
          />
          
          <Bar dataKey="value" fill={color} radius={8}>
            <LabelList
              dataKey="value"
              position="insideLeft"
              offset={12}
              className="fill-background font-black"
              fontSize={18}
              formatter={(value:number) => {
                if (unit.toLowerCase() === "minutes") {
                  const minutes = Math.floor(value); // Get whole minutes
                  const seconds = Math.round((value - minutes) * 60); // Convert decimal to seconds
                  return `${minutes}:${seconds.toString().padStart(2, "0")}`; // Format as MM:SS
                }
                return value.toFixed(2);
              }}
            />
          </Bar>
          {/*<ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />*/}
        </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
