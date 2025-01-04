"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";

interface TicketTier {
  name: string;
  price: number;
  quantity: number;
  description: string;
  isNFT: boolean;
}

interface TicketTierFormProps {
  value: TicketTier[];
  onChange: (value: TicketTier[]) => void;
  disabled?: boolean;
}

export function TicketTierForm({
  value,
  onChange,
  disabled
}: TicketTierFormProps) {
  const addTier = () => {
    onChange([
      ...value,
      {
        name: "",
        price: 0,
        quantity: 0,
        description: "",
        isNFT: false,
      }
    ]);
  };

  const removeTier = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const updateTier = (index: number, field: keyof TicketTier, newValue: any) => {
    const tiers = [...value];
    tiers[index] = { ...tiers[index], [field]: newValue };
    onChange(tiers);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-6">
          {value.map((tier, index) => (
            <div key={index} className="space-y-4 pb-4 border-b last:border-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Ticket Tier {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTier(index)}
                  disabled={disabled || value.length <= 1}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={tier.name}
                    onChange={(e) => updateTier(index, "name", e.target.value)}
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                  <Input
                    type="number"
                    step="0.001"
                    value={tier.price}
                    onChange={(e) => updateTier(index, "price", parseFloat(e.target.value))}
                    disabled={disabled}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity Available</label>
                <Input
                  type="number"
                  value={tier.quantity}
                  onChange={(e) => updateTier(index, "quantity", parseInt(e.target.value))}
                  disabled={disabled}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={tier.description}
                  onChange={(e) => updateTier(index, "description", e.target.value)}
                  disabled={disabled}
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">NFT Ticket</p>
                  <p className="text-sm text-muted-foreground">
                    Issue this tier as NFT tickets
                  </p>
                </div>
                <Switch
                  checked={tier.isNFT}
                  onCheckedChange={(checked) => updateTier(index, "isNFT", checked)}
                  disabled={disabled}
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTier}
          disabled={disabled}
          className="mt-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Ticket Tier
        </Button>
      </Card>
    </div>
  );
}
