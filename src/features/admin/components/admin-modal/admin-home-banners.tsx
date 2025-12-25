import { useState } from "react";
import { PlayIcon, PauseCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHomeBanners } from "@/features/admin/queries/use-home-banners";
import { useDeleteHomeBanner } from "@/features/admin/mutations/use-delete-home-banner";
import { useUpdateHomeBanner } from "@/features/admin/mutations/use-update-home-banner";
import { MiniPinIcon } from "@/components/ui/icons/mini-pin";
import { TrashIcon } from "@/components/ui/icons/trash";
import { useModals } from "@/hooks/use-modals";
import { timeAgo } from "@/lib/utils";

const EditIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const AdminHomeBanners = () => {
  const { openModal } = useModals();
  const [banners, bannersQuery] = useHomeBanners();
  const deleteBanner = useDeleteHomeBanner();
  const updateBanner = useUpdateHomeBanner();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isLoading = bannersQuery.isLoading;

  const handleCreate = () => {
    openModal(
      "CreateHomeBannerModal",
      {},
      {
        subModal: true,
      },
    );
  };

  const handleEdit = (banner: HomeBanner) => {
    openModal("CreateHomeBannerModal", { banner }, { subModal: true });
  };

  const handleDelete = async (id: string) => {
    await deleteBanner.mutateAsync(id);
    setDeletingId(null);
  };

  const handleTogglePin = async (banner: HomeBanner) => {
    await updateBanner.mutateAsync({
      id: banner._id,
      isPinned: !banner.isPinned,
    });
  };

  const handleToggleStatus = async (banner: HomeBanner) => {
    await updateBanner.mutateAsync({
      id: banner._id,
      status: banner.status === "active" ? "paused" : "active",
    });
  };

  return (
    <div className="flex flex-col w-full h-full p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Home Banners</h2>
        <Button variant="default" size="sm" onClick={handleCreate}>
          Create Banner
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-base-600">Loading...</p>
          </div>
        ) : !banners || banners.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-base-600">No home banners found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {banners.map((banner: HomeBanner) => (
              <div
                key={banner._id}
                className="flex flex-col gap-3 p-4 bg-base-200 rounded-lg border
                  border-base-400"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-24 h-16 rounded overflow-hidden shrink-0">
                      <img
                        src={banner.bannerImage}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">
                          {banner.callToActionTitle}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs rounded ${
                            banner.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                            }`}
                        >
                          {banner.status === "active" ? "Active" : "Paused"}
                        </span>
                        {banner.isPinned && (
                          <div className="scale-75">
                            <MiniPinIcon />
                          </div>
                        )}
                      </div>
                      <a
                        href={banner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline truncate"
                      >
                        {banner.link}
                      </a>
                      {banner.logoIcon && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-base-600">Logo:</span>
                          <img
                            src={banner.logoIcon}
                            alt="Logo"
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                      )}
                      <span className="text-xs text-base-600 mt-1">
                        Created {timeAgo(banner.createdAt, false)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 shrink-0">
                    <Button
                      variant={
                        banner.status !== "active" ? "default" : "destructive"
                      }
                      size="sm"
                      onClick={() => handleToggleStatus(banner)}
                      pending={updateBanner.isPending}
                      title={banner.status === "active" ? "Pause" : "Activate"}
                      className="aspect-square !p-0"
                    >
                      {banner.status === "active" ? (
                        <PauseCircleIcon />
                      ) : (
                        <PlayIcon />
                      )}
                    </Button>
                    <Button
                      variant={banner.isPinned ? "default" : "secondary"}
                      size="sm"
                      onClick={() => handleTogglePin(banner)}
                      pending={updateBanner.isPending}
                      title={banner.isPinned ? "Unpin" : "Pin"}
                      className="aspect-square !p-0"
                    >
                      <MiniPinIcon />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(banner)}
                      title="Edit"
                      className="aspect-square !p-0"
                    >
                      <EditIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingId(banner._id)}
                      title="Delete"
                      className="aspect-square !p-0"
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </div>

                {deletingId === banner._id && (
                  <div
                    className="flex flex-col gap-2 pt-3 border-t
                      border-base-400"
                  >
                    <p className="text-sm text-white">
                      Are you sure you want to delete this banner?
                    </p>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setDeletingId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(banner._id)}
                        pending={deleteBanner.isPending}
                      >
                        Confirm Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
