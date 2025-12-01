"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useCreateOpportunity } from "@/features/monetise/mutations/use-create-opportunity";
import { CreateOpportunityBasic } from "./create-opportunity-basic";
import { CreateOpportunityMedia } from "./create-opportunity-media";
import { CreateOpportunityDetails } from "./create-opportunity-details";
import { CreateOpportunityDeliverables } from "./create-opportunity-deliverables";
import { CreateOpportunityRequirements } from "./create-opportunity-requirements";

const formSchema = z.object({
  type: z.enum(["sponsorship", "affiliate", "partnership"] as const),
  title: z.string().min(3, "Agreement name must be at least 3 characters"),
  brandName: z.string().min(2, "Company name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  productLink: z.string().url("Please enter a valid URL"),
  thumbnail: z.string().nullable(),
  thumbnailFile: z.any().optional(),
  galleryFiles: z.any().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  productDescription: z
    .string()
    .min(10, "Product description must be at least 10 characters"),
  description: z
    .string()
    .min(10, "Agreement description must be at least 10 characters"),
  termsAndConditions: z
    .string()
    .min(10, "Terms & conditions must be at least 10 characters"),
  deliverables: z
    .array(z.string().min(1))
    .min(1, "At least one deliverable is required"),
  minFollowers: z.number().min(0, "Must be at least 0"),
  avgViews: z.number().min(0, "Must be at least 0"),
  compensationType: z.enum([
    "fixed",
    "per-post",
    "commission",
    "product",
    "negotiable",
  ] as const),
  compensation: z.string().min(1, "Compensation is required"),
});

type FormData = z.infer<typeof formSchema>;

export interface CreateOpportunityFormProps {
  onCancel?: () => void;
}

export const CreateOpportunityForm = ({
  onCancel,
}: CreateOpportunityFormProps) => {
  const router = useRouter();
  const createOpportunity = useCreateOpportunity();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "sponsorship",
      title: "",
      brandName: "",
      category: "",
      productLink: "",
      startDate: "",
      endDate: "",
      productDescription: "",
      description: "",
      termsAndConditions: "",
      deliverables: [],
      minFollowers: 0,
      avgViews: 0,
      compensationType: "commission",
      compensation: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (data: FormData) => {
    try {
      // TODO: Upload thumbnail and gallery images to presigned URLs
      // For now, we'll create the opportunity without images
      await createOpportunity.mutateAsync({
        title: data.title,
        brandName: data.brandName,
        type: data.type,
        category: data.category as OpportunityCategory,
        description: data.description,
        deliverables: data.deliverables,
        compensation: data.compensation,
        compensationType: data.compensationType,
        deadline: data.endDate,
        termsAndConditions: data.termsAndConditions,
        eligibility: {
          minFollowers: data.minFollowers,
          niches: [],
          platforms: [],
          countries: [],
        },
      });
      router.push("/business/dashboard/opportunities");
    } catch (error) {
      console.error("Failed to create opportunity:", error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <CreateOpportunityBasic />
        <CreateOpportunityMedia />

        <CreateOpportunityDeliverables />
        <CreateOpportunityRequirements />
        <CreateOpportunityDetails />
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={createOpportunity.isPending}
            className="w-full h-12"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createOpportunity.isPending || !form.formState.isValid}
            className="w-full h-12 bg-green-600 hover:bg-green-700"
          >
            Create Agreement
          </Button>
        </div>
      </form>
    </Form>
  );
};
