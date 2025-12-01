import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const CreateOpportunityDetails = () => {
  const form = useFormContext();

  return (
    <div className="flex flex-col gap-6">
      {/* Agreement Date */}
      <FormItem>
        <FormLabel>
          Agreement Date <span className="text-red-500">*</span>
        </FormLabel>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="date" {...field} className="bg-base-200 h-10" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="date" {...field} className="bg-base-200 h-10" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormItem>

      {/* Product/Service Description */}
      <FormField
        control={form.control}
        name="productDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Product/Service Description{" "}
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Short description about your product/service"
                rows={3}
                {...field}
                className="bg-base-200 resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Agreement Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Agreement Description <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="This is a description of what the agreement role would be"
                rows={3}
                {...field}
                className="bg-base-200 resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Terms & Conditions */}
      <FormField
        control={form.control}
        name="termsAndConditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Terms & Conditions <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="This is a description of what the agreement role would be"
                rows={3}
                {...field}
                className="bg-base-200 resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
