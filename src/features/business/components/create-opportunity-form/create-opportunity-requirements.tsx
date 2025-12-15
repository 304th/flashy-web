import config from "@/config";
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
  { value: "fixed", label: "Monetary" },
  { value: "commission", label: "Commission" },
  { value: "product", label: "Product" },
];

export const CreateOpportunityRequirements = () => {
  const form = useFormContext();
  const compensationType = form.watch("compensationType");

  const getCompensationConfig = () => {
    switch (compensationType) {
      case "commission":
        return {
          placeholder: "e.g. 15",
          type: "number",
          min: 0,
          max: 100,
          trailingIcon: <span className="text-sm text-base-700">%</span>,
        };
      case "fixed":
        return {
          placeholder: "e.g. 500",
          type: "number",
          min: 0,
          trailingIcon: <span className="text-sm text-base-700">$</span>,
        };
      default:
        return null;
    }
  };

  const compensationConfig = getCompensationConfig();

  return (
    <div className="flex flex-col gap-6">
      <div className={"grid gap-4 grid-cols-2"}>
        <FormField
          control={form.control}
          name="compensationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Compensation Type <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select.Root
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value === "product") {
                      form.setValue("compensation", "");
                    }
                  }}
                >
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
        {compensationType !== "product" && compensationConfig && (
          <FormField
            control={form.control}
            name="compensation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {compensationType === "commission"
                    ? "Commission Rate"
                    : "Amount"}{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type={compensationConfig.type}
                    placeholder={compensationConfig.placeholder}
                    min={compensationConfig.min}
                    max={compensationConfig.max}
                    {...field}
                    className="bg-base-200 h-10"
                    trailingIcon={compensationConfig.trailingIcon}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      <FormItem>
        <FormLabel>
          Agreement Requirements <span className="text-red-500">*</span>
        </FormLabel>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ccv"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={`>=${config.monetise.ccv}`}
                    min={config.monetise.ccv}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? "" : Number(value));
                    }}
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
                    placeholder={`>=${config.monetise.avgViews}`}
                    min={config.monetise.avgViews}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? "" : Number(value));
                    }}
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
