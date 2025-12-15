"use client";

import config from '@/config'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CreateOpportunityBasic } from "./create-opportunity-basic";
import { CreateOpportunityMedia } from "./create-opportunity-media";
import { CreateOpportunityDetails } from "./create-opportunity-details";
import { CreateOpportunityDeliverables } from "./create-opportunity-deliverables";
import { CreateOpportunityRequirements } from "./create-opportunity-requirements";
import { useCreateSponsorOpportunity } from "@/features/business";

const formSchema = z.object({
  type: z.enum(["sponsorship", "affiliate", "partnership"] as const),
  title: z.string().min(3, "Agreement name must be at least 3 characters"),
  brandName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .optional(),
  category: z.string().min(1, "Please select a category").optional(),
  productLink: z.string().url("Please enter a valid URL").optional(),
  thumbnail: z.string().nullable().optional(),
  thumbnailFile: z.instanceof(File, { message: "Thumbnail is required" }),
  mediaAssetFiles: z.array(z.any()).optional().default([]),
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
  ccv: z.number().min(config.monetise.ccv, `Must be at least ${config.monetise.ccv}`),
  // minFollowers: z.number().min(0, "Must be at least 0"),
  avgViews: z.number().min(config.monetise.ccv, `Must be at least ${config.monetise.avgViews}`),
  compensationType: z.enum([
    "fixed",
    "commission",
    "product",
  ] as const),
  compensation: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.compensationType === "commission") {
    const value = Number(data.compensation);
    if (!data.compensation || isNaN(value) || value < 0 || value > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Commission must be a percentage between 0 and 100",
        path: ["compensation"],
      });
    }
  } else if (data.compensationType === "fixed") {
    const value = Number(data.compensation);
    if (!data.compensation || isNaN(value) || value <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid dollar amount",
        path: ["compensation"],
      });
    }
  }
});

type FormData = z.infer<typeof formSchema> & {
  thumbnailFile?: File;
  mediaAssetFiles?: File[];
};

export interface CreateOpportunityFormProps {
  onCancel?: () => void;
}

export const CreateOpportunityForm = ({
  onCancel,
}: CreateOpportunityFormProps) => {
  const router = useRouter();
  const createOpportunity = useCreateSponsorOpportunity();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      type: "sponsorship",
      title: "",
      brandName: "",
      category: "",
      productLink: "",
      thumbnail: null,
      thumbnailFile: undefined,
      mediaAssetFiles: [],
      startDate: "",
      endDate: "",
      productDescription: "",
      description: "",
      termsAndConditions: "",
      deliverables: [],
      // minFollowers: 0,
      ccv: config.monetise.ccv,
      avgViews: config.monetise.avgViews,
      compensationType: "commission",
      compensation: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await createOpportunity.mutateAsync({
        title: data.title,
        brandName: data.brandName ?? "",
        brandLogo: data.thumbnailFile,
        mediaAssets: data.mediaAssetFiles || [],
        type: data.type,
        category: data.category as OpportunityCategory,
        description: data.description,
        deliverables: data.deliverables,
        compensation: data.compensation,
        compensationType: data.compensationType,
        startDate: data.startDate,
        endDate: data.endDate,
        termsAndConditions: data.termsAndConditions,
        ccv: data.ccv,
        avgViews: data.avgViews,
        eligibility: {
          // minFollowers: data.minFollowers,
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
        <div className="grid grid-cols-2 gap-4 mt-6">
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
            pending={createOpportunity.isPending}
            disabled={!form.formState.isValid}
            className="w-full h-12"
          >
            Create Opportunity
          </Button>
        </div>
      </form>
    </Form>
  );
};
