"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface Promotion {
  platform: string;
  message: string;
  scheduledDate: string;
}

interface PromotionSchedulerProps {
  value: Promotion[];
  onChange: (value: Promotion[]) => void;
  disabled?: boolean;
}

const PLATFORMS = [
  "Twitter",
  "Instagram",
  "Facebook",
  "Platform News Feed",
  "Email Newsletter",
];

export function PromotionScheduler({
  value,
  onChange,
  disabled
}: PromotionSchedulerProps) {
  const addPromotion = () => {
    onChange([
      ...value,
      {
        platform: "",
        message: "",
        scheduledDate: "",
      }
    ]);
  };

  const removePromotion = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const updatePromotion = (index: number, field: keyof Promotion, newValue: any) => {
    const promotions = [...value];
    promotions[index] = { ...promotions[index], [field]: newValue };
    onChange(promotions);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-6">
          {value.map((promotion, index) => (
            <div key={index} className="space-y-4 pb-4 border-b last:border-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Promotional Post {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePromotion(index)}
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform</label>
                  <Select
                    value={promotion.platform}
                    onValueChange={(value) => updatePromotion(index, "platform", value)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Scheduled Date</label>
                  <Input
                    type="datetime-local"
                    value={promotion.scheduledDate}
                    onChange={(e) => updatePromotion(index, "scheduledDate", e.target.value)}
                    disabled={disabled}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={promotion.message}
                  onChange={(e) => updatePromotion(index, "message", e.target.value)}
                  disabled={disabled}
                  rows={3}
                  placeholder="Write your promotional message..."
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPromotion}
          disabled={disabled}
          className="mt-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Promotional Post
        </Button>
      </Card>
    </div>
  );
}
