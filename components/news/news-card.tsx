"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
  news: {
    id: string;
    type: string;
    title: string;
    description: string;
    image: string;
    artist: {
      name: string;
      image: string;
    };
    timestamp: string;
    likes: number;
    comments: number;
  };
}

export function NewsCard({ news }: NewsCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(news.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={news.artist.image} alt={news.artist.name} />
          </Avatar>
          <div>
            <p className="font-semibold">{news.artist.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(news.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
        <p className="text-muted-foreground mb-4">{news.description}</p>
        
        <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={isLiked ? "text-primary" : "text-muted-foreground"}
              onClick={handleLike}
            >
              <Heart className="w-4 h-4 mr-2" />
              {likesCount}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <MessageCircle className="w-4 h-4 mr-2" />
              {news.comments}
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
