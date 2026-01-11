"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SafetyEvent } from "@/lib/types";
import { sites, zones } from "@/lib/data";
import { format } from "date-fns";

interface EventDetailsDialogProps {
  event: SafetyEvent | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EventDetailsDialog({ event, isOpen, onOpenChange }: EventDetailsDialogProps) {
  if (!event) return null;

  const site = sites.find(s => s.id === event.siteId);
  const zone = zones.find(z => z.id === event.zoneId);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Event Details: {event.ruleType}</DialogTitle>
          <DialogDescription>
            {site?.name} - {zone?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div>
                {event.media?.clipPath ? (
                    <video
                        src={event.media.clipPath}
                        controls
                        className="w-full h-auto rounded-md bg-muted"
                        />
                ) : (
                    <div className="w-full h-full rounded-md bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">No video available</p>
                    </div>
                )}
            </div>
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg">Event Summary</h3>
                    <div className="text-sm text-muted-foreground space-y-2 mt-2">
                        <p><strong>Rule:</strong> {event.ruleType}</p>
                        <p><strong>Severity:</strong> <Badge variant="destructive">{event.severity}</Badge></p>
                        <p><strong>Status:</strong> <Badge variant="outline" className="capitalize">{event.status}</Badge></p>
                        <p><strong>Timestamp:</strong> {format(new Date(event.timestampStart), "PPpp")}</p>
                        <p><strong>Duration:</strong> {event.durationSeconds} seconds</p>
                        <p><strong>Confidence:</strong> {(event.confidence * 100).toFixed(1)}%</p>
                        <p><strong>Camera:</strong> {event.cameraId}</p>
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg">Location</h3>
                    <div className="text-sm text-muted-foreground space-y-2 mt-2">
                        <p><strong>Site:</strong> {site?.name}</p>
                        <p><strong>Zone:</strong> {zone?.name}</p>
                    </div>
                </div>
            </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
