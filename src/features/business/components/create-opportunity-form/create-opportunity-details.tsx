import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DateRangePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";

export const CreateOpportunityDetails = () => {
  const form = useFormContext();
  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');
  const isEmptyDates = !startDate && !endDate;

  return (
    <div className="flex flex-col gap-6">
      <FormItem>
        <FormLabel>
          Opportunity Dates <span className="text-red-500">*</span>
        </FormLabel>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={() => (
              <FormItem>
                <FormControl>
                  <DateRangePicker
                    className="w-[320px] h-10"
                    value={isEmptyDates ? undefined : {
                      from: startDate,
                      to: endDate,
                    }}
                    onChange={(dateRange) => {
                      if (dateRange?.from) {
                        form.setValue("startDate", dateRange.from, { shouldDirty: true });
                      }

                      if (dateRange?.to) {
                        form.setValue("endDate", dateRange.to, { shouldDirty: true });
                      }
                    }}
                    showTimePicker
                  />
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
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Opportunity Description <span className="text-red-500">*</span>
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
