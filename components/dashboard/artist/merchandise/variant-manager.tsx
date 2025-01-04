"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface VariantOption {
  value: string;
  price: number;
  stock: number;
}

interface Variant {
  name: string;
  options: VariantOption[];
}

interface VariantManagerProps {
  value: Variant[];
  onChange: (value: Variant[]) => void;
  disabled?: boolean;
}

export function VariantManager({
  value,
  onChange,
  disabled
}: VariantManagerProps) {
  const addVariant = () => {
    onChange([
      ...value,
      {
        name: "",
        options: [{ value: "", price: 0, stock: 0 }]
      }
    ]);
  };

  const removeVariant = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const addOption = (variantIndex: number) => {
    const newValue = [...value];
    newValue[variantIndex].options.push({ value: "", price: 0, stock: 0 });
    onChange(newValue);
  };

  const removeOption = (variantIndex: number, optionIndex: number) => {
    const newValue = [...value];
    newValue[variantIndex].options.splice(optionIndex, 1);
    onChange(newValue);
  };

  const updateVariant = (index: number, field: keyof Variant, newValue: any) => {
    const variants = [...value];
    variants[index] = { ...variants[index], [field]: newValue };
    onChange(variants);
  };

  const updateOption = (
    variantIndex: number,
    optionIndex: number,
    field: keyof VariantOption,
    newValue: any
  ) => {
    const variants = [...value];
    variants[variantIndex].options[optionIndex] = {
      ...variants[variantIndex].options[optionIndex],
      [field]: newValue
    };
    onChange(variants);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-6">
          {value.map((variant, variantIndex) => (
            <div key={variantIndex} className="space-y-4 pb-4 border-b last:border-0">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1 mr-4">
                  <label className="text-sm font-medium">Variant Name</label>
                  <Input
                    placeholder="e.g., Size, Color"
                    value={variant.name}
                    onChange={(e) => updateVariant(variantIndex, "name", e.target.value)}
                    disabled={disabled}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeVariant(variantIndex)}
                  disabled={disabled || value.length <= 1}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {variant.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2">
                    <Input
                      placeholder="Option value"
                      value={option.value}
                      onChange={(e) => updateOption(variantIndex, optionIndex, "value", e.target.value)}
                      disabled={disabled}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Price adjustment"
                      value={option.price}
                      onChange={(e) => updateOption(variantIndex, optionIndex, "price", parseFloat(e.target.value))}
                      disabled={disabled}
                    />
                    <Input
                      type="number"
                      placeholder="Stock"
                      value={option.stock}
                      onChange={(e) => updateOption(variantIndex, optionIndex, "stock", parseInt(e.target.value))}
                      disabled={disabled}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(variantIndex, optionIndex)}
                      disabled={disabled || variant.options.length <= 1}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addOption(variantIndex)}
                  disabled={disabled}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addVariant}
          disabled={disabled}
          className="mt-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Variant
        </Button>
      </Card>
    </div>
  );
}
