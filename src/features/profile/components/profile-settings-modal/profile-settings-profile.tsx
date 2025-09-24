import {ImageUpload} from "@/components/ui/image-upload";

export const ProfileSettingsProfile = () => {
  return <div className="flex flex-col gap-4 p-4 w-full grow">
    <ImageUpload initialPreview='/images/channel-placeholder.png' className="w-full" onChange={() => {}} />
  </div>
}

