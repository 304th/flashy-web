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
import { cn } from "@/lib/utils";

const OPPORTUNITY_TYPES: OpportunityType[] = [
  "sponsorship",
  "affiliate",
  "partnership",
];

const OPPORTUNITY_CATEGORIES: { value: OpportunityCategory; label: string }[] =
  [
    { value: "lifestyle", label: "Lifestyle" },
    { value: "health & well-being", label: "Health & Well-being" },
    { value: "technology", label: "Technology" },
    { value: "fashion & beauty", label: "Fashion & Beauty" },
    { value: "food & beverage", label: "Food & Beverage" },
    { value: "travel", label: "Travel" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "sports & fitness", label: "Sports & Fitness" },
    { value: "gaming", label: "Gaming" },
    { value: "business", label: "Business" },
  ];

export const CreateOpportunityBasic = () => {
  const form = useFormContext();

  return (
    <div className="flex flex-col gap-6">
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agreement Type</FormLabel>
            <FormControl>
              <div className="grid grid-cols-3 gap-3">
                {OPPORTUNITY_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => field.onChange(type)}
                    className={cn(
                      `flex items-center justify-center px-4 h-10 py-3
                      rounded-lg border transition-colors capitalize text-base
                      font-medium cursor-pointer`,
                      field.value === type
                        ? "border-brand-100 bg-green-500/10 text-white"
                        : `border-base-400 bg-base-200 text-base-700
                          hover:border-base-600`,
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Agreement Name, Company Name, Category */}
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Agreement Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Placeholder Name"
                  {...field}
                  className="bg-base-200 h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brandName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Company Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Placeholder Name"
                  {...field}
                  className="bg-base-200 h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Agreement Category <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select.Root
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Category Type"
                >
                  {OPPORTUNITY_CATEGORIES.map((category) => (
                    <Select.Item key={category.value} value={category.value}>
                      {category.label}
                    </Select.Item>
                  ))}
                </Select.Root>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Product Link */}
      <FormField
        control={form.control}
        name="productLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Product Link <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="www.example.com"
                {...field}
                className="bg-base-200 h-10"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
