import { ReactNode, useMemo, useState } from "react";
import { PlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CreateVideoIcon } from "@/components/ui/icons/create-video";
import { CreateSocialIcon } from "@/components/ui/icons/create-social";
import { useModals } from "@/hooks/use-modals";
import { brightenColor } from "@/lib/css";
import {useMe} from "@/features/auth/queries/use-me";

export const CreateDropdown = () => {
  const { data: me } = useMe();
  const [open, setOpen] = useState(false);
  const { openModal } = useModals();

  if (!me) {
    return null;
  }

  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      {open && <div className="absolute w-[35px] h-8 right-0 bottom-[-8px]" />}
      <DropdownMenu modal={false} open={open}>
        <DropdownMenuTrigger asChild>
          <Button
            className="!w-fit"
            onMouseEnter={() => setOpen(true)}
          >
            <PlusIcon />
            Create
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[300px] bg-base-300 border-base-400 p-0"
          align="end"
        >
          <div className="flex h-fit bg-base-300">
            <div className="flex flex-col w-full">
              <div className="flex items-center p-3">
                <p className="text-white font-bold">Create</p>
              </div>
              <div className="flex flex-col w-full">
                <CreateOption
                  key="video"
                  label="Video"
                  color="#08331a"
                  icon={<CreateVideoIcon />}
                  onClick={() => {
                    openModal("VideoCreateModal");
                  }}
                />
                <CreateOption
                  key="social"
                  label="Social"
                  color="#402d09"
                  icon={<CreateSocialIcon />}
                  onClick={() => {
                    openModal("SocialCreateModal");
                  }}
                />
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="absolute w-[80px] h-6 right-0" />
    </div>
  );
};

const CreateOption = ({
  label,
  icon,
  color,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  color: string;
  onClick?: () => void;
}) => {
  const highlightColor = useMemo(() => brightenColor(color, 40), [color]);

  return (
    <div
      key={label}
      className="group relative flex flex-col w-full cursor-pointer
        overflow-hidden"
      onClick={onClick}
    >
      <div
        className="flex items-center justify-between w-full p-3"
        style={{ background: color }}
      >
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full z-0 transition
              group-hover:scale-110"
            style={{ background: highlightColor }}
          />
          <div className="relative z-1">{icon}</div>
        </div>
        <p
          className="text-lg text-white transition font-bold
            group-hover:translate-x-[-4px]"
        >
          {label}
        </p>
        <div
          className="absolute w-[2px] h-full right-[-4px] transition
            group-hover:translate-x-[-4px]"
          style={{ background: highlightColor }}
        />
      </div>
    </div>
  );
};
