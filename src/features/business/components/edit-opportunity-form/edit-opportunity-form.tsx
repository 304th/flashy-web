"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CreateOpportunityBasic } from "../create-opportunity-form/create-opportunity-basic";
import { CreateOpportunityMedia } from "../create-opportunity-form/create-opportunity-media";
import { CreateOpportunityDetails } from "../create-opportunity-form/create-opportunity-details";
import { CreateOpportunityDeliverables } from "../create-opportunity-form/create-opportunity-deliverables";
import { CreateOpportunityRequirements } from "../create-opportunity-form/create-opportunity-requirements";
import { useUpdateSponsorOpportunity } from "@/features/business";

const formSchema = z.object({
  type: z.enum(["sponsorship", "affiliate", "partnership"] as const),
  title: z.string().min(3, "Agreement name must be at least 3 characters"),
  brandName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .optional(),
  category: z.string().min(1, "Please select a category").optional(),
  productLink: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  thumbnail: z.string().nullable().optional(),
  thumbnailFile: z.any().optional(),
  mediaAssetFiles: z.array(z.any()).optional().default([]),
  existingMediaAssets: z.array(z.string()).optional().default([]),
  startDate: z.custom<any>(),
  endDate: z.custom<any>().optional(),
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
  ccv: z.number().min(50, "Must be at least 50"),
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

type FormData = z.infer<typeof formSchema> & {
  thumbnailFile?: File;
  mediaAssetFiles?: File[];
  existingMediaAssets?: string[];
};

export interface EditOpportunityFormProps {
  opportunity: Opportunity;
  onCancel?: () => void;
}

export const EditOpportunityForm = ({
  opportunity,
  onCancel,
}: EditOpportunityFormProps) => {
  const router = useRouter();
  const updateOpportunity = useUpdateSponsorOpportunity();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      type: opportunity.type,
      title: opportunity.title,
      brandName: opportunity.brandName || "",
      category: opportunity.category || "",
      productLink: "",
      thumbnail: opportunity.brandLogo || null,
      thumbnailFile: undefined,
      mediaAssetFiles: [],
      existingMediaAssets: opportunity.mediaAssets || [],
      startDate: opportunity.startDate ? new Date(opportunity.startDate) : "",
      endDate: opportunity.endDate ? new Date(opportunity.endDate) : "",
      productDescription: opportunity.description || "",
      description: opportunity.description || "",
      termsAndConditions: opportunity.termsAndConditions || "",
      deliverables: opportunity.deliverables || [],
      ccv: 50,
      avgViews: 50,
      compensationType: opportunity.compensationType || "commission",
      compensation: opportunity.compensation || "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (data: FormData) => {
    try {
      // Combine existing media assets with new uploads
      const allMediaAssets: (File | string)[] = [
        ...(data.existingMediaAssets || []),
        ...(data.mediaAssetFiles || []),
      ];

      await updateOpportunity.mutateAsync({
        opportunityId: opportunity._id,
        data: {
          title: data.title,
          brandName: data.brandName,
          brandLogo: data.thumbnailFile || data.thumbnail || undefined,
          mediaAssets: allMediaAssets.length > 0 ? allMediaAssets : undefined,
          type: data.type,
          category: data.category as OpportunityCategory,
          description: data.description,
          deliverables: data.deliverables,
          compensation: data.compensation,
          compensationType: data.compensationType,
          startDate: data.startDate,
          endDate: data.endDate,
          termsAndConditions: data.termsAndConditions,
          eligibility: {
            niches: opportunity.eligibility?.niches || [],
            platforms: opportunity.eligibility?.platforms || [],
            countries: opportunity.eligibility?.countries || [],
          },
        },
      });
      router.push("/business/dashboard/opportunities");
    } catch (error) {
      console.error("Failed to update opportunity:", error);
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
        onSubmit={form.handleSubmit(handleSubmit as any)}
        className="flex flex-col gap-4"
      >
        <CreateOpportunityBasic />
        <CreateOpportunityMedia />
        <CreateOpportunityDeliverables />
        <CreateOpportunityRequirements />
        <CreateOpportunityDetails />
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={updateOpportunity.isPending}
            className="w-full h-12"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            pending={updateOpportunity.isPending}
            disabled={!form.formState.isValid}
            className="w-full h-12"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};
