import { NotFound } from "@/components/ui/not-found";

export const StreamingBillboard = () => {
  return (
    <div
      className="flex w-full bg-base-200
        inset-shadow-[0_0_8px_0_rgba(0,0,0,0.1)] inset-shadow-base-300 h-[300px]
        rounded-md"
    >
      <NotFound fullWidth>No streaming events yet.</NotFound>
    </div>
  );
};
