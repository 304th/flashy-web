import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { X, Plus } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const CreateOpportunityDeliverables = () => {
  const form = useFormContext();
  const [newDeliverable, setNewDeliverable] = useState("");

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      const currentDeliverables = form.getValues("deliverables");
      form.setValue(
        "deliverables",
        [...currentDeliverables, newDeliverable.trim()],
        { shouldDirty: true },
      );
      setNewDeliverable("");
    }
  };

  const removeDeliverable = (index: number) => {
    const currentDeliverables = form.getValues("deliverables");
    form.setValue(
      "deliverables",
      currentDeliverables.filter((_: any, i: number) => i !== index),
      { shouldDirty: true },
    );
  };

  return (
    <FormField
      control={form.control}
      name="deliverables"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Deliverables <span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="flex gap-2 w-full">
                <Input
                  placeholder="Add Deliverable"
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addDeliverable();
                    }
                  }}
                  className="bg-base-200 h-10 !w-full"
                  containerClassname="w-full"
                />
                <Button
                  type="button"
                  onClick={addDeliverable}
                  variant="secondary"
                  size="lg"
                  className="shrink-0 aspect-square !p-0"
                  disabled={!Boolean(newDeliverable)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {field.value.map((deliverable: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-base-200
                      rounded-lg px-4 py-3 border border-base-400"
                  >
                    <span className="text-sm text-white">{deliverable}</span>
                    <button
                      type="button"
                      onClick={() => removeDeliverable(index)}
                      className="text-red-500 hover:text-red-600 cursor-pointer
                        p-2 rounded-md transition hover:bg-base-300 inline-flex
                        justify-center items-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
