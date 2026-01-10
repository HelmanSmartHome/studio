import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { events as mockEvents } from "@/lib/data"
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function RecentEvents() {
  const recentEvents = mockEvents.slice(0, 5);

  const getSeverityBadgeClass = (severity: 'Low' | 'Med' | 'High' | 'Critical') => {
    switch (severity) {
      case 'Critical':
        return 'bg-destructive/80 text-destructive-foreground';
      case 'High':
        return 'bg-orange-500/80 text-secondary-foreground';
      case 'Med':
        return 'bg-yellow-500/80 text-secondary-foreground';
      case 'Low':
      default:
        return 'bg-sky-500/80 text-secondary-foreground';
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Events</CardTitle>
        <CardDescription>
          A log of the latest safety events detected across all sites.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage data-ai-hint="warehouse aisle" src={event.media?.thumbnailPath} alt="Event thumbnail" />
                <AvatarFallback>EV</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {event.ruleType}
                </p>
                <p className="text-sm text-muted-foreground">
                  Zone {event.zoneId.split('-')[1]} - Camera {event.cameraId.split('-')[1]}
                </p>
              </div>
              <div className="ml-auto flex flex-col items-end">
                <Badge variant="default" className={cn("text-xs", getSeverityBadgeClass(event.severity))}>{event.severity}</Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
