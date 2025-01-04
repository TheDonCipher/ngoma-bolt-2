"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrackUpload } from "@/components/dashboard/track-upload";
import { AlbumForm } from "@/components/albums/album-form";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { TrackList } from "@/components/dashboard/track-list";
import { mockFeaturedArtists } from "@/lib/mock-data";

export default function ArtistDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const artist = mockFeaturedArtists[0]; // Using mock data for now

  return (
    <div className="container px-4 py-8">
      <DashboardHeader artist={artist} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tracks">Tracks</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <DashboardStats artist={artist} />
        </TabsContent>

        <TabsContent value="tracks" className="mt-6 space-y-6">
          <TrackUpload />
          <TrackList artistId={artist.id} />
        </TabsContent>

        <TabsContent value="albums" className="mt-6">
          <AlbumForm />
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          {/* Stats content will be implemented later */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
