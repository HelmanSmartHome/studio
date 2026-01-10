import Image from "next/image";
import {
  File,
  ListFilter,
  MoreHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { events as mockEvents, sites, zones } from "@/lib/data";
import { format } from "date-fns";

export default function EventsPage() {
  return (
    <>
      <div className="flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Safety Events
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
        </div>
      </div>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="acknowledged">Acknowledged</TabsTrigger>
          <TabsTrigger value="actioned">Actioned</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>
                A log of all safety events detected across your sites.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Event Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Location
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Timestamp
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEvents.map((event) => {
                     const site = sites.find(s => s.id === event.siteId);
                     const zone = zones.find(z => z.id === event.zoneId);
                    
                    return (
                    <TableRow key={event.id}>
                      <TableCell className="hidden sm:table-cell">
                        {event.media?.thumbnailPath && (
                           <Image
                            alt="Event thumbnail"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={event.media.thumbnailPath}
                            width="64"
                            data-ai-hint="warehouse security"
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="font-medium">{event.ruleType}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          Confidence: {event.confidence * 100}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{event.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {site?.name} - {zone?.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(new Date(event.timestampStart), "PPpp")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Acknowledge</DropdownMenuItem>
                            <DropdownMenuItem>Create Action</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                             <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>{mockEvents.length}</strong>{" "}
                events
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
