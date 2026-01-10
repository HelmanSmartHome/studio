"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
  { date: "Week 1", events: 186, critical: 80 },
  { date: "Week 2", events: 305, critical: 200 },
  { date: "Week 3", events: 237, critical: 120 },
  { date: "Week 4", events: 73, critical: 190 },
  { date: "Week 5", events: 209, critical: 130 },
  { date: "Week 6", events: 214, critical: 140 },
]

const chartConfig = {
  events: {
    label: "Total Events",
    color: "hsl(var(--secondary-foreground))",
  },
  critical: {
    label: "Critical Events",
    color: "hsl(var(--primary))",
  },
}

export function TrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Trends</CardTitle>
        <CardDescription>Weekly event counts</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="events" fill={chartConfig.events.color} radius={4} />
              <Bar dataKey="critical" fill={chartConfig.critical.color} radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
