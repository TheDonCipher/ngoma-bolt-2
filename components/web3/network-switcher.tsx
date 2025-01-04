"use client";

import { useNetwork, useSwitchChain } from "@thirdweb-dev/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Network } from "lucide-react";

const SUPPORTED_NETWORKS = [
  { id: 1, name: "Ethereum" },
  { id: 137, name: "Polygon" },
  { id: 80001, name: "Mumbai" },
];

export function NetworkSwitcher() {
  const { chain } = useNetwork();
  const switchChain = useSwitchChain();

  if (!chain) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Network className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Network</h3>
      </div>

      <Select
        value={chain.chainId.toString()}
        onValueChange={(value) => switchChain(parseInt(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select network" />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_NETWORKS.map((network) => (
            <SelectItem
              key={network.id}
              value={network.id.toString()}
            >
              {network.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  );
}
