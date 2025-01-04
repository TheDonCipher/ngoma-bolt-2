"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Edit2 } from "lucide-react";
import Image from "next/image";
import { EditProfileDialog } from "./edit-profile-dialog";

export function FanHeader() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000"
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">John Doe</h1>
          <p className="text-muted-foreground">
            Joined December 2023 • 15 NFTs Owned
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setIsEditProfileOpen(true)}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      <EditProfileDialog 
        open={isEditProfileOpen} 
        onOpenChange={setIsEditProfileOpen}
      />
    </div>
  );
}
