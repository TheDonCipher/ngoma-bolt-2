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
import { Search, Filter, AlertTriangle, ArrowUpDown } from "lucide-react";

// Mock data - replace with API call
const mockInventory = [
  {
    id: "1",
    product: "Tour T-Shirt",
    variant: "Black / L",
    sku: "TS-BL-001",
    stock: 45,
    lowStock: 50,
    sold: 155,
    lastRestocked: "2024-02-15",
  },
  {
    id: "2",
    product: "Album Poster",
    variant: "18x24",
    sku: "AP-001",
    stock: 12,
    lowStock: 20,
    sold: 88,
    lastRestocked: "2024-02-10",
  },
];

export function InventoryManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "", direction: "asc" });

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const filteredInventory = mockInventory
    .filter(item =>
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a: any, b: any) => {
      if (!sortConfig.key) return 0;
      
      const direction = sortConfig.direction === "asc" ? 1 : -1;
      return a[sortConfig.key] > b[sortConfig.key] ? direction : -direction;
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("product")}
                  className="flex items-center gap-2"
                >
                  Product
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("stock")}
                  className="flex items-center gap-2"
                >
                  Stock
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("sold")}
                  className="flex items-center gap-2"
                >
                  Sold
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </TableHead>
              <TableHead>Last Restocked</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.product}
                </TableCell>
                <TableCell>{item.variant}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {item.stock < item.lowStock && (
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    )}
                    <span className={item.stock < item.lowStock ? "text-destructive" : ""}>
                      {item.stock}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{item.sold}</TableCell>
                <TableCell>{new Date(item.lastRestocked).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Restock
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
