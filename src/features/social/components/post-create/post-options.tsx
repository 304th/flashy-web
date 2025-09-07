import { config } from "@/services/config";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlusIcon, XIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { PictureIcon } from "@/components/ui/icons/picture";
import { PollIcon } from "@/components/ui/icons/poll";
import { IconButton } from "@/components/ui/icon-button";
import { FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { defaultVariants } from "@/lib/framer";

export const PostOptions = () => {
  const [showImages, setShowImages] = useState<boolean>(false);
  const [showPoll, setShowPoll] = useState<boolean>(false);
  const context = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: context.control,
    name: "poll",
  });

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
      </div>
    </div>
  );
};

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
  return <div className="flex w-full border-y py-2"></div>;
};
