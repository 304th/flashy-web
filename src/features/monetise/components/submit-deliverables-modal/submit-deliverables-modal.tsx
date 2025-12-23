"use client";

import { useState, type ChangeEvent } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { X, Plus, UploadCloudIcon, FileText } from "lucide-react";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDragAndDrop } from "@/hooks/use-drag-n-drop";
import {
  uploadToPresignedUrl,
  useSubmitDeliverables,
} from "@/features/monetise";
import config from "@/config";

const MAX_FILES = 10;

const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "video/mp4",
  "video/quicktime",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ALLOWED_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".mp4",
  ".mov",
  ".pdf",
  ".doc",
  ".docx",
];

const isImageFile = (file: File) => file.type.startsWith("image/");
const isVideoFile = (file: File) => file.type.startsWith("video/");

const getFileExtension = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext ? `.${ext}` : "";
};

interface SubmissionFile {
  url: string;
  filename: string;
  type: string;
  size: number;
}

const formSchema = z
  .object({
    links: z.array(z.object({ value: z.string().url("Invalid URL") })),
    note: z.string().optional(),
  })
  .refine(
    (data) => {
      // Validation that at least one link exists is handled separately with files
      return true;
    },
    { message: "Please add at least one file or link" },
  );

type FormData = z.infer<typeof formSchema>;

export interface SubmitDeliverablesModalProps {
  opportunityId: string;
  onClose(): void;
  onSuccess?(): void;
}

export const SubmitDeliverablesModal = ({
  opportunityId,
  onClose,
  onSuccess,
}: SubmitDeliverablesModalProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [newLink, setNewLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitDeliverables = useSubmitDeliverables();

  const {
    register,
    control,
    handleSubmit,
    formState: { isDirty, isValid },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      links: [],
      note: "",
    },
    mode: "onChange",
  });

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: "links",
  });

  // Track if form has any content (files or links)
  const hasContent = files.length > 0 || linkFields.length > 0;
  const isFormDirty = isDirty || files.length > 0;

  const handleFilesUpload = (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    const remainingSlots = MAX_FILES - files.length;

    if (remainingSlots <= 0) {
      toast.error(`You can only upload up to ${MAX_FILES} files.`);
      return;
    }

    const validFiles: File[] = [];

    for (const file of newFiles) {
      const extension = getFileExtension(file.name);
      const isValidType =
        ALLOWED_FILE_TYPES.includes(file.type) ||
        ALLOWED_EXTENSIONS.includes(extension);

      if (!isValidType) {
        toast.error(
          `"${file.name}" is not a supported file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`,
        );
        continue;
      }

      if (file.size > config.content.uploads.image.maxSize * 5) {
        toast.error(`File "${file.name}" is too large. Max size: 50MB.`);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      const filesToAdd = validFiles.slice(0, remainingSlots);
      if (filesToAdd.length < validFiles.length) {
        toast.error(
          `Only ${filesToAdd.length} file(s) added. Max ${MAX_FILES} files total.`,
        );
      }
      setFiles((prev) => [...prev, ...filesToAdd]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFilesUpload(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addLink = () => {
    if (newLink.trim()) {
      let url = newLink.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      appendLink({ value: url });
      setNewLink("");
    }
  };

  const onSubmit = async (data: FormData) => {
    if (files.length === 0 && linkFields.length === 0) {
      toast.error("Please add at least one file or link.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitDeliverables.mutateAsync({
        opportunityId,
        files,
        links: data.links.map((l) => l.value),
        note: data.note?.trim() || undefined,
      });

      toast.success("Deliverables submitted successfully!");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error?.message || "Failed to submit deliverables.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { isDragActive, dragHandlers } = useDragAndDrop(handleFilesUpload);

  const isSubmitDisabled = isSubmitting || !isFormDirty || !hasContent;

  return (
    <Modal onClose={onClose} className="!p-0">
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col p-4 gap-4 rounded-md max-h-[80vh]
          overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Submit Deliverables</h2>
          <div onClick={onClose}>
            <CloseButton />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* File Upload Section */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-white">
              Upload Files
            </label>
            <div
              className={`relative rounded-lg transition-all duration-150 ${
                isDragActive
                  ? "p-2 border-2 border-blue-500 border-dashed bg-blue-500/10"
                  : "p-0"
                }`}
              onDragEnter={dragHandlers.onDragEnter}
              onDragOver={dragHandlers.onDragOver}
              onDragLeave={dragHandlers.onDragLeave}
              onDrop={dragHandlers.onDrop}
            >
              {isDragActive && (
                <div
                  className="absolute inset-0 flex items-center justify-center
                    bg-blue-500/20 rounded-lg z-10 pointer-events-none"
                >
                  <p className="text-white text-sm font-semibold">
                    Drop files here
                  </p>
                </div>
              )}

              {files.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden bg-base-400
                        p-4 aspect-square"
                    >
                      {isImageFile(file) ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-contain"
                        />
                      ) : isVideoFile(file) ? (
                        <video
                          src={URL.createObjectURL(file)}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex flex-col items-center
                            justify-center"
                        >
                          <FileText className="w-12 h-12 text-base-700 mb-1" />
                          <span
                            className="text-[10px] text-base-700 text-center
                              truncate w-full"
                          >
                            {file.name}
                          </span>
                          <span className="text-[10px] text-base-600 uppercase">
                            {getFileExtension(file.name).replace(".", "")}
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500
                          rounded-full hover:bg-red-600 transition-colors
                          cursor-pointer"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  document.getElementById("deliverables-upload")?.click()
                }
                className="w-full rounded-lg h-24 bg-base-200 cursor-pointer
                  hover:bg-base-300 transition-colors flex flex-col items-center
                  justify-center gap-2 border-1 border-dashed border-base-400
                  hover:border-base-700"
              >
                <UploadCloudIcon className="w-6 h-6 text-white" />
                <span className="text-white text-sm">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-base-800">
                  {ALLOWED_EXTENSIONS.join(", ")} (up to {MAX_FILES} files)
                </span>
              </button>
              <input
                id="deliverables-upload"
                type="file"
                accept={[...ALLOWED_FILE_TYPES, ...ALLOWED_EXTENSIONS].join(
                  ",",
                )}
                multiple
                tabIndex={-1}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <span className="text-xs text-base-700">
              {files.length} / {MAX_FILES} files
            </span>
          </div>

          {/* Links Section */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">Add Links</label>
            <div className="flex gap-2">
              <Input
                placeholder="https://youtube.com/watch?v=..."
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addLink();
                  }
                }}
                className="bg-base-200 h-10 !w-full"
                containerClassname="w-full"
              />
              <Button
                type="button"
                onClick={addLink}
                variant="secondary"
                size="lg"
                className="shrink-0 aspect-square !p-0"
                disabled={!newLink.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {linkFields.length > 0 && (
              <div className="space-y-2">
                {linkFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between bg-base-200
                      rounded-lg px-4 py-3 border border-base-400"
                  >
                    <a
                      href={field.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand-100 truncate
                        hover:underline"
                    >
                      {field.value}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-red-500 hover:text-red-600 cursor-pointer
                        p-2 rounded-md transition hover:bg-base-300 inline-flex
                        justify-center items-center ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Note Section */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">
              Note (optional)
            </label>
            <Textarea
              placeholder="Add any additional notes for the brand..."
              {...register("note")}
              className="bg-base-200 min-h-[80px]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-base-600">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitDisabled}>
              {isSubmitting ? "Submitting..." : "Submit Deliverables"}
            </Button>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`max-sm:min-w-unset min-w-[600px] max-w-[600px] !bg-base-300
      !rounded-md max-sm:w-full shadow-2xl overflow-hidden ${props.className}`}
  />
);
