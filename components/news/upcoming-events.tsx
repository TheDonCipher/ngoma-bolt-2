"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

const events = [
  {
    id: "1",
    title: "Virtual Concert Experience",
    artist: "Wizkid",
    date: new Date("2024-02-15"),
    type: "Virtual",
  },
  {
    id: "2",
    title: "Album Launch Party",
    artist: "Burna Boy",
    date: new Date("2024-02-20"),
    type: "Live",
  },
  {
    id: "3",
    title: "Fan Meet & Greet",
    artist: "Tems",
    date: new Date("2024-02-25"),
    type: "Live",
  },
];

export function UpcomingEvents() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-primary" />
        <h2 className="font-semibold">Upcoming Events</h2>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="space-y-2">
            <p className="font-medium">{event.title}</p>
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">{event.artist}</p>
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                {event.type}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(event.date)}
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Get Tickets
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
