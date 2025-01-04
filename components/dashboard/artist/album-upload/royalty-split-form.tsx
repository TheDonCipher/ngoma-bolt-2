"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { CollaboratorSelect } from "../track-upload/collaborator-select";

interface RoyaltySplit {
  username: string;
  percentage: number;
}

interface RoyaltySplitFormProps {
  value: RoyaltySplit[];
  onChange: (value: RoyaltySplit[]) => void;
  disabled?: boolean;
}

export function RoyaltySplitForm({
  value,
  onChange,
  disabled
}: RoyaltySplitFormProps) {
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>(
    value.map(split => split.username)
  );

  const addSplit = () => {
    onChange([...value, { username: "", percentage: 0 }]);
  };

  const removeSplit = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const updateSplit = (index: number, field: keyof RoyaltySplit, newValue: any) => {
    const splits = [...value];
    splits[index] = { ...splits[index], [field]: newValue };
    onChange(splits);
  };

  const totalPercentage = value.reduce((sum, split) => sum + split.percentage, 0);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          {value.map((split, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1">
                <CollaboratorSelect
                  value={[split.username]}
                  onChange={([username]) => updateSplit(index, "username", username)}
                  disabled={disabled}
                />
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  value={split.percentage}
                  onChange={(e) => updateSplit(index, "percentage", parseFloat(e.target.value))}
                  min="0"
                  max="100"
                  step="0.1"
                  disabled={disabled}
                  className="text-right"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSplit(index)}
                disabled={disabled || value.length <= 1}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSplit}
            disabled={disabled || totalPercentage >= 100}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Split
          </Button>
          <p className={`text-sm ${
            totalPercentage === 100
              ? "text-primary"
              : totalPercentage > 100
              ? "text-destructive"
              : "text-muted-foreground"
          }`}>
            Total: {totalPercentage}%
          </p>
        </div>
      </Card>
    </div>
  );
}
