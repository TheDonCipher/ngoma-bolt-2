"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, MoreHorizontal, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CollaboratorInvite } from "./collaborator-invite";

// Mock data - replace with API call
const mockCollaborators = [
  {
    id: "1",
    username: "wizkid",
    name: "WizKid",
    role: "Featured Artist",
    tracks: 3,
    joinedDate: "2024-02-15",
  },
  {
    id: "2",
    username: "producer123",
    name: "John Producer",
    role: "Producer",
    tracks: 5,
    joinedDate: "2024-02-10",
  },
];

export function CollaborationManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const filteredCollaborators = mockCollaborators.filter(collaborator =>
    collaborator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collaborator.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Collaborations</h2>
          <p className="text-muted-foreground">
            Manage your collaborators and track permissions
          </p>
        </div>

        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Invite Collaborator
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Collaborator</DialogTitle>
            </DialogHeader>
            <CollaboratorInvite onInvite={() => setIsInviteOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search collaborators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Collaborator</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Tracks</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCollaborators.map((collaborator) => (
              <TableRow key={collaborator.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{collaborator.name}</p>
                    <p className="text-sm text-muted-foreground">
                      @{collaborator.username}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{collaborator.role}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{collaborator.tracks}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(collaborator.joinedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                      <DropdownMenuItem>Manage Royalties</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Remove Collaborator
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
