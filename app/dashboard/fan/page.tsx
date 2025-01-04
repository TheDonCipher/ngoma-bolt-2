"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FanHeader } from "@/components/dashboard/fan/fan-header";
import { FanStats } from "@/components/dashboard/fan/fan-stats";
import { FanCollection } from "@/components/dashboard/fan/fan-collection";
import { FanAchievements } from "@/components/dashboard/fan/fan-achievements";
import { FanFollowing } from "@/components/dashboard/fan/fan-following";

export default function FanDashboard() {
  const [activeTab, setActiveTab] = useState("collection");

  return (
    <div className="container px-4 py-8">
      <FanHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="collection" className="mt-6">
          <FanCollection />
        </TabsContent>

        <TabsContent value="following" className="mt-6">
          <FanFollowing />
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <FanAchievements />
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <FanStats />
        </TabsContent>
      </Tabs>
    </div>
  );
}
