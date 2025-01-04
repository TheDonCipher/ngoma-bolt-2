"use client";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { useState } from "react";

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const defaultPermissions: Permission[] = [
  {
    id: "view_tracks",
    name: "View Tracks",
    description: "Can view all tracks and their details",
    enabled: true,
  },
  {
    id: "edit_tracks",
    name: "Edit Tracks",
    description: "Can edit track information and metadata",
    enabled: false,
  },
  {
    id: "upload_tracks",
    name: "Upload Tracks",
    description: "Can upload new tracks",
    enabled: false,
  },
  {
    id: "manage_royalties",
    name: "Manage Royalties",
    description: "Can view and manage royalty distributions",
    enabled: false,
  },
  {
    id: "view_analytics",
    name: "View Analytics",
    description: "Can access analytics and performance data",
    enabled: true,
  },
];

export function PermissionManager() {
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = (id: string) => {
    setPermissions(permissions.map(permission =>
      permission.id === id
        ? { ...permission, enabled: !permission.enabled }
        : permission
    ));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Implementation for saving permissions will go here
      toast({
        title: "Success",
        description: "Permissions updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update permissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Permissions</h3>
          <p className="text-sm text-muted-foreground">
            Manage collaborator access and permissions
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {permissions.map((permission) => (
          <div
            key={permission.id}
            className="flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{permission.name}</p>
              <p className="text-sm text-muted-foreground">
                {permission.description}
              </p>
            </div>
            <Switch
              checked={permission.enabled}
              onCheckedChange={() => handleToggle(permission.id)}
              disabled={isLoading}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
