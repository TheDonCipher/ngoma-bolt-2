"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuditLog } from "@/lib/types/audit";
import { format } from "date-fns";

interface AuditLogDetailsProps {
  log: AuditLog;
  onClose: () => void;
}

export function AuditLogDetails({ log, onClose }: AuditLogDetailsProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Audit Log Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Timestamp</h4>
              <p>{format(log.timestamp, "PPpp")}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">User ID</h4>
              <p>{log.userId}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Wallet Address</h4>
              <p>{log.userAddress}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">IP Address</h4>
              <p>{log.ipAddress}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Action</h4>
              <p>{log.action}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Category</h4>
              <p>{log.category}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Severity</h4>
              <p>{log.severity}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
              <p>{log.status}</p>
            </div>
          </div>

          {log.details.component && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Component</h4>
              <p>{log.details.component}</p>
            </div>
          )}

          {log.details.before && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Previous State</h4>
              <pre className="bg-muted p-4 rounded-lg overflow-auto">
                {JSON.stringify(log.details.before, null, 2)}
              </pre>
            </div>
          )}

          {log.details.after && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">New State</h4>
              <pre className="bg-muted p-4 rounded-lg overflow-auto">
                {JSON.stringify(log.details.after, null, 2)}
              </pre>
            </div>
          )}

          {log.errorMessage && (
            <div>
              <h4 className="text-sm font-medium text-destructive mb-1">Error Message</h4>
              <p className="text-destructive">{log.errorMessage}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
