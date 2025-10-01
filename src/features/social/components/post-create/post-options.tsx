import { config } from "@/services/config";
import { forwardRef, useState, useImperativeHandle, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusIcon, XIcon } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { PictureIcon } from "@/components/ui/icons/picture";
import { PollIcon } from "@/components/ui/icons/poll";
import { EyeIcon } from "@/components/ui/icons/eye";
import { KeyBunchIcon } from "@/components/ui/icons/key-bunch";
import { IconButton } from "@/components/ui/icon-button";
import { FormField, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { defaultVariants } from "@/lib/framer";

export const PostOptions = forwardRef((_, ref) => {
  const [showPoll, setShowPoll] = useState<boolean>(false);
  const [showVisibility, setShowVisibility] = useState<boolean>(false);
  const context = useFormContext();
  const images = useWatch({ control: context.control, name: "images" }) || [];
  const { fields, append, remove } = useFieldArray({
    control: context.control,
    name: "poll",
  });

  useImperativeHandle(ref, () => ({
    reset: () => {
      context.setValue("images", [], { shouldDirty: true });
      setShowPoll(false);
      setShowVisibility(false);
    },
  }));

  const handleShowPoll = () => {
    if (fields.length === 0) {
      append({ value: "" });
    }

    setShowPoll(true);
  };

  const handleClosePoll = () => {
    remove();
    setShowPoll(false);
  };

  const handleShowVisibility = () => {
    setShowVisibility(true);
  };

  const handleCloseVisibility = () => {
    setShowVisibility(false);
  };

  const onFilesAdd = (newFiles: File[]) => {
    const currentImages = context.getValues("images") || [];
    context.setValue("images", [...currentImages, ...newFiles], { shouldDirty: true });
  };

  const handleFilesUpload = (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    const maxSize = config.content.uploads.maxSize;
    const validFiles: File[] = [];
    let hasError = false;

    for (const file of files) {
      if (file.size > maxSize) {
        toast.error(`File "${file.name}" size must be less than 2 MB.`);
        hasError = true;
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      onFilesAdd(validFiles);
    } else if (!hasError) {
      toast.error("No valid files selected.");
    }
  };

  return (
    <div className="flex w-full flex-col justify-start gap-2">
      {images.length > 0 && <ImageEditor />}
      {showPoll && (
        <PollEditor
          fields={fields}
          onAppend={(value) => append(value)}
          onRemove={(index) => remove(index)}
          onClose={handleClosePoll}
        />
      )}
      {showVisibility && <VisibilityEditor onClose={handleCloseVisibility} />}
      <div className="flex justify-start items-center gap-2">
        <IconButton
          type="button"
          className={`hover:bg-blue-700 ${images.length > 0 && "bg-blue-700"}`}
          onClick={() => {
            const fileInput = document.getElementById('file-upload');
            fileInput?.click();
          }}
        >
          <PictureIcon />
        </IconButton>
        <IconButton
          type="button"
          className={`hover:bg-orange-700 ${showPoll && "bg-orange-700"}`}
          onClick={() => {
            if (showPoll) {
              handleClosePoll();
            } else {
              handleShowPoll();
            }
          }}
        >
          <PollIcon />
        </IconButton>

        <IconButton
          type="button"
          className={`hover:bg-[#ab05a0] ${showVisibility && "bg-[#ab05a0]"}`}
          onClick={() => {
            if (showVisibility) {
              handleCloseVisibility();
            } else {
              handleShowVisibility();
            }
          }}
        >
          <EyeIcon />
        </IconButton>

        <input
          id="file-upload"
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/gif"
          multiple
          tabIndex={-1}
          className="hidden"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleFilesUpload(Array.from(e.target.files || []));
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
});

const PollEditor = ({
  fields,
  onAppend,
  onRemove,
  onClose,
}: {
  fields: any[];
  onAppend: (value: any) => void;
  onRemove: (index: number) => void;
  onClose: () => void;
}) => {
  return (
    <div className="flex flex-col w-full border-y py-2 gap-2">
      <div className="flex w-full flex-col gap-1">
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            name={`poll.${index}.value`}
            render={(props) => (
              <motion.div variants={defaultVariants.child}>
                <FormItem>
                  <Input
                    maxLength={config.content.social.maxLength}
                    placeholder="Choice..."
                    className="h-[40px]"
                    trailingIcon={
                      <IconButton
                        size="xs"
                        type="button"
                        onClick={() => {
                          if (fields.length === 1) {
                            onClose();
                          }

                          onRemove(index);
                        }}
                      >
                        <XIcon />
                      </IconButton>
                    }
                    {...props.field}
                  />
                </FormItem>
              </motion.div>
            )}
          />
        ))}
      </div>
      <Button
        size="sm"
        type="button"
        variant="ghost"
        onClick={() => onAppend({ value: "" })}
        className="w-[120px]"
        disabled={fields.length >= 4}
      >
        <PlusIcon />
        Add choice
      </Button>
    </div>
  );
};

const ImageEditor = () => {
  const context = useFormContext();
  const images = useWatch({ control: context.control, name: "images" }) || [];
  const [urls, setUrls] = useState<Map<File, string>>(new Map());

  useEffect(() => {
    const newUrls = new Map(urls);

    images.forEach((file) => {
      if (!newUrls.has(file)) {
        newUrls.set(file, URL.createObjectURL(file));
      }
    });

    for (const [file, url] of urls) {
      if (!images.includes(file)) {
        URL.revokeObjectURL(url);
        newUrls.delete(file);
      }
    }

    setUrls(newUrls);
  }, [images]);

  useEffect(() => {
    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    context.setValue("images", newImages, { shouldDirty: true });
  };

  return (
    <div className="flex w-full py-2">
      <div className="flex flex-wrap gap-2">
        {images.map((file, index) => (
          <div key={`${file.name}-${file.size}-${file.type}`} className="relative w-20 h-20">
            <img
              src={urls.get(file)}
              alt={`preview ${index}`}
              className="w-full h-full object-cover rounded"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute -top-1 -right-1 bg-gray-500 text-white rounded-full p-1 cursor-pointer hover:bg-gray-700 transition duration-200 ease-in-out"
            >
              <XIcon size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// OLD
/* const ImageEditor = () => {
  const context = useFormContext();

  return (
    <div className="flex w-full border-y py-2">
      <ImageUpload
        title="Choose a file or drag & drop it here."
        maxAllowedSize={config.content.uploads.maxSize}
        onChange={async (file) => {
          context.setValue("images", file ? [file] : []);
        }}
        onError={(error) => {
          toast.error(error);
        }}
      />
    </div>
  );
}; */

const VisibilityEditor = ({ onClose }: { onClose: () => void }) => {
  const id = useId();
  const context = useFormContext();

  return (
    <div className="flex items-center w-full border-y py-2 justify-between">
      <div className="flex items-center gap-2">
        <KeyBunchIcon />
        <Label className="text-paragraph-sm cursor-pointer" htmlFor={id}>
          Lock for key holders
        </Label>
      </div>
      <Switch.Root
        id={id}
        onCheckedChange={(checked) => context.setValue("behindKey", checked)}
      />
    </div>
  );
};
