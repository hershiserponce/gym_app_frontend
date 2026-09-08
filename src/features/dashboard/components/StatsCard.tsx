import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { ReactNode } from "react"

type StatsCardProps = {
  title: string
  value: string
  icon: ReactNode
  description?: string
  isLoading?: boolean
  tone?: "blue" | "teal" | "coral" | "violet"
}

const toneStyles = {
  blue: "bg-sky-500/15 text-sky-300",
  teal: "bg-teal-500/15 text-teal-300",
  coral: "bg-orange-500/15 text-orange-300",
  violet: "bg-violet-500/15 text-violet-300",
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  isLoading,
  tone = "blue",
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <span className={`rounded-lg p-2 ${toneStyles[tone]}`}>
          {icon}
        </span>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
