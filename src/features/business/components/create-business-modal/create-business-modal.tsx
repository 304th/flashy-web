import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCreateBusinessAccount } from "@/features/business/mutations/use-create-business-account";

export interface CreateBusinessModalProps {
  onClose(): void;
}

const BUSINESS_CATEGORIES = [
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
] as const;

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(200, "Name must be at most 200 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be at most 5000 characters"),
});

type FormData = z.infer<typeof formSchema>;

export const CreateBusinessModal = ({ onClose }: CreateBusinessModalProps) => {
  const createBusinessAccount = useCreateBusinessAccount();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await createBusinessAccount.mutateAsync({
        title: data.title,
        category: data.category as BusinessAccountCategory,
        description: data.description,
      });
      form.reset();
      onClose();
    } catch (error) {
      console.error("Failed to create business account:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <ModalComponent
      className="bg-base-300 p-0! max-sm:min-w-unset max-w-full min-w-[600px]"
      onClose={handleClose}
    >
      <div className="relative w-full max-w-2xl rounded-md bg-base-300">
        <div className="flex w-full p-4 pb-4">
          <div className="absolute right-4 top-4" onClick={handleClose}>
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <h2 className="text-2xl font-extrabold text-white">
              Register A Business Account
            </h2>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="p-4 pt-2">
            <div className="space-y-4">
              {/* Business Name and Category Row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Business Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Business Name..."
                          {...field}
                          disabled={createBusinessAccount.isPending}
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
                        Business Category{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select.Root
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Category Type"
                          disabled={createBusinessAccount.isPending}
                        >
                          {BUSINESS_CATEGORIES.map((category) => (
                            <Select.Item
                              key={category.value}
                              value={category.value}
                            >
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

              {/* Business Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Description{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Short description about your product/service..."
                        rows={4}
                        {...field}
                        disabled={createBusinessAccount.isPending}
                        className="bg-base-200 resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  disabled={createBusinessAccount.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createBusinessAccount.isPending || !form.formState.isValid
                  }
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </ModalComponent>
  );
};
