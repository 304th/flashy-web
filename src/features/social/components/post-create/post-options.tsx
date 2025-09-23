import { config } from "@/services/config";
import { forwardRef, useState, useImperativeHandle, useId } from "react";
import { motion } from "framer-motion";
import { PlusIcon, XIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
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
import { ImageUpload } from "@/components/ui/image-upload";
import { defaultVariants } from "@/lib/framer";

export const PostOptions = forwardRef((_, ref) => {
  const [showImages, setShowImages] = useState<boolean>(false);
  const [showPoll, setShowPoll] = useState<boolean>(false);
  const [showVisibility, setShowVisibility] = useState<boolean>(false);
  const context = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: context.control,
    name: "poll",
  });

  useImperativeHandle(ref, () => ({
    reset: () => {
      setShowImages(false);
      setShowPoll(false);
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

  return (
    <div className="flex w-full flex-col justify-start gap-2">
      {showImages && <ImageEditor />}
      {showPoll && (
        <PollEditor
          fields={fields}
          onAppend={(value) => append(value)}
          onRemove={(index) => remove(index)}
          onClose={handleClosePoll}
        />
      )}
      {showVisibility && <VisibilityEditor onClose={handleClosePoll} />}
      <div className="flex justify-start items-center gap-2">
        <IconButton
          type="button"
          className={`hover:bg-blue-700 ${showImages && "bg-blue-700"}`}
          onClick={() => {
            setShowImages((state) => !state);
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
            setShowVisibility((state) => !state);
          }}
        >
          <EyeIcon />
        </IconButton>
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

  return (
    <div className="flex w-full border-y py-2">
      <ImageUpload
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
};

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
