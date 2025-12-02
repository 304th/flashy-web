import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const COMPENSATION_TYPES: { value: CompensationType; label: string }[] = [
  { value: "fixed", label: "Fixed" },
  { value: "per-post", label: "Per Post" },
  { value: "commission", label: "Commission" },
  { value: "product", label: "Product" },
  { value: "negotiable", label: "Negotiable" },
];

export const CreateOpportunityRequirements = () => {
  const form = useFormContext();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="compensationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Compensation Type <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select.Root value={field.value} onValueChange={field.onChange}>
                  {COMPENSATION_TYPES.map((type) => (
                    <Select.Item key={type.value} value={type.value}>
                      {type.label}
                    </Select.Item>
                  ))}
                </Select.Root>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="compensation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Compensation <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="10%"
                  {...field}
                  className="bg-base-200 h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Agreement Requirements */}
      <FormItem>
        <FormLabel>
          Requirements <span className="text-red-500">*</span>
        </FormLabel>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minFollowers"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    placeholder=">50"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="bg-base-200 h-10"
                    trailingIcon={
                      <span className="text-sm text-base-700">CCV</span>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avgViews"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    placeholder=">0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="bg-base-200 h-10"
                    trailingIcon={
                      <span className="text-sm text-base-700">AVG Views</span>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormItem>
    </div>
  );
};
