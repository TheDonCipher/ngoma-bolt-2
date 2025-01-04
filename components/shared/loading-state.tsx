"use client";

import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[200px]">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <p className="text-muted-foreground">
        {message || "Loading..."}
      </p>
    </div>
  );
}
