import { PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  username: string;
  profilePicture: string;
  value: number;
}

interface UserRadialChartProps {
  data: User[];
  title: string;
  unit: string;
  dataKey: string;
  color?: string;
  selectedUser: string;
  maxValue: number;
}

export default function UserRadialChart({
  data,
  title,
  unit,
  dataKey,
  color = "hsl(var(--chart-1))",
  selectedUser,
  maxValue,
}: UserRadialChartProps) {
  const userData = data.find((user) => user.username === selectedUser);
  const MAX_VALUE = maxValue;

  return (
    <Card className="w-full sm:w-fit bg-background border border-border shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        {userData && (
          <div className="relative flex items-center justify-center mt-4">
            <PieChart width={250} height={250}>
              <Pie
                data={[
                  { name: dataKey, value: userData.value },
                  { name: "Remaining", value: MAX_VALUE - userData.value },
                ]}
                innerRadius={90}
                outerRadius={120}
                dataKey="value"
                startAngle={270}
                endAngle={-90}
                stroke="none" // Ensures no unwanted borders
              >
                <Cell key="filled" fill={color} />
                <Cell key="remaining" fill={`hsl(var(--muted))`}/> {/* Background color */}
              </Pie>
            </PieChart>
            <div className="absolute text-3xl font-black text-foreground">
              {unit.toLowerCase() === "min/km"
                ? (() => {
                    const minutes = Math.floor(userData.value);
                    const seconds = Math.round((userData.value - minutes) * 60);
                    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
                  })()
                : userData.value.toFixed(2)}{" "}
                <div className="text-sm text-center">{unit}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
