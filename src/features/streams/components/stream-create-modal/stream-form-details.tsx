import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface StreamFormDetailsProps {
  form: UseFormReturn<any>;
  isSubmitting: boolean;
}

export const StreamFormDetails = ({
  form,
  isSubmitting,
}: StreamFormDetailsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stream Title *</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your stream title..."
                {...field}
                disabled={isSubmitting}
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
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your stream..."
                rows={4}
                {...field}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="scheduledAt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Schedule Stream (Optional)</FormLabel>
            <FormControl>
              <Input
                type="datetime-local"
                {...field}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Leave empty to create stream for immediate use
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="chatEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Enable Chat</FormLabel>
              <p className="text-sm text-muted-foreground">
                Allow viewers to chat during your stream
              </p>
            </div>
            <FormControl>
              <Switch.Root
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || !form.formState.isValid}
          className="min-w-[120px]"
        >
          {isSubmitting ? "Creating..." : "Create Stream"}
        </Button>
      </div>
    </div>
  );
};
