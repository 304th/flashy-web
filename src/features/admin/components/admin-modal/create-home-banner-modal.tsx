import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal as ModalComponent } from "@/packages/modals";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { CloseButton } from "@/components/ui/close-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateHomeBanner } from "@/features/admin/mutations/use-create-home-banner";
import { useUpdateHomeBanner } from "@/features/admin/mutations/use-update-home-banner";
import { uploadImage } from "@/features/common/mutations/use-upload-image";
import { createSignedUploadUrlMutation } from "@/features/common/mutations/use-create-signed-upload-url";

export interface CreateHomeBannerModalProps {
  onClose(): void;
  banner?: HomeBanner;
}

const formSchema = z.object({
  callToActionTitle: z
    .string()
    .min(1, "Call to action title is required")
    .max(100, "Call to action title must be at most 100 characters"),
  link: z.string().url("Must be a valid URL"),
  isPinned: z.boolean().optional(),
  status: z.enum(["active", "paused"]).optional(),
  bannerImage: z.string().optional(),
  logoIcon: z.string().optional().nullable(),
  bannerImageUpload: z.instanceof(File).optional(),
  logoIconUpload: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof formSchema>;

export const CreateHomeBannerModal = ({
  onClose,
  banner,
  ...props
}: CreateHomeBannerModalProps) => {
  const isEditing = Boolean(banner);
  const createBanner = useCreateHomeBanner();
  const updateBanner = useUpdateHomeBanner();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      callToActionTitle: banner?.callToActionTitle || "",
      link: banner?.link || "",
      isPinned: banner?.isPinned || false,
      status: banner?.status || "paused",
      bannerImage: banner?.bannerImage || "",
      logoIcon: banner?.logoIcon || null,
    },
    mode: "onChange",
  });

  const handleSubmit = async (data: FormData) => {
    let bannerImageUrl = data.bannerImage;
    let logoIconUrl = data.logoIcon;

    // Upload banner image if new file provided
    if (data.bannerImageUpload) {
      const { uploadUrl, fileType } = await createSignedUploadUrlMutation.write(
        {
          fileName: data.bannerImageUpload.name,
          fileType: data.bannerImageUpload.type,
        },
      );

      bannerImageUrl = await uploadImage.write({
        file: data.bannerImageUpload,
        type: fileType,
        uploadUrl: uploadUrl,
      });
    }

    // Upload logo icon if new file provided
    if (data.logoIconUpload) {
      const { uploadUrl, fileType } = await createSignedUploadUrlMutation.write(
        {
          fileName: data.logoIconUpload.name,
          fileType: data.logoIconUpload.type,
        },
      );

      logoIconUrl = await uploadImage.write({
        file: data.logoIconUpload,
        type: fileType,
        uploadUrl: uploadUrl,
      });
    }

    if (!bannerImageUrl) {
      form.setError("bannerImage", { message: "Banner image is required" });
      return;
    }

    const payload = {
      bannerImage: bannerImageUrl,
      callToActionTitle: data.callToActionTitle,
      link: data.link,
      logoIcon: logoIconUrl || undefined,
      isPinned: data.isPinned,
      status: data.status,
    };

    if (isEditing && banner) {
      await updateBanner.mutateAsync({
        id: banner._id,
        ...payload,
      });
    } else {
      await createBanner.mutateAsync(payload);
    }

    onClose();
  };

  return (
    <Modal onClose={onClose} {...props}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <div
            className="flex w-full items-center justify-between border-b pb-4"
          >
            <p className="text-xl font-bold text-white">
              {isEditing ? "Edit Home Banner" : "Create Home Banner"}
            </p>
            <div onClick={onClose}>
              <CloseButton />
            </div>
          </div>

          <div className="flex gap-6">
            {/* Left Column - Text Inputs */}
            <div className="flex flex-col gap-4 flex-1">
              <FormField
                control={form.control}
                name="callToActionTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Call To Action Title *
                    </FormLabel>
                    <Input
                      {...field}
                      placeholder="e.g., Check our website"
                      className="bg-base-200"
                    />
                    {form.formState.errors.callToActionTitle && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.callToActionTitle.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Link *</FormLabel>
                    <Input
                      {...field}
                      placeholder="https://example.com"
                      className="bg-base-200"
                    />
                    {form.formState.errors.link && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.link.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bannerImageUpload"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Banner Image *</FormLabel>
                    <ImageUpload
                      title="Upload Banner"
                      initialPreview={banner?.bannerImage}
                      onChange={(file) => {
                        field.onChange(file);
                        if (file) {
                          form.clearErrors("bannerImage");
                        }
                      }}
                    />
                    {form.formState.errors.bannerImage && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.bannerImage.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* Separator */}
            <div className="w-px bg-base-400" />

            {/* Right Column - Image Uploads */}
            <div className="flex flex-col gap-4 w-[200px]">
              <FormField
                control={form.control}
                name="logoIconUpload"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Logo (Optional)
                    </FormLabel>
                    <ImageUpload
                      title="Upload Logo"
                      initialPreview={banner?.logoIcon}
                      onChange={(file) => field.onChange(file)}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPinned"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <Checkbox
                      id="isPinned"
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                    <FormLabel
                      htmlFor="isPinned"
                      className="text-white !mt-0 cursor-pointer"
                    >
                      Pinned
                    </FormLabel>
                  </FormItem>
                )}
              />

              {/*<FormField*/}
              {/*  control={form.control}*/}
              {/*  name="status"*/}
              {/*  render={({ field }) => (*/}
              {/*    <FormItem>*/}
              {/*      <FormLabel className="text-white">Status</FormLabel>*/}
              {/*      <div className="flex gap-2">*/}
              {/*        <Button*/}
              {/*          type="button"*/}
              {/*          size="sm"*/}
              {/*          variant={field.value === "active" ? "default" : "secondary"}*/}
              {/*          onClick={() => field.onChange("active")}*/}
              {/*          className="flex-1"*/}
              {/*        >*/}
              {/*          Active*/}
              {/*        </Button>*/}
              {/*        <Button*/}
              {/*          type="button"*/}
              {/*          size="sm"*/}
              {/*          variant={field.value === "paused" ? "default" : "secondary"}*/}
              {/*          onClick={() => field.onChange("paused")}*/}
              {/*          className="flex-1"*/}
              {/*        >*/}
              {/*          Paused*/}
              {/*        </Button>*/}
              {/*      </div>*/}
              {/*    </FormItem>*/}
              {/*  )}*/}
              {/*/>*/}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              pending={form.formState.isSubmitting}
              disabled={!form.formState.isValid && !isEditing}
            >
              {isEditing ? "Save Changes" : "Create Banner"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`max-sm:min-w-unset min-w-[660px] max-w-[660px] !bg-base-300
      !rounded-md max-sm:w-full overflow-hidden ${props.className}`}
  />
);
