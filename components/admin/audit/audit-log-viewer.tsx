"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuditLog } from "@/lib/types/audit";
import { AuditLogFilters } from "./audit-log-filters";
import { AuditLogDetails } from "./audit-log-details";
import { formatDistanceToNow } from "date-fns";
import { Download, RefreshCcw } from "lucide-react";
import { useAuditService } from "@/lib/services/audit.service";

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { searchAuditLogs, exportAuditLogs } = useAuditService();

  const handleSearch = async (filters: any) => {
    try {
      setIsLoading(true);
      const results = await searchAuditLogs(filters);
      setLogs(results);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: "CSV" | "JSON" | "PDF") => {
    await exportAuditLogs(format);
  };

  const getSeverityColor = (severity: AuditLog["severity"]) => {
    switch (severity) {
      case "LOW":
        return "text-green-500 bg-green-500/10";
      case "MEDIUM":
        return "text-yellow-500 bg-yellow-500/10";
      case "HIGH":
        return "text-orange-500 bg-orange-500/10";
      case "CRITICAL":
        return "text-red-500 bg-red-500/10";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Audit Logs</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSearch({})}
            disabled={isLoading}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("CSV")}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <AuditLogFilters onSearch={handleSearch} />

        <div className="mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow
                  key={log.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedLog(log)}
                >
                  <TableCell>
                    {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                  </TableCell>
                  <TableCell>{log.userId}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.category}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      log.status === "SUCCESS"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}>
                      {log.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedLog && (
        <AuditLogDetails
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
}
