"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CollaboratorSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

// Mock data - replace with API call
const mockUsers = [
  { username: "wizkid", name: "WizKid" },
  { username: "burnaboy", name: "Burna Boy" },
  { username: "davido", name: "Davido" },
  { username: "tems", name: "Tems" },
];

export function CollaboratorSelect({
  value,
  onChange,
  disabled
}: CollaboratorSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredUsers = mockUsers.filter(
    user => !value.includes(user.username) &&
    (user.name.toLowerCase().includes(search.toLowerCase()) ||
     user.username.toLowerCase().includes(search.toLowerCase()))
  );

  const removeCollaborator = (username: string) => {
    onChange(value.filter(v => v !== username));
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={disabled}
          >
            Add Collaborators
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search users..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandEmpty>No users found</CommandEmpty>
            <CommandGroup>
              {filteredUsers.map(user => (
                <CommandItem
                  key={user.username}
                  onSelect={() => {
                    onChange([...value, user.username]);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value.includes(user.username) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {user.name}
                  <span className="ml-2 text-muted-foreground">
                    @{user.username}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {value.map(username => {
          const user = mockUsers.find(u => u.username === username);
          if (!user) return null;

          return (
            <div
              key={username}
              className="flex items-center gap-1 bg-secondary/20 text-secondary-foreground px-2 py-1 rounded-full text-sm"
            >
              <span>{user.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4"
                onClick={() => removeCollaborator(username)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
