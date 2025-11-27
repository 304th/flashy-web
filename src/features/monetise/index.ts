// Schemas
export {
  opportunitySchema,
  creatorOpportunitySchema,
} from "./schemas/opportunity.schema";

// Collections
export { opportunitiesCollection } from "./collections/opportunities";
export { myOpportunitiesCollection } from "./collections/my-opportunities";
export { sponsorSubmissionsCollection } from "./collections/sponsor-submissions";
export { adminOpportunitiesCollection } from "./collections/admin-opportunities";

// Queries
export { useOpportunities } from "./queries/use-opportunities";
export {
  useOpportunityById,
  opportunityEntity,
} from "./queries/use-opportunity-by-id";
export { useMyOpportunities } from "./queries/use-my-opportunities";
export { useSponsorSubmissions } from "./queries/use-sponsor-submissions";
export { useAdminOpportunities } from "./queries/use-admin-opportunities";

// Creator Mutations
export { useAcceptOpportunity } from "./mutations/use-accept-opportunity";
export {
  useGetPresignedUrls,
  uploadToPresignedUrl,
} from "./mutations/use-get-presigned-urls";
export {
  useSubmitDeliverables,
  useResubmitDeliverables,
} from "./mutations/use-submit-deliverables";

// Sponsor Mutations
export { useApproveSubmission } from "./mutations/use-approve-submission";
export { useRejectSubmission } from "./mutations/use-reject-submission";

// Admin Mutations
export { useCreateOpportunity } from "./mutations/use-create-opportunity";
export { useUpdateOpportunity } from "./mutations/use-update-opportunity";
export { useDeleteOpportunity } from "./mutations/use-delete-opportunity";

// Utility Hooks
export { useUploadDeliverables } from "./hooks/use-upload-deliverables";

// Components
export * from "./components";
