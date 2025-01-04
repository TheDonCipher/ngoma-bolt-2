"use client";

    import { Component, ErrorInfo, ReactNode } from "react";
    import { Button } from "@/components/ui/button";
    import { AlertTriangle } from "lucide-react";

    interface Props {
      children: ReactNode;
    }

    interface State {
      hasError: boolean;
      error: Error | null;
    }

    export class ErrorBoundary extends Component<Props, State> {
      public state: State = {
        hasError: false,
        error: null,
      };

      public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
      }

      public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
      }

      public render() {
        if (this.state.hasError) {
          return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
              <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
              <p className="text-muted-foreground mb-4 text-center max-w-md">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
              >
                Try again
              </Button>
            </div>
          );
        }

        return this.props.children;
      }
    }
