"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DateRangePickerProps {
  value: [Date, Date];
  onChange: (value: [Date, Date]) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="min-w-[240px] justify-start">
          <CalendarIcon className="w-4 h-4 mr-2" />
          {format(value[0], "MMM d, yyyy")} - {format(value[1], "MMM d, yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="range"
          selected={{
            from: value[0],
            to: value[1],
          }}
          onSelect={(range) => {
            if (range?.from && range?.to) {
              onChange([range.from, range.to]);
            }
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
