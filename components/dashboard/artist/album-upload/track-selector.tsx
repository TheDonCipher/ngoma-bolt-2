"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GripVertical, Play, Pause } from "lucide-react";
import { usePlayerStore } from "@/lib/store/use-player-store";
import { mockAlbumData } from "@/lib/mock-data";
import { formatDuration } from "@/lib/utils";

interface TrackSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export function TrackSelector({
  value,
  onChange,
  disabled
}: TrackSelectorProps) {
  const { currentTrack, isPlaying, setTrack, setIsPlaying } = usePlayerStore();
  const [availableTracks] = useState(mockAlbumData.tracks);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(value);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
  };

  const handlePlay = (track: typeof availableTracks[0]) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setTrack(track);
    }
  };

  const toggleTrack = (trackId: string) => {
    if (value.includes(trackId)) {
      onChange(value.filter(id => id !== trackId));
    } else {
      onChange([...value, trackId]);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h4 className="font-medium mb-2">Available Tracks</h4>
        <div className="space-y-2">
          {availableTracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
            >
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => handlePlay(track)}
              >
                {currentTrack?.id === track.id && isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{track.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDuration(track.duration)}
                </p>
              </div>
              <Button
                variant={value.includes(track.id) ? "secondary" : "outline"}
                size="sm"
                onClick={() => toggleTrack(track.id)}
                disabled={disabled}
              >
                {value.includes(track.id) ? "Selected" : "Select"}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {value.length > 0 && (
        <Card className="p-4">
          <h4 className="font-medium mb-2">Track Order</h4>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tracks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {value.map((trackId, index) => {
                    const track = availableTracks.find(t => t.id === trackId);
                    if (!track) return null;

                    return (
                      <Draggable
                        key={track.id}
                        draggableId={track.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center gap-3 p-2 bg-muted rounded-lg"
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab"
                            >
                              <GripVertical className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="w-6 text-center text-sm text-muted-foreground">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{track.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDuration(track.duration)}
                              </p>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Card>
      )}
    </div>
  );
}
